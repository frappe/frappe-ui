<template>
  <component
    :is="as"
    ref="rootRef"
    :class="rootClasses"
    :data-direction="direction"
    :data-disabled="disabled"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed, provide, ref, watch, onMounted, reactive } from 'vue'
import type { ResizableRootProps, ResizableRootEmits, PanelData, ResizableContext } from './types'
import { RESIZABLE_CONTEXT_KEY, loadSizesFromStorage, saveSizesToStorage, adjustSizes } from './utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ResizableRootProps>(), {
  direction: 'horizontal',
  as: 'div',
  disabled: false,
  reverse: false,
  rtl: false,
})

const emit = defineEmits<ResizableRootEmits>()

const rootRef = ref<HTMLElement>()
const panels = reactive(new Map<string, PanelData>())
const panelSizes = ref<number[]>([])
const isResizing = ref(false)
const activeHandleIndex = ref<number>(-1)
const startPosition = ref<{ x: number; y: number }>({ x: 0, y: 0 })

// Computed classes
const rootClasses = computed(() => [
  'resizable-root',
  'flex',
  {
    'flex-row': props.direction === 'horizontal',
    'flex-col': props.direction === 'vertical',
    'cursor-not-allowed': props.disabled,
  }
])

// Initialize sizes
const initializeSizes = () => {
  const panelArray = Array.from(panels.values()).sort((a, b) => a.order - b.order)
  
  if (panelArray.length === 0) return
  
  let initialSizes: number[] | undefined
  
  // Priority: modelValue > storage > defaultValue > auto-distribute
  if (props.modelValue && props.modelValue.length === panelArray.length) {
    initialSizes = props.modelValue
  } else if (props.storageKey) {
    const stored = loadSizesFromStorage(props.storageKey)
    if (stored && stored.length === panelArray.length) {
      initialSizes = stored
    } else if (props.defaultValue && props.defaultValue.length === panelArray.length) {
      initialSizes = props.defaultValue
    }
  } else if (props.defaultValue && props.defaultValue.length === panelArray.length) {
    initialSizes = props.defaultValue
  }
  
  if (!initialSizes) {
    // Auto-distribute
    const equalSize = 100 / panelArray.length
    initialSizes = panelArray.map(() => equalSize)
  }
  
  // Apply constraints
  panelSizes.value = initialSizes.map((size, i) => {
    const panel = panelArray[i]
    return Math.max(panel.minSize, Math.min(panel.maxSize, size))
  })
  
  // Normalize to 100%
  const total = panelSizes.value.reduce((sum, size) => sum + size, 0)
  if (total > 0 && Math.abs(total - 100) > 0.01) {
    panelSizes.value = panelSizes.value.map(size => (size / total) * 100)
  }
}

// Register panel
const registerPanel = (id: string, data: PanelData) => {
  panels.set(id, data)
  initializeSizes()
}

// Unregister panel
const unregisterPanel = (id: string) => {
  panels.delete(id)
  initializeSizes()
}

// Update panel size
const updatePanelSize = (id: string, size: number) => {
  const panel = panels.get(id)
  if (panel) {
    panel.size = size
  }
}

// Get panel size
const getPanelSize = (id: string): number => {
  const panelArray = Array.from(panels.values()).sort((a, b) => a.order - b.order)
  const index = panelArray.findIndex(p => p.id === id)
  return index >= 0 ? panelSizes.value[index] || 0 : 0
}

// Start resize
const startResize = (index: number) => {
  if (props.disabled) return
  
  isResizing.value = true
  activeHandleIndex.value = index
  emit('resizeStart', { index })
}

// Resize
const resize = (delta: number) => {
  if (!isResizing.value || activeHandleIndex.value < 0) return
  
  const panelArray = Array.from(panels.values()).sort((a, b) => a.order - b.order)
  
  // Adjust delta based on direction and reverse
  let adjustedDelta = delta
  if (props.reverse) adjustedDelta = -adjustedDelta
  if (props.rtl && props.direction === 'horizontal') adjustedDelta = -adjustedDelta
  
  const newSizes = adjustSizes(
    panelSizes.value,
    activeHandleIndex.value,
    adjustedDelta,
    panelArray
  )
  
  panelSizes.value = newSizes
  emit('resize', { sizes: newSizes })
  
  // Update model value
  if (props.modelValue !== undefined) {
    emit('update:modelValue', newSizes)
  }
}

// End resize
const endResize = () => {
  if (!isResizing.value) return
  
  isResizing.value = false
  emit('resizeEnd', { sizes: panelSizes.value })
  
  // Save to storage
  if (props.storageKey) {
    saveSizesToStorage(props.storageKey, panelSizes.value)
  }
  
  activeHandleIndex.value = -1
}

// Provide context with reactive properties
provide(RESIZABLE_CONTEXT_KEY, {
  get direction() { return props.direction },
  get disabled() { return props.disabled },
  get reverse() { return props.reverse },
  get rtl() { return props.rtl },
  panels,
  registerPanel,
  unregisterPanel,
  updatePanelSize,
  getPanelSize,
  startResize,
  resize,
  endResize,
  get isResizing() { return isResizing.value },
})

// Watch for controlled mode changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && newValue.length === panels.size) {
    panelSizes.value = newValue
  }
}, { deep: true })

// Watch for panel changes
watch(() => panels.size, () => {
  initializeSizes()
})

onMounted(() => {
  initializeSizes()
})

defineExpose({ rootRef, panelSizes })
</script>

<style scoped>
.resizable-root {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
