<script setup lang="ts">
import { createStore, getStoreTypes, getStores } from '@/api/documents'
import type { DocumentStore } from '@/types'
import { reactive, ref, watch } from 'vue'
import UiSelect from './base/UiSelect.vue'
import { PlusCircleIcon } from '@heroicons/vue/24/solid'

withDefaults(
  defineProps<{
    allowCreate: boolean
  }>(),
  {
    allowCreate: true
  }
)

const emit = defineEmits<{
  (event: 'store-selected', storeId: number): void
}>()

const storePaneState = ref<'select' | 'new'>('select')

const stores = ref<DocumentStore[]>([])
const selectedStoreId = ref<number>()
stores.value = await getStores()
selectedStoreId.value = stores.value[0] ? stores.value[0].id : undefined

const storeTypes = ref<string[]>([])
storeTypes.value = await getStoreTypes()

const newStore = reactive({ name: '', store_type: '' })
const createStoreAction = async () => {
  if (!newStore.name || !newStore.store_type) {
    return
  }

  const create = await createStore({ name: newStore.name, store_type: newStore.store_type })

  if (create) {
    stores.value.push(create)

    selectedStoreId.value = create.id
    storePaneState.value = 'select'
  }
}

watch(
  selectedStoreId,
  (storeId) => {
    if (storeId) {
      emit('store-selected', storeId)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <div v-if="storePaneState === 'select' || !allowCreate">
      Store:
      <UiSelect v-model="selectedStoreId">
        <option v-for="store in stores" :key="store.id" :value="store.id">
          {{ store.name }}
        </option>
      </UiSelect>
      <PlusCircleIcon
        v-if="allowCreate"
        class="h-5 w-5 inline-block ml-2 cursor-pointer"
        @click.prevent="
          (_event: any) => {
            storePaneState = 'new'
          }
        "
      />
    </div>
    <div v-else>
      <h4 class="text-lg font-medium mb-2">Nova Store</h4>
      <div class="flex items-end gap-2">
        <div>
          <label for="name" class="block text-gray-800">Nome</label>
          <input
            id="name"
            v-model="newStore.name"
            type="text"
            class="border rounded-md px-2 py-1"
          />
        </div>
        <div>
          <label for="store_type" class="block text-gray-800">Tipo</label>
          <UiSelect id="store_type" v-model="newStore.store_type">
            <option v-for="storeType in storeTypes" :key="storeType" :value="storeType">
              {{ storeType }}
            </option>
          </UiSelect>
        </div>
        <button
          class="bg-green-500 text-white rounded-md px-2 py-1 mb-px"
          @click.prevent="($event: any) => createStoreAction()"
        >
          Criar
        </button>
      </div>
    </div>
  </div>
</template>
