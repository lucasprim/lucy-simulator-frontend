<script setup lang="ts">
import { ref, watch } from 'vue'
import UiSelect from '../base/UiSelect.vue'
import UiButtonPrimary from '../base/UiButtonPrimary.vue'
import { getDocument, updateDocument, createDocumentVersion } from '@/api/documents'
import type { Document, DocumentVersion } from '@/types'
import { watchDebounced } from '@vueuse/shared'
import { getDocumentVersion } from '@/api/documents'

const props = defineProps<{
  documentId: number
}>()

const emit = defineEmits<{
  (event: 'document-changed-name', value: string): void
}>()

const document = ref<Document>()
const currentVersion = ref<DocumentVersion | undefined>()
const currentVersionId = ref<number>()
const versions = ref<DocumentVersion[]>([])

const documentName = ref<string>('')
const documentContent = ref<string>('')

const loadDocument = async () => {
  if (!props.documentId) {
    return
  }
  const response = await getDocument(props.documentId)
  document.value = response.document
  versions.value = response.versions
  currentVersion.value = response.currentVersion
  currentVersionId.value = response.currentVersion?.id
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

watch(
  document,
  (newValue) => {
    if (!newValue) {
      return
    }
    documentName.value = newValue.name
  },
  { immediate: true }
)

watch(
  currentVersion,
  (newValue) => {
    if (!newValue) {
      documentContent.value = ''
      return
    }
    documentContent.value = newValue.content ?? ''
  },
  { immediate: true }
)

watchDebounced(
  documentName,
  async (newValue, oldValue) => {
    if (!newValue || !oldValue) {
      return
    }
    await updateDocument(props.documentId, { name: newValue })
    emit('document-changed-name', newValue)
  },
  { debounce: 500, immediate: false }
)

const saveDocument = async () => {
  if (!documentContent.value) {
    return
  }

  const result = (await createDocumentVersion(props.documentId, {
    content: documentContent.value
  })) as DocumentVersion

  versions.value.push(result)
  currentVersion.value = result
  currentVersionId.value = result.id
}

watch(currentVersionId, async (newValue) => {
  if (!newValue) {
    return
  }
  currentVersion.value = await getDocumentVersion(props.documentId, newValue)
})
</script>

<template>
  <div class="flex flex-col h-full gap-2">
    <div class="flex gap-2">
      <div class="flex-grow">
        <input v-model="documentName" type="text" class="w-full" />
      </div>
      <div class="flex-shrink-0 w-64">
        <UiSelect v-model="currentVersionId" class="w-full">
          <option v-for="version in versions" :key="version.id" :value="version.id">
            {{ version.created_at }}
          </option>
        </UiSelect>
      </div>
    </div>
    <div style="height: 300px">
      <textarea v-model="documentContent" class="w-full h-full resize-none"></textarea>
    </div>
    <div class="text-right">
      <UiButtonPrimary size="sm" color="green" @click="saveDocument">Salvar</UiButtonPrimary>
    </div>
  </div>
</template>
