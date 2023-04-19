import type { Dayjs } from 'dayjs'

export interface PageData {
  total: number
  currentPage: number
  pageSize: number
  totalPages: number
}

export interface ExternalConversation {
  id: number
  external_id: string
  company: string
  department: string
  team: string
  contact_channel: string
  created_at: Dayjs
  completed_at: Dayjs
}

export interface ConversationMessage {
  id?: number
  role: 'system' | 'user' | 'assistant' | 'representative'
  content: string
}

export interface ExternalConversationMessage {
  id: number
  external_id: string
  external_conversation_id: string
  participant_type: 'member' | 'client' | 'bot'
  body: string
  created_at: Dayjs
}

export interface PromptExperimentMessage {
  id?: number
  order: number
  role: 'system' | 'user' | 'assistant'
  content: string
  parsedContent?: string
}

export interface PromptExperimentResult {
  output: string
}

export interface PromptExperiment {
  id?: number
  name: string
  model: string
  modelConfig: any
  created_at?: Dayjs
  updated_at?: Dayjs
}

export interface PromptExperimentSnapshot {
  id?: number
  prompt_experiment_id?: number
  name: string
  star: boolean
  created_at?: Dayjs
  updated_at?: Dayjs
}

export interface DocumentLibrary {
  id: number
  name: string
}

export interface DocumentCollection {
  id: number
  document_library_id: number
  name: string
}

export interface Document {
  id: number
  document_collection_id: number
  name: string
}

export interface DocumentVersion {
  id: number
  document_id: number
  created_at: string
  content?: string
}

export interface DocumentFragment {
  id: number
  document_version_id: number
  content: string
  processor: string
}
