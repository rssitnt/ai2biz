'use client';

import { useEffect, useState, useRef } from 'react';

const CursorEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isInHeroSection, setIsInHeroSection] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const targetRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      
      // Проверяем, находится ли курсор в области HeroSection
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          setIsInHeroSection(true);
        } else {
          setIsInHeroSection(false);
        }
      }
    };

    const animateGlow = () => {
      // Очень медленное и плавное движение (фактор 0.02 дает сильную инерцию)
      setMousePosition(prev => ({
        x: prev.x + (targetRef.current.x - prev.x) * 0.02,
        y: prev.y + (targetRef.current.y - prev.y) * 0.02,
      }));
      
      animationRef.current = requestAnimationFrame(animateGlow);
    };

    // Инициализируем в текущей позиции мыши чтобы избежать странных прыжков
    const initialMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setMousePosition(targetRef.current);
      
      // Проверяем начальную позицию
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          setIsInHeroSection(true);
        }
      }
      
      window.removeEventListener('mousemove', initialMouseMove);
      window.addEventListener('mousemove', updateMousePosition);
      animationRef.current = requestAnimationFrame(animateGlow);
    };

    window.addEventListener('mousemove', initialMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', initialMouseMove);
      window.removeEventListener('mousemove', updateMousePosition);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Эффект для плавного изменения прозрачности
  useEffect(() => {
    if (isInHeroSection) {
      // Плавно уменьшаем прозрачность до 0
      const fadeOut = () => {
        setOpacity(prev => {
          const newOpacity = Math.max(0, prev - 0.05);
          return newOpacity;
        });
      };
      
      const fadeInterval = setInterval(fadeOut, 16); // примерно 60fps
      
      return () => clearInterval(fadeInterval);
    } else {
      // Плавно увеличиваем прозрачность до 1
      const fadeIn = () => {
        setOpacity(prev => {
          const newOpacity = Math.min(1, prev + 0.05);
          return newOpacity;
        });
      };
      
      const fadeInterval = setInterval(fadeIn, 16); // примерно 60fps
      
      return () => clearInterval(fadeInterval);
    }
  }, [isInHeroSection]);

  return (
    // Главный контейнер
    <div 
      className="cursor-glow fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        opacity: opacity,
        transition: 'opacity 0.3s ease-in-out',
        zIndex: 10 // Высокий z-index, но ниже чем интерактивные элементы
      }}
    >
      {/* Большой градиентный ореол */}
      <div 
        style={{
          position: 'absolute',
          left: mousePosition.x - 300,
          top: mousePosition.y - 300,
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle, 
              rgba(96, 165, 250, 0.15) 0%, 
              rgba(59, 130, 246, 0.12) 20%, 
              rgba(139, 92, 246, 0.10) 40%, 
              rgba(236, 72, 153, 0.08) 60%, 
              transparent 80%)
          `,
          filter: 'blur(60px)',
          mixBlendMode: 'lighten',
          animation: 'rainbow-shift 15s ease infinite',
          willChange: 'transform, filter'
        }}
      />
      
      {/* Внутреннее свечение с другим направлением анимации */}
      <div 
        style={{
          position: 'absolute',
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `
            radial-gradient(circle, 
              rgba(236, 72, 153, 0.2) 0%, 
              rgba(139, 92, 246, 0.15) 30%, 
              rgba(59, 130, 246, 0.1) 60%, 
              rgba(96, 165, 250, 0.08) 80%,
              transparent 90%)
          `,
          filter: 'blur(30px)',
          mixBlendMode: 'screen',
          animation: 'rainbow-shift-reverse 10.5s ease infinite',
          willChange: 'transform, filter'
        }}
      />

      <style jsx>{`
        @keyframes rainbow-shift {
          0% {
            filter: blur(60px) hue-rotate(-30deg);
          }
          50% {
            filter: blur(60px) hue-rotate(30deg);
          }
          100% {
            filter: blur(60px) hue-rotate(-30deg);
          }
        }
        
        @keyframes rainbow-shift-reverse {
          0% {
            filter: blur(30px) hue-rotate(30deg);
          }
          50% {
            filter: blur(30px) hue-rotate(-30deg);
          }
          100% {
            filter: blur(30px) hue-rotate(30deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CursorEffect;
 