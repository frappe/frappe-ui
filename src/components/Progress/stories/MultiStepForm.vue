<script setup lang="ts">
// This story demonstrates segmented progress as a replayable step indicator.
import { computed, reactive, ref } from 'vue'
import { Button, FormControl, Progress } from 'frappe-ui'

const steps = ['Payment mode', 'Billing address', 'Review'] as const
const step = ref(0)
const form = reactive({
  cardNumber: '',
  cardholderName: '',
  city: '',
  postalCode: '',
})

const percent = computed(() => ((step.value + 1) / steps.length) * 100)

function continueForm() {
  step.value = step.value === steps.length - 1 ? 0 : step.value + 1
}
</script>

<template>
  <div class="w-full max-w-[400px] rounded-7 border border-outline-gray-1 p-4">
    <Progress
      :value="percent"
      :label="steps[step]"
      :intervals="true"
      :interval-count="steps.length"
    >
      <template #hint>
        <span class="text-base text-ink-gray-5">
          Step {{ step + 1 }} of {{ steps.length }}
        </span>
      </template>
    </Progress>

    <div v-if="step === 0" class="mt-6 flex flex-col gap-4">
      <FormControl
        v-model="form.cardNumber"
        label="Card number"
        placeholder="1234 5678 9012 3456"
      />
      <FormControl
        v-model="form.cardholderName"
        label="Name on card"
        placeholder="Full name"
      />
    </div>

    <div v-else-if="step === 1" class="mt-6 flex flex-col gap-4">
      <FormControl v-model="form.city" label="City" placeholder="City" />
      <FormControl
        v-model="form.postalCode"
        label="Postal code"
        placeholder="Postal code"
      />
    </div>

    <p v-else class="mt-6 text-p-sm text-ink-gray-7">
      Confirm your details to authorize the subscription charge.
    </p>

    <div class="mt-6 flex justify-end gap-2">
      <Button :disabled="step === 0" @click="step -= 1">Back</Button>
      <Button variant="solid" @click="continueForm">
        {{ step === steps.length - 1 ? 'Confirm' : 'Save & Continue' }}
      </Button>
    </div>
  </div>
</template>
