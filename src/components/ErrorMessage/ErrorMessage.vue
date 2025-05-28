<template>
  <div
    v-if="message"
    class="whitespace-pre-line text-sm text-ink-red-4"
    role="alert"
    v-html="errorMessage"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ErrorMessageProps } from './types'

const props = defineProps<ErrorMessageProps>()

const errorMessage = computed(() => {
  if (!props.message) return ''
  if (props.message instanceof Error) {
    return (props.message as any).messages || props.message.message
  }
  return props.message
})
</script>
