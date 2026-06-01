<template>
  <Dialog
    v-model="open"
    :options="{ title: 'Insert Embed', size: 'md' }"
    @close="$emit('close')"
  >
    <template #body-content>
      <div>
        <label class="mb-2 block text-sm font-medium text-ink-gray-7">
          URL or Embed Code
        </label>
        <Textarea
          ref="input"
          v-model="dialog.embedInput.value"
          placeholder="https://youtube.com/watch?v=… or <iframe src=…>"
          @keydown.enter.prevent="submit"
        />
        <p v-if="dialog.urlError.value" class="mt-1 text-sm text-ink-red-3">
          {{ dialog.urlError.value }}
        </p>
        <p
          v-else-if="dialog.embedInput.value && dialog.isValidUrl.value"
          class="mt-1 text-sm text-ink-green-3"
        >
          ✓ Valid {{ dialog.platformName.value }} URL
        </p>
      </div>
    </template>

    <template #actions>
      <div class="flex justify-end gap-2">
        <Button variant="subtle" @click="open = false">Cancel</Button>
        <Button
          variant="solid"
          :disabled="!dialog.isValidUrl.value"
          @click="submit"
        >
          Insert Embed
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, nextTick, useTemplateRef } from 'vue'
import type { Editor } from '@tiptap/core'
import Dialog from '@components/Dialog/Dialog.vue'
import Button from '@components/Button/Button.vue'
import Textarea from '@components/Textarea/Textarea.vue'
import { useIframeDialog } from './useIframeDialog'

const props = defineProps<{
  modelValue: boolean
  editor: Editor
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const open = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const dialog = useIframeDialog(props.editor)
const input = useTemplateRef<{ el?: HTMLTextAreaElement }>('input')

function submit() {
  if (dialog.insert()) open.value = false
}

onMounted(async () => {
  await nextTick()
  input.value?.el?.focus({ preventScroll: true })
})
</script>
