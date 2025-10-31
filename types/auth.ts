/**
 * Authentication and User Session Types
 */

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  avatar_url?: string
  is_verified: boolean
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface AuthSession {
  user: User
  access_token: string
  refresh_token: string
  expires_at: Date
  token_type: 'Bearer'
}

export interface LoginRequest {
  email: string
  password: string
  remember_me?: boolean
}

export interface LoginResponse {
  success: boolean
  session?: AuthSession
  error?: string
}

export interface RegisterRequest {
  email: string
  password: string
  confirm_password: string
  first_name: string
  last_name: string
}

export interface RegisterResponse {
  success: boolean
  user?: User
  message?: string
  error?: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  password: string
  confirm_password: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface AuthError {
  code: string
  message: string
  details?: Record<string, any>
}
