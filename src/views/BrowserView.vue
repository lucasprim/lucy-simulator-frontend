<script setup lang="ts">
import ConversationsList from '@/components/ConversationsList.vue'
import ConversationInspector from '@/components/ConversationInspector.vue'
import { reactive, ref } from 'vue'
import ConversationFilter from '@/components/ConversationFilter.vue'

const selectedConversationId = ref<number | undefined>()

const filters = reactive({
  company: undefined as string | undefined,
  department: undefined as string | undefined,
  team: undefined as string | undefined,
  theme: undefined as string | undefined,
  category: undefined as string | undefined,
  subject: undefined as string | undefined
})
</script>

<template>
  <div class="grid grid-cols-12 gap-3">
    <div class="col-span-12 py-2">
      <div class="bg-gray-100 p-2 rounded-md text-sm flex items-center space-x-2">
        <Suspense>
          <ConversationFilter
            v-model="filters.company"
            name="Empresa"
            entity="external_conversations"
            field="company"
          />
        </Suspense>
        <Suspense>
          <ConversationFilter
            v-model="filters.department"
            name="Departamento"
            entity="external_conversations"
            field="department"
          />
        </Suspense>
        <Suspense>
          <ConversationFilter
            v-model="filters.team"
            name="Equipe"
            entity="external_conversations"
            field="team"
          />
        </Suspense>
        <Suspense>
          <ConversationFilter
            v-model="filters.theme"
            name="Tema"
            entity="external_conversations"
            field="theme"
          />
        </Suspense>
        <Suspense>
          <ConversationFilter
            v-model="filters.category"
            name="Categoria"
            entity="external_conversations"
            field="category"
          />
        </Suspense>
        <Suspense>
          <ConversationFilter
            v-model="filters.subject"
            name="Assunto"
            entity="external_conversations"
            field="subject"
          />
        </Suspense>
      </div>
    </div>
    <div class="col-span-3">
      <suspense>
        <conversations-list
          :selected-conversation-id="selectedConversationId"
          :filters="filters"
          style="height: 600px"
          @select-conversation="
            (newId) => {
              selectedConversationId = newId
            }
          "
        />

        <template #fallback> Loading conversation list... </template>
      </suspense>
    </div>
    <div class="col-span-9 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <suspense>
        <conversation-inspector
          :external-conversation-external-id="selectedConversationId"
          class="overflow-y-auto"
          style="height: 600px"
        />
      </suspense>
    </div>
  </div>
</template>
