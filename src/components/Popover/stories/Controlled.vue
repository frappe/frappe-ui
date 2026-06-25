<script setup lang="ts">
import { ref } from 'vue'
import { Button, Popover } from 'frappe-ui'

const open = ref(false)
</script>

<template>
  <div class="flex items-center gap-2">
    <Button @click="open = !open">Toggle from outside</Button>
    <Popover v-model:open="open">
      <template #trigger>
        <Button>Trigger</Button>
      </template>
      <template #default>
        <div class="p-3 text-p-sm text-ink-gray-7">
          Open state is controlled via <code>v-model:open</code>.
        </div>
      </template>
    </Popover>
  </div>
</template>
