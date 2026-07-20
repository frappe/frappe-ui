<template>
  <div
    v-if="message"
    class="whitespace-pre-line text-sm text-ink-red-8"
    role="alert"
    v-html="errorMessage"
  ></div>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify'
import { computed } from 'vue'
import type { ErrorMessageProps } from './types'

const props = defineProps<ErrorMessageProps>()

const errorMessage = computed(() => {
  if (!props.message) return ''

  const message =
    props.message instanceof Error
      ? (props.message as Error & { messages?: string }).messages ||
        props.message.message
      : props.message

  return DOMPurify.sanitize(message)
})
</script>
