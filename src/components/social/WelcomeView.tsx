import React from 'react';
import { Sparkles, Users, MessageSquare, PlusCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';

interface WelcomeViewProps {
  name: string;
  onContinue: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ name, onContinue }) => {
  return (
    <div className="h-[100dvh] bg-background flex flex-col px-6 py-10">
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <Logo className="w-20 h-20 mb-6" />
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Welcome, {name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground text-base mb-8">
          You're now part of RUconnected — the exclusive network for Reichman students.
        </p>

        <div className="w-full space-y-3 text-left">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold">Browse the home feed</p>
              <p className="text-sm text-muted-foreground">See what other students are working on.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Users size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold">Connect with classmates</p>
              <p className="text-sm text-muted-foreground">Find study partners or co-founders.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <PlusCircle size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold">Share a post</p>
              <p className="text-sm text-muted-foreground">Ask questions or pitch project ideas.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-muted">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquare size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold">Chat & build groups</p>
              <p className="text-sm text-muted-foreground">Message 1:1 or create interest-based groups.</p>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={onContinue}
        className="w-full max-w-md mx-auto h-14 text-base rounded-xl font-semibold"
      >
        Enter RUconnected
        <ArrowRight className="ml-1" size={20} />
      </Button>
    </div>
  );
};
