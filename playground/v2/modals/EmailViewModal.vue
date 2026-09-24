<script setup lang="ts">
// Figma: espresso-2.0 › References › modal 600 (34961:139268) — "modal new",
// an email read view. Sender row (40px avatar), a rule, a fixed 306px body,
// then a rule and one tile per attachment; sections 12px apart.
import { Avatar, Divider } from '../../../src'
import sandeep from '../assets/600/avatar-sandeep-prabhakaran.png'
import fileDoc from '../assets/600/file-doc.svg'
import filePdf from '../assets/600/file-pdf.svg'
import fileZip from '../assets/600/file-zip.svg'
import EspressoModal from './EspressoModal.vue'

export interface Attachment {
  name: string
  source: string
  icon: string
}

withDefaults(
  defineProps<{
    subject?: string
    sender?: { name: string; image?: string }
    to?: string
    body?: string
    attachments?: Attachment[]
  }>(),
  {
    subject: 'Expanding our inventory',
    sender: () => ({ name: 'Sandeep Prabhakaran', image: sandeep }),
    to: 'To: Jonathan Higgins, sandeep@timeless.co, +4',
    body: [
      'Hi Good morning,',
      'We hope this message finds you well.',
      '',
      'We are writing to inform you about recent updates to our inventory package that may affect your current and future orders. We’ve expanded our inventory with new items including Bose. These additions are now available for ordering and can be viewed on our Bose',
      '',
      'Thanks & Regards',
      'Templeton Peck',
    ].join('\n'),
    attachments: () => [
      { name: 'Satoshi.zip', source: 'Gmail', icon: fileZip },
      { name: 'Bose.PDF', source: 'Outlook', icon: filePdf },
      { name: 'Supply_Update.doc', source: 'More', icon: fileDoc },
    ],
  },
)

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{ openAttachment: [attachment: Attachment] }>()
</script>

<template>
  <EspressoModal v-model:open="open" :title="subject" width="600">
    <div class="flex flex-col gap-3">
      <!-- sender: 40px avatar · 8px · name / to-line (4px) -->
      <div class="flex items-center gap-2">
        <Avatar
          size="2xl"
          shape="circle"
          :image="sender.image"
          :label="sender.name"
        />
        <div class="flex min-w-0 flex-col gap-1">
          <p class="truncate text-base-medium text-ink-gray-7">
            {{ sender.name }}
          </p>
          <p class="truncate text-p-sm text-ink-gray-6">{{ to }}</p>
        </div>
      </div>

      <Divider />

      <p
        class="h-[306px] overflow-y-auto whitespace-pre-line text-p-base text-ink-gray-7"
      >
        {{ body }}
      </p>

      <div v-if="attachments.length" class="flex flex-col gap-4">
        <Divider />
        <!-- tiles fill the row, 8px apart: p 8, 8px radius, surface-gray-2 -->
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="file in attachments"
            :key="file.name"
            type="button"
            class="flex min-w-0 flex-col gap-1 rounded-4 bg-surface-gray-2 p-2 text-start transition-colors hover:bg-surface-gray-3"
            @click="emit('openAttachment', file)"
          >
            <span class="truncate text-base text-ink-gray-7">
              {{ file.name }}
            </span>
            <span class="flex items-center gap-1.5 text-xs text-ink-gray-6">
              <img :src="file.icon" alt="" class="size-4" />
              {{ file.source }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </EspressoModal>
</template>
