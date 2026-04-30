<script setup>
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { Resizable, Button, FeatherIcon } from 'frappe-ui'

const collapsibleSizes = useStorage('collapsible-demo-v2', [25, 50, 25])
const panels = ref([
  { id: 'nav', minSize: 15, maxSize: 30, collapsible: true, collapsedSize: 5 },
  { id: 'main', minSize: 30 },
  { id: 'aside', minSize: 15, maxSize: 30, collapsible: true, collapsedSize: 0 }
])
</script>

<template>
  <div class="space-y-4">
    <div class="h-[500px] border rounded-lg overflow-hidden">
      <Resizable
        v-model="collapsibleSizes"
        direction="horizontal"
        :panels="panels"
      >
        <template #panel-nav>
          <div class="flex-1 w-full bg-indigo-50 border-r border-indigo-100 flex flex-col items-center justify-center p-2 text-center transition-all overflow-hidden relative">
            <div v-if="collapsibleSizes[0] <= panels[0].collapsedSize" class="absolute inset-0 flex items-center justify-center bg-indigo-100 cursor-pointer" title="Expand">
              <FeatherIcon name="menu" class="w-4 h-4 text-indigo-600" />
            </div>
            <template v-else>
              <FeatherIcon name="sidebar" class="w-6 h-6 text-indigo-600 mb-2" />
              <span class="font-bold text-indigo-900">Navigation</span>
              <span class="text-xs text-indigo-700 mt-1">{{ collapsibleSizes[0]?.toFixed(1) }}%</span>
              <div v-if="collapsibleSizes[0] > 15" class="mt-4 space-y-2 w-full px-2">
                <div class="p-2 bg-indigo-100 rounded text-xs">Dashboard</div>
                <div class="p-2 bg-indigo-100 rounded text-xs">Projects</div>
                <div class="p-2 bg-indigo-100 rounded text-xs">Settings</div>
              </div>
            </template>
          </div>
        </template>
        
        <template #panel-main>
          <div class="flex-1 w-full bg-white flex flex-col items-center justify-center p-4">
            <h3 class="font-bold text-gray-900 text-lg">Main Content Area</h3>
            <p class="text-sm text-gray-500 mt-2">This panel cannot collapse</p>
            <p class="text-xs text-gray-400 mt-2">{{ collapsibleSizes[1]?.toFixed(1) }}%</p>
          </div>
        </template>

        <template #panel-aside>
          <div class="flex-1 w-full bg-amber-50 border-l border-amber-100 flex flex-col items-center justify-center p-2 text-center transition-all overflow-hidden relative">
            <div v-if="collapsibleSizes[2] <= panels[2].collapsedSize" class="absolute inset-0 flex items-center justify-center bg-amber-100 cursor-pointer" title="Expand">
              <FeatherIcon name="help-circle" class="w-4 h-4 text-amber-600" />
            </div>
            <template v-else>
              <FeatherIcon name="info" class="w-6 h-6 text-amber-600 mb-2" />
              <span class="font-bold text-amber-900">Info Panel</span>
              <span class="text-xs text-amber-700 mt-1">{{ collapsibleSizes[2]?.toFixed(1) }}%</span>
              <div v-if="collapsibleSizes[2] > 15" class="mt-4 text-xs text-amber-800">
                <p>Additional information and details appear here when the panel is expanded.</p>
              </div>
            </template>
          </div>
        </template>
      </Resizable>
    </div>

  
  </div>
</template>
