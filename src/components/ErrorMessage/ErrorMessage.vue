<template>
  <div
    v-if="lines.length"
    class="whitespace-pre-line text-sm text-ink-red-7"
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

// Every shape collapses to a list of lines, and every line renders. An
// `Error` with several `messages` used to render only the first one it could
// coerce to a string.
const lines = computed<string[]>(() => {
  const value = props.message
  if (!value) return []
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.filter(Boolean).map(String)
  // An empty `messages` array is not an answer, so fall through to `message`.
  // `useInputLabeling` guards on length the same way.
  const messages = value.messages
  if (Array.isArray(messages) && messages.length) {
    const lines = messages.filter(Boolean).map(String)
    if (lines.length) return lines
  } else if (typeof messages === 'string' && messages) {
    return [messages]
  }
  return value.message ? [value.message] : []
})

// DOMPurify needs a real DOM, so `sanitize` doesn't exist during SSR
// (`isSupported` is false). Escape instead — a server-rendered string can't
// execute anything anyway, and the client sanitizes properly on hydration.
//
// The two disagree for a message that contains markup DOMPurify would keep
// (`<b>x</b>` prints literally in the static HTML, then renders bold once
// hydrated) — Vue overwrites the `v-html` on mismatch, so it self-corrects.
// Matching exactly would mean shipping a server DOM (jsdom); not worth it
// for a fallback that only runs in prerendered docs pages.
function clean(line: string) {
  if (!DOMPurify.isSupported) {
    return line.replace(/[&<>"']/g, (char) => escapeMap[char])
  }
  return DOMPurify.sanitize(line)
}

// `whitespace-pre-line` on the wrapper turns the newline into a line break,
// so several messages stack without a second element per message.
const errorMessage = computed(() => lines.value.map(clean).join('\n'))
</script>
