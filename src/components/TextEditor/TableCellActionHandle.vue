<template>
  <button
    class="absolute z-10 flex items-center justify-center w-6 h-6 bg-white border-2 border-gray-300 rounded-full shadow-lg hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer"
    :style="style"
    @click.stop="handleClick"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="w-4 h-4 text-gray-600"
    >
      <path
        fill-rule="evenodd"
        d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
</template>

<script>
export default {
  name: 'TableCellActionHandle',
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
        };
      } else {
        return {
          top: `${this.position.top}px`,
          left: `${this.position.left}px`,
          transform: 'translate(-50%, -50%)',
        };
      }
    },
  },
  methods: {
    handleClick(event) {
      this.$emit('click');
    },
  },
};
</script>