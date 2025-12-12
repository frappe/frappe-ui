<script setup lang="ts">
import Popover from "./Popover.vue";
import { Button } from "../Button";
import Story from "../Story.vue";
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <Story title="Trigger: Click">
      <Popover>
        <template #target="{ togglePopover }">
          <Button @click="togglePopover()">Click me</Button>
        </template>
        <template #body-main>
          <div class="p-2 text-ink-gray-9">Popover content</div>
        </template>
      </Popover>
    </Story>

    <Story title="Trigger: Hover">
      <Popover trigger="hover" :hover-delay="0.5">
        <template #target>
          <Button>Hover me</Button>
        </template>
        <template #body-main>
          <div class="p-2 text-ink-gray-9">Popover content</div>
        </template>
      </Popover>
    </Story>
  </div>
</template>
