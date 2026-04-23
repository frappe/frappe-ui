<script setup lang="ts">
import { ref } from 'vue'
import { Button, Dropdown } from 'frappe-ui'
import LucideChevronDown from '~icons/lucide/chevron-down'

const open = ref(false)

const quickActions = [
  {
    label: 'Open details',
    icon: 'eye',
    onClick: () => console.log('Open details clicked'),
  },
  {
    label: 'Duplicate',
    icon: 'copy',
    onClick: () => console.log('Duplicate clicked'),
  },
  {
    label: 'Archive',
    icon: 'archive',
    onClick: () => console.log('Archive clicked'),
  },
]
</script>

<template>
  <div class="grid w-full grid-cols-2 gap-10">
    <div class="flex flex-col items-start gap-3">
      <div class="text-base font-medium text-ink-gray-8">
        Default slot trigger
      </div>
      <Dropdown :options="quickActions">
        <template #default="{ open: isOpen }">
          <Button :variant="isOpen ? 'solid' : 'subtle'">
            Quick actions
            <template #suffix>
              <LucideChevronDown
                class="size-4 text-ink-gray-6 transition-transform"
                :class="isOpen ? 'rotate-180' : ''"
              />
            </template>
          </Button>
        </template>
      </Dropdown>
    </div>

    <div class="flex flex-col items-start gap-3">
      <div class="text-base font-medium text-ink-gray-8">
        Named trigger slot
      </div>
      <Dropdown v-model:open="open" :options="quickActions">
        <template #trigger="{ open: isOpen }">
          <Button :variant="isOpen ? 'solid' : 'subtle'">
            More actions · {{ isOpen ? 'Open' : 'Closed' }}
          </Button>
        </template>
      </Dropdown>

      <div class="flex items-center gap-2 text-p-sm text-ink-gray-5">
        <span>External state: {{ open ? 'open' : 'closed' }}</span>
        <Button variant="outline" @click="open = !open">Toggle</Button>
      </div>
    </div>
  </div>
</template>
