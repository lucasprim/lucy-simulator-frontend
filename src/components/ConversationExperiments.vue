<script setup lang="ts">
import { PlayIcon } from '@heroicons/vue/24/solid';
</script>

<template>
  <h3 class="text-lg font-medium">
    Experimentos
  </h3>
  <div class="bg-white h-96 mt-2 rounded-md overflow-y-auto">
    <ol class="text-xs text-right block pt-2">
      <li class="mb-2 mx-2 p-2 bg-green-100 rounded-sm">
        <p class="font-medium">
          ExtractQuestionExperiment - V1
        </p>
        <p>
          Situação:
          Cliente perguntou sobre como fazer para ativar a maquininha T2 do Ton.

          Solução:
          Agente falou para acessar o aplicativo e, no menu, clicar em Ativar Maquininha.
        </p>
      </li>
      <li class="mb-2 mx-2 p-2 bg-green-100 rounded-sm">
        <p class="font-medium">
          ExtractQuestionExperiment - V2
        </p>
        <p>
          Situação:
          Cliente perguntou sobre como fazer para ativar a maquininha T2 do Ton.

          Solução:
          Agente falou para acessar o aplicativo e, no menu, clicar em Ativar Maquininha.
        </p>
      </li>
      <li class="mb-2 mx-2 p-2 bg-green-100 rounded-sm">
        <p class="font-medium">
          ExtractQuestionExperiment - V3
        </p>
        <p>
          Situação:
          Cliente perguntou sobre como fazer para ativar a maquininha T2 do Ton.

          Solução:
          Agente falou para acessar o aplicativo e, no menu, clicar em Ativar Maquininha.
        </p>
      </li>
      <li class="mb-2 mx-2 p-2 bg-green-100 rounded-sm">
        <p class="font-medium">
          ExtractQuestionExperiment - V3
        </p>
        <p>
          Situação:
          Cliente perguntou sobre como fazer para ativar a maquininha T2 do Ton.

          Solução:
          Agente falou para acessar o aplicativo e, no menu, clicar em Ativar Maquininha.
        </p>
      </li>
      <li class="mb-2 mx-2 p-2 bg-green-100 rounded-sm">
        <p class="font-medium">
          ExtractQuestionExperiment - V3
        </p>
        <p>
          Situação:
          Cliente perguntou sobre como fazer para ativar a maquininha T2 do Ton.

          Solução:
          Agente falou para acessar o aplicativo e, no menu, clicar em Ativar Maquininha.
        </p>
      </li>
    </ol>
  </div>
  <div class="my-2 flex items-end">
    <div class="flex-grow mr-2">
      <label for="location" class="block text-sm font-medium leading-6 text-gray-900">Rodar novo experimento</label>
      <select id="location" name="location" class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-green-600 sm:text-sm sm:leading-6">
        <option>ExtractQuestionExperiment V1</option>
        <option selected="true">ExtractSummary V1</option>
        <option>ExtractQuestionExperiment V2</option>
      </select>
    </div>
    <div class="mb-1">
      <button type="button" class="rounded-full bg-green-600 p-1 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
        <PlayIcon class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
