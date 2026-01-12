import React, { useState } from 'react';
import { Search, Lightbulb, Users, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserProfile, ViewType } from '@/types/social';
import { MOCK_USERS } from '@/constants/social';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  connections
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate match score based on shared interests and goals
  const getMatchScore = (user: UserProfile) => {
    let score = 0;
    const sharedInterests = user.interests.filter(i => currentUser.interests.includes(i));
    const sharedGoals = user.lookingFor.filter(l => currentUser.lookingFor.includes(l));
    score += sharedInterests.length * 2;
    score += sharedGoals.length * 3;
    if (user.school === currentUser.school) score += 1;
    if (user.degreeLevel === currentUser.degreeLevel) score += 1;
    return score;
  };

  const filteredUsers = MOCK_USERS
    .filter(u =>
      u.id !== currentUser.id &&
      (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       u.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
       u.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
       u.interests.some(i => i.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => getMatchScore(b) - getMatchScore(a));

  const getSharedInterests = (user: UserProfile) => {
    return user.interests.filter(i => currentUser.interests.includes(i));
  };

  return (
    <div className="flex flex-col h-[100dvh] pb-20">
      {/* Header with value proposition */}
      <div className="p-4 bg-card/50 backdrop-blur-md sticky top-0 z-20 border-b border-border shrink-0">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight">RUconnected</h1>
            <p className="text-[12px] text-muted-foreground">Find your study partner or co-founder</p>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-bold overflow-hidden shadow-lg border-2 border-primary/50 hover:scale-105 transition-transform"
          >
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="Me" className="w-full h-full object-cover" />
            ) : (
              <span className="text-primary-foreground text-sm">{currentUser.name.charAt(0)}</span>
            )}
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-muted-foreground" size={16} />
          <Input
            placeholder="Search name, major, interests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(user => {
            const sharedInterests = getSharedInterests(user);
            const matchScore = getMatchScore(user);
            const isConnected = connections.has(user.id);

            return (
              <div
                key={user.id}
                className="bg-card border border-border rounded-2xl p-4 flex flex-col hover:border-primary/50 transition-all shadow-lg group"
              >
                {/* Match indicator */}
                {matchScore > 3 && (
                  <div className="flex items-center gap-1.5 mb-2 text-primary">
                    <Sparkles size={12} />
                    <span className="text-[11px] font-bold">Great match!</span>
                  </div>
                )}

                <div className="flex gap-3 mb-3">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl ${user.avatarColor} flex items-center justify-center text-lg font-bold overflow-hidden shrink-0 shadow-inner`}>
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white">{user.name.charAt(0)}</span>
                      )}
                    </div>
                    {user.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base group-hover:text-primary transition-colors truncate">{user.name}</h3>
                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider truncate">{user.degree}</p>
                    <p className="text-[11px] text-muted-foreground">Year {user.year} • {user.school}</p>
                  </div>
                </div>

                <p className="text-[13px] text-muted-foreground mb-3 line-clamp-2 leading-snug">{user.bio}</p>

                {/* Looking for */}
                <div className="mb-3">
                  <p className="text-[11px] text-muted-foreground mb-1 font-medium">Looking for:</p>
                  <div className="flex flex-wrap gap-1">
                    {user.lookingFor.map(l => (
                      <span 
                        key={l} 
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          currentUser.lookingFor.includes(l)
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interests with shared highlighted */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {user.interests.slice(0, 3).map(i => (
                    <Tooltip key={i}>
                      <TooltipTrigger>
                        <span 
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            sharedInterests.includes(i)
                              ? 'bg-primary/20 text-primary border border-primary/30'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          #{i}
                        </span>
                      </TooltipTrigger>
                      {sharedInterests.includes(i) && (
                        <TooltipContent side="top" className="text-xs">
                          You both share this interest!
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                  {user.interests.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-muted rounded text-[9px] text-muted-foreground">
                      +{user.interests.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => onConnect(user.id, user.name)}
                        disabled={isConnected}
                        variant={isConnected ? 'secondary' : 'default'}
                        size="sm"
                        className="font-bold text-[13px]"
                      >
                        {isConnected ? 'Connected' : 'Connect'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      {isConnected ? 'You\'re connected!' : 'Send a connection request'}
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => onStartChat(user.id, user.name)}
                        variant="outline"
                        size="sm"
                        className="font-bold text-[13px]"
                        disabled={!isConnected}
                      >
                        Message
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      {isConnected ? 'Start a conversation' : 'Connect first to message'}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users size={40} className="mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-base font-medium text-muted-foreground">No students found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
};
