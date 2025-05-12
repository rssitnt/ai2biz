import { createClient } from '@supabase/supabase-js';
import { Contact, Message, Lead } from './types';

// Эти значения необходимо заменить настоящими из вашего проекта Supabase
// и хранить в переменных окружения
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Создаем клиент Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Вспомогательные функции для работы с данными

// Получение сообщений чата
export async function getMessages(): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Ошибка при получении сообщений:', error);
    return [];
  }
  
  return data || [];
}

// Добавление сообщения
export async function addMessage(message: Omit<Message, 'id' | 'created_at'>): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      { 
        ...message,
        created_at: new Date().toISOString(),
      }
    ])
    .select();
  
  if (error) {
    console.error('Ошибка при добавлении сообщения:', error);
    return null;
  }
  
  return data?.[0] || null;
}

// Получение данных пользователя
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Ошибка при получении профиля:', error);
    return null;
  }
  
  return data;
}

// Хранилище файлов - загрузка файла
export async function uploadFile(filePath: string, file: File) {
  const { data, error } = await supabase.storage
    .from('files')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    console.error('Ошибка при загрузке файла:', error);
    return null;
  }
  
  return data;
}

// Получение публичной ссылки на файл
export function getFileUrl(filePath: string) {
  const { data } = supabase.storage
    .from('files')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}

// Функции для работы с таблицей leads

// Отправка новой заявки с сайта
export async function submitLead(leadData: Omit<Lead, 'id' | 'created_at' | 'responded'>) {
  const { data, error } = await supabase
    .from('leads')
    .insert([
      { 
        ...leadData,
        responded: false,
        created_at: new Date().toISOString(),
      }
    ])
    .select();
  
  if (error) {
    console.error('Ошибка при отправке заявки:', error);
    throw error;
  }
  
  return data?.[0] || null;
}

// Получение списка заявок (только для админов)
export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Ошибка при получении заявок:', error);
    return [];
  }
  
  return data || [];
}

// Обновление статуса заявки (только для админов)
export async function updateLeadStatus(leadId: number, responded: boolean): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .update({ responded })
    .eq('id', leadId)
    .select();
  
  if (error) {
    console.error('Ошибка при обновлении статуса заявки:', error);
    throw error;
  }
  
  return data?.[0] || null;
} 