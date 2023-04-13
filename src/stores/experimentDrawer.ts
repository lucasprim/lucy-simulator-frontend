import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { ExperimentResult, ExperimentMessage } from '@/types'
import { getOpenAiChatCompletion } from '@/api/integrations/openai'

export const useExperimentDrawerStore = defineStore('experimentDrawer', () => {
  const open = ref<boolean>(false)
  const experimentMessages = ref<ExperimentMessage[]>([])
  const messageId = ref<number>(0)
  const experimentState = ref<'ready' | 'loading'>('ready')
  const experimentResults = ref<ExperimentResult[]>([])
  const availableVariables = ref<Record<string, string>>({})

  const getExperimentMessageId = () => {
    return (messageId.value += 1)
  }

  const addExperimentMessage = () => {
    experimentMessages.value.push({
      id: getExperimentMessageId(),
      role: 'system',
      content: ''
    })
  }

  const updateExperimentMessage = (id: number, newMessage: Partial<ExperimentMessage>) => {
    const idx = experimentMessages.value.findIndex((m) => m.id === id)
    experimentMessages.value[idx] = { ...experimentMessages.value[idx], ...newMessage }
  }

  const dropExperimentMessage = (id: number) => {
    const idx = experimentMessages.value.findIndex((m) => m.id === id)
    if (idx === -1) { return }

    experimentMessages.value.splice(idx, 1)
  }

  const parsedMessages = computed(() => {
    return experimentMessages.value.map((m) => {
      let content = m.content

      for (const name in availableVariables.value) {
        const regex = new RegExp(`{\\s*${name}\\s*}`, "g");
        content = content.replace(regex, availableVariables.value[name])
      }

      return { ...m, content }
    })
  })

  const runExperiment = async () => {
    if (experimentState.value !== 'ready') { return; }
    experimentState.value = 'loading'
    console.log(parsedMessages.value)
    const results = await getOpenAiChatCompletion(parsedMessages.value)
    experimentState.value = 'ready'

    experimentResults.value.push({ output: results.choices[0].message.content })
    console.log(results)
  }

  const addAvailableVariable = (name: string, content: string) => {
    availableVariables.value[name] = content
  }

  // Clear available variables and experiment results on close
  watch(
    open,
    (newValue) => {
      console.log(newValue)
      if (newValue === true) { return; }
      availableVariables.value = {}
      experimentResults.value = []
    },
    { immediate: true }
  )

  return {
    open,
    experimentMessages,
    experimentResults,
    experimentState,
    addExperimentMessage,
    dropExperimentMessage,
    updateExperimentMessage,
    runExperiment,
    availableVariables,
    addAvailableVariable
  }
})
