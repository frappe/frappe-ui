<script setup lang="ts">
// Figma: espresso-2.0 › input texteditor & richtext › "text-editor new"
// (31633:10471). One editor, three ways of drawing it:
//
// · outline — a 1px gray-200 rule on a 12px radius. Hovered, the rule goes
//   gray-300 under the sm shadow; focused, gray-400 under the same.
// · subtle — no rule, filled gray-100; gray-200 hovered. Focused, it turns
//   white under the outline's focused rule and shadow.
// · ghost — the text alone, 8/12 in; a selection washes amber-100 and the
//   full bar floats over it on a 10px radius under the lg shadow.
//
// And two places for the bar. On top: the full bar 32 tall, 4 in, ruled
// gray-100 beneath; the text 8/12 in, at 14/21; the count of what is left
// of 450 characters in 11px gray-400, 6/12/12 in; and the resizer's two
// strokes 4 off the bottom right corner, which drags the editor taller.
// At the bottom, for a comment: the text, then a bar 41 tall (40 inside
// the box's rule) ruled gray-100
// above, 4/8/4/4 in — the comment bar on the left, Discard and Comment (xs
// buttons, 6 apart) on the right. Disabled, any of them is drawn at half.
import { computed, ref, toRaw } from 'vue'
import { Extension } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { Button, toast } from '../../../src'
import {
  Editor,
  EditorContent,
  RichTextKit,
  type TiptapEditor,
} from '../../../src/molecules/editor'
import { uploadFunction } from '../rich-text/devUpload'
import RteIcon from '../rich-text/RteIcon.vue'
import TeToolbar from './TeToolbar.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'outline' | 'subtle' | 'ghost'
    toolbar?: 'top' | 'bottom' | 'none'
    disabled?: boolean
    /** what it opens with */
    content?: string
    placeholder?: string
    /** the most characters it holds */
    limit?: number
  }>(),
  {
    variant: 'outline',
    toolbar: 'top',
    disabled: false,
    content: '',
    placeholder: 'Type something...',
    limit: 450,
  },
)

const html = ref(props.content)

// ---- the limit: a change that would carry the text past it is refused,
// and the foot counts down what is left
const Limit = Extension.create<{ limit: number }>({
  name: 'teLimit',
  addOptions: () => ({ limit: 450 }),
  addProseMirrorPlugins() {
    const { limit } = this.options
    return [
      new Plugin({
        filterTransaction: (tr, state) =>
          !tr.docChanged ||
          tr.doc.textContent.length <= limit ||
          tr.doc.textContent.length <= state.doc.textContent.length,
      }),
    ]
  },
})

const extensions = [
  RichTextKit.configure({
    // the editor's own: marks, lists, quote, code block, link, image,
    // colour and alignment — none of the document's blocks or menus
    table: false,
    taskList: false,
    iframe: false,
    slashCommands: false,
    mention: false,
    tag: false,
    emoji: false,
    video: false,
    attachment: false,
    // the file draws the placeholder on a disabled editor too
    placeholder: { showOnlyWhenEditable: false },
  }),
  Limit.configure({ limit: props.limit }),
]

const length = ref(0)
const remaining = computed(() => Math.max(0, props.limit - length.value))
function onTransaction(ed: TiptapEditor) {
  length.value = ed.state.doc.textContent.length
}

// ---- the resizer: dragged, the editor grows or shrinks, never under the
// file's 180
const MIN_HEIGHT = 180
const height = ref<number | null>(null)
const box = ref<HTMLElement | null>(null)
function resize(e: PointerEvent) {
  if (props.disabled || !box.value) return
  e.preventDefault()
  const start = e.clientY
  const from = box.value.getBoundingClientRect().height
  const move = (m: PointerEvent) => {
    height.value = Math.max(MIN_HEIGHT, from + m.clientY - start)
  }
  const up = () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    document.documentElement.classList.remove('te-resizing')
  }
  document.documentElement.classList.add('te-resizing')
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
}

// a press anywhere on the body, past the last line too, puts the caret in
function focusEnd(ed: TiptapEditor | null, e: MouseEvent) {
  if (!ed || props.disabled) return
  if ((e.target as HTMLElement).closest('.ProseMirror')) return
  toRaw(ed).commands.focus('end')
}

function discard(ed: TiptapEditor | null) {
  if (ed) toRaw(ed).commands.clearContent(true)
}
function comment(ed: TiptapEditor | null) {
  if (!ed || ed.isEmpty) return
  toast.success('Comment added')
  toRaw(ed).commands.clearContent(true)
}

// the floating bar rises over a run of text, as the ghost editor's does
const shouldShow: InstanceType<typeof BubbleMenu>['$props']['shouldShow'] = ({
  editor: ed,
  state,
  from,
  to,
}) => {
  const { selection } = state
  if (selection.empty || 'node' in selection || !ed.isEditable) return false
  return state.doc.textBetween(from, to).length > 0
}
</script>

<template>
  <div
    ref="box"
    class="te-field"
    :class="[
      `is-${variant}`,
      `has-${toolbar}`,
      disabled && 'is-disabled',
      height !== null && 'is-sized',
    ]"
    :style="height !== null ? { height: `${height}px` } : undefined"
  >
    <Editor
      v-model="html"
      :extensions="extensions"
      :editable="!disabled"
      :placeholder="placeholder"
      :upload-function="uploadFunction"
      @transaction="onTransaction"
    >
      <template #default="{ editor }">
        <div v-if="editor && toolbar === 'top'" class="te-head">
          <TeToolbar :editor="editor" kind="full" :disabled="disabled" />
        </div>

        <div class="te-body v2-scroll" @mousedown="focusEnd(editor, $event)">
          <EditorContent class="te-doc [--prose-font-size:14px]" />
        </div>

        <template v-if="toolbar === 'top'">
          <p class="te-count" aria-live="polite">
            {{ remaining }} characters remaining
          </p>
          <button
            type="button"
            class="te-resizer"
            aria-label="Resize"
            tabindex="-1"
            :disabled="disabled"
            @pointerdown="resize"
          >
            <RteIcon name="te-resizer" class="size-3" />
          </button>
        </template>

        <div v-else-if="editor && toolbar === 'bottom'" class="te-bar">
          <TeToolbar :editor="editor" kind="comment" :disabled="disabled" />
          <div class="flex items-center gap-1.5">
            <Button
              size="xs"
              variant="ghost"
              label="Discard"
              class="te-action"
              :disabled="disabled"
              @click="discard(editor)"
            />
            <Button
              size="xs"
              variant="solid"
              label="Comment"
              class="te-action"
              :disabled="disabled"
              @click="comment(editor)"
            />
          </div>
        </div>

        <BubbleMenu
          v-if="editor && variant === 'ghost'"
          :editor="editor"
          :should-show="shouldShow"
          :options="{ placement: 'top', offset: 12 }"
          class="z-[60]"
        >
          <div class="te-float">
            <TeToolbar :editor="editor" kind="full" />
          </div>
        </BubbleMenu>
      </template>
    </Editor>
  </div>
</template>

<style>
.te-field {
  @apply relative flex w-full flex-col overflow-hidden rounded-6 transition-[background-color,border-color,box-shadow] duration-150;
}
.te-field.has-top,
.te-field.has-bottom {
  @apply h-[180px];
}
.te-field.is-sized {
  @apply h-auto;
}
.te-field.is-disabled {
  @apply opacity-50;
}

/* outline: the rule darkens under the pointer and with the caret in */
.te-field.is-outline {
  @apply border border-outline-gray-2;
}
.te-field.is-outline:not(.is-disabled):hover {
  @apply border-outline-gray-3 shadow-sm;
}
/* subtle: filled, a shade darker under the pointer */
.te-field.is-subtle {
  @apply border border-transparent bg-surface-gray-2;
}
.te-field.is-subtle:not(.is-disabled):hover {
  @apply bg-surface-gray-3;
}
/* either, focused: white under the gray-400 rule */
.te-field.is-outline:not(.is-disabled):focus-within,
.te-field.is-subtle:not(.is-disabled):focus-within {
  @apply border-outline-gray-4 bg-surface-base shadow-sm;
}

/* the file draws the bar 32 tall over the box's rule, so under the 1px
   rule it is 31, its controls 4 from the box's top edge */
.te-head {
  @apply flex h-[31px] shrink-0 items-start border-b border-outline-gray-1 px-1 pt-[3px];
}
.te-body {
  @apply min-h-0 flex-1 cursor-text overflow-y-auto px-3 py-2;
}
.te-field.is-disabled .te-body {
  @apply cursor-default;
}
.te-field.is-ghost .te-body {
  @apply overflow-visible;
}
/* the text at 14/21, the prose's paragraphs edge to edge. Figma counts
   neither the space a line breaks at nor the tracking after its last
   glyph; the editor's break-spaces counts both, so a line the file fits
   to the pixel would wrap a word early. Here the space hangs past the
   line's end (pre-wrap), and the text reaches 1px into its right padding
   to take the tracking. */
.te-doc.ProseMirror {
  line-height: 1.5;
  min-height: 100%;
  margin-right: -1px;
  white-space: pre-wrap;
}
.te-doc.ProseMirror:focus {
  outline: none;
}
.te-field.is-ghost .te-doc.ProseMirror {
  --tw-prose-body: var(--ink-gray-8);
}
.te-doc.ProseMirror p.is-editor-empty:first-child::before {
  color: var(--ink-gray-4);
}
/* disabled, the file draws it gray-700, at the editor's half */
.te-field.is-disabled
  .te-doc.ProseMirror
  p.is-editor-empty:first-child::before {
  color: var(--ink-gray-7);
}
.te-field.is-ghost .te-doc.ProseMirror ::selection {
  background: var(--surface-amber-2);
}

.te-count {
  @apply shrink-0 px-3 pb-[11px] pt-1.5 text-2xs leading-[1.15] text-ink-gray-4;
}
.te-resizer {
  @apply absolute bottom-[3px] right-[3px] flex size-3 cursor-ns-resize items-center justify-center text-ink-gray-4;
}
.te-resizer:disabled {
  @apply cursor-default;
}
.te-resizing,
.te-resizing * {
  cursor: ns-resize !important;
  user-select: none !important;
}

.te-bar {
  @apply flex h-10 shrink-0 items-center justify-between border-t border-outline-gray-1 py-1 pl-1 pr-2;
}
.te-bar > .te-toolbar {
  @apply p-1;
}
/* the file's xs buttons: 13px labels on an 8px radius */
.te-action {
  @apply !rounded-4 !text-sm;
}

.te-float {
  @apply flex h-7 items-center rounded-5 bg-surface-elevation-2 p-0.5 shadow-lg;
}
</style>
