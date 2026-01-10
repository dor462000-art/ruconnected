import React from 'react';
import { Users, MessageSquare, UserCircle, Bot } from 'lucide-react';
import { ViewType } from '@/types/social';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, unreadCount = 0 }) => {
  const navItems = [
    { id: 'discovery' as ViewType, label: 'Connect', icon: Users },
    { id: 'chat_list' as ViewType, label: 'Chats', icon: MessageSquare, badge: unreadCount },
    { id: 'ai_chat' as ViewType, label: 'AI Chat', icon: Bot },
    { id: 'profile' as ViewType, label: 'Profile', icon: UserCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around p-3 w-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id || (currentView === 'chat_detail' && item.id === 'chat_list');
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors relative ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="relative">
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {(item.badge || 0) > 0 && (
                  <span className="absolute -top-1 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center border-2 border-card">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
