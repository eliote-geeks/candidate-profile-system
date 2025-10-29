// Types pour l'interface chat onboarding

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  emoji?: string;
}

export interface CandidateProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  currentTitle?: string;
  yearsExperience?: string;
  currentCompany?: string;
  sector?: string;
  educationLevel?: string;
  degree?: string;
  institution?: string;
  skills?: string[];
  languages?: string[];
  certifications?: string[];
  desiredPositions?: string[];
  desiredSectors?: string[];
  desiredLocations?: string[];
  minSalary?: string;
  contractTypes?: string[];
}

export interface ChatQuestion {
  id: string;
  text: string;
  emoji: string;
  fieldName: keyof CandidateProfile;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'multiselect' | 'textarea';
  options?: string[];
  placeholder?: string;
  validation?: (value: string) => boolean;
  dependsOn?: { field: string; value: string };
  tip?: string;
  skip?: boolean;
}

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  fields: string[];
}
