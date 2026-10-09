<script setup lang="ts">
// A setup wizard: finished steps are clickable, and a step can be skipped.
import { computed, ref } from 'vue'
import { Button, Stepper } from 'frappe-ui'
import type { StepItem } from 'frappe-ui'

const steps = ref<StepItem[]>([
  {
    value: 'account',
    label: 'Account',
    description: 'Name, email and password',
  },
  {
    value: 'workspace',
    label: 'Workspace',
    description: 'Company name and URL',
  },
  { value: 'invite', label: 'Invite team', description: 'Add people by email' },
  {
    value: 'import',
    label: 'Import data',
    description: 'Bring in leads from a CSV',
  },
  {
    value: 'review',
    label: 'Review',
    description: 'Check everything and finish',
  },
])

const current = ref<string | number>('invite')
const index = computed(() =>
  steps.value.findIndex((s) => s.value === current.value),
)
const isLast = computed(() => index.value === steps.value.length - 1)

function next(skip = false) {
  steps.value[index.value].skipped = skip
  if (!isLast.value) current.value = steps.value[index.value + 1].value
}
</script>

<template>
  <div class="flex w-full max-w-lg gap-8">
    <div class="w-56 shrink-0">
      <Stepper v-model="current" :steps="steps" vertical clickable />
    </div>
    <div class="flex flex-1 flex-col justify-between gap-4">
      <p class="text-p-base text-ink-gray-7">{{ steps[index].description }}.</p>
      <div class="flex justify-end gap-2">
        <Button v-if="!isLast" variant="ghost" @click="next(true)">Skip</Button>
        <Button variant="solid" :disabled="isLast" @click="next()"
          >Continue</Button
        >
      </div>
    </div>
  </div>
</template>
