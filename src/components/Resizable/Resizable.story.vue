<script setup>
import { ref } from 'vue'
import { ResizableRoot, ResizablePanel, ResizableHandle } from './index'

const horizontalSizes = ref([33, 34, 33])
const verticalSizes = ref([50, 50])
const controlledSizes = ref([40, 60])

const handleResizeEnd = (payload) => {
  console.log('Resize ended with sizes:', payload.sizes)
}
</script>

<template>
  <div class="p-8 space-y-12">
    <div>
      <h1 class="text-2xl font-bold mb-2">Resizable Component</h1>
      <p class="text-gray-600 mb-6">
        A flexible resizable panel component with support for horizontal and vertical layouts,
        keyboard navigation, touch support, and persistence.
      </p>
    </div>

    <!-- Basic Horizontal -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Basic Horizontal Layout</h2>
      <div class="border rounded-lg overflow-hidden" style="height: 300px">
        <ResizableRoot direction="horizontal" :default-value="[50, 50]">
          <ResizablePanel>
            <div class="h-full bg-blue-50 p-6 flex items-center justify-center">
              <p class="text-blue-900 font-medium">Left Panel</p>
            </div>
          </ResizablePanel>
          
          <ResizableHandle :index="0" />
          
          <ResizablePanel>
            <div class="h-full bg-green-50 p-6 flex items-center justify-center">
              <p class="text-green-900 font-medium">Right Panel</p>
            </div>
          </ResizablePanel>
        </ResizableRoot>
      </div>
    </section>

    <!-- Basic Vertical -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Basic Vertical Layout</h2>
      <div class="border rounded-lg overflow-hidden" style="height: 400px">
        <ResizableRoot direction="vertical" :default-value="[50, 50]">
          <ResizablePanel>
            <div class="h-full bg-purple-50 p-6 flex items-center justify-center">
              <p class="text-purple-900 font-medium">Top Panel</p>
            </div>
          </ResizablePanel>
          
          <ResizableHandle :index="0" />
          
          <ResizablePanel>
            <div class="h-full bg-orange-50 p-6 flex items-center justify-center">
              <p class="text-orange-900 font-medium">Bottom Panel</p>
            </div>
          </ResizablePanel>
        </ResizableRoot>
      </div>
    </section>

    <!-- Three Panels with Constraints -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Three Panels with Size Constraints</h2>
      <div class="border rounded-lg overflow-hidden" style="height: 300px">
        <ResizableRoot 
          direction="horizontal" 
          v-model="horizontalSizes"
          @resize-end="handleResizeEnd"
        >
          <ResizablePanel :min-size="20" :max-size="40">
            <div class="h-full bg-red-50 p-6 flex items-center justify-center">
              <div class="text-center">
                <p class="text-red-900 font-medium">Sidebar</p>
                <p class="text-xs text-red-600 mt-2">Min: 20% | Max: 40%</p>
                <p class="text-xs text-red-700 mt-1">{{ Math.round(horizontalSizes[0]) }}%</p>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle :index="0" />
          
          <ResizablePanel :min-size="30">
            <div class="h-full bg-blue-50 p-6 flex items-center justify-center">
              <div class="text-center">
                <p class="text-blue-900 font-medium">Main Content</p>
                <p class="text-xs text-blue-600 mt-2">Min: 30%</p>
                <p class="text-xs text-blue-700 mt-1">{{ Math.round(horizontalSizes[1]) }}%</p>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle :index="1" />
          
          <ResizablePanel :min-size="15" :max-size="35">
            <div class="h-full bg-green-50 p-6 flex items-center justify-center">
              <div class="text-center">
                <p class="text-green-900 font-medium">Properties</p>
                <p class="text-xs text-green-600 mt-2">Min: 15% | Max: 35%</p>
                <p class="text-xs text-green-700 mt-1">{{ Math.round(horizontalSizes[2]) }}%</p>
              </div>
            </div>
          </ResizablePanel>
        </ResizableRoot>
      </div>
    </section>

    <!-- Collapsible Panel -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Collapsible Panel</h2>
      <p class="text-sm text-gray-600 mb-3">
        Resize the right panel below its minimum size to collapse it.
      </p>
      <div class="border rounded-lg overflow-hidden" style="height: 300px">
        <ResizableRoot direction="horizontal" :default-value="[70, 30]">
          <ResizablePanel :min-size="40">
            <div class="h-full bg-indigo-50 p-6 flex items-center justify-center">
              <p class="text-indigo-900 font-medium">Main Panel</p>
            </div>
          </ResizablePanel>
          
          <ResizableHandle :index="0" />
          
          <ResizablePanel 
            :min-size="20" 
            :collapsible="true" 
            :collapsed-size="5"
            @collapse="() => console.log('Panel collapsed')"
            @expand="() => console.log('Panel expanded')"
          >
            <div class="h-full bg-pink-50 p-6 flex items-center justify-center">
              <p class="text-pink-900 font-medium">Collapsible Panel</p>
            </div>
          </ResizablePanel>
        </ResizableRoot>
      </div>
    </section>

    <!-- Nested Layout -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Nested Resizable Layout</h2>
      <div class="border rounded-lg overflow-hidden" style="height: 500px">
        <ResizableRoot direction="horizontal" :default-value="[30, 70]">
          <ResizablePanel :min-size="20" :max-size="40">
            <div class="h-full bg-teal-50 p-4">
              <p class="text-teal-900 font-medium mb-4">Sidebar</p>
              <div class="space-y-2 text-sm text-teal-700">
                <div>📁 src/</div>
                <div class="ml-4">📄 index.ts</div>
                <div class="ml-4">📄 App.vue</div>
                <div>📁 components/</div>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle :index="0" />
          
          <ResizablePanel :min-size="50">
            <ResizableRoot direction="vertical" :default-value="[70, 30]">
              <ResizablePanel :min-size="40">
                <div class="h-full bg-gray-50 p-4">
                  <p class="text-gray-900 font-medium mb-4">Editor</p>
                  <div class="font-mono text-xs text-gray-700">
                    <div><span class="text-purple-600">import</span> { ref } from 'vue'</div>
                    <div><span class="text-blue-600">const</span> count = ref(0)</div>
                  </div>
                </div>
              </ResizablePanel>
              
              <ResizableHandle :index="0" />
              
              <ResizablePanel :min-size="20" :max-size="50">
                <div class="h-full bg-gray-900 p-4">
                  <p class="text-green-400 font-medium mb-4">Terminal</p>
                  <div class="font-mono text-xs text-green-400">
                    <div>$ npm run dev</div>
                    <div class="text-gray-500 mt-2">Server running on http://localhost:3000</div>
                  </div>
                </div>
              </ResizablePanel>
            </ResizableRoot>
          </ResizablePanel>
        </ResizableRoot>
      </div>
    </section>

    <!-- With Storage -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Persistent Layout (LocalStorage)</h2>
      <p class="text-sm text-gray-600 mb-3">
        Resize the panels below. The layout will be saved and restored when you reload the page.
      </p>
      <div class="border rounded-lg overflow-hidden" style="height: 300px">
        <ResizableRoot 
          direction="horizontal" 
          :default-value="[50, 50]"
          storage-key="demo-resizable-layout"
        >
          <ResizablePanel>
            <div class="h-full bg-yellow-50 p-6 flex items-center justify-center">
              <p class="text-yellow-900 font-medium">Left (Persistent)</p>
            </div>
          </ResizablePanel>
          
          <ResizableHandle :index="0" />
          
          <ResizablePanel>
            <div class="h-full bg-cyan-50 p-6 flex items-center justify-center">
              <p class="text-cyan-900 font-medium">Right (Persistent)</p>
            </div>
          </ResizablePanel>
        </ResizableRoot>
      </div>
    </section>

    <!-- Disabled -->
    <section>
      <h2 class="text-xl font-semibold mb-4">Disabled Resizing</h2>
      <div class="border rounded-lg overflow-hidden" style="height: 300px">
        <ResizableRoot direction="horizontal" :default-value="[50, 50]" :disabled="true">
          <ResizablePanel>
            <div class="h-full bg-gray-100 p-6 flex items-center justify-center">
              <p class="text-gray-600 font-medium">Left (Disabled)</p>
            </div>
          </ResizablePanel>
          
          <ResizableHandle :index="0" />
          
          <ResizablePanel>
            <div class="h-full bg-gray-100 p-6 flex items-center justify-center">
              <p class="text-gray-600 font-medium">Right (Disabled)</p>
            </div>
          </ResizablePanel>
        </ResizableRoot>
      </div>
    </section>

    <!-- Usage Notes -->
    <section class="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 class="font-semibold text-blue-900 mb-3">Usage Notes</h3>
      <ul class="space-y-2 text-sm text-blue-800">
        <li>• <strong>Mouse:</strong> Click and drag the handle to resize panels</li>
        <li>• <strong>Touch:</strong> Touch and drag the handle on mobile devices</li>
        <li>• <strong>Keyboard:</strong> Tab to focus handle, use Arrow keys to resize (5% per step)</li>
        <li>• <strong>Keyboard (Jump):</strong> Use Home/End keys to resize to min/max</li>
        <li>• <strong>Persistence:</strong> Use <code>storage-key</code> prop to save layout to localStorage</li>
        <li>• <strong>Controlled:</strong> Use <code>v-model</code> for controlled panel sizes</li>
        <li>• <strong>Events:</strong> Listen to <code>@resize-start</code>, <code>@resize</code>, <code>@resize-end</code></li>
      </ul>
    </section>
  </div>
</template>
