<script setup lang="ts">
import UiSelect from '@/components/base/UiSelect.vue'
import { computed, ref } from 'vue'
import { createLibrary, getLibraries } from '@/api/documents.js'
import type { DocumentLibrary } from '@/types'
import LibraryPrepare from '@/components/library/LibraryPrepare.vue'
import LibraryProcess from '@/components/library/LibraryProcess.vue'
import {
  CircleStackIcon,
  CogIcon,
  DocumentTextIcon,
  MagnifyingGlassCircleIcon
} from '@heroicons/vue/24/outline'
import { PlusCircleIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import LibraryStore from '@/components/library/LibraryStore.vue'
import LibraryQuery from '@/components/library/LibraryQuery.vue'

const props = defineProps<{
  id?: string
  tab?: string
}>()

const libraries = ref<DocumentLibrary[]>([])
const selectedLibraryId = ref<number | undefined>(props.id ? parseInt(props.id) : undefined)

const loadLibraries = async (selectId?: number) => {
  libraries.value = await getLibraries()
  selectedLibraryId.value =
    selectId ?? (libraries.value.length > 0 ? libraries.value[0].id : undefined)
}
await loadLibraries(selectedLibraryId.value)

const createLibraryAction = async () => {
  const name = prompt('Nome da nova library')

  if (!name || name === '') {
    return
  }

  const result = await createLibrary({ name })
  await loadLibraries(result.id)
}

const tabs = ref([
  { name: 'Preparar', href: '#', icon: DocumentTextIcon },
  { name: 'Processar', href: '#', icon: CogIcon },
  { name: 'Armazenar', href: '#', icon: CircleStackIcon },
  { name: 'Consultar', href: '#', icon: MagnifyingGlassCircleIcon }
])

const router = useRouter()

const currentTab = computed({
  get: () => {
    return (props.tab !== '' ? props.tab : tabs.value[0].name) as string
  },
  set: (value: string) => {
    router.push({ name: 'library', params: { id: selectedLibraryId.value, tab: value } })
  }
})
</script>

<template>
  <div>
    <div class="sm:hidden">
      <label for="tabs" class="sr-only">Select a tab</label>
      <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
      <select
        id="tabs"
        name="tabs"
        class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        @select="($event) => (currentTab = ($event.target! as HTMLOptionElement).value)"
      >
        <option v-for="tab in tabs" :key="tab.name" :selected="tab.name === currentTab">
          {{ tab.name }}
        </option>
      </select>
    </div>
    <div class="hidden sm:block">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <a
            v-for="tab in tabs"
            :key="tab.name"
            :href="tab.href"
            :class="[
              tab.name === currentTab
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium'
            ]"
            :aria-current="tab.name === currentTab ? 'page' : undefined"
            @click.prevent="currentTab = tab.name"
          >
            <component
              :is="tab.icon"
              :class="[
                tab.name === currentTab
                  ? 'text-green-500'
                  : 'text-gray-400 group-hover:text-gray-500',
                '-ml-0.5 mr-2 h-5 w-5'
              ]"
              aria-hidden="true"
            />
            <span>{{ tab.name }}</span>
          </a>
        </nav>
      </div>
    </div>
  </div>

  <div class="bg-gray-100 rounded-md mb-4 mt-2 p-2">
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

  <div v-if="selectedLibraryId">
    <LibraryPrepare v-if="currentTab === 'Preparar'" :library-id="selectedLibraryId" />
    <LibraryProcess v-else-if="currentTab === 'Processar'" :library-id="selectedLibraryId" />
    <LibraryStore v-else-if="currentTab === 'Armazenar'" :library-id="selectedLibraryId" />
    <LibraryQuery v-else-if="currentTab === 'Consultar'" :library-id="selectedLibraryId" />
  </div>
</template>
