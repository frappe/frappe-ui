<script setup lang="ts">
// Figma: espresso-2.0 › References › modal 720 (34967:149565) — "modal new",
// variant form. The 440 New ticket fields laid out two across: sm subtle
// controls, a 16px gutter, rows 16px apart; full-width solid md submit.
import { computed, reactive, watch } from 'vue'
import { Button, Select, TextInput } from '../../../src'
import EspressoModal from './EspressoModal.vue'
import ModalField from './ModalField.vue'

export interface WideTicket {
  salutation: string
  organisation: string
  firstName: string
  lastName: string
  mobile: string
  altMobile: string
  status: string
  dealOwner: string
}

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{ create: [ticket: WideTicket] }>()

const toOptions = (list: string[]) => list.map((v) => ({ label: v, value: v }))

const salutations = toOptions(['Madam', 'Sir', 'Dr', 'Mx'])
const organisations = toOptions(['Centered', 'Timeless', 'Frappe', 'Gumroad'])
const statuses = toOptions(['Open', 'Replied', 'Resolved', 'Closed'])
const owners = toOptions(['Faris Ansari', 'Samantha Lee', 'Olivia Garcia'])

const blank = (): WideTicket => ({
  salutation: 'Madam',
  organisation: 'Centered',
  firstName: '',
  lastName: '',
  mobile: '',
  altMobile: '',
  status: 'Open',
  dealOwner: '',
})

const ticket = reactive(blank())

const canCreate = computed(
  () =>
    ticket.firstName.trim() &&
    ticket.lastName.trim() &&
    ticket.mobile.trim() &&
    ticket.dealOwner,
)

watch(open, (isOpen) => {
  if (!isOpen) Object.assign(ticket, blank())
})

function create(close: () => void) {
  if (!canCreate.value) return
  emit('create', { ...ticket })
  close()
}
</script>

<template>
  <EspressoModal
    v-model:open="open"
    title="New ticket"
    variant="form"
    width="720"
  >
    <div class="grid grid-cols-2 gap-4">
      <ModalField label="Salutation" required>
        <Select v-model="ticket.salutation" :options="salutations" />
      </ModalField>
      <ModalField label="Organisation" required>
        <Select v-model="ticket.organisation" :options="organisations" />
      </ModalField>

      <ModalField label="First name" required>
        <TextInput v-model="ticket.firstName" placeholder="Selena" />
      </ModalField>
      <ModalField label="Last name" required>
        <TextInput v-model="ticket.lastName" placeholder="Delgado" />
      </ModalField>

      <ModalField label="Mobile number" required>
        <TextInput
          v-model="ticket.mobile"
          type="tel"
          placeholder="+91 9997773636"
        />
      </ModalField>
      <ModalField label="Alternate mobile number">
        <TextInput
          v-model="ticket.altMobile"
          type="tel"
          placeholder="+91 9997773636"
        />
      </ModalField>

      <ModalField label="Status" required>
        <Select v-model="ticket.status" :options="statuses" />
      </ModalField>
      <ModalField label="Deal owner" required>
        <Select
          v-model="ticket.dealOwner"
          placeholder="Select owner"
          :options="owners"
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
        Create ticket
      </Button>
    </template>
  </EspressoModal>
</template>
