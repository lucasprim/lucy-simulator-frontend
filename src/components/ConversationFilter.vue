<script setup lang="ts">
import { ref, watch } from 'vue'
import { getFilterableValues } from '@/api/filterFields'

const props = defineProps<{
  name: string
  entity: string
  field: string
  modelValue?: string
}>()

const values = ref<string[]>([])

values.value = await getFilterableValues(props.entity, props.field)

const filterValue = ref<string | undefined>(props.modelValue)
const emit = defineEmits<{
  (event: 'update:modelValue', value: string | undefined): void
}>()

watch(filterValue, (value) => {
  emit('update:modelValue', value)
})
</script>

<template>
  <div class="items-center space-y-px flex-1">
    <label for="filter" class="block text-xs font-medium leading-6 text-gray-500">{{ name }}</label>
    <select
      id="filter"
      v-model="filterValue"
      name="filter"
      class="block w-full rounded-md border-0 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-green-600 sm:text-sm"
    >
      <option :value="undefined"></option>
      <option v-for="value in values" :key="value" :value="value">{{ value }}</option>
    </select>
  </div>
</template>
