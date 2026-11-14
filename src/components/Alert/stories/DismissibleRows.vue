<script setup>
import { ref } from 'vue'
import { Alert } from 'frappe-ui'

// Plain notices with only a × button: information worth reading once, then
// safe to close. A finished action like "Contacts added" belongs in a toast.
// `:icon="false"` hides the gray theme's default info icon, matching the
// design's neutral rows. The parent owns hiding; dismiss just flips a flag.
const notices = [
  { id: 1, title: 'Q4 sales targets are now live' },
  { id: 2, title: 'This deal is shared with the Sales team' },
]
const messages = ref([...notices])

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
      @click="messages = [...notices]"
    >
      Bring the messages back
    </button>
  </div>
</template>
