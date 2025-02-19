<template>
  <div
    v-if="!isSidebarCollapsed && showBanner"
    class="m-2 flex flex-col gap-3 shadow-sm rounded-lg py-2.5 px-3 bg-surface-white text-base"
  >
    <div class="flex flex-col gap-1">
      <div class="inline-flex gap-1 items-center font-medium">
        <FeatherIcon class="h-4" name="info" />
        {{ trialTitle }}
      </div>
      <div class="text-ink-gray-7 text-p-sm">
        {{ trialMessage }}
      </div>
    </div>
    <Button :label="'Upgrade plan'" theme="blue" @click="upgradePlan">
      <template #prefix>
        <LightningIcon class="size-4" />
      </template>
    </Button>
  </div>
</template>
<script setup>
import LightningIcon from './LightningIcon.vue'
import FeatherIcon from '../FeatherIcon.vue'
import { Button } from '../Button'
import { createResource } from '../../resources'
import { ref, computed } from 'vue'

const props = defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false,
  },
})

const trialEndDays = ref(0)
const showBanner = ref(true)
const isPaymentModeAdded = ref(false)
const baseEndpoint = ref('https://frappecloud.com')
const siteName = ref('')

const trialTitle = computed(() => {
  return trialEndDays.value > 1
    ? 'Trial ends in ' + trialEndDays.value + ' days'
    : 'Trial ends tomorrow'
})

const trialMessage = 'Upgrade to a paid plan for uninterrupted services'

createResource({
  url: 'frappe.integrations.frappe_providers.frappecloud_billing.current_site_info',
  cache: 'current_site_info_data',
  auto: true,
  onSuccess: (data) => {
    trialEndDays.value = calculateTrialEndDays(data.trial_end_date)
    isPaymentModeAdded.value = data.is_payment_method_added
    baseEndpoint.value = data.base_url
    siteName.value = data.site_name
    showBanner.value =
      data.setup_complete && data.plan.is_trial_plan && trialEndDays.value > 0
  },
})

function calculateTrialEndDays(trialEndDate) {
  if (!trialEndDate) return 0

  trialEndDate = new Date(trialEndDate)
  const today = new Date()
  const diffTime = trialEndDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

function upgradePlan() {
  let redirectRoute = ''
  if (isPaymentModeAdded.value) {
    redirectRoute = '/dashboard/sites/' + siteName.value
  } else {
    redirectRoute = '/dashboard/welcome'
  }

  window.open(`${baseEndpoint.value}${redirectRoute}`, '_blank')
}
</script>
