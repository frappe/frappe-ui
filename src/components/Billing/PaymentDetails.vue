<template>
  <div class="flex flex-col gap-6">
    <div class="text-lg font-semibold text-gray-900">
      {{ 'Payment details' }}
    </div>
    <div class="flex flex-col">
      <div class="flex justify-between items-center text-base text-gray-900">
        <div class="flex flex-col gap-1.5">
          <div class="font-medium">{{ 'Payment method' }}</div>
          <div class="overflow-hidden text-gray-700 text-ellipsis">
            <div v-if="team.payment_method">
              {{ team.payment_method.name_on_card }}
              <span class="text-gray-500">••••</span>
              {{ team.payment_method.last_4 }}
              &middot;
              <span class="font-normal text-gray-600">
                Expiry {{ team.payment_method.expiry_month }}/{{
                  team.payment_method.expiry_year
                }}
              </span>
            </div>
            <span v-else class="font-normal text-gray-600">Not set</span>
          </div>
        </div>
        <div class="shrink-0"><Button :label="'Edit method'" /></div>
      </div>
      <div class="bg-gray-100 h-px my-3" />
      <div class="flex justify-between items-center text-base text-gray-900">
        <div class="flex flex-col gap-1.5">
          <div class="font-medium">{{ 'Credit balance' }}</div>
          <div class="text-gray-700">
            {{ upcomingInvoice.data?.available_credits || 0 }}
          </div>
        </div>
        <div class="shrink-0">
          <Button :label="'Add credit'" @click="showCreditBalanceModal = true">
            <template #prefix>
              <FeatherIcon class="h-4" name="plus" />
            </template>
          </Button>
        </div>
      </div>
      <div class="bg-gray-100 h-px my-3" />
      <div class="flex justify-between items-center text-base text-gray-900">
        <div class="flex flex-col gap-1.5">
          <div class="font-medium">{{ 'Billing address' }}</div>
          <div class="text-gray-700 leading-5">
            {{ billingDetailsSummary }}
          </div>
        </div>
        <div class="shrink-0">
          <Button
            :label="'Edit information'"
            @click="showBillingDetailsDialog = true"
          />
        </div>
      </div>
    </div>
  </div>
  <BillingDetailsModal
    v-if="showBillingDetailsDialog"
    v-model="showBillingDetailsDialog"
    @success="billingDetails.reload()"
  />
  <CreditBalanceModal
    v-if="showCreditBalanceModal"
    v-model="showCreditBalanceModal"
    :team="team"
    @success="upcomingInvoice.reload()"
  />
</template>
<script setup>
import BillingDetailsModal from './BillingDetailsModal.vue'
import CreditBalanceModal from './CreditBalanceModal.vue'
import { createResource } from '../../resources/index.js'
import { computed, ref } from 'vue'

const props = defineProps({
  team: {
    type: Object,
    required: true,
  },
})

const showBillingDetailsDialog = ref(false)
const showCreditBalanceModal = ref(false)

const billingDetails = createResource({
  url: 'press.saas.api.billing.get_information',
  auto: true,
})

const billingDetailsSummary = computed(() => {
  let _billingDetails = billingDetails.data
  if (!_billingDetails) return ''

  const { billing_name, address_line1, city, state, country, pincode, gstin } =
    _billingDetails || {}
  return [billing_name, address_line1, city, state, country, pincode, gstin]
    .filter(Boolean)
    .join(', ')
})

const upcomingInvoice = createResource({
  url: 'press.saas.api.billing.upcoming_invoice',
  auto: true,
})
</script>
