import React, { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AuthViewProps {
  onVerified: (email: string, isDemo: boolean) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onVerified }) => {
  const [authStep, setAuthStep] = useState<'email' | 'verification'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    const lowerEmail = email.toLowerCase().trim();

    if (!lowerEmail.endsWith('@post.runi.ac.il') && !lowerEmail.startsWith('demo')) {
      setAuthError('Please use your @post.runi.ac.il student email.');
      setIsSubmitting(false);
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setTimeout(() => {
      setAuthStep('verification');
      setIsSubmitting(false);
    }, 600);
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    setTimeout(() => {
      if (otp !== generatedCode) {
        setAuthError('Incorrect verification code.');
        setIsSubmitting(false);
        return;
      }
      onVerified(email, email.toLowerCase().startsWith('demo'));
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="h-[100dvh] bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        <Logo className="w-32 h-32 mb-8" />

        <h1 className="text-3xl font-extrabold tracking-tight leading-tight mb-3">
          The exclusive network for Reichman students
        </h1>

        {authStep === 'verification' && generatedCode && (
          <div className="bg-accent text-accent-foreground px-5 py-2.5 rounded-2xl my-4">
            <p className="text-xs font-bold uppercase tracking-wider opacity-70">Verification Code</p>
            <p className="text-2xl font-mono font-bold tracking-widest">{generatedCode}</p>
          </div>
        )}

        {authStep === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="w-full space-y-4 mt-6">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.name@post.runi.ac.il"
              className="h-14 text-base rounded-xl"
              required
            />
            {authError && <p className="text-destructive text-sm">{authError}</p>}
            <Button type="submit" className="w-full h-14 text-base rounded-xl font-semibold" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Join the network'}
              <ArrowRight className="ml-1" size={20} />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerificationSubmit} className="w-full space-y-4 mt-6">
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              className="h-14 tracking-widest text-center text-xl rounded-xl"
              maxLength={6}
            />
            {authError && <p className="text-destructive text-sm">{authError}</p>}
            <Button type="submit" className="w-full h-14 text-base rounded-xl font-semibold" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify & Enter'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
