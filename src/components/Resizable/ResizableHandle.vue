<template>
  <component
    :is="as"
    ref="handleRef"
    :class="handleClasses"
    :style="handleStyle"
    :data-disabled="isDisabled"
    :aria-label="ariaLabel || `Resize handle ${index}`"
    :aria-orientation="context.direction === 'horizontal' ? 'vertical' : 'horizontal'"
    role="separator"
    tabindex="0"
    @mousedown="handleMouseDown"
    @touchstart="handleTouchStart"
    @keydown="handleKeyDown"
  >
    <slot>
      <div :class="handleBarClasses" />
    </slot>
  </component>
</template>

<script lang="ts" setup>
import { computed, inject, ref, onMounted, onUnmounted } from 'vue'
import type { ResizableHandleProps } from './types'
import { RESIZABLE_CONTEXT_KEY } from './utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ResizableHandleProps>(), {
  as: 'div',
  disabled: false,
  hitArea: 6,
  cursor: undefined,
  ariaLabel: undefined,
  keyboardStep: 5,
})

const context = inject(RESIZABLE_CONTEXT_KEY)
if (!context) {
  throw new Error('ResizableHandle must be used within ResizableRoot')
}

const handleRef = ref<HTMLElement>()
const isDragging = ref(false)
const startPos = ref(0)
const startSizes = ref<number[]>([])

// Computed
const isDisabled = computed(() => props.disabled || context.disabled)

const handleClasses = computed(() => [
  'resizable-handle',
  {
    'horizontal': context.direction === 'horizontal',
    'vertical': context.direction === 'vertical',
    'disabled': isDisabled.value,
    'dragging': isDragging.value,
  }
])

const handleStyle = computed(() => {
  const cursorMap = {
    horizontal: 'col-resize',
    vertical: 'row-resize',
  }
  
  return {
    cursor: props.cursor || (isDisabled.value ? 'not-allowed' : cursorMap[context.direction]),
    touchAction: 'none',
    userSelect: 'none',
  }
})

const handleBarClasses = computed(() => [
  'resizable-handle-bar',
  {
    'horizontal': context.direction === 'horizontal',
    'vertical': context.direction === 'vertical',
  }
])

// Mouse handlers
const handleMouseDown = (e: MouseEvent) => {
  if (isDisabled.value) return
  
  e.preventDefault()
  e.stopPropagation()
  
  isDragging.value = true
  startPos.value = context.direction === 'horizontal' ? e.clientX : e.clientY
  
  if (props.index !== undefined) {
    context.startResize(props.index)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.body.style.cursor = handleStyle.value.cursor as string
  document.body.style.userSelect = 'none'
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  
  e.preventDefault()
  
  const currentPos = context.direction === 'horizontal' ? e.clientX : e.clientY
  const delta = currentPos - startPos.value
  
  // Convert pixel delta to percentage
  const containerSize = context.direction === 'horizontal' 
    ? handleRef.value?.parentElement?.offsetWidth || 1
    : handleRef.value?.parentElement?.offsetHeight || 1
  
  const percentDelta = (delta / containerSize) * 100
  
  context.resize(percentDelta)
  startPos.value = currentPos
}

const handleMouseUp = () => {
  if (!isDragging.value) return
  
  isDragging.value = false
  context.endResize()
  
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

// Touch handlers
const handleTouchStart = (e: TouchEvent) => {
  if (isDisabled.value) return
  
  e.preventDefault()
  
  const touch = e.touches[0]
  isDragging.value = true
  startPos.value = context.direction === 'horizontal' ? touch.clientX : touch.clientY
  
  if (props.index !== undefined) {
    context.startResize(props.index)
  }
  
  document.addEventListener('touchmove', handleTouchMove, { passive: false })
  document.addEventListener('touchend', handleTouchEnd)
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  
  e.preventDefault()
  
  const touch = e.touches[0]
  const currentPos = context.direction === 'horizontal' ? touch.clientX : touch.clientY
  const delta = currentPos - startPos.value
  
  const containerSize = context.direction === 'horizontal' 
    ? handleRef.value?.parentElement?.offsetWidth || 1
    : handleRef.value?.parentElement?.offsetHeight || 1
  
  const percentDelta = (delta / containerSize) * 100
  
  context.resize(percentDelta)
  startPos.value = currentPos
}

const handleTouchEnd = () => {
  if (!isDragging.value) return
  
  isDragging.value = false
  context.endResize()
  
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
}

// Keyboard handler
const handleKeyDown = (e: KeyboardEvent) => {
  if (isDisabled.value || props.index === undefined) return
  
  const isHorizontal = context.direction === 'horizontal'
  const step = props.keyboardStep
  
  let delta = 0
  
  if ((isHorizontal && e.key === 'ArrowLeft') || (!isHorizontal && e.key === 'ArrowUp')) {
    delta = -step
  } else if ((isHorizontal && e.key === 'ArrowRight') || (!isHorizontal && e.key === 'ArrowDown')) {
    delta = step
  } else if (e.key === 'Home') {
    delta = -100
  } else if (e.key === 'End') {
    delta = 100
  } else {
    return
  }
  
  e.preventDefault()
  
  context.startResize(props.index)
  context.resize(delta)
  context.endResize()
}

// Cleanup
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
})

defineExpose({ handleRef, isDragging })
</script>

<style scoped>
.resizable-handle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 10;
  outline: none;
}

.resizable-handle.horizontal {
  width: 12px;
  height: 100%;
  margin: 0 -6px;
  padding: 0 6px;
}

.resizable-handle.vertical {
  width: 100%;
  height: 12px;
  margin: -6px 0;
  padding: 6px 0;
}

.resizable-handle.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.resizable-handle:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.resizable-handle-bar {
  background-color: #e5e7eb;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.resizable-handle:hover .resizable-handle-bar,
.resizable-handle.dragging .resizable-handle-bar {
  background-color: #3b82f6;
}

.resizable-handle-bar.horizontal {
  width: 2px;
  height: 40px;
}

.resizable-handle-bar.vertical {
  width: 40px;
  height: 2px;
}
</style>
