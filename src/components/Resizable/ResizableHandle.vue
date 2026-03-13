<template>
  <component
    :is="as"
    ref="handleRef"
    :class="handleClasses"
    :style="handleStyle"
    v-bind="$attrs"
    :data-disabled="isDisabled"
    :aria-label="ariaLabel || `Resize handle ${index}`"
    :aria-orientation="context.direction === 'horizontal' ? 'vertical' : 'horizontal'"
    role="separator"
    tabindex="0"
    @keydown="handleKeyDown"
  >
    <slot>
      <div 
        :class="handleBarClasses"
        @mousedown.stop.prevent="handleMouseDown"
        @touchstart.stop.prevent="handleTouchStart"
      >
        <div v-if="withHandle" class="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-gray-50 group-hover:bg-gray-100">
           <svg v-if="context.direction === 'vertical'" width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5"><path d="M5.5 4.625C5.5 5.10825 5.10825 5.5 4.625 5.5C4.14175 5.5 3.75 5.10825 3.75 4.625C3.75 4.14175 4.14175 3.75 4.625 3.75C5.10825 3.75 5.5 4.14175 5.5 4.625ZM9.5 4.625C9.5 5.10825 9.10825 5.5 8.625 5.5C8.14175 5.5 7.75 5.10825 7.75 4.625C7.75 4.14175 8.14175 3.75 8.625 3.75C9.10825 3.75 9.5 4.14175 9.5 4.625ZM10.375 11.25C10.8582 11.25 11.25 10.8582 11.25 10.375C11.25 9.89175 10.8582 9.5 10.375 9.5C9.89175 9.5 9.5 9.89175 9.5 10.375C9.5 10.8582 9.89175 11.25 10.375 11.25ZM6.375 11.25C6.85825 11.25 7.25 10.8582 7.25 10.375C7.25 9.89175 6.85825 9.5 6.375 9.5C5.89175 9.5 5.5 9.89175 5.5 10.375C5.5 10.8582 5.89175 11.25 6.375 11.25Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
           <svg v-else width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5"><path d="M5.5 4.625C5.5 5.10825 5.10825 5.5 4.625 5.5C4.14175 5.5 3.75 5.10825 3.75 4.625C3.75 4.14175 4.14175 3.75 4.625 3.75C5.10825 3.75 5.5 4.14175 5.5 4.625ZM9.5 4.625C9.5 5.10825 9.10825 5.5 8.625 5.5C8.14175 5.5 7.75 5.10825 7.75 4.625C7.75 4.14175 8.14175 3.75 8.625 3.75C9.10825 3.75 9.5 4.14175 9.5 4.625ZM10.375 11.25C10.8582 11.25 11.25 10.8582 11.25 10.375C11.25 9.89175 10.8582 9.5 10.375 9.5C9.89175 9.5 9.5 9.89175 9.5 10.375C9.5 10.8582 9.89175 11.25 10.375 11.25ZM6.375 11.25C6.85825 11.25 7.25 10.8582 7.25 10.375C7.25 9.89175 6.85825 9.5 6.375 9.5C5.89175 9.5 5.5 9.89175 5.5 10.375C5.5 10.8582 5.89175 11.25 6.375 11.25Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" transform="rotate(90 7.5 7.5)"></path></svg>
        </div>
      </div>
    </slot>
  </component>
</template>

<script lang="ts" setup>
import { computed, inject, ref, onUnmounted } from 'vue'
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
  withHandle: false,
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
  z-index: 100; /* Increased z-index */
  outline: none;
  background-color: transparent;
  overflow: visible;
  touch-action: none;
}

/* Negative margin trick: Element has 1px size (for event capture) but takes 0px layout space */
.resizable-handle.horizontal {
  width: 1px;
  margin-right: -1px;
  height: 100%;
  cursor: col-resize;
  border: none;
  background-color: transparent;
}

.resizable-handle.vertical {
  width: 100%;
  height: 1px;
  margin-bottom: -1px;
  cursor: row-resize;
  border: none;
  background-color: transparent;
}

/* HIT AREA */
.resizable-handle-bar {
  position: absolute;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  background-color: transparent;
  touch-action: none;
}

.resizable-handle-bar.horizontal {
  top: 0;
  bottom: 0;
  left: -5px; /* Center 1px handle in 11px area (-5 to +5 is 10, +1px width = 11) */
  width: 11px;
  cursor: col-resize;
}

.resizable-handle-bar.vertical {
  left: 0;
  right: 0;
  top: -5px;
  height: 11px;
  cursor: row-resize;
}

/* VISUAL INDICATOR */
.resizable-handle-bar::after {
  content: '';
  position: absolute;
  background-color: transparent;
  transition: background-color 0.15s ease;
  pointer-events: none;
}

.resizable-handle-bar.horizontal::after {
  width: 1px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.resizable-handle-bar.vertical::after {
  height: 1px;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

/* Hover & Drag States */
.resizable-handle:hover .resizable-handle-bar::after {
  background-color: #93c5fd;
}

.resizable-handle.dragging .resizable-handle-bar::after {
  background-color: #60a5fa;
}

/* Specific hover on the bar itself to ensure consistency */
.resizable-handle-bar:hover::after {
  background-color: #93c5fd;
}

.resizable-handle.disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}

.resizable-handle:focus-visible .resizable-handle-bar::after {
  background-color: #3b82f6;
  transform: scale(1.5); 
}
</style>
