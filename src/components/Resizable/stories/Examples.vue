<script setup>
import { useStorage } from '@vueuse/core'
import { Resizable } from 'frappe-ui'

const basicSizes = useStorage('basic-horizontal-demo', [50, 50])
const verticalSizes = useStorage('vertical-demo', [40, 60])
const threePanelSizes = useStorage('three-panel-demo', [25, 50, 25])
</script>

<template>
  <div class="space-y-8">
    <div>
      <h3 class="text-lg font-semibold mb-3">Basic Horizontal Resizable</h3>
      <div class="h-[400px] border rounded-lg overflow-hidden">
        <Resizable
          v-model="basicSizes"
          direction="horizontal"
          :panels="[
            { id: 'left', minSize: 20 },
            { id: 'right', minSize: 20 }
          ]"
        >
          <template #panel-left>
            <div class="flex-1 w-full bg-blue-50 flex flex-col items-center justify-center text-blue-900 font-semibold text-center p-4">
              <div>Left Panel ({{ basicSizes[0]?.toFixed(1) }}%)</div>                
            </div>
          </template>
          <template #panel-right>
            <div class="flex-1 w-full bg-green-50 flex items-center justify-center text-green-900 font-semibold">
              Right Panel ({{ basicSizes[1]?.toFixed(1) }}%)
            </div>
          </template>
        </Resizable>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-3">Vertical Resizable</h3>
      <div class="h-[500px] border rounded-lg overflow-hidden">
        <Resizable
          v-model="verticalSizes"
          direction="vertical"
          :panels="[
            { id: 'top', minSize: 25 },
            { id: 'bottom', minSize: 25 }
          ]"
        >
          <template #panel-top>
            <div class="flex-1 w-full bg-purple-50 flex items-center justify-center text-purple-900 font-semibold">
              Top Panel ({{ verticalSizes[0]?.toFixed(1) }}%)
            </div>
          </template>
          <template #panel-bottom>
            <div class="flex-1 w-full bg-orange-50 flex items-center justify-center text-orange-900 font-semibold">
              Bottom Panel ({{ verticalSizes[1]?.toFixed(1) }}%)
            </div>
          </template>
        </Resizable>
      </div>
    </div>

    <div>
      <h3 class="text-lg font-semibold mb-3">Three Panel Layout</h3>
      <div class="h-[450px] border rounded-lg overflow-hidden">
        <Resizable
          v-model="threePanelSizes"
          direction="horizontal"
          :panels="[
            { id: 'sidebar', minSize: 15, maxSize: 40 },
            { id: 'main', minSize: 30 },
            { id: 'aside', minSize: 15, maxSize: 40 }
          ]"
        >
          <template #panel-sidebar>
            <div class="flex-1 w-full bg-indigo-50 flex items-center justify-center text-indigo-900 font-semibold p-4 text-center">
              Sidebar<br/>{{ threePanelSizes[0]?.toFixed(1) }}%
            </div>
          </template>
          <template #panel-main>
            <div class="flex-1 w-full bg-gray-50 flex items-center justify-center text-gray-900 font-semibold p-4 text-center">
              Main Content<br/>{{ threePanelSizes[1]?.toFixed(1) }}%
            </div>
          </template>
          <template #panel-aside>
            <div class="flex-1 w-full bg-pink-50 flex items-center justify-center text-pink-900 font-semibold p-4 text-center">
              Aside<br/>{{ threePanelSizes[2]?.toFixed(1) }}%
            </div>
          </template>
        </Resizable>
      </div>
    </div>
  </div>
</template>
