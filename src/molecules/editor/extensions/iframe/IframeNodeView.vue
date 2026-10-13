<script setup lang="ts">
import { computed, onBeforeUnmount, ref, toRaw, watch } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import Button from '#components/Button/Button.vue'
import Dialog from '#components/Dialog/Dialog.vue'
import type { DialogProps } from '#components/Dialog/types'
import MediaToolbar from '#molecules/editor/components/MediaToolbar.vue'
import MediaResizeHandle from '#molecules/editor/components/MediaResizeHandle.vue'
import { SELECTED_IMAGE_RING } from '#molecules/editor/components/media-node-view-utils'
import {
  duplicateMedia,
  removeMedia,
} from '#molecules/editor/components/media-node-view-controller'
import { useNodeViewEditable } from '#molecules/editor/composables/useNodeViewEditable'
import {
  useNodeViewResize,
  type ResizeEdge,
} from '#molecules/editor/composables/useNodeViewResize'
import { safeGetPos } from '#molecules/editor/extensions/shared/node-view'
import { IFRAME_SANDBOX } from './iframe-allowlist'
import type { IframeAlign } from './iframe-commands'

const props = defineProps(nodeViewProps)

// VueNodeViewRenderer passes a reactive-proxied editor; dispatching a
// transaction through it trips ProseMirror's by-reference doc check
// ("Applying a mismatched transaction"). Use the raw editor for all commands.
// (Same rationale as MediaNodeView.)
const editor = toRaw(props.editor)

const MIN_WIDTH = 200
const EDITOR_PADDING = 40
/** How long a frame may stay silent before it is given up on. */
const LOAD_TIMEOUT_MS = 15000

const iframeRef = ref<HTMLIFrameElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

const isEditable = useNodeViewEditable(editor)

/**
 * The embed's shape, per the design (espresso-2.0, 32354-128183): the
 * width of the column unless it has been resized, on its platform's
 * aspect ratio, in an 8px-cornered frame. A width in the attrs is a
 * resize and is kept in px; the height follows the ratio either way.
 */
const aspectRatio = computed<number>(
  () => (props.node.attrs.aspectRatio as number | null) ?? 9 / 16,
)
const width = computed<number | null>(
  () => (props.node.attrs.width as number | null) ?? null,
)
const frameStyle = computed(() => ({
  width: '100%',
  aspectRatio: `1 / ${aspectRatio.value}`,
}))

const sandbox = computed<string>(() => IFRAME_SANDBOX)

const isInteractive = computed<boolean>(() => !!props.node.attrs.interactive)
const overlayActive = computed(() => isEditable.value && !isInteractive.value)

/**
 * The design's "Preview failed": a frame that reports an error, or says
 * nothing for a good while, gives way to a bordered box that says so and
 * offers to try again. A node with no source at all (a link the allowlist
 * turned away on load) is the same box, and trying again there means a
 * new link.
 */
const failed = ref(false)
const attempt = ref(0)
/** the box is up: the frame failed, or there is no link to frame */
const showFailed = computed(() => failed.value || !props.node.attrs.src)
let loadTimer: ReturnType<typeof setTimeout> | undefined

function armLoadTimer() {
  clearTimeout(loadTimer)
  if (!props.node.attrs.src) return
  loadTimer = setTimeout(() => (failed.value = true), LOAD_TIMEOUT_MS)
}
function onLoad() {
  clearTimeout(loadTimer)
}
function onError() {
  clearTimeout(loadTimer)
  failed.value = true
}
function tryAgain() {
  if (!props.node.attrs.src) {
    changeEmbedLink()
    return
  }
  failed.value = false
  attempt.value += 1
  armLoadTimer()
}
watch(
  () => props.node.attrs.src,
  () => {
    failed.value = false
    attempt.value += 1
    armLoadTimer()
  },
  { immediate: true },
)
onBeforeUnmount(() => clearTimeout(loadTimer))

const { startResize } = useNodeViewResize(editor, {
  mediaEl: () => iframeRef.value,
  containerEl: () => containerRef.value,
  getAspectRatio: () => aspectRatio.value,
  getPos: () => props.getPos(),
  onCommit: ({ width, height }) => {
    props.updateAttributes({ width, height, aspectRatio: height / width })
    selectIframe()
  },
  minWidth: MIN_WIDTH,
  maxWidthPadding: EDITOR_PADDING,
  // The iframe's committed size renders via the frameStyle `:style` binding.
  mediaSizing: 'style',
})

const showCaption = ref(Boolean(props.node.attrs.title))

// Re-sync when the title attr changes elsewhere (collab, undo, …).
watch(
  () => props.node.attrs.title,
  (title) => {
    if (title) showCaption.value = true
  },
)

function selectIframe(): void {
  const pos = safeGetPos(() => props.getPos())
  if (pos === null) return
  editor.commands.setNodeSelection(pos)
}

function onResizeStart(event: PointerEvent, edge: ResizeEdge): void {
  selectIframe()
  startResize(event, edge)
}

function resizeBy(delta: number): void {
  selectIframe()
  const current =
    width.value ?? containerRef.value?.clientWidth ?? MIN_WIDTH * 3
  const next = Math.max(MIN_WIDTH, current + delta)
  const height = Math.round(next * aspectRatio.value)
  props.updateAttributes({ width: next, height, aspectRatio: height / next })
}

// The arrow keys the handle claims must not reach `handleKeydown` on the
// wrapper, which reads Up/Down as "move the caret out of the node".
function onResizeKeydown(event: KeyboardEvent): void {
  const shrink = event.key === 'ArrowLeft' || event.key === 'ArrowUp'
  const grow = event.key === 'ArrowRight' || event.key === 'ArrowDown'
  if (!shrink && !grow) return
  event.preventDefault()
  event.stopPropagation()
  resizeBy(shrink ? -20 : 20)
}

function setAlignment(align: IframeAlign): void {
  props.updateAttributes({ align })
}

function toggleCaption(): void {
  showCaption.value = !showCaption.value
  if (!showCaption.value) props.updateAttributes({ title: '' })
}

/** A new link for this embed, from the pencil or the menu's Replace: the
 * `replaceIframe` command's to ask for. */
function changeEmbedLink(): void {
  const pos = safeGetPos(() => props.getPos())
  if (pos === null) return
  editor.commands.replaceIframe(pos)
}

function openInBrowser(): void {
  const src = props.node.attrs.src as string | null
  if (src) window.open(src, '_blank', 'noopener')
}

function duplicate(): void {
  duplicateMedia(editor, () => props.getPos())
}

/**
 * The design's "Remove Embed": a word before the deed, since an embed
 * is a link that may be hard to find again. Delete on the menu asks —
 * through `removeIframe`, so a host can ask with a dialog of its own, and
 * with this one when none does; Delete in the dialog does it.
 */
const confirmRemove = ref(false)
function askRemove(): void {
  const pos = safeGetPos(() => props.getPos())
  if (pos === null) return
  if (!editor.commands.removeIframe(pos)) confirmRemove.value = true
}
const removeOptions: Partial<DialogProps> = {
  title: 'Remove Embed',
  message: 'This embedded content will be removed from the document.',
  icon: 'lucide-trash-2',
  theme: 'red',
  size: 'sm',
  actions: [
    { label: 'Cancel', variant: 'subtle', onClick: ({ close }) => close() },
    {
      label: 'Delete',
      variant: 'solid',
      theme: 'red',
      onClick: ({ close }) => {
        close()
        removeMedia(editor, () => props.getPos())
      },
    },
  ],
}

function setCursorAt(pos: number): void {
  editor.commands.focus()
  editor.chain().setTextSelection(pos).scrollIntoView().run()
}

function createParagraphAfter(): void {
  const pos = safeGetPos(() => props.getPos())
  if (pos === null) return
  editor.commands.focus()
  editor
    .chain()
    .setTextSelection(pos + 1)
    .createParagraphNear()
    .scrollIntoView()
    .run()
}

function handleKeydown(event: KeyboardEvent): void {
  const pos = safeGetPos(() => props.getPos())
  if (pos === null) return
  if (event.key === 'Enter') {
    event.preventDefault()
    createParagraphAfter()
  } else if (event.key === 'Escape' || event.key === 'ArrowDown') {
    event.preventDefault()
    setCursorAt(pos + 1)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    setCursorAt(pos - 1)
  }
}

// Caption commits on blur / Enter, not per keystroke.
function commitCaption(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  props.updateAttributes({ title: value })
}
</script>

<template>
  <NodeViewWrapper>
    <div
      ref="containerRef"
      class="relative isolate my-6 block max-w-full not-prose focus:outline-none"
      :class="[
        { [SELECTED_IMAGE_RING]: selected, 'rounded-4': true },
        node.attrs.align === 'center' ? 'mx-auto' : '',
        node.attrs.align === 'right' ? 'ml-auto mr-0' : '',
        node.attrs.align === 'left' ? 'mr-auto ml-0' : '',
      ]"
      :style="{ width: width ? `${width}px` : '100%', maxWidth: '100%' }"
      tabindex="0"
      data-embed-root
      @keydown="handleKeydown"
    >
      <div
        class="group relative overflow-hidden rounded-4"
        data-embed-frame
        :data-failed="showFailed || undefined"
      >
        <template v-if="!showFailed">
          <iframe
            :key="attempt"
            ref="iframeRef"
            class="block max-w-full rounded-4 border-0"
            :class="{ 'pointer-events-none': overlayActive }"
            :src="node.attrs.src"
            :style="frameStyle"
            :title="node.attrs.title || ''"
            :sandbox="sandbox"
            frameborder="0"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            @load="onLoad"
            @error="onError"
            @click.stop="selectIframe"
          />

          <!-- Transparent overlay for selection in edit mode -->
          <div
            v-if="overlayActive"
            class="absolute inset-0 z-10 cursor-pointer"
            @click.stop="selectIframe"
          ></div>
        </template>

        <!-- The design's "Preview failed" (32392:14803): a bordered box the
             embed's own size, the word in the middle, a way to try again. -->
        <div
          v-else
          class="flex w-full flex-col items-center justify-center gap-1.5 rounded-5 border border-outline-gray-1 bg-surface-base px-6"
          :style="frameStyle"
          role="status"
          @click.stop="selectIframe"
        >
          <span
            class="lucide-circle-alert size-5 text-ink-gray-7"
            aria-hidden="true"
          />
          <p
            class="max-w-[300px] text-center text-sm leading-[1.5] tracking-[0.02em] text-ink-gray-7"
          >
            We couldn’t load a preview for this content.<br />Check the link or
            try again.
          </p>
          <Button
            v-if="isEditable"
            variant="subtle"
            size="sm"
            class="mt-2"
            @click.stop="tryAgain"
          >
            Try again
          </Button>
        </div>

        <!-- Shared media toolbar: the design's menu for an embed -->
        <MediaToolbar
          :node="node"
          media-type="embed"
          :is-editable="isEditable"
          :selected="selected"
          :show-caption="showCaption"
          @toggle-caption="toggleCaption"
          @set-align="setAlignment"
          @edit="changeEmbedLink"
          @replace="changeEmbedLink"
          @open="openInBrowser"
          @duplicate="duplicate"
          @remove="askRemove"
        />

        <MediaResizeHandle
          v-if="selected && isEditable && !showFailed"
          label="Resize embed"
          placement="edges"
          @resize-start="onResizeStart"
          @resize-keydown="onResizeKeydown"
        />
      </div>

      <!-- Caption input (commits on blur / Enter) -->
      <input
        v-if="(node.attrs.title || showCaption) && node.attrs.src"
        :value="node.attrs.title"
        class="mt-1.5 h-7 w-full border-0 bg-transparent text-center text-[13px] leading-[1.5] tracking-[0.015em] text-ink-gray-5 placeholder-ink-gray-4 focus:outline-none focus:ring-0 disabled:opacity-60"
        placeholder="Add a caption"
        aria-label="Caption"
        :disabled="!isEditable"
        @blur="commitCaption"
        @keydown.enter.prevent="commitCaption"
      />
    </div>

    <Dialog v-model="confirmRemove" v-bind="removeOptions" />
  </NodeViewWrapper>
</template>
