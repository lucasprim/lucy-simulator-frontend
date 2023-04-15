import axios from 'axios'
import { url } from './urls'
import dayjs from 'dayjs'
import { getPageData } from './utils'

export async function getExternalConversations(
  page = 1,
  filters = {} as Record<string, string | undefined>
) {
  const response = await axios.get(url('externalConversations', { page, filters }))
  const conversations = response.data.results.map((c: any) => ({
    ...c,
    created_at: dayjs(c.created_at),
    completed_at: dayjs(c.completed_at)
  }))

  return {
    conversations,
    pageData: getPageData(response)
  }
}
