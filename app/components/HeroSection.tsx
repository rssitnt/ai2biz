'use client';

import { useRef, Suspense } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from 'framer-motion';
import AmbientVideo from './AmbientVideo';
import dynamic from 'next/dynamic';
import AnimatedText from './AnimatedText';

// Динамический импорт ReactPlayer с отключенным SSR
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

// Вынесены варианты анимации за пределы компонента, чтобы они не пересоздавались
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const HeroSection = () => {
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  return (
    <section 
      id="hero-section"
      ref={sectionRef} 
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 bg-black"
    >
      {/* Фоновое видео */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Suspense fallback={<div className="absolute inset-0 bg-black"></div>}>
          <ReactPlayer
            url={[
              "/video.mp4", 
              "/video.mov"
            ]}
            width="100%"
            height="100%"
            playing={true}
            loop={true}
            muted={true}
            controls={false}
            playsinline={true}
            fallback={<div className="absolute inset-0 bg-black"></div>}
            config={{
              file: {
                attributes: {
                  style: {
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%'
                  }
                },
                forceVideo: true
              }
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
            onError={() => console.error("Ошибка загрузки видео")}
          />
        </Suspense>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-soft-light" />
      </div>

      <div className="container mx-auto px-4 z-10 text-center mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 1.2, 
            type: 'spring', 
            stiffness: 50, 
            damping: 15 
          }}
          className="mb-6 gpu-accelerated"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white inline-block">
            AI TO BIZ
          </h1>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto mb-12 gpu-accelerated"
        >
          <AnimatedText 
            text="Давайте созидать вместе"
            tag="h2"
            type="word"
            animation="fadeUp"
            className="text-2xl md:text-4xl font-medium relative"
            delay={0.2}
            once={true}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5,
            delay: 0.2,
            ease: "easeOut"
          }}
          className="flex justify-center"
        >
          <a 
            href="#contact" 
            className="py-3 px-8 rounded-lg font-medium text-white transition-all duration-300 ease-in-out bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
          >
            Оставить заявку
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 