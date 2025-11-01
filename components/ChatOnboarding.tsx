'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, AlertCircle, Check, ChevronDown, User, Briefcase, Target } from 'lucide-react';
import { ChatMessage } from '@/types/chat';
import { CHAT_FLOW, WELCOME_MESSAGE, COMPLETION_MESSAGE, VALIDATION_RULES } from '@/lib/chat-config';
import { useRouter } from 'next/navigation';

// 2025 Design: Minimal, intentional, bold typography
const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.3 }
};

interface CandidateFormData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  current_title?: string;
  years_experience?: string | number;
  education_level?: string;
  skills?: string;
  languages?: string;
  desired_positions?: string;
  desired_sectors?: string;
  desired_locations?: string;
  min_salary?: string | number;
  contract_types?: string[];
  linkedin_url?: string;
  portfolio_url?: string;
  [key: string]: any;
}

export default function ChatOnboarding() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CandidateFormData>({});
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['personal']));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const currentQuestion = CHAT_FLOW[currentStep];
  const progress = ((currentStep + 1) / CHAT_FLOW.length) * 100;
  const isMultiSelect = currentQuestion?.type === 'multiselect';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    addBotMessage({
      content: WELCOME_MESSAGE.content,
      emoji: WELCOME_MESSAGE.emoji,
    });
    setSelectedOptions(new Set());
  }, []);

  const addBotMessage = (msg: { content: string; emoji?: string }) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'bot',
        content: msg.content,
        timestamp: new Date(),
        emoji: msg.emoji,
      },
    ]);
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        type: 'user',
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const validateInput = (value: string): boolean => {
    const question = currentQuestion;
    const isOptional = question.text.toLowerCase().includes('optionnel');

    if (!value.trim() && isOptional) return true;
    if (!value.trim() && !isMultiSelect && !isOptional) return false;

    switch (question.type) {
      case 'email':
        return VALIDATION_RULES.email(value);
      case 'tel':
        if (!value.trim()) return true;
        return VALIDATION_RULES.phone(value);
      case 'number':
        if (!value.trim() && isOptional) return true;
        return VALIDATION_RULES.number(value);
      default:
        if (question.validation) {
          return question.validation(value);
        }
        return true;
    }
  };

  const getErrorMessage = (): string => {
    const question = currentQuestion;
    if (!input.trim() && !isMultiSelect) {
      return '⚠️ Tu dois répondre à cette question.';
    }
    if (isMultiSelect && selectedOptions.size === 0) {
      return '⚠️ Sélectionne au moins une option.';
    }
    switch (question.type) {
      case 'email':
        return '❌ Email invalide. Utilise un format comme: exemple@mail.com';
      case 'tel':
        return '❌ Format invalide. Utilise: +237 6XX XX XX XX';
      case 'number':
        return '❌ Doit être un nombre valide.';
      default:
        return question.placeholder ? `Format attendu: ${question.placeholder}` : 'Format invalide.';
    }
  };

  const handleSelectOption = (option: string) => {
    if (isMultiSelect) {
      const newSelected = new Set(selectedOptions);
      if (newSelected.has(option)) {
        newSelected.delete(option);
      } else {
        newSelected.add(option);
      }
      setSelectedOptions(newSelected);
      setError('');
    } else {
      setInput(option);
      setError('');
    }
  };

  const handleInput = (value: string) => {
    setInput(value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isOptional = currentQuestion.text.toLowerCase().includes('optionnel');
    let valueToSave: string | string[] = '';

    if (isMultiSelect) {
      if (selectedOptions.size === 0) {
        setError(getErrorMessage());
        return;
      }
      valueToSave = Array.from(selectedOptions);
    } else {
      if (!input.trim() && !isOptional) {
        setError('⚠️ Tu dois répondre à cette question.');
        return;
      }

      if (!input.trim() && isOptional) {
        valueToSave = '';
      } else {
        if (!validateInput(input)) {
          setError(getErrorMessage());
          return;
        }
        valueToSave = input;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [currentQuestion.fieldName]: valueToSave,
    }));

    const displayMessage = isMultiSelect
      ? Array.from(selectedOptions).join(', ')
      : input;
    addUserMessage(displayMessage);
    setInput('');
    setSelectedOptions(new Set());
    setError('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    // If we're editing a field, return to review mode after saving
    if (editingField) {
      setEditingField(null);
      setIsReviewMode(true);
      setIsLoading(false);
      return;
    }

    if (currentStep < CHAT_FLOW.length - 1) {
      setCurrentStep((prev) => prev + 1);
      const nextQuestion = CHAT_FLOW[currentStep + 1];

      addBotMessage({
        content: nextQuestion.text,
        emoji: nextQuestion.emoji,
      });

      if (nextQuestion.tip) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        addBotMessage({
          content: `💡 ${nextQuestion.tip}`,
        });
      }
    } else {
      // Go to review mode instead of submitting
      const finalMessage = `Parfait ! 🎉 Voici un résumé de tes informations. Vérifie tout et clique sur "Soumettre" pour valider.`;

      addBotMessage({
        content: finalMessage,
        emoji: '✅',
      });

      setIsReviewMode(true);
    }

    setIsLoading(false);
  };

  // Handle editing a field in review mode
  const handleEditField = (fieldName: string) => {
    setEditingField(fieldName);
    setIsReviewMode(false);

    // Find the step for this field and jump to it
    const stepIndex = CHAT_FLOW.findIndex((q) => q.fieldName === fieldName);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
      setInput(formData[fieldName]?.toString() || '');
    }
  };

  // Get human-readable field name
  const getFieldLabel = (fieldName: string): string => {
    const labels: Record<string, string> = {
      first_name: 'Prénom',
      last_name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      location: 'Localisation',
      current_title: 'Titre actuel',
      years_experience: 'Années d\'expérience',
      education_level: 'Niveau d\'études',
      skills: 'Compétences',
      languages: 'Langues',
      desired_positions: 'Postes souhaités',
      desired_sectors: 'Secteurs souhaités',
      desired_locations: 'Localisations souhaitées',
      min_salary: 'Salaire minimum',
      contract_types: 'Types de contrat',
      linkedin_url: 'LinkedIn',
      portfolio_url: 'Portfolio',
    };
    return labels[fieldName] || fieldName;
  };

  // Format field value for display
  const formatFieldValue = (fieldName: string, value: any): string => {
    if (!value) return '(non renseigné)';
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  };

  const submitProfile = async () => {
    try {
      setIsLoading(true);
      console.log('Submitting profile data:', formData);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (!token) {
        addBotMessage({
          content: '🔒 Merci de te connecter pour finaliser ton profil.',
        });
        setError('Connexion requise');
        router.push('/login?next=/onboarding');
        setIsLoading(false);
        return;
      }

      const payload: Record<string, unknown> = {};

      const fieldMapping: Record<string, keyof CandidateFormData> = {
        currentTitle: 'current_title',
        location: 'location',
        yearsExperience: 'years_experience',
        educationLevel: 'education_level',
        minSalary: 'min_salary',
        linkedinUrl: 'linkedin_url',
        portfolioUrl: 'portfolio_url',
      };

      Object.entries(fieldMapping).forEach(([camelKey, snakeKey]) => {
        const value = formData[snakeKey] ?? (formData as Record<string, unknown>)[camelKey];
        if (value !== undefined && value !== null && value !== '') {
          payload[camelKey] = value;
        }
      });

      const response = await fetch('/api/profiles/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile');
      }

      setIsLoading(false);
      router.push('/dashboard');
    } catch (err) {
      console.error('Error submitting profile:', err);
      addBotMessage({
        content: `❌ Erreur lors de la création du profil. ${err instanceof Error ? err.message : 'Réessaye.'}`,
        emoji: '🚨',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      {/* LEFT SIDEBAR - Progress & Info */}
      <div className="hidden lg:flex w-96 flex-col gap-8 border-r border-gray-200 bg-gray-50 p-12">
        {/* Logo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h2 className="text-2xl font-black text-gray-900">RecruitAI</h2>
          <p className="mt-1 text-sm text-gray-500">Assistant IA pour candidats</p>
        </motion.div>

        {/* Progress */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Progression</p>
              <p className="text-sm font-bold text-gray-900">{currentStep + 1}/{CHAT_FLOW.length}</p>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200">
              <motion.div
                className="h-full rounded-full bg-gray-900"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-white p-4 border border-gray-200"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">À propos</p>
          <p className="text-sm leading-relaxed text-gray-600">
            Complète ce formulaire pour que nous trouvions les meilleures opportunités d'emploi correspondant à ton profil.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">Étapes</p>
          <div className="space-y-3">
            {['Infos perso', 'Expérience', 'Préférences', 'Finalisation'].map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    idx < currentStep / 5
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {idx < currentStep / 5 ? '✓' : idx + 1}
                </div>
                <p className={`text-sm ${idx <= currentStep / 5 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header - Mobile */}
        <div className="lg:hidden border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-900">RecruitAI</h2>
              <p className="text-xs text-gray-500">{currentStep + 1}/{CHAT_FLOW.length}</p>
            </div>
            <motion.div
              className="h-2 w-32 rounded-full bg-gray-200 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-full bg-gray-900"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-6 sm:p-8 max-w-2xl mx-auto">
            <AnimatePresence mode="popLayout">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-sm px-4 py-3 rounded-2xl text-sm sm:text-base leading-relaxed ${
                      msg.type === 'bot'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-gray-900 text-white'
                    }`}
                  >
                    {msg.emoji && <span className="mr-2">{msg.emoji}</span>}
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 rounded-2xl px-4 py-3 flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-6 sm:p-8 overflow-y-auto flex flex-col">
          <div className="max-w-2xl mx-auto w-full">
            {/* REVIEW MODE - Modern 2025 Design with Sections */}
            {isReviewMode ? (
              <div className="space-y-4">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900">Vérifie ton profil</h3>
                  <p className="text-sm text-gray-500 mt-1">Revois tes informations avant de soumettre</p>
                </div>

                {/* SECTION 1: Informations Personnelles */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection('personal')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <User size={20} className="text-gray-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Infos personnelles</p>
                        <p className="text-xs text-gray-500">Prénom, email, localisation</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedSections.has('personal') ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} className="text-gray-600" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedSections.has('personal') && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 p-4 space-y-3 bg-white"
                      >
                        {(['first_name', 'last_name', 'email', 'phone', 'location'].map((key) => (
                          <div key={key} className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                            <div>
                              <p className="text-xs uppercase text-gray-500 font-semibold mb-1">{getFieldLabel(key)}</p>
                              <p className="text-sm text-gray-900 font-medium">{formatFieldValue(key, formData[key])}</p>
                            </div>
                            <motion.button
                              onClick={() => handleEditField(key)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-xs font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
                            >
                              Modifier
                            </motion.button>
                          </div>
                        )))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* SECTION 2: Expérience Professionnelle */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection('experience')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Briefcase size={20} className="text-gray-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Expérience</p>
                        <p className="text-xs text-gray-500">Titre, années, études</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedSections.has('experience') ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} className="text-gray-600" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedSections.has('experience') && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 p-4 space-y-3 bg-white"
                      >
                        {(['current_title', 'years_experience', 'education_level', 'skills', 'languages'].map((key) => (
                          <div key={key} className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                            <div>
                              <p className="text-xs uppercase text-gray-500 font-semibold mb-1">{getFieldLabel(key)}</p>
                              <p className="text-sm text-gray-900 font-medium">{formatFieldValue(key, formData[key])}</p>
                            </div>
                            <motion.button
                              onClick={() => handleEditField(key)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-xs font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
                            >
                              Modifier
                            </motion.button>
                          </div>
                        )))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* SECTION 3: Préférences de Recherche */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection('preferences')}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Target size={20} className="text-gray-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">Préférences</p>
                        <p className="text-xs text-gray-500">Postes, secteurs, salaire</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedSections.has('preferences') ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={20} className="text-gray-600" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedSections.has('preferences') && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 p-4 space-y-3 bg-white"
                      >
                        {(['desired_positions', 'desired_sectors', 'desired_locations', 'min_salary', 'contract_types'].map((key) => (
                          <div key={key} className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                            <div>
                              <p className="text-xs uppercase text-gray-500 font-semibold mb-1">{getFieldLabel(key)}</p>
                              <p className="text-sm text-gray-900 font-medium">{formatFieldValue(key, formData[key])}</p>
                            </div>
                            <motion.button
                              onClick={() => handleEditField(key)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="text-xs font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
                            >
                              Modifier
                            </motion.button>
                          </div>
                        )))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* SECTION 4: Liens & Portfolios */}
                {(formData.linkedin_url || formData.portfolio_url) && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleSection('links')}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Check size={20} className="text-gray-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">Liens</p>
                          <p className="text-xs text-gray-500">LinkedIn, Portfolio</p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedSections.has('links') ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={20} className="text-gray-600" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {expandedSections.has('links') && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 p-4 space-y-3 bg-white"
                        >
                          {(['linkedin_url', 'portfolio_url'].map((key) => (
                            formData[key] && (
                              <div key={key} className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                                <div>
                                  <p className="text-xs uppercase text-gray-500 font-semibold mb-1">{getFieldLabel(key)}</p>
                                  <p className="text-sm text-gray-900 font-medium break-all">{formatFieldValue(key, formData[key])}</p>
                                </div>
                                <motion.button
                                  onClick={() => handleEditField(key)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="text-xs font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
                                >
                                  Modifier
                                </motion.button>
                              </div>
                            )
                          )))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                  <motion.button
                    onClick={() => setIsReviewMode(false)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex-1 py-3 border-2 border-gray-900 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    ← Retour
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => submitProfile(), 500);
                    }}
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="flex-1 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Soumission...</span>
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        <span>Soumettre</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            ) : (
              // CHAT MODE
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="flex gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200"
                    >
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Options or Input */}
                {currentQuestion?.type === 'select' || isMultiSelect ? (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
                    initial="hidden"
                    animate="visible"
                  >
                    {currentQuestion?.options?.map((option) => (
                      <motion.button
                        key={option}
                        type="button"
                        onClick={() => handleSelectOption(option)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all flex items-center justify-between ${
                          isMultiSelect && selectedOptions.has(option)
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 bg-white text-gray-900 hover:border-gray-400'
                        }`}
                      >
                        <span>{option}</span>
                        {isMultiSelect && selectedOptions.has(option) && (
                          <Check size={18} className="ml-2" />
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.input
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    type={
                      currentQuestion?.type === 'email'
                        ? 'email'
                        : currentQuestion?.type === 'number'
                          ? 'number'
                          : 'text'
                    }
                    inputMode={
                      currentQuestion?.type === 'number'
                        ? 'numeric'
                        : currentQuestion?.type === 'tel'
                          ? 'tel'
                          : 'text'
                    }
                    value={input}
                    onChange={(e) => handleInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e as any)}
                    placeholder={currentQuestion?.placeholder || 'Réponds ici...'}
                    disabled={isLoading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 bg-white text-gray-900 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    autoFocus
                  />
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={
                    isLoading ||
                    (!isMultiSelect && !input.trim() && !currentQuestion?.text.toLowerCase().includes('optionnel')) ||
                    (isMultiSelect && selectedOptions.size === 0)
                  }
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Traitement...</span>
                    </>
                  ) : (
                    <>
                      <span>Continuer</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
