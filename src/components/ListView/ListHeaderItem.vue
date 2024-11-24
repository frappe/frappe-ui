<template>
  <div
    ref="columnRef"
    class="group flex items-center"
    :class="item.align ? alignmentMap[item.align] : 'justify-between'"
  >
    <div
      class="flex items-center space-x-2 truncate text-sm text-ink-gray-5"
      :class="$attrs.class"
    >
      <slot name="prefix" v-bind="{ item }" />
      <slot>
        <div class="truncate">
          {{ item.label }}
        </div>
      </slot>
      <slot name="suffix" v-bind="{ item }" />
    </div>
    <slot v-if="list.options.resizeColumn" name="resizer" v-bind="{ item }">
      <div
        class="flex h-4 w-2 cursor-col-resize justify-center"
        @mousedown="startResizing"
      >
        <div
          ref="resizer"
          class="h-full w-[2px] rounded-full transition-all duration-300 ease-in-out group-hover:bg-gray-400"
        />
      </div>
    </slot>
  </div>
</template>

<script setup>
import { alignmentMap } from './utils'
import { useDebounceFn } from '@vueuse/core'
import { ref, computed, inject } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  debounce: {
    type: Number,
    default: 1000,
  },
})

const emit = defineEmits(['columnWidthUpdated'])

const resizer = ref(null)
const columnRef = ref(null)

const widthInPx = computed(() => {
  if (typeof props.item.width === 'string') {
    const parsedWidth = parseInt(props.item.width)
    if (props.item.width.includes('rem')) {
      return parsedWidth * 16
    } else if (props.item.width.includes('px')) {
      return parsedWidth
    }
  }
  return columnRef.value.offsetWidth
})

const startResizing = (e) => {
  const initialX = e.clientX
  const initialWidth = widthInPx.value
  const onMouseMove = (e) => {
    document.body.classList.add('select-none')
    document.body.classList.add('cursor-col-resize')
    resizer.value.style.backgroundColor = 'rgb(199 199 199)'
    let newWidth = initialWidth + (e.clientX - initialX)

    props.item.width = `${newWidth < 50 ? 50 : newWidth}px`
    updateWidth(props.item.width)
  }
  const onMouseUp = () => {
    document.body.classList.remove('select-none')
    document.body.classList.remove('cursor-col-resize')
    resizer.value.style.backgroundColor = ''
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

const updateWidth = useDebounceFn((width) => {
  props.item.width = width
  emit('columnWidthUpdated')
}, props.debounce)

const list = inject('list')
</script>
