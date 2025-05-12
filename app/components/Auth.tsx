'use client';

import { useState } from 'react';
import { signIn, signUp, signInWithProvider } from '../utils/auth';
import { FaGoogle, FaGithub } from 'react-icons/fa';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        setMessage('Вход выполнен успешно!');
        // Здесь можно добавить редирект на нужную страницу
      } else {
        await signUp(email, password);
        setMessage('Регистрация прошла успешно! Проверьте email для подтверждения.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderAuth = async (provider: 'google' | 'github') => {
    setError(null);
    setMessage(null);
    
    try {
      await signInWithProvider(provider);
      // Перенаправление будет выполнено автоматически
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-800/90 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">
        {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-600/20 text-red-200 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-4 p-3 bg-green-600/20 text-green-200 rounded-md text-sm">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1 text-sm text-zinc-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md text-white"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block mb-1 text-sm text-zinc-300">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 bg-zinc-700 border border-zinc-600 rounded-md text-white"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-md hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-70"
        >
          {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-zinc-800 text-zinc-400">или продолжить с</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => handleProviderAuth('google')}
            className="flex justify-center items-center py-2 px-4 border border-zinc-600 rounded-md hover:bg-zinc-700 transition-all duration-200"
          >
            <FaGoogle className="text-white mr-2" />
            <span className="text-sm text-white">Google</span>
          </button>
          
          <button
            onClick={() => handleProviderAuth('github')}
            className="flex justify-center items-center py-2 px-4 border border-zinc-600 rounded-md hover:bg-zinc-700 transition-all duration-200"
          >
            <FaGithub className="text-white mr-2" />
            <span className="text-sm text-white">GitHub</span>
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-zinc-400">
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
        </span>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-400 hover:text-blue-300"
        >
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </div>
    </div>
  );
} 