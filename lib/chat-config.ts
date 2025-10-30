// Chat configuration - Maps to job_automation_db candidates table fields
// Database fields: first_name, last_name, email, phone, location, current_title,
// years_experience, education_level, skills, languages, desired_positions,
// desired_sectors, desired_locations, min_salary, contract_types, linkedin_url, portfolio_url

export interface ChatQuestion {
  text: string;
  emoji: string;
  fieldName: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'multiselect';
  placeholder?: string;
  options?: string[];
  tip?: string;
  validation?: (value: string | string[]) => boolean;
}

export const CHAT_FLOW: ChatQuestion[] = [
  // Personal Information
  {
    text: 'Bienvenue! Quel est ton prénom?',
    emoji: '👋',
    fieldName: 'first_name',
    type: 'text',
    placeholder: 'Ex: Paul',
    tip: 'Utilise ton prénom réel',
  },
  {
    text: 'Et ton nom de famille?',
    emoji: '📝',
    fieldName: 'last_name',
    type: 'text',
    placeholder: 'Ex: Kamgang',
  },
  {
    text: 'Quel est ton adresse email?',
    emoji: '📧',
    fieldName: 'email',
    type: 'email',
    placeholder: 'nom@exemple.com',
    validation: (value: any) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(String(value));
    },
    tip: 'Les recruteurs te contacteront à cette adresse',
  },
  {
    text: 'Ton numéro de téléphone? (optionnel, appuie sur Entrée pour passer)',
    emoji: '📱',
    fieldName: 'phone',
    type: 'tel',
    placeholder: '+237612345678',
    tip: 'Format: +237 6XX XXX XXX ou laisse vide',
    validation: (value: any) => {
      // Optionnel, donc accepter vide
      if (!value || value.trim() === '') return true;
      const phoneRegex = /^(\+|0)[0-9\s\-()]{7,}$/;
      return phoneRegex.test(String(value).replace(/\s/g, ''));
    },
  },
  {
    text: 'Où es-tu basé(e)? (Ville ou pays)',
    emoji: '📍',
    fieldName: 'location',
    type: 'text',
    placeholder: 'Ex: Douala, Yaoundé',
    tip: 'Cela aide les recruteurs à trouver les offres adaptées',
  },

  // Professional Information
  {
    text: 'Quel est ton titre professionnel actuel?',
    emoji: '💼',
    fieldName: 'current_title',
    type: 'text',
    placeholder: 'Ex: Développeur Senior, Manager Commercial',
    tip: 'Ton rôle actuel ou le dernier rôle occupé',
  },
  {
    text: 'Combien d\'années d\'expérience as-tu?',
    emoji: '⏰',
    fieldName: 'years_experience',
    type: 'number',
    placeholder: 'Ex: 5',
    validation: (value: any) => {
      const num = parseInt(String(value));
      return !isNaN(num) && num >= 0 && num <= 70;
    },
    tip: 'Années complètes (0 = débutant)',
  },

  // Education
  {
    text: 'Quel est ton niveau d\'études le plus élevé?',
    emoji: '🎓',
    fieldName: 'education_level',
    type: 'select',
    options: [
      'Bac',
      'Bac+1',
      'Bac+2 (DEUG, DUT, BTS)',
      'Bac+3 (Licence)',
      'Bac+4',
      'Bac+5 (Master)',
      'Bac+6 ou plus',
      'Autre',
    ],
    tip: 'Sélectionne le niveau le plus élevé atteint',
  },

  // Skills
  {
    text: 'Quelles sont tes compétences principales? (sépare par virgule)',
    emoji: '🛠️',
    fieldName: 'skills',
    type: 'text',
    placeholder: 'Ex: Python, JavaScript, React, SQL, Leadership',
    tip: 'Liste tes 5-10 principales compétences',
  },

  {
    text: 'Quelles langues parles-tu? (sépare par virgule)',
    emoji: '🌍',
    fieldName: 'languages',
    type: 'text',
    placeholder: 'Ex: Français, Anglais, Espagnol',
    tip: 'Utile pour les offres internationales',
  },

  // Job Preferences
  {
    text: 'Quels postes souhaites-tu? (sépare par virgule)',
    emoji: '🎯',
    fieldName: 'desired_positions',
    type: 'text',
    placeholder: 'Ex: Développeur Full Stack, Tech Lead, Consultant',
    tip: 'Tu peux en lister plusieurs',
  },

  {
    text: 'Quels secteurs t\'intéressent? (sépare par virgule)',
    emoji: '🏢',
    fieldName: 'desired_sectors',
    type: 'text',
    placeholder: 'Ex: FinTech, E-commerce, SaaS, HealthTech',
    tip: 'Les domaines où tu souhaites travailler',
  },

  {
    text: 'Quelles localisations préfères-tu? (sépare par virgule)',
    emoji: '🗺️',
    fieldName: 'desired_locations',
    type: 'text',
    placeholder: 'Ex: Douala, Yaoundé, Remote, Anywhere',
    tip: 'Villes, pays ou "Remote"',
  },

  {
    text: 'Quel est ton salaire minimum souhaité en FCFA/mois? (optionnel)',
    emoji: '💰',
    fieldName: 'min_salary',
    type: 'number',
    placeholder: 'Ex: 500000',
    validation: (value: string) => {
      // Optionnel - accepter vide
      if (!value || value.trim() === '') return true;
      const num = parseInt(value);
      return !isNaN(num) && num >= 0;
    },
    tip: 'Appuie sur Entrée pour passer si pas de préférence',
  },

  {
    text: 'Quels types de contrats t\'intéressent?',
    emoji: '📋',
    fieldName: 'contract_types',
    type: 'multiselect',
    options: ['CDI (Permanent)', 'CDD (Contrat à durée déterminée)', 'Stage', 'Freelance', 'Consulting', 'Autre'],
    tip: 'Sélectionne un ou plusieurs types',
  },

  // Optional URLs
  {
    text: 'URL vers ton profil LinkedIn? (optionnel)',
    emoji: '🔗',
    fieldName: 'linkedin_url',
    type: 'text',
    placeholder: 'https://linkedin.com/in/tonprofil',
    tip: 'Laisse vide si tu préfères',
  },

  {
    text: 'URL vers ton portfolio ou site web? (optionnel)',
    emoji: '🌐',
    fieldName: 'portfolio_url',
    type: 'text',
    placeholder: 'https://tonportfolio.com',
    tip: 'Très utile si tu es créatif/développeur',
  },
];

export const WELCOME_MESSAGE = {
  emoji: '🤖',
  content: `👋 Bienvenue sur RecruitAI Cameroun !

Je suis ton assistant IA pour automatiser ta recherche d'emploi. Je vais t'aider à créer un profil complet en 10-15 minutes.

🎯 Ce que je vais faire pour toi :
• Scraper 8+ plateformes d'emploi camerounaises (JobinCamer, Emploi.cm, MinaJobs...)
• Analyser automatiquement les offres qui te correspondent
• Générer des CVs personnalisés avec l'IA
• Envoyer jusqu'à 50 candidatures/mois

C'est parti ! 🚀`,
};

export const COMPLETION_MESSAGE = {
  emoji: '🎉',
  content: `Félicitations {firstName} ! 🎉

✅ Ton profil a été enregistré avec succès dans la base de données !

🤖 L'IA va maintenant :
• Analyser les 90+ offres déjà collectées sur JobinCamer, Emploi.cm, etc.
• Calculer ton score de compatibilité avec chaque offre
• Générer des CVs personnalisés
• Envoyer automatiquement les meilleures candidatures

📊 Redirection vers ton dashboard...`,
};

export const VALIDATION_RULES = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  phone: (value: string): boolean => {
    const phoneRegex = /^(\+|0)[0-9\s\-()]{7,}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  },
  number: (value: string): boolean => {
    return !isNaN(parseInt(value)) && parseInt(value) >= 0;
  },
};
