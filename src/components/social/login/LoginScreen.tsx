import React from 'react';
import { Lock } from 'lucide-react';
import { Logo } from '../Logo';
import { BackgroundArtwork } from './BackgroundArtwork';
import { EmailInput } from './EmailInput';
import { JoinNetworkButton } from './JoinNetworkButton';

interface LoginScreenProps {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string;
  isSubmitting?: boolean;
  allowedDomain: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  email,
  onEmailChange,
  onSubmit,
  error,
  isSubmitting,
  allowedDomain,
}) => (
  <main className="relative isolate flex h-[100dvh] w-full flex-col overflow-hidden bg-background">
    <BackgroundArtwork />

    <div className="relative z-10 flex flex-1 flex-col items-center px-6 pt-[6vh] sm:pt-[9vh]">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <Logo className="mb-5 h-16 w-16 drop-shadow-lg sm:h-20 sm:w-20" />

        <h1 className="text-[1.6rem] font-extrabold leading-[1.15] tracking-tight sm:text-3xl">
          The exclusive network for{' '}
          <span className="text-primary">Reichman</span> students
        </h1>

        <p className="mt-3 text-[0.95rem] leading-snug text-muted-foreground">
          Meet people. Share interests.
          <br />
          Build connections.
        </p>

        <form onSubmit={onSubmit} className="mt-7 w-full space-y-3" noValidate>
          <EmailInput
            value={email}
            onChange={onEmailChange}
            placeholder={`your.name@${allowedDomain}`}
            invalid={!!error}
            disabled={isSubmitting}
          />
          {error && (
            <p role="alert" className="px-1 text-left text-sm text-destructive">
              {error}
            </p>
          )}
          <JoinNetworkButton loading={isSubmitting} />
        </form>

        <p className="mt-4 flex items-center justify-center gap-1.5 rounded-full bg-background/70 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
          <Lock size={14} />
          Only Reichman students can join
        </p>
      </div>
    </div>
  </main>
);
