import { useState, useCallback } from "react";
import { Message, Attachment, ModelId } from "@/types/chat";
import { toast } from "sonner";

// Simulated AI response for demo (replace with real API when backend is connected)
const simulateAIResponse = async (
  prompt: string,
  onChunk: (text: string) => void
): Promise<string> => {
  const responses = [
    "I'm RUconnected AI, powered by advanced language models. ",
    "I can help you with a wide range of tasks including answering questions, ",
    "analyzing images, writing content, coding assistance, and much more. ",
    "\n\nTo enable full AI capabilities, you'll need to connect a backend service. ",
    "The current interface demonstrates the chat experience with simulated responses. ",
    "\n\n**Features available:**\n",
    "- 💬 Natural conversation\n",
    "- 🖼️ Image attachments\n",
    "- ⚡ Streaming responses\n",
    "- 🎨 Beautiful dark theme\n",
    "\nHow can I help you today?",
  ];

  let fullText = "";
  for (const chunk of responses) {
    await new Promise((r) => setTimeout(r, 50 + Math.random() * 100));
    fullText += chunk;
    onChunk(fullText);
  }
  return fullText;
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState<ModelId>("gemini-2.0-flash");

  const sendMessage = useCallback(
    async (content: string, attachments: Attachment[] = []) => {
      if (!content.trim() && attachments.length === 0) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        attachments,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const assistantId = crypto.randomUUID();
      
      // Create streaming assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
          isStreaming: true,
        },
      ]);

      try {
        await simulateAIResponse(content, (text) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: text } : m
            )
          );
        });

        // Mark streaming complete
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        );
      } catch (error) {
        toast.error("Failed to get AI response. Please try again.");
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        setIsLoading(false);
      }
    },
    [currentModel]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    currentModel,
    setCurrentModel,
    sendMessage,
    clearMessages,
  };
};
