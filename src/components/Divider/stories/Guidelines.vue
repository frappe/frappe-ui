<script setup lang="ts">
import { Divider } from 'frappe-ui'

const meetings = [
  { title: 'Team Sync', when: 'May 20 · Daniel Chen' },
  { title: 'Design Review', when: 'May 21 · Sarah Lee' },
  { title: 'Standup', when: 'May 22 · Alex Kim' },
]

const settings = [
  { label: 'Email', hint: 'jaya@timeless.co' },
  { label: 'Password', hint: 'Change your account password' },
  { label: '2FA', hint: 'Manage two-factor authentication' },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- 1. No divider after the last item -->
    <Guideline
      layout="stack"
      caption="Don't add a divider after the last item in a list."
    >
      <template #do>
        <div class="w-72">
          <template v-for="(m, i) in meetings" :key="m.title">
            <div class="py-2">
              <p class="text-base font-medium text-ink-gray-8">{{ m.title }}</p>
              <p class="text-sm text-ink-gray-5">{{ m.when }}</p>
            </div>
            <Divider v-if="i < meetings.length - 1" />
          </template>
        </div>
      </template>
      <template #dont>
        <div class="w-72">
          <template v-for="m in meetings" :key="m.title">
            <div class="py-2">
              <p class="text-base font-medium text-ink-gray-8">{{ m.title }}</p>
              <p class="text-sm text-ink-gray-5">{{ m.when }}</p>
            </div>
            <Divider />
          </template>
        </div>
      </template>
    </Guideline>

    <!-- 2. Let spacing separate when it can -->
    <Guideline
      layout="stack"
      caption="Don't use dividers where spacing alone separates content clearly."
    >
      <template #do>
        <div class="flex w-80 flex-col gap-4">
          <div v-for="s in settings" :key="s.label">
            <p class="text-base font-medium text-ink-gray-8">{{ s.label }}</p>
            <p class="text-sm text-ink-gray-5">{{ s.hint }}</p>
          </div>
        </div>
      </template>
      <template #dont>
        <div class="w-80">
          <template v-for="(s, i) in settings" :key="s.label">
            <div class="py-2">
              <p class="text-base font-medium text-ink-gray-8">{{ s.label }}</p>
              <p class="text-sm text-ink-gray-5">{{ s.hint }}</p>
            </div>
            <Divider v-if="i < settings.length - 1" />
          </template>
        </div>
      </template>
    </Guideline>
  </div>
</template>
