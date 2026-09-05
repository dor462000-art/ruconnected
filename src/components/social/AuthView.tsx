import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Lock, Eye, EyeOff, MailCheck } from 'lucide-react';

interface AuthViewProps {
  /** New account finished verification + password — go to onboarding */
  onVerified: (email: string) => void;
  /** Existing account signed in — restore their profile */
  onSignedIn: (email: string) => void;
}

const ALLOWED_DOMAINS = ['runi.ac.il', 'post.runi.ac.il'];
const RESEND_COOLDOWN = 60;
const OTP_LENGTH = 6;

type Step =
  | 'form'
  | 'verify'
  | 'setpassword'
  | 'forgot'
  | 'forgot_verify'
  | 'forgot_setpassword';

const PasswordInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  autoComplete?: string;
}> = ({ value, onChange, disabled, placeholder = 'Password', autoComplete = 'current-password' }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex h-16 w-full rounded-2xl border border-border/60 bg-background px-4 pr-12 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
};

const OtpInput: React.FC<{
  value: string[];
  onChange: (val: string[]) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const focus = (i: number) => refs.current[i]?.focus();

  const handleChange = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (digit && i < OTP_LENGTH - 1) focus(i + 1);
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (value[i]) {
        const next = [...value];
        next[i] = '';
        onChange(next);
      } else if (i > 0) focus(i - 1);
    } else if (e.key === 'ArrowLeft' && i > 0) focus(i - 1);
    else if (e.key === 'ArrowRight' && i < OTP_LENGTH - 1) focus(i + 1);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
    const next = Array(OTP_LENGTH).fill('');
    digits.forEach((d, i) => { next[i] = d; });
    onChange(next);
    focus(Math.min(digits.length, OTP_LENGTH - 1));
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          autoComplete="one-time-code"
          className="w-11 h-14 text-center text-lg font-bold border-2 rounded-xl bg-background focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          style={{ borderColor: value[i] ? 'hsl(var(--primary))' : 'hsl(var(--border))' }}
        />
      ))}
    </div>
  );
};

export const AuthView: React.FC<AuthViewProps> = ({ onVerified, onSignedIn }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const switchMode = (m: 'signin' | 'signup') => {
    setMode(m);
    setError('');
    setPassword('');
    setConfirmPassword('');
    setStep('form');
  };

  const validateEmail = (lower: string) => {
    if (!lower) { setError('Please enter your student email.'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower)) {
      setError("That doesn't look like a valid email.");
      return false;
    }
    const domain = lower.split('@')[1];
    if (!ALLOWED_DOMAINS.includes(domain)) {
      setError('Only Reichman students can join — use your @runi.ac.il or @post.runi.ac.il email.');
      return false;
    }
    return true;
  };

  const resetOtp = () => setDigits(Array(OTP_LENGTH).fill(''));

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const lower = email.toLowerCase().trim();
    if (!validateEmail(lower)) return;
    if (!password) { setError('Please enter your password.'); return; }

    setIsSubmitting(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email: lower, password });
    setIsSubmitting(false);
    if (err) {
      setError(err.message.includes('Invalid') ? 'Incorrect email or password.' : err.message);
      return;
    }
    onSignedIn(lower);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const lower = email.toLowerCase().trim();
    if (!validateEmail(lower)) return;

    setIsSubmitting(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: lower,
      options: { shouldCreateUser: true },
    });
    setIsSubmitting(false);
    if (err) { setError(err.message || 'Could not send code. Please try again.'); return; }
    setEmail(lower);
    setCooldown(RESEND_COOLDOWN);
    resetOtp();
    setStep('verify');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const token = digits.join('');
    if (token.length < OTP_LENGTH) { setError(`Please enter all ${OTP_LENGTH} digits.`); return; }

    setIsSubmitting(true);
    const { error: err } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    setIsSubmitting(false);
    if (err) { setError(err.message || 'Incorrect or expired code. Please try again.'); resetOtp(); return; }
    setPassword(''); setConfirmPassword(''); setError('');
    setStep('setpassword');
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }

    setIsSubmitting(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);
    if (err) { setError(err.message || 'Could not set password. Please try again.'); return; }
    onVerified(email);
  };

  const handleResend = async () => {
    if (cooldown > 0 || isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    const { error: err } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    setIsSubmitting(false);
    if (err) { setError(err.message || 'Could not resend code.'); return; }
    setCooldown(RESEND_COOLDOWN);
    resetOtp();
  };

  const handleForgotSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const lower = email.toLowerCase().trim();
    if (!validateEmail(lower)) return;

    setIsSubmitting(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: lower,
      options: { shouldCreateUser: false },
    });
    setIsSubmitting(false);
    if (err) {
      const m = err.message.toLowerCase();
      setError(
        m.includes('not found') || m.includes('no user')
          ? 'No account found with that email. Please sign up first.'
          : err.message || 'Could not send reset code. Please try again.'
      );
      return;
    }
    setEmail(lower);
    setCooldown(RESEND_COOLDOWN);
    resetOtp();
    setStep('forgot_verify');
  };

  const handleForgotVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const token = digits.join('');
    if (token.length < OTP_LENGTH) { setError(`Please enter all ${OTP_LENGTH} digits.`); return; }

    setIsSubmitting(true);
    const { error: err } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    setIsSubmitting(false);
    if (err) { setError(err.message || 'Incorrect or expired code. Please try again.'); resetOtp(); return; }
    setPassword(''); setConfirmPassword(''); setError('');
    setStep('forgot_setpassword');
  };

  const handleForgotSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }

    setIsSubmitting(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);
    if (err) { setError(err.message || 'Could not update password. Please try again.'); return; }
    onSignedIn(email);
  };

  const handleForgotResend = async () => {
    if (cooldown > 0 || isSubmitting) return;
    setError('');
    setIsSubmitting(true);
    const { error: err } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    setIsSubmitting(false);
    if (err) { setError(err.message || 'Could not resend code.'); return; }
    setCooldown(RESEND_COOLDOWN);
    resetOtp();
  };

  if (step === 'setpassword') {
    return (
      <div className="h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm flex flex-col items-center text-center">
          <Logo className="w-20 h-20 mb-6" />
          <h1 className="text-2xl font-extrabold mb-2">Create a password</h1>
          <p className="text-muted-foreground text-sm mb-8">
            You're almost in! Set a password so you can sign in next time.
          </p>
          <form onSubmit={handleSetPassword} className="w-full space-y-3">
            <PasswordInput
              value={password}
              onChange={(v) => { setPassword(v); if (error) setError(''); }}
              disabled={isSubmitting}
              placeholder="Choose a password (6+ characters)"
              autoComplete="new-password"
            />
            <PasswordInput
              value={confirmPassword}
              onChange={(v) => { setConfirmPassword(v); if (error) setError(''); }}
              disabled={isSubmitting}
              placeholder="Confirm password"
              autoComplete="new-password"
            />
            {error && <p className="text-destructive text-sm text-left px-1">{error}</p>}
            <Button
              type="submit"
              className="w-full h-14 text-base rounded-2xl font-bold"
              disabled={isSubmitting || password.length < 6 || !confirmPassword}
            >
              {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : 'Continue →'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'verify' || step === 'forgot_verify') {
    const isForgot = step === 'forgot_verify';
    return (
      <div className="h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm flex flex-col items-center text-center">
          <Logo className="w-20 h-20 mb-6" />
          <h1 className="text-2xl font-extrabold mb-2">Check your email</h1>
          <p className="text-muted-foreground text-sm mb-1">We sent a {OTP_LENGTH}-digit code to</p>
          <p className="font-semibold text-sm mb-8">{email}</p>
          <form onSubmit={isForgot ? handleForgotVerify : handleVerify} className="w-full space-y-5">
            <OtpInput value={digits} onChange={setDigits} disabled={isSubmitting} />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full h-14 text-base rounded-2xl font-bold"
              disabled={isSubmitting || digits.join('').length < OTP_LENGTH}
            >
              {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Verifying…</> : 'Verify'}
            </Button>
          </form>
          <div className="flex items-center justify-between w-full mt-5 text-sm">
            <button
              type="button"
              onClick={() => { setStep(isForgot ? 'forgot' : 'form'); resetOtp(); setError(''); }}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} /> Change email
            </button>
            <button
              type="button"
              onClick={isForgot ? handleForgotResend : handleResend}
              disabled={cooldown > 0 || isSubmitting}
              className="text-primary font-semibold disabled:text-muted-foreground transition-colors"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'forgot') {
    return (
      <div className="h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm flex flex-col items-center text-center">
          <Logo className="w-20 h-20 mb-6" />
          <h1 className="text-2xl font-extrabold mb-2">Reset password</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Enter your student email and we'll send you a verification code to reset your password.
          </p>
          <form onSubmit={handleForgotSend} className="w-full space-y-3">
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="your.name@post.runi.ac.il"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
              disabled={isSubmitting}
              className="flex h-16 w-full rounded-2xl border border-border/60 bg-background px-4 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            />
            {error && <p className="text-destructive text-sm text-left px-1">{error}</p>}
            <Button
              type="submit"
              className="w-full h-14 text-base rounded-2xl font-bold"
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Sending…</> : 'Send code →'}
            </Button>
          </form>
          <button
            type="button"
            onClick={() => { setStep('form'); setError(''); }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mt-6"
          >
            <ArrowLeft size={14} /> Back to sign in
          </button>
        </div>
      </div>
    );
  }

  if (step === 'forgot_setpassword') {
    return (
      <div className="h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm flex flex-col items-center text-center">
          <MailCheck size={52} className="text-primary mb-5" />
          <h1 className="text-2xl font-extrabold mb-2">Set a new password</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Choose a new password for <span className="font-semibold text-foreground">{email}</span>.
          </p>
          <form onSubmit={handleForgotSetPassword} className="w-full space-y-3">
            <PasswordInput
              value={password}
              onChange={(v) => { setPassword(v); if (error) setError(''); }}
              disabled={isSubmitting}
              placeholder="New password (6+ characters)"
              autoComplete="new-password"
            />
            <PasswordInput
              value={confirmPassword}
              onChange={(v) => { setConfirmPassword(v); if (error) setError(''); }}
              disabled={isSubmitting}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
            {error && <p className="text-destructive text-sm text-left px-1">{error}</p>}
            <Button
              type="submit"
              className="w-full h-14 text-base rounded-2xl font-bold"
              disabled={isSubmitting || password.length < 6 || !confirmPassword}
            >
              {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Saving…</> : 'Save new password →'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <Logo className="w-28 h-28 mb-6" />

        <h1 className="text-[1.9rem] font-extrabold leading-tight mb-3">
          The exclusive network for <span className="text-primary">Reichman</span> students
        </h1>
        <p className="text-muted-foreground text-base mb-8 leading-relaxed">
          Meet people. Share interests.<br />Build connections.
        </p>

        <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="w-full space-y-3">
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="your.name@post.runi.ac.il"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
            disabled={isSubmitting}
            className="flex h-16 w-full rounded-2xl border border-border/60 bg-background px-4 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          />
          {mode === 'signin' && (
            <>
              <PasswordInput
                value={password}
                onChange={(v) => { setPassword(v); if (error) setError(''); }}
                disabled={isSubmitting}
                placeholder="Password"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setStep('forgot'); setError(''); }}
                  className="text-sm text-primary font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </>
          )}
          {error && <p className="text-destructive text-sm text-left px-1">{error}</p>}
          <Button type="submit" className="w-full h-14 text-base rounded-2xl font-bold" disabled={isSubmitting}>
            {isSubmitting
              ? <><Loader2 size={18} className="animate-spin" /> {mode === 'signin' ? 'Signing in…' : 'Creating account…'}</>
              : mode === 'signin' ? 'Sign in →' : 'Create account →'}
          </Button>
        </form>

        <p className="flex items-center gap-2 text-sm text-muted-foreground mt-6">
          <Lock size={14} /> Only Reichman students can join
        </p>

        <p className="text-sm text-muted-foreground mt-4">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-primary font-semibold hover:underline"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};
