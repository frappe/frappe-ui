<script setup lang="ts">
import Col1 from './col1.vue'
import Col2 from './col2.vue'
import Col3 from './col3.vue'
import Col4 from './col4.vue'
</script>

<template>
  <div class="overflow-x-auto">
    <main
      class="min-w-[1100px] px-5 pb-20 [&_label]:mb-2 [&_label]:text-base [&_label]:text-ink-gray-9"
      style="columns: 4; column-gap: 1.25rem"
    >
      <Col1 />
      <Col2 />
      <Col3 />
      <Col4 />
    </main>
  </div>
</template>
