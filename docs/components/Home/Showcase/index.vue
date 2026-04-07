<script setup lang="ts">
import Col1 from './col1.vue'
import Col2 from './col2.vue'
import Col3 from './col3.vue'
import Col4 from './col4.vue'
</script>

<template>
  <main
    class="mx-auto mb-20 grid max-w-[1440px] gap-5 p-5 pt-0 *:w-full lg:grid-cols-3 xl:grid-cols-4"
  >
    <Col1 />
    <Col2 />
    <Col3 />
    <Col4 />
  </main>
</template>
