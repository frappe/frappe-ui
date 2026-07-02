<script setup lang="ts">
import { ref } from 'vue'
import {
  Sidebar,
  SidebarItem,
  SidebarLabel,
  SidebarCollapseToggle,
} from 'frappe-ui'

const collapsed = ref(true)
const active = ref('inbox')
const items = [
  { id: 'inbox', label: 'Inbox', icon: 'lucide-inbox' },
  { id: 'starred', label: 'Starred', icon: 'lucide-star' },
  { id: 'sent', label: 'Sent', icon: 'lucide-send' },
]
</script>

<template>
  <div class="flex h-[360px] w-fit overflow-hidden rounded-md border">
    <!-- v-model:collapsed is app state; SidebarCollapseToggle flips it. -->
    <Sidebar v-model:collapsed="collapsed">
      <div class="flex-1 overflow-y-auto px-2 pt-2">
        <SidebarLabel divider>Mail</SidebarLabel>
        <SidebarItem
          v-for="item in items"
          :key="item.id"
          :icon="item.icon"
          :label="item.label"
          :active="active === item.id"
          @click="active = item.id"
        />
      </div>

      <div class="mt-auto px-2 pb-2">
        <SidebarCollapseToggle />
      </div>
    </Sidebar>
  </div>
</template>
