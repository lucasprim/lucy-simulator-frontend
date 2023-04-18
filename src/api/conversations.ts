import api from './base'
import { url } from './urls'

export async function getGenerations() {
  const response = await api.get(url('generations'))

  return response.data
}

export async function createConversation(generation: string) {
  const response = await api.post(url('createConversation'), { generation })

  return response.data
}

export async function sendMessage(conversationIdentifier: string, message: string) {
  const response = await api.post(url('sendMessage', {}, conversationIdentifier), {
    content: message
  })

  return response.data
}

export async function getMessages(conversationIdentifier: string) {
  const response = await api.get(url('getMessages', {}, conversationIdentifier))

  return response.data
}
