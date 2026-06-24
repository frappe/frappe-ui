<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { FloatingWindow, TextInput, Button } from 'frappe-ui'

interface Message {
  id: number
  from: 'them' | 'me'
  text: string
}

const messages = ref<Message[]>([
  { id: 1, from: 'them', text: 'Support here, what can I do for you?' },
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
    <FloatingWindow>
      <!--
        The `header` slot replaces the built-in title bar entirely. It becomes
        the drag handle while floating and supplies its own controls.
      -->
      <template #header="{ mode, dock, float, minimize, expandFromTray }">
        <div class="flex w-full items-center justify-between gap-2 px-3 py-2">
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-full bg-surface-green-3" />
            <span class="text-p-sm font-medium text-ink-gray-8">
              Support chat
            </span>
          </div>

          <!-- State-aware window controls: minimize while floating or expand
               while parked in the tray, then pop out / close. The close (X)
               action always sits last. -->
          <div class="flex items-center gap-1">
            <Button
              v-if="mode === 'floating'"
              variant="ghost"
              tooltip="Minimize to tray"
              @click="minimize"
            >
              <template #icon><LucideMinus class="h-4 w-4" /></template>
            </Button>
            <Button
              v-if="mode === 'minimized'"
              variant="ghost"
              tooltip="Expand"
              @click="expandFromTray"
            >
              <template #icon><LucideMaximize2 class="h-4 w-4" /></template>
            </Button>
            <Button
              variant="ghost"
              :tooltip="mode === 'docked' ? 'Pop out' : 'Close'"
              @click="mode === 'docked' ? float() : dock()"
            >
              <template #icon>
                <LucideMaximize2 v-if="mode === 'docked'" class="h-4 w-4" />
                <LucideX v-else class="h-4 w-4" />
              </template>
            </Button>
          </div>
        </div>
      </template>

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
            placeholder="Reply to support..."
          />
          <Button type="submit" variant="solid" :disabled="!draft.trim()">
            Send
          </Button>
        </form>
      </template>
    </FloatingWindow>
  </div>
</template>
