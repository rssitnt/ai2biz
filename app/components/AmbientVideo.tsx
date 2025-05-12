'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AmbientVideoProps {
  src: string;
  className?: string;
}

const AmbientVideo = ({ src, className = '' }: AmbientVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Функция для извлечения доминирующего цвета из видео
    const getAverageColor = () => {
      if (!video || !canvas || !ctx) return { r: 0, g: 0, b: 0 };

      // Рисуем текущий кадр видео на canvas в маленьком размере для оптимизации
      ctx.drawImage(video, 0, 0, 8, 8);
      
      // Получаем данные пикселей
      const pixels = ctx.getImageData(0, 0, 8, 8).data;
      let r = 0, g = 0, b = 0, count = 0;

      // Вычисляем средний цвет
      for (let i = 0; i < pixels.length; i += 4) {
        r += pixels[i];
        g += pixels[i + 1];
        b += pixels[i + 2];
        count++;
      }

      return {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count)
      };
    };

    // Функция анимации
    const animate = () => {
      if (!video || !canvas) return;

      const color = getAverageColor();
      const glowColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
      
      if (video.parentElement) {
        video.parentElement.style.boxShadow = `0 0 100px 5px ${glowColor}`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Запускаем анимацию при воспроизведении видео
    const handlePlay = () => {
      animate();
    };

    // Останавливаем анимацию при паузе
    const handlePause = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Очистка при размонтировании
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <motion.div 
      className={`relative rounded-2xl overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas 
        ref={canvasRef} 
        width="8" 
        height="8" 
        className="hidden"
      />
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-2xl"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
    </motion.div>
  );
};

export default AmbientVideo; 