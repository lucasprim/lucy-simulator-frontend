<script setup lang="ts">
import { ref } from 'vue'
import UiSelect from '../base/UiSelect.vue'
import UiButtonPrimary from '../base/UiButtonPrimary.vue'

const document = ref<{
  id: number
  name: string
  content: string
  createdAt: string
  updatedAt: string
}>({
  id: 0,
  name: 'Título do Documento',
  content: 'Conteúdo do documento',
  createdAt: '',
  updatedAt: ''
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
    <div>
      <input v-model="document.name" type="text" />
    </div>
    <div style="min-height: 300px">
      <textarea v-model="document.content" class="w-full h-full resize-none"></textarea>
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
