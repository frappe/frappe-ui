<template>
  <div class="mb-4 space-y-2" v-for="color in colors">
    <div class="text-base">{{ color }}</div>
    <div class="flex space-x-1">
      <div
        v-for="shade in [
          '50',
          '100',
          '200',
          '300',
          '400',
          '500',
          '600',
          '700',
          '800',
          '900',
        ]"
        class="h-8 w-8 rounded-md border bg-white"
        :style="{ backgroundColor: colorShades[color][shade] }"
      ></div>
    </div>
  </div>
</template>
<script>
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from 'tailwind.config.js'

const config = resolveConfig(tailwindConfig)

export default {
  name: 'Color',
  computed: {
    colors() {
      return [
        'gray',
        'blue',
        'green',
        'red',
        'orange',
        'yellow',
        'teal',
        'violet',
        'cyan',
        'amber',
        'pink',
        'purple',
      ]
    },
    colorShades() {
      return config.theme.colors
    },
  },
}
</script>
