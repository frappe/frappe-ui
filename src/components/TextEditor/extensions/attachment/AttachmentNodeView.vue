<template>
  <node-view-wrapper class="attachment-node-view my-2">
    <div
      class="flex items-center gap-3 p-3 border rounded-lg bg-surface-gray-1 hover:bg-surface-gray-2 transition-colors cursor-pointer group"
      @click="download"
    >
      <div class="p-2 bg-white rounded-md border text-gray-500">
        <!-- Paperclip icon -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
        >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
            d="M14.828 7.757l-5.656 5.657a1 1 0 0 1-1.414-1.414l5.656-5.657A3 3 0 1 1 17.656 10.586l-5.656 5.656A5 5 0 1 1 4.929 9.172l5.656-5.657 1.414 1.414-5.656 5.657a3 3 0 1 0 4.242 4.242l5.656-5.656a1 1 0 0 0-1.414-1.414z"
            fill="currentColor"
            />
        </svg>
      </div>
      <div class="flex-1 overflow-hidden">
        <div class="text-sm font-medium text-gray-900 truncate">
          {{ node.attrs.filename || 'Uploading...' }}
        </div>
        <div class="text-xs text-gray-500 flex items-center gap-2">
          <span v-if="node.attrs.size">{{ formatSize(node.attrs.size) }}</span>
          <span v-if="node.attrs.uploadId" class="text-xs text-orange-500">Uploading...</span>
        </div>
      </div>
       <div class="opacity-0 group-hover:opacity-100 transition-opacity">
         <!-- Download Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
       </div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

function formatSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function download() {
    if (props.node.attrs.src) {
        window.open(props.node.attrs.src, '_blank')
    }
}
</script>

<style scoped>
.attachment-node-view {
    user-select: none;
}
</style>
