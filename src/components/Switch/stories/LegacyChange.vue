<script setup lang="ts">
import { Switch } from 'frappe-ui'

function onChange(value: boolean) {
  console.log('Switch changed:', value)
}
</script>

<!--
  The `change` emit is deprecated. Use `v-model` / `update:modelValue`
  instead. Toggling this switch will fire a one-time
  `[frappe-ui] Switch.change is deprecated` warning in the console.
-->

<template>
  <Switch label="Toggle me" @change="onChange" />
</template>
