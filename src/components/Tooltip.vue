<template>
  <Popover trigger="hover" :hoverDelay="hoverDelay" :placement="placement">
    <template #target>
      <slot />
    </template>
    <template #body>
      <slot name="body">
        <div
          class="px-2 py-1 text-xs text-white bg-gray-800 border border-gray-100 rounded-lg shadow-xl"
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
      default: 'bottom-start',
    },
    text: {
      type: String,
      default: '',
    },
  },
}
</script>
