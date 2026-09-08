# Branded RUconnected Auth Emails: Lovable Email Domain vs. Resend

## Current state
- No email domain configured for this project
- No connections linked yet
- Resend is available as a connector (`resend`, gateway-backed)
- The app already has a Supabase OTP flow expecting a 6-digit code with 10-minute expiry and 60-second resend cooldown
- Goal: branded RUconnected emails (white, light blue, #3461D6, logo) showing only a 6-digit code — no clickable links
- **You are on the Free plan** — this is the deciding factor (see below)

Both approaches require DNS records on a subdomain of ruconnected.com. They cannot share the same subdomain.

## Plan requirement (deciding factor)
- **Option A (Lovable Email Domain):** Requires a paid plan (Pro or above). Not available on Free. Includes 50,000 transactional emails/month.
- **Option B (Resend):** Works on the Free plan. Resend's free tier gives 3,000 emails/month (100/day) — enough for a student network. No Lovable plan upgrade needed.

---

## Option A — Lovable Email Domain (managed auth emails)

### How it works
1. Set up a sender domain (e.g. `notify.ruconnected.com`) via the email setup dialog — Lovable delegates the subdomain to its own nameservers and manages SPF/DKIM/MX automatically.
2. Scaffold branded auth email templates — creates 6 React Email templates (signup, magic-link, recovery, invite, email-change, reauthentication) plus the `auth-email-hook` edge function.
3. Apply RUconnected branding (colors, logo, copy) to the templates.
4. Deploy the `auth-email-hook` edge function.
5. When a user signs up, Supabase generates the OTP code and fires the hook. The hook enqueues the rendered email to Lovable's queue. A background processor sends it through Lovable's email infrastructure with retries, rate-limiting, and a dead-letter queue — all managed.

### What you get
- Branded emails from `notify.ruconnected.com` with RUconnected logo and colors
- Supabase's existing OTP flow stays untouched (code generation, expiry, resend cooldown — all unchanged)
- Both auth emails AND future app emails (notifications, contact forms) use the same domain and infrastructure
- No external secrets or API keys to manage — `LOVABLE_API_KEY` is auto-provisioned
- Queue, retry, rate-limiting, bounce/complaint suppression — all handled

### What you do
- Add the NS records Lovable shows you at your DNS provider (one-time)
- Wait for DNS propagation (usually minutes to hours, up to 72h)
- Approve the template branding (I apply it automatically)

### Cost
- Included in the Lovable Cloud plan for normal student-network volume

### DNS
- NS delegation of `notify.ruconnected.com` to Lovable nameservers
- Lovable manages SPF/DKIM/MX inside the delegated zone — you don't touch those

---

## Option B — Resend (third-party email API)

### How it works
1. Connect the Resend connector — creates a `RESEND_API_KEY` env var linked to the project.
2. Verify a sending domain in Resend (e.g. `mail.ruconnected.com`) — you add SPF, DKIM, and MX records at your DNS provider yourself. Resend verifies them.
3. For auth emails, there are two sub-approaches:

#### B1 — Modify the auth-email-hook to send via Resend
- Scaffold the auth templates and hook as normal (for the React Email HTML rendering)
- Replace the `enqueue_email` call in the hook with a direct call to the Resend gateway (`https://connector-gateway.lovable.dev/resend/emails`)
- The hook receives the OTP from Supabase, renders the template, sends via Resend

**Tradeoffs:**
- You lose Lovable's managed queue, retry, rate-limiting, and bounce suppression — you handle errors and retries yourself in the hook
- Goes against the managed hook contract; future Lovable updates to the hook could conflict with your custom version
- The hook must still be named `auth-email-hook` (system requirement)
- Medium effort: modify one file + handle error/success responses

#### B2 — Fully custom OTP flow (bypasses Supabase auth email entirely)
- Build a new edge function that generates a 6-digit code, stores it in a DB table with 10-minute expiry, and sends it via Resend
- Build a second edge function that verifies the code against the DB
- After verification, create/sign the Supabase session programmatically
- Disable Supabase's built-in email sending

**Tradeoffs:**
- Full control over the entire flow (code generation, storage, sending, verification)
- Most work: two edge functions, a DB table, session creation logic, rate limiting, error handling
- You reimplement what Supabase already does for free (OTP generation, expiry, resend cooldown)
- More surface area for bugs and security issues

### What you get
- Branded emails from `mail.ruconnected.com` via Resend's API
- Direct control over the sending API (Resend dashboard shows delivery stats, bounces, etc.)
- Works for both auth and app emails (via edge functions calling the gateway)

### What you do
- Connect the Resend connector (in-app card)
- Add SPF, DKIM, and MX records at your DNS provider for `mail.ruconnected.com` (Resend shows the exact values)
- Wait for Resend to verify the domain
- Maintain custom edge function code (B1: one file; B2: full flow)

### Cost
- Resend free tier: 3,000 emails/month, 100/day — enough for a student network
- Paid plans start at $20/mo for higher volume

### DNS
- SPF, DKIM, and MX records on `mail.ruconnected.com` at your DNS provider
- Must be a different subdomain than any Lovable email domain (they can't share)

---

## Recommendation

**Option A (Lovable Email Domain)** is the better fit for this project:
- The OTP flow is already built and working — branding is the only gap
- No custom code to write or maintain
- Managed queue, retries, rate-limiting, and bounce handling included
- Same domain handles both auth and future app emails
- Free within the Lovable Cloud plan
- Less moving parts = fewer bugs

**Option B (Resend)** makes sense if you specifically want:
- Resend's dashboard for delivery analytics
- Direct control over the email API outside Lovable's infrastructure
- A separate sending subdomain from Lovable's email domain

If you choose Resend, **B1** (modify the hook) is the lower-effort path; **B2** (custom OTP) is only worth it if you need full control over the verification lifecycle.

---

## If you choose Option A — implementation steps
1. Open the email setup dialog and select `notify.ruconnected.com` (or your preferred subdomain)
2. Add the NS records shown at your DNS provider
3. I scaffold branded auth templates and apply RUconnected styling (white/light blue/#3461D6, logo, code-only — no links)
4. Deploy the `auth-email-hook` edge function
5. Emails activate automatically once DNS verifies — monitor in Cloud → Emails

## If you choose Option B1 — implementation steps
1. Connect the Resend connector (in-app card)
2. Verify `mail.ruconnected.com` in Resend (add SPF/DKIM/MX at your DNS provider)
3. Scaffold auth templates for the HTML rendering
4. I modify the `auth-email-hook` to send via the Resend gateway instead of Lovable's queue
5. Add error handling and response surfacing in the hook
6. Deploy the modified `auth-email-hook`
7. Test end-to-end with a @post.runi.ac.il address

## If you choose Option B2 — implementation steps
1. Connect the Resend connector
2. Verify `mail.ruconnected.com` in Resend
3. Create a `otp_codes` table (code, email, expiry, used) with RLS
4. Build `send-otp` edge function: generate code, store, send via Resend
5. Build `verify-otp` edge function: check code, create Supabase session
6. Update the app's auth flow to call these functions instead of `signInWithOtp`
7. Disable Supabase's built-in email sending for OTP
8. Handle rate limiting, resend cooldown, and error states in code
9. Test end-to-end
