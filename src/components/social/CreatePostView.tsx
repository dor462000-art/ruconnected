import React, { useState } from 'react';
import { ArrowLeft, Send, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleAt, setScheduleAt] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [visibility, setVisibility] = useState<'Public' | 'Connections' | 'Group'>('Public');
  const [allowComments, setAllowComments] = useState(true);
  const [notifyFollowers, setNotifyFollowers] = useState(true);

  const handlePost = () => {
    if (!text.trim()) return;
    onPost({
      id: crypto.randomUUID(),
      authorId: currentUser.id,
      type,
      text: text.trim(),
      createdAt: scheduleEnabled && scheduleAt ? new Date(scheduleAt) : new Date(),
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

  const isScheduled = scheduleEnabled && scheduleAt;

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-muted">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-bold flex-1">New Post</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        <div className="flex items-center gap-3 mb-4">
          <InitialsAvatar name={currentUser.name} size={44} />
          <div>
            <p className="font-semibold">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">Posting publicly to RUconnected</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Post Type</p>
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
          className="min-h-[200px] text-base resize-none rounded-2xl border border-border bg-background p-4"
          autoFocus
        />
        <p className="text-xs text-muted-foreground mt-2">{text.length} characters</p>

        {/* Schedule Post */}
        <div className="mt-6 rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-primary" />
              <div>
                <p className="font-semibold text-sm">Schedule Post</p>
                <p className="text-xs text-muted-foreground">Publish later automatically</p>
              </div>
            </div>
            <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
          </div>
          {scheduleEnabled && (
            <input
              type="datetime-local"
              value={scheduleAt}
              onChange={(e) => setScheduleAt(e.target.value)}
              className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />
          )}
        </div>

        {/* Advanced Settings */}
        <div className="mt-3 rounded-2xl border border-border overflow-hidden">
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/40 transition-colors"
          >
            <span className="font-semibold text-sm">Advanced Settings</span>
            {advancedOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {advancedOpen && (
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Visibility</p>
                <div className="flex flex-wrap gap-2">
                  {(['Public', 'Connections', 'Group'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setVisibility(v)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        visibility === v
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background text-foreground border-border'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Allow Comments</p>
                <Switch checked={allowComments} onCheckedChange={setAllowComments} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm">Notify Followers</p>
                <Switch checked={notifyFollowers} onCheckedChange={setNotifyFollowers} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom centered post button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8 flex justify-center">
        <Button
          onClick={handlePost}
          disabled={!text.trim() || (scheduleEnabled && !scheduleAt)}
          className="rounded-full px-10 h-12 text-base shadow-lg"
        >
          <Send size={18} className="mr-2" />
          {isScheduled ? 'Schedule Post' : 'Post'}
        </Button>
      </div>
    </div>
  );
};
