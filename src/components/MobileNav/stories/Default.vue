<script setup lang="ts">
import { ref } from 'vue'
import { MobileNav, MobileNavItem, Avatar } from 'frappe-ui'

const tab = ref('home')
</script>

<template>
  <div
    class="mx-auto w-[360px] overflow-hidden border-b border-l border-r bg-surface-white"
  >
    <MobileNav>
      <MobileNavItem
        label="Home"
        icon="lucide-house"
        :active="tab === 'home'"
        @click="tab = 'home'"
      />
      <MobileNavItem
        label="Notifications"
        icon="lucide-bell"
        :active="tab === 'notifications'"
        @click="tab = 'notifications'"
      />
      <MobileNavItem
        label="Search"
        icon="lucide-search"
        :active="tab === 'search'"
        @click="tab = 'search'"
      />
      <MobileNavItem label="You" :active="tab === 'you'" @click="tab = 'you'">
        <template #default="{ active }">
          <Avatar
            label="Jane Doe"
            size="md"
            :class="active ? 'ring-2 ring-outline-gray-4' : ''"
          />
        </template>
      </MobileNavItem>
    </MobileNav>
  </div>
</template>
