import React from 'react';
import { Users, MessageSquare, UserCircle, UsersRound } from 'lucide-react';
import { ViewType } from '@/types/social';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, unreadCount = 0 }) => {
  const navItems = [
    { 
      id: 'discovery' as ViewType, 
      label: 'Connect', 
      icon: Users,
      tooltip: 'Discover students with similar interests'
    },
    { 
      id: 'chat_list' as ViewType, 
      label: 'Chats', 
      icon: MessageSquare, 
      badge: unreadCount,
      tooltip: 'Your private conversations'
    },
    { 
      id: 'group_chats' as ViewType, 
      label: 'Groups', 
      icon: UsersRound,
      tooltip: 'Group chats for projects & hobbies'
    },
    { 
      id: 'profile' as ViewType, 
      label: 'Profile', 
      icon: UserCircle,
      tooltip: 'Your profile settings'
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around p-3 w-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id || 
            (currentView === 'chat_detail' && item.id === 'chat_list') ||
            (currentView === 'create_group' && item.id === 'group_chats');
          
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
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
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                {item.tooltip}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};
