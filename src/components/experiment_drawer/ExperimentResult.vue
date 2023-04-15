<script setup lang="ts">
defineProps<{ output: string }>()
</script>

<template>
  <div class="bg-gray-200 m-2 text-xs font-mono overflow-auto">
    <div v-html="output.replace(/\n/g, '<br />')"></div>
  </div>
</template>
