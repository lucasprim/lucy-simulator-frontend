import axios from 'axios'
import { url } from './urls'
import type { ExternalConversationMessage } from '@/types'
import dayjs from 'dayjs'

export async function getExternalConversationMessages(externalConversationId: number) {
  const response = await axios.get(url('externalConversationMessages', {}, externalConversationId))
  const messages: ExternalConversationMessage[] = response.data.map((c: any) => (
    {
      ...c,
      created_at: dayjs(c.created_at),
    }
  ))

  return messages
}
