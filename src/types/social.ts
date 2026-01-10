export type SchoolType = 'Israeli' | 'International';
export type DegreeLevel = 'Undergraduate' | 'Graduate';
export type LookingForType = 'Projects' | 'Study Partners' | 'Networking' | 'Friendship' | 'Sports';

export interface UserProfile {
  id: string;
  studentId: string;
  name: string;
  age: number;
  school: SchoolType;
  degreeLevel: DegreeLevel;
  degree: string;
  year: number;
  interests: string[];
  lookingFor: LookingForType[];
  specialPrograms: string[];
  clubs: string[];
  volunteering: string[];
  bio: string;
  avatarColor: string;
  avatarUrl?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

export interface ChatSession {
  partnerId: string;
  messages: Message[];
  unreadCount: number;
}

export type ViewType = 'auth' | 'onboarding' | 'discovery' | 'chat_list' | 'chat_detail' | 'profile' | 'ai_chat';

export interface AppState {
  view: ViewType;
  currentUser: UserProfile | null;
  activeChatPartnerId: string | null;
}
