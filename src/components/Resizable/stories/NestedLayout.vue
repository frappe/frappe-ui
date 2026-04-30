<script setup>
import { useStorage } from '@vueuse/core'
import { Resizable, ResizableRoot, ResizablePanel, ResizableHandle } from 'frappe-ui'

const outerSizes = useStorage('nested-demo-outer', [30, 70])
const innerSizes = useStorage('nested-demo-inner', [50, 50])
</script>

<template>
  <div class="space-y-4">
    <div class="h-[600px] border rounded-lg overflow-hidden">
      <Resizable
        v-model="outerSizes"
        direction="horizontal"
        :panels="[
          { id: 'sidebar', minSize: 20, maxSize: 30 },
          { id: 'content', minSize: 40 }
        ]"
      >
        <template #panel-sidebar>
          <div class="flex-1 w-full bg-indigo-50 p-4">
            <h4 class="font-bold text-indigo-900 mb-2">Sidebar</h4>
            <p class="text-sm text-indigo-700">{{ outerSizes[0]?.toFixed(1) }}%</p>
            <div class="mt-4 space-y-2">
              <div class="p-2 bg-indigo-100 rounded text-xs">Menu Item 1</div>
              <div class="p-2 bg-indigo-100 rounded text-xs">Menu Item 2</div>
              <div class="p-2 bg-indigo-100 rounded text-xs">Menu Item 3</div>
            </div>
          </div>
        </template>
        <template #panel-content>
          <div class="flex-1 w-full bg-white">
            <Resizable
              v-model="innerSizes"
              direction="vertical"
              :panels="[
                { id: 'top', minSize: 30 },
                { id: 'bottom', minSize: 30 }
              ]"
            >
              <template #panel-top>
                <div class="flex-1 w-full bg-blue-50 p-4">
                  <h4 class="font-bold text-blue-900 mb-2">Top Content</h4>
                  <p class="text-sm text-blue-700">{{ innerSizes[0]?.toFixed(1) }}%</p>
                  <p class="text-xs text-blue-600 mt-2">This is a nested vertical layout inside the horizontal layout.</p>
                </div>
              </template>
              <template #panel-bottom>
                <div class="flex-1 w-full bg-green-50 p-4">
                  <h4 class="font-bold text-green-900 mb-2">Bottom Content</h4>
                  <p class="text-sm text-green-700">{{ innerSizes[1]?.toFixed(1) }}%</p>
                  <p class="text-xs text-green-600 mt-2">You can nest resizable layouts to create complex interfaces.</p>
                </div>
              </template>
            </Resizable>
          </div>
        </template>
      </Resizable>
    </div>
  </div>
</template>
