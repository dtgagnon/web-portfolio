// Types for database models

export interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: number;
}

export interface ChatMessage {
  id: string;
  user_id: string | null;
  content: string;
  role: 'user' | 'assistant' | 'system';
  created_at: number;
  session_id: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  created_at: number;
  updated_at: number;
}

export interface ChatProjectLink {
  id: string;
  chat_message_id: string;
  project_id: string;
  created_at: number;
}

export interface Session {
  id: string;
  user_id: string | null;
  created_at: number;
  last_active_at: number;
}

export interface TelemetryEvent {
  id: string;
  event_type: string;
  event_data: string | null;
  user_id: string | null;
  session_id: string | null;
  created_at: number;
}
