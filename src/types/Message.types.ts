export type MessageProps = {
  isBot: boolean;
  message: string;
};

export type ChatMessage = {
  id: string;
  agent: boolean;
  content: string;
  avatarUrl?: string;
};
