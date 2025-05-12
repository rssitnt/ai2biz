'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
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
    description: 'Разработали систему на базе машинного обучения для прогнозирования отказов гидравлических и механических узлов навесного оборудования. Агент собирает и анализирует данные с датчиков в реальном времени.',
    results: [
      { text: 'Снижение простоев техники', value: '48%' },
      { text: 'Сокращение затрат на аварийные ремонты', value: '35%' },
      { text: 'Увеличение срока службы узлов', value: '22%' }
    ]
  },
  {
    title: 'Компьютерное зрение для контроля качества сварных швов',
    company: 'Группа компаний "Традиция"',
    description: 'Внедрили систему автоматического визуального контроля при помощи камер и нейросетей для выявления дефектов сварки на конвейере.',
    results: [
      { text: 'Уменьшение доли дефектной продукции', value: 'с 5% до 0,8%' },
      { text: 'Рост пропускной способности линии', value: '27%' },
      { text: 'Снижение ручных проверок', value: '90%' }
    ]
  },
  {
    title: 'Оптимизация логистики запчастей и аксессуаров',
    company: 'Группа компаний "Традиция"',
    description: 'Реализовали ИИ-модель для планирования складских запасов и маршрутов доставки по дилерским центрам и сервисам.',
    results: [
      { text: 'Сокращение запасов на складе', value: '33%' },
      { text: 'Уменьшение сроков доставки', value: '18%' },
      { text: 'Экономия транспортных расходов', value: '12%' }
    ]
  },
  {
    title: 'Роботизированная автоматизация сборки навесных механизмов',
    company: 'Группа компаний "Традиция"',
    description: 'Настроили коллаборативных роботов для выполнения операций сборки и калибровки узлов, интегрированных с MES-системой.',
    results: [
      { text: 'Увеличение производительности линии', value: '55%' },
      { text: 'Снижение брака при сборке', value: '41%' },
      { text: 'Сокращение времени переналадки', value: '60%' }
    ]
  },
  {
    title: 'Прогнозирование спроса на навесное оборудование',
    company: 'Группа компаний "Традиция"',
    description: 'Внедрили модель машинного обучения для анализа исторических продаж, сезонности и макроэкономических факторов с целью точного планирования производства.',
    results: [
      { text: 'Точность прогноза спроса повысилась', value: 'до 92%' },
      { text: 'Сокращение отгрузок с задержкой', value: '50%' },
      { text: 'Уменьшение избыточных остатков', value: '28%' }
    ]
  },
  {
    title: 'Автоматизация планирования смен и загрузки оборудования',
    company: 'Группа компаний "Традиция"',
    description: 'Создан ИИ-алгоритм для динамического составления графиков работы операторов и машин на основе прогноза заказов и мастер-данных.',
    results: [
      { text: 'Снижение простоев оборудования', value: '38%' },
      { text: 'Увеличение выполнения плана', value: '24%' },
      { text: 'Оптимизация затрат на сверхурочные', value: '31%' }
    ]
  }
];

const CasesSection = () => {
  const outerCarouselRef = useRef<HTMLDivElement>(null);
  const innerCarouselRef = useRef<HTMLDivElement>(null);
  const [activeCase, setActiveCase] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isCloned, setIsCloned] = useState(false);

  // Состояния для обработки свайпов
  const [isDragging, setIsDragging] = useState(false); 
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Дублируем карточки для создания бесконечной карусели
  useEffect(() => {
    if (innerCarouselRef.current && !isCloned && cases.length > 0) {
      try {
        // Клонируем первую группу карточек и добавляем в конец
        const cards = innerCarouselRef.current.children;
        if (cards.length === cases.length) {
          // Добавляем клоны в начало и конец
          for (let i = 0; i < Math.min(4, cases.length); i++) {
            const cloneStart = cards[i].cloneNode(true) as HTMLElement;
            const cloneEnd = cards[cases.length - 1 - i].cloneNode(true) as HTMLElement;
            innerCarouselRef.current.insertBefore(cloneEnd, innerCarouselRef.current.firstChild);
            innerCarouselRef.current.appendChild(cloneStart);
          }
          setIsCloned(true);
          
          // Прокручиваем к первому элементу (пропуская клоны)
          setTimeout(() => {
            if (outerCarouselRef.current) {
              const cardWidth = cards[0].clientWidth || 0;
              const gapWidth = 24;
              outerCarouselRef.current.scrollLeft = (cardWidth + gapWidth) * Math.min(4, cases.length);
            }
          }, 100);
        }
      } catch (error) {
        console.error('Ошибка при клонировании элементов карусели:', error);
      }
    }
  }, [isCloned, cases.length]);

  // Автоматическое прокручивание карусели с постоянной скоростью
  useEffect(() => {
    let animationId: number | null = null;
    const speed = 1.2; // Скорость прокрутки
    let direction = 1; // 1 для движения вправо, -1 для движения влево
    let frameSkip = 0; // Пропуск кадров для оптимизации
    
    const animate = () => {
      if (isPaused || !outerCarouselRef.current || !innerCarouselRef.current || isDragging) return;
      
      // Пропускаем каждый второй кадр для снижения нагрузки
      frameSkip++;
      if (frameSkip % 2 !== 0) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      const carousel = outerCarouselRef.current;
      const container = innerCarouselRef.current;
      
      // Двигаем карусель
      carousel.scrollLeft += speed * direction;
      
      // Проверяем, не достигли ли мы конца или начала
      const cardWidth = container.firstElementChild?.clientWidth || 0;
      const gapWidth = 24;
      const totalWidth = cardWidth * cases.length + gapWidth * (cases.length - 1);
      
      // Если достигли конца или начала, меняем направление
      if (carousel.scrollLeft >= totalWidth - carousel.clientWidth) {
        direction = -1;
      } else if (carousel.scrollLeft <= 0) {
        direction = 1;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isPaused, isDragging]);

  // Обработчики событий для свайпов
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!outerCarouselRef.current) return;
    
    // Проверяем, что это не прокрутка тачпадом
    if (e.buttons === 1) { // Левая кнопка мыши
      setIsDragging(true);
      setIsPaused(true);
      setStartX(e.pageX - outerCarouselRef.current.offsetLeft);
      setScrollLeft(outerCarouselRef.current.scrollLeft);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!outerCarouselRef.current) return;
    
    // Проверяем, что это не прокрутка тачпадом
    if (e.touches.length === 1) {
      setIsDragging(true);
      setIsPaused(true);
      setStartX(e.touches[0].pageX - outerCarouselRef.current.offsetLeft);
      setScrollLeft(outerCarouselRef.current.scrollLeft);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!outerCarouselRef.current) return;
    
    // Предотвращаем стандартную прокрутку страницы
    e.preventDefault();
    
    // Плавная прокрутка карусели
    outerCarouselRef.current.style.scrollBehavior = 'smooth';
    outerCarouselRef.current.scrollLeft += e.deltaX;
    
    // Возвращаем обычное поведение после прокрутки
    setTimeout(() => {
      if (outerCarouselRef.current) {
        outerCarouselRef.current.style.scrollBehavior = 'auto';
      }
    }, 500);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !outerCarouselRef.current) return;
    
    const x = e.pageX - outerCarouselRef.current.offsetLeft;
    const walk = (x - startX) * 0.5; // Уменьшили множитель скорости
    outerCarouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !outerCarouselRef.current) return;
    
    const x = e.touches[0].pageX - outerCarouselRef.current.offsetLeft;
    const walk = (x - startX) * 0.5; // Уменьшили множитель скорости
    outerCarouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    if (!outerCarouselRef.current) return;
    
    // Добавляем плавную прокрутку при отпускании
    outerCarouselRef.current.style.scrollBehavior = 'smooth';
    
    // Через небольшую задержку возвращаем обычное поведение
    setTimeout(() => {
      if (outerCarouselRef.current) {
        outerCarouselRef.current.style.scrollBehavior = 'auto';
      }
    }, 500);
    
    setIsDragging(false);
    setIsPaused(false);
  };

  // Обработчик быстрого пролистывания клавишами
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!outerCarouselRef.current) return;
    
    const cardWidth = outerCarouselRef.current.firstElementChild?.firstElementChild?.clientWidth || 0;
    const gapWidth = 24;
    
    // Добавляем плавную прокрутку для клавиш
    outerCarouselRef.current.style.scrollBehavior = 'smooth';
    
    if (e.key === 'ArrowLeft') {
      outerCarouselRef.current.scrollLeft -= (cardWidth + gapWidth);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      outerCarouselRef.current.scrollLeft += (cardWidth + gapWidth);
      e.preventDefault();
    }
    
    // Возвращаем обычное поведение после прокрутки
    setTimeout(() => {
      if (outerCarouselRef.current) {
        outerCarouselRef.current.style.scrollBehavior = 'auto';
      }
    }, 500);
  };

  // Комбинированный обработчик для события onMouseLeave
  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    } else {
      setIsPaused(false);
    }
  };

  // Функция для создания стиля обводки с индивидуальными границами
  const getBorderStyles = useCallback((isActive: boolean) => {
    if (!isActive) {
      return {
        borderTopWidth: '0px',
        borderRightWidth: '0px',
        borderBottomWidth: '0px',
        borderLeftWidth: '0px',
        borderColor: 'rgb(59, 130, 246)', // blue-500
        borderStyle: 'solid',
        transitionProperty: 'border-width',
        transitionTimingFunction: 'ease-out',
      };
    }

    return {
      borderTopWidth: '1px',
      borderRightWidth: '1px',
      borderBottomWidth: '1px',
      borderLeftWidth: '1px',
      borderColor: 'rgb(59, 130, 246)', // blue-500
      borderStyle: 'solid',
      transitionProperty: 'border-width',
      transitionTimingFunction: 'ease-out',
      transitionDuration: '0.2s',
      transitionDelay: '0s, 0.1s, 0.2s, 0.3s', // Задержки для каждой стороны
    };
  }, []);

  return (
    <section id="cases" className="pt-28 pb-20 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-soft-light" />
      
      <div className="container mx-auto px-4 relative z-10 mb-16">
        <div className="flex justify-center w-full">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mt-4"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.02,
              ease: "easeOut"
            }}
          >
            Кейсы
          </motion.h2>
        </div>
      </div>
      
      <div 
        ref={outerCarouselRef}
        className={`flex overflow-x-hidden pb-8 pt-4 hide-scrollbar select-none w-full
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ 
          scrollBehavior: isDragging ? 'auto' : 'smooth', 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          scrollSnapType: 'x mandatory'
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div 
          ref={innerCarouselRef}
          className="flex gap-6 md:gap-8 pl-6 pr-12 md:pl-[calc(50vw-500px)] md:pr-24 select-none [&>*]:transition-all [&>*]:duration-50"
        >
          {cases.map((caseItem, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[350px] card gpu-accelerated hover:scale-[1.02] hover:-translate-y-1 transition-transform duration-50 select-none relative overflow-hidden scroll-snap-align-start"
              style={{
                transform: 'translate3d(0,0,0)', 
                willChange: 'transform',
                pointerEvents: isDragging ? 'none' : 'auto',
                borderRadius: '12px',
                scrollSnapAlign: 'start'
              }}
              onMouseEnter={() => setActiveCase(i)}
              onMouseLeave={() => setActiveCase(null)}
            >
              <div className="p-6">
                <span className="text-xs text-blue-400 font-semibold block mb-2">{caseItem.company}</span>
                <h3 className={`text-xl font-semibold mb-3 transition-colors duration-100 ${
                  activeCase === i ? 'text-blue-500' : ''
                }`}>{caseItem.title}</h3>
                
                <p className="mb-5 text-sm opacity-70">{caseItem.description}</p>
                
                <div className="mb-2">
                  <h4 className="text-sm font-semibold opacity-80 mb-3">Результаты:</h4>
                  <ul className="space-y-2">
                    {caseItem.results.map((result, j) => (
                      <li key={j} className="flex justify-between text-sm">
                        <span className="opacity-70">{result.text}</span>
                        <span className="font-medium text-blue-500">{result.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CasesSection; 