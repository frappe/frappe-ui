<template>
  <div
    class="flex items-center cursor-pointer gap-1"
    :style="{ height: lineHeight }"
    @click="(event) => toggleCollapsed(event)"
  >
    <slot
      name="node"
      v-bind="{ node, hasChildren, isCollapsed, toggleCollapsed }"
    >
      <slot
        v-if="$slots['icon']"
        name="icon"
        v-bind="{ hasChildren, isCollapsed }"
      />
      <FeatherIcon v-else-if="!isCollapsed" name="chevron-down" class="h-3.5" />
      <FeatherIcon v-else-if="hasChildren" name="chevron-right" class="h-3.5" />
      <slot
        v-if="$slots['label']"
        name="label"
        v-bind="{ node, hasChildren, isCollapsed }"
      />
      <div
        v-else
        class="text-base truncate"
        :class="!hasChildren ? 'pl-4.5' : ''"
      >
        {{ node.label }}
      </div>
    </slot>
  </div>
  <ul
    v-if="hasChildren && !isCollapsed"
    class="w-full"
    :style="{ paddingLeft: indentWidth }"
  >
    <li v-for="(child, index) in node.children" :key="index">
      <Tree :node="child" :lineHeight="lineHeight" :indentWidth="indentWidth">
        <template #node="{ node, isCollapsed, hasChildren, toggleCollapsed }">
          <slot
            name="node"
            v-bind="{ node, hasChildren, isCollapsed, toggleCollapsed }"
          />
        </template>
        <template v-if="$slots['icon']" #icon="{ isCollapsed, hasChildren }">
          <slot name="icon" v-bind="{ hasChildren, isCollapsed }" />
        </template>
        <template
          v-if="$slots['label']"
          #label="{ node, hasChildren, isCollapsed }"
        >
          <slot name="label" v-bind="{ node, hasChildren, isCollapsed }" />
        </template>
      </Tree>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import FeatherIcon from './FeatherIcon.vue'

interface TreeNode {
  label: string
  children: TreeNode[]
}

interface TreeProps {
  node: TreeNode
  lineHeight?: string
  indentWidth?: string
}

const props = withDefaults(defineProps<TreeProps>(), {
  lineHeight: '20px',
  indentWidth: '20px',
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

const hasChildren = computed(() => props.node.children?.length > 0)

const toggleCollapsed = (event: MouseEvent) => {
  event.stopPropagation()
  if (hasChildren.value) isCollapsed.value = !isCollapsed.value
}
</script>
