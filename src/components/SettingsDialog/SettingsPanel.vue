<template>
  <!--
    One tab's content column (role="tabpanel"). Compose a SettingsHeader (fixed)
    and a SettingsBody (scrolls) inside so the header stays pinned while the body
    scrolls — search inputs, filters, and table column-headers stay visible.

    `data-[state=inactive]:hidden` is required: reka-ui hides inactive panels via
    the `hidden` attribute, but our `flex` utility has equal specificity and would
    otherwise win and reveal them.
  -->
  <TabsContent
    :value="value"
    class="flex min-h-0 flex-1 flex-col focus-visible:outline-none data-[state=inactive]:hidden"
  >
    <slot />
  </TabsContent>
</template>

<script setup lang="ts">
import { TabsContent } from 'reka-ui'

defineProps<{
  /** Unique tab id — must match the SettingsNavItem `value` that controls it. */
  value: string | number
}>()
</script>
