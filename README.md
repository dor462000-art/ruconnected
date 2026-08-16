# RUconnected App

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Attachment, ModelId } from "../types.ts";




// Ensure process.env is defined to avoid ReferenceErrors in the browser
const env = typeof process !== 'undefined' ? process.env : (window as any).process?.env || {};
const apiKey = env.API_KEY || '';




if (!apiKey) {
  console.warn("RUconnected: Gemini API Key is missing. Some AI features may not function correctly.");
}




const ai = new GoogleGenAI({ apiKey: apiKey });




interface GenerateStreamParams {
  modelId: ModelId;
  prompt: string;
  attachments?: Attachment[];
  systemInstruction?: string;
  onChunk: (text: string) => void;
}




export const streamGeminiResponse = async ({
  modelId,
  prompt,
  attachments = [],
  onChunk,
  systemInstruction
}: GenerateStreamParams): Promise<string> => {
  
  try {
    const parts: any[] = attachments.map(att => ({
        inlineData: { mimeType: att.mimeType, data: att.data }
    }));
    parts.push({ text: prompt });




    const config: any = systemInstruction ? { systemInstruction } : {};




    const responseStream = await ai.models.generateContentStream({
      model: modelId,
      contents: { parts },
      config
    });




    let fullText = '';
    for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
            fullText += c.text;
            onChunk(fullText);
        }
    }
    return fullText;




  } catch (error: any) {
    console.error("Gemini API Error:", error);
    onChunk("Communication error with AI service.");
    throw error;
  }
};




export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });
};

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ruconnected.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/926f2bcd-4ca9-40b7-8bde-9a87c1aab3b5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
