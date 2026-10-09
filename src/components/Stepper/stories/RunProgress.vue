<script setup lang="ts">
// A long-running job whose third stage has parts: the one nested example.
import { onBeforeUnmount, ref } from 'vue'
import { Button, Stepper } from 'frappe-ui'
import type { StepItem } from 'frappe-ui'

const steps: StepItem[] = [
  { value: 'plan', label: 'Resolution planning' },
  { value: 'scope', label: 'Scope alignment' },
  {
    value: 'implement',
    label: 'Implementation',
    children: [
      { value: 'configure', label: 'Configure solution' },
      { value: 'connect', label: 'Connect systems' },
      { value: 'apply', label: 'Apply changes' },
      { value: 'run', label: 'Run workflow' },
      { value: 'output', label: 'Prepare output' },
    ],
  },
  { value: 'verify', label: 'Outcome verification' },
  { value: 'summary', label: 'Final summary' },
]

const order = steps.flatMap((s) => s.children ?? [s]).map((s) => s.value)
const current = ref<string | number>('apply')
const completed = ref(false)
const failed = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

function advance() {
  const i = order.indexOf(current.value)
  if (i < order.length - 1) current.value = order[i + 1]
  else completed.value = true
}

function run() {
  clearInterval(timer)
  current.value = order[0]
  completed.value = false
  failed.value = false
  timer = setInterval(
    () => (completed.value ? clearInterval(timer) : advance()),
    900,
  )
}

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <div class="w-72">
      <Stepper
        v-model="current"
        :steps="steps"
        :completed="completed"
        :failed="failed"
        :loading="!completed && !failed"
        vertical
        edge="end"
      />
    </div>
    <div class="flex gap-2">
      <Button @click="run">Run again</Button>
      <Button :disabled="completed" @click="failed = !failed">
        {{ failed ? 'Retry' : 'Fail this step' }}
      </Button>
    </div>
  </div>
</template>
