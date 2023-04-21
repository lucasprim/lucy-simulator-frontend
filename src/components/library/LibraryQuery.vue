<script setup lang="ts">
import { ref } from 'vue'
import StoreSelector from '../StoreSelector.vue'
import type { StoreQueryResult } from '@/types'
import { queryStore } from '@/api/documents'

defineProps<{
  libraryId: number
}>()

const selectedStoreId = ref<number>()
const query = ref<string>()
const results = ref<StoreQueryResult[]>([])

const queryAction = async () => {
  if (!query.value || !selectedStoreId.value) {
    return
  }

  results.value = []

  const res = (await queryStore(selectedStoreId.value, query.value)) as StoreQueryResult[]

  results.value = res.sort((a, b) => a.distance - b.distance)
}
</script>

<template>
  <h2 class="text-xl font-semibold">Consultar</h2>
  <StoreSelector
    :allow-create="false"
    @store-selected="
      ($event) => {
        selectedStoreId = $event
      }
    "
  />

  <div class="bg-gray-100 border rounded-md mt-4 p-2">
    <div>Consulta:</div>
    <input
      v-model="query"
      type="text"
      class="w-full"
      @keypress.prevent.enter="($event) => queryAction()"
    />

    <div v-if="results.length > 0">
      <h3 class="text-lg font-semibold mt-4">Resultados</h3>
      <ul class="space-y-2">
        <li v-for="result in results" :key="result.id" class="bg-white p-4 rounded-md">
          <p class="text-xs mb-2">Distance: {{ result.distance }}</p>
          <div v-html="result.content.replace(/\n/g, '<br />')" />
        </li>
      </ul>
    </div>
  </div>
</template>
