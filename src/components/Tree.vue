<template>
  <div
    class="flex items-center cursor-pointer gap-1"
    :style="{ height: lineHeight }"
    @click="(event) => toggleCollapsed(event)"
  >
    <slot
      name="node"
      :node="node"
      :hasChildren="hasChildren"
      :isCollapsed="isCollapsed"
      :toggleCollapsed="toggleCollapsed"
    >
      <slot
        v-if="$slots['icon']"
        name="icon"
        :hasChildren="hasChildren"
        :isCollapsed="isCollapsed"
      />
      <FeatherIcon v-else-if="!isCollapsed" name="chevron-up" class="h-3.5" />
      <FeatherIcon v-else-if="hasChildren" name="chevron-down" class="h-3.5" />
      <slot
        v-if="$slots['label']"
        name="label"
        :node="node"
        :hasChildren="hasChildren"
        :isCollapsed="isCollapsed"
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
            :node="child"
            :hasChildren="hasChildren"
            :isCollapsed="isCollapsed"
            :toggleCollapsed="toggleCollapsed"
          />
        </template>
        <template v-if="$slots['icon']" #icon="{ isCollapsed, hasChildren }">
          <slot
            name="icon"
            :hasChildren="hasChildren"
            :isCollapsed="isCollapsed"
          />
        </template>
        <template
          v-if="$slots['label']"
          #label="{ node, hasChildren, isCollapsed }"
        >
          <slot
            name="label"
            :node="node"
            :hasChildren="hasChildren"
            :isCollapsed="isCollapsed"
          />
        </template>
      </Tree>
    </li>
  </ul>
</template>

<script setup>
import { ref, computed } from 'vue'
import FeatherIcon from './FeatherIcon.vue'

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  lineHeight: {
    type: String,
    default: '20px',
  },
  indentWidth: {
    type: String,
    default: '20px',
  },
})

const isCollapsed = ref(true)

const hasChildren = computed(() => props.node.children?.length > 0)

const toggleCollapsed = (event) => {
  event.stopPropagation()
  if (hasChildren.value) isCollapsed.value = !isCollapsed.value
}
</script>
