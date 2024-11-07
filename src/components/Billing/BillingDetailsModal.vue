<template>
  <Dialog v-model="show" :options="{ title: 'Billing Details' }">
    <template #body-content>
      <div
        v-if="showMessage"
        class="inline-flex gap-1.5 text-base mb-5 text-gray-700"
      >
        <FeatherIcon class="h-4" name="info" />
        <span> Add billing details to your account before proceeding.</span>
      </div>
      <div class="flex flex-col gap-5">
        <FormControl
          v-model="billingInformation.billing_name"
          type="text"
          name="billing_name"
          label="Billing Name"
          :required="true"
        />
        <AddressForm
          ref="addressFormRef"
          v-model="billingInformation"
          @success="
            () => {
              show = false
              emit('success')
            }
          "
        />
      </div>
    </template>
    <template v-if="addressFormRef" #actions>
      <Button
        class="w-full"
        label="Submit"
        variant="solid"
        :loading="addressFormRef.updateBillingInformation.loading"
        @click="addressFormRef.updateBillingInformation.submit()"
      />
    </template>
  </Dialog>
</template>
<script setup>
import AddressForm from './AddressForm.vue'
import FeatherIcon from '../FeatherIcon.vue'
import FormControl from '../FormControl.vue'
import Dialog from '../Dialog.vue'
import { createResource } from '../../resources/index.js'
import { reactive, ref, inject } from 'vue'

const props = defineProps({
  showMessage: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['success'])
const { baseAPIPath } = inject('billing')

const show = defineModel()

const addressFormRef = ref(null)

const billingInformation = reactive({
  billing_name: '',
  address: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  gstin: '',
})

createResource({
  url: `${baseAPIPath}.saas_api`,
  params: { method: 'billing.get_information' },
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
</script>
