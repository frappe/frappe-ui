<template>
  <button
    class="absolute z-10 flex items-center justify-center w-6 h-6 bg-white border-2 border-gray-300 rounded-full shadow-lg hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer"
    :style="style"
    @click.stop="handleClick"
  >
    <LucideGripVertical class="w-4 h-4 text-gray-600" />
  </button>
</template>

<script>
import LucideGripVertical from '~icons/lucide/grip-vertical'

export default {
  name: 'TableCellActionHandle',
  components: {
    LucideGripVertical,
  },
  props: {
    position: {
      type: Object, // { top, left, right, bottom }
      required: true,
    },
    axis: {
      type: String, // 'row' or 'column'
      required: true,
    },
  },
  emits: ['click'],
  computed: {
    style() {
      if (this.axis === 'row') {
        return {
          top: `${this.position.top}px`,
          left: `${this.position.left}px`,
          transform: 'translate(-50%, -50%)',
        }
      } else {
        return {
          top: `${this.position.top}px`,
          left: `${this.position.left}px`,
          transform: 'translate(-50%, -50%)',
        }
      }
    },
  },
  methods: {
    handleClick(event) {
      this.$emit('click')
    },
  },
}
</script>
