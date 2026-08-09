<script setup>
import { ref } from 'vue'
import { Alert } from 'frappe-ui'

// Plain confirmations with only a × button — `:icon="false"` hides the
// gray theme's default info icon, matching the design's neutral rows.
// The parent owns hiding — dismiss just flips a flag.
const messages = ref([
  { id: 1, title: 'Contacts added successfully' },
  { id: 2, title: 'Deal moved to Negotiation' },
])

function remove(id) {
  messages.value = messages.value.filter((m) => m.id !== id)
}
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-2">
    <Alert
      v-for="message in messages"
      :key="message.id"
      :title="message.title"
      :icon="false"
      dismissible
      @dismiss="remove(message.id)"
    />
    <button
      v-if="!messages.length"
      class="self-start text-sm text-ink-gray-5 underline"
      @click="
        messages = [
          { id: 1, title: 'Contacts added successfully' },
          { id: 2, title: 'Deal moved to Negotiation' },
        ]
      "
    >
      Bring the messages back
    </button>
  </div>
</template>
