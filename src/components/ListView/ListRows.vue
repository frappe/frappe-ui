<template>
  <div class="h-full overflow-y-auto">
    <slot>
      <template v-for="(row, i) in rows" :key="row[rowKey]">
        <ListRow :row="row" :idx="i" />
      </template>
    </slot>
  </div>
</template>

<script setup>
import ListRow from './ListRow.vue'
import { inject } from 'vue'

const { rows, rowKey } = inject('list')
</script>
