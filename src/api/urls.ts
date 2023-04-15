import config from '@/config'

const URLS: Record<string, (...args: any[]) => string> = {
  externalConversations: () => '/external_conversations',
  externalConversationMessages: (conversationId: string) =>
    `/external_conversations/${conversationId}/messages`,
  integrationsOpenAiChat: () => `/integrations/openai/chat`,
  promptExperiments: () => `/experiments/prompt`,
  promptExperimentSnapshots: (id: number) => `/experiments/prompt/${id}`,
  promptExperimentMessages: (id: number) => `/experiments/prompt/snapshot/${id}`,
  updatePromptExperiment: (id: number) => `/experiments/prompt/${id}`,
  createPromptExperiment: () => `/experiments/prompt`,
  filterableValues: (entity: string, field: string) =>
    `/filter/values?table=${entity}&field=${field}`
}

export function url(url: string, options?: Record<string, any>, ...args: any[]) {
  if (!URLS[url]) {
    console.error(`Unknown URL: ${url}`)
    throw 'Unknown url'
  }

  const thisUrl = new URL(`${config.api.baseURL}${URLS[url](...args)}`)

  if (options?.page) {
    thisUrl.searchParams.set('page', options.page)
  }

  if (options?.filters) {
    for (const [key, value] of Object.entries(options.filters)) {
      if (value) {
        thisUrl.searchParams.set(key, value as string)
      }
    }
  }

  return thisUrl.toString()
}
