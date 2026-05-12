<script setup lang="ts">
// Adapted from gameplan/Settings/SettingsDialog.vue — a full-canvas
// dialog with a left nav and a content pane. Uses `bare: true` to drop
// all auto-chrome (no padded card, no auto-header, no auto-actions) and
// `Dialog.Title` for an accessible heading without visual chrome.
import { ref } from 'vue'
import { Button, Dialog } from 'frappe-ui'

const open = ref(false)
const tabs = [
  { key: 'general', label: 'General', icon: 'lucide-settings' },
  { key: 'profile', label: 'Profile', icon: 'lucide-user' },
  { key: 'notifications', label: 'Notifications', icon: 'lucide-bell' },
  { key: 'integrations', label: 'Integrations', icon: 'lucide-plug' },
  { key: 'billing', label: 'Billing', icon: 'lucide-credit-card' },
]
const activeTab = ref(tabs[0].key)
</script>

<template>
  <Button @click="open = true">Open settings…</Button>

  <Dialog v-model:open="open" size="5xl" bare>
    <div class="flex" :style="{ height: 'calc(100vh - 8rem)' }">
      <aside
        class="flex w-56 shrink-0 flex-col gap-1 border-r border-outline-gray-modals bg-surface-menu-bar p-2"
      >
        <Dialog.Title as-child>
          <h1 class="px-2 pb-2 pt-1 text-lg font-semibold text-ink-gray-9">
            Settings
          </h1>
        </Dialog.Title>
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="flex items-center gap-2 rounded px-2 py-1.5 text-left text-base"
          :class="
            tab.key === activeTab
              ? 'bg-surface-gray-3 text-ink-gray-9'
              : 'text-ink-gray-7 hover:bg-surface-gray-2'
          "
          @click="activeTab = tab.key"
        >
          <span :class="[tab.icon, 'size-4']" aria-hidden="true" />
          {{ tab.label }}
        </button>
      </aside>

      <section class="flex flex-1 flex-col overflow-y-auto px-16 pt-10">
        <h2 class="text-2xl font-semibold capitalize text-ink-gray-9">
          {{ activeTab }}
        </h2>
        <p class="mt-2 text-p-base text-ink-gray-6">
          Configure the <strong>{{ activeTab }}</strong> tab.
        </p>
        <div class="mt-6 flex justify-end">
          <Button variant="ghost" @click="open = false">Close</Button>
        </div>
      </section>
    </div>
  </Dialog>
</template>
