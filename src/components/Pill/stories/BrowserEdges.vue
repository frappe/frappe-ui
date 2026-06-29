<script setup>
import { Pill } from 'frappe-ui'
</script>

<template>
  <div class="flex flex-col gap-6 p-2">
    <div class="flex items-end gap-1 border-b border-outline-gray-2">
      <Pill variant="browser-tab" browser-tab-base="default" label="Overview" />
      <Pill
        variant="browser-tab"
        browser-tab-base="default"
        label="Activity"
        active
      />
      <Pill variant="browser-tab" browser-tab-base="default" label="Settings" />
    </div>

    <div class="flex gap-8">
      <div class="flex flex-col gap-1 border-r border-outline-gray-2 pr-0">
        <Pill variant="browser-tab" label="Overview" />
        <Pill
          variant="browser-tab"
          browser-tab-base="left"
          label="Activity"
          active
        />
        <Pill variant="browser-tab" label="Settings" />
      </div>

      <div class="flex flex-col gap-1 border-l border-outline-gray-2 pl-0">
        <Pill variant="browser-tab" label="Overview" />
        <Pill
          variant="browser-tab"
          browser-tab-base="right"
          label="Activity"
          active
        />
        <Pill variant="browser-tab" label="Settings" />
      </div>
    </div>
  </div>
</template>
