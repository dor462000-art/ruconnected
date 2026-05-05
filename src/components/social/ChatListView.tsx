import React, { useState } from 'react';
import { MessageSquare, Users, UserPlus, Search } from 'lucide-react';
import { UserProfile, ChatSession, GroupChat } from '@/types/social';
import { MOCK_USERS } from '@/constants/social';
import { InitialsAvatar } from './InitialsAvatar';
import { Input } from '@/components/ui/input';

interface ChatListViewProps {
  currentUser: UserProfile;
  chats: ChatSession[];
  groups: GroupChat[];
  onSelectChat: (chatId: string) => void;
  onSelectGroup: (groupId: string) => void;
  onCreateGroup: () => void;
}

export const ChatListView: React.FC<ChatListViewProps> = ({
  currentUser,
  chats,
  groups,
  onSelectChat,
  onSelectGroup,
  onCreateGroup,
}) => {
  const [search, setSearch] = useState('');

  const getPartner = (chat: ChatSession) => {
    const partnerId = chat.participantIds.find(id => id !== currentUser.id);
    return MOCK_USERS.find(u => u.id === partnerId);
  };

  const getLast = (msgs: { text: string; senderId: string; timestamp: Date }[]) => {
    if (!msgs.length) return { text: 'No messages yet', time: '' };
    const last = msgs[msgs.length - 1];
    const isMe = last.senderId === currentUser.id;
    return {
      text: (isMe ? 'You: ' : '') + (last.text.length > 40 ? last.text.slice(0, 40) + '…' : last.text),
      time: new Date(last.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const empty = chats.length === 0 && groups.length === 0;

  return (
    <div className="flex flex-col h-[100dvh] pb-24">
      <header className="flex items-center justify-between px-4 py-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-extrabold">Chat</h1>
          <p className="text-xs text-muted-foreground">Your conversations</p>
        </div>
        <button
          onClick={onCreateGroup}
          aria-label="Create group"
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-105 transition-transform"
        >
          <UserPlus size={20} />
        </button>
      </header>

      <div className="px-4 py-3 border-b border-border">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="pl-9 h-10 rounded-full"
          />
        </div>
      </div>

      {empty ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground p-8 text-center">
          <div>
            <MessageSquare size={44} className="mx-auto mb-3 opacity-50" />
            <p className="text-base font-medium">No conversations yet</p>
            <p className="text-sm mt-1">Connect with students or create a group.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase())).map(g => {
            const last = getLast(g.messages);
            return (
              <button
                key={g.id}
                onClick={() => onSelectGroup(g.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 text-left"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Users size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{g.name}</h3>
                    <span className="text-xs text-muted-foreground ml-2">{last.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{last.text}</p>
                </div>
              </button>
            );
          })}
          {chats.map(chat => {
            const partner = getPartner(chat);
            if (!partner) return null;
            if (search && !partner.name.toLowerCase().includes(search.toLowerCase())) return null;
            const last = getLast(chat.messages);
            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 text-left"
              >
                <InitialsAvatar name={partner.name} size={48} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{partner.name}</h3>
                    <span className="text-xs text-muted-foreground ml-2">{last.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{last.text}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
