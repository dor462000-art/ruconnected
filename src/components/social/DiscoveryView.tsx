import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserProfile, ViewType } from '@/types/social';
import { MOCK_USERS } from '@/constants/social';

interface DiscoveryViewProps {
  currentUser: UserProfile;
  onNavigate: (view: ViewType) => void;
  onConnect: (userId: string, userName: string) => void;
  onMessage: (userName: string) => void;
  connections: Set<string>;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  currentUser,
  onNavigate,
  onConnect,
  onMessage,
  connections
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = MOCK_USERS.filter(u =>
    u.id !== currentUser.id &&
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
     u.bio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="p-6 bg-card/50 backdrop-blur-md sticky top-0 z-20 border-b border-border">
        <div className="flex justify-center items-center mb-6 relative">
          <h1 className="text-xl font-bold tracking-tight">RUconnected</h1>
          <button
            onClick={() => onNavigate('profile')}
            className="absolute right-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold overflow-hidden shadow-lg border-2 border-primary/50 hover:scale-105 transition-transform"
          >
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="Me" className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary-foreground">{currentUser.name.charAt(0)}</span>
            )}
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <Input
            placeholder="Search people, majors, clubs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div
              key={user.id}
              className="bg-card border border-border rounded-3xl p-6 flex flex-col hover:border-primary/50 transition-all shadow-xl group"
            >
              <div className="flex gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl ${user.avatarColor} flex items-center justify-center text-xl font-bold overflow-hidden shrink-0 shadow-inner`}>
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white">{user.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{user.name}</h3>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{user.degree}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">{user.bio}</p>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {user.interests.slice(0, 3).map(i => (
                  <span key={i} className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    #{i}
                  </span>
                ))}
              </div>
              <div className="mt-auto grid grid-cols-2 gap-3">
                <Button
                  onClick={() => onConnect(user.id, user.name)}
                  disabled={connections.has(user.id)}
                  variant={connections.has(user.id) ? 'secondary' : 'default'}
                  className="font-bold"
                >
                  {connections.has(user.id) ? 'Pending' : 'Connect'}
                </Button>
                <Button
                  onClick={() => onMessage(user.name)}
                  variant="outline"
                  className="font-bold"
                >
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
