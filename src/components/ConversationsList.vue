<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import { getExternalConversations } from '@/api/externalConversations'

defineEmits<{
  (e: 'selectConversation', id: number): void
}>()

defineProps<{
  selectedConversationId?: number
}>()

const conversations = (await getExternalConversations()).conversations
</script>

<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-md">
    <ul role="list" class="divide-y divide-gray-200">
      <li v-for="conversation in conversations" :key="conversation.id">
        <a
          href="#"
          class="block hover:bg-gray-50"
          @click.prevent="() => $emit('selectConversation', conversation.id)"
        >
          <div
            :class="[
              'flex items-center px-2 py-2 sm:px-3',
              (selectedConversationId === conversation.id) ? 'bg-gray-100' : ''
            ]"
          >
            <div class="flex min-w-0 flex-1 items-center">
              <div class="flex-shrink-0 space-y-1">
                <div class="text-xs text-gray-400">
                  {{ conversation.created_at.format('DD/MM/YYYY HH:mm') }}
                </div>
                <div class="text-sm text-gray-800 font-semibold">
                  # {{ conversation.id }}
                </div>
                <div class="text-xs text-green-700 font-light">
                  {{ conversation.department }} / {{ conversation.team }}
                </div>
              </div>
            </div>
            <div>
              <ChevronRightIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>
