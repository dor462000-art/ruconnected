import React from 'react';

interface InitialsAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

// Deterministic color picker based on name
const COLORS = [
  'hsl(222 69% 52%)',
  'hsl(280 60% 55%)',
  'hsl(340 65% 55%)',
  'hsl(20 80% 55%)',
  'hsl(160 55% 42%)',
  'hsl(200 70% 48%)',
  'hsl(40 80% 50%)',
];

const getColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
};

export const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({ name, size = 40, className = '' }) => {
  const initials = getInitials(name || '?');
  const bg = getColor(name || '?');
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 ${className}`}
      style={{ width: size, height: size, backgroundColor: bg, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
};
