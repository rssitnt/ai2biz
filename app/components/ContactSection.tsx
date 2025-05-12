'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTelegram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { FiSend, FiUser, FiBriefcase, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';
import { submitLead } from '../utils/supabase';

type ContactMethod = 'email' | 'phone' | 'telegram';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    position: '',
    email: '',
    phone: '',
    telegram: '',
    contactMethod: 'email' as ContactMethod,
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{success: boolean, message: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);
    
    try {
      // Используем функцию submitLead вместо прямого обращения к supabase
      await submitLead({
        name: formData.name,
        company: formData.company,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        telegram: formData.telegram,
        contact_method: formData.contactMethod,
        message: formData.message
      });
      
      // Сбрасываем форму при успешной отправке
      setFormData({
        name: '',
        company: '',
        position: '',
        email: '',
        phone: '',
        telegram: '',
        contactMethod: 'email' as ContactMethod,
        message: ''
      });
      
      setSubmitResult({
        success: true,
        message: 'Спасибо! Ваша заявка отправлена. Мы скоро свяжемся с вами.'
      });
      
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
      setSubmitResult({
        success: false,
        message: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="pt-28 pb-20 relative overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-soft-light" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center w-full mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 text-transparent bg-clip-text mt-4 animate-gradient-x"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            Давайте созидать вместе
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div 
            className="md:col-span-2 card p-6 gpu-accelerated"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            <h3 className="text-2xl font-bold mb-6">Оставить заявку</h3>
            
            {submitResult && (
              <div className={`mb-4 p-3 rounded-lg ${submitResult.success ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                {submitResult.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-sm opacity-70 flex items-center gap-2">
                    <FiUser /> ФИО
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full glassmorphism p-3 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
                    placeholder="Иванов Иван Иванович"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm opacity-70 flex items-center gap-2">
                    <FiBriefcase /> Компания
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full glassmorphism p-3 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
                    placeholder="Название компании"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm opacity-70 flex items-center gap-2">
                    <FiBriefcase /> Должность
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full glassmorphism p-3 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
                    placeholder="Ваша должность"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm opacity-70 flex items-center gap-2">
                    <FiMail /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full glassmorphism p-3 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
                    placeholder="example@company.com"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm opacity-70 flex items-center gap-2">
                    <FiPhone /> Телефон
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full glassmorphism p-3 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
                    placeholder="+7 (___) ___-__-__"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm opacity-70 flex items-center gap-2">
                    <FaTelegram /> Telegram
                  </label>
                  <input
                    type="text"
                    name="telegram"
                    value={formData.telegram}
                    onChange={handleChange}
                    className="w-full glassmorphism p-3 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
                    placeholder="@username"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="text-sm opacity-70 block mb-1">Предпочтительный способ связи</label>
                <select
                  name="contactMethod"
                  value={formData.contactMethod}
                  onChange={handleChange}
                  className="w-full glassmorphism p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
                >
                  <option value="email">Email</option>
                  <option value="phone">Телефон</option>
                  <option value="telegram">Telegram</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="text-sm opacity-70 flex items-center gap-2 mb-1">
                  <FiMessageSquare /> Сообщение
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full glassmorphism p-3 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg"
                  placeholder="Расскажите о вашем проекте или задайте вопрос"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-700 ease-smooth relative overflow-hidden group flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <span className="relative z-10">{isSubmitting ? 'Отправка...' : 'Отправить заявку'}</span>
                <FiSend className="relative z-10 group-hover:translate-x-1 transition-transform duration-700 ease-smooth" />
                <div className="absolute inset-0 bg-zinc-800 group-hover:bg-zinc-700 transition-all duration-700 ease-smooth"></div>
              </button>
            </form>
          </motion.div>
          
          <motion.div 
            className="md:col-span-1 space-y-6 gpu-accelerated"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            <div className="card p-6">
              <h3 className="text-2xl font-bold mb-6">Связаться с нами</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm opacity-70 mb-1">Email</p>
                  <a href="mailto:info@ai2biz.ru" className="hover:text-blue-500 transition-colors duration-500 ease-smooth">
                    info@ai2biz.ru
                  </a>
                </div>
                
                <div>
                  <p className="text-sm opacity-70 mb-1">Телефон</p>
                  <a href="tel:+79991234567" className="hover:text-blue-500 transition-colors duration-500 ease-smooth">
                    +7 (999) 123-45-67
                  </a>
                </div>
                
                <div>
                  <p className="text-sm opacity-70 mb-1">Telegram</p>
                  <a href="https://t.me/ai2biz" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors duration-500 ease-smooth">
                    @ai2biz
                  </a>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <h3 className="text-xl font-bold mb-4">Наши соцсети</h3>
              
              <div className="flex space-x-6">
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition-all duration-500 ease-smooth"
                >
                  <FaYoutube className="w-8 h-8" />
                </a>
                
                <a 
                  href="https://t.me/ai2biz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-all duration-500 ease-smooth"
                >
                  <FaTelegram className="w-8 h-8" />
                </a>
                
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 transition-all duration-500 ease-smooth"
                >
                  <FaLinkedin className="w-8 h-8" />
                </a>
              </div>
            </div>
            
            <p className="text-center opacity-50 text-sm">
              Сайт ПОЛНОСТЬЮ сгенерирован искусственным интеллектом
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 