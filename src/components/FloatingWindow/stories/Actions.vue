<script setup lang="ts">
import { computed, ref } from 'vue'
import { FloatingWindow, Button, Avatar } from 'frappe-ui'

// A mail composer. The CC / BCC field toggles live in the window's `actions`
// slot, beside the built-in window controls; attach, discard, and send fill the
// footer.
const draft = ref({
  to: [] as string[],
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

// Recipient autocomplete: type a name, a bubble of matches comes up, and
// picking one adds the address as a removable chip, like the helpdesk email
// composer. A static directory stands in for a contact-search API.
const people = [
  { name: 'Amara Okafor', email: 'amara@example.com' },
  { name: 'Lucas Meyer', email: 'lucas@example.com' },
  { name: 'Priya Nair', email: 'priya@example.com' },
  { name: 'Diego Santos', email: 'diego@example.com' },
]
const toQuery = ref('')
const toFocused = ref(false)

const toMatches = computed(() => {
  const query = toQuery.value.trim().toLowerCase()
  if (!query) return []
  return people.filter(
    (person) =>
      !draft.value.to.includes(person.email) &&
      `${person.name} ${person.email}`.toLowerCase().includes(query),
  )
})

function recipientName(email: string) {
  return people.find((person) => person.email === email)?.name ?? email
}

function addRecipient(email: string | undefined) {
  if (!email || draft.value.to.includes(email)) return
  draft.value.to.push(email)
  toQuery.value = ''
}

function removeRecipient(email: string) {
  draft.value.to = draft.value.to.filter((address) => address !== email)
}

// Backspace on an empty input drops the last recipient, like a token field.
function onToBackspace(event: KeyboardEvent) {
  if (toQuery.value === '' && draft.value.to.length) {
    event.preventDefault()
    draft.value.to.pop()
  }
}

function attach() {
  draft.value.attachments.push(
    `attachment-${draft.value.attachments.length + 1}.pdf`,
  )
}

function discard() {
  draft.value = {
    to: [],
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    attachments: [],
  }
  toQuery.value = ''
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
          <!-- To: recipient autocomplete. Type a name, pick from the bubble,
               and it becomes a removable chip. -->
          <div :class="[rowClass, 'relative']">
            <span class="shrink-0 text-p-sm text-ink-gray-4">
              To
            </span>
            <div class="flex flex-1 flex-wrap items-center gap-1">
              <Button
                v-for="email in draft.to"
                :key="email"
                theme="gray"
                variant="subtle"
                :label="recipientName(email)"
              >
                <template #suffix>
                  <LucideX
                    class="size-3.5 cursor-pointer"
                    @click.stop="removeRecipient(email)"
                  />
                </template>
              </Button>
              <input
                v-model="toQuery"
                class="min-w-[7rem] flex-1 border-0 bg-transparent p-0 text-base text-ink-gray-8 placeholder:text-ink-gray-4 focus:outline-none focus:ring-0"
                @focus="toFocused = true"
                @blur="toFocused = false"
                @keydown.delete="onToBackspace"
                @keydown.enter.prevent="addRecipient(toMatches[0]?.email)"
              />
            </div>

            <!-- The bubble: people matching the current query. mousedown.prevent
                 keeps the input focused so the pick registers before blur. -->
            <ul
              v-if="toFocused && toMatches.length"
              class="absolute left-9 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-lg border border-outline-gray-2 bg-surface-elevation-2 p-1 shadow-xl"
            >
              <li
                v-for="person in toMatches"
                :key="person.email"
                class="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 hover:bg-surface-gray-2"
                @mousedown.prevent="addRecipient(person.email)"
              >
                <Avatar :label="person.name" size="md" />
                <div class="flex min-w-0 flex-col">
                  <span class="truncate text-p-sm font-medium text-ink-gray-8">
                    {{ person.name }}
                  </span>
                  <span class="truncate text-p-xs text-ink-gray-5">
                    {{ person.email }}
                  </span>
                </div>
              </li>
            </ul>
          </div>

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
              :disabled="!draft.to.length"
              @click="send"
            />
          </div>
        </div>
      </template>
    </FloatingWindow>
  </div>
</template>
