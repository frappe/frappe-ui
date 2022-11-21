<template>
  <Popover trigger="hover" :hoverDelay="hoverDelay" :placement="placement">
    <template #target>
      <slot />
    </template>
    <template #body>
      <slot name="body">
        <div
          v-if="text"
          class="rounded-lg border border-gray-100 bg-gray-800 px-2 py-1 text-xs text-white shadow-xl"
        >
          {{ text }}
        </div>
      </slot>
    </template>
  </Popover>
</template>
<script>
import Popover from './Popover.vue'
export default {
  name: 'Tooltip',
  components: { Popover },
  props: {
    hoverDelay: {
      default: 0.5,
    },
    placement: {
      default: 'top',
    },
    text: {
      type: String,
      default: null,
    },
  },
}
</script>
