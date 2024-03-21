<template>
  <div class="h-full overflow-y-auto">
    <slot>
      <ListRow v-for="row in list.rows" :key="row[list.rowKey]" :row="row" />
      <slot name="empty-state" v-if="!list.rows.length">
        <ListEmptyState />
      </slot>
    </slot>
  </div>
</template>

<script setup>
import ListRow from './ListRow.vue'
import ListEmptyState from './ListEmptyState.vue'
import { inject } from 'vue'

const list = inject('list')
</script>
