<template>
  <div
    v-if="!isSidebarCollapsed && showBanner"
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
import LightningIcon from './icons/LightningIcon.vue'
import FeatherIcon from '../FeatherIcon.vue'
import Button from '../Button.vue'
import { calculateTrialEndDays } from './utils.js'
import { createResource } from '../../resources/index.js'
import { ref, computed } from 'vue'

const props = defineProps({
  isSidebarCollapsed: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['upgradePlan'])

const trialEndDays = ref(0)
const showBanner = ref(false)

const trialTitle = computed(() => {
  return trialEndDays.value > 1
    ? 'Trial ends in ' + trialEndDays.value + ' days'
    : 'Trial will end tomorrow'
})

const trialMessage = 'Upgrade to get latest and exclusive features'

createResource({
  url: 'frappe.integrations.frappe_providers.frappecloud_billing.current_site_info',
  cache: 'currentSiteInfo',
  auto: true,
  onSuccess: (data) => {
    trialEndDays.value = calculateTrialEndDays(data.trial_end_date)
    showBanner.value =
      window.setup_complete && data.plan.is_trial_plan && trialEndDays.value > 0
  },
})
</script>
