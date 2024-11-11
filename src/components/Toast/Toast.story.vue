<script setup lang="ts">
import { Toaster, toast } from './index.ts'

function showToast() {
  toast()
}
</script>

<template>
  <Story :layout="{ type: 'grid', width: 300 }">
    <Variant title="Toast">
      <button @click="showToast">show toast</button>

      <Toaster />
    </Variant>
  </Story>
</template>
