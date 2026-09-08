# Branded RUconnected verification emails with a 6-digit code

## Goal

Students signing up get an email from RUconnected containing only a 6-digit code — no link at all. Entering the code in the app finishes verification, so the loop back to the sign-in screen disappears.

## Why the link fails today

The app asks students to type a code, but the email currently sent is the standard link-style verification message from the default sender. Opening that link in a new browser tab has no connection to the sign-up screen the student started on, so it lands back at sign in and the process repeats.

## Steps

1. **Set up your sender domain**
   You pick the domain (for example a mail subdomain of ruconnected) in the email setup dialog, add the records it shows at your registrar, and verification runs automatically. Until it verifies, students keep receiving the current default emails.

2. **Create the RUconnected email designs**
   Six account emails are generated (sign-up confirmation, sign-in code, password reset, invite, email change, re-confirmation), then styled to match the app: white background, RUconnected blue #3461D6, the app's headings and rounded buttons, and the logo at the top if one is available.

3. **Make every email code-only**
   The sign-up, sign-in and password-reset emails show the 6-digit code in large spaced digits with a short line of copy ("Enter this code in RUconnected. It expires in 10 minutes.") and no clickable verification link, so there is nothing invalid to click.

4. **Turn it on and check**
   The email handler is deployed, and once your domain's records verify, emails start arriving from RUconnected. Progress is visible in the backend's Emails section. If code-only emails need the built-in template adjusted too, that is set at the same time so no link version can be sent.

5. **Verify end to end**
   Sign up with a Reichman test address, confirm the email arrives from your domain with a code and no link, enter it, set a password, and land in the profile steps.

## Notes

- Nothing changes in the sign-up screens themselves — they already expect a 6-digit code.
- Domain records can take a while to propagate (up to 72 hours, usually much less).
- Email sending stays within your existing plan allowance for normal student-signup volume.
