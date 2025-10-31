/**
 * Central Export File for All TypeScript Types
 * Organize and expose types from all modules
 */

// ============ Authentication Types ============
export type {
  User,
  AuthSession,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  VerifyEmailRequest,
  AuthError,
} from './auth'

// ============ Profile Types ============
export type {
  CandidateProfile,
  ProfileUpdateRequest,
  ProfileResponse,
  ApplicationHistoryEntry,
  ApplicationStatus,
  ApplicationSummary,
  DuplicateCheckRequest,
  DuplicateCheckResponse,
  ApplicationLimitStatus,
  CandidateSearchFilters,
  CandidateDashboardData,
  DocumentInfo,
  ProfileVerificationStatus,
} from './profile'

// ============ Workflow Types ============
export type {
  WorkflowWebhookPayload,
  CVGeneratorRequest,
  CVGeneratorResponse,
  JobAnalyzerRequest,
  JobAnalyzerResponse,
  ApplicationSenderRequest,
  ApplicationSenderResponse,
  ApplicationStatusUpdate,
  WorkflowExecutionLog,
  DuplicateApplicationDetection,
  ApplicationQuotaCheck,
  WorkflowName,
  WorkflowTrigger,
} from './workflow'

// ============ API Types ============
export type {
  APIResponse,
  APIError,
  ValidationError,
  PaginatedResponse,
  AuthHeaders,
  POST_AuthLogin,
  POST_AuthRegister,
  POST_AuthLogout,
  POST_AuthRefresh,
  GET_Profile,
  PUT_Profile,
  GET_ProfileApplications,
  POST_ProfileApplicationRequest,
  GET_ProfileQuotaStatus,
  PUT_ProfilePassword,
  GET_Applications,
  GET_ApplicationDetail,
  POST_DuplicateCheck,
  POST_WorkflowTrigger,
  GET_WorkflowStatus,
  POST_CVGenerate,
  POST_JobAnalyze,
  GET_Analytics,
  GET_AnalyticsDashboard,
} from './api'

// ============ Entity Types ============
export type {
  Candidate,
  Company,
  JobOffer,
  Application,
  ApplicationStatus as EntityApplicationStatus,
  ApplicationOutcome,
  Document,
  Email,
  Analytic,
  ABTest,
  SystemLog,
  SocialMediaPost,
  EmailQuota,
  User as EntityUser,
  Session,
  PasswordResetToken,
  EmailVerificationToken,
} from './entities'

// ============ Chat Types (existing) ============
export type { ChatMessage } from './chat'
