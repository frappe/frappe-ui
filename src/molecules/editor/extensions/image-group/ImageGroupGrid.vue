<template>
  <!-- The dialog grid is a workbench, not a 1:1 preview: cells get gaps and
       rounding so each image reads as a manipulable object. The inserted
       gallery node keeps its tight gap-px collage look. -->
  <div class="grid gap-2 mb-4" :style="gridStyle">
    <div
      v-for="(item, idx) in images"
      :key="item.id"
      :draggable="true"
      @dragstart="onDragStart(idx)"
      @dragover.prevent="onDragOver(idx)"
      @drop="onDrop(idx)"
      @dragend="onDragEnd"
      @dragleave="onDragLeave(idx)"
      class="group cursor-grab rounded transition-opacity active:cursor-grabbing"
      :class="{
        'ring-2 ring-outline-gray-4 ring-offset-1 z-10': isDropTarget(idx),
        'opacity-50': draggedIndex === idx,
      }"
    >
      <div class="relative">
        <div
          class="absolute left-1 top-1 z-10 rounded bg-white/80 p-1 text-ink-gray-6 opacity-100 shadow-sm sm:opacity-0 sm:group-hover:opacity-100"
          aria-hidden="true"
        >
          <span class="lucide-grip size-3" />
        </div>
        <ImageGroupGridCell
          :item="item"
          @remove="$emit('remove', idx)"
          @retry="$emit('retry', idx)"
          @update:caption="
            (caption) => $emit('update-caption', { index: idx, caption })
          "
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ImageGroupGridCell from './ImageGroupGridCell.vue'
import { clampColumns } from './image-group-utils'
import type { ImageItem } from './useImageGroupDialog'

const props = defineProps<{
  images: ImageItem[]
  columns: number
}>()

const emit = defineEmits<{
  remove: [index: number]
  retry: [index: number]
  'update-caption': [payload: { index: number; caption: string }]
  reorder: [payload: { from: number; to: number }]
}>()

const draggedIndex = ref<number | null>(null)
const overIndex = ref<number | null>(null)

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${clampColumns(props.columns)}, minmax(0, 1fr))`,
}))

function onDragStart(idx: number) {
  draggedIndex.value = idx
}

function onDragOver(idx: number) {
  overIndex.value = idx
}

function onDrop(idx: number) {
  if (draggedIndex.value !== null && draggedIndex.value !== idx) {
    emit('reorder', { from: draggedIndex.value, to: idx })
  }
  draggedIndex.value = null
  overIndex.value = null
}

function onDragEnd() {
  draggedIndex.value = null
  overIndex.value = null
}

function onDragLeave(idx: number) {
  if (overIndex.value === idx) overIndex.value = null
}

function isDropTarget(idx: number): boolean {
  return (
    overIndex.value === idx &&
    draggedIndex.value !== null &&
    draggedIndex.value !== idx
  )
}
</script>
