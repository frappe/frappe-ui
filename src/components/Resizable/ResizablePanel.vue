<template>
  <component
    :is="as"
    ref="panelRef"
    :class="panelClasses"
    :style="panelStyle"
    v-bind="$attrs"
    :data-panel-id="panelId"
    :data-collapsed="isCollapsed"
    :data-panel-index="panelIndexFromProvider"
    :aria-label="panelLabel"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import type { ResizablePanelProps, ResizablePanelEmits, PanelData } from './types'
import { RESIZABLE_CONTEXT_KEY, RESIZABLE_PROVIDER_KEY } from './utils'

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

const provider = inject(RESIZABLE_PROVIDER_KEY, null)

const panelRef = ref<HTMLElement>()
const panelId = ref(props.id || `panel-${Math.random().toString(36).substr(2, 9)}`)
const wasCollapsed = ref(false)

const providerPanel = computed(() => {
  if (!provider?.value) return null
  return provider.value.panels.find(panel => panel.id === panelId.value) || null
})

const panelIndexFromProvider = computed(() => {
  if (!provider?.value) return -1
  return provider.value.panels.findIndex(panel => panel.id === panelId.value)
})

const panelLabel = computed(() => {
  return providerPanel.value?.label || props.label || panelId.value
})

// Computed
const currentSize = computed(() => context.getPanelSize(panelId.value))

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
  const size = currentSize.value
  
  const isHorizontal = context.direction === 'horizontal'
  
  return {
    [isHorizontal ? 'width' : 'height']: `${size}%`,
    [isHorizontal ? 'height' : 'width']: '100%',
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
    size: currentSize.value || props.defaultSize || 0,
    minSize: props.minSize,
    maxSize: props.maxSize,
    collapsible: props.collapsible,
    collapsedSize: props.collapsedSize,
    order: props.order,
    grow: props.grow,
    resizable: props.resizable,
    element: panelRef.value,   
    defaultSize: props.defaultSize, 
  }
  
  context.registerPanel(panelId.value, panelData)
})

watch(() => [
  props.minSize, 
  props.maxSize, 
  props.collapsible, 
  props.collapsedSize, 
  props.order, 
  props.grow, 
  props.resizable
], () => {
  const panelData: PanelData = {
    id: panelId.value,
    size: currentSize.value || props.defaultSize || 0,
    minSize: props.minSize,
    maxSize: props.maxSize,
    collapsible: props.collapsible,
    collapsedSize: props.collapsedSize,
    order: props.order,
    grow: props.grow,
    resizable: props.resizable,
    element: panelRef.value,
    // @ts-ignore
    defaultSize: props.defaultSize, 
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
  display: flex;
}
</style>
