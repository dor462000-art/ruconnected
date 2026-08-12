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
    if (!lower.endsWith(`@${ALLOWED_DOMAIN}`)) {
      setError(`Please use your @${ALLOWED_DOMAIN} student email.`);
      return;
    }
    setIsSubmitting(true);
    try {
      await sendOtp(lower);
      setEmail(lower);
      setSentAt(Date.now());
      setCooldown(RESEND_COOLDOWN);
      setStep('verification');
      setInfo(`We sent a 6-digit code to ${lower}. It expires in 10 minutes.`);
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

  return (
    <div className="h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <Logo className="w-20 h-20 mb-6" />
        <h1 className="text-2xl font-extrabold tracking-tight leading-tight mb-2">
          The exclusive network for Reichman students
        </h1>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="w-full space-y-4 mt-6">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`your.name@${ALLOWED_DOMAIN}`}
              className="h-14 text-base rounded-xl"
              required
              autoComplete="email"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full h-14 text-base rounded-xl font-semibold" disabled={isSubmitting}>
              {isSubmitting ? 'Sending code...' : 'Join the network'}
              <ArrowRight className="ml-1" size={20} />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerificationSubmit} className="w-full space-y-4 mt-6">
            {info && <p className="text-sm text-muted-foreground">{info}</p>}
            <Input
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
              className="h-14 tracking-widest text-center text-xl rounded-xl"
              maxLength={6}
              autoComplete="one-time-code"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full h-14 text-base rounded-xl font-semibold" disabled={isSubmitting}>
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
        )}
      </div>
    </div>
  );
};
