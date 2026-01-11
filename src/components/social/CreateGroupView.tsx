import React, { useState } from 'react';
import { ArrowLeft, Check, X, Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserProfile, GroupChat } from '@/types/social';
import { MOCK_USERS, INTERESTS_LIST } from '@/constants/social';

interface CreateGroupViewProps {
  currentUser: UserProfile;
  connections: Set<string>;
  onBack: () => void;
  onCreate: (group: GroupChat) => void;
}

export const CreateGroupView: React.FC<CreateGroupViewProps> = ({
  currentUser,
  connections,
  onBack,
  onCreate
}) => {
  const [step, setStep] = useState(0);
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const connectedUsers = MOCK_USERS.filter(u => 
    connections.has(u.id) && u.id !== currentUser.id
  );

  const filteredUsers = connectedUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = () => {
    const newGroup: GroupChat = {
      id: crypto.randomUUID(),
      name: groupName,
      description,
      participantIds: [currentUser.id, ...selectedMembers],
      createdBy: currentUser.id,
      interests: selectedInterests,
      messages: [],
      createdAt: new Date()
    };
    onCreate(newGroup);
  };

  const canProceed = () => {
    if (step === 0) return groupName.trim().length >= 3;
    if (step === 1) return selectedInterests.length > 0;
    if (step === 2) return selectedMembers.length >= 1;
    return true;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 border-b border-border bg-card/50 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold">Create Group Chat</h1>
          <p className="text-xs text-muted-foreground">Step {step + 1} of 3</p>
        </div>
      </div>

      <div className="flex gap-2 px-4 pt-4">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Name Your Group</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Choose a name that describes your group's purpose
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Group Name</label>
                <Input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., CS Project Team, Tennis Players..."
                  className="mt-1"
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground mt-1">{groupName.length}/50</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description (optional)</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this group about?"
                  className="mt-1"
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground mt-1">{description.length}/200</p>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Group Interests</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Select interests that match your group's focus
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS_LIST.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    selectedInterests.includes(interest)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            {selectedInterests.length > 0 && (
              <p className="text-sm text-primary">
                {selectedInterests.length} interest{selectedInterests.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold">Add Members</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Add people from your connections to the group
              </p>
            </div>

            {connectedUsers.length === 0 ? (
              <div className="text-center p-8 bg-card rounded-2xl border border-border">
                <Users size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">
                  You need to connect with other students first before creating a group.
                </p>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search connections..."
                    className="pl-10"
                  />
                </div>

                <div className="space-y-2">
                  {filteredUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => toggleMember(user.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        selectedMembers.includes(user.id)
                          ? 'bg-primary/10 border-2 border-primary'
                          : 'bg-card border-2 border-transparent hover:border-primary/30'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center shrink-0">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-primary-foreground font-bold">{user.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-xs text-muted-foreground">{user.degree}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedMembers.includes(user.id)
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {selectedMembers.includes(user.id) && (
                          <Check size={14} className="text-primary-foreground" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedMembers.length > 0 && (
                  <p className="text-sm text-primary">
                    {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-border bg-card/50">
        <Button
          onClick={() => {
            if (step < 2) setStep(s => s + 1);
            else handleCreate();
          }}
          disabled={!canProceed()}
          className="w-full"
          size="lg"
        >
          {step === 2 ? 'Create Group' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};
