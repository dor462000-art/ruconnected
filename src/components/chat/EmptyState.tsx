import { Bot, Sparkles, Image, MessageSquare } from "lucide-react";

const suggestions = [
  { icon: MessageSquare, text: "Explain quantum computing in simple terms" },
  { icon: Sparkles, text: "Write a creative story about the future" },
  { icon: Image, text: "Analyze an image I upload" },
];

interface EmptyStateProps {
  onSuggestionClick: (text: string) => void;
}

export const EmptyState = ({ onSuggestionClick }: EmptyStateProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center shadow-glow">
          <Bot className="w-10 h-10 text-primary" />
        </div>
      </div>

      <h1 className="text-3xl font-semibold mb-3 gradient-text">RUconnected AI</h1>
      <p className="text-muted-foreground text-center max-w-md mb-10">
        Powered by Google Gemini. Ask me anything, share images, or explore ideas together.
      </p>

      <div className="grid gap-3 w-full max-w-lg">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="group flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border hover:border-primary/40 hover:bg-card transition-all text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <suggestion.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
              {suggestion.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
