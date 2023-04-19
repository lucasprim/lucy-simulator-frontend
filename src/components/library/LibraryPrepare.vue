<script setup lang="ts">
import { ChevronRightIcon, ChevronDownIcon, PlusCircleIcon } from '@heroicons/vue/24/solid'
import { DocumentIcon } from '@heroicons/vue/24/outline'
import LibraryDocument from './LibraryDocument.vue'
import { useLibraryDocumentsTree } from '@/composables/useLibraryDocumentsTree'

const props = defineProps<{
  libraryId: number
}>()

const {
  collections,
  selectedDocumentId,
  createCollectionAction,
  createDocumentAction,
  documentsForCollection,
  updateDocumentName
} = useLibraryDocumentsTree(props)
</script>

<template>
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
              (newName: string) => {
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
