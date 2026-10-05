<script setup lang="ts">
// Figma: espresso-2.0 › toolbar (35728:87337), the floating bar. A 28px
// bar on elevation-2, 2px in, on a 10px radius under the md shadow. It
// opens with the block style's select — 100×24 on a 6px radius, 6/4 in,
// the 13/15 gray-700 label and a 14px chevron — whose menu is the file's
// 180px card: 4px in on a 10px radius under the xl shadow, rows 28px on an
// 8px radius with a 16px glyph 6px off the 14/16 gray-700 label. Then
// 24px controls on an 8px radius with 14px gray-700 glyphs, pressed on
// gray-100: bold, italic, underline, strike, link, text colour, highlight
// │ left, centre, right; a divider is a 16px hairline in a 9px slot. It
// rises over a run of text — not over a selected block, where there is no
// text to set.
import { computed, h, ref, watch } from 'vue'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import { Dropdown, Popover } from '../../../src'
import type { DropdownOptions } from '../../../src/components/Dropdown/types'
import { useResolvedEditor } from '../../../src/molecules/editor/editor-context'
import { InsertLink } from '../../../src/molecules/editor/menu'
import type { TiptapEditor } from '../../../src/molecules/editor'
import RteIcon from './RteIcon.vue'
import RteColorPanel from './RteColorPanel.vue'
import {
  BLOCKS,
  type BlockValue,
  activeBlockOf,
  applyBlock,
  blockLabel,
} from './rteBlocks'

const editor = useResolvedEditor(() => undefined)
const icon = (name: string) => () => h(RteIcon, { name })

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

// ---- the block style select, and its menu (rteBlocks, as the toolbar's)
const menuHost = ref<HTMLElement | null>(null)
const activeBlock = computed<BlockValue>(() =>
  live((ed) => activeBlockOf(ed), 'paragraph'),
)
const blockOptions = computed<DropdownOptions>(() =>
  BLOCKS.map((b) => ({
    label: b.label,
    icon: icon(b.icon),
    selected: activeBlock.value === b.value,
    onClick: () => applyBlock(chain(), b.value),
  })),
)

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
    name: 'underline',
    icon: 'underline1',
    label: 'Underline',
    pressed: () => live((ed) => ed.isActive('underline'), false),
    run: () => chain().toggleUnderline().run(),
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
  // nor over a selected row, column or run of cells: those have the
  // table's own menus (RteTableControls)
  if ('$anchorCell' in selection) return false
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
      <!-- the block style: "Text ⌄", its menu 10px beneath, flush with the
           bar's left edge -->
      <Dropdown
        :options="blockOptions"
        side="bottom"
        align="start"
        :offset="10"
        :modal="false"
        :portal-to="menuHost ?? undefined"
      >
        <template #trigger="{ open }">
          <button
            type="button"
            class="rte-bubble-select"
            :class="open && 'is-open'"
            aria-label="Text style"
          >
            <span class="truncate text-sm leading-[15px]">{{
              blockLabel(activeBlock)
            }}</span>
            <RteIcon name="small-down" class="size-3.5 shrink-0" />
          </button>
        </template>
      </Dropdown>
      <div ref="menuHost" class="rte-bubble-menus" />

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

      <!-- highlight: the file draws it with the same A glyph as the colour -->
      <button
        type="button"
        class="rte-bubble-btn"
        :aria-pressed="highlighted"
        aria-label="Highlight"
        title="Highlight"
        @click="chain().toggleHighlightByName('yellow').run()"
      >
        <RteIcon name="text" class="size-3.5" />
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
/* the select: 100×24, 6/4 in, the label and chevron 4 apart on a 6px
   radius; filled gray-100 under the pointer and while its menu is open */
.rte-bubble-select {
  @apply flex h-6 w-[100px] shrink-0 items-center justify-between gap-1 rounded-[6px] py-1 pl-1.5 pr-1 text-ink-gray-7 transition-colors hover:bg-surface-gray-2;
}
.rte-bubble-select.is-open {
  @apply bg-surface-gray-2;
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
/* the select's menu: the file's 180px card, 4px in on a 10px radius under
   the xl shadow; its rows the library's, 28px on an 8px radius with the
   16px glyph 6px off the 14/16 gray-700 label */
.rte-bubble-menus .menu-content[data-slot='content'] {
  @apply w-[180px] p-0 shadow-xl;
  min-width: 0;
  border-radius: 10px !important;
  --tw-ring-color: transparent;
  /* flush with the bar's left edge, 2px out from the select's */
  margin-left: -2px;
}
.rte-bubble-menus [data-slot='item'] {
  @apply text-ink-gray-7;
}
</style>
