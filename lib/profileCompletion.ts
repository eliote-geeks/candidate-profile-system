import { CHAT_FLOW, type ChatQuestion } from '@/lib/chat-config'

type QuestionType = ChatQuestion['type']

const OPTIONAL_FIELDS = new Set(
  CHAT_FLOW.filter((question) => question.text.toLowerCase().includes('optionnel')).map(
    (question) => question.fieldName,
  ),
)

const REQUIRED_QUESTIONS = CHAT_FLOW.filter(
  (question) => !OPTIONAL_FIELDS.has(question.fieldName),
)

const toCamelCase = (value: string) =>
  value.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())

const normaliseMultiValue = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item) => {
      if (typeof item === 'string') {
        return item.trim().length > 0
      }
      return item !== null && item !== undefined
    }) as string[]
  }

  if (typeof value === 'string') {
    const trimmed = value.trim().replace(/^{|}$/g, '')
    if (!trimmed) {
      return []
    }
    return trimmed
      .split(',')
      .map((part) => part.replace(/"/g, '').trim())
      .filter((part) => part.length > 0)
  }

  return []
}

const hasValue = (value: unknown, type: QuestionType): boolean => {
  if (value === null || value === undefined) {
    return false
  }

  if (type === 'multiselect') {
    return normaliseMultiValue(value).length > 0
  }

  if (Array.isArray(value)) {
    return value.some((entry) => {
      if (typeof entry === 'string') {
        return entry.trim().length > 0
      }
      return entry !== null && entry !== undefined
    })
  }

  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  if (typeof value === 'number') {
    return !Number.isNaN(value)
  }

  if (typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>).length > 0
  }

  return Boolean(value)
}

const getCandidateValue = (candidate: Record<string, unknown>, fieldName: string) => {
  if (!candidate) {
    return undefined
  }

  // First try exact match (snake_case)
  if (fieldName in candidate) {
    return candidate[fieldName]
  }

  // Try camelCase version
  const camelKey = toCamelCase(fieldName)
  if (camelKey in candidate) {
    return candidate[camelKey]
  }

  // Try reverse: if fieldName is camelCase, convert to snake_case and try
  const snakeKey = fieldName.replace(/[A-Z]/g, (match) => '_' + match.toLowerCase()).replace(/^_/, '')
  if (snakeKey in candidate) {
    return candidate[snakeKey]
  }

  return undefined
}

export interface ProfileCompletionStatus {
  complete: boolean
  missingFields: string[]
}

export const evaluateCandidateProfile = (
  candidate: Record<string, unknown> | null | undefined,
): ProfileCompletionStatus => {
  if (!candidate) {
    return {
      complete: false,
      missingFields: REQUIRED_QUESTIONS.map((question) => question.fieldName),
    }
  }

  const missingFields = REQUIRED_QUESTIONS.reduce<string[]>((acc, question) => {
    const value = getCandidateValue(candidate, question.fieldName)
    if (!hasValue(value, question.type)) {
      acc.push(question.fieldName)
    }
    return acc
  }, [])

  return {
    complete: missingFields.length === 0,
    missingFields,
  }
}

export const isCandidateProfileComplete = (
  candidate: Record<string, unknown> | null | undefined,
): boolean => evaluateCandidateProfile(candidate).complete

