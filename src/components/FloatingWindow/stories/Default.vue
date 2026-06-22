<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { FloatingWindow, TextInput, Button } from 'frappe-ui'

interface Message {
  id: number
  from: 'them' | 'me'
  text: string
}

const messages = ref<Message[]>([
  { id: 1, from: 'them', text: 'Hey! How can I help you today?' },
  { id: 2, from: 'me', text: 'I have a question about my last invoice.' },
  { id: 3, from: 'them', text: 'Of course. What is the invoice number?' },
])
const draft = ref('')
const bottom = ref<HTMLElement | null>(null)
let nextId = messages.value.length + 1

async function send() {
  const text = draft.value.trim()
  if (!text) return
  messages.value.push({ id: nextId++, from: 'me', text })
  draft.value = ''
  await nextTick()
  bottom.value?.scrollIntoView({ block: 'end' })
}
</script>

<template>
  <div class="w-[440px]">
    <FloatingWindow title="Messages" :initial-height="480">
      <!--
        A real chat panel: messages scroll in the body, the composer pins to the
        footer. Pop it out from the title bar to keep chatting while you work.
      -->
      <div class="flex flex-col gap-2 p-3">
        <div
          v-for="message in messages"
          :key="message.id"
          class="max-w-[80%] rounded-lg px-3 py-2 text-p-sm"
          :class="
            message.from === 'me'
              ? 'self-end bg-surface-blue-2 text-ink-blue-6'
              : 'self-start bg-surface-gray-2 text-ink-gray-8'
          "
        >
          {{ message.text }}
        </div>
        <div ref="bottom" />
      </div>

      <template #footer>
        <form
          class="flex items-center gap-2 border-t border-outline-gray-1 p-2"
          @submit.prevent="send"
        >
          <TextInput
            v-model="draft"
            class="flex-1"
            placeholder="Write a message..."
          />
          <Button type="submit" variant="solid" :disabled="!draft.trim()">
            Send
          </Button>
        </form>
      </template>
    </FloatingWindow>
  </div>
</template>
