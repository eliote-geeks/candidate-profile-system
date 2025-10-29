import { ChatQuestion } from '@/types/chat';

export const CHAT_FLOW: ChatQuestion[] = [
  // ÉTAPE 1: Infos Personnelles
  {
    id: 'step_1_firstname',
    text: 'Quel est ton prénom ? 👋',
    emoji: '👋',
    fieldName: 'firstName',
    type: 'text',
    placeholder: 'Paul',
    validation: (v) => v.length >= 2,
    tip: 'On aime bien connaître nos candidats !',
  },
  {
    id: 'step_2_lastname',
    text: 'Et ton nom de famille ? 📝',
    emoji: '📝',
    fieldName: 'lastName',
    type: 'text',
    placeholder: 'Dupont',
    validation: (v) => v.length >= 2,
  },
  {
    id: 'step_3_email',
    text: 'Ton email professionnel ou personnel ? 📧',
    emoji: '📧',
    fieldName: 'email',
    type: 'email',
    placeholder: 'paul.dupont@example.com',
    validation: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    tip: 'Utilise un email que tu consultes régulièrement',
  },
  {
    id: 'step_4_phone',
    text: 'Ton numéro de téléphone ? 📱',
    emoji: '📱',
    fieldName: 'phone',
    type: 'tel',
    placeholder: '+237 6XX XX XX XX',
  },
  {
    id: 'step_5_location',
    text: 'Où habites-tu ? 📍',
    emoji: '📍',
    fieldName: 'location',
    type: 'text',
    placeholder: 'Douala, Cameroun',
    tip: 'Ville et pays. Les annonces seront filtrées en fonction',
  },

  // ÉTAPE 2: Expérience Professionnelle
  {
    id: 'step_6_current_title',
    text: 'Quel est ton titre professionnel actuel ? 💼',
    emoji: '💼',
    fieldName: 'currentTitle',
    type: 'text',
    placeholder: 'Développeur Full Stack',
    validation: (v) => v.length >= 3,
  },
  {
    id: 'step_7_years_exp',
    text: 'Combien d\'années d\'expérience as-tu ? ⏳',
    emoji: '⏳',
    fieldName: 'yearsExperience',
    type: 'number',
    placeholder: '5',
    validation: (v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 70,
    tip: 'Arrondis-le (ex: 5 ans, 2 ans, 10 ans)',
  },
  {
    id: 'step_8_current_company',
    text: 'Où travailles-tu actuellement ? 🏢',
    emoji: '🏢',
    fieldName: 'currentCompany',
    type: 'text',
    placeholder: 'Obuy.tech',
  },
  {
    id: 'step_9_sector',
    text: 'Dans quel secteur ? 🏭',
    emoji: '🏭',
    fieldName: 'sector',
    type: 'select',
    options: [
      'IT/Tech',
      'Finance/Fintech',
      'E-commerce',
      'Santé',
      'Éducation',
      'Télécommunications',
      'ONG/Non-profit',
      'Média/Marketing',
      'Startup',
      'Autre',
    ],
  },

  // ÉTAPE 3: Compétences
  {
    id: 'step_10_skills',
    text: 'Quelles sont tes compétences principales ? 🔧',
    emoji: '🔧',
    fieldName: 'skills',
    type: 'multiselect',
    options: [
      'JavaScript',
      'Python',
      'React',
      'Node.js',
      'PostgreSQL',
      'Docker',
      'AWS',
      'TypeScript',
      'Vue.js',
      'Angular',
      'MongoDB',
      'GraphQL',
      'Kubernetes',
      'DevOps',
      'CI/CD',
      'Autre',
    ],
    tip: 'Sélectionne jusqu\'à 6 compétences principales',
  },
  {
    id: 'step_11_languages',
    text: 'Quelles langues parles-tu ? 🗣️',
    emoji: '🗣️',
    fieldName: 'languages',
    type: 'multiselect',
    options: ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Chinois', 'Arabe'],
    tip: 'Sélectionne celles que tu parles couramment',
  },
  {
    id: 'step_12_education',
    text: 'Quel est ton niveau d\'études ? 🎓',
    emoji: '🎓',
    fieldName: 'educationLevel',
    type: 'select',
    options: ['Bac', 'Licence', 'Master', 'Doctorat', 'Formation professionnelle', 'Autodidacte'],
  },
  {
    id: 'step_13_degree',
    text: 'Quel est ton diplôme ou ta spécialité ? 📚',
    emoji: '📚',
    fieldName: 'degree',
    type: 'text',
    placeholder: 'Informatique, Génie Logiciel, etc.',
  },
  {
    id: 'step_14_institution',
    text: 'Chez quel établissement ? 🏫',
    emoji: '🏫',
    fieldName: 'institution',
    type: 'text',
    placeholder: 'Université de Douala',
  },

  // ÉTAPE 4: Préférences
  {
    id: 'step_15_desired_positions',
    text: 'Quels postes t\'intéressent ? 🎯',
    emoji: '🎯',
    fieldName: 'desiredPositions',
    type: 'multiselect',
    options: [
      'Développeur Full Stack',
      'Développeur Backend',
      'Développeur Frontend',
      'DevOps Engineer',
      'Tech Lead',
      'Architecte Logiciel',
      'Data Engineer',
      'Product Manager',
      'Autre',
    ],
    tip: 'Sélectionne 2-3 postes',
  },
  {
    id: 'step_16_desired_sectors',
    text: 'Quels secteurs te plaisent ? 🏭',
    emoji: '🏭',
    fieldName: 'desiredSectors',
    type: 'multiselect',
    options: [
      'IT/Tech',
      'Fintech',
      'E-commerce',
      'Santé',
      'Éducation',
      'Télécommunications',
      'ONG',
      'Media',
      'Startup',
      'Autre',
    ],
  },
  {
    id: 'step_17_desired_locations',
    text: 'Où aimerais-tu travailler ? 🌍',
    emoji: '🌍',
    fieldName: 'desiredLocations',
    type: 'multiselect',
    options: [
      'Douala',
      'Yaoundé',
      'Buea',
      'Bamenda',
      'Remote',
      'Anywhere',
    ],
    tip: 'Tu peux sélectionner plusieurs villes',
  },
  {
    id: 'step_18_min_salary',
    text: 'Quel est ton salaire minimum souhaité ? 💰',
    emoji: '💰',
    fieldName: 'minSalary',
    type: 'number',
    placeholder: '500000',
    tip: 'En FCFA par mois (environ 900€)',
  },
  {
    id: 'step_19_contract_types',
    text: 'Quel type de contrat préfères-tu ? 📋',
    emoji: '📋',
    fieldName: 'contractTypes',
    type: 'multiselect',
    options: ['CDI', 'CDD', 'Stage', 'Freelance', 'Ouvert'],
  },
];

// Utilité: Messages de bienvenue et de clôture
export const WELCOME_MESSAGE = {
  emoji: '🤖',
  content: `👋 Bienvenue sur RecruitAI !

Je suis ton assistant de recherche d'emploi. Je vais t'aider à créer un profil complet en seulement 10-15 minutes.

Prêt ? C'est parti ! 🚀`,
};

export const COMPLETION_MESSAGE = {
  emoji: '✨',
  content: `🎉 Bravo {firstName} !

Ton profil est maintenant complet. Notre système IA va maintenant:
• Analyser tes compétences
• Scraper les meilleures offres
• Scorer les offres par pertinence
• Générer des CVs personnalisés

Tu vas recevoir les premières offres dans quelques minutes. Redirection vers ton dashboard...`,
};

export const ERROR_MESSAGES = {
  invalidEmail: '❌ Email invalide. Utilise un format comme: exemple@mail.com',
  invalidPhone: '❌ Numéro invalide. Format: +237 6XX XX XX XX',
  invalidNumber: '❌ Nombre invalide. Utilise uniquement des chiffres.',
  required: '⚠️ Champ requis. Veuillez répondre.',
  networkError: '🚨 Erreur réseau. Réessaye dans un moment.',
  serverError: '❌ Erreur serveur. Contacte le support.',
};

export const VALIDATION_RULES = {
  email: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone: (v: string) => /^(\+|0)[0-9\s]{8,}$/.test(v),
  number: (v: string) => !isNaN(Number(v)),
  required: (v: string) => v.trim().length > 0,
};
