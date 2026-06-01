<template>
  <div class="grid gap-px mb-4" :style="gridStyle">
    <div
      v-for="(item, idx) in images"
      :key="item.id"
      :draggable="true"
      @dragstart="onDragStart(idx)"
      @dragover.prevent="onDragOver(idx)"
      @drop="onDrop(idx)"
      @dragend="onDragEnd"
      @dragleave="onDragLeave(idx)"
      :class="{ 'ring-2 ring-primary-400 z-10': isDropTarget(idx) }"
    >
      <ImageGroupGridCell
        :item="item"
        @remove="$emit('remove', idx)"
        @update:caption="(caption) => $emit('update-caption', { index: idx, caption })"
      />
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
  if (
    draggedIndex.value !== null &&
    draggedIndex.value !== idx
  ) {
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
