import { UserProfile, LookingForType } from '@/types/social';

export const INTERNATIONAL_UNDERGRADUATE_DEGREES = [
  'BA Economics & Entrepreneurship with Data Science',
  'BA Entrepreneurship & Business Administration',
  'BA Entrepreneurship & BSc Computer Science',
  'BA Business Administration',
  'BA Business Administration & Economics',
  'BA Communication',
  'BA Government',
  'BA Psychology',
  'BSc Computer Science'
];

export const INTERNATIONAL_GRADUATE_DEGREES = [
  'MA Government',
  'MA Financial Economics (MAFE)',
  'Global MBA Program',
  'One - Year MBA Program',
  'MBA Healthcare Innovation',
  'MA Human - Computer Interaction (HCI)',
  'MSC Machine Learning & Data Science',
  'MA Behavioral Economics'
];

export const ISRAELI_UNDERGRADUATE_DEGREES = [
  'BA Entrepreneurship & Business Administration',
  'BA Entrepreneurship & BSc Computer Science',
  'BA Entrepreneurship & Economics',
  'BA Entrepreneurship & Sustainability',
  'LL.B Law',
  'LL.B Law & BA Business Administration',
  'LL.B Law & BA Government',
  'LL.B Law & BA Psychology',
  'BA Business Administration',
  'BA Business Administration & Economics',
  'BA Business Administration & Psychology',
  'BA Business Administration with Accounting',
  'BA Business Administration & Sustainability',
  'BSc Computer Science',
  'BA Government',
  'BA Government & Sustainability',
  'BA Communications',
  'BA Psychology',
  'BA Psychology & Business Administration',
  'BA Economics',
  'BA Sustainability',
  'BA Sustainability & Government',
  'BA Sustainability & Economics',
  'BA Medicine'
];

export const ISRAELI_GRADUATE_DEGREES = [
  'MA Economics',
  'MA Social Psychology',
  'MA Clinical Psychology',
  'MA Communications',
  'MA Government',
  'MSc Computer Science',
  'MBA Business Administration',
  'LL.M Law'
];

export const SPECIAL_PROGRAMS_LIST = [
  'Anna Sobol Levy Fellowship Program',
  'Argov Fellows Program',
  'ASE Hub',
  'Aviram Sustainability and Climate Program',
  'Brandon Korff Digital Influencers Program',
  'Compass',
  'CO-OP Startup Experience Course',
  'Forum Ofek',
  'Game Changers - Playtika',
  'Honors Program',
  'Keren Or Program',
  'Media Innovation Lab (miLAB)',
  'Public Diplomacy Program',
  'Rabin Leadership Program',
  'Schestowitz Innovation Program',
  'The Accounting Program',
  'The Israel at Heart Program',
  'UpStart Program',
  'Zell Entrepreneurship Program',
  'Zvi Meitar Emerging Technologies Program'
];

export const CLUBS_LIST = [
  'A.M.C (Assets Management Club)',
  'AI Club',
  'Artemis Club',
  'Audioversity – Radio',
  'Behavior Economics Club',
  'Camera on Campus',
  'Chichma – Arabic Club',
  'Consulting Club',
  'Crypto Club',
  'Dance Company',
  'Debate Club',
  'Defense Tech Club',
  'DJ Workshop',
  'Entrepreneurship Club',
  'Fashion Club',
  'Fintech Club',
  'Foodtech Club',
  'Greenbiz Club',
  'High-Tech & Law Club',
  'Human Skills Club',
  'Idea 2 Startup Club',
  'Impact Club',
  'Innovation Club',
  'International Diplomacy Initiative Club',
  'International Law Club',
  'International Negotiators Club',
  'Investment Group Israel',
  'Journalism Club',
  'Law and Liberty Club',
  'Leaders Club',
  'M Club',
  'Marketing Club',
  'Masters Club',
  'Model UN',
  'Momentum Club',
  'Music Club',
  'Negotiation Club',
  'NEXTGEN Club',
  'Pay it Forward Club',
  'Pride Club',
  'Product Hub Club',
  'Prop Tech Club',
  'Pugwash Club',
  'Pulse Club',
  'Real Estate Club',
  'RUNI Creators Club',
  'RUNI Idol',
  'Run for Startup Club',
  'Sales Club',
  'SHIFT Game Design Club',
  'Space Club',
  'Sportstech & Wellness Club',
  'StandWithUs Fellowship',
  'TAMID Club',
  'Tazuz (Sports Tribes)',
  'TechTalk',
  'Tourism 360 Club',
  'UX/UI Club',
  'Venture Capital Club',
  'Wealth Management Club'
];

export const VOLUNTEERING_LIST = [
  'CLYF',
  'Courts (Law)',
  'F1RST',
  'Galim Program',
  "Ma'ayan Bamidbar Program",
  'Marketing/Social Media (on campus)',
  'Migdalor',
  'Omek',
  'Paamonim',
  'Podcasting',
  'PUSH',
  'Seven10 Stories',
  'SHAGI',
  'Shoval Project',
  'Tzemach',
  'Writing Center Tutoring'
];

export const INTERESTS_LIST = [
  'AI', 'Startups', 'Tennis', 'Hackathons', 'Surfing',
  'Photography', 'Marketing', 'Coding', 'Politics',
  'Gaming', 'Music', 'Fitness', 'Traveling', 'Art', 'Design',
  'Crypto', 'Finance', 'Psychology', 'Writing',
  'Movies', 'Nature', 'Cooking', 'Yoga'
];

export const SKILLS_LIST = [
  'Frontend Development', 'Backend Development', 'Mobile Development',
  'UI/UX Design', 'Graphic Design', 'Data Analysis',
  'Machine Learning', 'Product Management', 'Marketing',
  'Sales', 'Finance', 'Legal', 'Content Writing',
  'Video Editing', 'Photography', 'Public Speaking',
  'Research', 'Project Management', 'Business Development'
];

export const AVAILABILITY_OPTIONS = [
  'Few hours per week',
  '10-20 hours per week',
  'Full-time availability',
  'Weekends only',
  'Flexible schedule'
];

export const GROUP_SIZE_OPTIONS = [
  '2-3 people',
  '4-6 people',
  '7+ people',
  'No preference'
];

export const LOOKING_FOR_OPTIONS: LookingForType[] = [
  'Projects', 'Study Partners', 'Networking', 'Friendship'
];

export const POST_TYPES = [
  'Looking for partners',
  'Project idea',
  'Question',
  'Social'
] as const;

// Updated with younger-looking profile photos (19-26 age range)
export const MOCK_USERS: UserProfile[] = [
  {
    id: 'u1',
    studentId: '123456',
    name: 'Maya Cohen',
    age: 21,
    school: 'Israeli',
    degreeLevel: 'Undergraduate',
    degree: 'BSc Computer Science',
    year: 3,
    interests: ['AI', 'Hackathons', 'Tennis'],
    lookingFor: ['Projects', 'Networking'],
    specialPrograms: ['Zvi Meitar Emerging Technologies Program'],
    clubs: ['AI Club', 'TechTalk'],
    volunteering: [],
    bio: 'CS student passionate about generative AI. Looking for a backend developer for my final year project.',
    avatarColor: 'bg-purple-600',
    isOnline: true,
    skills: ['Frontend Development', 'Machine Learning'],
    projectIdeas: 'Building an AI-powered study companion app'
  },
  {
    id: 'u2',
    studentId: '234567',
    name: 'Daniel Smith',
    age: 20,
    school: 'International',
    degreeLevel: 'Undergraduate',
    degree: 'BA Business Administration',
    year: 1,
    interests: ['Startups', 'Marketing', 'Surfing'],
    lookingFor: ['Friendship', 'Study Partners'],
    specialPrograms: [],
    clubs: ['TAMID Club', 'Entrepreneurship Club'],
    volunteering: ['Seven10 Stories'],
    bio: 'New to Israel! Love surfing and entrepreneurship. Looking for study buddies for Intro to Econ.',
    avatarColor: 'bg-blue-600',
    isOnline: false,
    skills: ['Marketing', 'Content Writing'],
    projectIdeas: 'Sustainable fashion marketplace'
  },
  {
    id: 'u3',
    studentId: '345678',
    name: 'Noa Levi',
    age: 22,
    school: 'Israeli',
    degreeLevel: 'Undergraduate',
    degree: 'BA Psychology',
    year: 2,
    interests: ['Photography', 'Writing'],
    lookingFor: ['Friendship', 'Projects'],
    specialPrograms: ['Argov Fellows Program'],
    clubs: ['Journalism Club'],
    volunteering: ['Writing Center Tutoring'],
    bio: 'Psych major. Building a platform for mental health awareness. Need help with UI/UX.',
    avatarColor: 'bg-pink-600',
    isOnline: true,
    skills: ['Research', 'Content Writing', 'Photography'],
    projectIdeas: 'Mental health awareness platform for students'
  },
  {
    id: 'u4',
    studentId: '456789',
    name: 'Tom Rossi',
    age: 21,
    school: 'International',
    degreeLevel: 'Undergraduate',
    degree: 'BA Government',
    year: 2,
    interests: ['Politics', 'Writing'],
    lookingFor: ['Networking'],
    specialPrograms: ['Public Diplomacy Program'],
    clubs: ['Model UN', 'Debate Club'],
    volunteering: [],
    bio: 'RRIS Government student. Model UN enthusiast. Let\'s connect!',
    avatarColor: 'bg-emerald-600',
    isOnline: false,
    skills: ['Public Speaking', 'Research'],
    projectIdeas: 'Student policy debate platform'
  },
  {
    id: 'u5',
    studentId: '567890',
    name: 'Yoni Ben-Ari',
    age: 23,
    school: 'Israeli',
    degreeLevel: 'Undergraduate',
    degree: 'BA Entrepreneurship & Business Administration',
    year: 3,
    interests: ['Startups', 'Coding'],
    lookingFor: ['Projects', 'Networking'],
    specialPrograms: ['Zell Entrepreneurship Program'],
    clubs: ['Venture Capital Club', 'Idea 2 Startup Club'],
    volunteering: [],
    bio: 'Building the next unicorn. Looking for a technical co-founder.',
    avatarColor: 'bg-orange-600',
    isOnline: true,
    skills: ['Business Development', 'Product Management'],
    projectIdeas: 'EdTech platform connecting students with mentors'
  },
  {
    id: 'u6',
    studentId: '678901',
    name: 'Sarah Miller',
    age: 24,
    school: 'International',
    degreeLevel: 'Graduate',
    degree: 'Global MBA Program',
    year: 1,
    interests: ['Marketing', 'Finance'],
    lookingFor: ['Networking', 'Projects'],
    specialPrograms: [],
    clubs: ['Masters Club', 'Fintech Club'],
    volunteering: [],
    bio: 'MBA student with fintech background. Looking to network with developers.',
    avatarColor: 'bg-teal-600',
    isOnline: true,
    skills: ['Finance', 'Business Development', 'Project Management'],
    projectIdeas: 'Fintech solution for student budgeting'
  }
];
