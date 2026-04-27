<script setup lang="ts">
import { ref } from 'vue'
import { Slider } from 'frappe-ui'

const value = ref([25])
</script>

<template>
  <div class="grid place-content-center w-full gap-5">
    <Slider v-model="value" />
  </div>
</template>
