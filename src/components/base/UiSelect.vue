<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string | number
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number): void
}>()

const thisModel = ref(props.modelValue)

watch(thisModel, (value) => {
  emit('update:modelValue', value)
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
