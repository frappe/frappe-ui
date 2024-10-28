<template>
  <div class="flex h-full flex-col py-11 px-[68px] gap-8 overflow-y-auto">
    <h2 class="flex gap-2 text-xl font-semibold leading-5">
      {{ __('Billing') }}
    </h2>
    <div v-if="team.data">
      <CurrentPlan />
      <div class="bg-gray-100 h-px my-7" />
      <PaymentDetails :team="team.data" />
      <div class="bg-gray-100 h-px my-7" />
      <BillingHistory :team="team.data" />
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

const team = createResource({
  url: 'press.saas.api.team.info',
  auto: true,
})
</script>
