<script setup lang="ts">
import { getGenerations, createConversation, sendMessage, getMessages } from '@/api/conversations'
import ConversationMessages from '@/components/ConversationMessages.vue'
import UiButtonPrimary from '@/components/base/UiButtonPrimary.vue'
import type { ConversationMessage } from '@/types'
import { ref, watch } from 'vue'

const generations = ref<string[]>()
generations.value = (await getGenerations()).map((g: any) => g.name)
const generation = ref<string>(generations.value ? generations.value[0] : '')

const conversation = ref<{ id: number; identifier: string; generation: string }>({
  id: 0,
  identifier: '',
  generation: ''
})

const createNewConversation = async () => {
  if (!generation.value) {
    alert('Please select a generation')
    return
  }
  const newConversation = await createConversation(generation.value)

  conversation.value = {
    id: newConversation.id,
    identifier: newConversation.identifier,
    generation: newConversation.generation
  }

  messages.value = []
}

const messagesContainer = ref<HTMLDivElement>()
const messages = ref<ConversationMessage[]>([])
const userMessage = ref<string>('')

const scrollToLast = () => {
  console.log('scrolling to last')
  console.log(messagesContainer.value?.scrollHeight)
  messagesContainer.value?.scrollTo(0, messagesContainer.value.scrollHeight)
}

const sendMessageAction = async () => {
  if (userMessage.value === '') {
    return
  }

  if (conversation.value.identifier === '') {
    await createNewConversation()
  }

  const message = userMessage.value
  userMessage.value = ''

  messages.value.push({ role: 'user', content: message })

  const response = await sendMessage(conversation.value.identifier, message)
  messages.value.push({ id: response.id, content: response.content, role: response.role })
}

const loadMessage = async () => {
  if (conversation.value.identifier === '') {
    return
  }

  const response = await getMessages(conversation.value.identifier)
  messages.value = response
}

watch(
  messages,
  () => {
    scrollToLast()
  },
  { flush: 'post', deep: true }
)
</script>

<template>
  <div class="h-full">
    <div class="bg-gray-200 h-12 flex items-center px-2">
      <div class="flex-grow flex items-center space-x-2 text-sm text-gray-800">
        <div>
          Conversa:
          <input
            id="conversationId"
            v-model="conversation.identifier"
            type="text"
            name="conversationId"
            class="inline-block rounded-md border-0 w-80 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="24beb9d8-7170-4ca8-a2ac-fc0f5dcc8e06"
            @keypress.enter.prevent="loadMessage"
          />
        </div>
        <div>
          Lucy Generation:
          <select
            id="generation"
            v-model="generation"
            name="generation"
            class="inline-block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option v-for="g in generations" :key="g">
              {{ g }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex-shrink-0">
        <UiButtonPrimary size="sm" color="green" @click.prevent="(e) => createNewConversation()"
          >Nova</UiButtonPrimary
        >
      </div>
    </div>
    <div ref="messagesContainer" class="bg-gray-50 overflow-auto" style="height: 500px">
      <ConversationMessages class="p-2" :messages="messages" />
    </div>
    <div class="border rounded-lg h-20 mt-2 p-2 flex">
      <textarea
        id="userInput"
        v-model="userMessage"
        type="text"
        class="flex-grow h-full outline-none focus:outline-none align-text-top p-px border-0 focus:shadow-none resize-none focus:ring-0"
        @keypress.enter.prevent="sendMessageAction"
      ></textarea>
      <div class="self-center">
        <ButtonPrimary size="md" color="blue" @click.prevent="sendMessageAction"
          >Enviar</ButtonPrimary
        >
      </div>
    </div>
  </div>
</template>
