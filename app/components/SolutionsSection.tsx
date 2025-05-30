'use client';

import { useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import AnimatedText from './AnimatedText';

type Solution = {
  title: string;
  description: string;
  features: string[];
};

type SolutionsSectionProps = {
  onOpenAssistant: (text: string) => void;
};

const solutions: Solution[] = [
  {
    title: 'CRM-заполнение и оценка звонков',
    description: 'Автоматизирует заполнение событий в CRM-системе компании, транскрибирует звонки и оценивает качество общения сотрудников с клиентами.',
    features: [
      'Автоматическая транскрипция звонков',
      'Заполнение событий в CRM',
      'Оценка общения по различным критериям'
    ]
  },
  {
    title: 'Поисковик для сотрудников',
    description: 'Навигатор по внутренним ресурсам компании, позволяющий быстро находить нужную информацию.',
    features: [
      'Поиск контактов сотрудников',
      'Доступ к корпоративной информации',
      'Интеграция с телеграм-ботом'
    ]
  },
  {
    title: 'Ассистент по обслуживанию клиентов',
    description: 'Универсальный агент для автоматизации клиентского обслуживания с поддержкой голосового и текстового режимов.',
    features: [
      'Мгновенные ответы на вопросы в чатах и по телефону',
      'Интеграция с CRM и телефонией',
      'Работа 24/7 с автопереводом на операторов',
      'Экономия до 70% на обслуживании'
    ]
  }
];

const SolutionsSection = ({ onOpenAssistant }: SolutionsSectionProps) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeButtonIndex, setActiveButtonIndex] = useState<number | null>(null);

  const handleOpenAssistant = (solutionTitle: string, index: number) => {
    console.log(`Хочу узнать подробнее про ${solutionTitle}`);
    setActiveButtonIndex(index === activeButtonIndex ? null : index);
    
    // Вызываем функцию из props с автоматическим текстом для ассистента
    onOpenAssistant(`Расскажи подробнее про ${solutionTitle}`);
  };

  return (
    <section id="solutions" className="pt-28 pb-20 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-soft-light" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center w-full mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mt-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            Наши решения
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              className="card h-full flex flex-col gpu-accelerated"
              style={{ 
                transformOrigin: 'center center',
                transform: hoveredCard === i ? 'scale(1.02) translateY(-3px)' : 'none',
                transition: 'transform 0.18s ease-out',
                willChange: 'transform'
              }}
            >
              <div className="p-6 flex-1 flex flex-col">
                <AnimatedText 
                  text={solution.title}
                  tag="h3"
                  type="word"
                  animation="fadeUp"
                  className="text-xl font-semibold mb-3"
                  delay={i * 0.1}
                />
                
                <AnimatedText 
                  text={solution.description}
                  animation="fadeUp"
                  className="opacity-70 mb-5"
                  delay={i * 0.1 + 0.1}
                />
                
                <div className="mb-6 flex-1">
                  <AnimatedText 
                    text="Возможности:"
                    tag="h4"
                    animation="fadeUp"
                    className="text-sm font-semibold opacity-80 mb-3"
                    delay={i * 0.1 + 0.2}
                  />
                  
                  <ul className="space-y-2">
                    {solution.features.map((feature, j) => (
                      <motion.li 
                        key={j} 
                        className="flex items-start opacity-70"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.3, 
                          delay: i * 0.1 + j * 0.07 + 0.3 
                        }}
                      >
                        <span className="text-blue-500 mr-2">•</span>
                        <AnimatedText 
                          text={feature}
                          animation="fadeUp"
                          type="word"
                          delay={i * 0.05 + j * 0.05}
                        />
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <button
                  onClick={() => handleOpenAssistant(solution.title, i)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium relative overflow-hidden group w-full mt-auto transition-all duration-300 ${hoveredCard === i ? 'gradient-fill-button active' : 'bg-[#18181b]/80'}`}
                  style={{
                    transform: hoveredCard === i ? 'scale(1.03)' : 'scale(1)',
                    transition: 'transform 0.25s ease-out, background-color 0.3s ease'
                  }}
                >
                  <span className="relative z-10">Подробнее</span>
                  <FiArrowRight 
                    className="relative z-10"
                    style={{ 
                      transform: hoveredCard === i ? 'translateX(4px)' : 'none',
                      transition: 'transform 0.15s ease-out'
                    }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection; 