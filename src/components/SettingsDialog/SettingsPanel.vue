<template>
  <!--
    One tab's content column. Compose a SettingsHeader (fixed) and a
    SettingsBody (scrolls) inside so the header stays pinned while the body
    scrolls — search inputs, filters, and table column-headers stay visible.
  -->
  <div class="flex min-h-0 flex-1 flex-col">
    <slot />
  </div>
</template>
