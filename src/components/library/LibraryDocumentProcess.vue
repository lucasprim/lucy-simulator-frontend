<script setup lang="ts">
import {
  getDocument,
  getDocumentProcessors,
  processDocument,
  getDocumentFragments
} from '@/api/documents'
import type { Document, DocumentVersion, DocumentFragment } from '@/types'
import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
import { computed, ref, watch } from 'vue'
import UiSelect from '../base/UiSelect.vue'
import UiButtonPrimary from '../base/UiButtonPrimary.vue'

const props = defineProps<{
  documentId: number
}>()

const document = ref<Document>()
const currentVersion = ref<DocumentVersion | undefined>()
const documentFragments = ref<DocumentFragment[]>([])

const loadDocument = async () => {
  if (!props.documentId) {
    return
  }
  const response = await getDocument(props.documentId)
  document.value = response.document
  currentVersion.value = response.currentVersion

  if (currentVersion.value) {
    const fragmentsResponse = await getDocumentFragments(currentVersion.value.id)
    documentFragments.value = fragmentsResponse
  }
}

watch(
  () => props.documentId,
  async (newValue) => {
    if (!newValue) {
      return
    }
    loadDocument()
  },
  { immediate: true }
)

const processors = await getDocumentProcessors()
const currentProcessor = ref<string>(processors[0] ?? '')
const currentVersionHtml = computed(() => {
  if (!currentVersion.value) {
    return ''
  }
  return currentVersion.value.content?.replace(/\n/g, '<br />')
})

const processDocumentAction = async () => {
  if (!currentVersion.value) {
    return
  }
  const result = await processDocument(currentVersion.value.id, currentProcessor.value)
  documentFragments.value = result
}
</script>

<template>
  <div class="p-4">
    <div v-if="document && currentVersion" class="space-y-2">
      <h3 class="text-xl font-semibold">{{ document.name }}</h3>
      <div
        class="bg-gray-50 overflow-auto p-2 rounded-md border"
        style="max-height: 200px"
        v-html="currentVersionHtml"
      ></div>
      <div class="bg-gray-200 p-2 space-y-2 rounded-md">
        <div>
          <Cog6ToothIcon class="h-4 w-4 inline-block" />
          Processar
        </div>
        <div class="text-sm">
          Modelo:
          <UiSelect v-model="currentProcessor">
            <option v-for="processor in processors" :key="processor" :value="processor">
              {{ processor }}
            </option>
          </UiSelect>
          <UiButtonPrimary
            size="sm"
            color="green"
            class="ml-2"
            @click.prevent="processDocumentAction"
            >Processar</UiButtonPrimary
          >
        </div>
      </div>
      <div class="border">
        <div class="p-2">
          <h3 class="font-semibold">Fragmentos Processados</h3>

          <ul>
            <li v-for="fragment in documentFragments" :key="fragment.id">
              <div class="bg-white p-2 rounded-md text-xs">
                <div
                  class="overflow-auto p-2 rounded-md border max-h-20 overflow-ellipsis"
                  v-html="fragment.content.replace(/\n/g, '<br />')"
                ></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <h3>Este documento não possui conteúdo</h3>
    </div>
  </div>
</template>
