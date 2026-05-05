import React, { useState } from 'react';
import { GraduationCap, Edit2, LogOut, Sparkles, Save, X, HandHeart, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserProfile, SchoolType, DegreeLevel } from '@/types/social';
import {
  INTERNATIONAL_UNDERGRADUATE_DEGREES,
  INTERNATIONAL_GRADUATE_DEGREES,
  ISRAELI_UNDERGRADUATE_DEGREES,
  ISRAELI_GRADUATE_DEGREES,
  VOLUNTEERING_LIST,
} from '@/constants/social';
import { InitialsAvatar } from './InitialsAvatar';

interface ProfileViewProps {
  user: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate, onLogout }) => {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState<Partial<UserProfile>>(user);
  const [volOpen, setVolOpen] = useState(false);

  const toggleVolunteering = (item: string) => {
    setData(prev => {
      const arr = prev.volunteering || [];
      return { ...prev, volunteering: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item] };
    });
  };

  const getDegreeList = (school?: SchoolType, level?: DegreeLevel) => {
    if (!school || !level) return [];
    if (school === 'International') {
      return level === 'Graduate' ? INTERNATIONAL_GRADUATE_DEGREES : INTERNATIONAL_UNDERGRADUATE_DEGREES;
    }
    return level === 'Graduate' ? ISRAELI_GRADUATE_DEGREES : ISRAELI_UNDERGRADUATE_DEGREES;
  };

  const save = () => {
    onUpdate(data);
    setEditing(false);
  };

  return (
    <div className="flex flex-col h-[100dvh] pb-24">
      <header className="flex items-center justify-between px-4 py-4 border-b border-border">
        <h1 className="text-2xl font-extrabold">Profile</h1>
        {editing ? (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => { setData(user); setEditing(false); }}>
              <X size={18} />
            </Button>
            <Button size="sm" onClick={save} className="rounded-full">
              <Save size={16} className="mr-1" /> Save
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => { setData(user); setEditing(true); }} className="rounded-full">
            <Edit2 size={16} className="mr-1" /> Edit
          </Button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Header card */}
        <div className="flex flex-col items-center text-center">
          <InitialsAvatar name={data.name || user.name} size={96} />
          {editing ? (
            <Input
              value={data.name || ''}
              onChange={e => setData(p => ({ ...p, name: e.target.value }))}
              className="mt-4 text-center font-bold text-xl max-w-xs h-12 rounded-xl"
            />
          ) : (
            <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
          )}
          <p className="text-sm text-muted-foreground mt-1">{user.degree}</p>
        </div>

        {/* Academic info */}
        <section className="border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={18} className="text-primary" />
            <h3 className="font-bold">Academic info</h3>
          </div>
          <div className="space-y-3 text-sm">
            <Field label="School">
              {editing ? (
                <select
                  value={data.school}
                  onChange={e => setData(p => ({ ...p, school: e.target.value as SchoolType }))}
                  className="w-full bg-background border border-border rounded-lg p-2"
                >
                  <option value="Israeli">Israeli</option>
                  <option value="International">International</option>
                </select>
              ) : <p className="font-medium">{user.school}</p>}
            </Field>
            <Field label="Year">
              {editing ? (
                <select
                  value={data.year}
                  onChange={e => setData(p => ({ ...p, year: Number(e.target.value) }))}
                  className="w-full bg-background border border-border rounded-lg p-2"
                >
                  {[1, 2, 3, 4].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              ) : <p className="font-medium">Year {user.year}</p>}
            </Field>
            <Field label="Degree">
              {editing ? (
                <select
                  value={data.degree}
                  onChange={e => setData(p => ({ ...p, degree: e.target.value }))}
                  className="w-full bg-background border border-border rounded-lg p-2"
                >
                  {getDegreeList(data.school || user.school, data.degreeLevel || user.degreeLevel).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              ) : <p className="font-medium">{user.degree}</p>}
            </Field>
          </div>
        </section>

        {/* Bio */}
        <section className="border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <h3 className="font-bold">About me</h3>
          </div>
          {editing ? (
            <Textarea
              value={data.bio || ''}
              onChange={e => setData(p => ({ ...p, bio: e.target.value }))}
              placeholder="Tell others about yourself..."
              className="min-h-[100px]"
            />
          ) : (
            <p className="text-muted-foreground leading-relaxed text-sm">
              {user.bio || 'No bio yet — tap edit to add one.'}
            </p>
          )}
        </section>

        {/* Interests */}
        {user.interests.length > 0 && (
          <section className="border border-border rounded-2xl p-5">
            <h3 className="font-bold mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map(i => (
                <span key={i} className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-semibold">
                  #{i}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Volunteering (collapsible, optional) */}
        <section className="border border-border rounded-2xl overflow-hidden">
          <button
            onClick={() => setVolOpen(o => !o)}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition-colors"
          >
            <HandHeart size={18} className="text-primary" />
            <div className="flex-1 text-left">
              <p className="font-bold">Volunteering</p>
              <p className="text-xs text-muted-foreground">Optional</p>
            </div>
            {volOpen ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
          </button>
          {volOpen && (
            <div className="px-5 pb-5">
              {editing ? (
                <>
                  <select
                    onChange={(e) => { if (e.target.value) { toggleVolunteering(e.target.value); e.target.value = ''; } }}
                    className="w-full bg-background border border-border rounded-lg p-2 text-sm"
                  >
                    <option value="">Add volunteering...</option>
                    {VOLUNTEERING_LIST.filter(v => !(data.volunteering || []).includes(v)).map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(data.volunteering || []).map(item => (
                      <span key={item} className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs flex items-center gap-2">
                        {item}
                        <button onClick={() => toggleVolunteering(item)}>×</button>
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                (user.volunteering || []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No volunteering yet — tap edit to add.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(user.volunteering || []).map(v => (
                      <span key={v} className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-semibold">
                        {v}
                      </span>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <Button onClick={onLogout} variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/5 rounded-xl">
          <LogOut size={18} className="mr-2" /> Log out
        </Button>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
    {children}
  </div>
);
