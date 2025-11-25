<template>
  <div class="h-full overflow-y-auto" ref="listContainer">
    <slot>
      <ListRow v-for="row in rows" :key="row[list.rowKey]" :row="row" />
    </slot>
    <slot name="loading">
      <LoadingIndicator
        v-if="list.resource?.loading"
        class="size-4 mx-auto my-1"
      />
    </slot>
  </div>
</template>

<script setup>
import ListRow from './ListRow.vue'
import { useInfiniteScroll } from '@vueuse/core'
import { inject, computed, useTemplateRef, onBeforeUnmount } from 'vue'
import LoadingIndicator from '../LoadingIndicator.vue'

const container = useTemplateRef('listContainer')
const list = inject('list')
const rows = computed(() =>
  list.value.resource ? list.value.resource.data : list.rows,
)
if (list.value.resource) {
  const { reset } = useInfiniteScroll(
    container,
    () => {
      if (!list.value.resource.loading) list.value.resource.next()
    },
    {
      distance: 10,
      canLoadMore: () => {
        return list.value.resource.hasNextPage
      },
    },
  )
  onBeforeUnmount(reset)
}
</script>
