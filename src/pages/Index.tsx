import React, { useState } from 'react';
import { AppState, UserProfile, ViewType, ChatSession } from '@/types/social';
import { MOCK_USERS } from '@/constants/social';
import { Sidebar } from '@/components/social/Sidebar';
import { AuthView } from '@/components/social/AuthView';
import { OnboardingView } from '@/components/social/OnboardingView';
import { DiscoveryView } from '@/components/social/DiscoveryView';
import { ProfileView } from '@/components/social/ProfileView';
import { AIChatView } from '@/components/social/AIChatView';
import { Notification } from '@/components/social/Notification';

const Index = () => {
  const [state, setState] = useState<AppState>({
    view: 'auth',
    currentUser: null,
    activeChatPartnerId: null
  });

  const [pendingStudentId, setPendingStudentId] = useState<string>('');
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const [chats, setChats] = useState<Record<string, ChatSession>>({});
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleVerified = (email: string, isDemo: boolean) => {
    if (isDemo) {
      setState({ view: 'discovery', currentUser: MOCK_USERS[0], activeChatPartnerId: null });
      showNotification('Welcome back!');
    } else {
      setPendingStudentId(email.split('@')[0]);
      setState(prev => ({ ...prev, view: 'onboarding' }));
    }
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setState({ view: 'discovery', currentUser: profile, activeChatPartnerId: null });
    showNotification('Welcome to RUconnected!');
  };

  const handleConnect = (userId: string, userName: string) => {
    setConnections(prev => new Set(prev).add(userId));
    showNotification(`Connection request sent to ${userName}`);
  };

  const handleMessage = (userName: string) => {
    showNotification(`Message sent to ${userName}`);
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
    setState({ view: 'auth', currentUser: null, activeChatPartnerId: null });
    setConnections(new Set());
    showNotification('Logged out successfully', 'info');
  };

  const handleNavigate = (view: ViewType) => {
    setState(prev => ({ ...prev, view }));
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
            onMessage={handleMessage}
            connections={connections}
          />
        )}

        {state.view === 'ai_chat' && <AIChatView />}

        {state.view === 'profile' && state.currentUser && (
          <ProfileView
            user={state.currentUser}
            onUpdate={handleUpdateProfile}
            onLogout={handleLogout}
          />
        )}

        {state.view === 'chat_list' && (
          <div className="flex-1 flex items-center justify-center pb-20">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm mt-1">Start connecting with other students!</p>
            </div>
          </div>
        )}
      </div>

      <Sidebar
        currentView={state.view}
        onChangeView={handleNavigate}
        unreadCount={Object.values(chats).reduce((acc: number, chat: ChatSession) => acc + chat.unreadCount, 0)}
      />
    </div>
  );
};

export default Index;
