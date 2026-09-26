<script setup lang="ts">
// Figma: espresso-2.0 › List › Email large (34984:224989). A 788px column of
// mail rows, ruled beneath:
//   row    py 16, 32px avatar · 8px · body
//   body   14 medium gray-900 subject + 14 gray-500 date on the right
//          · 4px · 14/21 "To: …" · 4px · 14/21 one-line preview (gray-700)
import { ref } from 'vue'
import { Avatar } from '../../../src'
import avatar1 from '../assets/list/large-avatar-1.png'
import avatar2 from '../assets/list/large-avatar-2.png'
import avatar3 from '../assets/list/large-avatar-3.png'
import avatar4 from '../assets/list/large-avatar-4.png'

interface LargeMail {
  id: number
  sender: string
  avatar?: string
  subject: string
  to: string
  preview: string
  date: string
}

const emit = defineEmits<{ open: [mail: LargeMail] }>()

const mails = ref<LargeMail[]>([
  {
    id: 1,
    sender: 'Sandeep Prabhakaran',
    avatar: avatar1,
    subject: 'Package Update',
    to: 'To: Jonathan Higgins, sandeep@timeless.co, +4',
    preview:
      'Hi Good morning, We hope this message finds you well. We are writing to inform you about recent updates to our inventory package that may affect your current and future orders. We’ve expanded our inventory with new items including Bose. These additions are now available for ordering and can be viewed on our Bose. Thanks & Regards Templeton Peck',
    date: '21 Jun',
  },
  {
    id: 2,
    sender: 'Support',
    avatar: avatar2,
    subject: 'System Maintenance Notice',
    to: 'To: All Users, support@timeless.co, +10',
    preview:
      'Dear Valued Customer, Please be advised that our systems will undergo scheduled maintenance on 25 June from 1 AM to 5 AM UTC. During this period, some services may be unavailable. We appreciate your understanding and apologize for any inconvenience.',
    date: '22 Jun',
  },
  {
    id: 3,
    sender: 'Product',
    avatar: avatar3,
    subject: 'New Feature Release',
    to: 'To: Product Team, dev@timeless.co, +8',
    preview:
      'Hello Team, We are excited to announce the launch of our new analytics dashboard, designed to provide deeper insights and real-time data visualization. Training sessions will be conducted next week. Stay tuned for invites.',
    date: '23 Jun',
  },
  {
    id: 4,
    sender: 'HR',
    avatar: avatar4,
    subject: 'Holiday Schedule Update',
    to: 'To: All Employees, hr@timeless.co, +15',
    preview:
      'Dear Team, Please note the revised holiday schedule for the upcoming quarter. Adjustments have been made to accommodate regional holidays. Kindly review the updated calendar attached and plan accordingly.',
    date: '24 Jun',
  },
  {
    id: 5,
    sender: 'Security',
    subject: 'Security Alert',
    to: 'To: IT Department, security@timeless.co, +5',
    preview:
      'Attention IT Staff, A recent vulnerability was detected in our authentication module. Immediate patching is required to safeguard against potential threats. Please prioritize this task and confirm once completed.',
    date: '25 Jun',
  },
])
</script>

<template>
  <ul class="w-[788px] max-w-full" aria-label="Inbox">
    <li
      v-for="mail in mails"
      :key="mail.id"
      class="flex cursor-pointer gap-2 border-b border-outline-gray-1 py-4 transition-colors last:border-b-0 hover:bg-surface-gray-1 dark:border-outline-gray-2 dark:hover:bg-surface-gray-2"
      @click="emit('open', mail)"
    >
      <Avatar size="xl" shape="circle" :image="mail.avatar" :label="mail.sender" />

      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <!-- subject · date -->
        <div class="flex items-baseline gap-2">
          <p class="min-w-0 flex-1 truncate text-base-medium text-ink-gray-9">
            {{ mail.subject }}
          </p>
          <span class="shrink-0 text-base text-ink-gray-5">{{ mail.date }}</span>
        </div>
        <!-- to · preview -->
        <div class="flex flex-col gap-1">
          <p class="truncate text-p-base text-ink-gray-6">{{ mail.to }}</p>
          <p class="truncate text-p-base text-ink-gray-6">{{ mail.preview }}</p>
        </div>
      </div>
    </li>
  </ul>
</template>
