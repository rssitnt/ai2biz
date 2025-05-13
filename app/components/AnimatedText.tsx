import React from 'react';
import { motion } from 'framer-motion';

type AnimatedTextProps = {
  text: string | React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  tag?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  type?: 'paragraph' | 'word' | 'char';
  animation?: 'fadeUp' | 'fadeIn' | 'slide';
  once?: boolean;
  margin?: string;
};

const animations = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  },
  slide: {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  }
};

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 0.5,
  tag = 'p',
  type = 'paragraph',
  animation = 'fadeUp',
  once = true,
  margin = "-50px"
}) => {
  // Если текст это строка, разбиваем его на составляющие в зависимости от типа
  let elements: (string | React.ReactNode)[] = [];
  
  if (typeof text === 'string') {
    if (type === 'word') {
      elements = text.split(' ').map((word, index) => (
        index === text.split(' ').length - 1 ? word : `${word} `
      ));
    } else if (type === 'char') {
      elements = Array.from(text);
    } else {
      // Для 'paragraph' возвращаем целый текст
      elements = [text];
    }
  } else {
    // Если текст это ReactNode, обрабатываем его как один элемент
    elements = [text];
  }

  // Выбор анимации
  const selectedAnimation = animations[animation];

  // Определение тега компонента
  const Component = tag;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      className={className}
      style={{ overflow: 'hidden' }}
    >
      {elements.map((element, i) => (
        <motion.span
          key={i}
          custom={i + delay}
          variants={selectedAnimation}
          style={{ 
            display: type === 'char' ? 'inline-block' : undefined,
            whiteSpace: type === 'char' ? 'pre' : undefined,
            willChange: 'transform, opacity'
          }}
        >
          {element}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText; 