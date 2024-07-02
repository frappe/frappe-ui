<template>
  <div ref="floating" :style="{ ...floatingStyles, zIndex: 100 }" v-if="opened">
    <EventModalContent
      :calendarEvent="calendarEvent"
      :date="date"
      @close="close"
    />
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import EventModalContent from './EventModalContent.vue'

import { useFloating, shift, flip, offset, autoUpdate } from '@floating-ui/vue'

const props = defineProps({
  targetElement: { type: Object, required: true },
  calendarEvent: { type: Object, required: true },
  date: { type: Date, required: true },
  activeView: { type: String, required: true },
})
const emit = defineEmits(['update:show'])
const opened = ref(false)
const toggle = () => (opened.value = !opened.value)
const open = () => (opened.value = true)
const close = () => (opened.value = false)

const { floatingStyles } = useFloating(props.targetElement, floating, {
  placement: props.activeView === 'Day' ? 'top' : 'right',
  middleware: [offset(10), flip(), shift()],
  whileElementsMounted: autoUpdate,
})
const floating = ref(null)

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
const handleClickOutside = (e) => {
  const insidePopover = floating.value && floating.value.contains(e.target)
  if (insidePopover) return
  const insideTarget = props.targetElement.value.contains(e.target)
  if (insideTarget) return
  close()
}
</script>
<style></style>
