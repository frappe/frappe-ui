<template>
  <div>
    <slot v-bind="{ onClick: () => dialog.open() }"></slot>

    <Dialog
      v-model="dialog.showDialog.value"
      :options="{ title: 'Insert Embed', size: 'md' }"
    >
      <template #body-content>
        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-ink-gray-7">
              URL or Embed Code
            </label>
            <Textarea
              ref="urlInput"
              v-model="dialog.embedInput.value"
              placeholder="https://youtube.com/watch?v=… or <iframe src=…>"
              @keydown.enter.prevent="dialog.insert()"
            />
            <p v-if="dialog.urlError.value" class="mt-1 text-sm text-red-500">
              {{ dialog.urlError.value }}
            </p>
            <p
              v-else-if="dialog.embedInput.value && dialog.isValidUrl.value"
              class="mt-1 text-sm text-ink-green-3"
            >
              ✓ Valid {{ dialog.platformName.value }} URL
            </p>
          </div>
        </div>
      </template>

      <template #actions>
        <div class="flex justify-end space-x-2">
          <Button variant="subtle" @click="dialog.close()">Cancel</Button>
          <Button
            variant="solid"
            :disabled="!dialog.isValidUrl.value"
            @click="dialog.insert()"
          >
            Insert Embed
          </Button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import type { Editor } from '@tiptap/vue-3'
import Dialog from '@components/Dialog/Dialog.vue'
import Button from '@components/Button/Button.vue'
import Textarea from '@components/Textarea/Textarea.vue'
import { useIframeDialog } from './useIframeDialog'

const props = defineProps<{ editor: Editor }>()

const urlInput = useTemplateRef<{ el?: HTMLTextAreaElement }>('urlInput')

const dialog = useIframeDialog(props.editor)

onMounted(() => {
  dialog.registerInputRef(() => urlInput.value?.el?.focus())
})
</script>
