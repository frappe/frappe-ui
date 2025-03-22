<template>
  <div
    v-if="!isSidebarCollapsed"
    class="flex flex-col gap-3 shadow-sm rounded-lg py-2.5 px-3 bg-surface-modal text-base"
  >
    <div
      v-if="stepsCompleted != totalSteps"
      class="inline-flex text-ink-gray-9 gap-2"
    >
      <StepsIcon class="h-4 my-0.5 shrink-0" />
      <div class="flex flex-col text-p-sm gap-0.5">
        <div class="font-medium">
          {{ 'Getting started' }}
        </div>
        <div class="text-ink-gray-7">
          {{ `${stepsCompleted}/${totalSteps} steps` }}
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col gap-1">
      <div class="flex items-center justify-between gap-1">
        <div class="flex items-center gap-2 shrink-0">
          <StepsIcon class="h-4 my-0.5" />
          <div class="text-ink-gray-9 font-medium">
            {{ 'You are all set' }}
          </div>
        </div>
        <FeatherIcon
          name="x"
          class="h-4 cursor-pointer"
          @click="
            () => {
              showHelpCenter = true
              isOnboardingStepsCompleted = true
            }
          "
        />
      </div>
      <div class="text-p-sm text-ink-gray-7">
        {{ 'All steps are completed successfully' }}
      </div>
    </div>
    <Button
      v-if="stepsCompleted != totalSteps"
      :label="stepsCompleted == 0 ? 'Start now' : 'Continue'"
      theme="blue"
      @click="openOnboarding"
    >
      <template #prefix>
        <FeatherIcon name="chevrons-right" class="size-4" />
      </template>
    </Button>
  </div>
  <Button v-else-if="stepsCompleted != totalSteps" @click="openOnboarding">
    <StepsIcon class="h-4 my-0.5 shrink-0" />
  </Button>
</template>
<script setup>
import StepsIcon from '../Icons/StepsIcon.vue'
import Button from '../../src/components/Button/Button.vue'
import FeatherIcon from '../../src/components/FeatherIcon.vue'
import { useOnboarding } from './onboarding'
import { showHelpCenter } from '../HelpCenter/helpCenter'
import { showHelpModal, minimize } from '../Help/help'

const props = defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false,
  },
  appName: {
    type: String,
    default: 'frappecrm',
  },
})

const { stepsCompleted, totalSteps, isOnboardingStepsCompleted } =
  useOnboarding(props.appName)

const openOnboarding = () => {
  minimize.value = false
  showHelpModal.value = true
}
</script>
