<template>
  <!-- Current Tree Node -->
  <div
    class="flex items-center cursor-pointer gap-1"
    :style="{ height: rowHeight }"
    @click="(event) => toggleCollapsed(event)"
  >
    <!-- Slot to completely override the Tree Node -->
    <slot
      name="node"
      v-bind="{ node, hasChildren, isCollapsed, toggleCollapsed }"
    >
      <div ref="iconRef">
        <!-- Slot to only override the Icon -->
        <slot
          v-if="$slots['icon']"
          name="icon"
          v-bind="{ hasChildren, isCollapsed }"
        />
        <FeatherIcon
          v-else-if="hasChildren && !isCollapsed"
          name="chevron-down"
          class="h-3.5"
        />
        <FeatherIcon
          v-else-if="hasChildren"
          name="chevron-right"
          class="h-3.5"
        />
      </div>

      <!-- Slot to only override the label -->
      <slot
        v-if="$slots['label']"
        name="label"
        v-bind="{ node, hasChildren, isCollapsed }"
      />
      <div
        v-else
        class="text-base truncate"
        :class="!hasChildren ? 'pl-3.5' : ''"
      >
        {{ node.label }}
      </div>
    </slot>
  </div>

  <!-- Recursively render the children -->
  <div v-if="hasChildren && !isCollapsed" class="flex">
    <div
      :style="{ paddingLeft: linePadding }"
      class="border-r"
      v-if="showLines"
    ></div>
    <ul class="w-full" :style="{ paddingLeft: indentWidth }">
      <li v-for="(child, index) in node.children" :key="index">
        <Tree
          :node="child"
          :rowHeight="rowHeight"
          :indentWidth="indentWidth"
          :showLines="showLines"
        >
          <!-- Pass the parent slots to the children of current node -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import FeatherIcon from './FeatherIcon.vue'

interface TreeNode {
  label: string
  children: TreeNode[]
}

interface TreeProps {
  node: TreeNode
  rowHeight?: string
  indentWidth?: string
  showLines?: boolean
}

const props = withDefaults(defineProps<TreeProps>(), {
  rowHeight: '25px',
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

const linePadding = ref('')

const iconRef = ref<HTMLElement | null>(null)

const toggleCollapsed = (event: MouseEvent) => {
  event.stopPropagation()
  if (hasChildren.value) isCollapsed.value = !isCollapsed.value
}

onMounted(() => {
  if (iconRef.value?.offsetWidth) {
    // Set the padding for the LHS line to align with the center of icon
    linePadding.value = iconRef.value.offsetWidth / 2 + 'px'
  }
})
</script>
