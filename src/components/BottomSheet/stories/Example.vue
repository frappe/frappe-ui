<script setup lang="ts">
import { ref } from 'vue'
import { BottomSheet, Button } from 'frappe-ui'

const open = ref(false)
</script>

<template>
  <Button label="Open sheet" @click="open = true" />

  <BottomSheet v-model:open="open">
    <div class="p-4 pb-8 text-p-base text-ink-gray-7">
      Drag the handle down, tap outside, or press
      <kbd>Esc</kbd> to dismiss.
    </div>
  </BottomSheet>
</template>
