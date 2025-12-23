<template>
  <BaseBlock title="Else" icon="condition">
    <template #action>
      <Dropdown :options="options" placement="right">
        <Button variant="ghost" icon="more-horizontal" />
      </Dropdown>
    </template>
  </BaseBlock>
</template>

<script setup lang="ts">
import Dropdown from '../../src/components/Dropdown/Dropdown.vue'
import BaseBlock from './BaseBlock.vue'
import type { DropdownOption } from './types'

defineProps<{
  options: DropdownOption[]
}>()
</script>

<style scoped></style>
