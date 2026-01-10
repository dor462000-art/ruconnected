import React from 'react';
import { Check, Bell } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'info';
}

export const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-card border border-border text-foreground px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-2 fade-in">
      {type === 'success' ? (
        <Check size={18} className="text-green-400" />
      ) : (
        <Bell size={18} className="text-primary" />
      )}
      <span className="text-sm font-bold">{message}</span>
    </div>
  );
};
