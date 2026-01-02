<script setup lang="ts">
import Col1 from "./col1.vue";
import Col2 from "./col2.vue";
import Col3 from "./col3.vue";
import Col4 from "./col4.vue";
</script>

<template>
  <section
    class="grid lg:grid-cols-3 xl:grid-cols-4 ap-5 p-5 mt-10 gap-5 mx-auto *:w-full max-w-[1440px]"
  >
    <Col1 />
    <Col2 />
    <Col4 />
    <Col3 />
  </section>
</template>
