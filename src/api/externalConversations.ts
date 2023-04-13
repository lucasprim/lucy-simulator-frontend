import axios from 'axios'
import { url } from './urls'
import { ref } from 'vue'
import type { ExternalConversation } from '@/types'
import dayjs from 'dayjs'
import { getPageData } from './utils'

export async function getExternalConversations(page = 1) {
  const conversations = ref<ExternalConversation[]>([])
  const response = await axios.get(url('externalConversations', { page }))
  conversations.value = response.data.results.map((c: any) => (
    {
      ...c,
      created_at: dayjs(c.created_at),
      completed_at: dayjs(c.completed_at)
    }
  ))

  return {
    conversations,
    pageData: getPageData(response)
  }
}
