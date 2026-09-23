<script setup lang="ts">
import { DesktopShell, FrappeUIProvider } from 'frappe-ui'
</script>

<template>
  <FrappeUIProvider>
    <div class="h-screen bg-surface-base text-ink-gray-8">
      <DesktopShell>
        <RouterView />
      </DesktopShell>
    </div>
  </FrappeUIProvider>
</template>
