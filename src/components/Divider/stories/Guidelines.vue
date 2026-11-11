<script setup lang="ts">
import { Divider } from 'frappe-ui'

const meetings = [
  { title: 'Team Sync', when: 'May 20 · Daniel Chen' },
  { title: 'Design Review', when: 'May 21 · Sarah Lee' },
  { title: 'Standup', when: 'May 22 · Alex Kim' },
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
  </div>
</template>
