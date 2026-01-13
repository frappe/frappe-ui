<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'

const codeblockRef = useTemplateRef<HTMLElement>('codeblockRef')

interface Props {
  mark: string
}

const props = defineProps<Props>()

const addMark = () => {
  const el = codeblockRef.value
  const searchTerm = props.mark.replace('[]', '')
  const regex = new RegExp(searchTerm, 'gi')
  if (el) el.innerHTML = el.innerHTML.replace(regex, `<mark>$&</mark>`)
}

onMounted(() => {
  addMark()
})
</script>

<template>
  <div ref="codeblockRef">
    <slot />
  </div>
</template>

<style scoped>
:deep(mark) {
  background-color: var(--surface-gray-1);
}
</style>
