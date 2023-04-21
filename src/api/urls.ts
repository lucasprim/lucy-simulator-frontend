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
    `/filter/values?table=${entity}&field=${field}`,
  generations: () => `/conversations/generations`,
  createConversation: () => `/conversations`,
  sendMessage: (identifier: string) => `/conversations/${identifier}/messages`,
  getMessages: (identifier: string) => `/conversations/${identifier}/messages`,
  createLibrary: () => `/documents/libraries`,
  getLibraries: () => `/documents/libraries`,
  createCollection: () => `/documents/collections`,
  getCollections: (libraryId: number) => `/documents/collections/${libraryId}`,
  createDocument: () => `/documents`,
  getDocument: (documentId: number) => `/documents/${documentId}`,
  createDocumentVersion: (documentId: number) => `/documents/${documentId}/versions`,
  updateDocument: (documentId: number) => `/documents/${documentId}`,
  getDocumentVersion: (documentId: number, documentVersion: number) =>
    `/documents/${documentId}/versions/${documentVersion}`,
  getDocumentProcessors: () => `/documents/processors`,
  processDocument: (documentVersionId: number, processor: string) =>
    `/documents/processors/${documentVersionId}/${processor}`,
  getDocumentFragments: (documentVersionId: number) => `/documents/fragments/${documentVersionId}`,
  getStores: () => `/documents/stores`,
  getStoreTypes: () => `/documents/stores/types`,
  createStore: () => `/documents/stores`,
  getDocumentStatusesFor: (storeId: number, libraryId: number) =>
    `/documents/stores/${storeId}/${libraryId}/document_statuses`,
  storeDocument: (storeId: number, documentId: number) =>
    `/documents/stores/${storeId}/storeDocument/${documentId}`,
  queryStore: (storeId: number, query: string) =>
    `/documents/stores/${storeId}/query?query=${query}`
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
