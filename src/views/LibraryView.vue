<script setup lang="ts">
import UiSelect from '@/components/base/UiSelect.vue'
import { DocumentIcon } from '@heroicons/vue/24/outline'
import { ChevronRightIcon, ChevronDownIcon, PlusCircleIcon } from '@heroicons/vue/24/solid'
import { ref, watch } from 'vue'
import {
  createCollection,
  createLibrary,
  getCollections,
  getLibraries,
  createDocument
} from '@/api/documents.js'
import type { DocumentLibrary, DocumentCollection, Document } from '@/types'
import LibraryDocument from '@/components/library/LibraryDocument.vue'

const libraries = ref<DocumentLibrary[]>([])
const selectedLibraryId = ref<number>()

const loadLibraries = async (selectId?: number) => {
  libraries.value = await getLibraries()
  selectedLibraryId.value =
    selectId ?? (libraries.value.length > 0 ? libraries.value[0].id : undefined)
}
await loadLibraries()

const createLibraryAction = async () => {
  const name = prompt('Nome da nova library')

  if (!name || name === '') {
    return
  }

  const result = await createLibrary({ name })
  await loadLibraries(result.id)
}

type DocumentCollectionView = DocumentCollection & { open: boolean }

const collections = ref<DocumentCollectionView[]>([])
const documents = ref<Document[]>([])
const selectedDocumentId = ref<number>()

const loadCollections = async () => {
  if (!selectedLibraryId.value) {
    collections.value = []
    return
  }
  const response = await getCollections(selectedLibraryId.value)
  collections.value = response.collections.map((c) => ({
    ...c,
    open: true
  }))
  documents.value = response.documents
  selectedDocumentId.value = documents.value.length > 0 ? documents.value[0].id : undefined
}

watch(selectedLibraryId, loadCollections, { immediate: true })

const createCollectionAction = async () => {
  const name = prompt('Nome da nova collection')

  if (!name || name === '' || !selectedLibraryId.value) {
    return
  }

  await createCollection({ name, document_library_id: selectedLibraryId.value })
  await loadCollections()
}

const createDocumentAction = async (collectionId: number) => {
  const name = prompt('Nome do novo documento')

  if (!name || name === '' || !collectionId) {
    return
  }

  await createDocument({ name, document_collection_id: collectionId })
  await loadCollections()
}

const documentsForCollection = (collectionId: number) => {
  return documents.value.filter((d) => d.document_collection_id === collectionId)
}

const updateDocumentName = (newName: string) => {
  documents.value = documents.value.map((d) => {
    if (d.id === selectedDocumentId.value) {
      return { ...d, name: newName }
    }
    return d
  })
}
</script>

<template>
  <div class="bg-gray-100 rounded-md my-4 p-2">
    Library:
    <UiSelect v-model="selectedLibraryId">
      <option v-for="library in libraries" :key="library.id" :value="library.id">
        {{ library.name }}
      </option>
    </UiSelect>

    <PlusCircleIcon
      class="inline-block h-6 w-6 text-green-500 ml-1 cursor-pointer"
      @click.prevent="createLibraryAction"
    />
  </div>
  <div class="grid grid-cols-12 rounded-md border">
    <div class="col-span-4 bg-gray-100 p-2 rounded-tl-md rounded-bl-md">
      <ul>
        <li v-for="collection in collections" :key="collection.id" class="mb-2">
          <a
            href="#"
            @click.prevent="
              (e) => {
                collection.open = !collection.open
              }
            "
          >
            <ChevronRightIcon v-if="!collection.open" class="inline-block h-3 w-3" />
            <ChevronDownIcon v-else class="inline-block h-3 w-3" />
            <span class="font-semibold ml-2">
              {{ collection.name }}
            </span>
            <PlusCircleIcon
              class="inline-block h-4 w-4 text-gray-500 ml-1"
              @click.prevent="(_e: any) => createDocumentAction(collection.id)"
            />
          </a>
          <ul v-if="collection.open" class="ml-3 space-y-1">
            <li
              v-for="document in documentsForCollection(collection.id)"
              :key="document.id"
              :class="[
                'rounded-lg py-1 px-2 flex items-center cursor-pointer',
                document.id === selectedDocumentId ? 'bg-green-200' : 'bg-white hover:bg-green-50'
              ]"
              @click="
                (e) => {
                  selectedDocumentId = document.id
                }
              "
            >
              <DocumentIcon class="h-3 w-3 inline-block" />
              <span class="ml-1">
                {{ document.name }}
              </span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="text-right">
        <a href="#" class="text-sm underline" @click.prevent="createCollectionAction"
          >+ Nova Coleção</a
        >
      </div>
    </div>
    <div class="col-span-8 p-2">
      <div v-if="!selectedDocumentId" class="text-center">
        <div class="text-gray-500">Nenhum documento selecionado</div>
      </div>
      <div v-else>
        <Suspense>
          <LibraryDocument
            :document-id="selectedDocumentId"
            @document-changed-name="
              (newName) => {
                updateDocumentName(newName)
              }
            "
          />

          <template #fallback>
            <div class="text-center">
              <div class="text-gray-500">Carregando...</div>
            </div>
          </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>
