<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from 'frappe-ui'

const enabled = ref(false)
</script>

<template>
  <Switch v-model="enabled" label="Enable notifications" />
</template>
