<script setup lang="ts">
import { getExternalConversationMessages } from '@/api/externalConversationMessages';
import { useExperimentDrawerStore } from '@/stores/experimentDrawer';
import type { ExternalConversationMessage } from '@/types';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

const props = defineProps<{
  externalConversationExternalId?: number
}>()

const messages = ref<ExternalConversationMessage[]>([])

watch(
  () => props.externalConversationExternalId,
  async (newValue: number | undefined) => {
    if (!newValue) { messages.value = []; return }
    messages.value = await getExternalConversationMessages(newValue)
    rootElement.value?.scrollTo(0, 0)
  }
)

const rootElement = ref<HTMLDivElement>()

const experimentStore = useExperimentDrawerStore()
const { open } = storeToRefs(experimentStore)

const addMessagesToExperiment = () => {
  const msg = messages.value.map((m) => (
    `${m.participant_type}: ${m.body}`
  )).join("\n")

  experimentStore.addAvailableVariable('conversation', msg)
  open.value = true
}
</script>

<template>
  <div
    ref="rootElement"
    class="h-full w-full text-sm"
  >
    <ol class="p-4">
      <li
        v-for="(message, index) in messages"
        :key="message.id"
        :class="[
          'w-full relative flex',
          (messages[index - 1] !== undefined && message.participant_type != messages[index - 1].participant_type) ? 'mt-4' : 'mt-px'
        ]"
      >
        <div
          :class="['flex-grow', message.participant_type === 'client' ? '' : 'order-last']"
          style="min-width: 120px;"
        >
          &nbsp;
        </div>
        <div
          :class="[
            ' text-white py-1 px-2 rounded-md text-ellipsis overflow-hidden shadow-sm',
            message.participant_type === 'bot' ? 'bg-gray-500' : '',
            message.participant_type === 'client' ? 'text-right bg-blue-500' : 'text-left bg-green-500'
          ]">
            <span v-if="message.participant_type === 'bot'">🤖</span>
            {{ message.body }}
            <div v-if="message.body === ''">[Áudio ou Imagem]</div>
        </div>
      </li>
    </ol>
    <div>
      <a
        href="#"
        @click.prevent="(e) => addMessagesToExperiment()"
      >
        Var
      </a>
    </div>
  </div>
</template>
