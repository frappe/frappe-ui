<script setup lang="ts">
import Popover from './Popover.vue'
import { Button } from '../Button'
</script>

<template>
  <div class="space-y-4">
    <div>
      <Popover>
        <template #target="{ togglePopover }">
          <Button @click="togglePopover()">Click me</Button>
        </template>
        <template #body-main>
          <div class="p-2 text-ink-gray-9">Popover content</div>
        </template>
      </Popover>
    </div>

    <div>
      <Popover trigger="hover" :hover-delay="0.5">
        <template #target>
          <Button>Hover me</Button>
        </template>
        <template #body-main>
          <div class="p-2 text-ink-gray-9">Popover content</div>
        </template>
      </Popover>
    </div>
  </div>
</template>
