<template>
  <Story :layout="{ type: 'grid', width: 500 }">
    <Variant title="default">
      <Tree
        :options="{
          showLines: state.showLines,
          rowHeight: state.rowHeight,
          indentWidth: state.indentWidth,
        }"
        :node="state.node"
      />
    </Variant>
    <template #controls>
      <HstCheckbox v-model="state.showLines" title="Show Lines" />
      <HstText v-model="state.rowHeight" title="Row Height" />
      <HstText v-model="state.indentWidth" title="Indent Width" />
    </template>
  </Story>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import Tree from './Tree.vue'

const state = reactive({
  showLines: true,
  rowHeight: '25px',
  indentWidth: '15px',
  node: {
    label: 'Guest',
    children: [
      {
        label: 'Downloads',
        children: [
          {
            label: 'download.zip',
            children: [
              {
                label: 'image.png',
                children: [],
              },
            ],
          },
        ],
      },
      {
        label: 'Documents',
        children: [
          {
            label: 'somefile.txt',
            children: [],
          },
          {
            label: 'somefile.pdf',
            children: [],
          },
        ],
      },
    ],
  },
})
</script>
