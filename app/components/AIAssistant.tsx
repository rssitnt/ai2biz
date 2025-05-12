'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { FaRobot, FaTelegram, FaArrowUp } from 'react-icons/fa';
import { BsMicFill, BsKeyboardFill, BsChatSquareTextFill } from 'react-icons/bs';
import { MdKeyboardVoice } from 'react-icons/md';
import { supabase } from '../utils/supabase';
import { addMessage, getMessages } from '../utils/supabase';
import { Message as MessageType } from '../utils/types';

// Определение интерфейса для SpeechRecognition, так как он отсутствует в TypeScript по умолчанию
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: any;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionEvent) => void;
  onend: (event: Event) => void;
  start(): void;
  stop(): void;
  abort(): void;
}

// Тип для сообщений чата
type Message = {
  text: string;
  sender: 'user' | 'bot';
};

type AIAssistantProps = {
  isOpen: boolean;
  onToggle: () => void;
};

const AIAssistant = ({ isOpen, onToggle }: AIAssistantProps) => {
  // Состояния для чата
  const [chatType, setChatType] = useState<'site' | 'telegram'>('site');
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [hasChosenChatType, setHasChosenChatType] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Здравствуйте! Я ИИ-ассистент компании AI2BIZ. Чем могу помочь?', sender: 'bot' }
  ]);
  
  // Состояния для визуализации звука
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [volumeBars, setVolumeBars] = useState<number[]>(Array(5).fill(0));
  const [isPulsing, setIsPulsing] = useState(false);
  const [isSpeechRecognizing, setIsSpeechRecognizing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Рефы
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Добавляем реф для поля ввода текста
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Обработчик выбора типа чата
  const handleChatTypeChoice = useCallback((type: 'site' | 'telegram') => {
    setChatType(type);
    setHasChosenChatType(true);
    
    // Если выбран Телеграм, автоматически перенаправляем
    if (type === 'telegram') {
      window.open('https://t.me/ai2bizbot', '_blank');
    }
  }, []);

  // Функция переключения типа чата
  const toggleChatType = useCallback(() => {
    const newChatType = chatType === 'site' ? 'telegram' : 'site';
    setChatType(newChatType);
    
    // Если выбран Телеграм, автоматически перенаправляем
    if (newChatType === 'telegram') {
      window.open('https://t.me/ai2bizbot', '_blank');
    }
  }, [chatType]);

  // Функция переключения режима ввода
  const toggleInputMode = useCallback(() => {
    setInputMode(prev => {
      // Сбросить состояние записи при переключении режима
      if (prev === 'voice') {
        setIsRecording(false);
        stopMicrophoneAnalysis();
      }
      return prev === 'text' ? 'voice' : 'text';
    });
  }, []);

  // Остановка анализа с микрофона
  const stopMicrophoneAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    
    setVolumeLevel(0);
    setVolumeBars(Array(5).fill(0));
    setIsPulsing(false);
  }, []);

  // Анализ громкости с микрофона
  const analyzeMicrophoneInput = useCallback(() => {
    if (!analyserRef.current) return;
    
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const updateMicAnimation = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Вычисляем среднюю громкость
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      const normalizedVolume = Math.min(1, avg / 128); // нормализуем от 0 до 1
      
      setVolumeLevel(normalizedVolume);
      
      // Обновляем визуализацию для 5 полосок
      const newBars = [
        Math.random() * normalizedVolume * 20,
        Math.random() * normalizedVolume * 20,
        Math.random() * normalizedVolume * 20,
        Math.random() * normalizedVolume * 20,
        Math.random() * normalizedVolume * 20
      ];
      setVolumeBars(newBars);
      
      // Включаем пульсацию, если громкость выше порога
      setIsPulsing(normalizedVolume > 0.1);
      
      animationFrameRef.current = requestAnimationFrame(updateMicAnimation);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateMicAnimation);
  }, []);

  // Запрос на доступ к микрофону
  const requestMicrophoneAccess = useCallback(async () => {
    try {
      // Запрашиваем доступ к микрофону
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      // Если успешно получили доступ
      setHasAudioPermission(true);
      setIsRecording(true);
      
      // Создаем аудио контекст и анализатор для потока с микрофона
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Запускаем анализ громкости
      analyzeMicrophoneInput();
    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
      setHasAudioPermission(false);
      setIsRecording(false);
    }
  }, [analyzeMicrophoneInput]);

  // Обработка нажатия на кнопку микрофона
  const handleMicButtonClick = useCallback(() => {
    if (hasAudioPermission === null) {
      // Если разрешение еще не запрашивалось
      requestMicrophoneAccess();
    } else if (hasAudioPermission) {
      // Если разрешение уже получено, переключаем состояние записи
      if (isRecording) {
        setIsRecording(false);
        stopMicrophoneAnalysis();
      } else {
        setIsRecording(true);
        requestMicrophoneAccess();
      }
    } else {
      // Если доступ был запрещен, сообщаем пользователю
      alert('Для использования голосового ввода необходимо разрешить доступ к микрофону в настройках браузера.');
    }
  }, [hasAudioPermission, isRecording, requestMicrophoneAccess, stopMicrophoneAnalysis]);

  // Загрузка истории сообщений из Supabase
  useEffect(() => {
    if (hasChosenChatType && chatType === 'site' && isOpen) {
      const fetchMessages = async () => {
        try {
          const messagesData = await getMessages();
          // Преобразуем формат сообщений из Supabase в формат, используемый в компоненте
          const formattedMessages = messagesData.map(msg => ({
            text: msg.content,
            sender: msg.is_bot ? 'bot' as const : 'user' as const
          }));
          
          if (formattedMessages.length > 0) {
            setMessages(formattedMessages);
          }
        } catch (error) {
          console.error('Ошибка при загрузке сообщений:', error);
        }
      };
      
      fetchMessages();
    }
  }, [hasChosenChatType, chatType, isOpen]);

  // Модифицируем функцию handleSendMessage для сохранения сообщений в Supabase
  const handleSendMessage = useCallback(async () => {
    // Проверяем наличие текста или активное состояние записи голоса
    if (inputText.trim() === '' && !isRecording) return;

    // Текст сообщения
    const messageText = isRecording 
      ? 'Голосовое сообщение (данные с микрофона)'
      : inputText.trim();

    // Добавляем сообщение пользователя
    const newUserMessage = { text: messageText, sender: 'user' as const };
    setMessages(prev => [...prev, newUserMessage]);
    
    // Очищаем поле ввода
    setInputText('');
    
    // Останавливаем запись, если она активна
    if (isRecording) {
      setIsRecording(false);
      stopMicrophoneAnalysis();
    }
    
    try {
      // Сохраняем сообщение пользователя в Supabase
      const userMessageData: Omit<MessageType, 'id' | 'created_at'> = {
        user_id: 'anonymous', // В будущем здесь будет реальный ID пользователя
        content: messageText,
        is_bot: false
      };
      
      await addMessage(userMessageData);
      
      // Имитируем ответ бота через небольшую задержку
      setTimeout(async () => {
        const botResponse = 'Благодарю за сообщение! Я обработаю вашу информацию и свяжусь с вами в ближайшее время.';
        
        setMessages(prev => [...prev, { 
          text: botResponse, 
          sender: 'bot' 
        }]);
        
        // Сохраняем ответ бота в Supabase
        const botMessageData: Omit<MessageType, 'id' | 'created_at'> = {
          user_id: 'system',
          content: botResponse,
          is_bot: true
        };
        
        await addMessage(botMessageData);
      }, 1000);
    } catch (error) {
      console.error('Ошибка при сохранении сообщения:', error);
    }
  }, [inputText, isRecording, stopMicrophoneAnalysis]);

  // Функция для запуска распознавания речи
  const startSpeechRecognition = useCallback(() => {
    try {
      // Используем тип any для обхода проблем с типизацией веб-стандартов
      const SpeechRecognition: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Ваш браузер не поддерживает распознавание речи. Попробуйте использовать Chrome или Edge.');
        return;
      }

      // Остановим текущее распознавание, если оно активно
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'ru-RU';
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onstart = () => {
        setIsSpeechRecognizing(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setInputText(transcript);
      };

      recognition.onerror = (event: SpeechRecognitionEvent) => {
        console.error('Ошибка распознавания речи:', event.error);
        setIsSpeechRecognizing(false);
      };

      recognition.onend = () => {
        setIsSpeechRecognizing(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Ошибка при запуске распознавания речи:', error);
      alert('Не удалось запустить распознавание речи. Проверьте разрешения микрофона.');
    }
  }, []);

  // Функция для остановки распознавания речи
  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsSpeechRecognizing(false);
    }
  }, []);

  // Функция переключения режима распознавания речи
  const toggleSpeechRecognition = useCallback(() => {
    if (isSpeechRecognizing) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  }, [isSpeechRecognizing, startSpeechRecognition, stopSpeechRecognition]);

  // Очистка ресурсов при размонтировании
  useEffect(() => {
    return () => {
      stopMicrophoneAnalysis();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      stopSpeechRecognition();
    };
  }, [stopMicrophoneAnalysis, stopSpeechRecognition]);

  // Автоматическая прокрутка чата вниз при добавлении новых сообщений
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Функция для автоматического изменения высоты textarea
  const autoResizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    if (inputText.trim()) {
      // Если есть текст, вычисляем высоту на основе содержимого
      textarea.style.height = '36px'; // Сначала сбрасываем до базовой высоты
      const newHeight = Math.min(150, Math.max(36, textarea.scrollHeight));
      textarea.style.height = `${newHeight}px`;
    } else {
      // Если текста нет, устанавливаем минимальную высоту точно в одну строку
      textarea.style.height = '36px';
      // Сбрасываем скролл в верхнее положение
      textarea.scrollTop = 0;
    }
  }, [inputText]);

  // Обработчик изменения текста в поле ввода
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  }, []);

  // Обработка нажатия клавиши Enter для отправки сообщения или перехода на новую строку
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter позволяет перейти на новую строку
        return;
      } else if (inputText.trim().length > 0) {
        // Enter без Shift отправляет сообщение
        e.preventDefault();
        handleSendMessage();
      } else {
        // Пустое сообщение - предотвращаем создание новой строки
        e.preventDefault();
      }
    }
  }, [handleSendMessage, inputText]);

  // Отслеживаем изменения в поле ввода
  useEffect(() => {
    autoResizeTextarea();
  }, [inputText, autoResizeTextarea]);

  return (
    <>
      {/* Кнопка всегда видима */}
      <div className="fixed bottom-10 right-10 z-50 sm:bottom-5 sm:right-5 md:bottom-10 md:right-10">
        <button 
          onClick={onToggle}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 animate-gradient-x rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label={isOpen ? "Закрыть ИИ-ассистент" : "Открыть ИИ-ассистент"}
        >
          <FaRobot className="text-2xl" />
        </button>
      </div>

      {/* Окно чата в отдельном блоке */}
      {isOpen && (
        <div className="fixed bottom-28 right-10 z-50 sm:bottom-20 sm:right-5 md:bottom-28 md:right-10">
          <div 
            className="w-80 sm:w-80 md:w-96 card overflow-hidden glassmorphism backdrop-blur-md max-w-[calc(100vw-20px)] border border-white/10 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/30 before:via-purple-500/30 before:to-indigo-500/30 before:animate-gradient-x before:-z-10"
          >
            <div className="p-4 border-b border-zinc-800/10 flex justify-between items-center select-none">
              <h3 className="text-lg font-semibold text-white">ИИ-ассистент</h3>
              <div className="flex gap-3">
                {hasChosenChatType && (
                  <button 
                    onClick={toggleChatType}
                    className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-all duration-300 hover:bg-zinc-800/70 select-none"
                  >
                    {chatType === 'site' ? (
                      <>
                        <FaTelegram className="text-sm text-blue-400" />
                        <span className="text-xs text-zinc-300">Перейти в Телеграм</span>
                      </>
                    ) : (
                      <>
                        <BsChatSquareTextFill className="text-xs text-blue-400" />
                        <span className="text-xs text-zinc-300">Вернуться в чат</span>
                      </>
                    )}
                  </button>
                )}
                
                <div 
                  className="relative flex p-1 bg-[#1C1C1E]/90 rounded-full shadow-sm cursor-pointer select-none"
                  onClick={toggleInputMode}
                >
                  {/* Подвижный белый фон-индикатор */}
                  <div 
                    className="absolute w-7 h-7 bg-white rounded-full shadow-sm transition-transform duration-150 ease-out"
                    style={{ transform: inputMode === 'text' ? 'translateX(0)' : 'translateX(28px)' }}
                  />
                  
                  {/* Кнопка "Текстовый ввод" */}
                  <div 
                    className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full"
                  >
                    <BsKeyboardFill 
                      className={`w-3.5 h-3.5 transition-colors duration-150 ${
                        inputMode === 'text' ? 'text-[#1C1C1E]' : 'text-white/60'
                      }`} 
                    />
                  </div>
                  
                  {/* Кнопка "Голосовой ввод" */}
                  <div 
                    className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full"
                  >
                    <BsMicFill 
                      className={`w-3.5 h-3.5 transition-colors duration-150 ${
                        inputMode === 'voice' ? 'text-[#1C1C1E]' : 'text-white/60'
                      }`} 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {!hasChosenChatType && (
                <>
                  <p className="text-sm opacity-70 mb-4 text-white select-none">Выберите способ общения:</p>
                  
                  <div className="flex flex-col space-y-3 mb-4">
                    <button
                      onClick={() => handleChatTypeChoice('site')}
                      className="flex items-center gap-2 py-3 px-4 rounded-lg text-sm bg-zinc-800 hover:bg-zinc-700 text-white transition-all duration-200 select-none"
                    >
                      <BsChatSquareTextFill className="text-lg text-blue-400" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Чат на сайте</span>
                        <span className="text-xs text-zinc-400">Общение прямо на этой странице</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleChatTypeChoice('telegram')}
                      className="flex items-center gap-2 py-3 px-4 rounded-lg text-sm bg-zinc-800 hover:bg-zinc-700 text-white transition-all duration-200 select-none"
                    >
                      <FaTelegram className="text-lg text-blue-400" />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Телеграм</span>
                        <span className="text-xs text-zinc-400">Продолжить общение в Telegram</span>
                      </div>
                    </button>
                  </div>
                </>
              )}
              
              {chatType === 'site' && (
                <div>
                  <div 
                    ref={chatContainerRef}
                    className="p-3 mb-4 h-40 sm:h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                  >
                    {messages.map((message, index) => (
                      <div key={index} className={`flex items-start mb-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                        <div 
                          className={`rounded-lg p-2 text-sm max-w-[85%] ${
                            message.sender === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-600/20 text-white'
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="min-h-[52px] flex items-start relative pb-2">
                    {/* Условный рендеринг: для текстового режима показываем поле ввода, для голосового - микрофон */}
                    {inputMode === 'text' ? (
                      // Текстовый режим
                      <div className="w-full flex items-start relative justify-start">
                        <div className="w-full relative rounded-2xl bg-zinc-800/40 flex items-center">
                          <textarea 
                            ref={textareaRef}
                            value={inputText}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            placeholder="Введите сообщение..."
                            className="w-full pr-[80px] glassmorphism py-1.5 pl-3 placeholder-opacity-50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 rounded-2xl bg-transparent text-white text-sm min-h-[36px] max-h-[120px] resize-none overflow-hidden"
                            rows={1}
                            style={{ height: '36px', lineHeight: '1.2' }}
                          />
                          <div className="absolute right-1 bottom-1 flex gap-1 items-center">
                            <button 
                              onClick={toggleSpeechRecognition}
                              className={`h-7 w-7 flex-shrink-0 flex items-center justify-center rounded-full text-white hover:bg-zinc-700 transition-all duration-300 ${
                                isSpeechRecognizing 
                                  ? 'bg-red-500 voice-input-active' 
                                  : 'bg-transparent'
                              }`}
                              aria-label={isSpeechRecognizing ? "Остановить голосовой ввод" : "Голосовой ввод текста"}
                            >
                              <div className="relative">
                                <MdKeyboardVoice className="text-sm" />
                                {isSpeechRecognizing && (
                                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
                                  </span>
                                )}
                              </div>
                            </button>
                            <button 
                              onClick={handleSendMessage}
                              className={`h-7 w-7 flex-shrink-0 flex items-center justify-center rounded-full text-white transition-all duration-300 ${
                                inputText.trim().length > 0 
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                                  : 'bg-transparent hover:bg-zinc-700'
                              }`}
                              disabled={inputText.trim().length === 0}
                              aria-label="Отправить сообщение"
                            >
                              <FaArrowUp className="text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Голосовой режим
                      <div className="w-full flex items-center justify-center min-h-[44px]">
                        <button 
                          onClick={handleMicButtonClick}
                          className={`mic-button ${isRecording ? 'active' : ''}`}
                          aria-label="Включить микрофон"
                        >
                          {isRecording && isPulsing && (
                            <div className="mic-pulse animate-pulse-out"></div>
                          )}
                          <BsMicFill 
                            className={`mic-icon text-xl transition-all duration-300 ${isRecording ? 'text-white' : 'text-blue-400'}`}
                            style={{ 
                              transform: isRecording ? `scale(${1 + volumeLevel * 0.3})` : 'scale(1)'
                            }}
                          />
                          {isRecording && (
                            <div className="mic-wave">
                              {volumeBars.map((height, index) => (
                                <div 
                                  key={index}
                                  className="mic-wave-bar"
                                  style={{ height: `${height}px` }}
                                ></div>
                              ))}
                            </div>
                          )}
                        </button>
                        
                        {isRecording && (
                          <div className="absolute bottom-[2px] right-3 z-10">
                            <button 
                              onClick={handleSendMessage}
                              className="h-9 w-9 flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                              aria-label="Отправить голосовое сообщение"
                            >
                              <FaArrowUp className="text-xs" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant; 