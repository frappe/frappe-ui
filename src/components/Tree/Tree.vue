<template>
  <!-- Current Tree Node -->
  <slot
    name="node"
    v-bind="{ node, hasChildren, isCollapsed, toggleCollapsed }"
  >
    <div
      class="flex items-center cursor-pointer gap-1"
      :style="{ height: options.rowHeight }"
      @click="toggleCollapsed"
    >
      <div ref="iconRef">
        <!-- slot to only override the Icon -->
        <slot name="icon" v-bind="{ hasChildren, isCollapsed }">
          <FeatherIcon
            v-if="hasChildren && !isCollapsed"
            name="chevron-down"
            class="h-3.5"
          />
          <FeatherIcon
            v-else-if="hasChildren"
            name="chevron-right"
            class="h-3.5"
          />
        </slot>
      </div>

      <!-- slot to only override the label -->
      <slot name="label" v-bind="{ node, hasChildren, isCollapsed }">
        <div class="text-base truncate" :class="hasChildren ? '' : 'pl-3.5'">
          {{ node.label }}
        </div>
      </slot>
    </div>
  </slot>

  <!-- Recursively render the children -->
  <div v-if="hasChildren && !isCollapsed" class="flex">
    <div
      :style="{ paddingLeft: linePadding }"
      class="border-r"
      v-if="options.showIndentationGuides"
    ></div>
    <ul class="w-full" :style="{ paddingLeft: options.indentWidth }">
      <li v-for="child in node.children" :key="child[nodeKey] as string">
        <Tree :node="child" :nodeKey="nodeKey" :options="options">
          <!-- Pass the parent slots to the children of current node -->
          <template #node="{ node, hasChildren, isCollapsed, toggleCollapsed }">
            <slot
              name="node"
              v-bind="{ node, hasChildren, isCollapsed, toggleCollapsed }"
            />
          </template>

          <template #icon="{ hasChildren, isCollapsed }">
            <slot name="icon" v-bind="{ hasChildren, isCollapsed }" />
          </template>

          <template #label="{ node, hasChildren, isCollapsed }">
            <slot name="label" v-bind="{ node, hasChildren, isCollapsed }" />
          </template>
        </Tree>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FeatherIcon from '../FeatherIcon.vue'
import type { TreeNode, TreeProps } from './types'

const props = withDefaults(defineProps<TreeProps>(), {
  options: () => ({
    rowHeight: '25px',
    indentWidth: '20px',
    showIndentationGuides: true,
  }),
})

const slots = defineSlots<{
  node: {
    node: TreeNode
    hasChildren: boolean
    isCollapsed: boolean
    toggleCollapsed: (event: MouseEvent) => void
  }
  icon: {
    hasChildren: boolean
    isCollapsed: boolean
  }
  label: {
    node: TreeNode
    hasChildren: boolean
    isCollapsed: boolean
  }
}>()

const isCollapsed = ref(true)

const linePadding = ref('')

const hasChildren = computed(() => props.node.children?.length > 0)

const iconRef = ref<HTMLElement | null>(null)

const toggleCollapsed = (event: MouseEvent) => {
  event.stopPropagation()
  if (hasChildren.value) isCollapsed.value = !isCollapsed.value
}

onMounted(() => {
  if (iconRef.value?.clientWidth)
    // Set the padding for the LHS line to align with the center of icon
    linePadding.value = iconRef.value.clientWidth / 2 + 'px'
})
</script>
