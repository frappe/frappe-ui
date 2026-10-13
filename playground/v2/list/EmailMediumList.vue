<script setup lang="ts">
// Figma: espresso-2.0 › List › Email medium (34984:224389). A 350px column of mail
// rows, each an outline-gray-1-ruled "cell":
//   row    p 12 / 20, 32px avatar · 8px · body
//   body   blue unread dot + 14 medium sender, 13 gray-500 date on the right
//          · 4px · 14/21 subject + 16px star · 2px · 14/21 preview
// Opening a row marks it read; the star toggles.
import { Avatar, Button } from '../../../src'
import { mails, type Mail } from './mailStore'

const emit = defineEmits<{ open: [mail: Mail] }>()

function open(mail: Mail) {
  mail.unread = false
  emit('open', mail)
}
</script>

<template>
  <ul class="w-[350px] max-w-full" aria-label="Inbox">
    <li
      v-for="mail in mails"
      :key="mail.id"
      class="flex cursor-pointer gap-2 border-b border-outline-gray-1 px-5 py-3 transition-colors last:border-b-0 hover:bg-surface-gray-1 dark:border-outline-gray-2 dark:hover:bg-surface-gray-2"
      @click="open(mail)"
    >
      <Avatar
        size="xl"
        shape="circle"
        :image="mail.avatar"
        :label="mail.sender"
      />

      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <!-- sender · date -->
        <div class="flex h-4 items-center justify-between gap-1">
          <div class="flex min-w-0 items-center gap-0.5">
            <span
              v-if="mail.unread"
              class="flex size-4 shrink-0 items-center justify-center"
            >
              <span class="size-1.5 rounded-full bg-surface-blue-7" />
              <span class="sr-only">Unread</span>
            </span>
            <span class="truncate text-base-medium text-ink-gray-7">
              {{ mail.sender }}
            </span>
          </div>
          <span class="shrink-0 text-sm text-ink-gray-5">{{ mail.date }}</span>
        </div>

        <!-- subject + star · 2px · preview -->
        <div class="flex flex-col gap-0.5">
          <div class="flex items-center gap-0.5">
            <span class="min-w-0 flex-1 truncate text-p-base text-ink-gray-6">
              {{ mail.subject }}
            </span>
            <Button
              variant="ghost"
              size="xs"
              class="-my-1 !size-5 shrink-0"
              :label="mail.starred ? 'Unstar' : 'Star'"
              :aria-pressed="mail.starred"
              @click.stop="mail.starred = !mail.starred"
            >
              <template #icon>
                <!-- lucide star; filled amber once starred -->
              <svg
                viewBox="0 0 24 24"
                class="size-4"
                :class="mail.starred ? 'text-ink-amber-4' : 'text-ink-gray-4'"
                :fill="mail.starred ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
              </svg>
              </template>
            </Button>
          </div>
          <p class="truncate text-p-base text-ink-gray-6">
            {{ mail.preview }}
          </p>
        </div>
      </div>
    </li>
  </ul>
</template>
