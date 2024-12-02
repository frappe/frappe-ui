<template>
  <div class="flex items-center justify-between py-3">
    <div>
      <h3 class="text-base font-medium text-gray-900">
        {{ __(title) }}
      </h3>
      <div class="mt-1" v-if="secondaryText || $slots.subtitle">
        <template v-if="secondaryText">
          <span class="text-base text-gray-600" v-html="secondaryText" />
        </template>
        <slot v-if="$slots.subtitle" name="subtitle" />
      </div>
    </div>
    <slot name="actions"></slot>
  </div>
</template>
<script setup>
import { __ } from '../utils/translation'
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
})

const secondaryText = computed(() => {
  let text = __(props.subtitle) || ''
  return text.replace('\n', '<br>')
})
</script>
