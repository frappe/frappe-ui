<script setup lang="ts">
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { FloatingWindow, Button } from 'frappe-ui'

// A loose take on the framework's EmailComposer (which is itself a FloatingWindow
// underneath). Geometry persists via `storage-key`; the draft persists via a
// matching `useStorage` key, so popping out, moving, typing, and reloading the
// page all return the composer exactly as you left it.
// `mergeDefaults` backfills any keys missing from a previously stored draft, so
// an older saved shape never leaves a field undefined.
const draft = useStorage(
  'frappe-ui:docs:email:draft',
  {
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    attachments: [] as string[],
  },
  undefined,
  { mergeDefaults: true },
)
const showCc = ref(false)
const showBcc = ref(false)

const fieldClass =
  'flex-1 border-0 bg-transparent p-0 text-base text-ink-gray-8 placeholder:text-ink-gray-4 focus:outline-none focus:ring-0'
const rowClass = 'flex items-center gap-2 border-t border-outline-gray-1 py-1.5'

function attach() {
  draft.value.attachments.push(`attachment-${draft.value.attachments.length + 1}.pdf`)
}

function reset() {
  draft.value = { to: '', cc: '', bcc: '', subject: '', body: '', attachments: [] }
}

function discard() {
  reset()
  showCc.value = false
  showBcc.value = false
}
</script>

<template>
  <div class="w-[460px]">
    <FloatingWindow storage-key="frappe-ui:docs:email" :initial-height="480" class="px-2.5 pb-2.5 pt-1.5">
      <!-- "Via Email" header with CC/BCC toggles and pop-out / dock controls,
           mirroring the framework's ComposerHeader. -->
      <template #header="{ mode, dock, float }">
        <div class="flex w-full items-center justify-between gap-2 py-1.5">
          <div class="flex items-center gap-[5px] text-p-sm text-ink-gray-5">
            <span>Via</span>
            <span class="font-medium text-ink-gray-8">Email</span>
          </div>
          <div class="flex items-center gap-1">
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
            <Button
              v-if="mode === 'docked'"
              variant="ghost"
              tooltip="Pop out"
              @click="float"
            >
              <template #icon><LucideMaximize2 class="h-4 w-4" /></template>
            </Button>
            <Button v-else variant="ghost" tooltip="Dock" @click="dock">
              <template #icon><LucideMinimize2 class="h-4 w-4" /></template>
            </Button>
          </div>
        </div>
      </template>

      <div class="flex h-full flex-col">
        <div class="shrink-0">
          <label :class="rowClass">
            <span class="w-12 shrink-0 text-p-sm text-ink-gray-4">To</span>
            <input v-model="draft.to" :class="fieldClass"/>
          </label>
          <label v-if="showCc" :class="rowClass">
            <span class="w-12 shrink-0 text-p-sm text-ink-gray-4">CC</span>
            <input v-model="draft.cc" :class="fieldClass" />
          </label>
          <label v-if="showBcc" :class="rowClass">
            <span class="w-12 shrink-0 text-p-sm text-ink-gray-4">BCC</span>
            <input v-model="draft.bcc" :class="fieldClass" >
          </label>
          <label :class="[rowClass, 'border-b']">
            <span class="w-12 shrink-0 text-p-sm text-ink-gray-4">Subject</span>
            <input
              v-model="draft.subject"
              :class="fieldClass"
          
            />
          </label>
        </div>

        <textarea
          v-model="draft.body"
          placeholder="Type your message…"
          class="min-h-24 flex-1 resize-none border-0 bg-transparent px-0 py-3 text-base text-ink-gray-8 placeholder:text-ink-gray-4 focus:outline-none focus:ring-0"
        />

        <div
          v-if="draft.attachments.length"
          class="flex flex-wrap gap-2 py-2"
        >
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
          class="flex items-center justify-between gap-2 border-t border-outline-gray-1 pt-2"
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
              @click="discard"
            />
          </div>
        </div>
      </template>
    </FloatingWindow>
  </div>
</template>
