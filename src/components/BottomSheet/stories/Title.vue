<script setup lang="ts">
import { ref } from 'vue'
import { BottomSheet, Button } from 'frappe-ui'

const open = ref(false)
const options = ['Rename', 'Duplicate', 'Move to folder', 'Delete']
</script>

<template>
  <Button label="Open with a title" @click="open = true" />

  <BottomSheet v-model:open="open" title="Actions">
    <div class="flex flex-col p-2 pb-8">
      <button
        v-for="option in options"
        :key="option"
        class="rounded-4 px-3 py-2.5 text-start text-p-base text-ink-gray-8 hover:bg-surface-gray-2"
        @click="open = false"
      >
        {{ option }}
      </button>
    </div>
  </BottomSheet>
</template>
