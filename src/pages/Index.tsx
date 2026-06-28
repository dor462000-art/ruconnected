import React, { useState } from 'react';
import { AppState, UserProfile, ViewType, ChatSession, GroupChat, Message, Attachment, Post } from '@/types/social';
import { MOCK_USERS } from '@/constants/social';
import { Sidebar } from '@/components/social/Sidebar';
import { AuthView } from '@/components/social/AuthView';
import { OnboardingView } from '@/components/social/OnboardingView';
import { WelcomeView } from '@/components/social/WelcomeView';
import { FeedView } from '@/components/social/FeedView';
import { CreatePostView } from '@/components/social/CreatePostView';
import { DiscoveryView } from '@/components/social/DiscoveryView';
import { ProfileView } from '@/components/social/ProfileView';
import { ChatListView } from '@/components/social/ChatListView';
import { ChatView } from '@/components/social/ChatView';
import { CreateGroupView } from '@/components/social/CreateGroupView';
import { Notification } from '@/components/social/Notification';

const SAMPLE_POSTS = (currentUserId: string): Post[] => [
  {
    id: 'p1', authorId: 'u1', type: 'Looking for partners',
    text: 'Looking for a backend dev (Node/Python) to build out an AI study companion this semester. DM me!',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), likes: ['u3'], comments: [],
  },
  {
    id: 'p2', authorId: 'u5', type: 'Project idea',
    text: 'Idea: a campus marketplace where students lend textbooks for free. Anyone want to validate this with me?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), likes: ['u2', 'u3'], comments: [],
  },
  {
    id: 'p3', authorId: 'u4', type: 'Question',
    text: 'Anyone taking International Relations next semester? Wondering how heavy the workload is.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), likes: [], comments: [],
  },
  {
    id: 'p4', authorId: 'u2', type: 'Social',
    text: 'Going surfing at Hilton beach Friday morning if anyone wants to join 🏄‍♂️',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), likes: ['u3', 'u5', 'u1'], comments: [],
  },
];

const Index = () => {
  const [state, setState] = useState<AppState>({
    view: 'auth',
    currentUser: null,
    activeChatPartnerId: null,
    activeGroupId: null,
  });

  const [pendingStudentId, setPendingStudentId] = useState('');
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const notify = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 2500);
  };

  const handleVerified = (email: string) => {
    setPendingStudentId(email.split('@')[0]);
    setState(prev => ({ ...prev, view: 'onboarding' }));
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setState({ view: 'welcome', currentUser: profile, activeChatPartnerId: null, activeGroupId: null });
    setPosts(SAMPLE_POSTS(profile.id));
  };

  const handleConnect = (userId: string, userName: string) => {
    setConnections(prev => new Set(prev).add(userId));
    notify(`Connected with ${userName}`);
  };

  const handleStartChat = (userId: string) => {
    if (!state.currentUser) return;
    let existing = chats.find(c =>
      !c.isGroup && c.participantIds.includes(userId) && c.participantIds.includes(state.currentUser!.id)
    );
    if (!existing) {
      existing = {
        id: crypto.randomUUID(),
        participantIds: [state.currentUser.id, userId],
        messages: [],
        unreadCount: 0,
        isGroup: false,
      };
      setChats(prev => [...prev, existing!]);
    }
    setActiveChatId(existing.id);
    setState(prev => ({ ...prev, view: 'chat_detail' }));
  };

  const handleSendMessage = (text: string, attachments?: Attachment[]) => {
    if (!state.currentUser || !activeChatId) return;
    const m: Message = {
      id: crypto.randomUUID(),
      senderId: state.currentUser.id,
      text, timestamp: new Date(), attachments,
    };
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, m] } : c));
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    if (!state.currentUser) return;
    setState(prev => ({ ...prev, currentUser: { ...prev.currentUser!, ...updates } as UserProfile }));
    notify('Profile updated');
  };

  const handleLogout = () => {
    setState({ view: 'auth', currentUser: null, activeChatPartnerId: null, activeGroupId: null });
    setConnections(new Set());
    setChats([]); setGroups([]); setPosts([]);
  };

  const handleNavigate = (view: ViewType) => {
    setState(prev => ({ ...prev, view }));
    if (view !== 'chat_detail') setActiveChatId(null);
  };

  const handleCreateGroup = (group: GroupChat) => {
    setGroups(prev => [...prev, group]);
    notify(`Group "${group.name}" created`);
    handleNavigate('chat_list');
  };

  const handleNewPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
    notify('Post shared');
    handleNavigate('feed');
  };

  const handleLike = (postId: string) => {
    if (!state.currentUser) return;
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likes.includes(state.currentUser!.id);
      return {
        ...p,
        likes: liked ? p.likes.filter(id => id !== state.currentUser!.id) : [...p.likes, state.currentUser!.id],
      };
    }));
  };

  // Auth & onboarding & welcome (full screen)
  if (state.view === 'auth') {
    return (
      <>
        {notification && <Notification message={notification.message} type={notification.type} />}
        <AuthView onVerified={handleVerified} />
      </>
    );
  }
  if (state.view === 'onboarding') {
    return (
      <>
        {notification && <Notification message={notification.message} type={notification.type} />}
        <OnboardingView studentId={pendingStudentId} onComplete={handleOnboardingComplete} />
      </>
    );
  }
  if (state.view === 'welcome' && state.currentUser) {
    return (
      <>
        {notification && <Notification message={notification.message} type={notification.type} />}
        <WelcomeView name={state.currentUser.name} onContinue={() => handleNavigate('feed')} />
      </>
    );
  }

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="flex h-[100dvh] bg-background text-foreground overflow-hidden">
      {notification && <Notification message={notification.message} type={notification.type} />}

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {state.view === 'feed' && state.currentUser && (
          <FeedView
            currentUser={state.currentUser}
            posts={posts}
            chats={chats}
            onLike={handleLike}
            onOpenProfile={() => handleNavigate('profile')}
            onShareToChat={(chatId, text) => {
              const m: Message = {
                id: crypto.randomUUID(),
                senderId: state.currentUser!.id,
                text: `📎 Shared a post:\n\n${text}`,
                timestamp: new Date(),
              };
              setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, m] } : c));
              notify('Post shared to chat');
            }}
          />
        )}

        {state.view === 'discovery' && state.currentUser && (
          <DiscoveryView
            currentUser={state.currentUser}
            onNavigate={handleNavigate}
            onConnect={handleConnect}
            onStartChat={(id) => handleStartChat(id)}
            connections={connections}
          />
        )}

        {state.view === 'create_post' && state.currentUser && (
          <CreatePostView
            currentUser={state.currentUser}
            onBack={() => handleNavigate('feed')}
            onPost={handleNewPost}
          />
        )}

        {state.view === 'chat_list' && state.currentUser && (
          <ChatListView
            currentUser={state.currentUser}
            chats={chats}
            groups={groups}
            onSelectChat={(chatId) => {
              setActiveChatId(chatId);
              setState(prev => ({ ...prev, view: 'chat_detail' }));
            }}
            onSelectGroup={(gid) => {
              const g = groups.find(g => g.id === gid);
              if (g) notify(`Opening "${g.name}"`);
            }}
            onCreateGroup={() => handleNavigate('create_group')}
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

        {state.view === 'create_group' && state.currentUser && (
          <CreateGroupView
            currentUser={state.currentUser}
            connections={connections}
            onBack={() => handleNavigate('chat_list')}
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

      {state.view !== 'chat_detail' && state.view !== 'create_group' && state.view !== 'create_post' && (
        <Sidebar
          currentView={state.view}
          onChangeView={handleNavigate}
          unreadCount={chats.reduce((acc, c) => acc + c.unreadCount, 0)}
          onCreatePost={() => handleNavigate('create_post')}
        />
      )}
    </div>
  );
};

export default Index;
