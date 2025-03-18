<template>
  <div
    v-show="show"
    class="fixed z-20 right-0 w-80 h-[calc(100%_-_80px)] text-ink-gray-9 m-5 mt-[62px] p-3 flex gap-2 flex-col justify-between rounded-lg bg-surface-modal shadow-2xl"
    :class="{ 'top-[calc(100%_-_110px)]': minimize }"
    @click.stop
  >
    <div class="flex items-center justify-between">
      <div class="text-base font-medium ml-1">
        {{ title }}
      </div>
      <div>
        <Button @click="minimize = !minimize" variant="ghost">
          <component
            :is="minimize ? MaximizeIcon : MinimizeIcon"
            class="h-3.5"
          />
        </Button>
        <Button variant="ghost" @click="show = false">
          <FeatherIcon name="x" class="h-3.5" />
        </Button>
      </div>
    </div>
    <div class="h-full overflow-hidden flex flex-col">
      <OnboardingSteps
        v-if="!isOnboardingStepsCompleted && !showHelpCenter"
        :logo="logo"
      />
    </div>
    <div v-for="item in footerItems" class="flex flex-col gap-1.5">
      <div
        class="w-full flex gap-2 items-center hover:bg-surface-gray-1 text-ink-gray-8 rounded px-2 py-1.5 cursor-pointer"
        @click="item.onClick"
      >
        <component :is="item.icon" class="h-4" />
        <div class="text-base">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import StepsIcon from '../Icons/StepsIcon.vue'
import MinimizeIcon from '../Icons/MinimizeIcon.vue'
import MaximizeIcon from '../Icons/MaximizeIcon.vue'
import HelpIcon from '../Icons/HelpIcon.vue'
import OnboardingSteps from '../Onboarding/OnboardingSteps.vue'
import { useOnboarding } from '../../composables/onboarding'
import { showHelpCenter, minimize } from '../../composables/help'
import { onMounted, computed } from 'vue'

const props = defineProps({
  appName: {
    type: String,
    default: 'frappecrm',
  },
  logo: {
    type: Object,
    required: true,
  },
})

const { syncStatus, reset, isOnboardingStepsCompleted } = useOnboarding(
  props.appName,
)

const show = defineModel()

const title = computed(() => {
  if (!isOnboardingStepsCompleted.value && !showHelpCenter.value) {
    return 'Getting started'
  } else if (showHelpCenter.value) {
    return 'Help center'
  }
})

const footerItems = computed(() => {
  let items = [
    {
      icon: HelpIcon,
      label: 'Help centre',
      onClick: () => {
        syncStatus()
        showHelpCenter.value = true
      },
      condition: !isOnboardingStepsCompleted.value && !showHelpCenter.value,
    },
    {
      icon: StepsIcon,
      label: 'Getting started',
      onClick: () => (showHelpCenter.value = false),
      condition: showHelpCenter.value && !isOnboardingStepsCompleted.value,
    },
    {
      icon: StepsIcon,
      label: 'Reset onboarding steps',
      onClick: resetOnboardingSteps,
      condition: showHelpCenter.value && isOnboardingStepsCompleted.value,
    },
  ]

  return items.filter((item) => item.condition)
})

function resetOnboardingSteps() {
  reset()
  isOnboardingStepsCompleted.value = false
  showHelpCenter.value = false
}

onMounted(() => {
  if (isOnboardingStepsCompleted.value) {
    showHelpCenter.value = true
  }
})
</script>
