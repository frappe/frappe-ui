<template>
  <div
    v-if="!isSidebarCollapsed && showBanner()"
    class="m-2 flex flex-col gap-3 shadow-sm rounded-lg py-2.5 px-3 bg-white text-base"
  >
    <div class="flex flex-col gap-1">
      <div class="inline-flex gap-2 items-center font-medium">
        <FeatherIcon class="h-4" name="info" />
        {{ trialTitle }}
      </div>
      <div class="text-gray-700 text-sm font-normal leading-5">
        {{ trialMessage }}
      </div>
    </div>
    <Button :label="'Upgrade plan'" theme="red" @click="emit('upgradePlan')">
      <template #prefix>
        <LightningIcon class="size-4" />
      </template>
    </Button>
  </div>
</template>
<script setup>
import LightningIcon from '../../icons/LightningIcon.vue'
import FeatherIcon from '../FeatherIcon.vue'
import Button from '../Button.vue'

const props = defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['upgradePlan'])

const trialEndDays = calculateTrialEndDays()

const trialTitle =
  trialEndDays > 1
    ? 'Trial ends in ' + trialEndDays + ' days'
    : 'Trial will end tomorrow'

const trialMessage = 'Upgrade to get latest and exclusive features'

function showBanner() {
  if (!window.setup_complete || !window.subscription_conf) return false
  return window.subscription_conf.status !== 'Subscribed' && trialEndDays > 0
}

function calculateTrialEndDays() {
  if (window.subscription_conf?.trial_end_date) {
    const trial_end_date = new Date(window.subscription_conf.trial_end_date)
    const today = new Date()
    const diffTime = trial_end_date - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  } else {
    return 15 - window.telemetry_site_age || 1
  }
}
</script>
