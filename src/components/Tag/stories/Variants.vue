<script setup>
import { Tag } from 'frappe-ui'

const variants = ['solid', 'subtle', 'outline', 'ghost']
const themes = ['gray', 'blue', 'green', 'amber', 'red', 'violet']
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-for="variant in variants"
      :key="variant"
      class="flex flex-wrap gap-2"
    >
      <Tag
        v-for="theme in themes"
        :key="theme"
        :variant="variant"
        :theme="theme"
        :label="theme"
        dismissible
      />
    </div>
  </div>
</template>
