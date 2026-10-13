<script setup lang="ts">
// Figma: espresso-2.0 › References › modal (34953:130700) — "modal new",
// variant form. Six sm subtle fields, 16px apart, and a full-width submit.
import { computed, reactive, ref, watch } from 'vue'
import { Button, Select, Textarea, TextInput } from '../../../src'
import EspressoModal from './EspressoModal.vue'
import ModalField from './ModalField.vue'

export interface NewTicket {
  subject: string
  category: string
  description: string
  mobile: string
  attachment: File | null
  priority: string
}

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{ create: [ticket: NewTicket] }>()

const categories = [
  { label: 'Bug', value: 'bug' },
  { label: 'Question', value: 'question' },
  { label: 'Feature request', value: 'feature' },
]

const priorities = [
  { label: 'Very important', value: 'very-important' },
  { label: 'Important', value: 'important' },
  { label: 'Not urgent', value: 'not-urgent' },
]

const blank = (): NewTicket => ({
  subject: '',
  category: 'bug',
  description: '',
  mobile: '',
  attachment: null,
  priority: 'very-important',
})

const ticket = reactive(blank())
const fileInput = ref<HTMLInputElement | null>(null)

const canCreate = computed(
  () =>
    ticket.subject.trim() &&
    ticket.category &&
    ticket.description.trim() &&
    ticket.mobile.trim() &&
    ticket.priority,
)

watch(open, (isOpen) => {
  if (!isOpen) Object.assign(ticket, blank())
})

function onFile(event: Event) {
  const target = event.target as HTMLInputElement
  ticket.attachment = target.files?.[0] ?? null
  target.value = ''
}

function create(close: () => void) {
  if (!canCreate.value) return
  emit('create', { ...ticket })
  close()
}
</script>

<template>
  <EspressoModal v-model:open="open" title="New ticket" variant="form">
    <div class="flex flex-col gap-4">
      <ModalField label="Subject" required>
        <TextInput v-model="ticket.subject" placeholder="Reset password" />
      </ModalField>

      <ModalField label="Category" required>
        <Select v-model="ticket.category" :options="categories" />
      </ModalField>

      <ModalField label="Description" required>
        <Textarea
          v-model="ticket.description"
          placeholder="Type something"
          :rows="3"
        />
      </ModalField>

      <ModalField label="Mobile number" required>
        <TextInput
          v-model="ticket.mobile"
          type="tel"
          placeholder="+91 9997773636"
        />
      </ModalField>

      <!-- file row: 28px, pl 8 · p 2, 16px icon, white xs Browse -->
      <ModalField label="Attachment">
        <div
          class="flex h-7 items-center gap-2 rounded-4 bg-surface-gray-2 py-0.5 pl-2 pr-0.5"
        >
          <span
            class="lucide-file-up size-4 shrink-0 text-ink-gray-7"
            aria-hidden="true"
          />
          <span
            class="flex-1 truncate text-base"
            :class="ticket.attachment ? 'text-ink-gray-8' : 'text-ink-gray-7'"
          >
            {{ ticket.attachment?.name ?? 'Choose file' }}
          </span>
          <Button
            variant="outline"
            size="xs"
            class="dark:!border-transparent dark:!bg-surface-gray-3"
            @click="fileInput?.click()"
          >
            Browse
          </Button>
          <input ref="fileInput" type="file" class="hidden" @change="onFile" />
        </div>
      </ModalField>

      <ModalField label="How important is your request?" required>
        <Select v-model="ticket.priority" :options="priorities" />
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
