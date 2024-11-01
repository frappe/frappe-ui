<template>
  <Dialog v-model="show" :options="{ title: 'Billing Details' }">
    <template #body-content>
      <FormControl
        class="mt-4"
        v-model="billingInformation.billing_name"
        label="Billing Name"
      />
      <ErrorMessage class="mt-2" :message="updateBillingInformation.error" />
    </template>
    <template #actions>
      <Button
        class="w-full"
        label="Submit"
        variant="solid"
        :loading="updateBillingInformation.loading"
        @click="updateBillingInformation.submit()"
      />
    </template>
  </Dialog>
</template>
<script setup>
import FormControl from '../FormControl.vue'
import ErrorMessage from '../ErrorMessage.vue'
import Dialog from '../Dialog.vue'
import { createResource } from '../../resources/index.js'
import { reactive } from 'vue'

const emit = defineEmits(['after'])

const show = defineModel()

const billingInformation = reactive({
  address: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  gstin: '',
  billing_name: '',
})

createResource({
  url: 'press.saas.api.billing.get_information',
  auto: true,
  onSuccess: (data) => {
    Object.assign(billingInformation, {
      address: data.address_line1,
      city: data.city,
      state: data.state,
      postal_code: data.pincode,
      country: data.country,
      gstin: data.gstin == 'Not Applicable' ? '' : data.gstin,
      billing_name: data.billing_name,
    })
  },
})

const updateBillingInformation = createResource({
  url: 'press.saas.api.billing.update_information',
  makeParams: () => {
    return {
      billing_details: billingInformation,
    }
  },
  validate: async () => {
    // validate billing name
    let billingName = billingInformation.billing_name.trim()
    let billingNameRegex = /^[a-zA-Z0-9\-\'\,\.\s]+$/
    let billingNameValid = billingNameRegex.test(billingName)
    if (!billingNameValid) {
      return 'Billing Name contains invalid characters'
    }

    // validate gstin
    return await validateGST()
  },
  onSuccess: () => {
    show.value = false
    emit('after')
  },
})

const _validateGST = createResource({
  url: 'press.saas.api.billing.validate_gst',
  makeParams() {
    return {
      address: billingInformation,
    }
  },
})

async function validateGST() {
  billingInformation.gstin = billingInformation.gstin || 'Not Applicable'
  await _validateGST.submit()
}
</script>
