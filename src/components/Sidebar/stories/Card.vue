<script setup lang="ts">
import { ref } from 'vue'
import { SidebarCard } from 'frappe-ui'

// Cards as they sit in a sidebar footer: on the sidebar's gray surface,
// at sidebar width. The parent owns hiding — dismiss just flips a flag.
const showFeatureCard = ref(true)
</script>

<template>
  <div class="flex w-full flex-wrap items-start gap-4">
    <div class="w-52 rounded-md bg-surface-gray-1 p-3">
      <SidebarCard
        title="Your trial ends soon!"
        description="Upgrade to keep enjoying features."
        :action="{ label: 'Update now' }"
      />
    </div>

    <div class="w-52 rounded-md bg-surface-gray-1 p-3">
      <SidebarCard
        v-if="showFeatureCard"
        theme="blue"
        dismissible
        title="New feature available"
        description="Discover the new board view for your deals."
        :action="{ label: 'Explore now' }"
        @dismiss="showFeatureCard = false"
      />
      <button
        v-else
        class="text-sm text-ink-gray-5 underline"
        @click="showFeatureCard = true"
      >
        Bring the card back
      </button>
    </div>

    <div class="w-52 rounded-md bg-surface-gray-1 p-3">
      <SidebarCard
        theme="amber"
        title="Storage is almost full"
        description="Free up space or upgrade your plan."
        :action="{ label: 'Manage storage' }"
      />
    </div>
  </div>
</template>
