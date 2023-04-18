import { computed, onMounted, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type {
  PromptExperimentResult,
  PromptExperimentMessage,
  PromptExperiment,
  PromptExperimentSnapshot
} from '@/types'
import { getOpenAiChatCompletion } from '@/api/integrations/openai'
import {
  createPromptExperiment,
  getPromptExperimentMessages,
  getPromptExperimentSnapshots,
  getPromptExperiments,
  updatePromptExperiment
} from '@/api/promptExperiments'

export const useExperimentDrawerStore = defineStore('experimentDrawer', () => {
  const open = ref<boolean>(false)
  const experimentMessages = ref<PromptExperimentMessage[]>([])
  const experimentState = ref<'ready' | 'loading'>('ready')
  const experimentResults = ref<PromptExperimentResult[]>([])
  const availableVariables = ref<Record<string, string>>({})

  // Experiment Messages
  const getExperimentMessageOrder = () => {
    if (experimentMessages.value.length === 0) {
      return 1
    }
    return Math.max(...experimentMessages.value.map((m) => m.order)) + 1
  }

  const addExperimentMessage = () => {
    experimentMessages.value.push({
      order: getExperimentMessageOrder(),
      role: 'system',
      content: ''
    })
  }

  const updateExperimentMessage = (order: number, newMessage: Partial<PromptExperimentMessage>) => {
    const idx = experimentMessages.value.findIndex((m) => m.order === order)
    experimentMessages.value[idx] = { ...experimentMessages.value[idx], ...newMessage }
  }

  const dropExperimentMessage = (order: number) => {
    const idx = experimentMessages.value.findIndex((m) => m.order === order)
    if (idx === -1) {
      return
    }

    experimentMessages.value.splice(idx, 1)
  }

  const parsedMessages = computed(() => {
    return experimentMessages.value.map((m) => {
      let content = m.content

      for (const name in availableVariables.value) {
        const regex = new RegExp(`{\\s*${name}\\s*}`, 'g')
        content = content.replace(regex, availableVariables.value[name])
      }

      return { ...m, content }
    })
  })

  // Run experiment
  const runExperiment = async () => {
    if (experimentState.value !== 'ready') {
      return
    }
    experimentState.value = 'loading'
    const results = await getOpenAiChatCompletion(parsedMessages.value)
    experimentState.value = 'ready'

    experimentResults.value.push({ output: results.choices[0].message.content })
  }

  // Variables
  const addAvailableVariable = (name: string, content: string) => {
    availableVariables.value[name] = content
  }

  // Experiments management (fetch / new / save)
  const promptExperiments = ref<PromptExperiment[]>([])
  const snapshots = ref<PromptExperimentSnapshot[]>([])

  const selectedPromptExperiment = ref<number | undefined>()
  const selectedSnapshot = ref<number | undefined>()

  const addOrUpdatePromptExperiment = (promptExperiment: PromptExperiment) => {
    const currentIdx = promptExperiments.value.findIndex((pe) => pe.id === promptExperiment.id)
    if (currentIdx === -1) {
      promptExperiments.value.push(promptExperiment)
    } else {
      promptExperiments.value[currentIdx] = promptExperiment
    }
    selectedPromptExperiment.value = promptExperiment.id
  }

  const addOrUpdateSnapshot = (snapshot: PromptExperimentSnapshot) => {
    const currentIdx = snapshots.value.findIndex((pe) => pe.id === snapshot.id)
    if (currentIdx === -1) {
      snapshots.value.push(snapshot)
    } else {
      snapshots.value[currentIdx] = snapshot
    }
    selectedSnapshot.value = snapshot.id
  }

  const takeSnapshot = async () => {
    let experiment = promptExperiments.value.find((e) => e.id === selectedPromptExperiment.value)
    if (!experiment) {
      const name = prompt('Digite o nome do experimento:')
      if (!name || name === '') {
        return
      }
      const model = 'openai.chat'
      const modelConfig = {}

      experiment = { name, model, modelConfig }
    }

    let snapshot = snapshots.value.find((s) => s.id === selectedSnapshot.value)

    if (!snapshot) {
      const name = prompt('Digite o nome que você quer dar para a snapshot')
      const star = false
      if (!name || name === '') {
        return
      }
      snapshot = { name, prompt_experiment_id: experiment.id, star }
    }

    const createOrUpdate = selectedPromptExperiment.value
      ? updatePromptExperiment
      : createPromptExperiment
    const result = await createOrUpdate({
      experiment,
      snapshot,
      messages: experimentMessages.value
    })

    if (result.success) {
      addOrUpdatePromptExperiment(result.prompt)
      addOrUpdateSnapshot(result.snapshot)
      experimentMessages.value = (result.messages as PromptExperimentMessage[]).sort(
        (a, b) => a.order - b.order
      )
    }
  }

  // Load the experiments on mounted, if none selected
  onMounted(async () => {
    if (selectedPromptExperiment.value) {
      return
    }
    promptExperiments.value = await getPromptExperiments()
  })

  // Load the snapshots when an experiment is selected
  watch(selectedPromptExperiment, async (newSelectionId) => {
    if (!newSelectionId) {
      snapshots.value = []
      selectedSnapshot.value = undefined
      return
    }
    snapshots.value = await getPromptExperimentSnapshots(newSelectionId)

    if (snapshots.value.length > 0) {
      selectedSnapshot.value = snapshots.value[0].id
    }
  })

  // Load the messages when the snapshot changes
  watch(selectedSnapshot, async (newSnapshotId) => {
    if (!newSnapshotId) {
      return
    }
    experimentMessages.value = (await getPromptExperimentMessages(newSnapshotId)).sort(
      (a, b) => a.order - b.order
    )
  })

  // Clear available variables and experiment results on close
  watch(
    open,
    (newValue) => {
      if (newValue === true) {
        return
      }
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
    addAvailableVariable,
    promptExperiments,
    selectedPromptExperiment,
    snapshots,
    selectedSnapshot,
    takeSnapshot
  }
})
