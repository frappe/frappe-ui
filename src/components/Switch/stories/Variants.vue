<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from 'frappe-ui'

const a = ref(false)
const b = ref(true)
</script>

<template>
  <div class="flex flex-col gap-2">
    <Switch v-model="a" label="Default" />
    <Switch v-model="b" variant="padded" label="Padded" />
  </div>
</template>
