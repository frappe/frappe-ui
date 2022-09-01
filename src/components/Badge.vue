<template>
  <span
    class="inline-block cursor-default rounded-md px-3 py-1 text-xs font-medium"
    :class="classes"
  >
    <slot>{{ status }}</slot>
  </span>
</template>
<script>
const DEFAULT_COLOR_MAP = {
  Pending: 'yellow',
  Running: 'yellow',
  Success: 'green',
  Failure: 'red',
  Active: 'green',
  Broken: 'red',
  Updating: 'blue',
  Rejected: 'red',
  Published: 'green',
  Approved: 'green',
}

export default {
  name: 'Badge',
  props: ['color', 'status', 'colorMap'],
  computed: {
    classes() {
      let color = this.getBadgeColor()

      let cssClasses = {
        gray: 'text-gray-700 bg-gray-50',
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
      if (color) {
        return color
      }

      let statusColorMap = Object.assign(DEFAULT_COLOR_MAP, this.colorMap || {})
      color = statusColorMap[this.status] || 'gray'

      return color
    },
  },
}
</script>
