# Настройка таблиц в Supabase

В этом директории содержатся SQL-скрипты для создания и настройки таблиц в Supabase.

## Таблица `messages`

Таблица для хранения сообщений чата.

```sql
CREATE TABLE public.messages (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_bot BOOLEAN DEFAULT false NOT NULL
);

-- Включаем RLS (Row Level Security)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Политика доступа для таблицы сообщений
CREATE POLICY "Пользователи могут просматривать свои сообщения" 
ON public.messages 
FOR SELECT 
USING (auth.uid() = user_id OR user_id = 'system');

CREATE POLICY "Пользователи могут добавлять свои сообщения" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id = 'anonymous' OR user_id = 'system');
```

## Таблица `leads`

Таблица для хранения заявок с сайта.

```sql
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
```

## Как применить миграции

1. Войдите в панель управления Supabase
2. Перейдите в раздел "SQL Editor"
3. Скопируйте и вставьте SQL-код из нужного файла миграции
4. Нажмите кнопку "Run" для выполнения запроса

## Проверка подключения

После создания таблиц убедитесь, что переменные окружения в файле `.env.local` настроены правильно:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
``` 