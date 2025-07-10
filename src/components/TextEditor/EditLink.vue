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
import { onMounted, ref, useTemplateRef, nextTick } from 'vue'
import Button from '../Button/Button.vue'
import TextInput from '../TextInput/TextInput.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import LucideCheck from '~icons/lucide/check'
import LucideX from '~icons/lucide/x'
import { isValidUrl } from '../../utils/url-validation'

const props = defineProps<{
  href: string
}>()

const emit = defineEmits<{
  (e: 'updateHref', href: string): void
  (e: 'close'): void
}>()

const _href = ref(props.href)
const input = useTemplateRef('input')

const submitLink = () => {
  if (_href.value === '' || isValidUrl(_href.value)) {
    emit('updateHref', _href.value)
  }
}

onMounted(async () => {
  await nextTick()
  if (input.value?.el) {
    input.value.el.focus()
    input.value.el.select()
  }
})
</script>
