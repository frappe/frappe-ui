<template>
  <div class="h-full overflow-y-auto">
    <slot>
      <ListRow v-for="row in list.rows" :key="row[list.rowKey]" :row="row" />
    </slot>
  </div>
</template>

<script setup>
import { inject } from 'vue'

import ListRow from './ListRow.vue'

const list = inject('list')
</script>
