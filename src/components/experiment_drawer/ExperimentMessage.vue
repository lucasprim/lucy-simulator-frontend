<script setup lang="ts">
import { XCircleIcon } from '@heroicons/vue/24/outline';
import { useExperimentDrawerStore } from '@/stores/experimentDrawer'
import { ref, watch } from 'vue';
import type { ExperimentMessage } from '@/types';

const props = defineProps<{
  id: number,
  role: 'system' | 'user' | 'assistant',
  content: string
}>()

const store = useExperimentDrawerStore()

const role = ref<ExperimentMessage['role']>(props.role)
const content = ref<ExperimentMessage['content']>(props.content)

watch(
  [role, content],
  ([newRole, newContent]) => {
    console.log('NC')
    if (newRole !== undefined && newContent !== '') {
      store.updateExperimentMessage(props.id, { role: newRole ?? 'user', content: newContent ?? '' })
    }
  }
)

</script>

<template>
  <div class="p-3 pt-5 border rounded-md bg-gray-100 border-gray-200 relative flex">
    <div>
      <!-- <label for="role" class="block text-sm font-medium leading-6 text-gray-800">Role</label> -->
      <select id="role" v-model="role" name="role" class="block w-full rounded-md border-0 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-gray-300 sm:text-sm sm:leading-6">
        <option value="system">System</option>
        <option value="user">User</option>
        <option value="assistant">Assistant</option>
      </select>
    </div>
    <div class="flex-grow ml-2">
      <!-- <label for="content" class="block text-sm font-medium leading-6 text-gray-800">Content</label> -->
      <div>
        <textarea id="content" v-model="content" rows="4" name="content" class="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-300 sm:text-sm sm:leading-6" />
      </div>
    </div>
    <div class="absolute top-px right-px">
      <XCircleIcon
        class="block h-4 w-4 text-gray-400 hover:text-red-400 cursor-pointer"
        @click.prevent="(_e: any) => store.dropExperimentMessage(id)"
      />
    </div>
  </div>
</template>
