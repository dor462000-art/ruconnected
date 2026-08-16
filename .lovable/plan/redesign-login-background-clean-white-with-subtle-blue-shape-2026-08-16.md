# Redesign login background: clean white with subtle blue shapes

## Context
The current login screen renders `src/assets/login-bg.webp` (the student/skyline illustration) through `BackgroundArtwork.tsx`. The user's Figma frame has **no illustration** — it's a clean white page. The user wants: no student illustration, but **subtle blue organic blobs/shapes** for depth (not flat white), and to **keep #3461D6** as the primary blue. The real UI components (logo, headline, email input, Join button, lock pill) and the existing OTP flow stay untouched.

## Current state (verified)
- `src/components/social/login/BackgroundArtwork.tsx` imports and renders `@/assets/login-bg.webp` as a full-bleed `object-cover object-bottom` image, plus a readability gradient.
- `src/components/social/login/LoginScreen.tsx` renders `<BackgroundArtwork />` behind the real UI components.
- `login-bg.webp` is referenced **only** in `BackgroundArtwork.tsx` (confirmed via ripgrep).
- Primary token is already `#3461D6` — no color change needed.

## Changes

### 1. Rewrite `BackgroundArtwork.tsx` → CSS/SVG blobs (no image)
Replace the `<img>` with a layer of subtle blue organic shapes:
- Base: pure white (`bg-background`).
- 2–3 soft blue organic blobs using SVG `<ellipse>`/`<path>` or blurred radial gradients in `#3461D6` at low opacity (e.g. 0.06–0.14), positioned near the **top** corners and one faint accent lower, so they never crowd the bottom UI.
- Subtle white→transparent gradient wash to keep the headline/input area crisp.
- Keep `absolute inset-0 -z-10 pointer-events-none select-none overflow-hidden` and responsive behavior: blobs anchored so they stay meaningful on 9:16 mobile and reframe gracefully on wider/desktop ratios.
- Remove the `bgImage` import.

### 2. Delete unused asset
- `rm src/assets/login-bg.webp` (no longer referenced anywhere).

### 3. No changes to
- `LoginScreen.tsx`, `EmailInput.tsx`, `JoinNetworkButton.tsx`, `Logo.tsx`, `AuthView.tsx` (OTP flow), primary color token.

## Verification
- Build/typecheck passes.
- Preview the login route at 375px (mobile 9:16), 768px, and 1280px: confirm clean white base, subtle blue shapes at top, no student illustration, UI components fully readable and interactive.
- Confirm `login-bg.webp` is gone and no dangling import remains.
