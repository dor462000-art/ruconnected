import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, GraduationCap, Heart, Lightbulb, Target, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile, SchoolType, DegreeLevel } from '@/types/social';
import {
  INTERNATIONAL_UNDERGRADUATE_DEGREES,
  INTERNATIONAL_GRADUATE_DEGREES,
  ISRAELI_UNDERGRADUATE_DEGREES,
  ISRAELI_GRADUATE_DEGREES,
  SPECIAL_PROGRAMS_LIST,
  CLUBS_LIST,
  INTERESTS_LIST,
  LOOKING_FOR_OPTIONS,
  SKILLS_LIST,
  AVAILABILITY_OPTIONS,
} from '@/constants/social';

interface OnboardingViewProps {
  studentId: string;
  onComplete: (profile: UserProfile) => void;
}

type Step = 'identity' | 'sections' | 'goals';

export const OnboardingView: React.FC<OnboardingViewProps> = ({ studentId, onComplete }) => {
  const [step, setStep] = useState<Step>('identity');
  const [openSection, setOpenSection] = useState<string | null>('academic');

  const [profile, setProfile] = useState<Partial<UserProfile>>({
    studentId,
    school: 'Israeli',
    degreeLevel: 'Undergraduate',
    interests: [],
    lookingFor: [],
    specialPrograms: [],
    clubs: [],
    volunteering: [],
    skills: [],
    availability: '',
  });

  const getDegreeList = (school?: SchoolType, level?: DegreeLevel) => {
    if (!school || !level) return [];
    if (school === 'International') {
      return level === 'Graduate' ? INTERNATIONAL_GRADUATE_DEGREES : INTERNATIONAL_UNDERGRADUATE_DEGREES;
    }
    return level === 'Graduate' ? ISRAELI_GRADUATE_DEGREES : ISRAELI_UNDERGRADUATE_DEGREES;
  };

  const toggleArrayItem = (field: keyof UserProfile, item: string) => {
    setProfile(prev => {
      const arr = (prev[field] as string[]) || [];
      return { ...prev, [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item] };
    });
  };

  const finish = () => {
    onComplete({
      id: crypto.randomUUID(),
      studentId: profile.studentId || 'unknown',
      name: profile.name || 'Anonymous',
      age: profile.age || 20,
      school: profile.school || 'Israeli',
      degreeLevel: profile.degreeLevel || 'Undergraduate',
      degree: profile.degree || 'General',
      year: Number(profile.year) || 1,
      interests: profile.interests || [],
      lookingFor: profile.lookingFor || ['Friendship'],
      specialPrograms: profile.specialPrograms || [],
      clubs: profile.clubs || [],
      volunteering: profile.volunteering || [],
      bio: '',
      avatarColor: 'bg-primary',
      skills: profile.skills || [],
      availability: profile.availability || '',
    });
  };

  const Section: React.FC<{
    id: string;
    title: string;
    optional?: boolean;
    icon: any;
    children: React.ReactNode;
  }> = ({ id, title, optional, icon: Icon, children }) => {
    const open = openSection === id;
    return (
      <div className="border border-border rounded-2xl overflow-hidden">
        <button
          onClick={() => setOpenSection(open ? null : id)}
          className="w-full flex items-center gap-3 px-4 py-4 hover:bg-muted/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
            <Icon size={18} className="text-primary" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold">{title}</p>
            {optional && <p className="text-xs text-muted-foreground">Optional</p>}
          </div>
          {open ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
        </button>
        {open && <div className="px-4 pb-5 space-y-4">{children}</div>}
      </div>
    );
  };

  // STEP 1: identity (former step 1)
  if (step === 'identity') {
    const valid = (profile.name?.trim().length || 0) >= 2;
    return (
      <div className="h-[100dvh] flex flex-col px-6 py-6">
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h1 className="text-3xl font-extrabold mb-2">Tell us about you</h1>
          <p className="text-muted-foreground mb-8">This is how other students will see you.</p>

          <label className="text-sm font-semibold mb-1.5 block">Full Name</label>
          <Input
            value={profile.name || ''}
            onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Maya Cohen"
            className="h-12 mb-4 rounded-xl"
          />

          <label className="text-sm font-semibold mb-1.5 block">Age</label>
          <Input
            type="number"
            min={18}
            max={40}
            value={profile.age || ''}
            onChange={(e) => setProfile(p => ({ ...p, age: Number(e.target.value) }))}
            placeholder="e.g. 21"
            className="h-12 rounded-xl"
          />
        </div>
        <Button
          onClick={() => setStep('sections')}
          disabled={!valid}
          className="w-full max-w-md mx-auto h-14 text-base rounded-xl font-semibold"
        >
          Continue <ArrowRight className="ml-1" size={20} />
        </Button>
      </div>
    );
  }

  // STEP 2: collapsible sections
  if (step === 'sections') {
    const academicValid = !!profile.degree;
    return (
      <div className="h-[100dvh] flex flex-col">
        <header className="px-6 pt-6 pb-3">
          <h1 className="text-3xl font-extrabold">Your profile</h1>
          <p className="text-muted-foreground mt-1">Fill in what's relevant — only academic info is required.</p>
        </header>
        <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-6">
          <Section id="academic" title="Academic info" icon={GraduationCap}>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">School</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Israeli', 'International'] as SchoolType[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setProfile(p => ({ ...p, school: s, degree: '' }))}
                    className={`p-3 rounded-xl border-2 text-sm font-semibold ${
                      profile.school === s ? 'border-primary bg-primary/5 text-primary' : 'border-border'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Level</label>
                <select
                  value={profile.degreeLevel}
                  onChange={(e) => setProfile(p => ({ ...p, degreeLevel: e.target.value as DegreeLevel, degree: '' }))}
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm"
                >
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Year</label>
                <select
                  value={profile.year || 1}
                  onChange={(e) => setProfile(p => ({ ...p, year: Number(e.target.value) }))}
                  className="w-full bg-background border border-border rounded-xl p-3 text-sm"
                >
                  {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-1.5 block">Degree *</label>
              <select
                value={profile.degree || ''}
                onChange={(e) => setProfile(p => ({ ...p, degree: e.target.value }))}
                className="w-full bg-background border border-border rounded-xl p-3 text-sm"
              >
                <option value="">Select your degree...</option>
                {getDegreeList(profile.school, profile.degreeLevel).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </Section>

          <Section id="involvement" title="Campus involvement" optional icon={Heart}>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Special Programs</label>
              <select
                onChange={(e) => { if (e.target.value) { toggleArrayItem('specialPrograms', e.target.value); e.target.value = ''; } }}
                className="w-full bg-background border border-border rounded-xl p-3 text-sm"
              >
                <option value="">Add a program...</option>
                {[...SPECIAL_PROGRAMS_LIST].sort().map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {(profile.specialPrograms || []).map(item => (
                  <span key={item} className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs flex items-center gap-2">
                    {item}
                    <button onClick={() => toggleArrayItem('specialPrograms', item)}>×</button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Clubs</label>
              <select
                onChange={(e) => { if (e.target.value) { toggleArrayItem('clubs', e.target.value); e.target.value = ''; } }}
                className="w-full bg-background border border-border rounded-xl p-3 text-sm"
              >
                <option value="">Add a club...</option>
                {[...CLUBS_LIST].sort().map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {(profile.clubs || []).map(item => (
                  <span key={item} className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs flex items-center gap-2">
                    {item}
                    <button onClick={() => toggleArrayItem('clubs', item)}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </Section>

          <Section id="skills" title="Skills & availability" optional icon={Lightbulb}>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">My Skills</label>
              <div className="flex flex-wrap gap-2">
                {SKILLS_LIST.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleArrayItem('skills', s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      profile.skills?.includes(s) ? 'bg-primary text-primary-foreground border-primary' : 'border-border'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Availability</label>
              <div className="space-y-2">
                {AVAILABILITY_OPTIONS.map(o => (
                  <button
                    key={o}
                    onClick={() => setProfile(p => ({ ...p, availability: o }))}
                    className={`w-full p-3 rounded-xl border text-sm font-medium text-left ${
                      profile.availability === o ? 'border-primary bg-primary/5 text-primary' : 'border-border'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          </Section>
        </div>

        <div className="px-6 py-4 border-t border-border">
          <Button
            onClick={() => setStep('goals')}
            disabled={!academicValid}
            className="w-full h-14 text-base rounded-xl font-semibold"
          >
            Continue <ArrowRight className="ml-1" size={20} />
          </Button>
        </div>
      </div>
    );
  }

  // STEP 3: goals & interests
  const goalsValid = (profile.lookingFor?.length || 0) > 0;
  return (
    <div className="h-[100dvh] flex flex-col">
      <header className="px-6 pt-6 pb-3">
        <h1 className="text-3xl font-extrabold">What are you here for?</h1>
        <p className="text-muted-foreground mt-1">Pick at least one to help us match you.</p>
      </header>
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
        <div>
          <label className="text-sm font-semibold mb-2 block">I'm looking for *</label>
          <div className="flex flex-wrap gap-2">
            {LOOKING_FOR_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => toggleArrayItem('lookingFor', opt)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                  profile.lookingFor?.includes(opt)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-1 block">My interests <span className="text-muted-foreground font-normal">(optional)</span></label>
          <p className="text-xs text-muted-foreground mb-2">Tap any tag that applies to you.</p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS_LIST.map(i => (
              <button
                key={i}
                onClick={() => toggleArrayItem('interests', i)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  profile.interests?.includes(i) ? 'bg-primary text-primary-foreground border-primary' : 'border-border'
                }`}
              >
                #{i}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-border">
        <Button
          onClick={finish}
          disabled={!goalsValid}
          className="w-full h-14 text-base rounded-xl font-semibold"
        >
          Finish <ArrowRight className="ml-1" size={20} />
        </Button>
      </div>
    </div>
  );
};
