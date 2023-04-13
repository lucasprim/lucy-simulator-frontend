<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useExperimentDrawerStore } from '@/stores/experimentDrawer';
import { storeToRefs } from 'pinia';
import ExperimentBuilder from './experiment_drawer/ExperimentBuilder.vue'

const { open } = storeToRefs(useExperimentDrawerStore())
</script>

<template>
  <teleport to="body">
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10" @close="(ev) => { open = false }">
        <!-- <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild> -->

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto w-screen max-w-2xl">
                  <div class="flex h-full flex-col bg-white shadow-xl">
                    <div class="px-4 sm:px-6 bg-green-800 py-2">
                      <div class="flex items-start justify-between">
                        <DialogTitle class="text-base font-semibold leading-6 text-white">Experimentos de Prompt</DialogTitle>
                        <div class="ml-3 flex h-7 items-center">
                          <button type="button" class="rounded-md text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-2" @click="open = false">
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="relative flex-grow flex overflow-hidden">
                      <ExperimentBuilder />
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </teleport>
</template>
