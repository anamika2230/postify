export type Niche =
  | 'Fitness'
  | 'Tech'
  | 'Fashion'
  | 'Travel'
  | 'Education'
  | 'Business'
  | 'Gaming'
  | 'News / Current Affairs'
  | 'Other';

export type Mode = 'creative' | 'trending';

export type Tool =
  | 'Caption Generator'
  | 'Hashtag Generator'
  | 'Viral Post Ideas'
  | 'Hook Generator'
  | 'Improve Caption'
  | 'Best Posting Time'
  | 'Trending Topics';

export type ConversationState =
  | 'greeting'
  | 'niche-selection'
  | 'mode-selection'
  | 'menu'
  | 'awaiting-input'
  | 'generating'
  | 'suggestions';

export interface ButtonOption {
  label: string;
  value: string;
}

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  buttons?: ButtonOption[];
}
