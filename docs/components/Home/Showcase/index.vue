<script setup lang="ts">
import Col1 from "./col1.vue";
import Col2 from "./col2.vue";
import Col3 from "./col3.vue";
import Col4 from "./col4.vue";
</script>

<template>
  <main
    class="grid lg:grid-cols-3 xl:grid-cols-4 p-5 pt-0 mb-20 gap-5 mx-auto *:w-full max-w-[1440px]"
  >
    <Col1 />
    <Col2 />
    <Col3 />
    <Col4 />
  </main>
</template>
