export type SchoolType = 'Israeli' | 'International';
export type DegreeLevel = 'Undergraduate' | 'Graduate';
export type LookingForType = 'Projects' | 'Study Partners' | 'Networking' | 'Friendship';

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
  projectIdeas?: string;
  skills?: string[];
  availability?: string;
  preferredGroupSize?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'file';
  url: string;
  mimeType: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface ChatSession {
  id: string;
  participantIds: string[];
  messages: Message[];
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupDescription?: string;
  createdBy?: string;
}

export interface GroupChat {
  id: string;
  name: string;
  description: string;
  participantIds: string[];
  createdBy: string;
  interests: string[];
  messages: Message[];
  createdAt: Date;
}

export type PostType = 'Looking for partners' | 'Project idea' | 'Question' | 'Social';

export interface Post {
  id: string;
  authorId: string;
  type: PostType;
  text: string;
  createdAt: Date;
  likes: string[]; // userIds
  comments: { id: string; authorId: string; text: string; createdAt: Date }[];
}

export type ViewType =
  | 'auth'
  | 'onboarding'
  | 'welcome'
  | 'feed'
  | 'discovery'
  | 'create_post'
  | 'chat_list'
  | 'chat_detail'
  | 'profile'
  | 'group_chats'
  | 'create_group';

export interface AppState {
  view: ViewType;
  currentUser: UserProfile | null;
  activeChatPartnerId: string | null;
  activeGroupId: string | null;
}
