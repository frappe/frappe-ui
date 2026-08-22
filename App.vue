<script setup>
import { useRoute } from 'vue-router'
import { FrappeUIProvider } from 'frappe-ui'

const route = useRoute()
</script>

<template>
  <FrappeUIProvider>
    <RouterView />
  </FrappeUIProvider>
  <!-- Way back to the index from any demo. Hidden on the index itself. -->
  <RouterLink
    v-if="route.path !== '/'"
    to="/"
    class="fixed bottom-4 left-4 flex size-8 items-center justify-center rounded-md border border-outline-gray-2 bg-surface-white text-ink-gray-6 shadow-sm hover:bg-surface-gray-2"
    aria-label="Back to demos"
  >
    <span class="lucide-arrow-left size-4" aria-hidden="true" />
  </RouterLink>
</template>
