<template>
  <Dropdown :options="options" placement="right">
    <Button
      variant="ghost"
      icon="more-horizontal"
      :class="'opacity-0 group-hover:opacity-100 transition-all group-focus-within:opacity-100'"
    />
  </Dropdown>
</template>

<script setup lang="ts">
import Button from '../../src/components/Button/Button.vue'
import Dropdown from '../../src/components/Dropdown/Dropdown.vue'
import type { DropdownOption } from './types'
defineProps<{
  options: DropdownOption[]
}>()
</script>

<style scoped></style>
