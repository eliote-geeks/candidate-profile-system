/**
 * User Profile and Candidate Management Types
 */

export interface CandidateProfile {
  id: string
  email: string
  first_name: string
  last_name: string
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

export interface ProfileUpdateRequest {
  first_name?: string
  last_name?: string
  phone?: string
  location?: string
  current_title?: string
  years_experience?: number
  education_level?: string
  skills?: string[]
  languages?: string[]
  desired_positions?: string[]
  desired_sectors?: string[]
  desired_locations?: string[]
  min_salary?: number
  contract_types?: string[]
  base_cv_url?: string
  linkedin_url?: string
  portfolio_url?: string
}

export interface ProfileResponse {
  success: boolean
  profile?: CandidateProfile
  error?: string
}

export interface ApplicationHistoryEntry {
  id: string
  job_title: string
  company_name: string
  sent_at: Date
  status: ApplicationStatus
  response_received: boolean
  interview_scheduled: boolean
  outcome?: 'accepted' | 'rejected' | 'pending'
  next_follow_up_date?: Date
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

export interface ApplicationSummary {
  total_sent: number
  total_opened: number
  total_replied: number
  interviews_scheduled: number
  offers_received: number
  acceptance_rate: number
  average_response_time_hours: number
  last_application_date?: Date
}

export interface DuplicateCheckRequest {
  job_offer_id: string
  candidate_id: string
}

export interface DuplicateCheckResponse {
  is_duplicate: boolean
  existing_application_id?: string
  message: string
}

export interface ApplicationLimitStatus {
  daily_limit: number
  applications_sent_today: number
  remaining_quota: number
  reset_time: Date
  can_apply: boolean
}

export interface CandidateSearchFilters {
  skills?: string[]
  experience_min?: number
  experience_max?: number
  desired_positions?: string[]
  desired_sectors?: string[]
  location?: string
  languages?: string[]
  contract_types?: string[]
}

export interface CandidateDashboardData {
  profile: CandidateProfile
  application_summary: ApplicationSummary
  recent_applications: ApplicationHistoryEntry[]
  application_limit_status: ApplicationLimitStatus
  documents: DocumentInfo[]
}

export interface DocumentInfo {
  id: string
  type: 'cv' | 'cover_letter'
  version: string
  created_at: Date
  times_used: number
  conversion_rate: number
}

export interface ProfileVerificationStatus {
  email_verified: boolean
  phone_verified: boolean
  profile_complete: boolean
  completion_percentage: number
  missing_fields: string[]
}
