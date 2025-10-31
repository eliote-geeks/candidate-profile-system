/**
 * Core Entity Types - Aligned with Prisma Schema
 */

// ============ CANDIDATE ============
export interface Candidate {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  location?: string
  current_title?: string
  years_experience?: number
  education_level?: string
  skills: string[]
  languages: string[]
  desired_positions: string[]
  desired_sectors: string[]
  desired_locations: string[]
  min_salary?: number
  contract_types: string[]
  base_cv_url?: string
  linkedin_url?: string
  portfolio_url?: string
  active: boolean
  created_at: Date
  updated_at: Date
}

// ============ COMPANY ============
export interface Company {
  id: string
  name: string
  website?: string
  sector?: string
  size?: string
  location?: string
  description?: string
  reputation_score?: number
  total_reviews?: number
  hr_email?: string
  hr_name?: string
  linkedin_company_url?: string
  red_flags: string[]
  is_verified: boolean
  is_blacklisted: boolean
  blacklist_reason?: string
  total_job_offers?: number
  total_applications_sent?: number
  total_interviews?: number
  total_offers_received?: number
  success_rate?: number
  created_at: Date
  updated_at: Date
}

// ============ JOB OFFER ============
export interface JobOffer {
  id: string
  company_id?: string
  title: string
  description?: string
  location?: string
  contract_type?: string
  required_skills: string[]
  required_experience?: string
  education_required?: string
  languages_required: string[]
  salary_min?: number
  salary_max?: number
  salary_disclosed: boolean
  source_platform: string
  source_url: string
  external_id?: string
  posted_date?: Date
  deadline_date?: Date
  scraped_at: Date
  match_score?: number
  urgency_score?: number
  quality_score?: number
  predicted_success_rate?: number
  recruiter_name?: string
  recruiter_email?: string
  recruiter_linkedin?: string
  status: string
  is_duplicate: boolean
  duplicate_of?: string
  is_fraud: boolean
  fraud_reason?: string
  created_at: Date
  updated_at: Date
}

// ============ APPLICATION ============
export interface Application {
  id: string
  candidate_id?: string
  job_offer_id?: string
  company_id?: string
  cv_version?: string
  cv_url: string
  cover_letter_url?: string
  email_subject?: string
  email_body?: string
  sent_to_email?: string
  sent_at: Date
  optimal_time: boolean
  status: ApplicationStatus
  last_status_update: Date
  response_received: boolean
  response_date?: Date
  response_sentiment?: string
  follow_up_count: number
  last_follow_up_date?: Date
  next_follow_up_date?: Date
  interview_scheduled: boolean
  interview_date?: Date
  interview_location?: string
  interview_type?: string
  interview_completed: boolean
  outcome?: ApplicationOutcome
  outcome_date?: Date
  feedback_received?: string
  created_at: Date
  updated_at: Date
}

export type ApplicationStatus =
  | 'sent'
  | 'opened'
  | 'clicked'
  | 'replied'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'offer_received'
  | 'rejected'
  | 'accepted'

export type ApplicationOutcome =
  | 'accepted'
  | 'rejected'
  | 'pending'

// ============ DOCUMENT ============
export interface Document {
  id: string
  candidate_id?: string
  job_offer_id?: string
  application_id?: string
  type: 'cv' | 'cover_letter' | 'other'
  version?: string
  content?: string
  file_url?: string
  file_path?: string
  keywords_used: string[]
  template_used?: string
  ai_model_used?: string
  times_sent: number
  times_opened: number
  times_replied: number
  conversion_rate?: number
  created_at: Date
}

// ============ EMAIL ============
export interface Email {
  id: string
  application_id?: string
  direction: 'inbound' | 'outbound'
  subject?: string
  body?: string
  from_email?: string
  to_email?: string
  sent_at: Date
  opened: boolean
  opened_at?: Date
  clicked: boolean
  clicked_at?: Date
  sentiment?: string
  intent?: string
  extracted_info?: Record<string, any>
  created_at: Date
}

// ============ ANALYTICS ============
export interface Analytic {
  id: string
  candidate_id?: string
  period_start: Date
  period_end: Date
  period_type: 'daily' | 'weekly' | 'monthly'
  jobs_collected?: number
  jobs_qualified?: number
  qualification_rate?: number
  applications_sent?: number
  applications_opened?: number
  open_rate?: number
  responses_received?: number
  response_rate?: number
  avg_response_time_hours?: number
  interviews_scheduled?: number
  interview_rate?: number
  interviews_completed?: number
  offers_received?: number
  offer_rate?: number
  offers_accepted?: number
  best_platform?: string
  best_sector?: string
  best_company_size?: string
  cv_version_a_performance?: number
  cv_version_b_performance?: number
  winning_cv_version?: string
  created_at: Date
}

// ============ AB TEST ============
export interface ABTest {
  id: string
  candidate_id?: string
  test_name: string
  test_type?: string
  variant_a?: string
  variant_b?: string
  variant_a_sent?: number
  variant_a_opened?: number
  variant_a_replied?: number
  variant_a_interviews?: number
  variant_b_sent?: number
  variant_b_opened?: number
  variant_b_replied?: number
  variant_b_interviews?: number
  winning_variant?: 'a' | 'b'
  confidence_level?: number
  status: 'running' | 'completed' | 'paused'
  started_at: Date
  completed_at?: Date
  created_at: Date
}

// ============ SYSTEM LOG ============
export interface SystemLog {
  id: string
  log_level?: 'info' | 'warning' | 'error' | 'debug'
  workflow_name?: string
  node_name?: string
  message?: string
  error_details?: string
  candidate_id?: string
  job_offer_id?: string
  application_id?: string
  created_at: Date
}

// ============ SOCIAL MEDIA POST ============
export interface SocialMediaPost {
  id: string
  platform: string
  post_url: string
  post_id?: string
  post_text?: string
  posted_by?: string
  posted_by_url?: string
  posted_at?: Date
  is_job_offer: boolean
  job_title?: string
  company_name?: string
  contact_info?: string
  matched_job_offer_id?: string
  scraped_at: Date
  created_at: Date
}

// ============ EMAIL QUOTA ============
export interface EmailQuota {
  date: Date
  daily_limit: number
  emails_sent?: number
  emails_failed?: number
  emails_bounced?: number
  warmup_day?: number
  status: 'active' | 'paused' | 'exceeded'
  notes?: string
  created_at: Date
  updated_at: Date
}

// ============ USER (NEW - for authentication) ============
export interface User {
  id: string
  email: string
  password_hash?: string
  first_name: string
  last_name: string
  phone?: string
  avatar_url?: string
  is_verified: boolean
  is_active: boolean
  last_login?: Date
  created_at: Date
  updated_at: Date
}

// ============ SESSION (NEW - for authentication) ============
export interface Session {
  id: string
  user_id: string
  access_token: string
  refresh_token?: string
  expires_at: Date
  created_at: Date
}

// ============ PASSWORD RESET TOKEN (NEW) ============
export interface PasswordResetToken {
  id: string
  user_id: string
  token: string
  expires_at: Date
  used: boolean
  created_at: Date
}

// ============ EMAIL VERIFICATION TOKEN (NEW) ============
export interface EmailVerificationToken {
  id: string
  user_id: string
  email: string
  token: string
  expires_at: Date
  used: boolean
  created_at: Date
}
