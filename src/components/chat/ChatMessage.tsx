import { Bot, User } from "lucide-react";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={cn("message-enter flex gap-4 px-4 py-6", isUser ? "bg-transparent" : "bg-ai-bubble/30")}>
      <div className="flex-shrink-0">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            isUser ? "bg-user-bubble" : "bg-primary/20 border border-primary/30"
          )}
        >
          {isUser ? (
            <User className="w-4 h-4 text-foreground" />
          ) : (
            <Bot className="w-4 h-4 text-primary" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-medium", isUser ? "text-foreground" : "text-primary")}>
            {isUser ? "You" : "RUconnected AI"}
          </span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.attachments.map((att) => (
              <div key={att.id} className="relative group">
                {att.mimeType.startsWith("image/") && att.preview && (
                  <img
                    src={att.preview}
                    alt={att.name}
                    className="max-h-40 rounded-lg border border-border object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-invert prose-sm max-w-none">
          {message.isStreaming ? (
            <div className="flex items-center gap-1">
              <span className="whitespace-pre-wrap">{message.content}</span>
              <span className="inline-block w-2 h-4 bg-primary animate-pulse-soft ml-0.5" />
            </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed text-foreground/90">{message.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};
