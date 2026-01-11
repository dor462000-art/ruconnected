import React from 'react';
import { Users, Plus, Hash, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile, GroupChat } from '@/types/social';
import { MOCK_USERS } from '@/constants/social';

interface GroupChatsViewProps {
  currentUser: UserProfile;
  groups: GroupChat[];
  onCreateGroup: () => void;
  onSelectGroup: (groupId: string) => void;
}

export const GroupChatsView: React.FC<GroupChatsViewProps> = ({
  currentUser,
  groups,
  onCreateGroup,
  onSelectGroup
}) => {
  const getGroupMembers = (group: GroupChat) => {
    return group.participantIds
      .map(id => MOCK_USERS.find(u => u.id === id))
      .filter(Boolean);
  };

  return (
    <div className="flex flex-col h-full pb-20">
      <div className="p-6 border-b border-border bg-card/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Group Chats</h1>
            <p className="text-sm text-muted-foreground mt-1">Connect with groups that share your interests</p>
          </div>
          <Button onClick={onCreateGroup} size="sm" className="gap-2">
            <Plus size={16} />
            Create
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users size={32} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold mb-2">No Groups Yet</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Create a group chat to collaborate with other students on projects, hobbies, or study sessions.
            </p>
            <Button onClick={onCreateGroup} className="gap-2">
              <Plus size={18} />
              Create Your First Group
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map(group => {
              const members = getGroupMembers(group);
              const lastMessage = group.messages[group.messages.length - 1];
              
              return (
                <button
                  key={group.id}
                  onClick={() => onSelectGroup(group.id)}
                  className="w-full bg-card border border-border rounded-2xl p-4 hover:border-primary/50 transition-all text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      <Hash size={24} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold truncate">{group.name}</h3>
                        <ChevronRight size={18} className="text-muted-foreground shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                        {group.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex -space-x-2">
                          {members.slice(0, 4).map((member, i) => (
                            <div
                              key={member!.id}
                              className="w-6 h-6 rounded-full border-2 border-card overflow-hidden bg-muted"
                              style={{ zIndex: 4 - i }}
                            >
                              {member!.avatarUrl ? (
                                <img src={member!.avatarUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                                  {member!.name.charAt(0)}
                                </div>
                              )}
                            </div>
                          ))}
                          {members.length > 4 && (
                            <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold">
                              +{members.length - 4}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {group.participantIds.length} members
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {group.interests.slice(0, 3).map(interest => (
                          <span
                            key={interest}
                            className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px] font-bold"
                          >
                            #{interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
