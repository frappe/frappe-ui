<script setup lang="ts">
import { ref, computed, watch, toRaw } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import LoadingIndicator from '@components/LoadingIndicator.vue'
import Button from '@components/Button/Button.vue'
import { ErrorMessage } from '@components/ErrorMessage'
import { getLocalFile } from '@molecules/editor/extensions/shared/media-upload-state'
import { useNodeViewEditable } from '@molecules/editor/composables/useNodeViewEditable'
import { useNodeViewResize } from '@molecules/editor/composables/useNodeViewResize'
import MediaToolbar from './MediaToolbar.vue'
import {
  wrapperClasses,
  containerClasses,
  aspectRatioFrom,
  heightOverWidth,
  type MediaAlign,
} from './media-node-view-utils'
import {
  createParagraphAfterMedia,
  setCursorAfterMedia,
  setCursorBeforeMedia,
  selectMedia as selectMediaCmd,
  setMediaAlign,
  handleCaptionKeydown,
} from './media-node-view-controller'

const props = defineProps(nodeViewProps)

// TipTap's VueNodeViewRenderer hands node views a REACTIVE-PROXIED editor.
// ProseMirror's transaction guard compares `tr.before` against the current doc
// by REFERENCE, so a transaction built and dispatched through the proxy (whose
// `state.doc` is a distinct proxy object) throws "Applying a mismatched
// transaction" — this was the gameplan "Try again" crash. Operate on the raw
// editor for every command / transaction. The editor instance is stable, so
// unwrapping once at setup is safe (its reactivity is not needed here — node
// re-renders are driven by `props.node`, and editability by `useNodeViewEditable`).
const editor = toRaw(props.editor)

const mediaRef = ref<HTMLImageElement | HTMLVideoElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

const isEditable = useNodeViewEditable(editor)

const isVideo = computed(() => props.node.type.name === 'video')
const isUploaded = computed(() => Boolean(props.node.attrs.src))
const fileContent = computed(() => getLocalFile(props.node.attrs.uploadId)?.b64)
const hasError = computed(() => Boolean(props.node.attrs.error))

const showCaption = ref(Boolean(props.node.attrs.alt))
const caption = ref(props.node.attrs.alt || '')

// Re-sync the caption input when the source attr changes elsewhere (collab,
// undo, etc.) without clobbering local typing — commit happens on blur/Enter.
watch(
  () => props.node.attrs.alt,
  (alt) => {
    const next = alt || ''
    if (next !== caption.value) caption.value = next
    if (next) showCaption.value = true
  },
)

const { isResizing, startResize } = useNodeViewResize(editor, {
  mediaEl: () => mediaRef.value,
  containerEl: () => containerRef.value,
  getAspectRatio: () => mediaIntrinsicAspect(),
  getPos: () => props.getPos(),
  onCommit: ({ width, height }) => props.updateAttributes({ width, height }),
})

/** height / width from the stored attrs, falling back to the rendered media. */
function mediaIntrinsicAspect(): number {
  const el = mediaRef.value
  let width = props.node.attrs.width as number | null
  let height = props.node.attrs.height as number | null
  if (el) {
    if (isVideo.value) {
      const v = el as HTMLVideoElement
      width = width || v.videoWidth
      height = height || v.videoHeight
    } else {
      const img = el as HTMLImageElement
      width = width || img.naturalWidth
      height = height || img.naturalHeight
    }
  }
  return heightOverWidth(width, height)
}

function selectMedia() {
  selectMediaCmd(editor, () => props.getPos())
}

function onMediaClick() {
  if (!isEditable.value && !isVideo.value && props.node.attrs.src) {
    editor.commands.openImageViewer?.(props.node.attrs.src)
    return
  }
  if (isEditable.value) selectMedia()
}

function startResizeFromHandle(event: MouseEvent) {
  selectMedia()
  startResize(event)
}

function commitCaption() {
  props.updateAttributes({ alt: caption.value })
}

function toggleCaptions() {
  showCaption.value = !showCaption.value
  if (!showCaption.value) {
    caption.value = ''
    props.updateAttributes({ alt: '' })
  }
}

function onCaptionKeydown(event: KeyboardEvent) {
  handleCaptionKeydown(event, {
    onParagraphAfter: () =>
      createParagraphAfterMedia(editor, () => props.getPos()),
    onCursorAfter: () => setCursorAfterMedia(editor, () => props.getPos()),
    onCursorBefore: () => setCursorBeforeMedia(editor, () => props.getPos()),
    onToggleCaption: toggleCaptions,
    getCaption: () => caption.value,
  })
}

function onSetAlign(align: MediaAlign) {
  setMediaAlign(editor, isVideo.value, align)
}

function retryUpload() {
  if (isVideo.value) {
    editor.commands.reuploadVideo(props.node.attrs.uploadId)
  } else {
    editor.commands.reuploadImage(props.node.attrs.uploadId)
  }
}
</script>

<template>
  <NodeViewWrapper as="div" :class="wrapperClasses(node.attrs.float)">
    <div
      ref="containerRef"
      class="group relative overflow-hidden not-prose rounded-[2px]"
      :class="containerClasses(node.attrs, selected)"
      :style="{ width: node.attrs.width ? `${node.attrs.width}px` : 'auto' }"
    >
      <div v-if="isUploaded || fileContent" class="relative">
        <img
          v-if="!isVideo"
          ref="mediaRef"
          class="rounded-[2px]"
          :class="!isUploaded && 'opacity-40'"
          :src="node.attrs.src || fileContent"
          :alt="node.attrs.alt || ''"
          :width="node.attrs.width"
          :height="node.attrs.height"
          @click.stop="onMediaClick"
        />
        <video
          v-else
          ref="mediaRef"
          class="rounded-[2px]"
          :class="!isUploaded && 'opacity-40'"
          :src="node.attrs.src || fileContent"
          :width="node.attrs.width"
          :height="node.attrs.height"
          :autoplay="node.attrs.autoplay"
          :loop="node.attrs.loop"
          :muted="node.attrs.muted"
          :controls="isUploaded"
          @click.stop="onMediaClick"
        />

        <MediaToolbar
          v-if="isUploaded"
          :node="node"
          :is-video="isVideo"
          :is-editable="isEditable"
          :selected="selected"
          :show-caption="showCaption"
          @toggle-caption="toggleCaptions"
          @set-align="onSetAlign"
        />

        <button
          v-if="selected && isEditable && isUploaded"
          class="absolute bottom-2 right-2 cursor-nw-resize bg-black/65 rounded p-1"
          :class="{ 'cursor-ew-resize': isResizing }"
          @mousedown.prevent="startResizeFromHandle"
        >
          <span class="lucide-move-diagonal-2 text-white size-4" />
        </button>

        <div
          v-if="node.attrs.loading"
          class="inset-0 absolute flex items-center justify-center z-10"
        >
          <div
            class="bg-gray-900/80 p-2 inset-0 leading-none rounded-sm flex flex-col items-center justify-center gap-2"
          >
            <div class="flex items-center gap-2">
              <LoadingIndicator class="text-gray-100 size-4" />
              <span class="text-gray-100">
                Uploading {{ isVideo ? 'video' : 'image' }}...
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center gap-2 border rounded text-ink-gray-6 text-sm py-5 max-w-full"
        :class="{ 'border-none': selected }"
        :style="{
          width: node.attrs.width ? `${node.attrs.width}px` : undefined,
          aspectRatio: aspectRatioFrom(node.attrs.width, node.attrs.height),
        }"
      >
        <div class="text-ink-gray-8 text-base">
          This {{ isVideo ? 'video' : 'image' }} hasn't yet been uploaded.
        </div>
      </div>

      <input
        v-if="(node.attrs.alt || showCaption) && !hasError"
        v-model="caption"
        class="w-full text-center bg-transparent text-sm text-ink-gray-6 h-7 border-none focus:ring-0 placeholder-ink-gray-4"
        placeholder="Add caption"
        :disabled="!isEditable"
        @blur="commitCaption"
        @keydown="onCaptionKeydown"
      />

      <div
        v-if="hasError"
        class="w-full py-2 flex flex-col items-center justify-center gap-2"
      >
        <ErrorMessage :message="`Upload failed: ${node.attrs.error}`" />
        <Button
          v-if="isEditable"
          variant="subtle"
          icon-left="lucide-rotate-cw"
          label="Try again"
          @click="retryUpload"
        />
      </div>
    </div>
  </NodeViewWrapper>
</template>
