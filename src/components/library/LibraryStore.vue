<script setup lang="ts">
import { useLibraryDocumentsTree } from '@/composables/useLibraryDocumentsTree'
import type { StoreDocumentStatus } from '@/types'
import { ref, watch } from 'vue'
import { getDocumentStatuses, storeDocument } from '@/api/documents'
import UiButtonPrimary from '../base/UiButtonPrimary.vue'
import StoreSelector from '../StoreSelector.vue'

const props = defineProps<{
  libraryId: number
}>()

const { collections, documents, documentsForCollection } = useLibraryDocumentsTree(props)
const selectedStoreId = ref<number>()

const documentStatuses = ref<StoreDocumentStatus[]>([])

watch(selectedStoreId, async (storeId) => {
  if (storeId) {
    documentStatuses.value = await getDocumentStatuses(storeId, props.libraryId)
  }
})

const statusForDocumentId = (documentId: number) => {
  return documentStatuses.value.find((status) => status.document_id === documentId)
}

const documentsSelection = ref<Record<number, boolean>>({})
watch(
  documents,
  (documents) => {
    documentsSelection.value = documents.reduce((acc, document) => {
      acc[document.id] = false
      return acc
    }, {} as Record<number, boolean>)
  },
  { immediate: true }
)

const storeDocumentsAction = async () => {
  let selectedDocumentIds: number[] = []

  for (const documentId in documentsSelection.value) {
    if (documentsSelection.value[documentId]) {
      selectedDocumentIds.push(parseInt(documentId))
    }
  }

  if (selectedDocumentIds.length === 0 || !selectedStoreId.value) {
    return
  }

  for (const documentId of selectedDocumentIds) {
    const create = await storeDocument(selectedStoreId.value, documentId)

    if (create) {
      documentStatuses.value.push(create)
    }
  }
}
</script>

<template>
  <div class="border rounded-md flex">
    <div class="flex-grow px-2">
      <h2 class="my-3 text-xl font-semibold">Coleções</h2>
      <ul>
        <li v-for="collection in collections" :key="collection.id">
          <div class="font-bold">
            {{ collection.name }}
          </div>
          <div class="ml-6 my-1">
            <ul>
              <li
                v-for="document in documentsForCollection(collection.id)"
                :key="document.id"
                class="cursor-default"
                @click.prevent="
                  ($event) => {
                    documentsSelection[document.id] = !documentsSelection[document.id]
                  }
                "
              >
                <input v-model="documentsSelection[document.id]" type="checkbox" />
                {{ document.name }}

                <span class="text-xs">
                  {{ statusForDocumentId(document.id)?.status }}
                </span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div class="bg-gray-50 py-2 px-3 order-last flex-shrink-0 w-96">
      <h3 class="text-xl font-semibold mt-1 mb-3">Armazenar</h3>
      <StoreSelector @store-selected="($event) => (selectedStoreId = $event)"></StoreSelector>
      <div>
        <UiButtonPrimary size="lg" color="green" class="mt-4" @click.prevent="storeDocumentsAction">
          Armazenar
        </UiButtonPrimary>
      </div>
    </div>
  </div>
</template>
