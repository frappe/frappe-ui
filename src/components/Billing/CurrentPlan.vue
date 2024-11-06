<template>
  <div class="flex flex-col gap-4">
    <div class="text-lg font-semibold text-gray-900">
      {{ 'Current plan' }}
    </div>
    <div
      v-if="currentPlan"
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
            <span>{{ price.currency }}{{ price.value }}</span>
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
  </div>
</template>
<script setup>
import FeatherIcon from '../FeatherIcon.vue'
import { createResource } from '../../resources/index.js'
import { calculateTrialEndDays } from './utils.js'
import { ref, computed, inject } from 'vue'

const emit = defineEmits(['changePlan'])

const { baseAPIPath, team } = inject('billing')

const trialEndDays = ref(0)
const trialDescription = computed(() => {
  return trialEndDays.value > 1
    ? 'Your trial plan ends in ' + trialEndDays.value + ' days'
    : 'Your trial plan will end tomorrow'
})

const currentPlan = ref(null)
const price = ref(null)

createResource({
  url: `${baseAPIPath}.current_site_info`,
  auto: true,
  onSuccess: (data) => {
    trialEndDays.value = calculateTrialEndDays(data.trial_end_date)
    currentPlan.value = data.plan

    let currency = team.value.currency || 'INR'
    let _price =
      currency === 'INR'
        ? currentPlan.value.price_inr
        : currentPlan.value.price_usd

    price.value = {
      value: _price,
      currency: currency === 'INR' ? '₹' : '$',
    }
  },
})
</script>
