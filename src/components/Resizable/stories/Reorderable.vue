<script setup>
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { Resizable, FeatherIcon } from 'frappe-ui'

const panels = useStorage('reorderable-story-panels', [
  { id: 'panel-1', label: 'Panel 1', color: 'bg-blue-50', textColor: 'text-blue-900', minSize: 15 },
  { id: 'panel-2', label: 'Panel 2', color: 'bg-green-50', textColor: 'text-green-900', minSize: 15 },
  { id: 'panel-3', label: 'Panel 3', color: 'bg-purple-50', textColor: 'text-purple-900', minSize: 15 },
  { id: 'panel-4', label: 'Panel 4', color: 'bg-orange-50', textColor: 'text-orange-900', minSize: 15 }
])

const panelSizes = useStorage('reorderable-story-sizes', [25, 25, 25, 25])
const draggedIndex = ref(null)
const dragOverIndex = ref(null)

const handleDragStart = (index) => {
  draggedIndex.value = index
}

const handleDragOver = (e, index) => {
  e.preventDefault()
  dragOverIndex.value = index
}

const handleDrop = (e, index) => {
  e.preventDefault()
  
  if (draggedIndex.value === null || draggedIndex.value === index) {
    draggedIndex.value = null
    dragOverIndex.value = null
    return
  }

  // Reorder panels
  const newPanels = [...panels.value]
  const [movedPanel] = newPanels.splice(draggedIndex.value, 1)
  newPanels.splice(index, 0, movedPanel)
  panels.value = newPanels

  // Reorder sizes
  const newSizes = [...panelSizes.value]
  const [movedSize] = newSizes.splice(draggedIndex.value, 1)
  newSizes.splice(index, 0, movedSize)
  panelSizes.value = newSizes

  draggedIndex.value = null
  dragOverIndex.value = null
}

const handleDragEnd = () => {
  draggedIndex.value = null
  dragOverIndex.value = null
}
</script>

<template>
  <div class="space-y-4">
    <div class="h-[550px] border rounded-lg overflow-hidden">
      <Resizable
        v-model="panelSizes"
        direction="horizontal"
        :panels="panels.map((p, i) => ({ 
          id: p.id, 
          minSize: p.minSize,
          order: i 
        }))"
      >
        <template v-for="(panel, index) in panels" :key="panel.id" #[`panel-${panel.id}`]>
          <div 
            class="h-full w-full flex flex-col"
            :class="[
              panel.color,
              dragOverIndex === index && draggedIndex !== index ? 'ring-2 ring-blue-500' : ''
            ]"
            @dragover="handleDragOver($event, index)"
            @drop="handleDrop($event, index)"
          >
            <div 
              class="px-4 py-3 border-b cursor-move select-none flex items-center justify-between"
              :class="[
                panel.color === 'bg-blue-50' ? 'border-blue-200 bg-blue-100' :
                panel.color === 'bg-green-50' ? 'border-green-200 bg-green-100' :
                panel.color === 'bg-purple-50' ? 'border-purple-200 bg-purple-100' :
                'border-orange-200 bg-orange-100',
                draggedIndex === index ? 'opacity-50' : ''
              ]"
              draggable="true"
              @dragstart="handleDragStart(index)"
              @dragend="handleDragEnd"
              title="Drag to reorder"
            >
              <div class="flex items-center gap-2">
                <FeatherIcon name="grip-vertical" class="w-4 h-4 opacity-50" />
                <span class="font-semibold" :class="panel.textColor">{{ panel.label }}</span>
              </div>
            </div>

            <div class="flex-1 flex items-center justify-center p-4">
              <div class="text-center">
                <div class="text-4xl font-bold mb-2" :class="panel.textColor">
                  {{ index + 1 }}
                </div>
                <p class="text-sm" :class="panel.textColor">
                  Size: {{ panelSizes[index]?.toFixed(1) }}%
                </p>
              </div>
            </div>
          </div>
        </template>
      </Resizable>
    </div>
  </div>
</template>

<style scoped>
[draggable="true"] {
  transition: opacity 0.2s;
}

[draggable="true"]:active {
  cursor: grabbing;
}
</style>
