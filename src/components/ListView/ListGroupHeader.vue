<template>
  <div class="flex items-center">
    <button
      @click="toggleGroup"
      class="ml-[3px] mr-[11px] rounded p-1 hover:bg-surface-gray-2"
    >
      <DownSolid
        class="h-4 w-4 text-ink-gray-6 transition-transform duration-200"
        :class="[group.collapsed ? '-rotate-90' : '']"
      />
    </button>
    <slot>
      <div class="w-full py-1.5 pr-2">
        <component
          v-if="list.slots['group-header']"
          :is="list.slots['group-header']"
          v-bind="{ group }"
        />
        <span v-else class="text-base font-medium leading-6">
          {{ group.group }}
        </span>
      </div>
    </slot>
  </div>
  <div class="mx-2 h-px border-t border-outline-gray-modals"></div>
</template>
<script setup>
import { inject } from 'vue'
import DownSolid from '../../icons/DownSolid.vue'

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
})

const list = inject('list')

function toggleGroup() {
  if (props.group.collapsed == null) {
    props.group.collapsed = false
  }
  props.group.collapsed = !props.group.collapsed
}
</script>
