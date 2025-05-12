'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiClock, FiRefreshCw } from 'react-icons/fi';

const advantages = [
  {
    title: 'Индивидуальный подход',
    description: 'Разрабатываем уникальные AI-решения под специфику вашего бизнеса, учитывая все особенности процессов и потребности команды.',
    icon: <FiCheckCircle className="text-3xl text-white" />
  },
  {
    title: 'Скорость внедрения',
    description: 'От первого контакта до работающего решения - всего несколько недель. Быстрая интеграция и обучение персонала.',
    icon: <FiClock className="text-3xl text-white" />
  },
  {
    title: 'Поддержка продукта',
    description: 'Мы постоянно улучшаем существующий продукт, обновляя модели и оптимизируя наших агентов.',
    icon: <FiRefreshCw className="text-3xl text-white" />
  }
];

const AdvantagesSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Анимация для заголовка и описания
  const titleVariants = {
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    hidden: { opacity: 0, y: -20, filter: 'blur(5px)' }
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: 30, 
      filter: 'blur(8px)',
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section id="advantages" className="pt-28 pb-20 relative overflow-hidden bg-black">
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
            Преимущества
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {advantages.map((advantage, i) => (
            <div 
              key={i}
              className="relative h-80 card cursor-pointer gpu-accelerated transition-all duration-100 hover:scale-[1.02] overflow-hidden"
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              onTouchStart={() => setHoveredCard(i === hoveredCard ? null : i)}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                {/* Иконка и заголовок (всегда видны) */}
                <motion.div 
                  className="flex flex-col items-center text-center"
                  initial="visible"
                  animate={hoveredCard === i ? "hidden" : "visible"}
                  variants={titleVariants}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-6">
                    {advantage.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{advantage.title}</h3>
                </motion.div>
                
                {/* Описание с стандартной анимацией */}
                <AnimatePresence mode="wait">
                  {hoveredCard === i && (
                    <motion.div
                      key={`description-${i}`}
                      className="absolute inset-0 p-8 flex flex-col items-center justify-center"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={descriptionVariants}
                    >
                      <div className="bg-zinc-900/50 backdrop-blur-sm p-4 rounded-xl w-full h-full flex items-center justify-center">
                        <p className="text-center">{advantage.description}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Эффект свечения при наведении */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-blue-500/5 blur-xl -z-10"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: hoveredCard === i ? 0.7 : 0,
                  scale: hoveredCard === i ? 1.1 : 1
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection; 