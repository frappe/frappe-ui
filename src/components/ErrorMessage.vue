<template>
  <div
    v-if="message"
    class="whitespace-pre-line text-sm text-red-600"
    role="alert"
    v-html="errorMessage"
  ></div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: ['message'],
  computed: {
    errorMessage() {
      if (!this.message) return ''
      if (this.message instanceof Error) {
        return this.message.messages || this.message.message
      }
      return this.message
    },
  },
}
</script>
