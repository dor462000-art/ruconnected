import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, User, GraduationCap, Heart, Sparkles, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserProfile, SchoolType, DegreeLevel } from '@/types/social';
import {
  INTERNATIONAL_UNDERGRADUATE_DEGREES,
  INTERNATIONAL_GRADUATE_DEGREES,
  ISRAELI_UNDERGRADUATE_DEGREES,
  ISRAELI_GRADUATE_DEGREES,
  SPECIAL_PROGRAMS_LIST,
  CLUBS_LIST,
  INTERESTS_LIST,
  LOOKING_FOR_OPTIONS
} from '@/constants/social';

interface OnboardingViewProps {
  studentId: string;
  onComplete: (profile: UserProfile) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ studentId, onComplete }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    studentId,
    school: 'Israeli',
    degreeLevel: 'Undergraduate',
    interests: [],
    lookingFor: [],
    specialPrograms: [],
    clubs: [],
    volunteering: []
  });

  const steps = [
    { title: 'Identity', icon: User },
    { title: 'Academic', icon: GraduationCap },
    { title: 'Involvement', icon: Sparkles },
    { title: 'Social', icon: Heart },
    { title: 'Bio', icon: Edit2 }
  ];

  const getDegreeList = (school?: SchoolType, level?: DegreeLevel) => {
    if (!school || !level) return [];
    if (school === 'International') {
      return level === 'Graduate' ? INTERNATIONAL_GRADUATE_DEGREES : INTERNATIONAL_UNDERGRADUATE_DEGREES;
    }
    return level === 'Graduate' ? ISRAELI_GRADUATE_DEGREES : ISRAELI_UNDERGRADUATE_DEGREES;
  };

  const toggleArrayItem = (field: keyof UserProfile, item: string) => {
    setProfile(prev => {
      const currentArray = (prev[field] as string[]) || [];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      return { ...prev, [field]: newArray };
    });
  };

  const handleComplete = () => {
    const newProfile: UserProfile = {
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
      bio: profile.bio || 'New here!',
      avatarColor: 'bg-primary'
    };
    onComplete(newProfile);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6 border-b border-border bg-card/50 shrink-0">
        <div className="flex items-center justify-center relative mb-6">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="absolute left-0 p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground"
            >
              <ChevronLeft size={24} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">First things first.</h2>
              <p className="text-muted-foreground mt-1">What should we call you on RUconnected?</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <Input
                  value={profile.name || ''}
                  onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Maya Cohen"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Your Academic Path</h2>
              <p className="text-muted-foreground mt-1">Tell us what you study.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">School</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {(['Israeli', 'International'] as SchoolType[]).map(s => (
                    <button
                      key={s}
                      onClick={() => setProfile(p => ({ ...p, school: s, degree: '' }))}
                      className={`p-4 rounded-xl border-2 transition-all text-center font-bold ${
                        profile.school === s
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Degree Level</label>
                  <select
                    value={profile.degreeLevel}
                    onChange={(e) => setProfile(p => ({ ...p, degreeLevel: e.target.value as DegreeLevel, degree: '' }))}
                    className="w-full mt-1 bg-card border border-border rounded-xl p-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Year</label>
                  <select
                    value={profile.year || 1}
                    onChange={(e) => setProfile(p => ({ ...p, year: Number(e.target.value) }))}
                    className="w-full mt-1 bg-card border border-border rounded-xl p-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Major / Degree</label>
                <select
                  value={profile.degree || ''}
                  onChange={(e) => setProfile(p => ({ ...p, degree: e.target.value }))}
                  className="w-full mt-1 bg-card border border-border rounded-xl p-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="">Select your degree...</option>
                  {getDegreeList(profile.school, profile.degreeLevel).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Campus Involvement</h2>
              <p className="text-muted-foreground mt-1">Are you part of any special programs or clubs?</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Special Programs</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      toggleArrayItem('specialPrograms', e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full mt-1 bg-card border border-border rounded-xl p-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="">Select Program...</option>
                  {[...SPECIAL_PROGRAMS_LIST].sort().map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(profile.specialPrograms || []).map(item => (
                    <span key={item} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                      {item}
                      <button onClick={() => toggleArrayItem('specialPrograms', item)} className="hover:text-destructive">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Clubs</label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      toggleArrayItem('clubs', e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full mt-1 bg-card border border-border rounded-xl p-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="">Select Club...</option>
                  {[...CLUBS_LIST].sort().map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(profile.clubs || []).map(item => (
                    <span key={item} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2">
                      {item}
                      <button onClick={() => toggleArrayItem('clubs', item)} className="hover:text-destructive">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Interests & Goals</h2>
              <p className="text-muted-foreground mt-1">What are you looking for on campus?</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">I'm looking for...</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {LOOKING_FOR_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleArrayItem('lookingFor', opt)}
                      className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                        profile.lookingFor?.includes(opt)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">My Interests</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {INTERESTS_LIST.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleArrayItem('interests', interest)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        profile.interests?.includes(interest)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card/30 text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Your Bio</h2>
              <p className="text-muted-foreground mt-1">Introduce yourself to the community.</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">About Me</label>
              <Textarea
                value={profile.bio || ''}
                onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                placeholder="Tell the community a bit about yourself..."
                className="mt-1 min-h-[150px]"
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-border bg-card/50 shrink-0">
        <Button
          onClick={() => {
            if (step < 4) setStep(s => s + 1);
            else handleComplete();
          }}
          disabled={step === 0 && !profile.name}
          className="w-full"
          size="lg"
        >
          {step === 4 ? 'Finish & Start Exploring' : 'Continue'}
          <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
};
