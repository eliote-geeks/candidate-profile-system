// Types pour l'interface chat onboarding

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  emoji?: string;
}

export interface CandidateProfile {
  // Personal Information
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  country?: string;

  // Professional Background
  currentTitle?: string;
  yearsExperience?: string;
  currentCompany?: string;
  sector?: string;
  previousCompanies?: string[];

  // Education
  educationLevel?: string;
  degree?: string;
  institution?: string;
  fieldOfStudy?: string;
  graduationYear?: string;

  // Skills & Competencies
  skills?: string[];
  technicalSkills?: string[];
  softSkills?: string[];
  languages?: string[];
  languageLevels?: Record<string, string>; // {language: level}
  certifications?: string[];

  // Job Preferences
  desiredPositions?: string[];
  desiredSectors?: string[];
  desiredLocations?: string[];
  minSalary?: string;
  maxSalary?: string;
  contractTypes?: string[];

  // CV Data (for CV Generator)
  summary?: string;
  workExperience?: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  achievements?: string[];

  // Job Search Preferences
  noticePeriod?: string;
  remoteWork?: boolean;
  relocateWilling?: boolean;
  priority?: string; // 'salary' | 'growth' | 'stability' | 'remote'
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

// N8N Workflow Integration Types

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary?: string;
  requiredSkills: string[];
  sector: string;
  contractType: string;
  link?: string;
  source: string; // 'jobincamer' | 'linkedin' | 'etc'
  postedDate: string;
}

export interface CVGeneratorInput {
  profileId: string;
  candidateProfile: CandidateProfile;
  jobId?: string; // If generating for specific job
  jobDescription?: string; // For tailored CV
}

export interface CVGeneratorOutput {
  profileId: string;
  jobId?: string;
  cvContent: string;
  cvFormat: string; // 'json' | 'markdown' | 'html'
  generatedAt: string;
  compatibilityScore?: number;
}

export interface JobAnalyzerInput {
  profileId: string;
  jobId: string;
  jobOffer: JobOffer;
  candidateProfile: CandidateProfile;
}

export interface JobAnalyzerOutput {
  profileId: string;
  jobId: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  salaryMatch: boolean;
  locationMatch: boolean;
  analysis: string;
  recommendation: 'high_priority' | 'apply' | 'maybe' | 'skip';
}

export interface ApplicationInput {
  profileId: string;
  jobId: string;
  jobOffer: JobOffer;
  cvContent: string;
  motivationLetter?: string;
  candidateEmail: string;
  candidateName: string;
}

export interface ApplicationOutput {
  profileId: string;
  jobId: string;
  applicationId: string;
  status: 'sent' | 'failed' | 'pending';
  sentAt: string;
  recipientEmail?: string;
  confirmationUrl?: string;
  errorMessage?: string;
}
