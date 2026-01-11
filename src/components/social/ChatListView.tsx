import React from 'react';
import { MessageSquare, Users } from 'lucide-react';
import { UserProfile, ChatSession } from '@/types/social';
import { MOCK_USERS } from '@/constants/social';

interface ChatListViewProps {
  currentUser: UserProfile;
  chats: ChatSession[];
  onSelectChat: (chatId: string) => void;
}

export const ChatListView: React.FC<ChatListViewProps> = ({
  currentUser,
  chats,
  onSelectChat
}) => {
  const getPartner = (chat: ChatSession) => {
    if (chat.isGroup) return null;
    const partnerId = chat.participantIds.find(id => id !== currentUser.id);
    return MOCK_USERS.find(u => u.id === partnerId);
  };

  const getLastMessage = (chat: ChatSession) => {
    if (chat.messages.length === 0) return 'No messages yet';
    const last = chat.messages[chat.messages.length - 1];
    const isMe = last.senderId === currentUser.id;
    const prefix = isMe ? 'You: ' : '';
    return prefix + (last.text.length > 40 ? last.text.slice(0, 40) + '...' : last.text);
  };

  const getLastMessageTime = (chat: ChatSession) => {
    if (chat.messages.length === 0) return '';
    const last = chat.messages[chat.messages.length - 1];
    return new Date(last.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (chats.length === 0) {
    return (
      <div className="flex flex-col h-full pb-20">
        <div className="p-6 border-b border-border bg-card/50">
          <h1 className="text-xl font-bold">Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">Your conversations</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground p-8">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm mt-1">Connect with other students to start chatting!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="p-6 border-b border-border bg-card/50">
        <h1 className="text-xl font-bold">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">{chats.length} conversation{chats.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map(chat => {
          const partner = getPartner(chat);
          
          return (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors border-b border-border/50"
            >
              {chat.isGroup ? (
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Users size={20} className="text-primary" />
                </div>
              ) : partner ? (
                <div className="w-12 h-12 rounded-full overflow-hidden bg-primary flex items-center justify-center shrink-0 relative">
                  {partner.avatarUrl ? (
                    <img src={partner.avatarUrl} alt={partner.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary-foreground font-bold">{partner.name.charAt(0)}</span>
                  )}
                  {partner.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
              ) : null}

              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">
                    {chat.isGroup ? chat.groupName : partner?.name}
                  </h3>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    {getLastMessageTime(chat)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {getLastMessage(chat)}
                </p>
              </div>

              {chat.unreadCount > 0 && (
                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
                  {chat.unreadCount}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
