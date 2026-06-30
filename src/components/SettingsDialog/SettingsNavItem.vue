<template>
  <!--
    role="tab". Selected state comes from reka-ui (data-state="active") so the
    consumer only supplies `:value` — no `active` prop to keep in sync. The gray
    keyboard focus ring is applied globally via :focus-visible.
  -->
  <TabsTrigger
    :value="value"
    class="flex h-7 w-full items-center gap-2 rounded px-2 text-left text-base text-ink-gray-7 data-[state=active]:bg-surface-elevation-3 data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-surface-gray-2"
  >
    <slot name="prefix" />
    <span class="min-w-0 flex-1 truncate"><slot /></span>
    <slot name="suffix" />
  </TabsTrigger>
</template>

<script setup lang="ts">
import { TabsTrigger } from 'reka-ui'

defineProps<{
  /** Unique tab id — must match the SettingsPanel `value` it controls. */
  value: string | number
}>()

defineSlots<{
  /** Item label. */
  default?: () => any
  /** Leading icon or avatar. */
  prefix?: () => any
  /** Trailing badge / count. */
  suffix?: () => any
}>()
</script>
