<script setup lang="ts">
// Figma: espresso-2.0 › toolbar (31815:50348), the floating bar. A 28px
// bar on elevation-2, 2px in, on a 10px radius under the md shadow; its
// controls 24px on an 8px radius with 14px glyphs, pressed on gray-100;
// a divider is a 16px hairline in a 9px slot. It rises over a run of
// text — bold, italic, strike, colour, highlight, link │ left, centre,
// right — and not over a selected block, where there is no text to set.
import { computed, ref, watch } from 'vue'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { Popover } from '../../../src'
import { useResolvedEditor } from '../../../src/molecules/editor/editor-context'
import { InsertLink } from '../../../src/molecules/editor/menu'
import type { TiptapEditor } from '../../../src/molecules/editor'
import RteIcon from './RteIcon.vue'
import RteColorPanel from './RteColorPanel.vue'

const editor = useResolvedEditor(() => undefined)

// the editor is not reactive on its own; a tick per transaction lets the
// controls read their state fresh (as the library's MenuItems does)
const version = ref(0)
watch(
  () => editor.value,
  (ed, _old, onCleanup) => {
    if (!ed) return
    const bump = () => version.value++
    ed.on('transaction', bump)
    onCleanup(() => ed.off('transaction', bump))
  },
  { immediate: true },
)
function live<T>(read: (ed: TiptapEditor) => T, fallback: T): T {
  void version.value
  return editor.value ? read(editor.value) : fallback
}
const chain = () => editor.value!.chain().focus()

type Control = {
  name: string
  icon: string
  label: string
  pressed: () => boolean
  run: () => void
}
const marks: Control[] = [
  {
    name: 'bold',
    icon: 'bold',
    label: 'Bold',
    pressed: () => live((ed) => ed.isActive('bold'), false),
    run: () => chain().toggleBold().run(),
  },
  {
    name: 'italic',
    icon: 'italic',
    label: 'Italic',
    pressed: () => live((ed) => ed.isActive('italic'), false),
    run: () => chain().toggleItalic().run(),
  },
  {
    name: 'strike',
    icon: 'strike-through',
    label: 'Strikethrough',
    pressed: () => live((ed) => ed.isActive('strike'), false),
    run: () => chain().toggleStrike().run(),
  },
]
const aligns: Control[] = (
  [
    ['left', 'align-left', 'Align left'],
    ['center', 'align-center', 'Align centre'],
    ['right', 'align-right', 'Align right'],
  ] as const
).map(([value, icon, label]) => ({
  name: value,
  icon,
  label,
  pressed: () => live((ed) => ed.isActive({ textAlign: value }), false),
  run: () => chain().setTextAlign(value).run(),
}))

const highlighted = computed(() =>
  live((ed) => ed.isActive('namedHighlight'), false),
)
const linked = computed(() => live((ed) => ed.isActive('link'), false))
const coloured = computed(() =>
  live((ed) => !!ed.getAttributes('textStyle').color, false),
)

// The bar sets text, so it comes up for a run of text and not for a
// selected block — a dropped attachment row, the audio bar, an image —
// where bold and italic have nothing to act on. tiptap's own rule shows
// it for any selection that is not empty, a block included.
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
  <BubbleMenu
    v-if="editor"
    :editor="editor"
    :should-show="shouldShow"
    :options="{ placement: 'top' }"
  >
    <div class="rte-bubble" role="toolbar" aria-label="Text formatting">
      <button
        v-for="m in marks"
        :key="m.name"
        type="button"
        class="rte-bubble-btn"
        :aria-pressed="m.pressed()"
        :aria-label="m.label"
        :title="m.label"
        @click="m.run"
      >
        <RteIcon :name="m.icon" class="size-3.5" />
      </button>

      <!-- colour: the picker card (31845:36005) on the library's Popover -->
      <Popover side="bottom" align="start" :offset="6" bare>
        <template #trigger="{ open }">
          <button
            type="button"
            class="rte-bubble-btn"
            :class="open && 'is-open'"
            :aria-pressed="coloured"
            aria-label="Text colour"
            title="Text colour"
          >
            <RteIcon name="text" class="size-3.5" />
          </button>
        </template>
        <template #default="{ close }">
          <RteColorPanel :editor="editor" @pick="close" />
        </template>
      </Popover>

      <button
        type="button"
        class="rte-bubble-btn"
        :aria-pressed="highlighted"
        aria-label="Highlight"
        title="Highlight"
        @click="chain().toggleHighlightByName('yellow').run()"
      >
        <RteIcon name="highlight" class="size-3.5" />
      </button>
      <button
        type="button"
        class="rte-bubble-btn"
        :aria-pressed="linked"
        aria-label="Link"
        title="Link"
        @click="InsertLink.action(editor)"
      >
        <RteIcon name="link" class="size-3.5" />
      </button>

      <span class="rte-bubble-divider" aria-hidden="true" />

      <button
        v-for="a in aligns"
        :key="a.name"
        type="button"
        class="rte-bubble-btn"
        :aria-pressed="a.pressed()"
        :aria-label="a.label"
        :title="a.label"
        @click="a.run"
      >
        <RteIcon :name="a.icon" class="size-3.5" />
      </button>
    </div>
  </BubbleMenu>
</template>

<style>
.rte-bubble {
  @apply flex h-7 items-center rounded-[10px] bg-surface-elevation-2 p-0.5 shadow-md;
}
.rte-bubble-btn {
  @apply flex size-6 shrink-0 items-center justify-center rounded-4 text-ink-gray-7 transition-colors hover:bg-surface-gray-2;
}
.rte-bubble-btn[aria-pressed='true'],
.rte-bubble-btn.is-open {
  @apply bg-surface-gray-2;
}
/* a 9px slot: 4, the hairline, 4 */
.rte-bubble-divider {
  @apply mx-1 h-4 w-px shrink-0;
  background-color: var(--outline-gray-1);
}
</style>
