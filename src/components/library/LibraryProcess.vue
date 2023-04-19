<script setup lang="ts">
import { useLibraryDocumentsTree } from '@/composables/useLibraryDocumentsTree'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { DocumentIcon } from '@heroicons/vue/24/solid'
import LibraryDocumentProcess from './LibraryDocumentProcess.vue'

const props = defineProps<{
  libraryId: number
}>()

const { collections, selectedDocumentId, documentsForCollection } = useLibraryDocumentsTree(props)
</script>

<template>
  <div class="grid grid-cols-12 border rounded-md">
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
    </div>
    <div class="col-span-8">
      <LibraryDocumentProcess v-if="selectedDocumentId" :document-id="selectedDocumentId" />
    </div>
  </div>
</template>
