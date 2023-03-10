<template>
  <button
    v-bind="$attrs"
    :class="buttonClasses"
    @click="handleClick"
    :disabled="isDisabled"
    :aria-label="ariaLabel"
  >
    <LoadingIndicator
      v-if="loading"
      :class="{
        'h-3 w-3': size == 'sm',
        'h-[13.5px] w-[13.5px]': size == 'md',
        'h-[15px] w-[15px]': size == 'lg',
        'h-4.5 w-4.5': size == 'xl' || size == '2xl',
      }"
    />
    <slot name="prefix" v-else-if="$slots['prefix']">
      <FeatherIcon
        v-if="iconLeft"
        :name="iconLeft"
        :class="slotClasses"
        aria-hidden="true"
      />
    </slot>

    <template v-if="loading && loadingText">{{ loadingText }}</template>
    <template v-else-if="isIconButton && !loading">
      <FeatherIcon
        v-if="icon"
        :name="icon"
        :class="slotClasses"
        :aria-label="label"
      />
      <slot name="icon" v-else-if="$slots.icon" />
    </template>
    <span v-else :class="{ 'sr-only': isIconButton }">
      <slot>{{ label }}</slot>
    </span>

    <slot name="suffix">
      <FeatherIcon
        v-if="iconRight"
        :name="iconRight"
        :class="slotClasses"
        aria-hidden="true"
      />
    </slot>
  </button>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import FeatherIcon from './FeatherIcon.vue'
import LoadingIndicator from './LoadingIndicator.vue'

enum Themes {
  gray = 'gray',
  blue = 'blue',
  green = 'green',
}

enum Sizes {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  '2xl' = '2xl',
}

enum Variants {
  solid = 'solid',
  subtle = 'subtle',
  outline = 'outline',
  ghost = 'ghost',
}

let Button = defineComponent({
  name: 'Button',
  components: {
    FeatherIcon,
    LoadingIndicator,
  },
  props: {
    label: {
      type: String,
      default: null,
    },
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
    disabled: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    iconLeft: {
      type: String,
      default: null,
    },
    iconRight: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: null,
    },
    route: {
      type: [String, Object],
      default: null,
    },
    link: {
      type: String,
      default: null,
    },
  },
  computed: {
    buttonClasses() {
      let solidClasses = {
        gray: 'text-white bg-gray-900 hover:bg-gray-800 active:bg-gray-700',
        blue: 'text-white bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
        green: 'text-white bg-green-600 hover:bg-green-700 active:bg-green-800',
      }[this.theme]

      let subtleClasses = {
        gray: 'text-gray-800 bg-gray-100 hover:bg-gray-200 active:bg-gray-300',
        blue: 'text-blue-600 bg-blue-100 hover:bg-blue-200 active:bg-blue-300',
        green:
          'text-green-800 bg-green-100 hover:bg-green-200 active:bg-green-300',
      }[this.theme]

      let outlineClasses = {
        gray: 'text-gray-800 bg-white border border-gray-300 hover:border-gray-400 active:border-gray-400 active:bg-gray-300',
        blue: 'text-blue-600 bg-white border border-blue-300 hover:border-blue-400 active:border-blue-400 active:bg-blue-300',
        green:
          'text-green-800 bg-white border border-green-400 hover:border-green-500 active:border-green-500 active:bg-green-300',
      }[this.theme]

      let ghostClasses = {
        gray: 'text-gray-800 bg-transparent hover:bg-gray-200 active:bg-gray-300',
        blue: 'text-blue-600 bg-transparent hover:bg-blue-200 active:bg-blue-300',
        green:
          'text-green-800 bg-transparent hover:bg-green-200 active:bg-green-300',
      }[this.theme]

      let focusClasses = {
        gray: 'focus-visible:ring focus-visible:ring-gray-400',
        blue: 'focus-visible:ring focus-visible:ring-blue-400',
        green: 'focus-visible:ring focus-visible:ring-green-400',
      }[this.theme]

      let variantClasses = {
        subtle: subtleClasses,
        solid: solidClasses,
        outline: outlineClasses,
        ghost: ghostClasses,
      }[this.variant]

      let themeVariant = `${this.theme}-${this.variant}`

      let disabledClassesMap = {
        gray: 'bg-gray-100 text-gray-500',
        'gray-outline': 'bg-gray-100 text-gray-500 border border-gray-300',
        'gray-ghost': 'text-gray-500',

        'blue-solid': 'bg-blue-300 text-white',
        'blue-subtle': 'bg-blue-100 text-blue-400',
        'blue-outline': 'bg-blue-100 text-blue-400 border border-blue-300',
        'blue-ghost': 'text-blue-400',

        green: 'bg-green-100 text-green-500',
        'green-outline': 'bg-green-100 text-green-500 border border-green-400',
        'green-ghost': 'text-green-500',
      }
      let disabledClasses =
        disabledClassesMap[themeVariant] || disabledClassesMap[this.theme]

      let sizeClasses = {
        sm: 'h-7 text-base px-2 rounded',
        md: 'h-8 text-base font-medium px-2.5 rounded',
        lg: 'h-10 text-lg font-medium px-3 rounded-md',
        xl: 'h-11.5 text-xl font-medium px-3.5 rounded-lg',
        '2xl': 'h-13 text-2xl font-medium px-3.5 rounded-xl',
      }[this.size]

      if (this.isIconButton) {
        sizeClasses = {
          sm: 'h-7 w-7 rounded',
          md: 'h-8 w-8 rounded',
          lg: 'h-10 w-10 rounded-md',
          xl: 'h-11.5 w-11.5 rounded-lg',
          '2xl': 'h-13 w-13 rounded-xl',
        }[this.size]
      }

      return [
        'inline-flex items-center justify-center gap-2 transition-colors focus:outline-none',
        this.isDisabled ? disabledClasses : variantClasses,
        focusClasses,
        sizeClasses,
      ]
    },
    slotClasses() {
      let classes = {
        sm: 'h-4',
        md: 'h-4.5',
        lg: 'h-5',
        xl: 'h-6',
        '2xl': 'h-6',
      }[this.size]

      return classes
    },
    isDisabled() {
      return this.disabled || this.loading
    },
    ariaLabel() {
      return this.isIconButton ? this.label : null
    },
    isIconButton() {
      return this.icon || this.$slots.icon
    },
  },
  methods: {
    handleClick() {
      if (this.route && this.$router) {
        this.route && this.$router.push(this.route)
      }
      this.link ? window.open(this.link, '_blank') : null
    },
  },
})

Button.Themes = Themes
Button.Sizes = Sizes
Button.Variants = Variants

export default Button
</script>
