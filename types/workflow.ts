/**
 * Workflow Integration Types
 */

export interface WorkflowWebhookPayload {
  event_type: string
  timestamp: Date
  data: Record<string, any>
  metadata?: {
    source: string
    request_id: string
    ip_address?: string
  }
}

export interface CVGeneratorRequest {
  candidate_id: string
  job_offer_id: string
  template?: string
  include_cover_letter?: boolean
  personalization_level?: 'basic' | 'medium' | 'advanced'
}

export interface CVGeneratorResponse {
  success: boolean
  cv_url?: string
  cover_letter_url?: string
  generated_at?: Date
  error?: string
}

export interface JobAnalyzerRequest {
  job_offer_id: string
  candidate_id: string
}

export interface JobAnalyzerResponse {
  match_score: number
  match_percentage: number
  strengths: string[]
  weaknesses: string[]
  missing_skills: string[]
  recommendations: string[]
  interview_probability: number
}

export interface ApplicationSenderRequest {
  candidate_id: string
  job_offer_id: string
  cv_url: string
  cover_letter_url?: string
  use_workflow_automation: boolean
}

export interface ApplicationSenderResponse {
  success: boolean
  application_id?: string
  sent_at?: Date
  sent_to_email?: string
  error?: string
  details?: {
    email_status: 'sent' | 'failed' | 'queued'
    retry_count: number
    next_retry_time?: Date
  }
}

export interface ApplicationStatusUpdate {
  application_id: string
  status: 'sent' | 'opened' | 'clicked' | 'replied' | 'interview_scheduled' | 'rejected' | 'accepted'
  timestamp: Date
  details?: Record<string, any>
}

export interface WorkflowExecutionLog {
  id: string
  workflow_name: string
  workflow_id: string
  execution_id: string
  status: 'success' | 'failure' | 'partial'
  started_at: Date
  completed_at: Date
  duration_ms: number
  input_data: Record<string, any>
  output_data?: Record<string, any>
  error?: {
    code: string
    message: string
    details?: string
  }
  candidate_id?: string
  job_offer_id?: string
  application_id?: string
}

export interface DuplicateApplicationDetection {
  candidate_id: string
  job_offer_id: string
  is_duplicate: boolean
  existing_application_id?: string
  duplicate_reason?: string
  timestamp: Date
}

export interface ApplicationQuotaCheck {
  candidate_id: string
  timestamp: Date
  daily_limit: number
  applications_sent_today: number
  can_apply: boolean
  remaining_quota: number
}

export type WorkflowName =
  | 'cv-generator'
  | 'job-analyzer'
  | 'application-sender'
  | 'duplicate-detection'
  | 'quota-check'
  | 'follow-up'
  | 'analytics-update'

export interface WorkflowTrigger {
  event: 'application_requested' | 'profile_updated' | 'job_offer_new' | 'manual'
  candidate_id?: string
  job_offer_id?: string
  timestamp: Date
  triggered_by: 'user' | 'system' | 'automation'
}
