<template>
  <div class="h-full overflow-y-auto">
    <slot>
      <ListRow
        v-for="(row, i) in rows"
        :key="row[rowKey]"
        :row="row"
        :idx="i"
      />
    </slot>
  </div>
</template>

<script setup>
import ListRow from './ListRow.vue'
import { inject } from 'vue'

const { rows, rowKey } = inject('list')
</script>
