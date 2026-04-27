<script setup lang="ts">
import { ref } from 'vue'
import { Slider } from 'frappe-ui'

const value = ref([25])
</script>

<template>
  <Slider v-model="value" label="Volume" />
</template>
