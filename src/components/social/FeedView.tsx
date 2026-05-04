import React, { useState } from 'react';
import { Heart, MessageCircle, Sparkles, HelpCircle, Lightbulb, Coffee, Filter } from 'lucide-react';
import { UserProfile, Post, PostType } from '@/types/social';
import { MOCK_USERS, POST_TYPES } from '@/constants/social';
import { InitialsAvatar } from './InitialsAvatar';

interface FeedViewProps {
  currentUser: UserProfile;
  posts: Post[];
  onLike: (postId: string) => void;
  onOpenProfile: () => void;
}

const TYPE_META: Record<PostType, { icon: any; color: string; label: string }> = {
  'Looking for partners': { icon: Sparkles, color: 'bg-primary/10 text-primary', label: 'Looking for partners' },
  'Project idea': { icon: Lightbulb, color: 'bg-amber-100 text-amber-700', label: 'Project idea' },
  'Question': { icon: HelpCircle, color: 'bg-purple-100 text-purple-700', label: 'Question' },
  'Social': { icon: Coffee, color: 'bg-pink-100 text-pink-700', label: 'Social' },
};

export const FeedView: React.FC<FeedViewProps> = ({ currentUser, posts, onLike, onOpenProfile }) => {
  const [filter, setFilter] = useState<PostType | 'All'>('All');

  const filtered = filter === 'All' ? posts : posts.filter(p => p.type === filter);

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  return (
    <div className="flex flex-col h-[100dvh] pb-24">
      <header className="px-4 pt-4 pb-3 sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-extrabold tracking-tight">Home</h1>
          <button onClick={onOpenProfile} aria-label="My profile">
            <InitialsAvatar name={currentUser.name} size={36} />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto -mx-4 px-4 scrollbar-thin">
          {(['All', ...POST_TYPES] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
                filter === t
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-foreground border-border hover:border-foreground/30'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-20 px-6 text-muted-foreground">
            <Filter size={36} className="mx-auto mb-3 opacity-50" />
            <p className="font-medium">No posts yet</p>
            <p className="text-sm mt-1">Be the first to post — tap the + button below.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map(post => {
              const author = MOCK_USERS.find(u => u.id === post.authorId)
                || (post.authorId === currentUser.id ? currentUser : null);
              if (!author) return null;
              const meta = TYPE_META[post.type];
              const Icon = meta.icon;
              const liked = post.likes.includes(currentUser.id);
              return (
                <article key={post.id} className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <InitialsAvatar name={author.name} size={44} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{author.name}</span>
                        <span className="text-xs text-muted-foreground">· {timeAgo(post.createdAt)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{author.degree} · Year {author.year}</p>

                      <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color}`}>
                        <Icon size={13} />
                        {meta.label}
                      </div>

                      <p className="mt-2.5 text-[15px] leading-relaxed whitespace-pre-wrap">{post.text}</p>

                      <div className="flex items-center gap-5 mt-3 text-muted-foreground">
                        <button
                          onClick={() => onLike(post.id)}
                          className={`flex items-center gap-1.5 text-sm hover:text-primary transition-colors ${liked ? 'text-primary' : ''}`}
                        >
                          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                          {post.likes.length > 0 && post.likes.length}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors">
                          <MessageCircle size={18} />
                          {post.comments.length > 0 && post.comments.length}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
