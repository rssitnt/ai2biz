# Настройка Supabase для проекта AI2BIZ

Это руководство поможет вам настроить Supabase в качестве бэкенда для вашего проекта.

## 1. Создание проекта Supabase

1. Перейдите на [app.supabase.io](https://app.supabase.io) и войдите в систему
2. Нажмите кнопку "+ New Project"
3. Введите название проекта (например, "ai2biz")
4. Установите надежный пароль для базы данных
5. Выберите регион, ближайший к вашим пользователям
6. Нажмите "Create new project"

## 2. Настройка базы данных

После создания проекта необходимо создать таблицы для хранения данных. Вы можете использовать SQL Editor в интерфейсе Supabase:

### Таблица сообщений чата

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

### Таблица профилей пользователей

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  company TEXT,
  phone TEXT,
  job_title TEXT
);

-- Включаем RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Политика доступа для таблицы профилей
CREATE POLICY "Пользователи могут просматривать свои профили" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Пользователи могут обновлять свои профили" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);
```

### Таблица контактных запросов

```sql
CREATE TABLE public.contacts (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  responded BOOLEAN DEFAULT false NOT NULL
);

-- Включаем RLS (Row Level Security)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Политика доступа для формы контактов (все могут отправлять запросы)
CREATE POLICY "Все могут отправлять контактные запросы" 
ON public.contacts 
FOR INSERT 
WITH CHECK (true);

-- Только администраторы могут просматривать контактные запросы
CREATE POLICY "Только администраторы могут просматривать контактные запросы" 
ON public.contacts 
FOR SELECT 
USING (auth.uid() IN (SELECT id FROM auth.users WHERE role = 'admin'));
```

### Настройка хранилища файлов

В интерфейсе Supabase перейдите в раздел "Storage" и создайте два новых bucket:
1. "files" - для хранения файлов пользователей
2. "avatars" - для хранения аватаров пользователей

## 3. Настройка аутентификации

1. В интерфейсе Supabase перейдите в раздел "Authentication" → "Providers"
2. Включите нужные провайдеры (Email/Password, Google, GitHub и т.д.)
3. Для OAuth провайдеров (Google, GitHub), настройте соответствующие ключи API

## 4. Получение ключей API

1. В интерфейсе Supabase перейдите в раздел "Settings" → "API"
2. Скопируйте значение "URL" - это будет ваш NEXT_PUBLIC_SUPABASE_URL
3. Скопируйте "anon key" - это будет ваш NEXT_PUBLIC_SUPABASE_ANON_KEY

## 5. Настройка переменных окружения в проекте

Создайте файл `.env.local` в корне проекта и добавьте в него следующие переменные:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 6. Настройка переменных окружения на Vercel

При деплое на Vercel, добавьте те же переменные окружения в настройках проекта.

1. В панели управления Vercel перейдите к вашему проекту
2. Перейдите в раздел "Settings" → "Environment Variables"
3. Добавьте те же переменные:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY

## 7. Тестирование

После завершения настройки вы можете протестировать подключение к Supabase с помощью компонентов аутентификации и чата в вашем проекте.

## Дополнительные ресурсы

- [Документация Supabase](https://supabase.io/docs)
- [Примеры с Next.js](https://github.com/supabase/supabase/tree/master/examples/nextjs) 