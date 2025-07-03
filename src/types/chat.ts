
export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  modelResponses?: ModelResponse[];
}

export interface ModelResponse {
  modelName: string;
  content: string;
  prompt: string;
  timestamp: Date;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}
