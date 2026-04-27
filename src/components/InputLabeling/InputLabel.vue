<template>
  <label
    v-if="label || $slots.default"
    :id="id"
    :for="forId"
    data-slot="label"
    class="block"
  >
    <slot v-if="$slots.default" :required="!!required" />
    <template v-else>
      {{ label }}
      <RequiredIndicator :required="required" />
    </template>
  </label>
</template>
<script setup lang="ts">
import RequiredIndicator from './RequiredIndicator.vue'

defineProps<{
  id: string
  forId?: string
  label?: string
  required?: boolean
}>()
</script>
