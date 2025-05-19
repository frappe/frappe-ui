<template>
  <ToastRoot
    v-model:open="modelOpen"
    :duration="closable ? duration : 0"
    :class="[
      'toast-root-animatable',
      'bg-surface-gray-6 border-none rounded-md px-4 py-1.5 shadow-lg flex items-center justify-between gap-3 min-w-[280px] max-w-[400px] pointer-events-auto list-none',
    ]"
  >
    <div class="flex items-center gap-2 flex-grow overflow-hidden">
      <div>
        <component v-if="icon" :is="icon" class="flex-shrink-0 size-4" />
        <CircleCheck
          v-else-if="type == 'success'"
          class="flex-shrink-0 size-4 text-ink-green-2"
        />
        <LucideAlertTriangle
          v-else-if="type == 'warning'"
          class="flex-shrink-0 size-4 text-ink-amber-2"
        />
        <LucideInfo
          v-else-if="type == 'error'"
          class="flex-shrink-0 size-4 text-ink-red-2"
        />
      </div>
      <div class="flex flex-col flex-grow overflow-hidden">
        <ToastDescription
          v-if="message"
          class="text-p-sm break-words text-ink-white"
        >
          {{ message }}
        </ToastDescription>
      </div>
    </div>
    <div class="flex items-center gap-2 h-7">
      <ToastAction
        v-if="action"
        class="flex-shrink-0 rounded px-2 py-1 text-sm text-ink-blue-link hover:text-ink-gray-3 focus:outline-none focus-visible:ring focus-visible:ring-outline-gray-4"
        :alt-text="action.altText || action.label"
        @click="handleAction"
      >
        {{ action.label }}
      </ToastAction>
      <ToastClose
        v-if="closable"
        class="flex-shrink-0 rounded p-1 text-ink-white hover:text-ink-gray-3 focus:outline-none focus-visible:ring focus-visible:ring-outline-gray-4"
      >
        <LucideX class="size-4" />
      </ToastClose>
    </div>
  </ToastRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ToastAction, ToastClose, ToastDescription, ToastRoot } from 'reka-ui'
import LucideInfo from '~icons/lucide/info'
import LucideAlertTriangle from '~icons/lucide/alert-triangle'
import LucideX from '~icons/lucide/x'
import CircleCheck from '../../icons/CircleCheck.vue'
import type { ToastProps } from './types'

const props = defineProps<ToastProps>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'action'): void
}>()

const modelOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

function handleAction() {
  props.action?.onClick?.()
  emit('action')
}
</script>

<style>
@keyframes KSlideIn {
  from {
    transform: translateY(calc(100% + var(--viewport-padding, 32px)))
      scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes KHide {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(calc(50% + var(--viewport-padding, 32px))) scale(0.95);
  }
}

@keyframes KSwipeOut {
  from {
    opacity: 1;
    transform: translateY(var(--reka-toast-swipe-end-y)) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(calc(100% + var(--viewport-padding, 32px))) scale(0.9);
  }
}

.toast-root-animatable {
  transition:
    transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 400ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.toast-root-animatable[data-state='open'] {
  animation: KSlideIn 300ms cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
}

.toast-root-animatable[data-state='closed'] {
  animation: KHide 250ms cubic-bezier(0.26, 0.09, 0.58, 1) forwards;
}

.toast-root-animatable[data-swipe='move'] {
  transform: translateY(var(--reka-toast-swipe-move-y));
  opacity: 1;
  transition: none;
}

.toast-root-animatable[data-swipe='cancel'] {
  transform: translateY(0);
  transition: transform 250ms cubic-bezier(0.21, 1.02, 0.73, 1);
  opacity: 1;
}

.toast-root-animatable[data-swipe='end'] {
  animation: KSwipeOut 250ms cubic-bezier(0.26, 0.09, 0.58, 1) forwards;
}
</style>
