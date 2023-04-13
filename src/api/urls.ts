import config from "@/config";

const URLS: Record<string, (...args: any[]) => string> = {
  externalConversations: () => '/external_conversations',
  externalConversationMessages: (conversationId: string) => `/external_conversations/${conversationId}/messages`,
  integrationsOpenAiChat: () => `/integrations/openai/chat`
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

  return thisUrl.toString()
}
