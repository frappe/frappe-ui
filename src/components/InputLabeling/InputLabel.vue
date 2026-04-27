<template>
  <label v-if="hasLabel" :id="id" :for="forId" data-slot="label" class="block">
    <slot v-if="slots.default" :required="!!required" />
    <template v-else>
      {{ label }}
      <RequiredIndicator :required="required" />
    </template>
  </label>
</template>
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import RequiredIndicator from './RequiredIndicator.vue'

const props = defineProps<{
  id: string
  forId?: string
  label?: string
  required?: boolean
}>()

const slots = useSlots()

const hasLabel = computed(() => Boolean(props.label || slots.default))
</script>
