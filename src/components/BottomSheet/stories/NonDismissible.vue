<script setup lang="ts">
import { ref } from 'vue'
import { BottomSheet, Button } from 'frappe-ui'

const open = ref(false)
</script>

<template>
  <Button label="Close editor" @click="open = true" />

  <BottomSheet v-model:open="open" title="Discard draft?" :dismissible="false">
    <div class="p-4 pb-8">
      <p class="text-p-base text-ink-gray-7">
        Your reply to Jane has not been sent. Discard it, or keep editing to
        send it later.
      </p>
      <div class="mt-4 flex gap-2">
        <Button class="flex-1" label="Keep editing" @click="open = false" />
        <Button
          class="flex-1"
          variant="solid"
          theme="red"
          label="Discard"
          @click="open = false"
        />
      </div>
    </div>
  </BottomSheet>
</template>
