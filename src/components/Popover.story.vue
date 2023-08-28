<script setup lang="ts">
import Popover from './Popover.vue'
import Button from './Button.vue'
</script>
<template>
  <Story :layout="{ type: 'grid' }">
    <Variant title="trigger: click">
      <Popover>
        <template #target="{ togglePopover }">
          <Button @click="togglePopover()">Click me</Button>
        </template>
        <template #body-main>
          <div class="p-2">Popover content</div>
        </template>
      </Popover>
    </Variant>

    <Variant title="trigger: hover">
      <Popover trigger="hover" hoverDelay="0.5">
        <template #target>
          <Button>Hover me</Button>
        </template>
        <template #body-main>
          <div class="p-2">Popover content</div>
        </template>
      </Popover>
    </Variant>
  </Story>
</template>
