<script setup lang="ts">
import { getExternalConversationMessages } from '@/api/externalConversationMessages'
import { useExperimentDrawerStore } from '@/stores/experimentDrawer'
import type { ConversationMessage, ExternalConversationMessage } from '@/types'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import ConversationMessages from './ConversationMessages.vue'
import { computed } from 'vue'

const props = defineProps<{
  externalConversationExternalId?: number
}>()

const messages = ref<ExternalConversationMessage[]>([])

const roleTranslation = {
  client: 'user',
  member: 'representative',
  bot: 'assistant'
}

const parsedMessages = computed(() => {
  return messages.value.map((m) => ({
    id: m.id,
    role: roleTranslation[m.participant_type],
    content: m.body
  })) as ConversationMessage[]
})

watch(
  () => props.externalConversationExternalId,
  async (newValue: number | undefined) => {
    if (!newValue) {
      messages.value = []
      return
    }
    messages.value = await getExternalConversationMessages(newValue)
    rootElement.value?.scrollTo(0, 0)
  }
)

const rootElement = ref<HTMLDivElement>()

const experimentStore = useExperimentDrawerStore()
const { open } = storeToRefs(experimentStore)

const addMessagesToExperiment = () => {
  const msg = messages.value.map((m) => `${m.participant_type}: ${m.body}`).join('\n')

  experimentStore.addAvailableVariable('conversation', msg)
  open.value = true
}
</script>

<template>
  <div ref="rootElement" class="h-full w-full text-sm flex overflow-hidden flex-col">
    <ConversationMessages :messages="parsedMessages" class="p-4 flex-grow overflow-y-auto" />
    <div class="bg-gray-200 text-xs h-8 items-center flex justify-end px-2 flex-shrink-0">
      <button
        class="border border-gray-400 px-2 py-px shadow-sm rounded-sm bg-gray-200 text-gray-600"
        @click.prevent="(e) => addMessagesToExperiment()"
      >
        Experimentar Prompt
      </button>
    </div>
  </div>
</template>
