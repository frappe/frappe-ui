<template>
  <div class="flex items-center text-base text-gray-500">
    <LoadingIndicator class="mr-2 -ml-1 h-3 w-3" /> {{ text }}
  </div>
</template>
<script>
import LoadingIndicator from './LoadingIndicator.vue'

export default {
  name: 'Loading',
  props: {
    text: {
      type: String,
      default: 'Loading...',
    },
  },
  components: {
    LoadingIndicator,
  },
}
</script>
