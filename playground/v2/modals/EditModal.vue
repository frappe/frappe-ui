<script setup lang="ts">
// Figma: espresso-2.0 › References › modal (34953:130721) — "modal new",
// variant form. Two sm outline selects; Delete left, Cancel/Save right.
import { ref, watch } from 'vue'
import { Button, Select } from '../../../src'
import EspressoModal from './EspressoModal.vue'
import ModalField from './ModalField.vue'

const props = withDefaults(
  defineProps<{ status?: string; sla?: string }>(),
  { status: 'resolved', sla: 'fulfilled' },
)

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  save: [value: { status: string; sla: string }]
  delete: []
}>()

const statuses = [
  { label: 'Open', value: 'open' },
  { label: 'Replied', value: 'replied' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' },
]

const slaBehaviours = [
  { label: 'Fulfilled', value: 'fulfilled' },
  { label: 'Paused', value: 'paused' },
  { label: 'Failed', value: 'failed' },
]

const status = ref(props.status)
const sla = ref(props.sla)

watch(open, (isOpen) => {
  if (isOpen) {
    status.value = props.status
    sla.value = props.sla
  }
})

function save(close: () => void) {
  emit('save', { status: status.value, sla: sla.value })
  close()
}

function remove(close: () => void) {
  emit('delete')
  close()
}
</script>

<template>
  <EspressoModal v-model:open="open" title="Edit" variant="form">
    <div class="flex flex-col gap-4">
      <ModalField label="Status">
        <Select v-model="status" variant="outline" :options="statuses" />
      </ModalField>
      <ModalField label="SLA behaviour">
        <Select v-model="sla" variant="outline" :options="slaBehaviours" />
      </ModalField>
    </div>

    <template #footer="{ close }">
      <Button
        class="mr-auto"
        theme="red"
        variant="subtle"
        size="md"
        @click="remove(close)"
      >
        <template #prefix>
          <span class="lucide-trash-2 size-[18px] text-ink-red-7" />
        </template>
        Delete
      </Button>
      <!-- primary actions: 8px apart -->
      <div class="flex items-center gap-2">
        <Button variant="subtle" size="md" @click="close">Cancel</Button>
        <Button variant="solid" size="md" @click="save(close)">Save</Button>
      </div>
    </template>
  </EspressoModal>
</template>
