<template>
  <div
    v-if="message"
    class="whitespace-pre-line text-sm text-red-600"
    role="alert"
    v-html="message"
  ></div>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: ['message'],
}
</script>
