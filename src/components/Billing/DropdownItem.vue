<template>
  <button
    class="flex gap-4 h-7 w-full justify-between items-center rounded px-2 text-base hover:bg-gray-100 text-text-icons-gray-6',"
  >
    {{ label }}
    <FeatherIcon v-if="checked" class="h-4" name="check" />
  </button>
</template>
<script setup>
import FeatherIcon from '../FeatherIcon.vue'
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  checked: {
    type: Boolean,
    default: false,
  },
})
</script>
