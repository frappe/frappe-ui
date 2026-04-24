<script setup lang="ts">
import { computed, ref } from 'vue'
import { Dropdown } from 'frappe-ui'

const notifications = ref(true)
const readReceipts = ref(true)
const focusMode = ref(false)
const autoSave = ref(true)

const preferences = computed(() => [
  {
    label: 'Notifications',
    icon: 'lucide-bell',
    switch: true,
    switchValue: notifications.value,
    onClick: (value: boolean) => (notifications.value = value),
  },
  {
    label: 'Read receipts',
    icon: 'lucide-eye',
    switch: true,
    switchValue: readReceipts.value,
    onClick: (value: boolean) => (readReceipts.value = value),
  },
  {
    label: 'Focus mode',
    icon: 'lucide-zap',
    switch: true,
    switchValue: focusMode.value,
    onClick: (value: boolean) => (focusMode.value = value),
  },
  {
    label: 'Auto-save drafts',
    icon: 'lucide-save',
    switch: true,
    switchValue: autoSave.value,
    onClick: (value: boolean) => (autoSave.value = value),
  },
])
</script>

<template>
  <Dropdown :options="preferences" :button="{ label: 'Preferences' }" />
</template>
