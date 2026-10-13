<script setup lang="ts">
// Figma: espresso-2.0 › input texteditor & richtext (31404:72705), the
// editor's "toolbar new" at its xs size. 24px controls, edge to edge on an
// 8px radius, with 14px gray-700 glyphs, pressed and hovered on gray-100; a
// divider is a 16px gray-100 hairline in a 9px slot. The glyphs are the
// file's own (icons 📄, 23513:46074), as te-*.svg; it has no centre,
// right or justify, so those are the editor's.
//
// The full bar, over the editor or floating over a selection: bold,
// italic, strike, underline │ quote, code block │ link, image │ numbered,
// bulleted, align │ Text and Highlight, each a 13px label 8 off a 14px
// swatch of the colour it holds. The comment bar, under the editor: bold,
// italic, strike │ numbered, bulleted, link.
import { computed, h, onBeforeUnmount, ref, toRaw } from 'vue'
import { Dropdown, Popover, Tooltip } from '../../../src'
import type { DropdownOptions } from '../../../src/components/Dropdown/types'
import { InsertLink } from '../../../src/molecules/editor/menu'
import { useNamedColorState } from '../../../src/molecules/editor/composables/useNamedColorState'
import type { TiptapEditor } from '../../../src/molecules/editor'
import RteIcon from '../rich-text/RteIcon.vue'
import RteColorPanel from '../rich-text/RteColorPanel.vue'

const props = defineProps<{
  editor: TiptapEditor
  kind: 'full' | 'comment'
  disabled?: boolean
  /** riding over a selection: the align menu opens inside the bar */
  floating?: boolean
}>()

// Over a selection the bar is placed by its own floating layer: a menu
// portalled to the page's end would be placed before the bar is, and
// open at the page's corner, so there it opens in a host inside the bar
const menuHost = ref<HTMLElement | null>(null)

const chain = () => toRaw(props.editor).chain().focus()

// the editor is not reactive on its own: a tick per transaction lets the
// pressed controls and the alignment's glyph follow the caret
const tick = ref(0)
const bump = () => tick.value++
toRaw(props.editor).on('transaction', bump)
onBeforeUnmount(() => toRaw(props.editor).off('transaction', bump))
const active = (name: string, attrs?: Record<string, unknown>) =>
  tick.value >= 0 && props.editor.isActive(name, attrs)

type Control = {
  name: string
  label: string
  icon: string
  pressed?: () => boolean
  run: () => void
}

const bold: Control = {
  name: 'bold',
  label: 'Bold',
  icon: 'te-bold',
  pressed: () => active('bold'),
  run: () => chain().toggleBold().run(),
}
const italic: Control = {
  name: 'italic',
  label: 'Italic',
  icon: 'te-italic',
  pressed: () => active('italic'),
  run: () => chain().toggleItalic().run(),
}
const strike: Control = {
  name: 'strike',
  label: 'Strikethrough',
  icon: 'te-strike',
  pressed: () => active('strike'),
  run: () => chain().toggleStrike().run(),
}
const underline: Control = {
  name: 'underline',
  label: 'Underline',
  icon: 'te-underline',
  pressed: () => active('underline'),
  run: () => chain().toggleUnderline().run(),
}
const quote: Control = {
  name: 'quote',
  label: 'Quote',
  icon: 'te-quote',
  pressed: () => active('blockquote'),
  run: () => chain().toggleBlockquote().run(),
}
const code: Control = {
  name: 'code',
  label: 'Code block',
  icon: 'te-code',
  pressed: () => active('codeBlock'),
  run: () => chain().toggleCodeBlock().run(),
}
const link: Control = {
  name: 'link',
  label: 'Link',
  icon: 'te-link',
  pressed: () => active('link'),
  run: () => InsertLink.action(toRaw(props.editor)),
}
const image: Control = {
  name: 'image',
  label: 'Image',
  icon: 'te-image',
  run: () => chain().selectAndUploadImage().run(),
}
const numbered: Control = {
  name: 'numbered',
  label: 'Numbered list',
  icon: 'te-numbered',
  pressed: () => active('orderedList'),
  run: () => chain().toggleOrderedList().run(),
}
const bulleted: Control = {
  name: 'bulleted',
  label: 'Bulleted list',
  icon: 'te-bullet',
  pressed: () => active('bulletList'),
  run: () => chain().toggleBulletList().run(),
}

// the bar's runs of controls, a divider between one run and the next
const groups = computed<Control[][]>(() =>
  props.kind === 'full'
    ? [
        [bold, italic, strike, underline],
        [quote, code],
        [link, image],
        [numbered, bulleted],
      ]
    : [
        [bold, italic, strike],
        [numbered, bulleted, link],
      ],
)

// ---- alignment: one control, its glyph the alignment in force
const ALIGNS = [
  { value: 'left', label: 'Left', icon: 'te-align-left' },
  { value: 'center', label: 'Center', icon: 'align-center' },
  { value: 'right', label: 'Right', icon: 'align-right' },
  { value: 'justify', label: 'Justify', icon: 'align-justify' },
] as const
const align = computed(
  () =>
    ALIGNS.find(
      (a) => tick.value >= 0 && props.editor.isActive({ textAlign: a.value }),
    ) ?? ALIGNS[0],
)
const alignOptions = computed<DropdownOptions>(() =>
  ALIGNS.map((a) => ({
    label: a.label,
    icon: () => h(RteIcon, { name: a.icon, class: 'size-4' }),
    onClick: () => chain().setTextAlign(a.value).run(),
  })),
)

// ---- colour: each swatch shows the colour in force, the panel sets it
const { activeTextColor, activeHighlightColor } = useNamedColorState(
  toRaw(props.editor),
)
// the palette's names are the token hues, but for indigo, drawn in violet
const hue = (name: string) => (name === 'indigo' ? 'violet' : name)
const textSwatch = computed(() =>
  activeTextColor.value
    ? {
        background: `var(--${hue(activeTextColor.value)}-500)`,
        borderColor: `var(--${hue(activeTextColor.value)}-600)`,
      }
    : undefined,
)
const highlightSwatch = computed(() =>
  activeHighlightColor.value
    ? {
        background: `var(--${hue(activeHighlightColor.value)}-100)`,
        borderColor: `var(--${hue(activeHighlightColor.value)}-300)`,
      }
    : undefined,
)
</script>

<template>
  <div
    class="te-toolbar flex items-center"
    role="toolbar"
    aria-label="Formatting"
    :aria-disabled="disabled || undefined"
  >
    <template v-for="(group, gi) in groups" :key="gi">
      <span v-if="gi > 0" class="te-divider" aria-hidden="true" />
      <Tooltip v-for="c in group" :key="c.name" :text="c.label">
        <button
          type="button"
          class="te-btn"
          :aria-pressed="c.pressed ? c.pressed() : undefined"
          :aria-label="c.label"
          :disabled="disabled"
          @mousedown.prevent
          @click="c.run"
        >
          <RteIcon :name="c.icon" class="size-3.5" />
        </button>
      </Tooltip>
    </template>

    <template v-if="kind === 'full'">
      <Dropdown
        :options="alignOptions"
        side="bottom"
        align="start"
        :offset="floating ? 8 : 4"
        :modal="!floating"
        :portal-to="floating ? (menuHost ?? undefined) : undefined"
        :disabled="disabled"
      >
        <template #trigger="{ open }">
          <button
            type="button"
            class="te-btn"
            :class="open && 'is-open'"
            :aria-label="`Align: ${align.label}`"
            :disabled="disabled"
          >
            <RteIcon :name="align.icon" class="size-3.5" />
          </button>
        </template>
      </Dropdown>

      <div v-if="floating" ref="menuHost" class="te-menus" />

      <span class="te-divider" aria-hidden="true" />

      <!-- Text and Highlight open the colour card (31845:36005), which
           sets either; a Tooltip on a Popover's own trigger stops it
           opening, so none is put there -->
      <Popover side="bottom" align="start" :offset="6" bare>
        <template #trigger="{ open }">
          <button
            type="button"
            class="te-btn te-swatch-btn"
            :class="open && 'is-open'"
            aria-label="Text colour"
            :disabled="disabled"
            @mousedown.prevent
          >
            <span>Text</span>
            <span class="te-swatch is-text" :style="textSwatch" />
          </button>
        </template>
        <template #default="{ close }">
          <RteColorPanel :editor="editor" @pick="close" />
        </template>
      </Popover>
      <Popover side="bottom" align="start" :offset="6" bare>
        <template #trigger="{ open }">
          <button
            type="button"
            class="te-btn te-swatch-btn"
            :class="open && 'is-open'"
            aria-label="Highlight"
            :disabled="disabled"
            @mousedown.prevent
          >
            <span>Highlight</span>
            <span class="te-swatch is-highlight" :style="highlightSwatch" />
          </button>
        </template>
        <template #default="{ close }">
          <RteColorPanel :editor="editor" @pick="close" />
        </template>
      </Popover>
    </template>
  </div>
</template>

<style>
.te-btn {
  @apply flex h-6 min-w-6 shrink-0 items-center justify-center rounded-4 text-ink-gray-7 transition-colors;
}
.te-btn:not(:disabled):hover,
.te-btn[aria-pressed='true'],
.te-btn.is-open {
  @apply bg-surface-gray-2;
}
.te-btn:disabled {
  @apply cursor-default;
}
/* Text and Highlight: the 13px label 8 off its swatch, 6 in either side */
.te-swatch-btn {
  @apply gap-2 px-1.5 text-sm text-ink-gray-7;
}
.te-swatch {
  @apply size-3.5 shrink-0 rounded-1 border;
}
/* unset, the text swatch is the file's gray-300, edged a shade darker,
   and the highlight's is the page's own white under a gray-100 hairline */
.te-swatch.is-text {
  @apply border-black/[0.07] bg-surface-gray-5;
}
.te-swatch.is-highlight {
  @apply border-outline-gray-1 bg-surface-base;
}
.te-menus {
  @apply contents;
}
.te-divider {
  @apply mx-1 h-4 w-px shrink-0 bg-surface-gray-3;
}
</style>
