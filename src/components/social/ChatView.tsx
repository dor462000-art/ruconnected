import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Paperclip, Image, X, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserProfile, Message, Attachment, ChatSession } from '@/types/social';
import { MOCK_USERS } from '@/constants/social';

interface ChatViewProps {
  currentUser: UserProfile;
  chatSession: ChatSession;
  onBack: () => void;
  onSendMessage: (text: string, attachments?: Attachment[]) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  chatSession,
  onBack,
  onSendMessage
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const partner = chatSession.isGroup 
    ? null 
    : MOCK_USERS.find(u => chatSession.participantIds.find(id => id !== currentUser.id) === u.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatSession.messages]);

  const handleSend = () => {
    if (!message.trim() && attachments.length === 0) return;
    onSendMessage(message, attachments);
    setMessage('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newAttachment: Attachment = {
          id: crypto.randomUUID(),
          name: file.name,
          type,
          url: reader.result as string,
          mimeType: file.type
        };
        setAttachments(prev => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
    setShowAttachMenu(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur-md flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        
        {chatSession.isGroup ? (
          <div className="flex-1">
            <h2 className="font-bold">{chatSession.groupName}</h2>
            <p className="text-xs text-muted-foreground">
              {chatSession.participantIds.length} members
            </p>
          </div>
        ) : partner ? (
          <>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary flex items-center justify-center">
              {partner.avatarUrl ? (
                <img src={partner.avatarUrl} alt={partner.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary-foreground font-bold">{partner.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-bold">{partner.name}</h2>
              <p className="text-xs text-muted-foreground">
                {partner.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </>
        ) : null}

        <button className="p-2 hover:bg-muted rounded-full transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {chatSession.messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-medium">Start the conversation!</p>
              <p className="text-sm mt-1">Send a message to connect</p>
            </div>
          </div>
        ) : (
          chatSession.messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            const sender = MOCK_USERS.find(u => u.id === msg.senderId);
            
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${isMe ? 'order-2' : 'order-1'}`}>
                  {chatSession.isGroup && !isMe && sender && (
                    <p className="text-xs text-muted-foreground mb-1 ml-1">{sender.name}</p>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl ${
                      isMe
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    }`}
                  >
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mb-2 space-y-2">
                        {msg.attachments.map(att => (
                          att.type === 'image' ? (
                            <img 
                              key={att.id} 
                              src={att.url} 
                              alt={att.name} 
                              className="max-w-full rounded-lg"
                            />
                          ) : (
                            <div key={att.id} className="flex items-center gap-2 p-2 bg-background/20 rounded-lg">
                              <Paperclip size={16} />
                              <span className="text-sm truncate">{att.name}</span>
                            </div>
                          )
                        ))}
                      </div>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <span className={`text-[10px] mt-1 block text-right ${isMe ? 'opacity-70' : 'text-muted-foreground'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-border bg-card/50 flex gap-2 overflow-x-auto">
          {attachments.map(att => (
            <div key={att.id} className="relative shrink-0">
              {att.type === 'image' ? (
                <img src={att.url} alt={att.name} className="h-16 w-16 object-cover rounded-lg" />
              ) : (
                <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
                  <Paperclip size={20} />
                </div>
              )}
              <button
                onClick={() => removeAttachment(att.id)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-2.5 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <Paperclip size={20} />
            </button>
            
            {showAttachMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted w-full text-left"
                >
                  <Image size={18} className="text-primary" />
                  <span className="text-sm">Photo</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted w-full text-left"
                >
                  <Paperclip size={18} className="text-primary" />
                  <span className="text-sm">File</span>
                </button>
              </div>
            )}
          </div>

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-muted border-0 rounded-full px-4"
          />

          <Button
            onClick={handleSend}
            disabled={!message.trim() && attachments.length === 0}
            size="icon"
            className="rounded-full shrink-0"
          >
            <Send size={18} />
          </Button>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'image')}
        />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e, 'file')}
        />
      </div>
    </div>
  );
};
