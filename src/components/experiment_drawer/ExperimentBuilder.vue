<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ExperimentMessage from './ExperimentMessage.vue'
import ExperimentResult from './ExperimentResult.vue'
import { useExperimentDrawerStore } from '@/stores/experimentDrawer'
import { CameraIcon, PlayCircleIcon } from '@heroicons/vue/24/solid'

const store = useExperimentDrawerStore()
const {
  availableVariables,
  experimentMessages,
  experimentResults,
  experimentState,
  promptExperiments,
  selectedPromptExperiment,
  snapshots,
  selectedSnapshot
} = storeToRefs(store)
</script>

<template>
  <div class="flex flex-col flex-grow">
    <div class="bg-gray-100 h-10 text-xs shadow-md flex items-center px-4 space-x-1">
      <span>Experimento:</span>
      <select
        v-model="selectedPromptExperiment"
        class="block rounded-md border-0 py-1 pl-3 pr-6 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-slate-600 text-xs"
      >
        <option :value="undefined">Novo</option>
        <option v-for="experiment in promptExperiments" :key="experiment.id" :value="experiment.id">
          {{ experiment.name }}
        </option>
      </select>
      <span class="text-xs"> Snapshot: </span>
      <select
        v-model="selectedSnapshot"
        class="block rounded-md border-0 py-1 pl-3 pr-6 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-1 focus:ring-slate-600 text-xs"
      >
        <option :value="undefined">Novo</option>
        <option v-for="snapshot in snapshots" :key="snapshot.id" :value="snapshot.id">
          {{ snapshot.name }}
        </option>
      </select>
      <span>
        <CameraIcon
          class="h-4 w-4 cursor-pointer"
          @click.prevent="(_e: any) => store.takeSnapshot()"
        />
      </span>
    </div>
    <div class="h-full overflow-auto flex flex-col px-4 mt-2">
      <h3 class="text-base font-semibold leading-6 text-gray-900 flex-initial">Mensagens</h3>

      <div class="bg-gray-50 text-xs p-2">
        Variáveis disponíveis:
        <span
          v-for="(content, name) in availableVariables"
          :key="name"
          class="bg-green-200 inline-block px-1 py-px"
          :title="content"
        >
          {{ name }}
        </span>
      </div>

      <div class="space-y-3 mt-3 flex-grow">
        <ExperimentMessage
          v-for="message in experimentMessages"
          :id="message.id"
          :key="message.id"
          :order="message.order"
          :role="message.role"
          :content="message.content"
        />
        <div class="text-right mt-1">
          <button
            type="button"
            class="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            @click.prevent="(_e) => store.addExperimentMessage()"
          >
            + Add
          </button>
        </div>
      </div>

      <div>
        <ExperimentResult
          v-for="result in experimentResults"
          :key="result.output"
          :output="result.output"
        />
      </div>
    </div>
    <div
      class="bg-green-500 h-12 flex-initial text-right flex justify-end p-2 items-center border-t-2"
    >
      <div class="flex-grow text-left text-white text-xs">
        <span v-if="experimentState === 'ready'"> Aperte play para rodar o experimento </span>
        <span v-else-if="experimentState === 'loading'"> Carregando... </span>
      </div>
      <PlayCircleIcon
        :class="[
          'text-white h-10 w-10 shadow-sm block cursor-pointer',
          experimentState === 'loading' ? 'disabled text-gray-200' : ''
        ]"
        @click.prevent="(_e: any) => { store.runExperiment() } "
      />
    </div>
  </div>
</template>
