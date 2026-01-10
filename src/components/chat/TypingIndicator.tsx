import { Bot } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="message-enter flex gap-4 px-4 py-6 bg-ai-bubble/30">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/20 border border-primary/30">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary">RUconnected AI</span>
        </div>

        <div className="typing-indicator flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary/60" />
          <span className="w-2 h-2 rounded-full bg-primary/60" />
          <span className="w-2 h-2 rounded-full bg-primary/60" />
        </div>
      </div>
    </div>
  );
};
