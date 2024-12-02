<template>
  <div
    v-if="message"
    class="whitespace-pre-line text-sm text-ink-red-4"
    role="alert"
    v-html="errorMessage"
  ></div>
</template>

<script setup>
import { __ } from '../utils/translation'
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: [String, Error],
    required: true,
  },
})

const errorMessage = computed(() => {
  if (!props.message) return ''
  if (props.message instanceof Error) {
    return props.message.messages || props.message.message
  }
  return __(props.message)
})
</script>
