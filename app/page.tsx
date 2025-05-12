'use client';

import CursorEffect from './components/CursorEffect';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SolutionsSection from './components/SolutionsSection';
import AdvantagesSection from './components/AdvantagesSection';
import CasesSection from './components/CasesSection';
import ContactSection from './components/ContactSection';
import AIAssistant from './components/AIAssistant';
import { useState } from 'react';

export default function Home() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const handleAssistantToggle = () => {
    setIsAssistantOpen(prev => !prev);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Эффект следования за курсором */}
      <CursorEffect />
      
      {/* Шапка сайта */}
      <Header />
      
      {/* Секция "AI TO BIZ" */}
      <HeroSection />
      
      {/* Секция "Наши решения" */}
      <SolutionsSection />
      
      {/* Секция "Преимущества" */}
      <AdvantagesSection />
      
      {/* Секция "Кейсы" */}
      <CasesSection />
      
      {/* Секция "Давайте созидать вместе" */}
      <ContactSection />

      {/* ИИ-ассистент */}
      <AIAssistant isOpen={isAssistantOpen} onToggle={handleAssistantToggle} />
    </main>
  );
}
