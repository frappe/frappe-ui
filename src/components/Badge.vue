<template>
  <div
    class="inline-flex select-none items-center gap-1 rounded-full"
    :class="classes"
  >
    <div :class="[size == 'lg' ? 'max-h-6' : 'max-h-4']" v-if="$slots.prefix">
      <slot name="prefix"></slot>
    </div>
    <slot>{{ label }}</slot>
    <div :class="[size == 'lg' ? 'max-h-6' : 'max-h-4']" v-if="$slots.suffix">
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

enum Themes {
  gray = 'gray',
  blue = 'blue',
  green = 'green',
  orange = 'orange',
  red = 'red',
}

enum Sizes {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}

enum Variants {
  solid = 'solid',
  subtle = 'subtle',
  outline = 'outline',
  ghost = 'ghost',
}

let Badge = defineComponent({
  name: 'Badge',
  props: {
    theme: {
      type: String as PropType<Themes>,
      default: Themes.gray,
    },
    size: {
      type: String as PropType<Sizes>,
      default: Sizes.sm,
    },
    variant: {
      type: String as PropType<Variants>,
      default: Variants.solid,
    },
    label: {
      type: String,
      default: null,
    },
  },
  computed: {
    classes() {
      let solidClasses = {
        gray: 'text-white bg-gray-900',
        blue: 'text-white bg-blue-500',
        green: 'text-white bg-green-600',
        orange: 'text-white bg-amber-600',
        red: 'text-white bg-red-600',
      }[this.theme]

      let subtleClasses = {
        gray: 'text-gray-700 bg-gray-100',
        blue: 'text-blue-600 bg-blue-100',
        green: 'text-green-800 bg-green-200',
        orange: 'text-amber-700 bg-amber-100',
        red: 'text-red-600 bg-red-100',
      }[this.theme]

      let outlineClasses = {
        gray: 'text-gray-700 bg-white border border-gray-300',
        blue: 'text-blue-600 bg-white border border-blue-300',
        green: 'text-green-800 bg-white border border-green-300',
        orange: 'text-amber-700 bg-white border border-amber-300',
        red: 'text-red-600 bg-white border border-red-300',
      }[this.theme]

      let ghostClasses = {
        gray: 'text-gray-700 bg-transparent',
        blue: 'text-blue-600 bg-transparent',
        green: 'text-green-800 bg-transparent',
        orange: 'text-amber-700 bg-transparent',
        red: 'text-red-600 bg-transparent',
      }[this.theme]

      let variantClasses = {
        subtle: subtleClasses,
        solid: solidClasses,
        outline: outlineClasses,
        ghost: ghostClasses,
      }[this.variant]

      let sizeClasses = {
        sm: 'h-4 text-xs px-1.5',
        md: 'h-5 text-xs px-1.5',
        lg: 'h-6 text-sm px-2',
      }[this.size]

      return [variantClasses, sizeClasses]
    },
  },
})

Badge.Sizes = Sizes
Badge.Themes = Themes
Badge.Variants = Variants

export default Badge
</script>
