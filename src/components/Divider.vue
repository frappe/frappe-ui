<template>
  <component
    :is="props.action ? 'div' : 'hr'"
    class="relative whitespace-nowrap border-0 border-gray-300"
    :class="alignmentClasses"
  >
    <span class="absolute" v-if="props.action" :class="actionAlignmentClasses">
      <Button
        :label="props.action?.label"
        :loading="props.action?.loading"
        size="sm"
        variant="outline"
        @click="props.action?.handler"
      />
    </span>
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Button } from '../index'

interface DividerAction {
  label: string
  handler: () => any
  loading?: boolean
}

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  position?: 'start' | 'center' | 'end'
  flexItem?: boolean
  action?: DividerAction
}

const props = withDefaults(defineProps<DividerProps>(), {
  orientation: 'horizontal',
  position: 'center',
})

const alignmentClasses = computed(() => {
  let spacerDimensionClasses = {
    horizontal: 'border-t-[1px] w-full',
    vertical: 'border-l-[1px]',
  }[props.orientation]

  // Case when divider is inside a flex container
  let flexClasses = props.flexItem ? 'self-stretch h-auto' : 'h-full'

  return [spacerDimensionClasses, flexClasses]
})

const actionAlignmentClasses = computed(() => {
  return {
    horizontal: {
      center: 'left-1/2 top-0 -translate-y-2/4 -translate-x-1/2',
      start: 'left-0 top-0 -translate-y-2/4 ml-4',
      end: 'right-0 -translate-y-2/4 mr-4',
    },
    vertical: {
      center: '-translate-x-2/4 top-1/2 left-0 -translate-y-1/2',
      start: '-translate-x-2/4 top-0 mt-4 left-0',
      end: '-translate-x-2/4 bottom-0 mb-4 left-0',
    },
  }[props.orientation][props.position]
})
</script>
