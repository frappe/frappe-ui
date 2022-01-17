<template>
  <Modal
    :show="modelValue"
    @change="handleChange"
    :dismissable="dismissable"
    :full="full"
  >
    <div class="px-4 pb-4 bg-white sm:px-6 sm:pb-4">
      <div class="sm:flex sm:items-start">
        <div class="relative w-full sm:text-left">
          <div class="sticky top-0 py-4 bg-white">
            <h3 class="text-xl font-medium leading-6 text-gray-900">
              {{ title }}
            </h3>
          </div>
          <button
            v-if="dismissable"
            class="absolute top-0 right-0"
            @click="handleChange(false)"
          >
            <FeatherIcon name="x" class="w-4 h-4 mt-4" />
          </button>
          <div class="leading-5 text-gray-800">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
    <div
      class="sticky bottom-0 flex items-center justify-end p-4 bg-white sm:px-6 sm:py-4"
      v-if="$slots.actions"
    >
      <slot name="actions"></slot>
    </div>
  </Modal>
</template>

<script>
import Modal from './Modal.vue'
import FeatherIcon from './FeatherIcon.vue'

export default {
  name: 'Dialog',
  props: ['title', 'modelValue', 'dismissable', 'full'],
  emits: ['update:modelValue', 'close'],
  components: {
    Modal,
    FeatherIcon,
  },
  methods: {
    handleChange(value) {
      this.$emit('update:modelValue', value)
      if (value === false) {
        this.$emit('close')
      }
    },
  },
}
</script>
