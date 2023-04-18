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

const processors = ref<string[]>(['QAExtract', 'TokenExtract', 'SizeExtract'])
const selectedProcessor = ref<string>(processors.value ? processors.value[0] : '')

const processedFragments = ref<{ id: number; content: string }[]>([
  { id: 1, content: 'Lorem' },
  { id: 2, content: 'Ipsum' },
  { id: 3, content: 'Dolor' },
  { id: 4, content: 'Sit' },
  { id: 5, content: 'Amet' }
])

const embedStores = ref<{ id: number; name: string }[]>([{ id: 1, name: 'gps-0001' }])
const selectedEmbedStoreId = ref<number>(embedStores.value ? embedStores.value[0].id : 0)
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
    <div>
      <div class="bg-gray-100 rounded-md p-2">
        <h3>Processamento</h3>
        <div class="space-x-2">
          <UiSelect v-model="selectedProcessor">
            <option v-for="processor in processors" :key="processor" :value="processor">
              {{ processor }}
            </option>
          </UiSelect>
          <UiButtonPrimary size="sm" color="green">Processar</UiButtonPrimary>
        </div>
      </div>

      <div class="border my-2 p-2 flex gap-2">
        <div class="flex-grow">
          <h3>Fragmentos Processados</h3>

          <ul>
            <li
              v-for="fragment in processedFragments"
              :key="fragment.id"
              class="border mb-1 rounded-md py-1 px-1.5 text-ellipsis w-full"
            >
              {{ fragment.content }}
            </li>
          </ul>
        </div>
        <div class="w-40 flex-shrink-0 bg-gray-100 p-2 space-y-2">
          <h3>Criar Embeds</h3>

          <UiSelect v-model="selectedEmbedStoreId">
            <option v-for="embedStore in embedStores" :key="embedStore.id" :value="embedStore.id">
              {{ embedStore.name }}
            </option>
          </UiSelect>

          <UiButtonPrimary size="sm" color="green">Criar</UiButtonPrimary>
        </div>
      </div>
    </div>
  </div>
</template>
