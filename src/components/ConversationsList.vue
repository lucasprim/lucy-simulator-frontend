<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import { getExternalConversations } from '@/api/externalConversations'
import { onMounted, ref, watch } from 'vue'
import type { PageData, ExternalConversation } from '@/types'
import { useMagicKeys } from '@vueuse/core'

const emit = defineEmits<{
  (e: 'selectConversation', id: number): void
}>()

const props = defineProps<{
  selectedConversationId?: number
  filters: Record<string, string | undefined>
}>()

const conversations = ref<ExternalConversation[]>([])
const pageData = ref<PageData>()

onMounted(async () => {
  const result = await getExternalConversations(1, props.filters)
  conversations.value = result.conversations
  pageData.value = result.pageData
})

watch(conversations, (newValue) => {
  if (newValue.length > 0 && props.selectedConversationId === undefined) {
    emit('selectConversation', newValue[0].id)
  }
  if (
    newValue.length > 0 &&
    props.selectedConversationId &&
    !newValue.map((c) => c.id).includes(props.selectedConversationId)
  ) {
    emit('selectConversation', newValue[0].id)
  }
})

watch(
  () => props.filters,
  async (filters) => {
    const result = await getExternalConversations(1, filters)
    conversations.value = result.conversations
    pageData.value = result.pageData
  },
  { deep: true }
)

// Implement an infinite scroll using the code above and below:
const list = ref<HTMLElement>()

watch(
  () => props.selectedConversationId,
  (newValue) => {
    if (newValue) {
      const element = list.value!.querySelector(`[data-id="${newValue}"]`) as HTMLDivElement
      if (element) {
        list.value!.scrollTop = element.offsetTop - list.value!.offsetTop
      }
    }
  },
  { immediate: true }
)

watch(
  list,
  (list) => {
    if (list) {
      list.addEventListener('scroll', async () => {
        if (list.scrollTop + list.clientHeight >= list.scrollHeight) {
          const nextPage = (pageData.value?.currentPage ?? 0) + 1
          const result = await getExternalConversations(nextPage, props.filters)

          pageData.value = result.pageData
          conversations.value = [...conversations.value, ...result.conversations]
        }
      })
    }
  },
  { immediate: true }
)

// Navigate the list using the bracket keys
const { BracketLeft, BracketRight } = useMagicKeys()

watch(BracketRight, (v) => {
  if (!v) {
    return
  }
  const nextConversation = [...conversations.value]
    .sort((a, b) => a.id - b.id)
    .find((c) => c.id > props.selectedConversationId!)

  if (!nextConversation) {
    return
  }
  emit('selectConversation', nextConversation.id)
})

watch(BracketLeft, (v) => {
  if (!v) {
    return
  }
  const previousConversation = [...conversations.value]
    .sort((a, b) => b.id - a.id)
    .find((c) => c.id < props.selectedConversationId!)
  if (!previousConversation) {
    return
  }
  emit('selectConversation', previousConversation.id)
})
</script>

<template>
  <div class="flex flex-col">
    <div class="flex-shrink-0 bg-gray-50 text-sm p-2 text-center border text-gray-600">
      {{ pageData?.total ?? 0 }} conversations
    </div>
    <div ref="list" class="overflow-y-auto bg-white shadow sm:rounded-md flex-grow">
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="conversation in conversations" :key="conversation.id" :data-id="conversation.id">
          <a
            href="#"
            class="block hover:bg-gray-50"
            @click.prevent="() => $emit('selectConversation', conversation.id)"
          >
            <div
              :class="[
                'flex items-center px-2 py-2 sm:px-3',
                selectedConversationId === conversation.id ? 'bg-gray-100' : ''
              ]"
            >
              <div class="flex min-w-0 flex-1 items-center">
                <div class="flex-shrink-0 space-y-1">
                  <div class="text-xs text-gray-400">
                    {{ conversation.created_at.format('DD/MM/YYYY HH:mm') }}
                  </div>
                  <div class="text-sm text-gray-800 font-semibold"># {{ conversation.id }}</div>
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
  </div>
</template>
