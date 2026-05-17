<script setup lang="ts">
import { ref } from 'vue'
import { Button, MultiSelect } from 'frappe-ui'

const state = ref<string[]>(['alice'])

const options = [
  { label: 'Alice Rivera', value: 'alice' },
  { label: 'Bao Nguyen', value: 'bao' },
  { label: 'Chen Wei', value: 'chen' },
  { label: 'Diego Ruiz', value: 'diego' },
  { label: 'Elena Park', value: 'elena' },
]
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center justify-center !py-20">
    <MultiSelect v-model="state" :options="options" placeholder="Assign to">
      <template #trigger="{ selectedOptions, open }">
        <Button icon-left="lucide-users">
          {{
            selectedOptions.length
              ? `${selectedOptions.length} assigned`
              : 'Assign to'
          }}
          <template #suffix>
            <span
              :class="[
                'lucide-chevron-down size-4 transition-transform',
                open && 'rotate-180',
              ]"
            />
          </template>
        </Button>
      </template>
    </MultiSelect>
  </div>
</template>
