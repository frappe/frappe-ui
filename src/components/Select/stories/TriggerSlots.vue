<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'frappe-ui'

const assignee = ref('faris')
const reviewer = ref('mariam')

const options = [
  {
    label: 'Faris',
    value: 'faris',
  },
  {
    label: 'Aakvatech',
    value: 'aakvatech',
  },
  {
    label: 'Hadi',
    value: 'hadi',
  },
  {
    label: 'Mariam',
    value: 'mariam',
  },
  {
    label: 'Suhail',
    value: 'suhail',
  },
]
</script>

<template>
  <div
    class="grid w-full max-w-4xl divide-y divide-outline-gray-2 md:grid-cols-2 md:divide-x md:divide-y-0"
  >
    <div class="py-4 md:pr-8">
      <div class="text-sm font-medium text-ink-gray-7">Prefix and suffix</div>
      <div class="mt-1 text-p-sm text-ink-gray-5">
        Use the default trigger shell when you only need light customization.
      </div>

      <div class="mt-4">
        <Select v-model="assignee" :options="options" variant="outline">
          <template #prefix>
            <span class="lucide-user size-4 text-ink-gray-6" />
          </template>

          <template #suffix>
            <div class="ml-auto flex items-center gap-2 text-ink-gray-5">
              <span
                class="rounded bg-surface-gray-2 px-1.5 py-0.5 text-sm text-ink-gray-6"
              >
                5
              </span>
              <span class="lucide-chevron-down size-4" />
            </div>
          </template>
        </Select>
      </div>
    </div>

    <div class="py-4 md:pl-8">
      <div class="text-sm font-medium text-ink-gray-7">Custom trigger</div>
      <div class="mt-1 text-p-sm text-ink-gray-5">
        Replace the trigger content entirely when you need richer layout.
      </div>

      <div class="mt-4 w-[320px] max-w-full">
        <Select
          v-model="reviewer"
          :options="options"
          variant="outline"
          class="w-full"
        >
          <template #trigger="{ displayValue, open }">
            <div class="flex w-full items-center gap-3">
              <div
                class="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-gray-2"
              >
                <span class="lucide-users size-4 text-ink-gray-6" />
              </div>

              <div class="min-w-0 flex-1 py-1.5">
                <div class="truncate">
                  {{ displayValue || 'Choose reviewer' }}
                </div>
                <div class="truncate text-p-sm text-ink-gray-5">
                  Design review queue
                </div>
              </div>

              <span
                :class="[
                  'lucide-chevron-down size-4 shrink-0 text-ink-gray-4 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]',
                  open ? 'rotate-180' : '',
                ]"
              />
            </div>
          </template>
        </Select>
      </div>
    </div>
  </div>
</template>
