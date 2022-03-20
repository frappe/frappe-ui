<template>
  <div
    class="pointer-events-auto w-full max-w-sm rounded-lg bg-white shadow-lg"
  >
    <div class="shadow-xs overflow-hidden rounded-lg">
      <div class="p-4">
        <div class="flex items-start">
          <div class="mr-3 shrink-0" v-if="icon">
            <div class="h-6 w-6 rounded-full p-1" :class="iconContainerClass">
              <FeatherIcon :name="icon" :class="iconClass" class="h-4 w-4" />
            </div>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium leading-6 text-gray-900">
              {{ title }}
            </p>
            <p v-if="message" class="mt-1 text-sm leading-5 text-gray-700">
              {{ message }}
            </p>
          </div>
          <div class="ml-3 flex h-6 shrink-0 items-center">
            <button @click="$emit('dismiss', id)" class="focus:outline-none">
              <FeatherIcon name="x" class="h-5 w-5 text-gray-800" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FeatherIcon from './FeatherIcon.vue'

export default {
  name: 'Notification',
  components: {
    FeatherIcon,
  },
  props: ['id', 'title', 'message', 'color', 'icon'],
  computed: {
    iconClass() {
      return {
        red: 'text-red-500',
        green: 'text-green-500',
        yellow: 'text-yellow-500',
        blue: 'text-blue-500',
        gray: 'text-gray-500',
      }[this.color || 'gray']
    },
    iconContainerClass() {
      return {
        red: 'bg-red-100',
        green: 'bg-green-100',
        yellow: 'bg-yellow-100',
        blue: 'bg-blue-100',
        gray: 'bg-gray-100',
      }[this.color || 'gray']
    },
  },
}
</script>
