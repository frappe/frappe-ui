<template>
  <div class="space-y-1">
    <label class="block text-xs text-ink-gray-5" v-if="label">
      {{ label }}
    </label>
    <div class="flex text-center">
      <div
        v-for="index in rating_from"
        :key="index"
        @mouseover="() => !readonly && (hoveredRating = index)"
        @mouseleave="() => !readonly && (hoveredRating = 0)"
      >
        <FeatherIcon
          name="star"
          class="fill-gray-300 text-transparent mr-0.5"
          :class="iconClasses(index)"
          @click="markRating(index)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import FeatherIcon from '../FeatherIcon.vue'
import type { RatingProps } from './types'

const props = withDefaults(defineProps<RatingProps>(), {
  modelValue: 0,
  rating_from: 5,
  size: 'md',
  readonly: false,
})

const emit = defineEmits(['update:modelValue'])
const rating = ref(props.modelValue)
const hoveredRating = ref(0)

const iconClasses = (index: number) => {
  let classes = [
    {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-7',
    }[props.size],
  ]

  if (index <= hoveredRating.value && index > rating.value) {
    classes.push('!fill-yellow-200')
  } else if (index <= rating.value) {
    classes.push('!fill-yellow-500')
  }

  if (!props.readonly) {
    classes.push('cursor-pointer')
  }
  return classes.join(' ')
}

const emitChange = (value: number) => {
  emit('update:modelValue', value)
}

const markRating = (index: number) => {
  if (props.readonly) return
  emitChange(index)
  rating.value = index
}

watch(
  () => props.modelValue,
  (newVal) => {
    rating.value = newVal
  },
)
</script>
