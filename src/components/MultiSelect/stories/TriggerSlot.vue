<script setup lang="ts">
import { ref } from 'vue'
import { Button, MultiSelect } from 'frappe-ui'
import LucideUsers from '~icons/lucide/users'
import LucideChevronDown from '~icons/lucide/chevron-down'

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
  <MultiSelect v-model="state" :options="options" placeholder="Assign to">
    <template #trigger="{ selectedOptions, open }">
      <Button>
        <template #prefix>
          <LucideUsers class="size-4" />
        </template>
        {{
          selectedOptions.length
            ? `${selectedOptions.length} assigned`
            : 'Assign to'
        }}
        <template #suffix>
          <LucideChevronDown
            :class="[
              'size-4 transition-transform',
              open && 'rotate-180',
            ]"
          />
        </template>
      </Button>
    </template>
  </MultiSelect>
</template>
