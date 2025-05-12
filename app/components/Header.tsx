'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';

// Ссылки навигации, вынесены за пределы компонента чтобы не пересоздаваться
const navLinks = [
  { href: '#solutions', label: 'Решения' },
  { href: '#advantages', label: 'Преимущества' },
  { href: '#cases', label: 'Кейсы' },
  { href: '#contact', label: 'Контакты' },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Используем useCallback для оптимизации функции обработчика скролла
  const handleScroll = useCallback(() => {
    const isScrolled = window.scrollY > 20;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  }, [scrolled]);

  // Плавная прокрутка к разделам
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    try {
      const element = document.querySelector(sectionId);
      if (element) {
        // Закрываем меню на мобильном, если оно открыто
        if (isOpen) setIsOpen(false);
        
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - 80, // Отступ для учета хедера
          behavior: 'smooth',
        });
      } else {
        console.error(`Секция ${sectionId} не найдена`);
      }
    } catch (error) {
      console.error("Ошибка при прокрутке к секции:", error);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled 
          ? 'py-2' 
          : 'py-4'
        }`}
    >
      <div className="absolute inset-0 backdrop-blur-md bg-black/5" />
      
      <div className="container relative mx-auto px-4 flex items-center">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/ai2biz_logo.png"
              alt="AI TO BIZ Logo"
              width={160}
              height={40}
              className="h-8 w-auto" 
            />
          </Link>
          
          {/* Навигация для десктопов */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-all"
                onClick={(e) => scrollToSection(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        
        {/* Кнопка мобильного меню */}
        <button 
          className="md:hidden text-white focus:outline-none ml-auto"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        
        {/* Мобильное меню */}
        <motion.div 
          className={`fixed inset-0 backdrop-blur-lg bg-black/80 p-4 z-50 flex flex-col justify-center items-center md:hidden ${isOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, y: -50 }}
          animate={{ 
            opacity: isOpen ? 1 : 0, 
            y: isOpen ? 0 : -50
          }}
          transition={{ duration: 0.3 }}
        >
          <button 
            className="absolute top-4 right-4 text-white focus:outline-none"
            onClick={() => setIsOpen(false)}
            aria-label="Закрыть меню"
          >
            <FiX size={24} />
          </button>
          
          <nav className="flex flex-col space-y-6 items-center text-lg">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className="opacity-80 hover:opacity-100 hover:text-blue-400 transition-all"
                onClick={(e) => scrollToSection(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </motion.div>
      </div>
    </header>
  );
};

export default Header; 