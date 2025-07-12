<template>
  <div
    v-if="list"
    ref="scrollContainer"
    class="h-full overflow-y-auto"
    @scroll="handleScroll"
  >
    <slot>
      <ListRow v-for="row in rows" :key="row[list.rowKey]" :row="row" />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { computed, ComputedRef, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import ListRow from './ListRow.vue'
import type { ListContext } from './types'

const list = inject<ComputedRef<ListContext>>('list')

const rows = computed(() => (list?.value.rows as ListRow[]) || [])

const scrollContainer = ref<HTMLElement | null>(null)
const scrollPosition = useStorage(`scrollPosition${list?.value.id}`, 0)

const handleScroll = () => {
  if (scrollContainer.value) {
    scrollPosition.value = scrollContainer.value.scrollTop
  }
}

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll)
    scrollContainer.value.scrollTop = scrollPosition.value
  }
})

onBeforeUnmount(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
})
</script>
