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

const escapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const errorMessage = computed(() => {
  if (!props.message) return ''

  const message =
    props.message instanceof Error
      ? (props.message as Error & { messages?: string }).messages ||
        props.message.message
      : props.message

  // DOMPurify needs a real DOM, so `sanitize` doesn't exist during SSR
  // (`isSupported` is false). Escape instead — a server-rendered string can't
  // execute anything anyway, and the client re-sanitizes on hydration.
  if (!DOMPurify.isSupported) {
    return message.replace(/[&<>"']/g, (char) => escapeMap[char])
  }

  return DOMPurify.sanitize(message)
})
</script>
