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
    <div className="flex flex-col h-full pb-20">
      {/* Header with value proposition */}
      <div className="p-6 bg-card/50 backdrop-blur-md sticky top-0 z-20 border-b border-border">
        <div className="flex justify-center items-center mb-4 relative">
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight">RUconnected</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Find your perfect study partner or co-founder</p>
          </div>
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

        {/* Quick tips banner */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4 flex items-start gap-3">
          <Lightbulb size={18} className="text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-foreground/80">
            <span className="font-semibold text-primary">Pro tip:</span> Students with shared interests appear first. Connect with them to start messaging or create group projects!
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
          <Input
            placeholder="Search by name, major, or interests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => {
            const sharedInterests = getSharedInterests(user);
            const matchScore = getMatchScore(user);
            const isConnected = connections.has(user.id);

            return (
              <div
                key={user.id}
                className="bg-card border border-border rounded-3xl p-6 flex flex-col hover:border-primary/50 transition-all shadow-xl group"
              >
                {/* Match indicator */}
                {matchScore > 3 && (
                  <div className="flex items-center gap-1.5 mb-3 text-primary">
                    <Sparkles size={14} />
                    <span className="text-xs font-bold">Great match!</span>
                  </div>
                )}

                <div className="flex gap-4 mb-4">
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl ${user.avatarColor} flex items-center justify-center text-xl font-bold overflow-hidden shrink-0 shadow-inner`}>
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white">{user.name.charAt(0)}</span>
                      )}
                    </div>
                    {user.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{user.name}</h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{user.degree}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Year {user.year} • {user.school}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{user.bio}</p>

                {/* Looking for */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1.5 font-medium">Looking for:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.lookingFor.map(l => (
                      <span 
                        key={l} 
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
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
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {user.interests.slice(0, 4).map(i => (
                    <Tooltip key={i}>
                      <TooltipTrigger>
                        <span 
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
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
                  {user.interests.length > 4 && (
                    <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] text-muted-foreground">
                      +{user.interests.length - 4}
                    </span>
                  )}
                </div>

                <div className="mt-auto grid grid-cols-2 gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => onConnect(user.id, user.name)}
                        disabled={isConnected}
                        variant={isConnected ? 'secondary' : 'default'}
                        className="font-bold"
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
                        className="font-bold"
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
          <div className="text-center py-12">
            <Users size={48} className="mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">No students found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
};
