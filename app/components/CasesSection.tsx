'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

type CaseResult = {
  text: string;
  value: string;
};

type Case = {
  title: string;
  company: string;
  description: string;
  results: CaseResult[];
};

const cases: Case[] = [
  {
    title: 'Создание CRM-агента',
    company: 'Группа компаний "Традиция"',
    description: 'Разработали интеллектуального агента для автоматизации работы с клиентами в CRM-системе компании. Агент обрабатывает звонки, транскрибирует их и заполняет карточки клиентов.',
    results: [
      { text: 'Сокращение времени на обработку звонков', value: '65%' },
      { text: 'Увеличение эффективности менеджеров', value: '42%' },
      { text: 'Автоматизация рутинных задач в CRM', value: '100%' }
    ]
  },
  {
    title: 'ИИ-ассистент для клиентского обслуживания',
    company: 'Группа компаний "Традиция"',
    description: 'Внедрили чат-бота на сайте и в мессенджерах компании для автоматизации поддержки клиентов и ответов на типовые вопросы.',
    results: [
      { text: 'Снижение нагрузки на колл-центр', value: '38%' },
      { text: 'Увеличение скорости ответа клиентам', value: 'в 10 раз' },
      { text: 'Круглосуточная поддержка без увеличения штата', value: '24/7' }
    ]
  },
  {
    title: 'ИИ-ассистент для внутреннего пользования',
    company: 'Группа компаний "Традиция"',
    description: 'Создали внутреннего ИИ-ассистента для поиска и работы с корпоративными документами, инструкциями и базами знаний.',
    results: [
      { text: 'Сокращение времени на поиск информации', value: '75%' },
      { text: 'Ускорение адаптации новых сотрудников', value: '40%' },
      { text: 'Централизация корпоративных знаний и опыта', value: '100%' }
    ]
  },
  {
    title: 'Предиктивная диагностика навесного оборудования',
    company: 'Группа компаний "Традиция"',
    description: 'Разработали систему на базе машинного обучения для прогнозирования отказов гидравлических и механических узлов навесного оборудования.',
    results: [
      { text: 'Снижение простоев техники', value: '48%' },
      { text: 'Сокращение затрат на аварийные ремонты', value: '35%' },
      { text: 'Увеличение срока службы узлов', value: '22%' }
    ]
  },
  {
    title: 'Компьютерное зрение для контроля качества',
    company: 'Группа компаний "Традиция"',
    description: 'Внедрили систему автоматического визуального контроля при помощи камер и нейросетей для выявления дефектов сварки на конвейере.',
    results: [
      { text: 'Уменьшение доли дефектной продукции', value: 'с 5% до 0,8%' },
      { text: 'Рост пропускной способности линии', value: '27%' },
      { text: 'Снижение ручных проверок', value: '90%' }
    ]
  }
];

const CasesSection = () => {
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Дублируем кейсы для бесконечного скролла
    const firstItems = carousel.querySelectorAll('.case-item');
    firstItems.forEach(item => {
      const clone = item.cloneNode(true);
      carousel.appendChild(clone);
    });
    
    // Функция для автоматической прокрутки
    let lastTime = 0;
    let animationId: number;
    
    const animate = (time: number) => {
      if (isPaused) {
        lastTime = time;
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      // Ограничиваем скорость анимации
      const elapsedTime = time - lastTime;
      if (elapsedTime > 16) { // ~60fps
        lastTime = time;
        
        // Рассчитываем новую позицию
        carousel.scrollLeft += 1; // Медленная скорость прокрутки
        
        // Бесконечная прокрутка
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
          carousel.scrollLeft = 0;
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused]);

  return (
    <section id="cases" className="py-28 relative overflow-hidden bg-black">
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
            Кейсы
          </motion.h2>
        </div>
        
        {/* Карусель с автоматической прокруткой */}
        <div 
          className="overflow-x-hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            ref={carouselRef}
            className="flex items-stretch gap-6 px-4 py-6 w-max overflow-visible"
            style={{ scrollBehavior: 'smooth' }}
          >
            {cases.map((caseItem, index) => (
              <motion.div
                key={`case-${index}`}
                className="case-item w-[300px] md:w-[350px] flex-shrink-0 bg-gradient-to-br from-blue-950/80 to-blue-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-800/30 relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Градиентная рамка */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="p-6 flex flex-col h-full">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-white mb-1">{caseItem.title}</h3>
                    <p className="text-sm text-blue-300">{caseItem.company}</p>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4 flex-grow">{caseItem.description}</p>
                  
                  <div className="mt-auto">
                    <h4 className="text-sm font-semibold text-blue-300 mb-2">Результаты:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {caseItem.results.map((result, resultIndex) => (
                        <div key={resultIndex} className="flex justify-between items-center">
                          <p className="text-xs text-gray-400">{result.text}</p>
                          <span className="text-xs font-bold text-blue-400 ml-2">{result.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Эффект свечения при наведении */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-blue-500/5 blur-xl -z-10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: hoveredIndex === index ? 0.5 : 0,
                    scale: hoveredIndex === index ? 1.1 : 1
                  }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CasesSection; 