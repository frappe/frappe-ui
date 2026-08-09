<script setup lang="ts">
import { ref, computed, watch, toRaw } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import Button from '#components/Button/Button.vue'
import { ErrorMessage } from '#components/ErrorMessage'
import {
  abortUpload,
  getLocalFile,
  getUploadProgress,
} from '#molecules/editor/extensions/shared/media-upload-state'
import { pickFiles } from '#molecules/editor/extensions/shared/file-picker'
import { useNodeViewEditable } from '#molecules/editor/composables/useNodeViewEditable'
import { useNodeViewResize } from '#molecules/editor/composables/useNodeViewResize'
import { safeGetPos } from '#molecules/editor/extensions/shared/node-view'
import MediaToolbar from './MediaToolbar.vue'
import MediaResizeHandles from './MediaResizeHandles.vue'
import VideoControls from './VideoControls.vue'
import UploadProgressIndicator from './UploadProgressIndicator.vue'
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
const localEntry = computed(() => getLocalFile(props.node.attrs.uploadId))
const fileContent = computed(() => localEntry.value?.b64)
const videoPoster = computed(() => localEntry.value?.poster)
const uploadProgress = computed(() =>
  getUploadProgress(props.node.attrs.uploadId),
)
const uploadPercent = computed(() => uploadProgress.value?.percent ?? 0)
const hasError = computed(() => Boolean(props.node.attrs.error))

/**
 * Stable identity of the media this view is showing.
 *
 * ProseMirror reuses ONE inline node view for a DIFFERENT node of the same
 * type when two of them sit next to each other, and Vue keeps `setup()` state
 * across that reuse — which is how one image's caption ended up under several
 * images. `uploadId` survives the whole upload (it is never cleared on
 * success) and is forced to `null` when parsing HTML, so it is stable within a
 * session and `src` covers everything loaded from the document.
 */
const nodeKey = computed(() =>
  String(props.node.attrs.uploadId ?? props.node.attrs.src ?? ''),
)

/**
 * A node carrying an `uploadId` was inserted during this editing session
 * (`parseHTML` forces the attribute to `null`). Those get the caption field
 * opened for them, so the affordance is visible right where a caption is
 * normally written instead of hiding behind a toolbar icon.
 */
const isFreshInsert = ref(Boolean(props.node.attrs.uploadId))

const caption = ref<string>(props.node.attrs.caption || '')

/** User's explicit caption toggle. `null` means "not decided, use the default". */
const captionToggle = ref<boolean | null>(null)

const showCaption = computed(() => {
  if (captionToggle.value !== null) return captionToggle.value
  if (props.node.attrs.caption) return true
  return isEditable.value && isFreshInsert.value
})
const showCaptionText = computed(() =>
  Boolean(!isEditable.value && props.node.attrs.caption && !hasError.value),
)
const showCaptionField = computed(
  () => isEditable.value && !hasError.value && showCaption.value,
)

// Re-sync the input when the caption attr changes elsewhere (collab, undo, a
// reused node view) without clobbering local typing — commit is on blur/Enter,
// so the attr never moves while the user is mid-word.
watch(
  () => props.node.attrs.caption,
  (value) => {
    const next = value || ''
    if (next !== caption.value) caption.value = next
  },
)

// A reused node view starts over: local text AND the open/closed toggle, which
// has no attribute to watch and would otherwise leak to the next image.
watch(nodeKey, () => {
  caption.value = props.node.attrs.caption || ''
  captionToggle.value = null
  isFreshInsert.value = Boolean(props.node.attrs.uploadId)
})

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
  if (!isEditable.value && props.node.attrs.src) {
    if (isVideo.value) {
      // Read mode: no native controls, so clicking the video toggles playback.
      const el = mediaRef.value as HTMLVideoElement | null
      if (el?.paused) void el.play()
      else el?.pause()
    } else {
      editor.commands.openImageViewer?.(props.node.attrs.src)
    }
    return
  }
  if (isEditable.value) selectMedia()
}

function startResizeFromHandle(event: PointerEvent, edge: 'left' | 'right') {
  selectMedia()
  startResize(event, edge)
}

function resizeBy(delta: number) {
  selectMedia()
  const currentWidth =
    Number(props.node.attrs.width) || mediaRef.value?.offsetWidth || 320
  const width = Math.max(50, currentWidth + delta)
  const height = Math.round(width * mediaIntrinsicAspect())
  props.updateAttributes({ width, height })
}

function onResizeKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    resizeBy(-20)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    resizeBy(20)
  }
}

function commitCaption() {
  if ((props.node.attrs.caption || '') === caption.value) return
  props.updateAttributes({ caption: caption.value || null })
}

function toggleCaptions() {
  const next = !showCaption.value
  captionToggle.value = next
  isFreshInsert.value = false
  if (!next) {
    caption.value = ''
    if (props.node.attrs.caption) props.updateAttributes({ caption: null })
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

function cancelUpload() {
  abortUpload(props.node.attrs.uploadId)
}

function removeMedia() {
  const pos = safeGetPos(() => props.getPos())
  if (pos === null) return
  const node = editor.view.state.doc.nodeAt(pos)
  if (!node) return
  editor.view.dispatch(editor.view.state.tr.delete(pos, pos + node.nodeSize))
}

async function replaceMedia() {
  const files = await pickFiles({
    accept: isVideo.value ? 'video/*' : 'image/*',
  })
  const file = files[0]
  if (!file) return
  const pos = safeGetPos(() => props.getPos())
  if (pos === null) return
  if (isVideo.value) {
    editor.commands.replaceVideo(pos, file)
  } else {
    editor.commands.replaceImage(pos, file)
  }
}

function setVideoOptions(options: {
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}) {
  editor.commands.setVideoOptions(options)
}
</script>

<template>
  <NodeViewWrapper
    as="div"
    data-drag-handle
    :class="wrapperClasses(node.attrs.float)"
  >
    <div
      ref="containerRef"
      class="group relative isolate overflow-hidden not-prose rounded-4"
      :class="containerClasses(node.attrs, selected)"
      :style="{ width: node.attrs.width ? `${node.attrs.width}px` : 'auto' }"
      data-video-fullscreen-root
    >
      <div
        v-if="isUploaded || fileContent || node.attrs.loading"
        class="relative"
      >
        <img
          v-if="!isVideo"
          ref="mediaRef"
          class="rounded-4"
          :class="!isUploaded && 'opacity-40'"
          :src="node.attrs.src || fileContent"
          :alt="node.attrs.alt || ''"
          :width="node.attrs.width"
          :height="node.attrs.height"
          @click.stop="onMediaClick"
        />
        <img
          v-else-if="isVideo && !isUploaded && videoPoster"
          ref="mediaRef"
          class="rounded-4"
          :src="videoPoster"
          :alt="node.attrs.alt || 'Video preview'"
          :width="node.attrs.width"
          :height="node.attrs.height"
          @click.stop="onMediaClick"
        />
        <video
          v-else-if="isVideo"
          ref="mediaRef"
          class="rounded-4"
          :class="!isUploaded && 'opacity-40'"
          :src="node.attrs.src || fileContent"
          :width="node.attrs.width"
          :height="node.attrs.height"
          :autoplay="node.attrs.autoplay"
          :loop="node.attrs.loop"
          :muted="node.attrs.muted"
          playsinline
          @click.stop="onMediaClick"
        />

        <VideoControls
          v-if="isVideo && isUploaded"
          :video-el="mediaRef as HTMLVideoElement | null"
          :hidden="isResizing"
        />

        <MediaToolbar
          v-if="isUploaded"
          :node="node"
          :media-type="isVideo ? 'video' : 'image'"
          :is-editable="isEditable"
          :selected="selected"
          :show-caption="showCaption"
          @toggle-caption="toggleCaptions"
          @set-align="onSetAlign"
          @replace="replaceMedia"
          @set-video-options="setVideoOptions"
        />

        <MediaResizeHandles
          v-if="selected && isEditable && isUploaded"
          label="Resize media"
          @resize-start="startResizeFromHandle"
          @resize-keydown="onResizeKeydown"
        />

        <!-- Upload error over the staged preview: same overlay pattern as the
             gallery grid cell, kept inside the media box. -->
        <div
          v-if="hasError"
          aria-live="assertive"
          class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/65 p-3 text-center"
        >
          <div class="text-p-sm text-ink-base">{{ node.attrs.error }}</div>
          <div v-if="isEditable" class="flex flex-wrap justify-center gap-2">
            <Button size="xs" variant="subtle" @click.stop="retryUpload">
              Try again
            </Button>
            <Button size="xs" variant="subtle" @click.stop="replaceMedia">
              Choose another
            </Button>
            <Button size="xs" variant="subtle" @click.stop="removeMedia">
              Remove
            </Button>
          </div>
        </div>

        <UploadProgressIndicator
          v-if="node.attrs.loading"
          :percent="uploadPercent"
          @cancel="cancelUpload"
        />
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center gap-3 border rounded-4 text-ink-gray-6 text-sm px-4 py-5 max-w-full"
        :class="{ 'border-none': selected }"
        :style="{
          width: node.attrs.width ? `${node.attrs.width}px` : undefined,
          aspectRatio: aspectRatioFrom(node.attrs.width, node.attrs.height),
        }"
        :aria-live="hasError ? 'assertive' : undefined"
      >
        <template v-if="hasError">
          <ErrorMessage :message="node.attrs.error" />
          <div v-if="isEditable" class="flex flex-wrap justify-center gap-2">
            <Button size="xs" variant="subtle" @click.stop="retryUpload">
              Try again
            </Button>
            <Button size="xs" variant="subtle" @click.stop="replaceMedia">
              Choose another
            </Button>
            <Button size="xs" variant="subtle" @click.stop="removeMedia">
              Remove
            </Button>
          </div>
        </template>
        <div v-else class="text-ink-gray-8 text-base">
          This {{ isVideo ? 'video' : 'image' }} hasn't yet been uploaded.
        </div>
      </div>

      <!-- Read mode renders the caption as text. It used to be a disabled
           <input>, which looks like a broken form field to everyone who cannot
           edit the document. -->
      <div
        v-if="showCaptionText"
        class="w-full px-1 pt-1 text-center text-sm text-ink-gray-6"
      >
        {{ node.attrs.caption }}
      </div>

      <!-- The field sits inside an inline, draggable, contenteditable=false
           node view. Without `draggable="false"` the browser starts dragging
           the image on pointerdown instead of focusing the field, and without
           stopping drag/clipboard events here ProseMirror handles them against
           the document rather than the input. -->
      <div
        v-else-if="showCaptionField"
        data-media-text-field
        draggable="false"
        class="w-full"
        @pointerdown.stop
        @mousedown.stop
        @dragstart.stop.prevent
        @copy.stop
        @cut.stop
        @paste.stop
      >
        <input
          v-model="caption"
          draggable="false"
          class="w-full text-center bg-transparent text-sm text-ink-gray-6 h-7 border-none focus:ring-0 placeholder-ink-gray-4"
          placeholder="Add a caption"
          aria-label="Caption"
          @blur="commitCaption"
          @keydown="onCaptionKeydown"
        />
      </div>
    </div>
  </NodeViewWrapper>
</template>
