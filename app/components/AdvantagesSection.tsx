'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
  const [flipped, setFlipped] = useState<number[]>([]);

  const toggleFlip = (index: number) => {
    if (flipped.includes(index)) {
      setFlipped(flipped.filter(i => i !== index));
    } else {
      setFlipped([...flipped, index]);
    }
  };

  const isFlipped = (index: number) => flipped.includes(index);

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
              className="relative h-80 perspective-1000 cursor-pointer gpu-accelerated"
              onMouseEnter={() => toggleFlip(i)}
              onMouseLeave={() => toggleFlip(i)}
            >
              <motion.div 
                className="absolute inset-0 w-full h-full"
                animate={{ 
                  rotateY: isFlipped(i) ? 180 : 0
                }}
                transition={{ 
                  duration: 0.8, 
                  type: 'spring',
                  damping: 22,
                  stiffness: 120,
                  mass: 1.2
                }}
                style={{ 
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Передняя сторона карточки */}
                <div 
                  className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center card backface-hidden"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    opacity: isFlipped(i) ? 0 : 1,
                    transition: 'all 0.8s cubic-bezier(0.45, 0, 0.25, 1)'
                  }}
                >
                  <div className="mb-6">
                    {advantage.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{advantage.title}</h3>
                </div>
                
                {/* Задняя сторона карточки */}
                <div 
                  className="absolute inset-0 p-8 flex flex-col items-center justify-center text-center card backface-hidden"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    opacity: isFlipped(i) ? 1 : 0,
                    transition: 'all 0.8s cubic-bezier(0.45, 0, 0.25, 1)'
                  }}
                >
                  <p className="opacity-70">{advantage.description}</p>
                </div>
              </motion.div>
              
              {/* Эффект свечения при наведении */}
              <div
                className="absolute inset-0 rounded-xl bg-zinc-800/20 blur-xl -z-10 transition-opacity duration-700"
                style={{
                  opacity: isFlipped(i) ? 0.7 : 0
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection; 