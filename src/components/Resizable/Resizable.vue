<template>
  <div class="relative flex w-full h-full flex-1 flex-col overflow-hidden">
    <div
      class="flex w-full flex-1 flex-col"
    >
      <slot name="container" v-bind="slotBinding">
        <ResizableRoot
          v-if="hasPanels"
          v-bind="{ ...rootProps, ...$attrs }"
          v-on="proxyListeners"
        >
          <template v-for="(panel, index) in normalizedPanels" :key="panel.id">
            <ResizablePanel v-bind="panel" :id="panel.id" :order="panel.order ?? index">
              <slot :name="`panel-${panel.id}`" :panel="panel" />
            </ResizablePanel>
            <ResizableHandle
              v-if="index < normalizedPanels.length - 1"
              :index="index"
            />
          </template>
        </ResizableRoot>
        <ResizableRoot
          v-else
          v-bind="{ ...rootProps, ...$attrs }"
          v-on="proxyListeners"
        >
          <slot />
        </ResizableRoot>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, useSlots, useAttrs } from 'vue'
import ResizableRoot from './ResizableRoot.vue'
import ResizablePanel from './ResizablePanel.vue'
import ResizableHandle from './ResizableHandle.vue'
import { RESIZABLE_PROVIDER_KEY } from './utils'
import type {
  ResizableRootProps,
  ResizableRootEmits,
  ResizablePanelConfig,
} from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<ResizableRootProps & { panels?: ResizablePanelConfig[] }>(),
  {
    direction: 'horizontal',
    panels: () => [],
  }
)

const emit = defineEmits<ResizableRootEmits>()

const normalizedPanels = computed(() =>
  (props.panels || []).map((panel, index) => ({
    id: panel.id || `${index}`,
    order: panel.order ?? index,
    ...panel,
  }))
)

const hasPanels = computed(() => normalizedPanels.value.length > 0)

const rootProps = computed(() => {
  const { panels, ...rest } = props
  return rest
})

const proxyListeners = {
  'update:modelValue': (val: number[]) => emit('update:modelValue', val),
  resizeStart: (val: { index: number }) => emit('resizeStart', val),
  resize: (val: { sizes: number[] }) => emit('resize', val),
  resizeEnd: (val: { sizes: number[] }) => emit('resizeEnd', val),
}

const slots = useSlots()
const attrs = useAttrs()

const slotBinding = computed(() => ({
  hasPanels: hasPanels.value,
  panels: normalizedPanels.value,
  rootProps: rootProps.value,
  listeners: proxyListeners,
  slots,
  attrs,
}))

provide(RESIZABLE_PROVIDER_KEY, slotBinding)

defineExpose({
  panels: normalizedPanels,
  hasPanels,
})
</script>
