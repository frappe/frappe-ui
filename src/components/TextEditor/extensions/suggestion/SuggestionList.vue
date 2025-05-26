<template>
  <div
    v-if="items.length"
    ref="container"
    class="relative max-h-[300px] min-w-40 overflow-y-auto rounded-lg bg-surface-white p-1 text-base shadow-lg"
    :class="containerClass"
  >
    <button
      v-for="(item, index) in items"
      :key="index"
      :ref="
        (el) => {
          if (el) itemRefs[index] = el as HTMLButtonElement
        }
      "
      :class="[
        'flex w-full items-center whitespace-nowrap rounded-md px-2 py-1.5 text-sm text-ink-gray-9',
        index === selectedIndex ? 'bg-surface-gray-2' : '',
        itemClass,
      ]"
      @click="selectItem(index)"
      @mouseover="selectedIndex = index"
    >
      <slot :item="item" :index="index">
        <span>{{ item.display || item.title || item.name }}</span>
      </slot>
    </button>
    <div
      v-if="!items.length && showNoResults"
      class="px-3 py-1.5 text-sm text-ink-gray-5"
    >
      No results
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type PropType, nextTick, onBeforeUpdate } from 'vue'
import type { BaseSuggestionItem } from './createSuggestionExtension'

const props = defineProps({
  items: {
    type: Array as PropType<BaseSuggestionItem[]>,
    required: true,
  },
  command: {
    type: Function as PropType<(item: BaseSuggestionItem) => void>,
    required: true,
  },
  containerClass: {
    type: String,
    default: '',
  },
  itemClass: {
    type: String,
    default: '',
  },
  showNoResults: {
    type: Boolean,
    default: false,
  },
})

const selectedIndex = ref(0)
const container = ref<HTMLDivElement | null>(null)
const itemRefs = ref<HTMLButtonElement[]>([])

onBeforeUpdate(() => {
  itemRefs.value = []
})

const scrollIntoView = () => {
  nextTick(() => {
    const selectedElement = itemRefs.value[selectedIndex.value]
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' })
    }
  })
}

const selectItem = (index: number) => {
  const item = props.items[index]
  if (item) {
    props.command(item)
  }
}

const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
  if (!props.items.length) return false

  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }
  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }
  if (event.key === 'Enter') {
    enterHandler()
    return true
  }
  return false
}

const upHandler = () => {
  selectedIndex.value =
    (selectedIndex.value + props.items.length - 1) % props.items.length
  scrollIntoView()
}

const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
  scrollIntoView()
}

const enterHandler = () => {
  selectItem(selectedIndex.value)
}

watch(
  () => props.items,
  () => {
    selectedIndex.value = 0
  },
)

defineExpose({
  onKeyDown,
})
</script>
