<script setup lang="ts">
import { ref } from 'vue'
import { Slider } from 'frappe-ui'

const value = ref([25])
</script>

<template>
  <div class="w-full max-w-md">
    <Slider v-model="value" />
  </div>
</template>
