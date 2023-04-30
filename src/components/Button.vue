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
      class="h-3 w-3"
      :class="{
        '-ml-1 mr-2': !isIconButton,
        'm-0.5': isIconButton,
        'text-white': appearance == 'primary',
        'text-gray-600': appearance == 'secondary',
        'text-red-200': appearance == 'danger',
        'text-green-200': appearance == 'success',
        'text-yellow-200': appearance == 'warning',
      }"
    />
    <template v-else-if="iconLeft || $slots['icon-left']">
      <FeatherIcon
        v-if="iconLeft"
        :name="iconLeft"
        class="mr-1.5 h-4 w-4"
        aria-hidden="true"
      />
      <slot name="icon-left" v-else-if="$slots['icon-left']" />
    </template>
    <template v-if="loading && loadingText">{{ loadingText }}</template>
    <template v-else-if="isIconButton && !loading">
      <FeatherIcon
        v-if="icon"
        :name="icon"
        class="h-4 w-4"
        :aria-label="label"
      />
      <slot name="icon" v-else-if="$slots.icon" />
    </template>
    <span v-else :class="isIconButton ? 'sr-only' : ''">
      <slot>
        {{ label }}
      </slot>
    </span>
    <template v-if="iconRight || $slots['icon-right']">
      <FeatherIcon
        v-if="iconRight"
        :name="iconRight"
        class="ml-2 h-4 w-4"
        aria-hidden="true"
      />
      <slot name="icon-right" v-else-if="$slots['icon-right']" />
    </template>
  </button>
</template>
<script>
import FeatherIcon from './FeatherIcon.vue'
import LoadingIndicator from './LoadingIndicator.vue'

const ValidAppearances = [
  'primary',
  'secondary',
  'danger',
  'success',
  'warning',
  'white',
  'minimal',
]

export default {
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
    appearance: {
      type: String,
      default: 'secondary',
      validator: (value) => {
        return ValidAppearances.includes(value)
      },
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
    route: {},
    link: {
      type: String,
      default: null,
    },
  },
  computed: {
    buttonClasses() {
      let appearanceClasses = {
        primary:
          'bg-blue-500 hover:bg-blue-600 border-transparent text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
        secondary:
          'bg-gray-100 hover:bg-gray-200 border-transparent text-gray-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500',
        danger:
          'bg-red-500 hover:bg-red-400 border-transparent text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500',
        success:
          'bg-green-500 hover:bg-green-400 border-transparent text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500',
        warning:
          'bg-yellow-500 hover:bg-yellow-400 border-transparent text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-500',
        white:
          'bg-white text-gray-900 border-gray-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400',
        minimal: `active:bg-gray-200 border-transparent focus:bg-gray-200 text-gray-900 ${
          this.active ? 'bg-gray-200' : 'bg-transparent hover:bg-gray-200'
        }`,
      }
      return [
        'inline-flex items-center justify-center text-base leading-5 rounded-md border transition-colors focus:outline-none',
        this.isIconButton ? 'p-1.5' : 'px-3 py-1',
        this.isDisabled
          ? 'opacity-50 cursor-not-allowed pointer-events-none'
          : '',
        appearanceClasses[this.appearance],
      ]
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
}
</script>
