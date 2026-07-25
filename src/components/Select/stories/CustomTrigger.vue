<script setup lang="ts">
import { ref } from 'vue'
import { Select } from 'frappe-ui'

const reviewer = ref('mariam')

const options = [
  { label: 'Faris', value: 'faris' },
  { label: 'Aakvatech', value: 'aakvatech' },
  { label: 'Hadi', value: 'hadi' },
  { label: 'Mariam', value: 'mariam' },
  { label: 'Suhail', value: 'suhail' },
]
</script>

<template>
  <Select
    v-model="reviewer"
    :options="options"
    variant="outline"
    class="w-[320px] max-w-full"
  >
    <template #trigger="{ selectedOption, open }">
      <div class="flex w-full items-center gap-3">
        <div
          class="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-gray-2"
        >
          <span class="lucide-users size-4 text-ink-gray-6" />
        </div>

        <div class="min-w-0 flex-1 py-1.5">
          <div class="truncate">
            {{ selectedOption?.label || 'Choose reviewer' }}
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
</template>
