<script setup lang="ts">
import { ref, watch } from 'vue'
import { FloatingWindow, TextInput, Textarea, Button } from 'frappe-ui'

const to = ref('')
const subject = ref('')
const body = ref('')
const sent = ref(false)

function reset() {
  to.value = ''
  subject.value = ''
  body.value = ''
}

function discard() {
  reset()
  sent.value = false
}

function send() {
  sent.value = true
  reset()
}

// Clear the confirmation once the user starts a fresh draft.
watch([to, subject, body], () => {
  if (to.value || subject.value || body.value) sent.value = false
})
</script>

<template>
  <div class="w-[440px]">
    <FloatingWindow title="New message" :initial-height="460">
      <!--
        The `actions` slot adds controls before the built-in pop-out / minimize
        buttons. Here a Discard button clears the draft.
      -->
      <template #actions>
        <Button variant="ghost" tooltip="Discard" @click="discard">
          <template #icon><LucideTrash2 class="h-4 w-4" /></template>
        </Button>
      </template>

      <div class="flex h-full flex-col gap-2 p-3">
        <TextInput v-model="to" placeholder="To" />
        <TextInput v-model="subject" placeholder="Subject" />
        <Textarea
          v-model="body"
          class="flex-1"
          placeholder="Write your message..."
        />
      </div>

      <template #footer>
        <div
          class="flex items-center justify-between border-t border-outline-gray-1 p-3"
        >
          <span v-if="sent" class="text-p-xs text-ink-green-3">Message sent</span>
          <span v-else />
          <Button variant="solid" :disabled="!to.trim()" @click="send">
            Send
          </Button>
        </div>
      </template>
    </FloatingWindow>
  </div>
</template>
