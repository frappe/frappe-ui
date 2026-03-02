<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, h } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import LoadingIndicator from '../../LoadingIndicator.vue'
import Tooltip from '../../Tooltip/Tooltip.vue'
import { localFileMap } from '../extensions/image/image-extension'
import { ErrorMessage } from '../../ErrorMessage'
import LucideAlignLeft from '~icons/lucide/align-left'
import LucideAlignCenter from '~icons/lucide/align-center'
import LucideAlignRight from '~icons/lucide/align-right'
import LucideWrapText from '~icons/lucide/wrap-text'
import LucideFloatLeft from '~icons/lucide/align-horizontal-justify-start'
import LucideFloatRight from '~icons/lucide/align-horizontal-justify-end'
import LucideNoFloat from '~icons/lucide/align-vertical-space-around'
import LucideCaptions from '~icons/lucide/captions'
import LucideMoveDiagonal2 from '~icons/lucide/move-diagonal-2'
import LucideRotateCw from '~icons/lucide/rotate-cw'

const props = defineProps(nodeViewProps)

const mediaRef = ref<HTMLImageElement | HTMLVideoElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const isResizing = ref(false)
const startDragX = ref(0)
const startWidth = ref(0)
const originalAspectRatio = ref(1)

const showAlignPopper = ref(false)
const showFloatPopper = ref(false)
const alignButtonRef = ref<HTMLElement | null>(null)
const floatButtonRef = ref<HTMLElement | null>(null)

const showCaption = ref(props.node.attrs.alt ? true : false)
const isVideo = computed(() => props.node.type.name === 'video')
const isUploaded = computed(() => Boolean(props.node.attrs.src))
const fileContent = computed(() => localFileMap.get(props.node.attrs.uploadId)?.b64)

const currentAlignIcon = computed(() => {
  return (
    {
      left: LucideAlignLeft,
      center: LucideAlignCenter,
      right: LucideAlignRight,
    }[props.node.attrs.align] || LucideAlignLeft
  )
})

const currentFloatIcon = computed(() => {
  return (
    {
      left: LucideFloatLeft,
      right: LucideFloatRight,
    }[props.node.attrs.float] || LucideWrapText
  )
})

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

  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (alignButtonRef.value && !alignButtonRef.value.contains(target)) {
    showAlignPopper.value = false
  }
  if (floatButtonRef.value && !floatButtonRef.value.contains(target)) {
    showFloatPopper.value = false
  }
}

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
  if (event.key === 'Backspace' && caption.value === '') {
    event.preventDefault()
    toggleCaptions()
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

  newWidth = Math.max(50, Math.min(newWidth, editorWidth))

  const newHeight = newWidth * originalAspectRatio.value

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

    mediaRef.value.style.width = ''
    mediaRef.value.style.height = ''
    containerRef.value.style.width = ''
  }
}

function setAlignment(align: 'left' | 'center' | 'right') {
  props.editor.commands.setImageAlign(align)
  showAlignPopper.value = false
}

function setFloat(float: 'left' | 'right' | null) {
  if (isVideo.value) props.editor.commands.setVideoFloat(float)
  else props.editor.commands.setImageFloat(float)
  showFloatPopper.value = false
}

function toggleAlignPopper(event: MouseEvent) {
  event.stopPropagation()
  showAlignPopper.value = !showAlignPopper.value
  showFloatPopper.value = false
}

function toggleFloatPopper(event: MouseEvent) {
  event.stopPropagation()
  showFloatPopper.value = !showFloatPopper.value
  showAlignPopper.value = false
}

function toggleCaptions() {
  showCaption.value = !showCaption.value
  if (!showCaption.value) {
    caption.value = ''
    props.updateAttributes({ alt: '' })
  }
}

const wrapperClasses = (float: string) => [
  'w-fit m-2',
  float === 'right' ? 'float-right ml-5' : 'float-left mr-5',
]
</script>

<template>
  <NodeViewWrapper as="div" :class="node.attrs.float ? wrapperClasses(node.attrs.float) : 'my-2'">
    <div ref="containerRef" class="group relative overflow-hidden not-prose rounded-[2px]" :class="[
      {
        'ring-2 ring-outline-gray-3 ring-offset-2': selected,
      },
      node.attrs.align === 'center' || !node.attrs.align ? 'mx-auto' : '',
      node.attrs.align === 'right' ? 'ml-auto mr-0' : '',
      node.attrs.align === 'left' ? 'mr-auto ml-0' : '',
      !node.attrs.float && 'block max-w-full',
    ]" :style="{
      width: node.attrs.width ? `${node.attrs.width}px` : 'auto',
    }">
      <div v-if="isUploaded || fileContent" class="relative">
        <img v-if="!isVideo" ref="mediaRef" class="rounded-[2px]" :class="!isUploaded && 'opacity-40'" :src="node.attrs.src || fileContent"
          :alt="node.attrs.alt || ''" :width="node.attrs.width" :height="node.attrs.height"
          @click.stop="selectMedia" @load="handleMediaLoaded" />
        <video v-else ref="mediaRef" class="rounded-[2px]" :class="!isUploaded && 'opacity-40'" :src="node.attrs.src || fileContent"
          :width="node.attrs.width" :height="node.attrs.height" :autoplay="node.attrs.autoplay"
          :loop="node.attrs.loop" :muted="node.attrs.muted" :controls="isUploaded" @click.stop="selectMedia"
          @loadedmetadata="handleMediaLoaded" />

        <div v-if="isUploaded" class="absolute top-2 right-2 items-center bg-black/65 px-1.5 py-1 gap-2 rounded group-hover:flex"
          :class="selected && isEditable ? 'flex' : 'hidden'">
          <button>
            <LucideCaptions @click="toggleCaptions" class="size-4"
              :class="[showCaption ? 'text-ink-white' : 'text-ink-gray-4']" />
          </button>
          <button v-if="!node.attrs.float && !isVideo" @click.stop="toggleAlignPopper"
            class="hover:text-ink-white text-ink-gray-4"
            :class="[node.attrs.align ? 'text-ink-white' : 'text-ink-gray-4']">
            <component :is="currentAlignIcon" class="size-4" />
          </button>
          <button @click.stop="toggleFloatPopper" class="hover:text-ink-white text-ink-gray-4"
            :class="[node.attrs.float ? 'text-ink-white' : 'text-ink-gray-4']">
            <component :is="currentFloatIcon" class="size-4" />
          </button>

          <div ref="alignButtonRef" v-if="showAlignPopper && !isVideo"
            class="absolute top-full mt-1 right-6 bg-black/65 rounded shadow-lg px-1.5 py-1 z-50 gap-2.5 flex items-center">
            <Tooltip text="Align left" class="h-5">
              <button @click="setAlignment('left')" class="text-ink-gray-4 hover:text-ink-white" :class="node.attrs.align === 'left'
                ? 'text-ink-white'
                : 'text-ink-gray-4'
                ">
                <LucideAlignLeft class="size-4" />
              </button>
            </Tooltip>
            <Tooltip text="Align center" class="h-5">
              <button @click="setAlignment('center')" class="text-ink-gray-4 hover:text-ink-white" :class="node.attrs.align === 'center'
                ? 'text-ink-white'
                : 'text-ink-gray-4'
                ">
                <LucideAlignCenter class="size-4" />
              </button>
            </Tooltip>
            <Tooltip text="Align right" class="h-5">
              <button @click="setAlignment('right')" class="text-ink-gray-4 hover:text-ink-white" :class="node.attrs.align === 'right'
                ? 'text-ink-white'
                : 'text-ink-gray-4'
                ">
                <LucideAlignRight class="size-4" />
              </button>
            </Tooltip>
          </div>

          <div v-if="showFloatPopper" ref="floatButtonRef"
            class="absolute top-full mt-1 right-0 bg-black/65 rounded shadow-lg px-1.5 py-1 z-50 gap-2.5 flex items-center">
            <Tooltip text="Float left" class="h-5">
              <button @click="setFloat('left')" class="text-ink-gray-4 hover:text-ink-white" :class="node.attrs.float === 'left'
                ? 'text-ink-white'
                : 'text-ink-gray-4'
                ">
                <LucideFloatLeft class="size-4" />
              </button>
            </Tooltip>
            <Tooltip text="Float right" class="h-5">
              <button @click="setFloat('right')" class="text-ink-gray-4 hover:text-ink-white" :class="node.attrs.float === 'right'
                ? 'text-ink-white'
                : 'text-ink-gray-4'
                ">
                <LucideFloatRight class="size-4" />
              </button>
            </Tooltip>
            <Tooltip v-if="node.attrs.float" text="Remove float" class="h-5">
              <button @click="setFloat(null)" class="text-ink-gray-4 hover:text-ink-white hover:bg-transparent">
                <LucideNoFloat class="size-4" />
              </button>
            </Tooltip>
          </div>
        </div>

        <Button
          v-else
          variant="solid"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          :icon-left="h(LucideRotateCw, { class: 'size-4' })"
          label="Try again"
          @click="isVideo ? editor.commands.reuploadVideo(node.attrs.uploadId) : editor.commands.reuploadImage(node.attrs.uploadId)"
        />

        <button v-if="selected && isEditable && isUploaded" class="absolute bottom-2 right-2 cursor-nw-resize bg-black/65 rounded p-1"
          @mousedown.prevent="startResize">
          <LucideMoveDiagonal2 class="text-white size-4" />
        </button>
        <div v-if="node.attrs.loading" class="inset-0 absolute flex items-center justify-center z-10">
          <div
            class="bg-gray-900/80 p-2 inset-0 leading-none rounded-sm flex flex-col items-center justify-center gap-2">
            <div class="flex items-center gap-2">
              <LoadingIndicator class="text-gray-100 size-4" />
              <span class="text-gray-100">Uploading {{ isVideo ? 'video' : 'image' }}...</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center gap-2 border rounded text-ink-gray-6 text-sm py-5 max-w-full" :class="{ 'border-none': selected }" :style="{ width: node.attrs.width + 'px', aspectRatio: node.attrs.width && node.attrs.height ? `${node.attrs.width} / ${node.attrs.height}` : undefined,}">
        <div class="text-ink-gray-8 text-base">This {{ isVideo ? 'video' : 'image' }} hasn't yet been uploaded.</div>
        <div v-if="node.attrs.error" class="text-sm text-ink-red-4">Upload failed: {{ node.attrs.error }}</div>
      </div>

      <input v-if="(node.attrs.alt || showCaption) && !node.attrs.error" v-model="caption"
        class="w-full text-center bg-transparent text-sm text-ink-gray-6 h-7 border-none focus:ring-0 placeholder-ink-gray-4"
        placeholder="Add caption" :disabled="!isEditable" @change="updateCaption" @keydown="handleKeydown" />

      <div v-if="node.attrs.error && fileContent" class="w-full py-1.5 text-center">
        <ErrorMessage :message="`Upload failed: ${node.attrs.error}`" />
      </div>
    </div>
  </NodeViewWrapper>
</template>