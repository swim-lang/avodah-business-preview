# Business inquiry and phone activation

Prepared October 27, 2026. This document does not establish that delivery or phone routing is live; verify the gates below before changing status.

## Current verification status

October 27: the existing Anchovies Vercel project was confirmed through the authenticated CLI. It has no environment variables configured. The new endpoint therefore remains disabled. The existing Avodah CallRail login was located in 1Password, but the signed-out service session still needs authentication. No Resend credential was found by item title in the available vaults. Existing agency workspace access and a dedicated Business tracking number are not yet verified. No new account, paid number, DNS change, or test email was created.

## Inquiry endpoint

Use Anchovies' existing Andy-owned Resend workspace, not a new account. Source credentials through 1Password. Keep keys in sensitive Vercel settings only, never source, build output, logs or local environment files.

Runtime configuration for the existing `avodah-business` project:

- `RESEND_API_KEY`: approved sending-only credential for the verified sender.
- `INTAKE_FROM`: approved Business display name and a verified sending-domain address.
- `INTAKE_ALLOWED_ORIGINS`: exact HTTPS origins. For the current preview use only `https://avodah-business.vercel.app`. Add the final approved production origin at cutover, not wildcard preview URLs.
- `INTAKE_ENABLED`: set to `true` only after the preceding configuration is complete. Default is disabled.

The recipient is fixed server-side to `website@avodahlegal.com`. Subjects begin `[Avodah Business website]`; the body identifies the Business website and the actual submitting origin. Visitor email is used only as reply-to. No submission is written to application storage or logs. Resend and Avodah's mailbox still process and retain emails under their own policies; confirm retention with Avodah.

The handler validates required fields and consent, rejects unexpected origins and content types, caps body size, escapes HTML, discards honeypots, and provides a best-effort per-instance throttle. Add host-level distributed rate limiting or a separately approved bot-verification service before production if needed; instance-local throttling is not comprehensive abuse protection.

## Verification gates

- Authenticated access to the existing shared Resend workspace.
- Sender domain verified, with DNS changes separately approved if needed.
- Sensitive hosting credential configured and preview redeployed.
- `/api/intake` returns enabled for the allowed origin and disabled elsewhere.
- Non-confidential labeled test reaches the shared mailbox; a successful provider response alone does not prove inbox delivery.
- Errors preserve entered fields and never show a success message.
- Confirm source and API implementation are not served as static assets.
- Keep all preview routes `noindex, nofollow`; no domain cutover in this revision.

## CallRail

The current Business display number is `(804) 234-3183`. Do not assume it is a tracking number or replace it with Employment/Traffic numbers. Inspect the existing Avodah CallRail account and confirm the dedicated Business company/tracker, destination, intake owner, and recording configuration. Any new paid number requires Sean's approval. Verify end-to-end routing with an outside-phone test before declaring calls ready.
