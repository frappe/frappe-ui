<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from 'frappe-ui'

const value = ref(false)
</script>

<template>
  <Checkbox v-model="value" label="Accept terms and conditions" />
</template>
