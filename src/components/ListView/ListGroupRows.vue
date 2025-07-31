<template>
  <div v-if="list && !props.group.collapsed" class="mb-5 mt-2">
    <slot>
      <ListRow
        v-for="row in props.group.rows"
        :key="row[list.rowKey]"
        :row="row"
      />
    </slot>
  </div>
</template>
<script setup lang="ts">
import { ComputedRef, inject } from 'vue';
import ListRow from './ListRow.vue';
import type { GroupedRow, ListContext } from './types';

interface ListGroupRowsProps {
  group: GroupedRow
}

const props = defineProps<ListGroupRowsProps>()
const list = inject<ComputedRef<ListContext>>('list')
</script>
