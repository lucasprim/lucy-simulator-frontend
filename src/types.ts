import type { Dayjs } from "dayjs"

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

export interface ExternalConversationMessage {
  id: number
  external_id: string
  external_conversation_id: string
  participant_type: 'member' | 'client' | 'bot'
  body: string
  created_at: Dayjs
}

export interface ExperimentMessage {
  id: number,
  role: 'system' |  'user' | 'assistant'
  content: string
  parsedContent?: string
}

export interface ExperimentResult {
  output: string
}
