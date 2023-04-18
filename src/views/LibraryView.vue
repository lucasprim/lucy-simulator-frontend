<script setup lang="ts">
import UiSelect from '@/components/base/UiSelect.vue'
import { DocumentIcon } from '@heroicons/vue/24/outline'
import { ChevronRightIcon, ChevronDownIcon, PlusCircleIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'
import Document from '@/components/library/Document.vue'

const libraries = ref([
  { id: 1, name: 'GPS' },
  { id: 2, name: 'RC Ton' },
  { id: 3, name: 'RC Stone' }
])

const selectedLibraryId = ref(1)

const collections = ref([
  { id: 1, library_id: 1, name: 'Contratos', open: true },
  { id: 2, library_id: 1, name: 'Planos', open: true }
])

const documents = ref([
  { id: 1, name: 'Planos Q&A 1', collection_id: 2 },
  { id: 2, name: 'Planos Q&A 2', collection_id: 2 },
  { id: 3, name: 'Contratos Q&A', collection_id: 1 }
])

const selectedDocumentId = ref(1)

const documentsForCollection = (collectionId: number) => {
  return documents.value.filter((d) => d.collection_id === collectionId)
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

    <PlusCircleIcon class="inline-block h-6 w-6 text-green-500 ml-1" />
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
            <PlusCircleIcon class="inline-block h-4 w-4 text-gray-500 ml-1" />
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
        <a href="#" class="text-sm underline">+ Nova Coleção</a>
      </div>
    </div>
    <div class="col-span-8 p-2">
      <Document />
    </div>
  </div>
</template>
