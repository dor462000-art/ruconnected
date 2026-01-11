import React, { useState } from 'react';
import { ArrowRight, Mail, ShieldCheck, Users, Target, Lightbulb } from 'lucide-react';
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
      setAuthError('Access restricted. Please use your valid @post.runi.ac.il student email.');
      setIsSubmitting(false);
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    setTimeout(() => {
      setAuthStep('verification');
      setIsSubmitting(false);
    }, 800);
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
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      {authStep === 'verification' && generatedCode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-primary/10 border border-primary/30 text-primary px-6 py-3 rounded-2xl shadow-xl backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-primary/70">Verification Code</p>
            <p className="text-2xl font-mono font-bold tracking-widest">{generatedCode}</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-sm text-center">
        <Logo className="w-20 h-20 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">
          {authStep === 'email' ? 'Welcome to RUconnected' : 'Verify your email'}
        </h1>
        <p className="text-muted-foreground text-sm mb-2">
          {authStep === 'email' 
            ? 'The exclusive network for Reichman University students'
            : 'Enter the code we sent to your email'
          }
        </p>

        {authStep === 'email' && (
          <div className="bg-card/50 border border-border rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-primary mb-3">Why join RUconnected?</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users size={14} className="text-primary shrink-0" />
                Find study partners in your courses
              </li>
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <Target size={14} className="text-primary shrink-0" />
                Build projects with co-founders
              </li>
              <li className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lightbulb size={14} className="text-primary shrink-0" />
                Connect with students who share your interests
              </li>
            </ul>
          </div>
        )}

        {authStep === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@post.runi.ac.il"
                className="pl-11"
                required
              />
            </div>
            {authError && <p className="text-destructive text-sm">{authError}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Continue'}
              <ArrowRight className="ml-2" size={18} />
            </Button>
            <p className="text-xs text-muted-foreground">
              Tip: Use "demo" as email to explore with sample data
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerificationSubmit} className="space-y-4">
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                className="pl-11 tracking-widest text-center text-lg"
                maxLength={6}
              />
            </div>
            {authError && <p className="text-destructive text-sm">{authError}</p>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify & Enter'}
            </Button>
          </form>
        )}
      </div>

      <div className="absolute bottom-8 w-full max-w-sm px-6">
        <div className="flex gap-3 p-4 bg-card rounded-2xl border border-border">
          <ShieldCheck className="text-primary shrink-0" size={24} />
          <div className="text-left">
            <h3 className="font-bold text-sm">Student Exclusive</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Only verified Reichman University students can join. Your privacy and safety matter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
