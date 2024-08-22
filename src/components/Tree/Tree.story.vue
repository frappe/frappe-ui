<template>
  <Story :layout="{ type: 'grid', width: 500 }">
    <Variant title="default">
      <Tree
        :options="{
          showLevelMarkers: state.showLevelMarkers,
          rowHeight: state.rowHeight,
          indentWidth: state.indentWidth,
        }"
        nodeKey="name"
        :node="state.node"
      />
    </Variant>
    <template #controls>
      <HstCheckbox
        v-model="state.showLevelMarkers"
        title="Show Level Markers"
      />
      <HstText v-model="state.rowHeight" title="Row Height" />
      <HstText v-model="state.indentWidth" title="Indent Width" />
    </template>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import Tree from './Tree.vue'

const state = reactive({
  showLevelMarkers: true,
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
