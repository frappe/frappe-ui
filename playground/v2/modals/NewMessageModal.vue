<script setup lang="ts">
// Figma: espresso-2.0 › References › modal 600 (34961:139267) — "modal new",
// variant email-compose. A surface-gray-2 shell with a 40px header strip,
// holding a white 12px-radius panel inset 3px:
//   recipients  p 12/16, user icon · 8px · wrapping chips (6px), Cc / Bcc
//   subject     40px row between outline-gray-1 rules
//   body        frappe-ui Editor, p 16, 14/21
//   toolbar     p 12/16/16, solid sm Send + ghost sm icon buttons, trash
import { computed, ref, watch } from 'vue'
import { Avatar, Button, Dialog, Divider, Dropdown } from '../../../src'
import {
  CommentKit,
  Editor,
  EditorContent,
  EditorFixedMenu,
  minimalToolbar,
} from '../../../src/molecules/editor'
import ava from '../assets/600/avatar-ava-rodriguez.png'
import evelyn from '../assets/600/avatar-evelyn-brown.png'
import liam from '../assets/600/avatar-liam-green.png'
import mason from '../assets/600/avatar-mason-smith.png'
import olivia from '../assets/600/avatar-olivia-garcia.png'
import sophia from '../assets/600/avatar-sophia-blue.png'
import './modal.css'

interface Recipient {
  name: string
  email: string
  image?: string
}

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  send: [message: { to: Recipient[]; cc: string[]; bcc: string[]; subject: string; body: string; attachments: File[]; later: boolean }]
  discard: []
  expand: []
}>()

const initialRecipients = (): Recipient[] => [
  { name: 'Olivia Garcia', email: 'olivia@timeless.co', image: olivia },
  { name: 'Ava Rodriguez', email: 'ava@timeless.co', image: ava },
  { name: 'Mason Smith', email: 'mason@timeless.co', image: mason },
  { name: 'Evelyn Brown', email: 'evelyn@timeless.co', image: evelyn },
  { name: 'Liam Green', email: 'liam@timeless.co', image: liam },
  { name: 'Sophia Blue', email: 'sophia@timeless.co', image: sophia },
]

const initialBody = [
  '<p>Hi team,</p>',
  '<p></p>',
  '<p>I hope you’re doing well.<br>I wanted to discuss an upcoming design project and get your insights. We are working on a new dashboard interface for our ERP system and would love to align on key objectives, user experience, and design direction. Would you be available for a quick call this week to go over the project scope and initial ideas? Let me know a time that works for you.<br>Looking forward to your thoughts.</p>',
  '<p></p>',
  '<p>Best,<br>Michael Nguyen.</p>',
].join('')

const recipients = ref<Recipient[]>(initialRecipients())
const draftAddress = ref('')
const subject = ref('Project requirements')
const body = ref(initialBody)
const attachments = ref<File[]>([])
const showCc = ref(false)
const showBcc = ref(false)
const cc = ref('')
const bcc = ref('')
const showFormatting = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const extensions = [CommentKit]

watch(open, (isOpen) => {
  if (!isOpen) return
  recipients.value = initialRecipients()
  subject.value = 'Project requirements'
  body.value = initialBody
  attachments.value = []
  showCc.value = showBcc.value = showFormatting.value = false
  cc.value = bcc.value = draftAddress.value = ''
})

const canSend = computed(() => recipients.value.length > 0)

function addRecipient() {
  const email = draftAddress.value.trim().replace(/,$/, '')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
  if (!recipients.value.some((r) => r.email === email)) {
    recipients.value.push({ name: email.split('@')[0], email })
  }
  draftAddress.value = ''
}

function onBackspace() {
  if (!draftAddress.value) recipients.value.pop()
}

function onFiles(event: Event) {
  const target = event.target as HTMLInputElement
  attachments.value.push(...Array.from(target.files ?? []))
  target.value = ''
}

function send(close: () => void, later = false) {
  if (!canSend.value) return
  emit('send', {
    to: [...recipients.value],
    cc: cc.value.split(',').map((s) => s.trim()).filter(Boolean),
    bcc: bcc.value.split(',').map((s) => s.trim()).filter(Boolean),
    subject: subject.value,
    body: body.value,
    attachments: [...attachments.value],
    later,
  })
  close()
}

function discard(close: () => void) {
  emit('discard')
  close()
}
</script>

<template>
  <Dialog v-model:open="open" size="xl" bare>
    <template #default="{ close }">
      <div
        class="espresso-modal espresso-modal--600 espresso-modal--compose flex flex-col bg-surface-gray-2 px-[3px] pb-[3px]"
      >
        <!-- header strip: 40px, pl 16 · pr 8 -->
        <div class="flex h-10 items-center gap-2 pl-4 pr-2">
          <h3 class="flex-1 text-base-medium text-ink-gray-9">New message</h3>
          <div class="flex items-center gap-1">
            <Button variant="ghost" size="xs" label="Expand" @click="emit('expand')">
              <template #icon>
                <span class="lucide-arrow-up-right size-3.5 text-ink-gray-7" />
              </template>
            </Button>
            <Button variant="ghost" size="xs" label="Close" @click="close">
              <template #icon>
                <span class="lucide-x size-3.5 text-ink-gray-7" />
              </template>
            </Button>
          </div>
        </div>

        <Editor v-model="body" :extensions="extensions" placeholder="Write your message…">
          <div class="flex flex-col rounded-6 bg-surface-elevation-1">
            <!-- recipients: user icon · 8px · chips wrapping 6px apart -->
            <div class="flex items-start justify-between gap-3 px-4 py-3">
              <div class="flex min-w-0 flex-1 items-start gap-2">
                <span class="lucide-user mt-1 size-4 shrink-0 text-ink-gray-7" />
                <div class="flex max-w-[396px] flex-1 flex-wrap items-center gap-1.5">
                  <!-- chip: 24px, pl 6 · pr 4, 6px radius, 12px avatar -->
                  <span
                    v-for="person in recipients"
                    :key="person.email"
                    class="flex h-6 items-center gap-1 rounded-3 bg-surface-gray-2 pl-1.5 pr-1 text-sm text-ink-gray-7"
                    :title="person.email"
                  >
                    <Avatar
                      class="size-3"
                      shape="circle"
                      :image="person.image"
                      :label="person.name"
                    />
                    <span class="pr-0.5">{{ person.name }}</span>
                    <button
                      type="button"
                      class="flex size-3 items-center justify-center rounded-full text-ink-gray-7 hover:text-ink-gray-9"
                      :aria-label="`Remove ${person.name}`"
                      @click="recipients = recipients.filter((r) => r !== person)"
                    >
                      <span class="lucide-x size-3" />
                    </button>
                  </span>
                  <input
                    v-model="draftAddress"
                    type="email"
                    aria-label="Add recipient"
                    class="h-6 min-w-0 flex-1 border-none focus:min-w-24 bg-transparent p-0 text-sm text-ink-gray-7 placeholder-ink-gray-4 focus:ring-0"
                    :placeholder="recipients.length ? '' : 'Add recipients'"
                    @keydown.enter.prevent="addRecipient"
                    @keydown.,.prevent="addRecipient"
                    @keydown.backspace="onBackspace"
                    @blur="addRecipient"
                  />
                </div>
              </div>
              <div class="flex shrink-0 items-center gap-1">
                <Button variant="ghost" size="xs" @click="showCc = !showCc">Cc</Button>
                <Button variant="ghost" size="xs" @click="showBcc = !showBcc">Bcc</Button>
              </div>
            </div>

            <div
              v-if="showCc || showBcc"
              class="flex flex-col gap-2 border-t border-outline-gray-1 px-4 py-2.5"
            >
              <label v-if="showCc" class="flex items-center gap-2 text-base text-ink-gray-5">
                Cc
                <input v-model="cc" class="flex-1 border-none bg-transparent p-0 text-base text-ink-gray-7 focus:ring-0" />
              </label>
              <label v-if="showBcc" class="flex items-center gap-2 text-base text-ink-gray-5">
                Bcc
                <input v-model="bcc" class="flex-1 border-none bg-transparent p-0 text-base text-ink-gray-7 focus:ring-0" />
              </label>
            </div>

            <!-- subject: 40px between outline-gray-1 rules -->
            <input
              v-model="subject"
              aria-label="Subject"
              placeholder="Subject"
              class="h-10 border-x-0 border-y border-outline-gray-1 bg-transparent py-3 pl-4 pr-3 text-base text-ink-gray-7 placeholder-ink-gray-4 focus:border-outline-gray-1 focus:ring-0"
            />

            <EditorContent
              class="espresso-compose-body min-h-[284px] p-4 text-p-base text-ink-gray-7"
            />

            <div v-if="attachments.length" class="flex flex-wrap gap-1.5 px-4 pb-2">
              <span
                v-for="(file, i) in attachments"
                :key="`${file.name}-${i}`"
                class="flex h-6 items-center gap-1 rounded-3 bg-surface-gray-2 pl-1.5 pr-1 text-sm text-ink-gray-7"
              >
                <span class="lucide-paperclip size-3" />
                {{ file.name }}
                <button
                  type="button"
                  class="flex size-3 items-center justify-center"
                  :aria-label="`Remove ${file.name}`"
                  @click="attachments.splice(i, 1)"
                >
                  <span class="lucide-x size-3" />
                </button>
              </span>
            </div>

            <template v-if="showFormatting">
              <Divider />
              <EditorFixedMenu class="px-3 py-1" :items="minimalToolbar" />
            </template>

            <!-- toolbar: pt 12 · px 16 · pb 16; Send · 6px · icon buttons -->
            <div class="flex items-center justify-between px-4 pb-4 pt-3">
              <div class="flex items-center gap-1.5">
                <Dropdown
                  :options="[
                    { label: 'Send now', icon: 'lucide-send', onClick: () => send(close) },
                    { label: 'Send tomorrow, 9 AM', icon: 'lucide-clock', onClick: () => send(close, true) },
                  ]"
                >
                  <Button variant="solid" size="sm" :disabled="!canSend">
                    Send
                    <template #suffix>
                      <span class="lucide-chevron-down size-4" />
                    </template>
                  </Button>
                </Dropdown>
                <Button
                  variant="ghost"
                  size="sm"
                  label="Formatting"
                  :aria-pressed="showFormatting"
                  @click="showFormatting = !showFormatting"
                >
                  <template #icon><span class="lucide-baseline size-4 text-ink-gray-7" /></template>
                </Button>
                <Button variant="ghost" size="sm" label="Attach files" @click="fileInput?.click()">
                  <template #icon><span class="lucide-paperclip size-4 text-ink-gray-7" /></template>
                </Button>
                <Button variant="ghost" size="sm" label="Insert link">
                  <template #icon><span class="lucide-link size-4 text-ink-gray-7" /></template>
                </Button>
                <Button variant="ghost" size="sm" label="Insert emoji">
                  <template #icon><span class="lucide-smile size-4 text-ink-gray-7" /></template>
                </Button>
                <Button variant="ghost" size="sm" label="Insert from folder">
                  <template #icon><span class="lucide-folder size-4 text-ink-gray-7" /></template>
                </Button>
                <Button variant="ghost" size="sm" label="Insert image" @click="fileInput?.click()">
                  <template #icon><span class="lucide-image size-4 text-ink-gray-7" /></template>
                </Button>
                <Button variant="ghost" size="sm" label="More options">
                  <template #icon><span class="lucide-ellipsis-vertical size-4 text-ink-gray-7" /></template>
                </Button>
                <input ref="fileInput" type="file" multiple class="hidden" @change="onFiles" />
              </div>
              <Button variant="ghost" size="sm" label="Discard" @click="discard(close)">
                <template #icon><span class="lucide-trash-2 size-4 text-ink-gray-7" /></template>
              </Button>
            </div>
          </div>
        </Editor>
      </div>
    </template>
  </Dialog>
</template>

<style>
/* Body copy is plain 14/21 gray-800 in the frame, not editor prose sizing. */
.espresso-compose-body .ProseMirror {
  @apply min-h-[252px] text-p-base text-ink-gray-7 outline-none;
}
.espresso-compose-body .ProseMirror p {
  @apply m-0;
}
</style>
