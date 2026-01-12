import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, User, GraduationCap, Heart, Sparkles, Edit2, Lightbulb, Target } from 'lucide-react';
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
  LOOKING_FOR_OPTIONS,
  SKILLS_LIST,
  AVAILABILITY_OPTIONS,
  GROUP_SIZE_OPTIONS
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
    volunteering: [],
    skills: [],
    availability: '',
    preferredGroupSize: ''
  });

  const steps = [
    { title: 'Welcome', icon: Sparkles },
    { title: 'Identity', icon: User },
    { title: 'Academic', icon: GraduationCap },
    { title: 'Involvement', icon: Heart },
    { title: 'Goals', icon: Target },
    { title: 'Skills', icon: Lightbulb },
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
      avatarColor: 'bg-primary',
      skills: profile.skills || [],
      projectIdeas: profile.projectIdeas || '',
      availability: profile.availability || '',
      preferredGroupSize: profile.preferredGroupSize || ''
    };
    onComplete(newProfile);
  };

  const canProceed = () => {
    if (step === 1) return (profile.name?.trim().length || 0) >= 2;
    if (step === 2) return !!profile.degree;
    if (step === 4) return (profile.lookingFor?.length || 0) > 0;
    return true;
  };

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border bg-card/50 shrink-0">
        <div className="flex items-center justify-center relative mb-4">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="absolute left-0 p-1.5 hover:bg-accent rounded-full transition-colors text-muted-foreground"
            >
              <ChevronLeft size={22} />
            </button>
          )}
        </div>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="space-y-6 max-w-md mx-auto text-center py-8">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Sparkles size={36} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome to RUconnected!</h2>
              <p className="text-muted-foreground mt-2">
                The exclusive platform for Reichman University students to connect, collaborate, and build together.
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-2xl p-6 text-left space-y-4">
              <h3 className="font-bold text-lg">Here's what you can do:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Find Study Partners</p>
                    <p className="text-sm text-muted-foreground">Connect with classmates in your courses</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Target size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Build Projects Together</p>
                    <p className="text-sm text-muted-foreground">Find co-founders and team members for your ideas</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Heart size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Share Your Interests</p>
                    <p className="text-sm text-muted-foreground">Meet people who love what you love</p>
                  </div>
                </li>
              </ul>
            </div>

            <p className="text-sm text-muted-foreground">
              Let's set up your profile so we can match you with the right people.
            </p>
          </div>
        )}

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">First things first</h2>
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
                <p className="text-xs text-muted-foreground mt-1">This is how other students will see you</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Age</label>
                <Input
                  type="number"
                  min={18}
                  max={40}
                  value={profile.age || ''}
                  onChange={(e) => setProfile(p => ({ ...p, age: Number(e.target.value) }))}
                  placeholder="e.g. 21"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Your Academic Path</h2>
              <p className="text-muted-foreground mt-1">This helps us match you with relevant students</p>
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

        {/* Step 3: Involvement */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Campus Involvement</h2>
              <p className="text-muted-foreground mt-1">Are you part of any programs or clubs? (Optional)</p>
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

        {/* Step 4: Goals & Interests */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">What are you looking for?</h2>
              <p className="text-muted-foreground mt-1">This helps us match you with the right people</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">I'm looking for... *</label>
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
                <p className="text-xs text-muted-foreground mb-2">Select interests to find like-minded students</p>
                <div className="flex flex-wrap gap-2">
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

              <div>
                <label className="text-sm font-medium text-muted-foreground">Any project ideas? (Optional)</label>
                <Textarea
                  value={profile.projectIdeas || ''}
                  onChange={(e) => setProfile(p => ({ ...p, projectIdeas: e.target.value }))}
                  placeholder="e.g., Building an app to help students find study spaces, Starting a podcast about entrepreneurship..."
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Share your ideas to attract potential collaborators</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Skills & Availability */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Your Skills & Availability</h2>
              <p className="text-muted-foreground mt-1">Help others know what you bring to the table</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">My Skills</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SKILLS_LIST.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleArrayItem('skills', skill)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        profile.skills?.includes(skill)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card/30 text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Availability for Projects</label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {AVAILABILITY_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setProfile(p => ({ ...p, availability: opt }))}
                      className={`p-3 rounded-xl border text-sm font-medium text-left transition-all ${
                        profile.availability === opt
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Preferred Group Size</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {GROUP_SIZE_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setProfile(p => ({ ...p, preferredGroupSize: opt }))}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        profile.preferredGroupSize === opt
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Bio */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Your Bio</h2>
              <p className="text-muted-foreground mt-1">Introduce yourself to the community</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">About Me</label>
              <Textarea
                value={profile.bio || ''}
                onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                placeholder="Tell the community a bit about yourself... What makes you unique? What are you passionate about?"
                className="mt-1 min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tip: Mention what you're working on or looking to learn!
              </p>
            </div>

            {/* Preview */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-2">Profile Preview</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {(profile.name || 'A').charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold">{profile.name || 'Your Name'}</h3>
                  <p className="text-xs text-muted-foreground">{profile.degree || 'Your Degree'}</p>
                </div>
              </div>
              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{profile.bio}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-border bg-card/50 shrink-0">
        <Button
          onClick={() => {
            if (step < 6) setStep(s => s + 1);
            else handleComplete();
          }}
          disabled={!canProceed()}
          className="w-full"
          size="lg"
        >
          {step === 6 ? 'Finish & Start Exploring' : 'Continue'}
          <ArrowRight className="ml-2" size={20} />
        </Button>
        {step > 0 && step < 6 && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            Step {step} of {steps.length - 1}
          </p>
        )}
      </div>
    </div>
  );
};
