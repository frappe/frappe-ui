<script setup lang="ts">
</script>

<template>
  <section class="m-w-7xl mx-ato px-6 py-12">
    <div class="grid w-1/6">
      <span
        v-for="(gray, index) in grays"
        :key="index"
        :class="grays[index]"
        class="flex justify-center h-13 p-3"
      />
    </div>
  </section>
</template>
