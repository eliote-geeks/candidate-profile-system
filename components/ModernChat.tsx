'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronRight, Clock, Target } from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  emoji?: string;
  timestamp: Date;
}

export default function ModernChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [input, setInput] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    {
      emoji: '👋',
      text: 'Bienvenue! Quel est ton prénom?',
      hint: 'Ex: Paul',
      field: 'firstName',
    },
    {
      emoji: '📧',
      text: 'Quel est ton email?',
      hint: 'Ex: paul@example.com',
      field: 'email',
    },
    {
      emoji: '💼',
      text: 'Quel est ton titre professionnel actuel?',
      hint: 'Ex: Développeur Senior',
      field: 'currentTitle',
    },
    {
      emoji: '🎓',
      text: 'Quel est ton niveau d\'études?',
      hint: 'Ex: Master, Licence, Bac+2',
      field: 'education',
    },
    {
      emoji: '🎯',
      text: 'Quel poste souhaites-tu trouver?',
      hint: 'Ex: Développeur Full Stack',
      field: 'desiredPosition',
    },
  ];

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep) / questions.length) * 100;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const welcomeMsg: Message = {
      id: '0',
      type: 'bot',
      content: 'Salut 👋 Je suis RecruitAI. Je vais t\'aider à créer ton profil en quelques minutes. Commençons!',
      emoji: '🤖',
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
  }, []);

  const handleSubmit = async (value: string) => {
    if (!value.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: value,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate processing
    setTimeout(() => {
      if (currentStep + 1 < questions.length) {
        setCurrentStep((prev) => prev + 1);
        const nextQuestion = questions[currentStep + 1];
        const botMsg: Message = {
          id: (Date.now() + 100).toString(),
          type: 'bot',
          content: nextQuestion.text,
          emoji: nextQuestion.emoji,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        // Profile is complete, send to API
        submitProfile();
      }
      scrollToBottom();
    }, 600);
  };

  const submitProfile = async () => {
    try {
      // For ModernChat, we'll just show completion message and redirect
      const completionMsg: Message = {
        id: (Date.now() + 200).toString(),
        type: 'bot',
        content: `Parfait! Ton profil a été créé avec succès. Redirection vers ton dashboard...`,
        emoji: '✨',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, completionMsg]);
      setIsCompleted(true);

      // Wait a moment before redirecting
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      console.error('Error submitting profile:', err);
      const errorMsg: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: `❌ Erreur lors de la création du profil. Réessaye.`,
        emoji: '🚨',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isCompleted) {
      e.preventDefault();
      handleSubmit(input);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      {/* Premium Header with Hero Image */}
      <div className="relative h-28 bg-gradient-to-r from-blue-600 to-cyan-600 overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/95 to-cyan-600/95 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30"
            >
              <Sparkles className="text-white" size={24} />
            </motion.div>
            <div>
              <h1 className="text-white font-bold text-lg">RecruitAI</h1>
              <p className="text-white/80 text-xs">Créons ton profil candidat</p>
            </div>
          </div>

          {/* Progress Bar with Timer */}
          <div className="flex items-center gap-4 flex-1 mx-6">
            <div className="h-2 flex-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
              />
            </div>
            <span className="text-white/90 text-xs font-semibold whitespace-nowrap">
              {currentStep + 1}/{questions.length}
            </span>
          </div>

          {/* Stats Badges */}
          <div className="hidden md:flex gap-2 text-white text-xs">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur border border-white/20">
              <Clock size={14} />
              <span>3 min</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur border border-white/20">
              <Target size={14} />
              <span>{questions.length} étapes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scroll-smooth">
        <AnimatePresence mode="wait">
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
            >
              {msg.type === 'bot' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 text-lg shadow-lg"
                >
                  {msg.emoji || '🤖'}
                </motion.div>
              )}

              <div className={`max-w-xs ${msg.type === 'user' ? 'order-last' : ''}`}>
                <div
                  className={`rounded-2xl px-5 py-3 shadow-lg backdrop-blur-sm ${
                    msg.type === 'bot'
                      ? 'bg-slate-800/80 border border-slate-700/50 text-slate-200'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 px-2">
                  {msg.timestamp.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current Question */}
        {!isCompleted && currentQuestion && (
          <motion.div
            key="current-q"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-start mt-10"
          >
            <div className="max-w-xs w-full">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 shadow-lg hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl">{currentQuestion.emoji}</span>
                  <h3 className="text-slate-100 font-semibold text-sm leading-relaxed pt-0.5">
                    {currentQuestion.text}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 ml-8">{currentQuestion.hint}</p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mt-12"
          >
            <div className="max-w-xs w-full text-center">
              <div className="bg-gradient-to-br from-emerald-600/20 to-green-600/20 border border-green-500/50 rounded-2xl p-8 shadow-xl">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-6xl mb-4 inline-block"
                >
                  ✨
                </motion.div>
                <h3 className="text-slate-100 font-bold text-lg mb-2">
                  Profil Créé!
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                  Tes données sont sauvegardées. Accède à ton dashboard maintenant.
                </p>
                <motion.a
                  href="/dashboard"
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(6, 182, 212, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-semibold text-sm hover:shadow-lg transition-all"
                >
                  Dashboard →
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} className="pt-4" />
      </div>

      {/* Input Area */}
      {!isCompleted && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-md px-6 py-4 space-y-3"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écris ta réponse..."
              className="flex-1 bg-slate-800/80 border border-slate-700/50 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/30 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 outline-none transition-all text-sm backdrop-blur"
              autoFocus
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSubmit(input)}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-xl hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <ArrowRight size={18} />
            </motion.button>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-2 px-2">
            <span className="w-1 h-1 bg-cyan-500 rounded-full"></span>
            Appuie sur Entrée pour continuer
          </p>
        </motion.div>
      )}
    </div>
  );
}
