-- Таблица для хранения сообщений чата
CREATE TABLE public.messages (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  user_id TEXT NOT NULL, -- Используем TEXT вместо UUID для поддержки 'anonymous' и 'system'
  content TEXT NOT NULL,
  is_bot BOOLEAN DEFAULT false NOT NULL
);

-- Включаем RLS (Row Level Security)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Политика доступа для чтения сообщений
CREATE POLICY "Пользователи могут просматривать сообщения" 
ON public.messages 
FOR SELECT 
USING (true);

-- Политика доступа для добавления сообщений
CREATE POLICY "Пользователи могут добавлять сообщения" 
ON public.messages 
FOR INSERT 
WITH CHECK (true); 