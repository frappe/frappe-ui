<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { ref, onMounted, computed, nextTick } from 'vue'
import LucideAlignCenter from '~icons/lucide/align-center'
import LucideAlignLeft from '~icons/lucide/align-left'
import LucideAlignRight from '~icons/lucide/align-right'
import LucideMoveDiagonal2 from '~icons/lucide/move-diagonal-2'

import { detectPlatform, calculateAspectRatio } from './utils'

const props = defineProps(nodeViewProps)

const iframeRef = ref<HTMLIFrameElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const isResizing = ref(false)
const startDragX = ref(0)
const startWidth = ref(0)
const originalAspectRatio = ref(9 / 16) // Default 16:9
const isEditable = ref(false)

function selectIframe() {
  props.editor.commands.setNodeSelection(props.getPos())
}

// Computed properties for styling and info
const platformInfo = computed(() => {
  if (props.node.attrs.src) {
    const platform = detectPlatform(props.node.attrs.src)
    const aspectInfo = calculateAspectRatio(props.node.attrs.src)
    return {
      platform: platform?.name || 'Generic',
      aspectRatio: aspectInfo.ratio,
    }
  }
  return { platform: 'Generic', aspectRatio: 9 / 16 }
})

const iframeStyles = computed(() => {
  const width = props.node.attrs.width || 640
  const height = props.node.attrs.height || width * originalAspectRatio.value

  return {
    width: `${width}px`,
    height: `${height}px`,
  }
})

onMounted(() => {
  isEditable.value = props.editor.isEditable

  // Calculate aspect ratio from node attributes or URL
  if (props.node.attrs.aspectRatio) {
    originalAspectRatio.value = props.node.attrs.aspectRatio
  } else if (props.node.attrs.src) {
    const aspectInfo = calculateAspectRatio(props.node.attrs.src)
    originalAspectRatio.value = aspectInfo.ratio

    // Update node with calculated aspect ratio
    props.updateAttributes({ aspectRatio: aspectInfo.ratio })
  }
})

props.editor.on('update', () => {
  isEditable.value = props.editor.isEditable
})

function startResize(event: MouseEvent) {
  if (!isEditable.value) return
  selectIframe()
  isResizing.value = true
  startDragX.value = event.clientX
  startWidth.value = containerRef.value?.offsetWidth || props.node.attrs.width || 640

  // Use stored aspect ratio or calculate from current dimensions
  if (props.node.attrs.aspectRatio) {
    originalAspectRatio.value = props.node.attrs.aspectRatio
  } else {
    const width = props.node.attrs.width || startWidth.value
    const height = props.node.attrs.height || width * originalAspectRatio.value
    if (width && height) {
      originalAspectRatio.value = height / width
    }
  }

  window.addEventListener('mousemove', handleResize)
  window.addEventListener('mouseup', stopResize)
  document.body.style.cursor = 'ew-resize'
}

function handleResize(event: MouseEvent) {
  if (!isResizing.value || !iframeRef.value || !containerRef.value) return

  const editorElement = props.editor.view.dom
  const editorWidth = editorElement.clientWidth

  const deltaX = event.clientX - startDragX.value
  let newWidth = startWidth.value + deltaX

  // Add constraints (minimum width, maximum editor width with padding)
  const MIN_WIDTH = 200
  const PADDING = 40
  newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, editorWidth - PADDING))

  const newHeight = newWidth * originalAspectRatio.value

  // Apply temporary styles for visual feedback
  iframeRef.value.style.width = `${newWidth}px`
  iframeRef.value.style.height = `${newHeight}px`
  containerRef.value.style.width = `${newWidth}px`
}

function stopResize() {
  if (!isResizing.value) return

  isResizing.value = false
  window.removeEventListener('mousemove', handleResize)
  window.removeEventListener('mouseup', stopResize)
  document.body.style.cursor = ''

  if (iframeRef.value && containerRef.value) {
    // Capture final dimensions while temporary styles are still applied
    const finalWidth = iframeRef.value.offsetWidth
    const finalHeight = iframeRef.value.offsetHeight

    // Update attributes
    props.updateAttributes({
      width: finalWidth,
      height: finalHeight,
      aspectRatio: originalAspectRatio.value,
    })

    // Clear temporary styles immediately (like image extension)
    iframeRef.value.style.width = ''
    iframeRef.value.style.height = ''
    containerRef.value.style.width = ''
  }
}

function setAlignment(align: 'left' | 'center' | 'right') {
  props.updateAttributes({ align })
}

// Handle keyboard navigation
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    createParagraphAfterIframe()
  } else if (event.key === 'Escape' || event.key === 'ArrowDown') {
    event.preventDefault()
    setCursorAfterIframe()
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    setCursorBeforeIframe()
  }
}

function setCursorAt(pos: number) {
  props.editor.commands.focus()
  props.editor.chain().setTextSelection(pos).scrollIntoView().run()
}

function createParagraphAfterIframe() {
  const pos = props.getPos()
  props.editor.commands.focus()
  props.editor
    .chain()
    .setTextSelection(pos + 1)
    .createParagraphNear()
    .scrollIntoView()
    .run()
}

function setCursorAfterIframe() {
  const pos = props.getPos()
  setCursorAt(pos + 1)
}

function setCursorBeforeIframe() {
  const pos = props.getPos()
  setCursorAt(pos - 1)
}
</script>

<template>
  <NodeViewWrapper>
    <div
      ref="containerRef"
      class="not-prose relative my-6 block max-w-full overflow-hidden rounded-lg focus:outline-none"
      :class="[
        { 'ring-2 ring-outline-gray-3 ring-offset-2': selected },
        node.attrs.align === 'center' ? 'mx-auto' : '',
        node.attrs.align === 'right' ? 'ml-auto mr-0' : '',
        node.attrs.align === 'left' ? 'ml-0 mr-auto' : '',
      ]"
      :style="{
        width: node.attrs.width ? `${node.attrs.width}px` : 'auto',
        maxWidth: '100%',
      }"
      @keydown="handleKeydown"
      tabindex="0"
    >
      <div class="relative">
        <iframe
          v-if="node.attrs.src"
          ref="iframeRef"
          class="block h-auto max-w-full rounded-lg border-0"
          :class="{
            'pointer-events-none': isEditable && !props.node.attrs.interactive,
          }"
          :src="node.attrs.src"
          :style="iframeStyles"
          :title="node.attrs.title || ''"
          frameborder="0"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          @click.stop="selectIframe"
        />

        <!-- Transparent overlay for selection in edit mode -->
        <div
          v-if="isEditable && !props.node.attrs.interactive"
          class="absolute inset-0 z-10 cursor-pointer"
          @click.stop="selectIframe"
        ></div>

        <!-- Controls overlay -->
        <div class="absolute bottom-2 right-2 z-20 flex items-center gap-2">
          <!-- Alignment Controls -->
          <div
            v-if="selected && isEditable"
            class="divide-ink-gray-6 flex divide-x rounded-md bg-black/65"
          >
            <button
              @click.stop="setAlignment('left')"
              :class="[
                'px-1.5 py-1 text-ink-gray-4 transition-colors duration-150 hover:text-white',
                { 'text-white': node.attrs.align === 'left' },
              ]"
              title="Align Left"
            >
              <LucideAlignLeft class="size-4" />
            </button>
            <button
              @click.stop="setAlignment('center')"
              :class="[
                'px-1.5 py-1 text-ink-gray-4 transition-colors duration-150 hover:text-white',
                { 'text-white': node.attrs.align === 'center' },
              ]"
              title="Align Center"
            >
              <LucideAlignCenter class="size-4" />
            </button>
            <button
              @click.stop="setAlignment('right')"
              :class="[
                'px-1.5 py-1 text-ink-gray-4 transition-colors duration-150 hover:text-white',
                { 'text-white': node.attrs.align === 'right' },
              ]"
              title="Align Right"
            >
              <LucideAlignRight class="size-4" />
            </button>
          </div>

          <!-- Resize Handle -->
          <button
            v-if="selected && isEditable"
            class="cursor-nw-resize rounded-md bg-black/65 p-1"
            @mousedown.prevent="startResize"
            title="Resize"
          >
            <LucideMoveDiagonal2 class="size-4 text-white" />
          </button>
        </div>

        <!-- Loading state for new embeds -->
        <div
          v-if="!node.attrs.src"
          class="flex h-[360px] w-[640px] items-center justify-center rounded-lg bg-surface-gray-1"
        >
          <div class="text-center text-ink-gray-5">
            <div class="mb-1 text-lg">🔗</div>
            <div class="text-sm">Loading embed...</div>
          </div>
        </div>
      </div>

      <!-- Caption/Title input -->
      <input
        v-if="(isEditable || node.attrs.title) && node.attrs.src"
        :value="node.attrs.title"
        class="mt-2 h-7 w-full border-0 bg-transparent text-center text-sm text-ink-gray-6 placeholder-ink-gray-4 focus:outline-none focus:ring-0 disabled:opacity-60"
        placeholder="Add caption"
        :disabled="!isEditable"
        @input="(e) => props.updateAttributes({ title: (e.target as HTMLInputElement).value })"
        @keydown="handleKeydown"
      />
    </div>
  </NodeViewWrapper>
</template>

<style scoped>
/* Component-specific styles if needed */
</style>
