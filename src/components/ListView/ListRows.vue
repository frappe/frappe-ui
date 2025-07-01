<template>
  <div
    ref="scrollContainer"
    class="h-full overflow-y-auto"
    @scroll="handleScroll"
  >
    <slot>
      <ListRow v-for="row in list.rows" :key="row[list.rowKey]" :row="row" />
    </slot>
  </div>
</template>

<script setup>
import { useStorage } from '@vueuse/core'
import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
import ListRow from './ListRow.vue'

const list = inject('list')

const scrollContainer = ref(null)
const scrollPosition = useStorage(`scrollPosition${list.id}`, 0)

const handleScroll = () => {
  if (scrollContainer.value?.$el) {
    scrollPosition.value = scrollContainer.value.$el.scrollTop
  }
}

onMounted(() => {
  if (scrollContainer.value?.$el) {
    scrollContainer.value.$el.addEventListener('scroll', handleScroll)
    scrollContainer.value.$el.scrollTop = scrollPosition.value
  }
})

onBeforeUnmount(() => {
  if (scrollContainer.value?.$el) {
    scrollContainer.value.$el.removeEventListener('scroll', handleScroll)
  }
})
</script>
