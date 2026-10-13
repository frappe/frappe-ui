<script setup lang="ts">
// Figma: espresso-2.0 › toolbar (31463:15460) — four variants, every value
// read from the file. One row, no gaps between the buttons; the groups are
// ruled apart by a 9px divider (px 4) holding a 1px outline-gray-1 rule:
//   B I S U | quote code | link image | numbered bullets align-left |
//   Text ▪ Highlight ▫
//   xs         457 × 32 bare: p 4 over a 24px row of 24px buttons (8px
//              radius) with 14px icons; the Text and Highlight buttons are
//              px 6, their 13 gray-700 label 8px from a 14px swatch
//   sm         519 × 36: p 4, 28px buttons, 16px icons, px 8 labels at 14
//              and 16px swatches
//   floating   the same row on the raised surface: p 2, 10px radius and the
//              lg elevation — no border, the shadow's own hairline is the
//              edge (xs 453 × 28, sm 515 × 32)
// Dark: the file's own dark popover (comment new, 30873:37770) sits on
// #1F1F1F with #242424 rules — elevation-1 under outline-gray-1. On
// elevation-2 the card and its dividers are the same #242424, so the
// groups stop reading, so the floating card drops a step in dark and the
// Text swatch's contrast hairline flips to white. The Highlight swatch is
// the file's white chip — a colour, not a surface — so it keeps #FFFFFF
// under its #EDEDED edge in both themes.
// The icons are the file's own (icon/line/…), exported from it. Marks
// toggle, the block buttons exclude one another, and Text and Highlight
// open a swatch palette and show the pick in their swatch.
import { computed, reactive, ref } from 'vue'
import { Popover } from '../../../src'
import alignLeftIcon from '../assets/popover/toolbar/align-left.svg?raw'
import boldIcon from '../assets/popover/toolbar/bold.svg?raw'
import bulletListIcon from '../assets/popover/toolbar/bullet-list.svg?raw'
import codeIcon from '../assets/popover/toolbar/code.svg?raw'
import imageIcon from '../assets/popover/toolbar/image.svg?raw'
import italicIcon from '../assets/popover/toolbar/italic.svg?raw'
import linkIcon from '../assets/popover/toolbar/link.svg?raw'
import numberedListIcon from '../assets/popover/toolbar/numbered-list.svg?raw'
import quoteIcon from '../assets/popover/toolbar/quote.svg?raw'
import strikeIcon from '../assets/popover/toolbar/strike.svg?raw'
import underlineIcon from '../assets/popover/toolbar/underline.svg?raw'

const props = withDefaults(
  defineProps<{ size?: 'xs' | 'sm'; floating?: boolean }>(),
  { size: 'xs', floating: false },
)

const emit = defineEmits<{ format: [command: string, value?: string] }>()

type Mark = 'bold' | 'italic' | 'strike' | 'underline'
type Block = 'quote' | 'code' | 'ordered' | 'bullet' | null

const GROUPS: { id: string; label: string; icon: string; kind: 'mark' | 'block' | 'action' }[][] = [
  [
    { id: 'bold', label: 'Bold', icon: boldIcon, kind: 'mark' },
    { id: 'italic', label: 'Italic', icon: italicIcon, kind: 'mark' },
    { id: 'strike', label: 'Strikethrough', icon: strikeIcon, kind: 'mark' },
    { id: 'underline', label: 'Underline', icon: underlineIcon, kind: 'mark' },
  ],
  [
    { id: 'quote', label: 'Quote', icon: quoteIcon, kind: 'block' },
    { id: 'code', label: 'Code block', icon: codeIcon, kind: 'block' },
  ],
  [
    { id: 'link', label: 'Link', icon: linkIcon, kind: 'action' },
    { id: 'image', label: 'Image', icon: imageIcon, kind: 'action' },
  ],
  [
    { id: 'ordered', label: 'Numbered list', icon: numberedListIcon, kind: 'block' },
    { id: 'bullet', label: 'Bulleted list', icon: bulletListIcon, kind: 'block' },
    { id: 'align', label: 'Align left', icon: alignLeftIcon, kind: 'action' },
  ],
]

const marks = reactive<Record<Mark, boolean>>({
  bold: false,
  italic: false,
  strike: false,
  underline: false,
})
const block = ref<Block>(null)
const aligned = ref(false)

function isOn(id: string) {
  if (id in marks) return marks[id as Mark]
  if (id === 'align') return aligned.value
  return block.value === id
}

function press(item: (typeof GROUPS)[number][number]) {
  if (item.kind === 'mark') marks[item.id as Mark] = !marks[item.id as Mark]
  else if (item.kind === 'block') block.value = block.value === item.id ? null : (item.id as Block)
  else if (item.id === 'align') aligned.value = !aligned.value
  emit('format', item.id)
}

// ---- colours: each swatch pairs a text ink with a highlight surface
const COLOURS = [
  { name: 'Default', ink: 'text-ink-gray-7', fill: 'bg-surface-gray-2' },
  { name: 'Red', ink: 'text-ink-red-5', fill: 'bg-surface-red-2' },
  { name: 'Orange', ink: 'text-ink-orange-5', fill: 'bg-surface-orange-2' },
  { name: 'Amber', ink: 'text-ink-amber-5', fill: 'bg-surface-amber-2' },
  { name: 'Green', ink: 'text-ink-green-5', fill: 'bg-surface-green-2' },
  { name: 'Teal', ink: 'text-ink-teal-5', fill: 'bg-surface-teal-2' },
  { name: 'Blue', ink: 'text-ink-blue-5', fill: 'bg-surface-blue-2' },
  { name: 'Violet', ink: 'text-ink-violet-5', fill: 'bg-surface-violet-2' },
  { name: 'Pink', ink: 'text-ink-pink-5', fill: 'bg-surface-pink-2' },
]
const textColour = ref<(typeof COLOURS)[number] | null>(null)
const highlight = ref<(typeof COLOURS)[number] | null>(null)

// The swatch square is 12.7 of the 14px slot in the file, 14.5 of 16 — it
// does not fill its box.
const s = computed(() =>
  props.size === 'sm'
    ? {
        btn: 'size-7',
        icon: 'size-4',
        label: 'h-7 px-2 text-base',
        slot: 'size-4',
        chip: 'size-[14.5px]',
        rule: 'h-5',
      }
    : {
        btn: 'size-6',
        icon: 'size-3.5',
        label: 'h-6 px-1.5 text-sm',
        slot: 'size-3.5',
        chip: 'size-[12.7px]',
        rule: 'h-4',
      },
)
</script>

<template>
  <div
    class="espresso-toolbar inline-flex items-center"
    :class="
      floating
        ? 'rounded-5 bg-surface-elevation-2 p-0.5 shadow-lg dark:bg-surface-elevation-1'
        : 'p-1'
    "
    role="toolbar"
    :aria-label="`Formatting, ${size}`"
  >
    <template v-for="(group, g) in GROUPS" :key="g">
      <button
        v-for="item in group"
        :key="item.id"
        type="button"
        class="flex items-center justify-center rounded-4 text-ink-gray-7 transition-colors"
        :class="[s.btn, isOn(item.id) ? 'bg-surface-gray-3 text-ink-gray-9' : 'hover:bg-surface-gray-2']"
        :aria-label="item.label"
        :title="item.label"
        :aria-pressed="item.kind === 'action' && item.id !== 'align' ? undefined : isOn(item.id)"
        @click="press(item)"
      >
        <span :class="s.icon" v-html="item.icon" />
      </button>
      <!-- 9px wide, the rule centred in it -->
      <span class="flex w-[9px] justify-center" aria-hidden="true">
        <span class="border-l border-outline-gray-1" :class="s.rule" />
      </span>
    </template>

    <!-- Text colour: the label, then a filled swatch -->
    <Popover align="end">
      <template #trigger>
        <button
          type="button"
          class="flex items-center gap-2 rounded-4 text-ink-gray-7 transition-colors hover:bg-surface-gray-2"
          :class="s.label"
          aria-label="Text colour"
        >
          <span :class="textColour?.ink">Text</span>
          <span class="flex items-center justify-center" :class="s.slot">
            <span
              class="rounded-[4px] border border-[rgba(0,0,0,0.07)] dark:border-[rgba(255,255,255,0.07)]"
              :class="[s.chip, textColour ? ['bg-current', textColour.ink] : 'bg-surface-gray-5']"
            />
          </span>
        </button>
      </template>
      <template #default="{ close }">
        <div class="grid grid-cols-3 gap-1 p-1.5" role="listbox" aria-label="Text colour">
          <button
            v-for="c in COLOURS"
            :key="c.name"
            type="button"
            class="flex h-7 items-center gap-2 rounded-4 px-2 text-sm hover:bg-surface-gray-2"
            :class="c.ink"
            role="option"
            :aria-selected="textColour?.name === c.name"
            @click="((textColour = c.name === 'Default' ? null : c), emit('format', 'textColour', c.name), close())"
          >
            <span class="text-base-medium">A</span>
            <span class="text-ink-gray-7">{{ c.name }}</span>
          </button>
        </div>
      </template>
    </Popover>

    <!-- Highlight: the same, its swatch left empty -->
    <Popover align="end">
      <template #trigger>
        <button
          type="button"
          class="flex items-center gap-2 rounded-4 text-ink-gray-7 transition-colors hover:bg-surface-gray-2"
          :class="s.label"
          aria-label="Highlight colour"
        >
          <span :class="highlight ? [highlight.fill, 'rounded-[3px] px-0.5'] : ''">Highlight</span>
          <span class="flex items-center justify-center" :class="s.slot">
            <!-- the empty swatch is the file's white chip, a colour of its
                 own: it stays white in dark, as the palette's colours do -->
            <span
              class="rounded-[4px] border"
              :class="[
                s.chip,
                highlight
                  ? [highlight.fill, 'border-outline-gray-1']
                  : 'border-[#EDEDED] bg-[#FFFFFF]',
              ]"
            />
          </span>
        </button>
      </template>
      <template #default="{ close }">
        <div class="grid grid-cols-3 gap-1 p-1.5" role="listbox" aria-label="Highlight colour">
          <button
            v-for="c in COLOURS"
            :key="c.name"
            type="button"
            class="flex h-7 items-center gap-2 rounded-4 px-2 text-sm text-ink-gray-7 hover:bg-surface-gray-2"
            role="option"
            :aria-selected="highlight?.name === c.name"
            @click="((highlight = c.name === 'Default' ? null : c), emit('format', 'highlight', c.name), close())"
          >
            <span class="size-3.5 rounded-[4px] border border-outline-gray-1" :class="c.fill" />
            {{ c.name === 'Default' ? 'None' : c.name }}
          </button>
        </div>
      </template>
    </Popover>
  </div>
</template>

<style>
/* the exported icons carry no size of their own, so they take the box's */
.espresso-toolbar svg {
  width: 100%;
  height: 100%;
}
</style>
