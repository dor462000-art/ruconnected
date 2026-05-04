import React, { useState } from 'react';
import { Search, Sparkles, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserProfile, ViewType } from '@/types/social';
import { MOCK_USERS } from '@/constants/social';
import { InitialsAvatar } from './InitialsAvatar';

interface DiscoveryViewProps {
  currentUser: UserProfile;
  onNavigate: (view: ViewType) => void;
  onConnect: (userId: string, userName: string) => void;
  onStartChat: (userId: string, userName: string) => void;
  connections: Set<string>;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  currentUser,
  onNavigate,
  onConnect,
  onStartChat,
  connections,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const score = (u: UserProfile) => {
    let s = 0;
    s += u.interests.filter(i => currentUser.interests.includes(i)).length * 2;
    s += u.lookingFor.filter(l => currentUser.lookingFor.includes(l)).length * 3;
    if (u.school === currentUser.school) s += 1;
    return s;
  };

  const filtered = MOCK_USERS
    .filter(u =>
      u.id !== currentUser.id &&
      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       u.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
       u.interests.some(i => i.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => score(b) - score(a));

  return (
    <div className="flex flex-col h-[100dvh] pb-24">
      <header className="px-4 pt-4 pb-3 sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Connect</h1>
            <p className="text-xs text-muted-foreground">Suggested students for you</p>
          </div>
          <button onClick={() => onNavigate('profile')}>
            <InitialsAvatar name={currentUser.name} size={36} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search name, major, interests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 rounded-full bg-muted border-0"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.map(user => {
          const sharedInterests = user.interests.filter(i => currentUser.interests.includes(i));
          const isConnected = connections.has(user.id);
          const matchScore = score(user);
          return (
            <div key={user.id} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <InitialsAvatar name={user.name} size={52} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{user.name}</h3>
                    {matchScore > 3 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                        <Sparkles size={10} /> Match
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.degree} · Year {user.year}</p>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {user.lookingFor.slice(0, 3).map(l => (
                      <span key={l} className="px-2 py-0.5 bg-muted text-foreground rounded-full text-[11px] font-medium">
                        {l}
                      </span>
                    ))}
                  </div>

                  {sharedInterests.length > 0 && (
                    <p className="text-xs text-primary font-medium mt-2">
                      You share: {sharedInterests.slice(0, 3).map(i => `#${i}`).join(' ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3">
                <Button
                  onClick={() => onConnect(user.id, user.name)}
                  disabled={isConnected}
                  variant={isConnected ? 'secondary' : 'default'}
                  size="sm"
                  className="rounded-full font-semibold"
                >
                  {isConnected ? 'Connected' : 'Connect'}
                </Button>
                <Button
                  onClick={() => onStartChat(user.id, user.name)}
                  variant="outline"
                  size="sm"
                  className="rounded-full font-semibold"
                  disabled={!isConnected}
                >
                  Message
                </Button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Users size={36} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No students found</p>
          </div>
        )}
      </div>
    </div>
  );
};
