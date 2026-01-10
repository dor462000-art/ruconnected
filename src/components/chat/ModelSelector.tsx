import { ChevronDown, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ModelId, MODEL_OPTIONS } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  currentModel: ModelId;
  onModelChange: (model: ModelId) => void;
}

export const ModelSelector = ({ currentModel, onModelChange }: ModelSelectorProps) => {
  const selected = MODEL_OPTIONS.find((m) => m.id === currentModel);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-medium">{selected?.name}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 glass-panel border-border">
        {MODEL_OPTIONS.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onModelChange(model.id)}
            className={cn(
              "flex flex-col items-start gap-0.5 cursor-pointer",
              currentModel === model.id && "bg-primary/10"
            )}
          >
            <span className="font-medium">{model.name}</span>
            <span className="text-xs text-muted-foreground">{model.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
