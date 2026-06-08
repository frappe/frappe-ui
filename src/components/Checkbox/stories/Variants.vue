<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from 'frappe-ui'

const a = ref(false)
const b = ref(true)
</script>

<template>
  <div class="flex flex-col items-start gap-2">
    <div class="pl-1.5"><Checkbox v-model="a" label="Default" /></div>
    <Checkbox v-model="b" variant="padded" label="Padded" />
  </div>
</template>
