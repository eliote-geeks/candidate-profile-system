/**
 * API Response and Request Types
 */

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: APIError
  meta?: {
    timestamp: Date
    request_id: string
    version: string
  }
}

export interface APIError {
  code: string
  message: string
  details?: Record<string, any>
  validation_errors?: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

export interface AuthHeaders {
  authorization: string
  'content-type': string
  'x-request-id'?: string
}

// Auth endpoints
export interface POST_AuthLogin {
  request: {
    email: string
    password: string
  }
  response: APIResponse<{
    access_token: string
    refresh_token: string
    user: {
      id: string
      email: string
      first_name: string
      last_name: string
    }
  }>
}

export interface POST_AuthRegister {
  request: {
    email: string
    password: string
    confirm_password: string
    first_name: string
    last_name: string
  }
  response: APIResponse<{
    user_id: string
    email: string
    message: string
  }>
}

export interface POST_AuthLogout {
  request: {}
  response: APIResponse<{ message: string }>
}

export interface POST_AuthRefresh {
  request: {
    refresh_token: string
  }
  response: APIResponse<{
    access_token: string
  }>
}

// Profile endpoints
export interface GET_Profile {
  response: APIResponse<{
    profile: any
    verification_status: any
  }>
}

export interface PUT_Profile {
  request: Record<string, any>
  response: APIResponse<{
    profile: any
  }>
}

export interface GET_ProfileApplications {
  query?: {
    status?: string
    page?: number
    per_page?: number
    sort_by?: 'date' | 'status'
  }
  response: APIResponse<PaginatedResponse<any>>
}

export interface POST_ProfileApplicationRequest {
  request: {
    job_offer_id: string
    use_ai_cv?: boolean
    personalization_level?: 'basic' | 'medium' | 'advanced'
  }
  response: APIResponse<{
    application_id: string
    status: string
    message: string
  }>
}

export interface GET_ProfileQuotaStatus {
  response: APIResponse<{
    daily_limit: number
    applications_sent_today: number
    remaining_quota: number
    reset_time: Date
    can_apply: boolean
  }>
}

export interface PUT_ProfilePassword {
  request: {
    current_password: string
    new_password: string
    confirm_password: string
  }
  response: APIResponse<{
    message: string
  }>
}

// Applications endpoints
export interface GET_Applications {
  query?: {
    candidate_id?: string
    status?: string
    page?: number
    per_page?: number
  }
  response: APIResponse<PaginatedResponse<any>>
}

export interface GET_ApplicationDetail {
  params: {
    application_id: string
  }
  response: APIResponse<{
    application: any
    related_job_offer: any
    timeline: any[]
  }>
}

export interface POST_DuplicateCheck {
  request: {
    candidate_id: string
    job_offer_id: string
  }
  response: APIResponse<{
    is_duplicate: boolean
    existing_application_id?: string
    message: string
  }>
}

// Workflow endpoints
export interface POST_WorkflowTrigger {
  request: {
    workflow_name: string
    candidate_id: string
    job_offer_id?: string
    parameters?: Record<string, any>
  }
  response: APIResponse<{
    execution_id: string
    status: string
    estimated_duration_ms: number
  }>
}

export interface GET_WorkflowStatus {
  params: {
    execution_id: string
  }
  response: APIResponse<{
    execution_id: string
    status: 'pending' | 'running' | 'success' | 'failure'
    progress?: number
    result?: Record<string, any>
    error?: APIError
  }>
}

export interface POST_CVGenerate {
  request: {
    candidate_id: string
    job_offer_id?: string
    template?: string
    include_cover_letter?: boolean
  }
  response: APIResponse<{
    cv_url: string
    cover_letter_url?: string
    generated_at: Date
  }>
}

export interface POST_JobAnalyze {
  request: {
    candidate_id: string
    job_offer_id: string
  }
  response: APIResponse<{
    match_score: number
    strengths: string[]
    weaknesses: string[]
    missing_skills: string[]
    recommendations: string[]
  }>
}

// Analytics endpoints
export interface GET_Analytics {
  query?: {
    period_start?: string
    period_end?: string
    period_type?: 'daily' | 'weekly' | 'monthly'
  }
  response: APIResponse<{
    summary: any
    detailed_metrics: Record<string, any>
  }>
}

export interface GET_AnalyticsDashboard {
  response: APIResponse<{
    overview: any
    recent_activity: any[]
    charts_data: Record<string, any>
  }>
}
