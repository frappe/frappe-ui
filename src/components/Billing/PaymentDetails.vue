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
            <span v-else class="text-gray-700">No card added</span>
          </div>
        </div>
        <div class="shrink-0">
          <Button :label="team.payment_method ? 'Change method' : 'Add card'">
            <template v-if="!team.payment_method" #prefix>
              <FeatherIcon class="h-4" name="plus" />
            </template>
          </Button>
        </div>
      </div>
      <div class="bg-gray-100 h-px my-3" />
      <div class="flex justify-between items-center text-base text-gray-900">
        <div class="flex flex-col gap-1.5">
          <div class="font-medium">{{ 'Payment mode' }}</div>
          <div
            v-if="team.payment_mode"
            class="inline-flex items-center gap-2 text-gray-700"
          >
            <FeatherIcon class="h-4" name="info" />
            {{
              paymentModeOptions.find((o) => o.value === team.payment_mode)
                .description
            }}
          </div>
          <span v-else class="text-gray-700">Not set</span>
        </div>
        <div class="shrink-0">
          <Dropdown :options="paymentModeOptions">
            <template #default="{ open }">
              <Button
                :label="
                  team.payment_mode
                    ? paymentModeOptions.find(
                        (o) => o.value === team.payment_mode,
                      ).label
                    : 'Set mode'
                "
              >
                <template #suffix>
                  <FeatherIcon
                    :name="open ? 'chevron-up' : 'chevron-down'"
                    class="h-4"
                  />
                </template>
              </Button>
            </template>
          </Dropdown>
        </div>
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
          <Button
            :label="'Add credit'"
            @click="
              () => {
                showMessage = false
                showCreditBalanceModal = true
              }
            "
          >
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
          <div v-if="billingDetailsSummary" class="text-gray-700 leading-5">
            {{ billingDetailsSummary }}
          </div>
          <div v-else class="text-gray-700">No address</div>
        </div>
        <div class="shrink-0">
          <Button
            :label="
              billingDetailsSummary ? 'Edit information' : 'Add billing address'
            "
            @click="
              () => {
                showMessage = false
                showBillingDetailsDialog = true
              }
            "
          >
            <template v-if="!billingDetailsSummary" #prefix>
              <FeatherIcon class="h-4" name="plus" />
            </template>
          </Button>
        </div>
      </div>
    </div>
  </div>
  <BillingDetailsModal
    v-if="showBillingDetailsDialog"
    v-model="showBillingDetailsDialog"
    :showMessage="showMessage"
    @success="billingDetails.reload()"
  />
  <CreditBalanceModal
    v-if="showCreditBalanceModal"
    v-model="showCreditBalanceModal"
    :showMessage="showMessage"
    @success="upcomingInvoice.reload()"
  />
</template>
<script setup>
import Dropdown from '../Dropdown.vue'
import Button from '../Button.vue'
import FeatherIcon from '../FeatherIcon.vue'
import BillingDetailsModal from './BillingDetailsModal.vue'
import CreditBalanceModal from './CreditBalanceModal.vue'
import { createResource } from '../../resources/index.js'
import { computed, ref, inject } from 'vue'

const { baseAPIPath, team, reloadTeam } = inject('billing')

const showBillingDetailsDialog = ref(false)
const showCreditBalanceModal = ref(false)

const billingDetails = createResource({
  url: `${baseAPIPath}.saas_api`,
  params: { method: 'billing.get_information' },
  cache: 'billingDetails',
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
  url: `${baseAPIPath}.saas_api`,
  params: { method: 'billing.upcoming_invoice' },
  cache: 'upcomingInvoice',
  auto: true,
})

const paymentModeOptions = [
  {
    label: 'Credit card',
    value: 'Card',
    description: 'Your card will be charged for monthly subscription',
    onClick: () => updatePaymentMode('Card'),
  },
  {
    label: 'Prepaid credits',
    value: 'Prepaid Credits',
    description:
      'You will be charged from your credit balance for monthly subscription',
    onClick: () => updatePaymentMode('Prepaid Credits'),
  },
]
const showMessage = ref(false)
function updatePaymentMode(mode) {
  showMessage.value = false
  if (!billingDetailsSummary.value) {
    showMessage.value = true
    showBillingDetailsDialog.value = true
    return
  }
  if (mode === 'Prepaid Credits' && team.value.balance === 0) {
    showMessage.value = true
    showCreditBalanceModal.value = true
    return
  }
  createResource({
    url: `${baseAPIPath}.saas_api`,
    params: {
      method: 'billing.change_payment_mode',
      data: { mode },
    },
    onSuccess: () => reloadTeam(),
  })
}
</script>
