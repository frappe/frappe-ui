<template>
  <Dialog v-model="show" :options="{ title: 'Billing Details' }">
    <template #body-content>
      <div class="flex flex-col gap-5">
        <div
          v-for="section in sections"
          :key="section.name"
          class="grid gap-4"
          :class="'grid-cols-' + section.columns"
        >
          <div v-for="field in section.fields" :key="field.name">
            <FormControl
              :label="field.label || field.fieldname"
              :type="getInputType(field)"
              :name="field.fieldname"
              :options="field.options"
              v-model="billingInformation[field.fieldname]"
              :disabled="field.disabled"
              :placeholder="field.placeholder"
              :required="field.required"
            />
          </div>
        </div>
        <div v-show="billingInformation.country == 'India'">
          <FormControl
            label="I have GSTIN"
            type="checkbox"
            v-model="gstApplicable"
          />
          <FormControl
            v-if="gstApplicable"
            class="mt-5"
            label="GSTIN"
            type="text"
            v-model="billingInformation.gstin"
          />
        </div>
      </div>
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
import { reactive, ref, computed, inject } from 'vue'

const emit = defineEmits(['success'])
const { baseAPIPath, team } = inject('billing')

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
  url: `${baseAPIPath}.saas_api`,
  params: { method: 'billing.get_information' },
  cache: 'billingInformations',
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
    gstApplicable.value = data.gstin && data.gstin !== 'Not Applicable'
  },
})

const updateBillingInformation = createResource({
  url: `${baseAPIPath}.saas_api`,
  params: { method: 'billing.update_information' },
  makeParams: () => {
    return {
      billing_details: billingInformation,
    }
  },
  validate: async () => {
    // validate mandatory fields
    for (let field of sections.value.flatMap((s) => s.fields)) {
      if (field.required && !billingInformation[field.fieldname]) {
        return `${field.label} is required`
      }
    }

    // validate billing name
    let billingName = billingInformation.billing_name.trim()
    let billingNameRegex = /^[a-zA-Z0-9\-\'\,\.\s]+$/
    let billingNameValid = billingNameRegex.test(billingName)
    if (!billingNameValid) {
      return 'Billing Name contains invalid characters'
    }

    if (!gstApplicable.value) {
      billingInformation.gstin = 'Not Applicable'
    }

    // validate gstin
    return await validateGST()
  },
  onSuccess: () => {
    show.value = false
    emit('success')
  },
})

const _indianStates = [
  'Andaman and Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep Islands',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Other Territory',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

const _countryList = createResource({
  url: `${baseAPIPath}.saas_api`,
  params: { method: 'billing.country_list' },
  cache: 'countryList',
  auto: true,
  onSuccess: () => {
    let userCountry = team.value?.country
    if (userCountry) {
      let country = countryList.value?.find((d) => d.label === userCountry)
      if (country) {
        billingInformation.country = country.value
      }
    }
  },
})

const countryList = computed(() => {
  return (_countryList.data || []).map((d) => ({
    label: d.name,
    value: d.name,
  }))
})

const indianStates = computed(() => {
  return _indianStates.map((state) => ({
    label: state,
    value: state,
  }))
})

const sections = computed(() => {
  return [
    {
      name: 'Billing Name',
      columns: 1,
      fields: [
        {
          fieldtype: 'Data',
          label: 'Billing Name',
          fieldname: 'billing_name',
          required: true,
        },
      ],
    },
    {
      name: 'Country and City',
      columns: 2,
      fields: [
        {
          fieldtype: 'Select',
          label: 'Country',
          fieldname: 'country',
          options: countryList.value,
          required: true,
        },
        {
          fieldtype: 'Data',
          label: 'City',
          fieldname: 'city',
          required: true,
        },
      ],
    },
    {
      name: 'Address',
      columns: 1,
      fields: [
        {
          fieldtype: 'Data',
          label: 'Address',
          fieldname: 'address',
          required: true,
        },
      ],
    },
    {
      name: 'State and Postal Code',
      columns: 2,
      fields: [
        {
          fieldtype: billingInformation.country === 'India' ? 'Select' : 'Data',
          label: 'State / Province / Region',
          fieldname: 'state',
          required: true,
          options:
            billingInformation.country === 'India' ? indianStates.value : null,
        },
        {
          fieldtype: 'Data',
          label: 'Postal Code',
          fieldname: 'postal_code',
          required: true,
        },
      ],
    },
  ]
})

function getInputType(field) {
  return {
    Data: 'text',
    Int: 'number',
    Select: 'select',
    Check: 'checkbox',
    Password: 'password',
    Text: 'textarea',
    Date: 'date',
  }[field.fieldtype || 'Data']
}

const gstApplicable = ref(false)

const _validateGST = createResource({
  url: `${baseAPIPath}.saas_api`,
  params: { method: 'billing.validate_gst' },
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
