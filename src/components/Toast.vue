<template>
  <div
    class="my-2 min-w-[15rem] max-w-[40rem] rounded-lg border bg-surface-white p-4 shadow-md"
  >
    <div class="flex items-start">
      <div v-if="icon" class="mr-3 grid h-5 w-5 place-items-center">
        <FeatherIcon :name="icon" :class="['h-5 w-5', iconClasses]" />
      </div>
      <div>
        <slot>
          <p
            v-if="title"
            class="text-base font-medium text-ink-gray-9"
            :class="{ 'mb-1': text }"
          >
            {{ title }}
          </p>
          <p v-if="text" class="text-base text-ink-gray-5" v-html="text"></p>
        </slot>
      </div>
      <div class="ml-auto pl-2">
        <slot name="actions">
          <button
            class="grid h-5 w-5 place-items-center rounded hover:bg-surface-gray-2"
            @click="$emit('close')"
          >
            <FeatherIcon name="x" class="h-4 w-4 text-ink-gray-7" />
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
import FeatherIcon from './FeatherIcon.vue'
const positions = [
  'top-right',
  'top-center',
  'top-left',
  'bottom-right',
  'bottom-center',
  'bottom-left',
]

export default {
  name: 'Toast',
  props: {
    position: {
      type: String,
      default: 'top-center',
    },
    icon: {
      type: String,
    },
    iconClasses: {
      type: String,
    },
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    timeout: {
      type: Number,
      default: 5,
    },
  },
  emits: ['close'],
  components: {
    FeatherIcon,
  },
  mounted() {
    if (this.timeout > 0) {
      setTimeout(() => {
        this.$emit('close')
      }, this.timeout * 1000)
    }
  },
}
</script>
