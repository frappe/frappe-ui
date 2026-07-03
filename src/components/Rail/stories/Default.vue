<script setup lang="ts">
import { ref } from 'vue'
import { Rail, RailItem, Avatar } from 'frappe-ui'

const active = ref('design')
const communities = [
  { id: 'design', label: 'Design', initials: 'DE', badge: 0 },
  { id: 'engineering', label: 'Engineering', initials: 'EN', badge: 3 },
  { id: 'marketing', label: 'Marketing', initials: 'MK', badge: 0 },
]
</script>

<template>
  <div class="flex h-[420px] overflow-hidden rounded-md border bg-surface-base">
    <Rail>
      <RailItem label="Home" variant="ghost" icon="lucide-house" @click="active = ''" />

      <!-- The consumer lays the middle out; flex-1 pushes the rest to the bottom. -->
      <div class="flex w-full flex-1 flex-col items-center gap-3 pt-3">
        <RailItem
          v-for="c in communities"
          :key="c.id"
          :label="c.label"
          :active="active === c.id"
          :badge="c.badge"
          badge-style="dot"
          @click="active = c.id"
        >
          <span class="text-2xs-medium uppercase text-ink-gray-5">{{ c.initials }}</span>
        </RailItem>
      </div>

      <RailItem label="Search" variant="ghost" icon="lucide-search" />
      <RailItem label="Notifications" variant="ghost" icon="lucide-bell" :badge="5" />
      <RailItem label="You" variant="ghost" class="mt-1">
        <Avatar label="Jane Doe" size="md" />
      </RailItem>
    </Rail>

    <div class="flex flex-1 items-center justify-center text-ink-gray-5">
      Content
    </div>
  </div>
</template>
