<template>
  <Story title="Divider Examples" :layout="{ width: 480 }">
    <Variant title="Default">
      <div class="space-y-3">
        <p class="text-base text-ink-gray-7">Section above</p>
        <Divider />
        <p class="text-base text-ink-gray-7">Section below</p>
      </div>
    </Variant>

    <Variant title="In a flex row">
      <div class="flex h-16 items-center gap-4">
        <span class="text-base text-ink-gray-7">Left</span>
        <Divider orientation="vertical" flex-item />
        <span class="text-base text-ink-gray-7">Right</span>
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { Divider } from 'frappe-ui'
</script>
