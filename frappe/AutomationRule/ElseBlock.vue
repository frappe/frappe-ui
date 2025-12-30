<template>
  <BaseBlock title="Else" icon="condition" class="group">
    <template #action>
      <DropdownOptions :options="options" />
    </template>
  </BaseBlock>
</template>

<script setup lang="ts">
import BaseBlock from './BaseBlock.vue'
import DropdownOptions from './DropdownOptions.vue'
import type { DropdownOption } from './types'

defineProps<{
  options: DropdownOption[]
}>()
</script>

<style scoped></style>
