"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const handler = require("../api/intake");
const origin = "https://avodah-business.vercel.app";
const valid = {FullName:"QA Test", EmailAddress:"QA@example.com", PhoneNumber:"804-555-0100", select_state:"Virginia", Message:"Non-confidential test", agreetocontact:"1"};
let sequence = 0;
function request(body = valid, overrides = {}) {
  return {method:"POST", headers:{origin, "content-type":"application/json", "x-forwarded-for":`192.0.2.${++sequence}`}, body, ...overrides};
}
function response() {
  return {headers:{}, setHeader(k,v){this.headers[k]=v;}, end(body){this.body=JSON.parse(body);}};
}
function setup(t) {
  const env = {...process.env};
  const fetch = global.fetch;
  Object.assign(process.env, {INTAKE_ENABLED:"true", RESEND_API_KEY:"test-only", INTAKE_FROM:"Avodah Business <test@example.com>", INTAKE_ALLOWED_ORIGINS:origin});
  t.after(()=>{process.env=env;global.fetch=fetch;});
}
test("validates required fields and consent", () => {
  assert.equal(handler.validatePayload({}).errors.length, 6);
  assert.deepEqual(handler.validatePayload(valid).errors, []);
  assert.equal(handler.validatePayload(valid).payload.email, "qa@example.com");
});
test("escapes email HTML and labels the Business site", () => {
  const {payload} = handler.validatePayload({...valid, Message:"<script>bad</script>"});
  const html = handler.emailMarkup(payload, origin);
  assert.match(html,/Avodah Business/);
  assert.doesNotMatch(html,/<script>/);
  assert.match(html,/&lt;script&gt;/);
});
test("disabled configuration cannot send", async t => {
  setup(t); delete process.env.INTAKE_ENABLED;
  global.fetch=()=>assert.fail("must not send");
  const res=response();await handler(request(),res);assert.equal(res.statusCode,503);
});
test("rejects unknown or absent POST origins, wrong methods, and wrong content types", async t => {
  setup(t);global.fetch=()=>assert.fail("must not send");
  for (const [req, code] of [[request(valid,{headers:{origin:"https://attacker.example"}}),403],[request(valid,{headers:{referer:origin}}),403],[request(valid,{method:"DELETE"}),405],[request(valid,{headers:{origin,"content-type":"text/plain"}}),415]]) {
    const res=response();await handler(req,res);assert.equal(res.statusCode,code);
  }
});
test("health check accepts same-origin browser referer but not other sites",async t=>{
  setup(t);
  for(const [referer,enabled] of [[origin+"/contact/",true],["https://other.example/",false]]) {
    const res=response();await handler(request(undefined,{method:"GET",headers:{referer}}),res);assert.equal(res.body.enabled,enabled);
  }
});
test("rejects malformed, oversized, null, and array bodies",async t=>{
  setup(t);global.fetch=()=>assert.fail("must not send");
  for(const [body,code] of [["{",400],[null,400],[[],400],[JSON.stringify({Message:"x".repeat(13000)}),413],[{Message:"x".repeat(13000)},413]]) {
    const res=response();await handler(request(body),res);assert.equal(res.statusCode,code);
  }
});
test("honeypot submission is discarded",async t=>{
  setup(t);global.fetch=()=>assert.fail("must not send");
  const res=response();await handler(request({...valid,website:"spam"}),res);assert.deepEqual(res.body,{ok:true});
});
test("sends only to approved mailbox with correct reply-to and site label",async t=>{
  setup(t);let email;
  global.fetch=async(url,options)=>{assert.equal(url,"https://api.resend.com/emails");email=JSON.parse(options.body);return {ok:true,json:async()=>({id:"mock-receipt"})};};
  const res=response();await handler(request({...valid,to:"attacker@example.com"}),res);
  assert.equal(res.statusCode,200);assert.deepEqual(email.to,["website@avodahlegal.com"]);
  assert.equal(email.reply_to,"qa@example.com");assert.match(email.subject,/^\[Avodah Business website\]/);
});
test("provider rejection, network error, and missing receipt never claim success",async t=>{
  setup(t);
  for(const mock of [async()=>({ok:false,status:403}),async()=>{throw new Error("private data");},async()=>({ok:true,json:async()=>({})})]) {
    global.fetch=mock;const res=response();await handler(request(),res);assert.equal(res.statusCode,502);assert.equal(res.body.ok,false);
  }
});
test("limits repeated submissions from the same address",async t=>{
  setup(t);global.fetch=async()=>({ok:true,json:async()=>({id:"receipt"})});
  const req=request();
  for(let n=0;n<6;n++){const res=response();await handler(req,res);assert.equal(res.statusCode,n<5?200:429);}
});
