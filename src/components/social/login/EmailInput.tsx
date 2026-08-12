import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  invalid?: boolean;
  disabled?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  placeholder,
  invalid,
  disabled,
}) => (
  <Input
    type="email"
    name="email"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    inputMode="email"
    autoComplete="email"
    autoCapitalize="none"
    spellCheck={false}
    disabled={disabled}
    aria-invalid={invalid}
    aria-label="Student email address"
    className={cn(
      'h-14 rounded-2xl border bg-card/90 px-5 text-base shadow-sm backdrop-blur-sm',
      'placeholder:text-muted-foreground/70',
      'transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary',
      invalid && 'border-destructive focus-visible:ring-destructive',
    )}
  />
);
