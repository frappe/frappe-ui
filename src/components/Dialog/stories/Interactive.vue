<script setup lang="ts">
import { ref } from 'vue'
import { Button, Dialog, Dropdown } from 'frappe-ui'
import LucideChevronDown from '~icons/lucide/chevron-down'

const open = ref(false)
const selectedOption = ref('Option 1')

const dropdownOptions = [
  { label: 'Option 1', onClick: () => (selectedOption.value = 'Option 1') },
  { label: 'Option 2', onClick: () => (selectedOption.value = 'Option 2') },
  { label: 'Option 3', onClick: () => (selectedOption.value = 'Option 3') },
]
</script>

<template>
  <Button @click="open = true">Show Settings Dialog</Button>

  <Dialog v-model="open">
    <template #body-title>
      <h3 class="text-2xl font-semibold text-ink-gray-9">Settings Dialog</h3>
    </template>

    <template #body-content>
      <div class="space-y-4">
        <Dropdown :options="dropdownOptions" placement="left">
          <Button variant="outline">
            {{ selectedOption }}
            <template #suffix>
              <LucideChevronDown class="h-4 w-4 text-gray-500" />
            </template>
          </Button>
        </Dropdown>

        <div class="bg-gray-50 p-4 rounded text-sm">
          <strong>Selected:</strong> {{ selectedOption }}
        </div>
      </div>
    </template>

    <template #actions="{ close }">
      <div class="flex gap-2">
        <Button variant="solid" @click="close">Save</Button>
        <Button variant="outline" @click="close">Cancel</Button>
      </div>
    </template>
  </Dialog>
</template>
