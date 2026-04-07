<script setup lang="ts">
import { Button, Dialog } from 'frappe-ui'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <Button @click="open = true">Show Modal Dialog</Button>

  <Dialog
    v-model="open"
    :disable-outside-click-to-close="true"
    :options="{
      title: 'Modal Dialog',
      message: 'This dialog cannot be closed by clicking outside.',
      actions: [{ label: 'Close', variant: 'solid' }],
    }"
  />
</template>
