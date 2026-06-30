<template>
  <!-- role="tablist" + vertical roving focus, applied to the styled sidebar. -->
  <TabsList as-child>
    <div
      class="flex max-h-[38vh] w-full shrink-0 flex-col overflow-y-auto border-b border-outline-gray-1 bg-surface-sidebar p-2 sm:max-h-none sm:w-[220px] sm:border-b-0 sm:border-r"
    >
      <div class="space-y-4">
        <slot />
      </div>
    </div>
  </TabsList>
</template>

<script setup lang="ts">
import { TabsList } from 'reka-ui'
</script>
