<template>
  <div class="mb-7 mt-4 flex flex-col items-center justify-center gap-1">
    <component :is="logo" class="mb-4 size-10 shrink-0 rounded" />
    <div class="text-base font-medium">
      {{ 'Welcome to ' + title }}
    </div>
    <div class="text-p-base font-normal">
      {{ `${stepsCompleted}/${totalSteps} steps completed` }}
    </div>
  </div>
  <div class="flex flex-col gap-2.5 overflow-hidden">
    <div class="flex items-center justify-between py-0.5">
      <Badge
        :label="`${completedPercentage}% completed`"
        :theme="completedPercentage == 100 ? 'green' : 'orange'"
        size="lg"
      />
      <div class="flex">
        <Button
          v-if="completedPercentage != 0"
          variant="ghost"
          :label="'Reset all'"
          @click="() => resetAll(afterResetAll)"
        />
        <Button
          v-if="completedPercentage != 100"
          variant="ghost"
          :label="'Skip all'"
          @click="() => skipAll(afterSkipAll)"
        />
      </div>
    </div>
    <div class="flex flex-col gap-1.5 overflow-y-auto">
      <div
        v-for="step in steps"
        :key="step.title"
        class="group flex w-full cursor-pointer items-center justify-between gap-2 rounded px-2 py-1.5 hover:bg-surface-gray-1"
        @click.stop="() => !step.completed && !isDependent(step) && step.onClick()"
      >
        <component :is="isDependent(step) ? Tooltip : 'div'" :text="dependsOnTooltip(step)">
          <div
            class="flex items-center gap-2"
            :class="[
              step.completed
                ? 'text-ink-gray-5'
                : isDependent(step)
                  ? 'text-ink-gray-4'
                  : 'text-ink-gray-8',
            ]"
          >
            <component :is="step.icon" class="h-4" />
            <div class="text-base" :class="{ 'line-through': step.completed }">
              {{ step.title }}
            </div>
          </div>
        </component>
        <Button
          v-if="!step.completed && !isDependent(step)"
          :label="'Skip'"
          class="hidden !h-4 text-xs !text-ink-gray-6 group-hover:flex"
          @click="() => skip(step.name, afterSkip)"
        />
        <Button
          v-else-if="!isDependent(step)"
          :label="'Reset'"
          class="hidden !h-4 text-xs !text-ink-gray-6 group-hover:flex"
          @click.stop="() => reset(step.name, afterReset)"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import Badge from '../../src/components/Badge/Badge.vue'
import Button from '../../src/components/Button/Button.vue'
import Tooltip from '../../src/components/Tooltip/Tooltip.vue'
import { useOnboarding } from './onboarding'

const props = defineProps({
  appName: {
    type: String,
    default: 'frappecrm',
  },
  title: {
    type: String,
    default: 'Frappe CRM',
  },
  logo: {
    type: Object,
    required: true,
  },
  afterSkip: {
    type: Function,
    default: () => {},
  },
  afterSkipAll: {
    type: Function,
    default: () => {},
  },
  afterReset: {
    type: Function,
    default: () => {},
  },
  afterResetAll: {
    type: Function,
    default: () => {},
  },
})

function isDependent(step) {
  if (step.dependsOn && !step.completed) {
    const dependsOnStep = steps.find((s) => s.name === step.dependsOn)
    if (dependsOnStep && !dependsOnStep.completed) {
      return true
    }
  }
  return false
}

function dependsOnTooltip(step) {
  if (step.dependsOn && !step.completed) {
    const dependsOnStep = steps.find((s) => s.name === step.dependsOn)
    if (dependsOnStep && !dependsOnStep.completed) {
      return `You need to complete "${dependsOnStep.title}" first.`
    }
  }
  return ''
}

const { steps, stepsCompleted, totalSteps, completedPercentage, skip, skipAll, reset, resetAll } =
  useOnboarding(props.appName)
</script>
