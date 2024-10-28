<template>
  <div class="flex flex-col gap-4">
    <div class="text-lg font-semibold text-gray-900">
      {{ 'Current plan' }}
    </div>
    <div
      v-if="currentPlan"
      class="flex justify-between shadow rounded-lg p-2.5 text-base"
    >
      <div class="flex gap-3">
        <div class="flex flex-col gap-4 flex-1">
          <div class="flex flex-col gap-1">
            <div class="font-semibold text-gray-900">
              {{ currentPlan.is_trial_plan ? 'Free trial' : currentPlan.name }}
            </div>
            <div
              v-if="currentPlan.is_trial_plan"
              class="text-gray-700 inline-flex items-center gap-1.5"
            >
              <FeatherIcon class="h-3.5" name="alert-triangle" />
              {{ 'Your plan may end soon!' }}
            </div>
          </div>
          <div class="text-gray-700">
            <span>{{ price.currency }}{{ price.value }}</span>
            <span class="font-normal">{{ ' / month · See plan details' }}</span>
          </div>
        </div>
      </div>
      <Button
        variant="solid"
        :label="'Manage plan'"
        @click="emit('changePlan')"
      />
    </div>
  </div>
</template>
<script setup>
import { createResource } from '../../resources/index.js'
import { computed } from 'vue'

const emit = defineEmits(['changePlan'])

const team = createResource({
  url: 'press.saas.api.team.info',
  auto: true,
})

const currency = computed(() => {
  if (!team.data) return 'INR'
  return team.data.currency || 'INR'
})

const site = createResource({
  url: 'press.saas.api.site.info',
  auto: true,
})

const currentPlan = computed(() => {
  if (!site.data) return null
  return site.data.plan
})

const price = computed(() => {
  if (!currentPlan.value) return null
  let price =
    currency.value === 'INR'
      ? currentPlan.value.price_inr
      : currentPlan.value.price_usd

  return {
    value: price,
    currency: currency.value === 'INR' ? '₹' : '$',
  }
})
</script>
