<script setup lang="ts">
import { computed, ref } from 'vue'
import { Dropdown } from 'frappe-ui'
import LucideBell from '~icons/lucide/bell'
import LucideEye from '~icons/lucide/eye'
import LucideZap from '~icons/lucide/zap'
import LucideSave from '~icons/lucide/save'

const notifications = ref(true)
const readReceipts = ref(true)
const focusMode = ref(false)
const autoSave = ref(true)

const preferences = computed(() => [
  {
    label: 'Notifications',
    icon: LucideBell,
    switch: true,
    switchValue: notifications.value,
    onClick: (value: boolean) => (notifications.value = value),
  },
  {
    label: 'Read receipts',
    icon: LucideEye,
    switch: true,
    switchValue: readReceipts.value,
    onClick: (value: boolean) => (readReceipts.value = value),
  },
  {
    label: 'Focus mode',
    icon: LucideZap,
    switch: true,
    switchValue: focusMode.value,
    onClick: (value: boolean) => (focusMode.value = value),
  },
  {
    label: 'Auto-save drafts',
    icon: LucideSave,
    switch: true,
    switchValue: autoSave.value,
    onClick: (value: boolean) => (autoSave.value = value),
  },
])
</script>

<template>
  <Dropdown :options="preferences" :button="{ label: 'Preferences' }" />
</template>
