<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import MediaToolbar from '#molecules/editor/components/MediaToolbar.vue'
import MediaResizeHandles from '#molecules/editor/components/MediaResizeHandles.vue'
import { useNodeViewEditable } from '#molecules/editor/composables/useNodeViewEditable'
import { useNodeViewResize } from '#molecules/editor/composables/useNodeViewResize'
import { safeGetPos } from '#molecules/editor/extensions/shared/node-view'
import { IFRAME_SANDBOX } from './iframe-allowlist'
import { openIframeInsertDialog } from './iframeInsertDialogController'
import type { IframeAlign } from './iframe-commands'

const props = defineProps(nodeViewProps)

// VueNodeViewRenderer passes a reactive-proxied editor; dispatching a
// transaction through it trips ProseMirror's by-reference doc check
// ("Applying a mismatched transaction"). Use the raw editor for all commands.
// (Same rationale as MediaNodeView.)
const editor = toRaw(props.editor)

const MIN_WIDTH = 200
const EDITOR_PADDING = 40

const iframeRef = ref<HTMLIFrameElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

const isEditable = useNodeViewEditable(editor)

// Single style source: derive from the committed node attrs. (The legacy view
// also kept a desynced `iframeStyles` computed off a local ref — removed.)
const aspectRatio = computed<number>(
  () => (props.node.attrs.aspectRatio as number | null) ?? 9 / 16,
)

const frameStyle = computed(() => {
  const width = (props.node.attrs.width as number | null) ?? 640
  const height =
    (props.node.attrs.height as number | null) ??
    Math.round(width * aspectRatio.value)
  return { width: `${width}px`, height: `${height}px` }
})

const sandbox = computed<string>(() => IFRAME_SANDBOX)

const isInteractive = computed<boolean>(() => !!props.node.attrs.interactive)
const overlayActive = computed(() => isEditable.value && !isInteractive.value)

const { startResize } = useNodeViewResize(editor, {
  mediaEl: () => iframeRef.value,
  containerEl: () => containerRef.value,
  getAspectRatio: () => aspectRatio.value,
  getPos: () => props.getPos(),
  onCommit: ({ width, height }) => {
    props.updateAttributes({ width, height, aspectRatio: height / width })
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

function onResizeStart(event: PointerEvent, edge: 'left' | 'right'): void {
  selectIframe()
  startResize(event, edge)
}

function setAlignment(align: IframeAlign): void {
  props.updateAttributes({ align })
}

function toggleCaption(): void {
  showCaption.value = !showCaption.value
  if (!showCaption.value) props.updateAttributes({ title: '' })
}

function changeEmbedLink(): void {
  openIframeInsertDialog({
    editor,
    getReplacePos: () => safeGetPos(() => props.getPos()) ?? undefined,
    initialUrl: (props.node.attrs.src as string | null) ?? undefined,
  })
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
      class="relative isolate my-6 block max-w-full overflow-hidden rounded-lg not-prose focus:outline-none"
      :class="[
        { 'ring-2 ring-outline-gray-3 ring-offset-2': selected },
        node.attrs.align === 'center' ? 'mx-auto' : '',
        node.attrs.align === 'right' ? 'ml-auto mr-0' : '',
        node.attrs.align === 'left' ? 'mr-auto ml-0' : '',
      ]"
      :style="{
        width: node.attrs.width ? `${node.attrs.width}px` : 'auto',
        maxWidth: '100%',
      }"
      tabindex="0"
      @keydown="handleKeydown"
    >
      <div class="relative">
        <iframe
          v-if="node.attrs.src"
          ref="iframeRef"
          class="block h-auto max-w-full rounded-lg border-0"
          :class="{ 'pointer-events-none': overlayActive }"
          :src="node.attrs.src"
          :style="frameStyle"
          :title="node.attrs.title || ''"
          :sandbox="sandbox"
          frameborder="0"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          @click.stop="selectIframe"
        />

        <!-- Transparent overlay for selection in edit mode -->
        <div
          v-if="overlayActive"
          class="absolute inset-0 z-10 cursor-pointer"
          @click.stop="selectIframe"
        ></div>

        <!-- Shared media toolbar (caption / change link / align) -->
        <MediaToolbar
          v-if="node.attrs.src"
          :node="node"
          media-type="embed"
          :is-editable="isEditable"
          :selected="selected"
          :show-caption="showCaption"
          @toggle-caption="toggleCaption"
          @set-align="setAlignment"
          @replace="changeEmbedLink"
        />

        <MediaResizeHandles
          v-if="selected && isEditable"
          label="Resize embed"
          @resize-start="onResizeStart"
        />

        <!-- Placeholder while no src is set -->
        <div
          v-if="!node.attrs.src"
          class="flex h-[360px] w-[640px] items-center justify-center rounded-lg bg-surface-gray-1"
        >
          <div class="text-center text-ink-gray-5">
            <div class="mb-1 text-lg">🔗</div>
            <div class="text-sm">Loading embed…</div>
          </div>
        </div>
      </div>

      <!-- Caption input (commits on blur / Enter) -->
      <input
        v-if="(node.attrs.title || showCaption) && node.attrs.src"
        :value="node.attrs.title"
        class="mt-2 h-7 w-full border-0 bg-transparent text-center text-sm text-ink-gray-6 placeholder-ink-gray-4 focus:outline-none focus:ring-0 disabled:opacity-60"
        placeholder="Add caption"
        :disabled="!isEditable"
        @blur="commitCaption"
        @keydown.enter.prevent="commitCaption"
      />
    </div>
  </NodeViewWrapper>
</template>
