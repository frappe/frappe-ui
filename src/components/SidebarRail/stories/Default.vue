<script setup lang="ts">
import { ref } from 'vue'
import { SidebarRail, SidebarRailItem, Avatar } from 'frappe-ui'

const active = ref('design')

function logo(seed: string) {
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}`
}

const communities = [
  { id: 'design', label: 'Design', badge: 0, image: logo('design') },
  {
    id: 'engineering',
    label: 'Engineering',
    badge: 3,
    image: logo('engineering'),
  },
  { id: 'marketing', label: 'Marketing', badge: 0, image: logo('marketing') },
  { id: 'sales', label: 'Sales', badge: 0, image: null },
]
</script>

<template>
  <div
    class="flex h-[420px] w-fit overflow-hidden rounded-5 border bg-surface-base"
  >
    <SidebarRail>
      <SidebarRailItem
        label="Home"
        variant="ghost"
        icon="lucide-house"
        @click="active = ''"
      />

      <!-- The consumer lays the middle out; flex-1 pushes the rest to the bottom. -->
      <div class="flex w-full flex-1 flex-col items-center gap-3 pt-3">
        <SidebarRailItem
          v-for="c in communities"
          :key="c.id"
          :label="c.label"
          :active="active === c.id"
          :badge="c.badge"
          badge-style="dot"
          :bare="Boolean(c.image)"
          @click="active = c.id"
        >
          <!-- An image brings its own surface, so the item is `bare`. Initials
               sit on the item's own fill. -->
          <img
            v-if="c.image"
            :src="c.image"
            alt=""
            class="size-7 rounded-[7px]"
          />
          <span v-else class="text-2xs-medium uppercase text-ink-gray-5">
            {{ c.label.slice(0, 2) }}
          </span>
        </SidebarRailItem>
      </div>

      <SidebarRailItem label="Search" variant="ghost" icon="lucide-search" />
      <SidebarRailItem
        label="Notifications"
        variant="ghost"
        icon="lucide-bell"
        :badge="5"
      />
      <SidebarRailItem label="You" variant="ghost" class="mt-1">
        <Avatar
          label="Jane Doe"
          image="https://api.dicebear.com/9.x/notionists/svg?seed=Jane&backgroundColor=c0aede"
          size="md"
        />
      </SidebarRailItem>
    </SidebarRail>
  </div>
</template>
