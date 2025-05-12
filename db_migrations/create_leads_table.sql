-- Таблица для хранения заявок с сайта
CREATE TABLE public.leads (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  position TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  telegram TEXT,
  contact_method TEXT NOT NULL,
  message TEXT NOT NULL,
  responded BOOLEAN DEFAULT false NOT NULL
);

-- Включаем RLS (Row Level Security)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Политика доступа для анонимной отправки заявок
CREATE POLICY "Анонимные пользователи могут отправлять заявки" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- Политика доступа для чтения заявок только администраторами
CREATE POLICY "Только администраторы могут просматривать заявки" 
ON public.leads 
FOR SELECT 
USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));

-- Политика доступа для обновления заявок только администраторами
CREATE POLICY "Только администраторы могут обновлять заявки" 
ON public.leads 
FOR UPDATE 
USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin')); 