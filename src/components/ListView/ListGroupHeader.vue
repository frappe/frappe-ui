<template>
  <div class="flex items-center px-2 py-1.5">
    <button @click="toggleGroup" class="-ml-[1px] rounded-sm hover:bg-gray-50">
      <DownSolid
        class="h-4 w-4 text-gray-900 transition-transform duration-200"
        :class="[group.collapsed ? '-rotate-90' : '']"
      />
    </button>
    <div class="ml-[15px] w-full">
      <slot>
        <span class="text-base font-medium leading-6">
          {{ group.group }}
        </span>
      </slot>
    </div>
  </div>
  <div class="mx-2 h-px border-t border-gray-200"></div>
</template>
<script setup>
import DownSolid from '../../icons/DownSolid.vue'

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
})

function toggleGroup() {
  if (props.group.collapsed == null) {
    props.group.collapsed = false
  }
  props.group.collapsed = !props.group.collapsed
}
</script>
