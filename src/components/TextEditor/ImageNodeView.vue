<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import LoadingIndicator from '../LoadingIndicator.vue'
import { ref, onMounted } from 'vue'
import ErrorMessage from '../ErrorMessage.vue'

const props = defineProps(nodeViewProps)

function selectImage() {
  props.editor.commands.setNodeSelection(props.getPos())
}

const caption = ref(props.node.attrs.alt || '')
const isEditable = ref(false)

onMounted(() => {
  isEditable.value = props.editor.isEditable
})

props.editor.on('update', () => {
  isEditable.value = props.editor.isEditable
})

function updateCaption(event: Event) {
  const newCaption = (event.target as HTMLInputElement).value
  caption.value = newCaption
  props.updateAttributes({ alt: newCaption })
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    createParagraphAfterImage()
  } else if (event.key === 'Escape' || event.key === 'ArrowDown') {
    event.preventDefault()
    setCursorAfterImage()
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    setCursorBeforeImage()
  }
}

function setCursorAt(pos: number) {
  props.editor.commands.focus()
  props.editor.chain().setTextSelection(pos).scrollIntoView().run()
}

function createParagraphAfterImage() {
  const pos = props.getPos()
  props.editor.commands.focus()
  props.editor
    .chain()
    .setTextSelection(pos + 1)
    .createParagraphNear()
    .scrollIntoView()
    .run()
}

function setCursorAfterImage() {
  const pos = props.getPos()
  setCursorAt(pos + 1)
}

function setCursorBeforeImage() {
  const pos = props.getPos()
  setCursorAt(pos - 1)
}
</script>

<template>
  <NodeViewWrapper>
    <div class="relative overflow-hidden not-prose my-6">
      <div class="relative">
        <img
          v-if="node.attrs.src"
          class="rounded-[2px]"
          :src="node.attrs.src"
          :alt="node.attrs.alt || ''"
          :width="node.attrs.width"
          :height="node.attrs.height"
          @click="selectImage"
        />

        <!-- Loading indicator overlay -->
        <div
          v-if="node.attrs.loading"
          class="inset-0 absolute flex items-center justify-center z-10"
        >
          <div
            class="bg-gray-900/80 p-2 inset-0 leading-none rounded-sm flex flex-col items-center justify-center gap-2"
          >
            <div class="flex items-center gap-2">
              <LoadingIndicator class="text-gray-100 size-4" />
              <span class="text-gray-100">Uploading...</span>
            </div>
          </div>
        </div>

        <!-- Selection overlay -->
        <div
          class="absolute pointer-events-none inset-0 rounded-[2px] bg-black/20 dark:bg-white/20 z-5 transition-opacity"
          :class="{
            'opacity-100': selected,
            'opacity-0': !selected,
          }"
        ></div>
      </div>

      <input
        v-if="(isEditable || node.attrs.alt) && !node.attrs.error"
        v-model="caption"
        class="w-full text-center bg-transparent text-sm text-ink-gray-6 h-7 border-none focus:ring-0 placeholder-ink-gray-4"
        placeholder="Add caption"
        :disabled="!isEditable"
        @change="updateCaption"
        @keydown="handleKeydown"
      />

      <div v-if="node.attrs.error" class="w-full py-1.5">
        <ErrorMessage :message="`Upload Failed: ${node.attrs.error}`" />
      </div>
    </div>
  </NodeViewWrapper>
</template>
