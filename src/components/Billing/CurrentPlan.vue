<template>
  <div class="flex flex-col gap-4">
    <div class="text-lg font-semibold text-gray-900">
      {{ 'Current plan' }}
    </div>
    <div
      v-if="currentPlan?.is_trial_plan"
      class="flex justify-between shadow rounded-lg py-3 px-4 text-base"
    >
      <div class="flex gap-3">
        <div class="flex flex-col gap-4 flex-1">
          <div class="flex flex-col gap-1.5">
            <div class="font-semibold text-gray-900 text-lg">
              {{ currentPlan.is_trial_plan ? 'Trial plan' : currentPlan.name }}
            </div>
            <div v-if="currentPlan.is_trial_plan" class="text-gray-700">
              {{ trialDescription }}
            </div>
          </div>
          <div
            v-if="currentPlan.is_trial_plan && currentPlan.support_included"
            class="text-gray-700 inline-flex items-center gap-1.5"
          >
            <FeatherIcon class="h-4" name="info" />
            <span> Support Included </span>
          </div>
          <div v-else class="text-gray-700">
            <span>{{ currency }}{{ price.value }}</span>
            <span class="font-normal">{{ ' / month · See plan details' }}</span>
          </div>
        </div>
      </div>
      <Button
        variant="solid"
        :label="currentPlan.is_trial_plan ? 'Upgrade now' : 'Change plan'"
        @click="emit('changePlan')"
      />
    </div>
    <div
      v-else-if="currentPlan"
      class="flex flex-col shadow rounded-lg text-base text-gray-900"
    >
      <div class="flex flex-col gap-2.5 py-3 px-4">
        <div class="flex justify-between items-center">
          <div class="flex flex-col gap-1.5">
            <div class="font-semibold text-lg">Recurring Charges</div>
            <div class="text-gray-700">
              <span>Next charge date — </span>
              <span>{{ currentMonthEnd() }}</span>
              <span> · </span>
              <Tooltip>
                <template #body>
                  <PlanDetails :plan="currentPlan" />
                </template>
                <span class="hover:underline cursor-pointer">
                  See plan details
                </span>
              </Tooltip>
            </div>
          </div>
          <div class="flex flex-col gap-1.5 text-end">
            <div>
              <span class="font-semibold text-xl">
                {{ currency }}{{ price.value }}
              </span>
              <span>/mo</span>
            </div>
            <div class="text-gray-600">
              <span>{{ currency }}{{ price.valuePerDay }}</span>
              <span>/day</span>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <div class="text-gray-700 flex gap-2">
            <BillingIcon class="h-4 w-4" />
            <div>
              <span>Current billing amount so far </span>
              <span class="text-gray-900 font-medium">
                {{ currency }} {{ currentBillingAmount?.toFixed(2) }}
              </span>
            </div>
          </div>
          <div>
            <Button
              variant="solid"
              label="Upgrade plan"
              @click="emit('changePlan')"
            />
          </div>
        </div>
      </div>
      <div
        v-if="unpaidAmount.data"
        class="flex justify-between items-center rounded-lg py-2 px-2.5 m-1.5 bg-gray-50"
      >
        <div class="text-gray-800 flex items-center gap-2 h-7">
          <UnPaidBillIcon class="h-4 w-4" />
          <div>
            <span>Unpaid amount is </span>
            <span>{{ currency }} {{ unpaidAmount.data?.toFixed(2) }}</span>
          </div>
        </div>
        <div v-if="team.payment_mode == 'Prepaid Credits'">
          <Button
            variant="outline"
            label="Pay now"
            @click="showCreditBalanceModal = true"
          />
        </div>
      </div>
    </div>
    <div v-else class="flex items-start justify-center">
      <Spinner class="h-4 w-4 text-gray-700" />
    </div>
    <CreditBalanceModal
      v-if="showCreditBalanceModal"
      v-model="showCreditBalanceModal"
      @success="reloadUpcomingInvoice()"
    />
  </div>
</template>
<script setup>
import Tooltip from '../Tooltip/Tooltip.vue'
import Spinner from '../Spinner.vue'
import FeatherIcon from '../FeatherIcon.vue'
import BillingIcon from './icons/BillingIcon.vue'
import UnPaidBillIcon from './icons/UnPaidBillIcon.vue'
import PlanDetails from './PlanDetails.vue'
import CreditBalanceModal from './CreditBalanceModal.vue'
import { createResource } from '../../resources/index.js'
import { calculateTrialEndDays } from './utils.js'
import { ref, computed, inject } from 'vue'

const emit = defineEmits(['changePlan'])

const { baseAPIPath, team, currentBillingAmount, reloadUpcomingInvoice } =
  inject('billing')

const trialEndDays = ref(0)
const trialDescription = computed(() => {
  return trialEndDays.value > 1
    ? 'Your trial plan ends in ' + trialEndDays.value + ' days'
    : 'Your trial plan will end tomorrow'
})

const currentPlan = ref(null)
const price = ref(null)
const currency = computed(() => (team.value.currency == 'INR' ? '₹' : '$'))

const showCreditBalanceModal = ref(false)

createResource({
  url: `${baseAPIPath}.current_site_info`,
  auto: true,
  onSuccess: (data) => {
    trialEndDays.value = calculateTrialEndDays(data.trial_end_date)
    currentPlan.value = data.plan

    let _price =
      currency.value === '₹'
        ? currentPlan.value.price_inr
        : currentPlan.value.price_usd

    let valuePerDay = _price / 30

    price.value = {
      valuePerDay: valuePerDay.toFixed(0),
      value: _price,
    }
  },
})

const unpaidAmount = createResource({
  url: `${baseAPIPath}.saas_api`,
  params: { method: 'billing.total_unpaid_amount' },
  cache: 'unpaidAmount',
  auto: true,
})

const currentMonthEnd = () => {
  const date = new Date()
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return lastDay.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>
