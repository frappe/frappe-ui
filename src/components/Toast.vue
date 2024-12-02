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
            {{ __(title) }}
          </p>
          <p
            v-if="text"
            class="text-base text-ink-gray-5"
            v-html="__(text)"
          ></p>
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
<script setup>
import { __ } from '../utils/translation'
import FeatherIcon from './FeatherIcon.vue'
import { onMounted } from 'vue'

const props = defineProps({
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
})

const emit = defineEmits(['close'])

onMounted(() => {
  if (props.timeout > 0) {
    setTimeout(() => {
      emit('close')
    }, props.timeout * 1000)
  }
})
</script>
