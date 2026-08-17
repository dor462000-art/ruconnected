import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { LoginScreen } from './login/LoginScreen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';


interface AuthViewProps {
  onVerified: (email: string) => void;
}

const ALLOWED_DOMAIN = 'post.runi.ac.il';
const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN = 60;

export const AuthView: React.FC<AuthViewProps> = ({ onVerified }) => {
  const [step, setStep] = useState<'email' | 'verification'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const sendOtp = async (addr: string) => {
    const { error: err } = await supabase.auth.signInWithOtp({
      email: addr,
      options: { shouldCreateUser: true },
    });
    if (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('post.runi.ac.il') || msg.toLowerCase().includes('allowed')) {
        throw new Error(`Only @${ALLOWED_DOMAIN} email addresses are allowed.`);
      }
      throw new Error(msg || 'Could not send verification code. Please try again.');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const lower = email.toLowerCase().trim();
    if (!lower) {
      setError('Please enter your student email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower)) {
      setError('That doesn\u2019t look like a valid email address.');
      return;
    }
    if (!lower.endsWith(`@${ALLOWED_DOMAIN}`)) {
      setError(`Only Reichman students can join \u2014 please use your @${ALLOWED_DOMAIN} email.`);
      return;
    }

    setIsSubmitting(true);
    try {
      setEmail(lower);
      onVerified(lower);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleResend = async () => {
    if (cooldown > 0) return;
    setError('');
    setInfo('');
    setIsSubmitting(true);
    try {
      await sendOtp(email);
      setSentAt(Date.now());
      setCooldown(RESEND_COOLDOWN);
      setInfo('A new code has been sent.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (sentAt && Date.now() - sentAt > OTP_TTL_MS) {
      setError('This code has expired. Please request a new one.');
      return;
    }
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setIsSubmitting(true);
    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });
    setIsSubmitting(false);
    if (err) {
      setError(err.message || 'Incorrect or expired code.');
      return;
    }
    onVerified(email);
  };

  if (step === 'email') {
    return (
      <LoginScreen
        email={email}
        onEmailChange={(v) => { setEmail(v); if (error) setError(''); }}
        onSubmit={handleEmailSubmit}
        error={error}
        isSubmitting={isSubmitting}
        allowedDomain={ALLOWED_DOMAIN}
      />
    );
  }

  return (
    <div className="h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <Logo className="w-16 h-16 mb-6" />
        <h1 className="text-2xl font-extrabold tracking-tight leading-tight mb-2">
          Verify your student email
        </h1>

        <form onSubmit={handleVerificationSubmit} className="w-full space-y-4 mt-6">
          {info && <p className="text-sm text-muted-foreground">{info}</p>}
          <Input
            type="text"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="6-digit code"
            className="h-14 tracking-widest text-center text-xl rounded-2xl"
            maxLength={6}
            autoComplete="one-time-code"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full h-14 text-base rounded-2xl font-semibold" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Verify & Enter'}
          </Button>
          <div className="flex items-center justify-between text-sm pt-1">
            <button
              type="button"
              onClick={() => { setStep('email'); setOtp(''); setError(''); setInfo(''); }}
              className="text-muted-foreground underline"
            >
              Change email
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isSubmitting}
              className="text-primary font-medium disabled:text-muted-foreground disabled:no-underline underline"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
            </button>
          </div>
        </form>
      </div>
    </div>

  );
};
