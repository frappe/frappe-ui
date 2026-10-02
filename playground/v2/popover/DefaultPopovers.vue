<script setup lang="ts">
// Figma: espresso-2.0 › Popover › default — size sm (30867:37578) and md
// (31751:22025): profile cards on the raised popover surface, 12px radius,
// p 12, lg shadow, 12px between header and footer.
//   header  40px avatar · 8px · name over 13 gray-500 subtext (4px apart)
//   sm      280px; 14 medium name, "● Available" (13 gray-500) on the right;
//           a full-width subtle sm "Message" button
//   md      260px; 16 medium name, a ghost xs › on the right; under an
//           outline-gray-1 rule (pt 12), four rows 11px apart of a 16px
//           gray-700 icon · 8px · 14 gray-700 text
import { Avatar, Button } from '../../../src'
import jacob from '../assets/popover-avatar-jacob.png'

const emit = defineEmits<{ message: []; open: [] }>()

const details = [
  { icon: 'lucide-user-round', label: 'Company', text: 'Atlas Corporation' },
  { icon: 'lucide-mail', label: 'Email', text: 'jacob@atlascorp.io', href: 'mailto:jacob@atlascorp.io' },
  { icon: 'lucide-phone', label: 'Phone', text: '+91-9134532344', href: 'tel:+919134532344' },
  { icon: 'lucide-link', label: 'LinkedIn', text: 'linkedin.com/jacob-salvi', href: 'https://linkedin.com/in/jacob-salvi' },
]
</script>

<template>
  <div class="flex flex-wrap items-start justify-center gap-10">
    <!-- sm: status + Message -->
    <div
      class="flex w-[280px] flex-col gap-3 rounded-6 bg-surface-elevation-2 p-3 shadow-lg"
      role="dialog"
      aria-label="Jacob Salvi"
    >
      <div class="flex items-center gap-2">
        <Avatar size="2xl" shape="circle" :image="jacob" label="Jacob Salvi" />
        <div class="flex min-w-0 flex-1 gap-2 self-start pt-0.5">
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <p class="truncate text-base-medium text-ink-gray-7">Jacob Salvi</p>
            <p class="truncate text-sm text-ink-gray-5">jacob@frappe.in</p>
          </div>
          <span class="flex h-4 shrink-0 items-center gap-0.5 text-sm text-ink-gray-5">
            <span class="flex size-4 items-center justify-center">
              <span class="size-[7px] rounded-full bg-current text-ink-green-6" />
            </span>
            Available
          </span>
        </div>
      </div>

      <Button variant="subtle" size="sm" class="w-full dark:!bg-surface-gray-3" @click="emit('message')">
        <template #prefix>
          <span class="lucide-message-square-text size-4" />
        </template>
        Message
      </Button>
    </div>

    <!-- md: role + contact details -->
    <div
      class="flex w-[260px] flex-col gap-3 rounded-6 bg-surface-elevation-2 p-3 shadow-lg"
      role="dialog"
      aria-label="Jacob Salvi"
    >
      <div class="flex items-center gap-2">
        <Avatar size="2xl" shape="circle" :image="jacob" label="Jacob Salvi" />
        <div class="flex min-w-0 flex-1 items-start gap-2">
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <p class="truncate text-lg-medium text-ink-gray-7">Jacob Salvi</p>
            <p class="truncate text-sm text-ink-gray-5">Product Manager</p>
          </div>
          <Button variant="ghost" size="xs" label="Open profile" @click="emit('open')">
            <template #icon>
              <span class="lucide-chevron-right size-3.5 text-ink-gray-7" />
            </template>
          </Button>
        </div>
      </div>

      <ul class="flex flex-col gap-[11px] border-t border-outline-gray-1 pt-3 dark:border-outline-gray-2">
        <li v-for="d in details" :key="d.label" class="flex items-center gap-2">
          <span :class="d.icon" class="size-4 shrink-0 text-ink-gray-6" :aria-label="d.label" />
          <a
            v-if="d.href"
            :href="d.href"
            class="truncate text-base text-ink-gray-6 hover:text-ink-gray-8 hover:underline"
          >
            {{ d.text }}
          </a>
          <span v-else class="truncate text-base text-ink-gray-6">{{ d.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
