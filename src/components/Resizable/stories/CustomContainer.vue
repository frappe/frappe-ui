<script setup>
import { useStorage } from '@vueuse/core'
import { Resizable, FeatherIcon, Button, TextInput } from 'frappe-ui'

const horizontalSizes = useStorage('vscode-layout-h', [15, 65, 20])
const verticalSizes = useStorage('vscode-vertical-auto', [70, 30])
</script>

<template>
  <div class="space-y-4">
    <div class="h-[800px] border rounded-lg overflow-hidden bg-[#1e1e1e]">

      <Resizable
        v-model="horizontalSizes"
        direction="horizontal"
        :panels="[
          { id: 'sidebar', minSize: 0, maxSize: 25, defaultSize: 15, collapsible: true, collapsedSize: 0 },
          { id: 'main', minSize: 40 },
          { id: 'chat', minSize: 0, maxSize: 30, defaultSize: 20, collapsible: true, collapsedSize: 0 }
        ]"
      >
        <template #panel-sidebar>
          <div class="h-full w-full bg-[#252526] border-r border-[#2d2d2d] flex flex-row">
            <div class="w-12 bg-[#333333] border-r border-[#2d2d2d] flex flex-col items-center py-3 gap-4">
              <div class="w-8 h-8 flex items-center justify-center text-white hover:bg-[#2a2a2a] rounded cursor-pointer">
                <FeatherIcon name="file-text" class="w-5 h-5" />
              </div>
              <div class="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-[#2a2a2a] rounded cursor-pointer">
                <FeatherIcon name="search" class="w-5 h-5" />
              </div>
              <div class="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-[#2a2a2a] rounded cursor-pointer">
                <FeatherIcon name="git-branch" class="w-5 h-5" />
              </div>
              <div class="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-[#2a2a2a] rounded cursor-pointer">
                <FeatherIcon name="package" class="w-5 h-5" />
              </div>
            </div>

            <div class="flex-1 flex flex-col">
              <div class="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Explorer
              </div>
              <div class="flex-1 overflow-auto px-2">
                <div class="space-y-1 text-sm">
                  <div class="flex items-center gap-2 px-2 py-1 text-gray-300 hover:bg-[#2a2d2e] rounded cursor-pointer">
                    <FeatherIcon name="folder" class="w-4 h-4 text-blue-400" />
                    <span>src</span>
                  </div>
                  <div class="ml-6 space-y-1">
                    <div class="flex items-center gap-2 px-2 py-1 text-gray-300 hover:bg-[#2a2d2e] rounded cursor-pointer">
                      <FeatherIcon name="folder" class="w-4 h-4 text-blue-400" />
                      <span>components</span>
                    </div>
                    <div class="ml-6 space-y-1">
                      <div class="flex items-center gap-2 px-2 py-1 text-gray-300 bg-[#37373d] rounded cursor-pointer">
                        <FeatherIcon name="file" class="w-4 h-4 text-green-400" />
                        <span>Resizable.vue</span>
                      </div>
                      <div class="flex items-center gap-2 px-2 py-1 text-gray-300 hover:bg-[#2a2d2e] rounded cursor-pointer">
                        <FeatherIcon name="file" class="w-4 h-4 text-blue-400" />
                        <span>index.ts</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 px-2 py-1 text-gray-300 hover:bg-[#2a2d2e] rounded cursor-pointer">
                    <FeatherIcon name="file" class="w-4 h-4 text-orange-400" />
                    <span>package.json</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #panel-main>
          <div class="h-full w-full">
            <Resizable
              v-model="verticalSizes"
              direction="vertical"
              :panels="[
                { id: 'editor', minSize: 30, defaultSize: 70 },
                { id: 'terminal', minSize: 20, maxSize: 80, defaultSize: 20, collapsible: true, collapsedSize: 0 }
              ]"
            >
              <template #panel-editor>
                <div class="h-full w-full bg-[#1e1e1e] flex flex-col">
                  <div class="bg-[#252526] border-b border-[#2d2d2d] flex items-center">
                    <div class="flex items-center gap-2 px-4 py-2 bg-[#1e1e1e] border-r border-[#2d2d2d] text-sm text-gray-300">
                      <FeatherIcon name="file" class="w-4 h-4 text-green-400" />
                      <span>Resizable.vue</span>
                      <FeatherIcon name="x" class="w-3 h-3 text-gray-500 hover:text-gray-300 cursor-pointer ml-2" />
                    </div>
                  </div>

                  <div class="flex-1 overflow-auto p-4 font-mono text-sm">
                    <div class="space-y-0 text-[#d4d4d4]">
                      <div class="flex">
                        <span class="w-12 text-right pr-4 text-gray-600 select-none">1</span>
                        <span><span class="text-[#569cd6]">&lt;template&gt;</span></span>
                      </div>
                      <div class="flex">
                        <span class="w-12 text-right pr-4 text-gray-600 select-none">2</span>
                        <span class="ml-4"><span class="text-[#569cd6]">&lt;div</span> <span class="text-[#9cdcfe]">class</span>=<span class="text-[#ce9178]">"resizable-root"</span><span class="text-[#569cd6]">&gt;</span></span>
                      </div>
                      <div class="flex">
                        <span class="w-12 text-right pr-4 text-gray-600 select-none">3</span>
                        <span class="ml-8"><span class="text-[#6a9955]">&lt;!-- Resizable panels --&gt;</span></span>
                      </div>
                      <div class="flex">
                        <span class="w-12 text-right pr-4 text-gray-600 select-none">4</span>
                        <span class="ml-8"><span class="text-[#569cd6]">&lt;slot</span> <span class="text-[#9cdcfe]">name</span>=<span class="text-[#ce9178]">"default"</span> <span class="text-[#569cd6]">/&gt;</span></span>
                      </div>
                      <div class="flex">
                        <span class="w-12 text-right pr-4 text-gray-600 select-none">5</span>
                        <span class="ml-4"><span class="text-[#569cd6]">&lt;/div&gt;</span></span>
                      </div>
                      <div class="flex">
                        <span class="w-12 text-right pr-4 text-gray-600 select-none">6</span>
                        <span><span class="text-[#569cd6]">&lt;/template&gt;</span></span>
                      </div>
                      <div class="flex">
                        <span class="w-12 text-right pr-4 text-gray-600 select-none">7</span>
                        <span></span>
                      </div>
                      <div class="flex">
                        <span class="w-12 text-right pr-4 text-gray-600 select-none">8</span>
                        <span><span class="text-[#569cd6]">&lt;script</span> <span class="text-[#9cdcfe]">setup</span><span class="text-[#569cd6]">&gt;</span></span>
                      </div>
                      <div class="flex">
                        <span class="w-12 text-right pr-4 text-gray-600 select-none">9</span>
                        <span><span class="text-[#c586c0]">import</span> { <span class="text-[#9cdcfe]">ref</span> } <span class="text-[#c586c0]">from</span> <span class="text-[#ce9178]">'vue'</span></span>
                      </div>
                      <div class="flex">
                        <span class="w-12 text-right pr-4 text-gray-600 select-none">10</span>
                        <span></span>
                      </div>
                      <div class="flex">
                        <span class="w-12 text-right pr-4 text-gray-600 select-none">11</span>
                        <span><span class="text-[#c586c0]">const</span> <span class="text-[#4fc1ff]">sizes</span> = <span class="text-[#dcdcaa]">ref</span>([<span class="text-[#b5cea8]">50</span>, <span class="text-[#b5cea8]">50</span>])</span>
                      </div>
                      <div class="flex">
                        <span class="w-12 text-right pr-4 text-gray-600 select-none">12</span>
                        <span><span class="text-[#569cd6]">&lt;/script&gt;</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <template #panel-terminal>
                <div class="h-full w-full bg-[#1e1e1e] flex flex-col border-t border-[#2d2d2d]">
                  <div class="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-[#2d2d2d]">
                    <div class="flex items-center gap-3">
                      <span class="text-xs font-semibold text-gray-300 uppercase tracking-wider">Terminal</span>
                      <div class="flex items-center gap-2">
                        <div class="px-2 py-1 bg-[#1e1e1e] rounded text-xs text-gray-400">bash</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <FeatherIcon name="plus" class="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-pointer" />
                      <FeatherIcon name="trash-2" class="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-pointer" />
                    </div>
                  </div>

                  <div class="flex-1 overflow-auto p-3 font-mono text-sm text-gray-300">
                    <div class="space-y-1">
                      <div><span class="text-green-400">user@machine</span>:<span class="text-blue-400">~/project</span>$ npm run dev</div>
                      <div class="text-gray-500">
                        <div>  VITE v5.0.0  ready in 234 ms</div>
                        <div></div>
                        <div>  ➜  <span class="text-cyan-400">Local</span>:   http://localhost:5173/</div>
                        <div>  ➜  <span class="text-gray-600">Network</span>: use --host to expose</div>
                      </div>
                      <div class="mt-2"><span class="text-green-400">user@machine</span>:<span class="text-blue-400">~/project</span>$ <span class="animate-pulse">█</span></div>
                    </div>
                  </div>
                </div>
              </template>
            </Resizable>
          </div>
        </template>

        <template #panel-chat>
          <div class="h-full w-full bg-[#252526] border-l border-[#2d2d2d] flex flex-col">
            <div class="px-4 py-3 border-b border-[#2d2d2d] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <FeatherIcon name="message-circle" class="w-4 h-4 text-blue-400" />
                <span class="text-sm font-semibold text-gray-300">Chat</span>
              </div>
              <div class="flex items-center gap-2">
                <FeatherIcon name="more-vertical" class="w-4 h-4 text-gray-400 hover:text-gray-300 cursor-pointer" />
              </div>
            </div>

            <div class="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
              <div class="flex gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  AI
                </div>
                <div class="flex-1">
                  <div class="flex items-baseline gap-2 mb-1">
                    <span class="text-sm font-semibold text-gray-300">AI Assistant</span>
                    <span class="text-xs text-gray-500">10:30 AM</span>
                  </div>
                  <div class="text-sm text-gray-400 bg-[#2d2d2d] rounded-lg p-3">
                    Hello! I can help you with your code. What would you like to work on?
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  U
                </div>
                <div class="flex-1">
                  <div class="flex items-baseline gap-2 mb-1">
                    <span class="text-sm font-semibold text-gray-300">You</span>
                    <span class="text-xs text-gray-500">10:31 AM</span>
                  </div>
                  <div class="text-sm text-gray-400 bg-[#1e1e1e] rounded-lg p-3">
                    I need help implementing a resizable component.
                  </div>
                </div>
              </div>

              <div class="flex gap-3">
                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                  AI
                </div>
                <div class="flex-1">
                  <div class="flex items-baseline gap-2 mb-1">
                    <span class="text-sm font-semibold text-gray-300">AI Assistant</span>
                    <span class="text-xs text-gray-500">10:31 AM</span>
                  </div>
                  <div class="text-sm text-gray-400 bg-[#2d2d2d] rounded-lg p-3">
                    Great! The Resizable component supports:
                    <ul class="list-disc ml-4 mt-2 space-y-1">
                      <li>Horizontal and vertical layouts</li>
                      <li>Collapsible panels</li>
                      <li>Nested layouts</li>
                      <li>Persistent sizing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Resizable>
    </div>
  </div>
</template>
