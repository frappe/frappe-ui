<script setup lang="ts">
// Checklist completion drives progress while the next unfinished task stays in focus.
import { computed, ref } from 'vue'
import { Button, Progress } from 'frappe-ui'

const steps = ref([
  {
    title: 'Upload file or folder',
    description: 'Add content to start organizing your workspace.',
    action: 'Upload',
    done: true,
  },
  {
    title: 'Share a file or folder',
    description: "Share content with someone you'd like to collaborate with.",
    action: 'Share',
    done: false,
  },
  {
    title: 'Create a shared folder',
    description: 'Keep files your team uses together in one place.',
    action: 'Create',
    done: false,
  },
])

const expanded = ref<number | null>(1)
const percent = computed(() => {
  const doneCount = steps.value.filter((step) => step.done).length
  return Math.round((doneCount / steps.value.length) * 100)
})

function toggleStep(index: number) {
  expanded.value = expanded.value === index ? null : index
}

function completeStep(index: number) {
  steps.value[index].done = true

  const followingStep = steps.value.findIndex(
    (step, stepIndex) => stepIndex > index && !step.done,
  )
  expanded.value =
    followingStep === -1
      ? steps.value.findIndex((step) => !step.done)
      : followingStep

  if (expanded.value === -1) {
    expanded.value = null
  }
}
</script>

<template>
  <div class="w-full max-w-[320px] rounded-7 bg-surface-base p-2.5 shadow-lg">
    <Progress
      :value="percent"
      label="Get Started with Frappe Drive"
      size="md"
    />

    <div class="mt-6 flex flex-col gap-1">
      <div
        v-for="(step, index) in steps"
        :key="step.title"
        class="rounded-6 p-2"
        :class="{ 'bg-surface-gray-1': expanded === index }"
      >
        <button
          type="button"
          class="flex w-full items-center gap-2 text-left"
          :aria-expanded="expanded === index"
          @click="toggleStep(index)"
        >
          <span
            class="size-4 shrink-0"
            :class="step.done ? 'lucide-circle-check' : 'lucide-circle'"
            aria-hidden="true"
          />
          <span class="flex-1 text-base text-ink-gray-8">
            {{ step.title }}
          </span>
          <span
            class="size-4 shrink-0"
            :class="
              expanded === index ? 'lucide-chevron-up' : 'lucide-chevron-down'
            "
            aria-hidden="true"
          />
        </button>

        <div v-if="expanded === index" class="mt-1 px-6">
          <p class="text-p-sm text-ink-gray-6">
            {{ step.description }}
          </p>
          <Button
            class="mt-2"
            variant="solid"
            size="sm"
            @click="completeStep(index)"
          >
            {{ step.action }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
