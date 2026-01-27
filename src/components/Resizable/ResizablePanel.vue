<template>
  <component
    :is="as"
    ref="panelRef"
    :class="panelClasses"
    :style="panelStyle"
    :data-panel-id="panelId"
    :data-collapsed="isCollapsed"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import type { ResizablePanelProps, ResizablePanelEmits, PanelData } from './types'
import { RESIZABLE_CONTEXT_KEY } from './utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ResizablePanelProps>(), {
  as: 'div',
  minSize: 10,
  maxSize: 100,
  defaultSize: undefined,
  collapsible: false,
  collapsedSize: 0,
  order: 0,
  grow: false,
  resizable: true,
})

const emit = defineEmits<ResizablePanelEmits>()

const context = inject(RESIZABLE_CONTEXT_KEY)
if (!context) {
  throw new Error('ResizablePanel must be used within ResizableRoot')
}

const panelRef = ref<HTMLElement>()
const panelId = ref(props.id || `panel-${Math.random().toString(36).substr(2, 9)}`)
const currentSize = ref(props.defaultSize || 0)
const wasCollapsed = ref(false)

// Computed
const isCollapsed = computed(() => {
  return props.collapsible && currentSize.value <= props.collapsedSize
})

const panelClasses = computed(() => [
  'resizable-panel',
  {
    'transition-all duration-200': isCollapsed.value !== wasCollapsed.value,
  }
])

const panelStyle = computed(() => {
  const size = context.getPanelSize(panelId.value)
  currentSize.value = size
  
  const dimension = context.direction === 'horizontal' ? 'width' : 'height'
  
  return {
    [dimension]: `${size}%`,
    flexShrink: 0,
    flexGrow: props.grow ? 1 : 0,
    overflow: 'hidden',
  }
})

// Watch for collapse/expand
watch(isCollapsed, (collapsed, wasCollapsedBefore) => {
  if (collapsed && !wasCollapsedBefore) {
    emit('collapse')
  } else if (!collapsed && wasCollapsedBefore) {
    emit('expand')
  }
  wasCollapsed.value = collapsed
})

// Lifecycle
onMounted(() => {
  const panelData: PanelData = {
    id: panelId.value,
    size: currentSize.value,
    minSize: props.minSize,
    maxSize: props.maxSize,
    collapsible: props.collapsible,
    collapsedSize: props.collapsedSize,
    order: props.order,
    grow: props.grow,
    resizable: props.resizable,
    element: panelRef.value,
  }
  
  context.registerPanel(panelId.value, panelData)
})

onUnmounted(() => {
  context.unregisterPanel(panelId.value)
})

defineExpose({ panelRef, panelId, currentSize, isCollapsed })
</script>

<style scoped>
.resizable-panel {
  position: relative;
  box-sizing: border-box;
}
</style>
