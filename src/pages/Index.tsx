import React, { useState } from 'react';
import { AppState, UserProfile, ViewType, ChatSession, GroupChat, Message, Attachment } from '@/types/social';
import { MOCK_USERS } from '@/constants/social';
import { Sidebar } from '@/components/social/Sidebar';
import { AuthView } from '@/components/social/AuthView';
import { OnboardingView } from '@/components/social/OnboardingView';
import { DiscoveryView } from '@/components/social/DiscoveryView';
import { ProfileView } from '@/components/social/ProfileView';
import { ChatListView } from '@/components/social/ChatListView';
import { ChatView } from '@/components/social/ChatView';
import { GroupChatsView } from '@/components/social/GroupChatsView';
import { CreateGroupView } from '@/components/social/CreateGroupView';
import { Notification } from '@/components/social/Notification';

const Index = () => {
  const [state, setState] = useState<AppState>({
    view: 'auth',
    currentUser: null,
    activeChatPartnerId: null,
    activeGroupId: null
  });

  const [pendingStudentId, setPendingStudentId] = useState<string>('');
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleVerified = (email: string, isDemo: boolean) => {
    if (isDemo) {
      setState({ view: 'discovery', currentUser: MOCK_USERS[0], activeChatPartnerId: null, activeGroupId: null });
      // Pre-populate some connections for demo
      setConnections(new Set(['u2', 'u3', 'u5']));
      showNotification('Welcome back! You have 3 connections.');
    } else {
      setPendingStudentId(email.split('@')[0]);
      setState(prev => ({ ...prev, view: 'onboarding' }));
    }
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setState({ view: 'discovery', currentUser: profile, activeChatPartnerId: null, activeGroupId: null });
    showNotification('Welcome to RUconnected! Start connecting with other students.');
  };

  const handleConnect = (userId: string, userName: string) => {
    setConnections(prev => new Set(prev).add(userId));
    showNotification(`Connected with ${userName}! You can now message them.`);
  };

  const handleStartChat = (userId: string, userName: string) => {
    if (!state.currentUser) return;
    
    // Check if chat already exists
    let existingChat = chats.find(c => 
      !c.isGroup && c.participantIds.includes(userId) && c.participantIds.includes(state.currentUser!.id)
    );

    if (!existingChat) {
      // Create new chat
      const newChat: ChatSession = {
        id: crypto.randomUUID(),
        participantIds: [state.currentUser.id, userId],
        messages: [],
        unreadCount: 0,
        isGroup: false
      };
      setChats(prev => [...prev, newChat]);
      existingChat = newChat;
    }

    setActiveChatId(existingChat.id);
    setState(prev => ({ ...prev, view: 'chat_detail' }));
  };

  const handleSendMessage = (text: string, attachments?: Attachment[]) => {
    if (!state.currentUser || !activeChatId) return;

    const newMessage: Message = {
      id: crypto.randomUUID(),
      senderId: state.currentUser.id,
      text,
      timestamp: new Date(),
      attachments
    };

    setChats(prev => prev.map(chat => 
      chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    ));
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    if (state.currentUser) {
      setState(prev => ({
        ...prev,
        currentUser: { ...prev.currentUser!, ...updates } as UserProfile
      }));
      showNotification('Profile updated successfully');
    }
  };

  const handleLogout = () => {
    setState({ view: 'auth', currentUser: null, activeChatPartnerId: null, activeGroupId: null });
    setConnections(new Set());
    setChats([]);
    setGroups([]);
    showNotification('Logged out successfully', 'info');
  };

  const handleNavigate = (view: ViewType) => {
    setState(prev => ({ ...prev, view }));
    if (view !== 'chat_detail') {
      setActiveChatId(null);
    }
  };

  const handleCreateGroup = (group: GroupChat) => {
    setGroups(prev => [...prev, group]);
    showNotification(`Group "${group.name}" created!`);
    setState(prev => ({ ...prev, view: 'group_chats' }));
  };

  const handleSelectGroup = (groupId: string) => {
    // For now, just show a notification - full group chat would need more implementation
    const group = groups.find(g => g.id === groupId);
    if (group) {
      showNotification(`Opening "${group.name}" group chat`);
    }
  };

  // Auth view
  if (state.view === 'auth') {
    return (
      <>
        {notification && <Notification message={notification.message} type={notification.type} />}
        <AuthView onVerified={handleVerified} />
      </>
    );
  }

  // Onboarding view
  if (state.view === 'onboarding') {
    return (
      <>
        {notification && <Notification message={notification.message} type={notification.type} />}
        <OnboardingView studentId={pendingStudentId} onComplete={handleOnboardingComplete} />
      </>
    );
  }

  // Get active chat
  const activeChat = chats.find(c => c.id === activeChatId);

  // Main app views
  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      {notification && <Notification message={notification.message} type={notification.type} />}

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {state.view === 'discovery' && state.currentUser && (
          <DiscoveryView
            currentUser={state.currentUser}
            onNavigate={handleNavigate}
            onConnect={handleConnect}
            onStartChat={handleStartChat}
            connections={connections}
          />
        )}

        {state.view === 'chat_list' && state.currentUser && (
          <ChatListView
            currentUser={state.currentUser}
            chats={chats}
            onSelectChat={(chatId) => {
              setActiveChatId(chatId);
              setState(prev => ({ ...prev, view: 'chat_detail' }));
            }}
          />
        )}

        {state.view === 'chat_detail' && state.currentUser && activeChat && (
          <ChatView
            currentUser={state.currentUser}
            chatSession={activeChat}
            onBack={() => handleNavigate('chat_list')}
            onSendMessage={handleSendMessage}
          />
        )}

        {state.view === 'group_chats' && state.currentUser && (
          <GroupChatsView
            currentUser={state.currentUser}
            groups={groups}
            onCreateGroup={() => handleNavigate('create_group')}
            onSelectGroup={handleSelectGroup}
          />
        )}

        {state.view === 'create_group' && state.currentUser && (
          <CreateGroupView
            currentUser={state.currentUser}
            connections={connections}
            onBack={() => handleNavigate('group_chats')}
            onCreate={handleCreateGroup}
          />
        )}

        {state.view === 'profile' && state.currentUser && (
          <ProfileView
            user={state.currentUser}
            onUpdate={handleUpdateProfile}
            onLogout={handleLogout}
          />
        )}
      </div>

      {state.view !== 'chat_detail' && state.view !== 'create_group' && (
        <Sidebar
          currentView={state.view}
          onChangeView={handleNavigate}
          unreadCount={chats.reduce((acc, chat) => acc + chat.unreadCount, 0)}
        />
      )}
    </div>
  );
};

export default Index;
