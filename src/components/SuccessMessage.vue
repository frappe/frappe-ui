<template>
  <div
    v-if="message"
    class="whitespace-pre-line text-sm text-green-600"
    role="success"
    v-html="message"
  ></div>
</template>

<script>
export default {
  name: 'SuccessMessage',
  props: ['message'],
}
</script>
