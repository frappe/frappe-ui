<template>
  <button
    v-bind="$attrs"
    :class="buttonClasses"
    @click="handleClick"
    :disabled="isDisabled"
  >
    <LoadingIndicator
      v-if="loading"
      :class="{
        'text-white': type == 'primary',
        'text-gray-600': type == 'secondary',
        'text-red-200': type == 'danger',
      }"
    />
    <FeatherIcon v-else-if="iconLeft" :name="iconLeft" class="w-4 h-4 mr-1.5" />
    <template v-if="loading && loadingText">{{ loadingText }}</template>
    <template v-else-if="icon">
      <FeatherIcon :name="icon" class="w-4 h-4" />
    </template>
    <span :class="icon ? 'sr-only' : ''">
      <slot></slot>
    </span>
    <FeatherIcon v-if="iconRight" :name="iconRight" class="w-4 h-4 ml-2" />
  </button>
</template>
<script>
import FeatherIcon from './FeatherIcon.vue'
import LoadingIndicator from './LoadingIndicator.vue'

export default {
  name: 'Button',
  components: {
    FeatherIcon,
    LoadingIndicator,
  },
  props: {
    type: {
      type: String,
      default: 'secondary',
    },
    disabled: {
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
    buttonFullWidth: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    buttonClasses() {
      return [
        'inline-flex items-center text-base leading-5 rounded-md focus:outline-none',
        this.icon ? 'p-1.5' : 'px-3 py-1',
        {
          'opacity-50 cursor-not-allowed pointer-events-none': this.isDisabled,
          'bg-gradient-blue hover:bg-gradient-none hover:bg-blue-500 text-white focus:ring-2 focus:ring-offset-2 focus:ring-blue-500':
            this.type === 'primary',
          'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500':
            this.type === 'secondary',
          'bg-red-500 hover:bg-red-400 text-white focus:ring-2 focus:ring-offset-2 focus:ring-red-500':
            this.type === 'danger',
          'bg-white text-gray-900 border hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-400':
            this.type === 'white',
        },
        this.buttonFullWidth ? 'w-full justify-between' : 'justify-center'
      ]
    },
    isDisabled() {
      return this.disabled || this.loading
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
