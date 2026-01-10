import React, { useState } from 'react';
import { GraduationCap, Sparkles, Settings, Edit2, Camera, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserProfile, SchoolType, DegreeLevel } from '@/types/social';
import {
  INTERNATIONAL_UNDERGRADUATE_DEGREES,
  INTERNATIONAL_GRADUATE_DEGREES,
  ISRAELI_UNDERGRADUATE_DEGREES,
  ISRAELI_GRADUATE_DEGREES
} from '@/constants/social';

interface ProfileViewProps {
  user: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>(user);

  const getDegreeList = (school?: SchoolType, level?: DegreeLevel) => {
    if (!school || !level) return [];
    if (school === 'International') {
      return level === 'Graduate' ? INTERNATIONAL_GRADUATE_DEGREES : INTERNATIONAL_UNDERGRADUATE_DEGREES;
    }
    return level === 'Graduate' ? ISRAELI_GRADUATE_DEGREES : ISRAELI_UNDERGRADUATE_DEGREES;
  };

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col h-full bg-background pb-20">
      <div className="p-6 border-b border-border bg-card/50 sticky top-0 z-20 flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Account</h1>
        {!isEditing && (
          <button
            onClick={() => {
              setEditData(user);
              setIsEditing(true);
            }}
            className="p-2 bg-muted rounded-full hover:bg-accent transition-colors"
          >
            <Edit2 size={20} className="text-primary" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header Card */}
          <div className="bg-card border border-border rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-full h-24 bg-gradient-to-r from-primary to-primary/50 absolute top-0 left-0 opacity-20"></div>
            <div className="w-24 h-24 rounded-full bg-muted border-4 border-background shadow-2xl z-10 -mt-2 flex items-center justify-center text-3xl font-bold overflow-hidden relative group">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Me" className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary">{user.name.charAt(0)}</span>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer">
                  <Camera size={24} className="text-white" />
                </div>
              )}
            </div>
            <div className="mt-4 z-10">
              {isEditing ? (
                <Input
                  value={editData.name}
                  onChange={e => setEditData(p => ({ ...p, name: e.target.value }))}
                  className="text-center font-bold text-xl max-w-xs"
                />
              ) : (
                <h2 className="text-2xl font-bold">{user.name}</h2>
              )}
              <p className="text-muted-foreground font-bold uppercase text-xs tracking-wider mt-1">{user.degree}</p>
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
              <GraduationCap className="text-primary" size={20} />
              <h3 className="font-bold text-lg">Academic Info</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">School</label>
                {isEditing ? (
                  <select
                    value={editData.school}
                    onChange={e => setEditData(p => ({ ...p, school: e.target.value as SchoolType }))}
                    className="w-full bg-muted border border-border rounded-lg p-2 text-sm"
                  >
                    <option value="Israeli">Israeli</option>
                    <option value="International">International</option>
                  </select>
                ) : (
                  <div className="text-foreground font-medium">{user.school} School</div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Year</label>
                {isEditing ? (
                  <select
                    value={editData.year}
                    onChange={e => setEditData(p => ({ ...p, year: Number(e.target.value) }))}
                    className="w-full bg-muted border border-border rounded-lg p-2 text-sm"
                  >
                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                ) : (
                  <div className="text-foreground font-medium">Year {user.year}</div>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Major</label>
              {isEditing ? (
                <select
                  value={editData.degree}
                  onChange={e => setEditData(p => ({ ...p, degree: e.target.value }))}
                  className="w-full bg-muted border border-border rounded-lg p-2 text-sm"
                >
                  {getDegreeList(editData.school || user.school, editData.degreeLevel || user.degreeLevel).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              ) : (
                <div className="text-foreground font-medium">{user.degree}</div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
              <Sparkles className="text-primary" size={20} />
              <h3 className="font-bold text-lg">Bio</h3>
            </div>
            {isEditing ? (
              <Textarea
                value={editData.bio}
                onChange={e => setEditData(p => ({ ...p, bio: e.target.value }))}
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
            )}
          </div>

          {/* Settings */}
          <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
              <Settings className="text-muted-foreground" size={20} />
              <h3 className="font-bold text-lg text-foreground">Settings</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="text-sm font-medium">Notifications</span>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                <span className="text-sm font-medium">Profile Visibility</span>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {isEditing ? (
            <div className="flex gap-4">
              <Button onClick={() => setIsEditing(false)} variant="secondary" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={onLogout} variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive/10">
              <LogOut size={18} className="mr-2" />
              Log Out
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
