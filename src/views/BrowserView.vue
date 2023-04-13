<script setup lang="ts">
import ConversationsList from '@/components/ConversationsList.vue'
import ConversationInspector from '@/components/ConversationInspector.vue';
import ConversationExperiments from '@/components/ConversationExperiments.vue';
import { ref } from 'vue';

const selectedConversationId = ref<number | undefined>()

</script>

<template>
  <div class="grid grid-cols-12 gap-3">
    <div class="col-span-3">
      <suspense>
        <conversations-list
          :selected-conversation-id="selectedConversationId"
          class="overflow-y-auto"
          style="height: 600px;"
          @select-conversation="(newId) => { selectedConversationId = newId }"
        />

        <template #fallback>
          Loading conversation list...
        </template>
      </suspense>
    </div>
    <div class="col-span-5 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <suspense>
        <conversation-inspector
          :external-conversation-external-id="selectedConversationId"
          class="overflow-y-auto"
          style="height: 600px"
        />
      </suspense>
    </div>
    <div class="col-span-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200 py-2 px-3">
      <conversation-experiments />
    </div>
  </div>
</template>
