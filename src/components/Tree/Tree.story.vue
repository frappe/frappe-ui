<script setup lang="ts">
import { reactive } from 'vue'
import Tree from './Tree.vue'

const state = reactive({
  showIndentationGuides: true,
  rowHeight: '25px',
  indentWidth: '15px',
  node: {
    name: 'guest',
    label: 'Guest',
    children: [
      {
        name: 'downloads',
        label: 'Downloads',
        children: [
          {
            name: 'download.zip',
            label: 'download.zip',
            children: [
              {
                name: 'image.png',
                label: 'image.png',
                children: [],
              },
            ],
          },
        ],
      },
      {
        name: 'documents',
        label: 'Documents',
        children: [
          {
            name: 'somefile.txt',
            label: 'somefile.txt',
            children: [],
          },
          {
            name: 'somefile.pdf',
            label: 'somefile.pdf',
            children: [],
          },
        ],
      },
    ],
  },
})
</script>

<template>
  <div class="space-y-4">
    <Tree
      :options="{
        showIndentationGuides: state.showIndentationGuides,
        rowHeight: state.rowHeight,
        indentWidth: state.indentWidth,
      }"
      nodeKey="name"
      :node="state.node"
    />

    <div class="flex flex-col gap-2 max-w-xs">
      <label>
        <input type="checkbox" v-model="state.showIndentationGuides" />
        Show Indentation Guides
      </label>

      <label>
        Row Height
        <input type="text" v-model="state.rowHeight" class="border rounded p-1 w-full" />
      </label>

      <label>
        Indent Width
        <input type="text" v-model="state.indentWidth" class="border rounded p-1 w-full" />
      </label>
    </div>
  </div>
</template>
