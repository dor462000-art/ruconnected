import React from 'react';
import {
  Home,
  Users,
  Plus,
  MessageSquare,
  UserCircle,
} from 'lucide-react';
import { ViewType } from '@/types/social';

interface SidebarProps {
  currentView: ViewType;
  onChangeView: (view: ViewType) => void;
  unreadCount?: number;
  onCreatePost: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onChangeView,
  unreadCount = 0,
  onCreatePost,
}) => {
  const items: { id: ViewType; label: string; icon: typeof Home; badge?: number }[] = [
    { id: 'feed', label: 'Home', icon: Home },
    { id: 'discovery', label: 'Connect', icon: Users },
    { id: 'chat_list', label: 'Chat', icon: MessageSquare, badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  const isActive = (id: ViewType) =>
    currentView === id ||
    (id === 'chat_list' && (currentView === 'chat_detail' || currentView === 'group_chats' || currentView === 'create_group'));

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2 relative">
        {items.slice(0, 2).map((item) => (
          <NavBtn key={item.id} item={item} active={isActive(item.id)} onClick={() => onChangeView(item.id)} />
        ))}

        {/* Center post button */}
        <button
          onClick={onCreatePost}
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 transition-transform -mt-6"
          aria-label="Create post"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>

        {items.slice(2).map((item) => (
          <NavBtn key={item.id} item={item} active={isActive(item.id)} onClick={() => onChangeView(item.id)} />
        ))}
      </div>
    </div>
  );
};

const NavBtn: React.FC<{
  item: { id: ViewType; label: string; icon: typeof Home; badge?: number };
  active: boolean;
  onClick: () => void;
}> = ({ item, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
      active ? 'text-primary' : 'text-muted-foreground'
    }`}
  >
    <div className="relative">
      <item.icon size={24} strokeWidth={active ? 2.5 : 2} />
      {(item.badge || 0) > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center border-2 border-background">
          {item.badge}
        </span>
      )}
    </div>
    <span className="text-[11px] font-medium">{item.label}</span>
  </button>
);
