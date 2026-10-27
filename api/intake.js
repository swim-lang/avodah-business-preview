"use strict";

const crypto = require("node:crypto");
const MAX_BODY_BYTES = 12000;
// Best-effort instance-local throttle, not a substitute for host-level abuse controls.
const attempts = new Map();
const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;
const RECIPIENT = "website@avodahlegal.com";

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function clean(value, max) {
  return typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function validatePayload(input) {
  const payload = {
    name: clean(input.FullName, 80),
    email: clean(input.EmailAddress, 160).toLowerCase(),
    phone: clean(input.PhoneNumber, 50),
    state: clean(input.select_state, 30),
    message: clean(input.Message, 400),
    website: clean(input.website, 200),
    consent: input.agreetocontact === "1" || input.agreetocontact === true,
  };
  const errors = [];
  if (!payload.name) errors.push("Please enter your name.");
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(payload.email)) errors.push("Please enter a valid email address.");
  if (payload.phone.replace(/\D/g, "").length < 7) errors.push("Please enter a valid phone number.");
  if (!["Virginia", "Other"].includes(payload.state)) errors.push("Please select your state.");
  if (!payload.message) errors.push("Please enter a brief message.");
  if (!payload.consent) errors.push("Please confirm the contact notice.");
  return {payload, errors};
}

function allowedOrigins() {
  return String(process.env.INTAKE_ALLOWED_ORIGINS || "").split(",").map(x => x.trim()).filter(x => /^https:\/\/[^/]+$/.test(x));
}
function isConfigured() {
  return Boolean(process.env.INTAKE_ENABLED === "true" && process.env.RESEND_API_KEY && process.env.INTAKE_FROM && allowedOrigins().length);
}
function isAllowedOrigin(origin) { return allowedOrigins().includes(origin); }

function emailMarkup(payload, origin) {
  const rows = [["Website", "Avodah Business"], ["Submitted from", origin + "/contact/"], ["Name", payload.name], ["Email", payload.email], ["Phone", payload.phone], ["State", payload.state], ["Message", payload.message]];
  return `<h1>New Avodah Business website inquiry</h1><table>${rows.map(([k,v]) => `<tr><th align="left">${k}</th><td>${escapeHtml(v)}</td></tr>`).join("")}</table><p>The visitor agreed to be contacted and was told not to send confidential information. Submission does not create an attorney-client relationship.</p>`;
}

async function parseBody(req) {
  if (req.body !== undefined) {
    const raw = typeof req.body === "string" ? req.body : Buffer.isBuffer(req.body) ? req.body.toString() : JSON.stringify(req.body);
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) throw new RangeError("Body size");
    return JSON.parse(raw);
  }
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) throw new RangeError("Body size");
  }
  return JSON.parse(body);
}

async function handler(req, res) {
  let origin = String(req.headers.origin || "");
  if (!origin && req.method === "GET" && req.headers.referer) {
    try { origin = new URL(req.headers.referer).origin; } catch (_) { /* fail closed */ }
  }
  if (req.method === "GET") return json(res, 200, {enabled: isConfigured() && isAllowedOrigin(origin)});
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return json(res, 405, {ok:false, message:"Method not allowed."});
  }
  if (!isConfigured()) return json(res, 503, {ok:false, message:"Online inquiries are not available yet. Please call Avodah directly."});
  if (!isAllowedOrigin(origin)) return json(res, 403, {ok:false, message:"This form is not authorized from this website."});
  if (!/^application\/json(?:\s*;|$)/i.test(String(req.headers["content-type"] || ""))) return json(res, 415, {ok:false, message:"Unsupported form format."});
  let input;
  try {
    input = await parseBody(req);
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid body");
  } catch (error) {
    return json(res, error instanceof RangeError ? 413 : 400, {ok:false, message:"Please review the form and try again."});
  }
  const {payload, errors} = validatePayload(input);
  if (payload.website) return json(res, 200, {ok:true});
  if (errors.length) return json(res, 400, {ok:false, message:errors[0]});
  const now = Date.now();
  for (const [key, times] of attempts) if (times.every(t => now - t >= WINDOW)) attempts.delete(key);
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  const key = crypto.createHash("sha256").update(ip).digest("hex");
  const recent = (attempts.get(key) || []).filter(t => now - t < WINDOW);
  if (recent.length >= LIMIT || attempts.size > 5000) return json(res, 429, {ok:false, message:"Please wait a few minutes before trying again."});
  attempts.set(key, [...recent, now]);
  try {
    const result = await fetch("https://api.resend.com/emails", {
      method:"POST",
      headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`, "Content-Type":"application/json", "Idempotency-Key":`avodah-business-${crypto.randomUUID()}`},
      signal: AbortSignal.timeout(15000),
      body:JSON.stringify({from:process.env.INTAKE_FROM, to:[RECIPIENT], reply_to:payload.email, subject:`[Avodah Business website] Inquiry from ${payload.name}`, html:emailMarkup(payload, origin)}),
    });
    if (!result.ok) {
      console.error("Business inquiry provider rejected send", {status:result.status});
      return json(res, 502, {ok:false, message:"Your inquiry could not be sent. Please call Avodah directly."});
    }
    const receipt = await result.json();
    if (!receipt.id) throw new Error("Missing provider receipt");
    return json(res, 200, {ok:true});
  } catch (_) {
    console.error("Business inquiry delivery unavailable");
    return json(res, 502, {ok:false, message:"We could not confirm delivery. Please call Avodah directly before trying again."});
  }
}

module.exports = handler;
module.exports.validatePayload = validatePayload;
module.exports.emailMarkup = emailMarkup;
module.exports.isConfigured = isConfigured;
module.exports.isAllowedOrigin = isAllowedOrigin;
