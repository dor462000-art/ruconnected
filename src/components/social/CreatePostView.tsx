import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UserProfile, Post, PostType } from '@/types/social';
import { POST_TYPES } from '@/constants/social';
import { InitialsAvatar } from './InitialsAvatar';

interface CreatePostViewProps {
  currentUser: UserProfile;
  onBack: () => void;
  onPost: (post: Post) => void;
}

export const CreatePostView: React.FC<CreatePostViewProps> = ({ currentUser, onBack, onPost }) => {
  const [type, setType] = useState<PostType>('Looking for partners');
  const [text, setText] = useState('');

  const handlePost = () => {
    if (!text.trim()) return;
    onPost({
      id: crypto.randomUUID(),
      authorId: currentUser.id,
      type,
      text: text.trim(),
      createdAt: new Date(),
      likes: [],
      comments: [],
    });
  };

  const placeholders: Record<PostType, string> = {
    'Looking for partners': "I'm looking for someone to...",
    'Project idea': 'My idea: a platform that...',
    'Question': 'Quick question — does anyone know...',
    'Social': 'Anyone want to grab coffee at...',
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-bold flex-1">New post</h1>
        <Button
          onClick={handlePost}
          disabled={!text.trim()}
          className="rounded-full px-5"
          size="sm"
        >
          <Send size={16} className="mr-1" />
          Post
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center gap-3 mb-4">
          <InitialsAvatar name={currentUser.name} size={44} />
          <div>
            <p className="font-semibold">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">Posting publicly to RUconnected</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Post type</p>
          <div className="flex flex-wrap gap-2">
            {POST_TYPES.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  type === t
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:border-primary/40'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholders[type]}
          className="min-h-[180px] text-base resize-none border-0 focus-visible:ring-0 px-0 shadow-none"
          autoFocus
        />
      </div>
    </div>
  );
};
