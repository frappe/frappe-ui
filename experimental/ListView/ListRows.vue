<template>
  <div class="h-full overflow-y-auto">
    <slot>
      <ListRow v-for="row in list.rows" :key="row[list.rowKey]" :row="row" />
    </slot>
  </div>
</template>

<script setup>
import ListRow from './ListRow.vue'
import { inject } from 'vue'

const list = inject('list')
</script>
