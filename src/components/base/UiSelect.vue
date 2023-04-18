<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: string | number
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number | undefined): void
}>()

const thisModel = computed({
  get: () => props.modelValue,
  set: (value: string | number | undefined) => emit('update:modelValue', value)
})
</script>

<template>
  <select
    v-model="thisModel"
    class="inline-block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
  >
    <slot />
  </select>
</template>
