export type ModelId = "gemini-2.0-flash" | "gemini-1.5-pro" | "gemini-1.5-flash";

export interface Attachment {
  id: string;
  name: string;
  mimeType: string;
  data: string; // base64
  preview?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentModel: ModelId;
}

export const MODEL_OPTIONS: { id: ModelId; name: string; description: string }[] = [
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", description: "Fast and efficient" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "Most capable" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Quick responses" },
];
