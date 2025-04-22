<template>
  <div
    class="p-2 flex min-w-72 items-center gap-2 bg-surface-white shadow-xl rounded-lg"
  >
    <TextInput
      ref="input"
      type="text"
      class="w-full"
      placeholder="https://example.com"
      v-model="_href"
      @keydown.enter="submitLink"
      @keydown.esc="$emit('close')"
    />
    <div class="shrink-0 flex items-center gap-2">
      <Tooltip text="Submit" placement="top">
        <Button label="Submit" @click="submitLink">
          <template #icon><LucideCheck class="size-4" /></template>
        </Button>
      </Tooltip>
      <Tooltip text="Remove link" placement="top">
        <Button label="Remove link" @click="$emit('updateHref', '')">
          <template #icon><LucideX class="size-4" /></template>
        </Button>
      </Tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef, defineEmits } from 'vue'
import Button from '../Button/Button.vue'
import TextInput from '../TextInput.vue'
import Tooltip from '../Tooltip/Tooltip.vue'

const props = defineProps<{
  show: boolean
  href: string
  onClose: () => void
  onUpdateHref: (href: string) => void
}>()

const emit = defineEmits<{
  (e: 'updateHref', href: string): void
  (e: 'close'): void
}>()

const _href = ref(props.href)
const input = useTemplateRef('input')

// Simple URL validation regex
const isValidUrl = (url: string) => {
  if (!url) return true
  const regex =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
  return regex.test(url)
}

const submitLink = () => {
  if (isValidUrl(_href.value)) {
    emit('updateHref', _href.value)
  }
}

onMounted(() => {
  if (props.show) {
    setTimeout(() => {
      if (input.value?.el) {
        input.value.el.focus()
        input.value.el.select()
      }
    }, 0)
  }
})
</script>
