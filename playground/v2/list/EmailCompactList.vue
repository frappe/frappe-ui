<script setup lang="ts">
// Figma: espresso-2.0 › List › Email compact (34984:225794). A 900px card
// (outline-gray-1, 10px radius) of 40px rows, ruled between:
//   row    px 16 · py 8
//   left   187px: 24px avatar · 8px · blue unread dot + 14 medium sender
//   right  14 medium gray-900 subject, then its gray-500 preview, on one
//          truncated line · 40px · the 14 gray-500 time on the right
// Opening a row marks it read.
import { ref } from 'vue'
import { Avatar } from '../../../src'
import avatar1 from '../assets/list/compact-avatar-1.png'
import avatar2 from '../assets/list/compact-avatar-2.png'
import avatar3 from '../assets/list/compact-avatar-3.png'
import avatar4 from '../assets/list/compact-avatar-4.png'
import avatar5 from '../assets/list/compact-avatar-5.png'

interface CompactMail {
  id: number
  sender: string
  avatar: string
  subject: string
  preview: string
  time: string
  unread: boolean
}

const emit = defineEmits<{ open: [mail: CompactMail] }>()

const mails = ref<CompactMail[]>([
  {
    id: 1,
    sender: 'Ethan Tran',
    avatar: avatar1,
    subject: 'Asian Paints Q3 profit falls, Titan Q3 total income rises & more',
    preview: 'NIFTY sectoral indices, Oil and Gas (+2.70%) and',
    time: '1hr ago',
    unread: true,
  },
  {
    id: 2,
    sender: 'Dribbble',
    avatar: avatar2,
    subject: 'New Inspiration For You: Feb 5, 2025',
    preview: 'New projects from people you follow like TACTYC Studio, Danny Ivan, and more',
    time: '1hr ago',
    unread: true,
  },
  {
    id: 3,
    sender: 'Sofia Garcia',
    avatar: avatar3,
    subject: 'Tech Innovations in 2024',
    preview: 'AI advancements in healthcare and finance sectors, insights from industry leaders',
    time: '1hr ago',
    unread: true,
  },
  {
    id: 4,
    sender: 'John Doe',
    avatar: avatar4,
    subject: 'Cryptocurrency market update:',
    preview: 'Bitcoin surpasses $60,000, analysts predict further volatility',
    time: '2hr ago',
    unread: true,
  },
  {
    id: 5,
    sender: 'Zendesk',
    avatar: avatar5,
    subject: 'Latest Gadgets',
    preview: 'Top 5 must-have tech products released this month that are changing the game',
    time: '4hr ago',
    unread: true,
  },
])

function open(mail: CompactMail) {
  mail.unread = false
  emit('open', mail)
}
</script>

<template>
  <ul
    class="w-[900px] max-w-full overflow-hidden rounded-5 border border-outline-gray-1 dark:border-outline-gray-2"
    aria-label="Inbox"
  >
    <li
      v-for="mail in mails"
      :key="mail.id"
      class="flex h-10 cursor-pointer items-center border-b border-outline-gray-1 px-4 transition-colors last:border-b-0 hover:bg-surface-gray-1 dark:border-outline-gray-2 dark:hover:bg-surface-gray-2"
      @click="open(mail)"
    >
      <!-- sender: 24px avatar · 8px · dot + name -->
      <div class="flex w-[187px] shrink-0 items-center gap-2">
        <Avatar size="md" shape="circle" :image="mail.avatar" :label="mail.sender" />
        <div class="flex min-w-0 items-center">
          <span class="flex size-4 shrink-0 items-center justify-center">
            <span
              class="size-1.5 rounded-full bg-surface-blue-7 transition-opacity"
              :class="{ 'opacity-0': !mail.unread }"
            />
            <span v-if="mail.unread" class="sr-only">Unread</span>
          </span>
          <span class="truncate text-base-medium text-ink-gray-7">{{ mail.sender }}</span>
        </div>
      </div>

      <!-- subject + preview on one line · time -->
      <div class="flex min-w-0 flex-1 items-center gap-10">
        <p class="min-w-0 flex-1 truncate text-base">
          <span class="font-medium text-ink-gray-9">{{ mail.subject }}</span>
          <span class="ml-1 text-ink-gray-5">{{ mail.preview }}</span>
        </p>
        <span class="shrink-0 text-base text-ink-gray-5">{{ mail.time }}</span>
      </div>
    </li>
  </ul>
</template>
