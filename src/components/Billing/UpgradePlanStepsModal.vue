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
        <BillingDetails
          v-show="step === 1"
          ref="billingRef"
          @success="() => (step = step + 1)"
        />
      </div>
    </template>
    <template #actions>
      <Button
        v-if="step > 1"
        class="w-full mb-2"
        label="Previous"
        @click="step = step - 1"
      />
      <Button
        class="w-full"
        variant="solid"
        label="Next"
        :loading="loading"
        @click="next"
      />
    </template>
  </Dialog>
</template>
<script setup>
import BillingDetails from './BillingDetails.vue'
import Dialog from '../Dialog.vue'
import Button from '../Button.vue'
import FeatherIcon from '../FeatherIcon.vue'
import { DialogTitle } from '@headlessui/vue'
import { ref, computed } from 'vue'

const props = defineProps({
  defaultStep: {
    type: Number,
    default: 1,
  },
})

const show = defineModel()
const step = ref(props.defaultStep)
const title = computed(() =>
  step.value === 1 ? 'Billing Details' : 'Payment mode',
)

const billingRef = ref(null)

const loading = computed(() => {
  if (step.value === 1 && billingRef.value) {
    return billingRef.value.getUpdateResource().loading
  }
  return false
})

function next() {
  if (step.value === 1) {
    billingRef.value.getUpdateResource().submit()
  }
}
</script>
