<template>
  <span
    class="inline-block cursor-default rounded-md px-3 py-1 text-xs font-medium"
    :class="classes"
  >
    <slot>{{ label }}</slot>
  </span>
</template>
<script>
let validColors = ['gray', 'red', 'yellow', 'green', 'blue']
export default {
  name: 'Badge',
  props: ['color', 'label', 'colorMap'],
  computed: {
    classes() {
      let color = this.getBadgeColor()

      let cssClasses = {
        gray: 'text-gray-700 bg-gray-100',
        green: 'text-green-700 bg-green-50',
        red: 'text-red-700 bg-red-50',
        yellow: 'text-yellow-700 bg-yellow-50',
        blue: 'text-blue-700 bg-blue-50',
      }[color]

      return cssClasses
    },
  },
  methods: {
    getBadgeColor() {
      let color = this.color
      if (this.colorMap) {
        color = this.colorMap[this.label]
      }
      if (!color || !validColors.includes(color)) {
        color = 'gray'
      }
      return color
    },
  },
}
</script>
