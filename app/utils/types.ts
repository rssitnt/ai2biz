// Типы данных для таблиц Supabase

export interface Message {
  id: number;
  created_at: string;
  user_id: string;
  content: string;
  is_bot: boolean;
}

export interface UserProfile {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  avatar_url?: string;
  company?: string;
  phone?: string;
  job_title?: string;
}

export interface Contact {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  responded: boolean;
}

export interface Lead {
  id: number;
  created_at: string;
  name: string;
  company: string;
  position?: string;
  email: string;
  phone?: string;
  telegram?: string;
  contact_method: string;
  message: string;
  responded: boolean;
}

export interface FileObject {
  id: string;
  name: string;
  size: number;
  created_at: string;
  updated_at: string;
  path: string;
  metadata: {
    size: number;
    mimetype: string;
    cacheControl?: string;
  };
}

export interface ChatSession {
  id: number;
  created_at: string;
  user_id: string;
  title: string;
  last_message?: string;
  updated_at: string;
} 