<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import LoadingIndicator from '../../../LoadingIndicator.vue'
import { ErrorMessage } from '../../../ErrorMessage'
import LucideMoveDiagonal2 from '~icons/lucide/move-diagonal-2'
import LucideAlignLeft from '~icons/lucide/align-left'
import LucideAlignCenter from '~icons/lucide/align-center'
import LucideAlignRight from '~icons/lucide/align-right'

const props = defineProps(nodeViewProps)

const mediaRef = ref<HTMLImageElement | HTMLVideoElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const isResizing = ref(false)
const startDragX = ref(0)
const startWidth = ref(0)
const originalAspectRatio = ref(1)

const isVideo = computed(() => props.node.type.name === 'video')

function selectMedia() {
  props.editor.commands.setNodeSelection(props.getPos())
}

const caption = ref(props.node.attrs.alt || '')
const isEditable = ref(false)

onMounted(() => {
  isEditable.value = props.editor.isEditable
  if (mediaRef.value) {
    updateAspectRatio()
  }
})

props.editor.on('update', () => {
  isEditable.value = props.editor.isEditable
})

function updateAspectRatio() {
  if (!mediaRef.value) return

  let width, height
  if (isVideo.value) {
    const video = mediaRef.value as HTMLVideoElement
    width = props.node.attrs.width || video.videoWidth
    height = props.node.attrs.height || video.videoHeight
  } else {
    const img = mediaRef.value as HTMLImageElement
    width = props.node.attrs.width || img.naturalWidth
    height = props.node.attrs.height || img.naturalHeight
  }

  if (width && height) {
    originalAspectRatio.value = height / width
  }
}

function handleMediaLoaded() {
  updateAspectRatio()
}

function updateCaption(event: Event) {
  const newCaption = (event.target as HTMLInputElement).value
  caption.value = newCaption
  props.updateAttributes({ alt: newCaption })
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    createParagraphAfterMedia()
  } else if (event.key === 'Escape' || event.key === 'ArrowDown') {
    event.preventDefault()
    setCursorAfterMedia()
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    setCursorBeforeMedia()
  }
}

function setCursorAt(pos: number) {
  props.editor.commands.focus()
  props.editor.chain().setTextSelection(pos).scrollIntoView().run()
}

function createParagraphAfterMedia() {
  const pos = props.getPos()
  props.editor.commands.focus()
  props.editor
    .chain()
    .setTextSelection(pos + 1)
    .createParagraphNear()
    .scrollIntoView()
    .run()
}

function setCursorAfterMedia() {
  const pos = props.getPos()
  setCursorAt(pos + 1)
}

function setCursorBeforeMedia() {
  const pos = props.getPos()
  setCursorAt(pos - 1)
}

function startResize(event: MouseEvent) {
  if (!isEditable.value) return
  selectMedia()
  isResizing.value = true
  startDragX.value = event.clientX
  startWidth.value = mediaRef.value?.offsetWidth || props.node.attrs.width || 0

  // Calculate aspect ratio from current attributes or natural/video dimensions
  let width, height
  if (isVideo.value) {
    const video = mediaRef.value as HTMLVideoElement
    width = props.node.attrs.width || video.videoWidth
    height = props.node.attrs.height || video.videoHeight
  } else {
    const img = mediaRef.value as HTMLImageElement
    width = props.node.attrs.width || img.naturalWidth
    height = props.node.attrs.height || img.naturalHeight
  }

  if (width && height) {
    originalAspectRatio.value = height / width
  } else {
    originalAspectRatio.value = 1
  }

  window.addEventListener('mousemove', handleResize)
  window.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'ew-resize'
}

function handleResize(event: MouseEvent) {
  if (!isResizing.value || !mediaRef.value || !containerRef.value) return

  const editorElement = props.editor.view.dom
  const editorWidth = editorElement.clientWidth

  const deltaX = event.clientX - startDragX.value
  let newWidth = startWidth.value + deltaX

  // Add constraints (e.g., minimum width and maximum width based on editor)
  newWidth = Math.max(50, Math.min(newWidth, editorWidth))

  const newHeight = newWidth * originalAspectRatio.value

  // Apply temporary styles for visual feedback
  mediaRef.value.style.width = `${newWidth}px`
  mediaRef.value.style.height = `${newHeight}px`
  containerRef.value.style.width = `${newWidth}px`
}

function stopResize() {
  if (!isResizing.value) return

  isResizing.value = false
  window.removeEventListener('mousemove', handleResize)
  window.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''

  if (mediaRef.value && containerRef.value) {
    const finalWidth = mediaRef.value.offsetWidth
    const finalHeight = mediaRef.value.offsetHeight
    props.updateAttributes({ width: finalWidth, height: finalHeight })

    // Clear temporary styles after updating attributes
    mediaRef.value.style.width = ''
    mediaRef.value.style.height = ''
    containerRef.value.style.width = ''
  }
}

function setAlignment(align: 'left' | 'center' | 'right') {
  if (isVideo.value) props.editor.commands.setVideoAlign(align)
  else props.editor.commands.setImageAlign(align)
}
</script>

<template>
  <NodeViewWrapper>
    <div
      ref="containerRef"
      class="relative overflow-hidden not-prose my-6 rounded-[2px] block max-w-full"
      :class="[
        { 'ring-2 ring-outline-gray-3 ring-offset-2': selected },
        node.attrs.align === 'center' ? 'mx-auto' : '',
        node.attrs.align === 'right' ? 'ml-auto mr-0' : '',
        node.attrs.align === 'left' ? 'mr-auto ml-0' : '',
      ]"
      :style="{ width: node.attrs.width ? `${node.attrs.width}px` : 'auto' }"
    >
      <div v-if="node.attrs.src" class="relative">
        <img
          v-if="!isVideo"
          ref="mediaRef"
          class="rounded-[2px]"
          :src="node.attrs.src"
          :alt="node.attrs.alt || ''"
          :width="node.attrs.width"
          :height="node.attrs.height"
          @click.stop="selectMedia"
          @load="handleMediaLoaded"
        />
        <video
          v-else="isVideo"
          ref="mediaRef"
          class="rounded-[2px]"
          :src="node.attrs.src"
          :width="node.attrs.width"
          :height="node.attrs.height"
          :autoplay="node.attrs.autoplay"
          :loop="node.attrs.loop"
          :muted="node.attrs.muted"
          controls
          @click.stop="selectMedia"
          @loadedmetadata="handleMediaLoaded"
        />

        <div class="absolute bottom-2 right-2 flex items-center gap-2">
          <!-- Alignment Controls -->
          <div
            v-if="selected && isEditable"
            class="flex divide-x divide-outline-gray-5 rounded bg-black/65"
          >
            <button
              @click.stop="setAlignment('left')"
              :class="[
                'px-1.5 py-1 hover:text-ink-white',
                node.attrs.align === 'left'
                  ? 'text-ink-white'
                  : 'text-ink-gray-4',
              ]"
            >
              <LucideAlignLeft class="size-4" />
            </button>
            <button
              @click.stop="setAlignment('center')"
              :class="[
                'px-1.5 py-1 hover:text-ink-white',
                node.attrs.align === 'center'
                  ? 'text-ink-white'
                  : 'text-ink-gray-4',
              ]"
            >
              <LucideAlignCenter class="size-4" />
            </button>
            <button
              @click.stop="setAlignment('right')"
              :class="[
                'px-1.5 py-1 hover:text-ink-white',
                node.attrs.align === 'right'
                  ? 'text-ink-white'
                  : 'text-ink-gray-4',
              ]"
            >
              <LucideAlignRight class="size-4" />
            </button>
          </div>

          <!-- Resize Handle -->
          <button
            v-if="selected && isEditable"
            class="cursor-nw-resize bg-black/65 rounded p-1"
            @mousedown.prevent="startResize"
          >
            <LucideMoveDiagonal2 class="text-white size-4" />
          </button>
        </div>

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
              <span class="text-gray-100"
                >Uploading {{ isVideo ? 'video' : 'image' }}...</span
              >
            </div>
          </div>
        </div>
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
