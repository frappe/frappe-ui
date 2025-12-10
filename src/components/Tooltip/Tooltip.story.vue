<script setup lang="ts">
import { ref } from 'vue'
import Tooltip from './Tooltip.vue'
import { Button } from '../Button'

const placement = ref('top')
const disabled = ref(true)
</script>

<template>
  <div class="space-y-4 max-w-xs">
    <div class="space-y-1">
      <label>With Text Prop</label>
      <Tooltip
        text="This action cannot be undone"
        :hover-delay="1"
        :placement="placement"
      >
        <Button theme="red">Delete</Button>
      </Tooltip>
    </div>

    <div class="space-y-1">
      <label>Disabled</label>
      <Tooltip
        text="Disabled tooltip"
        :disabled="disabled"
        :hover-delay="1"
        :placement="placement"
      >
        <Button theme="red">Delete</Button>
      </Tooltip>
    </div>

    <div class="space-y-1">
      <label>With Slot</label>
      <Tooltip arrow-class="fill-surface-white" :placement="placement">
        <template #body>
          <div
            class="min-w-[6rem] rounded bg-surface-white px-2 py-1 text-xs text-ink-gray-9 shadow-xl"
          >
            Test
          </div>
        </template>
        <Button theme="red">Delete</Button>
      </Tooltip>
    </div>

    <div class="space-y-1">
      <label>Placement</label>
      <select v-model="placement" class="border rounded p-1">
        <option value="top">Top</option>
        <option value="right">Right</option>
        <option value="bottom">Bottom</option>
        <option value="left">Left</option>
      </select>
    </div>
  </div>
</template>
