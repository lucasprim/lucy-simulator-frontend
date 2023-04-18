<script setup lang="ts">
defineProps<{
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color: 'blue' | 'green'
}>()
</script>

<template>
  <button
    type="button"
    :class="[
      `font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`,
      size === 'xs' ? 'rounded px-2 py-1 text-xs' : '',
      size === 'sm' ? 'rounded px-2 py-1 text-sm' : '',
      size === 'md' ? 'rounded-md px-2.5 py-1.5 text-sm' : '',
      size === 'lg' ? 'rounded-md px-3 py-2 text-sm' : '',
      size === 'xl' ? 'rounded-md px-3.5 py-2.5 text-sm' : '',
      color === 'blue' ? 'bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600' : '',
      color === 'green' ? 'bg-green-600 hover:bg-green-500 focus-visible:outline-green-600' : ''
    ]"
  >
    <slot></slot>
  </button>
</template>
