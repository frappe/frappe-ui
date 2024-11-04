<template>
  <div class="flex h-full flex-col py-11 px-[68px] gap-8 overflow-y-auto">
    <h2 class="flex gap-2 text-xl font-semibold leading-5">
      {{ __('Billing') }}
    </h2>
    <div v-if="team.data">
      <CurrentPlan @changePlan="emit('changePlan')" />
      <div class="bg-gray-100 h-px my-7" />
      <PaymentDetails />
      <div class="bg-gray-100 h-px my-7" />
      <BillingHistory />
    </div>
    <div v-else class="flex flex-1 items-center justify-center">
      <Spinner class="size-8" />
    </div>
  </div>
</template>
<script setup>
import CurrentPlan from './CurrentPlan.vue'
import PaymentDetails from './PaymentDetails.vue'
import BillingHistory from './BillingHistory.vue'
import Spinner from '../Spinner.vue'
import { createResource } from '../../resources/index.js'
import { computed, provide } from 'vue'

const props = defineProps({
  baseAPIPath: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['changePlan'])

const team = createResource({
  url: `${props.baseAPIPath}.saas_api`,
  params: { method: 'team.info' },
  cache: 'team',
  auto: true,
})

provide('billing', {
  baseAPIPath: props.baseAPIPath,
  team: computed(() => team.data),
})
</script>
