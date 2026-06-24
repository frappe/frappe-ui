<script setup lang="ts">
import { ref } from 'vue'
import { FloatingWindow, Button } from 'frappe-ui'

// A mail composer. The CC / BCC field toggles live in the window's `actions`
// slot, beside the built-in window controls; attach, discard, and send fill the
// footer.
const draft = ref({
  to: '',
  cc: '',
  bcc: '',
  subject: '',
  body: '',
  attachments: [] as string[],
})
const showCc = ref(false)
const showBcc = ref(false)

const fieldClass =
  'flex-1 border-0 bg-transparent p-0 text-base text-ink-gray-8 placeholder:text-ink-gray-4 focus:outline-none focus:ring-0'
const rowClass = 'flex items-center gap-2 border-t border-outline-gray-1 py-1.5'

function attach() {
  draft.value.attachments.push(`attachment-${draft.value.attachments.length + 1}.pdf`)
}

function discard() {
  draft.value = { to: '', cc: '', bcc: '', subject: '', body: '', attachments: [] }
  showCc.value = false
  showBcc.value = false
}

// Pretend to send, then clear the draft.
const send = discard
</script>

<template>
  <div class="w-[480px]">
    <FloatingWindow title="Email Composer" :minimizable="false">
      <!--
        The `actions` slot inserts controls before the built-in pop-out /
        minimize buttons, keeping the standard chrome. Here the CC / BCC toggles
        sit there, mirroring the framework's EmailComposer.
      -->
      <template #actions>
        <Button
          variant="ghost"
          label="CC"
          :class="showCc ? '!bg-surface-gray-4' : '!text-ink-gray-5'"
          @click="showCc = !showCc"
        />
        <Button
          variant="ghost"
          label="BCC"
          :class="showBcc ? '!bg-surface-gray-4' : '!text-ink-gray-5'"
          @click="showBcc = !showBcc"
        />
      </template>

      <div class="flex h-full flex-col px-3">
        <div class="shrink-0">
          <label :class="rowClass">
            <span class="shrink-0 text-p-sm text-ink-gray-4">To</span>
            <input v-model="draft.to" :class="fieldClass" />
          </label>
          <label v-if="showCc" :class="rowClass">
            <span class="shrink-0 text-p-sm text-ink-gray-4">CC</span>
            <input v-model="draft.cc" :class="fieldClass" />
          </label>
          <label v-if="showBcc" :class="rowClass">
            <span class="shrink-0 text-p-sm text-ink-gray-4">BCC</span>
            <input v-model="draft.bcc" :class="fieldClass" />
          </label>
          <label :class="[rowClass, 'border-b']">
            <span class="shrink-0 text-p-sm text-ink-gray-4">Subject</span>
            <input v-model="draft.subject" :class="fieldClass" />
          </label>
        </div>

        <textarea
          v-model="draft.body"
          placeholder="Type your message…"
          class="min-h-24 flex-1 resize-none border-0 bg-transparent px-0 py-3 text-base text-ink-gray-8 placeholder:text-ink-gray-4 focus:outline-none focus:ring-0"
        />

        <div v-if="draft.attachments.length" class="flex flex-wrap gap-2 pb-2">
          <Button
            v-for="(name, index) in draft.attachments"
            :key="index"
            theme="gray"
            variant="subtle"
            :label="name"
          >
            <template #suffix>
              <LucideX
                class="size-3.5 cursor-pointer"
                @click.stop="draft.attachments.splice(index, 1)"
              />
            </template>
          </Button>
        </div>
      </div>

      <template #footer>
        <div
          class="flex items-center justify-between gap-2 border-t border-outline-gray-1 px-3 py-2"
        >
          <button
            type="button"
            aria-label="Attach file"
            class="flex rounded p-1 text-ink-gray-8 transition-colors hover:bg-surface-gray-3"
            @click="attach"
          >
            <LucidePaperclip class="h-4 w-4" />
          </button>
          <div class="flex items-center gap-2">
            <Button label="Discard" @click="discard" />
            <Button
              variant="solid"
              label="Send"
              :disabled="!draft.to.trim()"
              @click="send"
            />
          </div>
        </div>
      </template>
    </FloatingWindow>
  </div>
</template>
