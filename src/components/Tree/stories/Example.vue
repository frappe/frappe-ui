<script setup lang="ts">
import { Tree } from 'frappe-ui'
import { reactive } from 'vue'

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
  <div>
    <Tree
      :options="{
        showIndentationGuides: state.showIndentationGuides,
        rowHeight: state.rowHeight,
        indentWidth: state.indentWidth,
      }"
      nodeKey="name"
      :node="state.node"
    />
  </div>
</template>
