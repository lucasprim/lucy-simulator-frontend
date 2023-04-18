<script setup lang="ts">
import type { ConversationMessage } from '@/types'

defineProps<{
  messages: ConversationMessage[]
}>()
</script>

<template>
  <ol>
    <li
      v-for="(message, index) in messages"
      :key="message.content"
      :class="[
        'w-full relative flex',
        messages[index - 1] !== undefined && message.role != messages[index - 1].role
          ? 'mt-4'
          : 'mt-px'
      ]"
    >
      <div
        :class="['flex-grow', message.role === 'user' ? '' : 'order-last']"
        style="min-width: 120px"
      >
        &nbsp;
      </div>
      <div
        :class="[
          ' text-white py-1 px-2 rounded-md text-ellipsis overflow-hidden shadow-sm',
          message.role === 'assistant' ? '!bg-gray-500' : '',
          message.role === 'user' ? 'text-right bg-blue-500' : 'text-left bg-green-500'
        ]"
      >
        <span v-if="message.role === 'assistant'">🤖</span>
        <span v-html="message.content.replace(/\n/g, '<br />')"></span>
        <div v-if="message.content === ''">[Áudio ou Imagem]</div>
      </div>
    </li>
  </ol>
</template>
