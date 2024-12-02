<template>
  <div
    v-if="message"
    class="whitespace-pre-line text-sm text-ink-red-4"
    role="alert"
    v-html="errorMessage"
  ></div>
</template>

<script>
import { __ } from '../utils/translation'
export default {
  name: 'ErrorMessage',
  props: ['message'],
  computed: {
    errorMessage() {
      if (!this.message) return ''
      if (this.message instanceof Error) {
        return this.message.messages || this.message.message
      }
      return __(this.message)
    },
  },
}
</script>
