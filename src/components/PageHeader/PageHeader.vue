<template>
  <PageHeaderBase
    class="z-10 flex min-h-12 flex-col justify-center border-b bg-surface-base px-3 sm:px-5"
  >
    <div class="flex items-center justify-between">
      <slot />
    </div>
  </PageHeaderBase>
</template>

<script setup lang="ts">
import PageHeaderBase from './PageHeaderBase.vue'
</script>
