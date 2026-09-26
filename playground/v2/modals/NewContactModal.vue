<script setup lang="ts">
// Figma: espresso-2.0 › References › modal 600 (34961:139269) — "popup",
// New contact. md outline fields, 20px apart; two-column rows split with a
// 20px gutter; a full-width solid md Create 32px below.
import { computed, reactive, watch } from 'vue'
import { Button, Select, TextInput } from '../../../src'
import EspressoModal from './EspressoModal.vue'
import ModalField from './ModalField.vue'

export interface NewContact {
  salutation: string | null
  firstName: string
  lastName: string
  email: string
  phone: string
  gender: string | null
  organisation: string | null
  designation: string | null
  address: string
}

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{ create: [contact: NewContact] }>()

const salutations = ['Mr', 'Ms', 'Mrs', 'Mx', 'Dr'].map((s) => ({
  label: s,
  value: s,
}))
const genders = ['Female', 'Male', 'Non-binary', 'Prefer not to say'].map(
  (g) => ({ label: g, value: g }),
)
const organisations = ['Timeless', 'Frappe', 'Gumroad'].map((o) => ({
  label: o,
  value: o,
}))
const designations = ['Designer', 'Engineer', 'Manager', 'Founder'].map(
  (d) => ({ label: d, value: d }),
)

const blank = (): NewContact => ({
  salutation: null,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: null,
  organisation: null,
  designation: null,
  address: '',
})

const contact = reactive(blank())

const canCreate = computed(() => contact.firstName.trim() !== '')

watch(open, (isOpen) => {
  if (!isOpen) Object.assign(contact, blank())
})

function create(close: () => void) {
  if (!canCreate.value) return
  emit('create', { ...contact })
  close()
}
</script>

<template>
  <EspressoModal
    v-model:open="open"
    title="New contact"
    variant="form"
    width="600"
  >
    <div class="flex flex-col gap-5">
      <ModalField label="Salutation">
        <Select
          v-model="contact.salutation"
          size="md"
          variant="outline"
          placeholder="Select"
          :options="salutations"
        />
      </ModalField>

      <div class="grid grid-cols-2 gap-5">
        <ModalField label="First name">
          <TextInput
            v-model="contact.firstName"
            size="md"
            variant="outline"
            placeholder="Input text"
          />
        </ModalField>
        <ModalField label="Last name">
          <TextInput
            v-model="contact.lastName"
            size="md"
            variant="outline"
            placeholder="Input text"
          />
        </ModalField>
      </div>

      <ModalField label="Email">
        <TextInput
          v-model="contact.email"
          type="email"
          size="md"
          variant="outline"
          placeholder="Add email address"
        />
      </ModalField>

      <div class="grid grid-cols-2 gap-5">
        <ModalField label="Phone number">
          <TextInput
            v-model="contact.phone"
            type="tel"
            size="md"
            variant="outline"
            placeholder="Add phone number"
          />
        </ModalField>
        <ModalField label="Gender">
          <Select
            v-model="contact.gender"
            size="md"
            variant="outline"
            placeholder="Select"
            :options="genders"
          />
        </ModalField>
      </div>

      <ModalField label="Organisation">
        <Select
          v-model="contact.organisation"
          size="md"
          variant="outline"
          placeholder="Select organisation"
          :options="organisations"
        />
      </ModalField>

      <ModalField label="Designation">
        <Select
          v-model="contact.designation"
          size="md"
          variant="outline"
          placeholder="Select designation"
          :options="designations"
        />
      </ModalField>

      <ModalField label="Address">
        <TextInput
          v-model="contact.address"
          size="md"
          variant="outline"
          placeholder="Address"
        />
      </ModalField>
    </div>

    <template #footer="{ close }">
      <Button
        class="w-full"
        variant="solid"
        size="md"
        :disabled="!canCreate"
        @click="create(close)"
      >
        Create
      </Button>
    </template>
  </EspressoModal>
</template>
