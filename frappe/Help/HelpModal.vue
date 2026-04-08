<template>
  <div
    v-show="show"
    class="fixed right-0 z-50 m-5 mt-[62px] flex h-[calc(100%_-_80px)] w-80 flex-col justify-between gap-2 rounded-lg bg-surface-modal p-3 text-ink-gray-9 shadow-2xl"
    :class="{ 'top-[calc(100%_-_120px)] border': minimize }"
    @click.stop
  >
    <div class="flex items-center justify-between px-2 py-1.5">
      <div class="text-base font-medium">
        {{ headingTitle }}
      </div>
      <div class="flex gap-1">
        <Dropdown v-if="options.length" :options="options">
          <Button variant="ghost" icon="more-horizontal" />
        </Dropdown>
        <Button @click="minimize = !minimize" variant="ghost">
          <component :is="minimize ? MaximizeIcon : MinimizeIcon" class="h-3.5" />
        </Button>
        <Button variant="ghost" @click="show = false">
          <FeatherIcon name="x" class="h-3.5" />
        </Button>
      </div>
    </div>
    <div class="flex h-full flex-col overflow-hidden">
      <OnboardingSteps
        v-if="!isOnboardingStepsCompleted && !showHelpCenter"
        :title="title"
        :logo="logo"
        :afterSkip="afterSkip"
        :afterSkipAll="afterSkipAll"
        :afterReset="afterReset"
        :afterResetAll="afterResetAll"
        :appName="appName"
      />
      <HelpCenter v-else-if="showHelpCenter" v-model="articles" :docsLink="docsLink" />
    </div>
    <div v-for="item in footerItems" class="flex flex-col gap-1.5">
      <div
        class="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-ink-gray-8 hover:bg-surface-gray-1"
        @click="item.onClick"
      >
        <component :is="item.icon" class="h-4" />
        <div class="text-base">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, computed } from 'vue'

import HelpIcon from '../../icons/HelpIcon.vue'
import MaximizeIcon from '../../icons/MaximizeIcon.vue'
import MinimizeIcon from '../../icons/MinimizeIcon.vue'
import StepsIcon from '../../icons/StepsIcon.vue'
import Button from '../../src/components/Button/Button.vue'
import Dropdown from '../../src/components/Dropdown/Dropdown.vue'
import FeatherIcon from '../../src/components/FeatherIcon.vue'
import { minimize } from '../Help/help'
import { showHelpCenter } from '../HelpCenter/helpCenter'
import HelpCenter from '../HelpCenter/HelpCenter.vue'
import { useOnboarding } from '../Onboarding/onboarding'
import OnboardingSteps from '../Onboarding/OnboardingSteps.vue'

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
  docsLink: {
    type: String,
    default: 'https://docs.frappe.io/crm',
  },
})

const { syncStatus, resetAll, isOnboardingStepsCompleted } = useOnboarding(props.appName)

const show = defineModel()
const articles = defineModel('articles')

const headingTitle = computed(() => {
  if (!isOnboardingStepsCompleted.value && !showHelpCenter.value) {
    return 'Getting started'
  } else if (showHelpCenter.value) {
    return 'Help center'
  }
})

const options = computed(() => {
  let items = [
    {
      icon: StepsIcon,
      label: 'Reset onboarding steps',
      onClick: resetOnboardingSteps,
      condition: () => showHelpCenter.value && isOnboardingStepsCompleted.value,
    },
  ]

  return items.filter((item) => item.condition())
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
  ]

  return items.filter((item) => item.condition)
})

function resetOnboardingSteps() {
  resetAll()
  isOnboardingStepsCompleted.value = false
  showHelpCenter.value = false
}

onMounted(() => {
  if (isOnboardingStepsCompleted.value) {
    showHelpCenter.value = true
  }
})
</script>
