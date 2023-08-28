<script setup lang="ts">
import Spinner from './Spinner.vue'
</script>

<template>
  <Story :layout="{ type: 'grid', width: 300 }">
    <Variant title="class='w-4'">
      <Spinner class="w-4" />
    </Variant>
    <Variant title="class='w-8'">
      <Spinner class="w-8" />
    </Variant>
  </Story>
</template>
