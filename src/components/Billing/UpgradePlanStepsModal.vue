<template>
  <Dialog v-model="show">
    <template #body-main>
      <div class="bg-white px-4 pb-6 pt-5 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex flex-col w-full">
            <div class="flex justify-between items-center">
              <div
                class="inline-flex items-center gap-1.5 text-base text-gray-800"
              >
                <div
                  v-if="step > 1"
                  class="-ml-0.5 cursor-pointer"
                  @click="step = step - 1"
                >
                  <FeatherIcon class="h-4.5" name="chevron-left" />
                </div>
                <span>Step {{ step }}/2</span>
              </div>
              <Button variant="ghost" @click="show = false">
                <template #icon>
                  <FeatherIcon name="x" class="h-4 w-4" />
                </template>
              </Button>
            </div>
            <DialogTitle as="header">
              <h3 class="text-2xl font-semibold leading-6 text-gray-900">
                {{ title || 'Untitled' }}
              </h3>
            </DialogTitle>
            <div
              class="my-5 h-px w-full"
              :class="[
                step === 1
                  ? 'bg-[linear-gradient(to_right,black_0%,black_50%,#ededed_50%,#ededed_100%)]'
                  : 'bg-[linear-gradient(to_right,#ededed_0%,#ededed_50%,black_50%,black_100%)]',
              ]"
            />
          </div>
        </div>
        <div v-show="step === 1">
          <BillingDetails ref="billingRef" @success="() => (step = step + 1)" />
        </div>
        <div v-show="step === 2">
          <div class="text-sm text-gray-800 mb-7.5">
            <div class="mb-1.5">Payment mode</div>
            <TabButtons v-model="activeTab" :buttons="paymentModes" />
            <div class="flex gap-1.5 mt-2">
              <FeatherIcon class="h-4" name="info" />
              {{ paymentModes.find((m) => m.value == activeTab).description }}
            </div>
          </div>
          <CardForm v-show="activeTab == 'Card'" @success="updateMode" />
          <PrepaidCreditsForm
            v-show="activeTab == 'Prepaid Credits'"
            @success="updateMode"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>
<script setup>
import BillingDetails from './BillingDetails.vue'
import CardForm from './CardForm.vue'
import PrepaidCreditsForm from './PrepaidCreditsForm.vue'
import Dialog from '../Dialog.vue'
import Button from '../Button.vue'
import FeatherIcon from '../FeatherIcon.vue'
import TabButtons from '../TabButtons.vue'
import { DialogTitle } from '@headlessui/vue'
import { createResource } from '../../resources/index.js'
import { ref, computed, inject } from 'vue'

const props = defineProps({
  defaultStep: {
    type: Number,
    default: 1,
  },
  planName: {
    type: String,
    required: true,
  },
})

const { baseAPIPath, reloadPlans, reloadSite } = inject('billing')

const show = defineModel()
const step = ref(props.defaultStep)
const title = computed(() =>
  step.value === 1 ? 'Billing Details' : 'Payment mode',
)

const billingRef = ref(null)
const activeTab = ref('Card')

const paymentModes = [
  {
    label: 'Card',
    value: 'Card',
    description: 'Your card will be charged for monthly subscription',
  },
  {
    label: 'Prepaid credits',
    value: 'Prepaid Credits',
    description:
      'You will be charged from your credit balance for monthly subscription',
  },
]

function updateMode() {
  createResource({
    url: `${baseAPIPath}.saas_api`,
    params: {
      method: 'billing.change_payment_mode',
      data: { mode: activeTab.value },
    },
    auto: true,
    onSuccess: () => upgradePlan(),
  })
}

function upgradePlan() {
  createResource({
    url: `${baseAPIPath}.saas_api`,
    params: { method: 'site.change_plan', data: { plan: props.planName } },
    auto: true,
    onSuccess: () => {
      reloadSite()
      reloadPlans()
      show.value = false
    },
  })
}
</script>
