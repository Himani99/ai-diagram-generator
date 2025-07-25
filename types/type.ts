export type OpenAIModel = "gpt-3.5-turbo" | "gpt-4" | "gpt-4o" | "gpt-4o-mini";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface RequestBody {
  messages: Message[];
  model: OpenAIModel;
  apiKey: string;
  mode: 'mermaid' | 'svg';
}

export type Theme = "dark" | "neutral" | "default" | "forest" | "base";
