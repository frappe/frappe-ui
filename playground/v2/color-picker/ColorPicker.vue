<script setup lang="ts">
// Figma: Core-screens-unified › colour picker (2398:141499). One 260px card
// on the raised popover surface — 16px corners, the base shadow, 10px in
// (12 at the foot when rows of fields end it) — whose parts the props switch
// on, as the file's ten variants do:
//   tabs        a subtle sm tab row across the top: solid · gradient · image
//   hue label   "Hue" and its degrees, a 28px row over the hue bar
//   eyedropper  a 28px outline button beside the bars, the bars 204 wide
//   alpha       a second 14px bar under the hue bar, over a checkerboard
//   inputs      a 28px row: the format select (66) · the fields, 1px apart
//   saved       "Saved" with a ghost Add, and a row of 14px dots
// The square is 240 × 200, 8px corners; the bars 15 high with 8px corners;
// every thumb 14px, a 3.5px white ring around the colour it holds. Text is
// 14 regular: gray-700 labels and values, gray-500 hints, gray-600 in the
// select. The gradient tab shows a 240 × 40 bar and a row per stop; the
// image tab a 240 × 200 checkerboard with a solid "Upload image", or the
// picture itself once one is in.
import { computed, h, reactive, ref, watch } from 'vue'
import { Button, Select, Slider, TabButtons, TextInput } from '../../../src'
import EIcon from '../../espresso-sidebar/EIcon.vue'
import {
  CHECKER,
  FORMATS,
  clamp,
  layer,
  hslToHsv,
  hsvToHsl,
  hsvToRgb,
  parseHex,
  parseNumber,
  rgbToHex,
  rgbToHsv,
  toCss,
  type Format,
  type HSV,
  type Mode,
  type Stop,
} from './color'
import sample from '../assets/color-picker/sample.jpg'

const props = withDefaults(
  defineProps<{
    tabs?: boolean
    hueLabel?: boolean
    eyedropper?: boolean
    alpha?: boolean
    inputs?: boolean
    saved?: boolean
  }>(),
  {
    tabs: true,
    hueLabel: false,
    eyedropper: true,
    alpha: true,
    inputs: true,
    saved: true,
  },
)

const emit = defineEmits<{
  /** the picked value as CSS: a colour, a gradient, or an image url */
  change: [value: string, mode: Mode]
}>()

// the file's glyphs, as the components take an icon
const glyph = (name: string) => () => h(EIcon, { name })

const mode = ref<Mode>('solid')
const TABS = [
  { value: 'solid', label: 'Solid colour', icon: glyph('colour-picker') },
  { value: 'gradient', label: 'Gradient', icon: glyph('gradient') },
  { value: 'image', label: 'Image', icon: glyph('image-add') },
]

// ---- the colour: hue on the bar, saturation and value on the square
const hsv = ref<HSV>({ h: 0, s: 94, v: 100 })
// the state under the props of the same name: the fill's opacity, and the kept colours
const alphaValue = ref(100)
const format = ref<Format>('hex')

const rgb = computed(() => hsvToRgb(hsv.value))
const hex = computed(() => rgbToHex(rgb.value))
const hsl = computed(() => hsvToHsl(hsv.value))
const solid = computed(() => `#${hex.value}`)
const hueCss = computed(() => `hsl(${hsv.value.h} 100% 50%)`)
const css = computed(() => toCss(hsv.value, alphaValue.value))

function setRgb(next: { r: number; g: number; b: number }) {
  hsv.value = rgbToHsv(next, hsv.value.h)
}

// the square: left to right is saturation, bottom to top is value
const square = ref<HTMLElement | null>(null)
function pick(e: PointerEvent) {
  const r = square.value?.getBoundingClientRect()
  if (!r) return
  hsv.value = {
    ...hsv.value,
    s: clamp((e.clientX - r.left) / r.width, 0, 1) * 100,
    v: (1 - clamp((e.clientY - r.top) / r.height, 0, 1)) * 100,
  }
}
function squareDown(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  el.setPointerCapture(e.pointerId)
  el.focus()
  pick(e)
}
function squareMove(e: PointerEvent) {
  if (e.buttons & 1) pick(e)
}
function squareKey(e: KeyboardEvent) {
  const step = e.shiftKey ? 10 : 1
  const s = Math.round(hsv.value.s)
  const v = Math.round(hsv.value.v)
  const next: Partial<HSV> =
    e.key === 'ArrowLeft'
      ? { s: clamp(s - step, 0, 100) }
      : e.key === 'ArrowRight'
        ? { s: clamp(s + step, 0, 100) }
        : e.key === 'ArrowUp'
          ? { v: clamp(v + step, 0, 100) }
          : e.key === 'ArrowDown'
            ? { v: clamp(v - step, 0, 100) }
            : {}
  if (!Object.keys(next).length) return
  e.preventDefault()
  hsv.value = { ...hsv.value, ...next }
}
// the thumb stays inside the square: its centre runs 7px in from each edge
const thumbStyle = computed(() => ({
  left: `calc(${hsv.value.s}% + ${7 - 0.14 * hsv.value.s}px)`,
  top: `calc(${100 - hsv.value.v}% + ${7 - 0.14 * (100 - hsv.value.v)}px)`,
  background: solid.value,
}))

// the bars are the library's Slider, drawn as the file draws them (below)
const hue = computed({
  get: () => [Math.round(hsv.value.h)],
  set: ([h]) => (hsv.value = { ...hsv.value, h }),
})
const opacity = computed({
  get: () => [alphaValue.value],
  set: ([a]) => (alphaValue.value = Math.round(a)),
})
const HUE_TRACK =
  'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
const alphaTrack = computed(
  () => `linear-gradient(to right, transparent, ${solid.value}), ${CHECKER}`,
)

// ---- the fields: each edits a draft, and the colour takes it when it parses.
// A hex takes as it is typed once it is six long; a number only on Enter or
// leaving, so a half-typed "10" is not read as ten on the way to a hundred.
function field(
  source: () => string,
  apply: (text: string, final: boolean) => boolean,
) {
  const draft = ref(source())
  watch(source, (v) => (draft.value = v))
  return reactive({
    draft,
    input(v: string | number) {
      draft.value = String(v)
      apply(draft.value, false)
    },
    commit() {
      if (!apply(draft.value, true)) draft.value = source()
    },
  })
}

const hexField = field(
  () => hex.value,
  (text, final) => {
    const bare = text.trim().replace(/^#/, '')
    if (!final && bare.length !== 6) return false
    const parsed = parseHex(bare)
    if (!parsed) return false
    setRgb(parsed)
    return true
  },
)

const alphaField = field(
  () => `${alphaValue.value} %`,
  (text, final) => {
    const n = parseNumber(text)
    if (!final || n === null) return false
    alphaValue.value = clamp(n, 0, 100)
    return true
  },
)

// the three channels of the non-hex formats
const channels = computed(() => {
  const f = format.value
  if (f === 'rgb')
    return [
      { key: 'r', value: rgb.value.r, max: 255 },
      { key: 'g', value: rgb.value.g, max: 255 },
      { key: 'b', value: rgb.value.b, max: 255 },
    ]
  if (f === 'hsl')
    return [
      { key: 'h', value: Math.round(hsl.value.h), max: 360 },
      { key: 's', value: Math.round(hsl.value.s), max: 100 },
      { key: 'l', value: Math.round(hsl.value.l), max: 100 },
    ]
  return [
    { key: 'h', value: Math.round(hsv.value.h), max: 360 },
    { key: 's', value: Math.round(hsv.value.s), max: 100 },
    { key: 'v', value: Math.round(hsv.value.v), max: 100 },
  ]
})
function setChannel(i: number, n: number) {
  const ch = channels.value
  const values = ch.map((c, k) => (k === i ? clamp(n, 0, c.max) : c.value))
  if (format.value === 'rgb')
    setRgb({ r: values[0], g: values[1], b: values[2] })
  else if (format.value === 'hsl')
    hsv.value = hslToHsv({ h: values[0], s: values[1], l: values[2] })
  else hsv.value = { h: values[0], s: values[1], v: values[2] }
}
const channelFields = [0, 1, 2].map((i) =>
  field(
    () => String(channels.value[i]?.value ?? ''),
    (text, final) => {
      const n = parseNumber(text)
      if (!final || n === null) return false
      setChannel(i, n)
      return true
    },
  ),
)

// ---- saved colours: the file's gray ramp, and whatever Add keeps
const swatches = ref([
  '383838',
  '525252',
  '7C7C7C',
  '999999',
  'C7C7C7',
  'E2E2E2',
  'EDEDED',
])
const MAX_SAVED = 9
function save() {
  if (swatches.value.includes(hex.value)) return
  swatches.value = [...swatches.value, hex.value].slice(-MAX_SAVED)
}
function recall(value: string) {
  const parsed = parseHex(value)
  if (parsed) setRgb(parsed)
}

// ---- the eyedropper: the browser's, where it has one
const canDrop = typeof window !== 'undefined' && 'EyeDropper' in window
async function dropper() {
  try {
    const result = await new (window as any).EyeDropper().open()
    const parsed = parseHex(result.sRGBHex)
    if (parsed) setRgb(parsed)
  } catch {
    // closed without picking
  }
}

// ---- gradient: two stops, left to right
const stops = ref<Stop[]>([
  { at: 0, hex: '545454', alpha: 100 },
  { at: 100, hex: '212121', alpha: 100 },
])
const stopCss = (s: Stop) => {
  const parsed = parseHex(s.hex)
  return parsed ? toCss(rgbToHsv(parsed), s.alpha) : `#${s.hex}`
}
const gradientCss = computed(
  () =>
    `linear-gradient(90deg, ${stops.value
      .map((s) => `${stopCss(s)} ${s.at}%`)
      .join(', ')})`,
)
const stopFields = stops.value.map((_, i) => ({
  at: field(
    () => `${stops.value[i].at}%`,
    (text, final) => {
      const n = parseNumber(text)
      if (!final || n === null) return false
      stops.value[i].at = clamp(n, 0, 100)
      return true
    },
  ),
  hex: field(
    () => stops.value[i].hex,
    (text, final) => {
      const bare = text.trim().replace(/^#/, '')
      if (!final && bare.length !== 6) return false
      const parsed = parseHex(bare)
      if (!parsed) return false
      stops.value[i].hex = rgbToHex(parsed)
      return true
    },
  ),
  alpha: field(
    () => `${stops.value[i].alpha} %`,
    (text, final) => {
      const n = parseNumber(text)
      if (!final || n === null) return false
      stops.value[i].alpha = clamp(n, 0, 100)
      return true
    },
  ),
}))

// ---- image: a file from the disk, dropped or chosen
const image = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
function setImage(src: string | null) {
  if (image.value?.startsWith('blob:')) URL.revokeObjectURL(image.value)
  image.value = src
}
function takeFile(file: File | undefined) {
  if (!file || !file.type.startsWith('image/')) return
  setImage(URL.createObjectURL(file))
}
function onDrop(e: DragEvent) {
  dragging.value = false
  takeFile(e.dataTransfer?.files?.[0])
}
/** the file's own example picture, for a look at the filled state */
function loadSample() {
  mode.value = 'image'
  setImage(sample)
}
defineExpose({ loadSample })

// ---- what the picker is worth, as CSS
const value = computed(() => {
  if (mode.value === 'gradient') return gradientCss.value
  if (mode.value === 'image') return image.value ? `url(${image.value})` : ''
  return css.value
})
watch(value, (v) => emit('change', v, mode.value), { immediate: true })

// the card pads 12 at the foot when a row of fields or dots ends it
const rowsAtFoot = computed(
  () =>
    mode.value === 'gradient' ||
    (mode.value === 'solid' && (props.inputs || props.saved)),
)
</script>

<template>
  <div
    class="flex w-[260px] flex-col gap-2.5 rounded-7 bg-surface-elevation-2 p-2.5 shadow"
    :class="rowsAtFoot && 'pb-3'"
  >
    <TabButtons
      v-if="tabs"
      v-model="mode"
      :options="TABS"
      variant="subtle"
      size="sm"
      fluid
      class="-mb-0.5"
      aria-label="Fill type"
    />

    <!-- solid -->
    <template v-if="mode === 'solid'">
      <div class="flex flex-col gap-2.5">
        <div class="flex flex-col">
          <div
            ref="square"
            class="cp-square relative h-[200px] w-[240px] cursor-crosshair touch-none rounded-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-3"
            :style="{
              background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueCss})`,
            }"
            role="slider"
            tabindex="0"
            aria-label="Saturation and brightness"
            :aria-valuetext="`Saturation ${Math.round(hsv.s)}%, brightness ${Math.round(hsv.v)}%`"
            @pointerdown="squareDown"
            @pointermove="squareMove"
            @keydown="squareKey"
          >
            <span
              class="cp-thumb pointer-events-none absolute"
              :style="thumbStyle"
            />
          </div>

          <div v-if="hueLabel" class="flex h-7 items-center gap-1">
            <span class="flex-1 text-base leading-4 text-ink-gray-7">Hue</span>
            <span class="text-base leading-4 text-ink-gray-5"
              >{{ Math.round(hsv.h) }}°</span
            >
          </div>

          <div
            class="flex items-center gap-2"
            :class="hueLabel ? (inputs ? 'pb-3.5' : '') : 'py-2'"
          >
            <Button
              v-if="eyedropper"
              variant="outline"
              size="sm"
              :icon="glyph('colour-picker')"
              :disabled="!canDrop"
              :tooltip="
                canDrop
                  ? 'Pick a colour from the screen'
                  : 'Not available in this browser'
              "
              aria-label="Pick a colour from the screen"
              @click="dropper"
            />
            <div class="flex min-w-0 flex-1 flex-col gap-1.5">
              <Slider
                v-model="hue"
                class="cp-bar"
                :style="{ '--cp-track': HUE_TRACK, '--cp-thumb': hueCss }"
                :min="0"
                :max="360"
                :step="1"
                aria-label="Hue"
              />
              <Slider
                v-if="alpha"
                v-model="opacity"
                class="cp-bar cp-bar-alpha"
                :style="{ '--cp-track': alphaTrack, '--cp-thumb': solid }"
                :min="0"
                :max="100"
                :step="1"
                aria-label="Opacity"
              />
            </div>
          </div>

          <div v-if="inputs" class="flex h-7 items-center gap-1.5">
            <Select
              v-model="format"
              :options="FORMATS"
              size="sm"
              variant="subtle"
              side="bottom"
              class="w-[66px] shrink-0"
              aria-label="Colour format"
            />
            <div class="cp-fields flex min-w-0 flex-1 gap-px">
              <TextInput
                v-if="format === 'hex'"
                v-model="hexField.draft"
                class="min-w-0 flex-1"
                aria-label="Hex"
                spellcheck="false"
                @update:model-value="hexField.input"
                @blur="hexField.commit"
                @keydown.enter="hexField.commit"
              >
                <template #prefix>
                  <span
                    class="size-2.5 rounded-full ring-1 ring-white dark:ring-gray-500"
                    :style="{ background: solid }"
                  />
                </template>
              </TextInput>
              <TextInput
                v-for="(ch, i) in channels"
                v-else
                :key="ch.key"
                v-model="channelFields[i].draft"
                class="cp-narrow min-w-0 flex-1"
                :aria-label="ch.key.toUpperCase()"
                inputmode="numeric"
                @update:model-value="channelFields[i].input"
                @blur="channelFields[i].commit"
                @keydown.enter="channelFields[i].commit"
              />
              <TextInput
                v-model="alphaField.draft"
                class="cp-right w-[57px] shrink-0"
                aria-label="Opacity"
                inputmode="numeric"
                @update:model-value="alphaField.input"
                @blur="alphaField.commit"
                @keydown.enter="alphaField.commit"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="saved" class="flex flex-col gap-2">
        <div class="flex h-7 items-center justify-between">
          <span class="text-base leading-4 text-ink-gray-7">Saved</span>
          <Button
            variant="ghost"
            size="sm"
            label="Add"
            :icon-left="glyph('add-md')"
            @click="save"
          />
        </div>
        <div class="flex h-3.5 items-center gap-2.5 px-2">
          <button
            v-for="c in swatches"
            :key="c"
            type="button"
            class="size-3.5 shrink-0 rounded-full transition-transform hover:scale-110 dark:ring-1 dark:ring-inset dark:ring-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-3 focus-visible:ring-offset-1"
            :style="{ background: `#${c}` }"
            :aria-label="`Use #${c}`"
            :title="`#${c}`"
            @click="recall(c)"
          />
        </div>
      </div>
    </template>

    <!-- gradient -->
    <div v-else-if="mode === 'gradient'" class="flex flex-col gap-2.5">
      <div
        class="h-10 w-[240px] rounded-4"
        :style="{ background: `${gradientCss}, ${CHECKER}` }"
        role="img"
        aria-label="Gradient preview"
      />
      <div class="flex flex-col gap-2">
        <div
          v-for="(stop, i) in stops"
          :key="i"
          class="flex h-7 items-center gap-1.5"
        >
          <TextInput
            v-model="stopFields[i].at.draft"
            class="cp-stop-at w-[66px] shrink-0"
            :aria-label="`Stop ${i + 1} position`"
            inputmode="numeric"
            @update:model-value="stopFields[i].at.input"
            @blur="stopFields[i].at.commit"
            @keydown.enter="stopFields[i].at.commit"
          >
            <template #suffix>
              <EIcon name="small-down" class="size-4 text-ink-gray-6" />
            </template>
          </TextInput>
          <div class="cp-fields flex min-w-0 flex-1 gap-px">
            <TextInput
              v-model="stopFields[i].hex.draft"
              class="cp-swatched min-w-0 flex-1"
              :aria-label="`Stop ${i + 1} colour`"
              spellcheck="false"
              @update:model-value="stopFields[i].hex.input"
              @blur="stopFields[i].hex.commit"
              @keydown.enter="stopFields[i].hex.commit"
            >
              <template #prefix>
                <span
                  class="block size-[22px] rounded-[5.5px]"
                  :style="{ background: `${layer(stopCss(stop))}, ${CHECKER}` }"
                />
              </template>
            </TextInput>
            <TextInput
              v-model="stopFields[i].alpha.draft"
              class="cp-right w-[57px] shrink-0"
              :aria-label="`Stop ${i + 1} opacity`"
              inputmode="numeric"
              @update:model-value="stopFields[i].alpha.input"
              @blur="stopFields[i].alpha.commit"
              @keydown.enter="stopFields[i].alpha.commit"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- image -->
    <div
      v-else
      class="relative h-[200px] w-[240px] overflow-hidden rounded-4"
      :style="image ? undefined : { background: CHECKER }"
      :class="dragging && 'ring-2 ring-inset ring-outline-gray-3'"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="onDrop"
    >
      <img
        v-if="image"
        :src="image"
        alt=""
        class="size-full cursor-pointer object-cover"
        title="Choose another image"
        @click="fileInput?.click()"
      />
      <div v-else class="flex size-full items-center justify-center">
        <Button variant="solid" size="sm" @click="fileInput?.click()">
          Upload image
        </Button>
      </div>
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept="image/*"
        @change="takeFile(($event.target as HTMLInputElement).files?.[0])"
      />
    </div>
  </div>
</template>

<style>
/* every thumb: 14px, a 3.5px white ring around the colour it holds, and a
   hairline so it reads on white too */
.cp-thumb,
.cp-bar [role='slider'] {
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  border: 3.5px solid #fff;
  box-shadow: 0 0 0 0.5px rgb(0 0 0 / 0.16);
  transition: none;
}
.cp-thumb {
  transform: translate(-50%, -50%);
}
/* The bars are the library's Slider under the file's look: a 15px track
   carrying the hue run, or the colour over a checkerboard, no range fill,
   and the thumb above. */
.cp-bar {
  height: 15px;
}
.cp-bar-alpha {
  height: 14px;
}
.cp-bar > :first-child {
  height: 100%;
  border-radius: 8px;
  background: var(--cp-track);
}
.cp-bar > :first-child > * {
  display: none;
}
.cp-bar [role='slider'] {
  background: var(--cp-thumb);
  cursor: grab;
}
.cp-bar [role='slider']:active {
  cursor: grabbing;
}
.cp-bar [role='slider']:focus-visible {
  box-shadow:
    0 0 0 0.5px rgb(0 0 0 / 0.16),
    0 0 0 2.5px var(--outline-gray-3);
}
/* a row of fields 1px apart reads as one: only its outer corners round;
   the values are the file's gray-700 */
.cp-fields input {
  border-radius: 0;
  color: var(--ink-gray-7);
}
.cp-fields > :first-child input {
  border-start-start-radius: 8px;
  border-end-start-radius: 8px;
}
.cp-fields > :last-child input {
  border-start-end-radius: 8px;
  border-end-end-radius: 8px;
}
/* three digits in a 36px field: the file pads 6, which clips a 255 */
.cp-narrow input {
  padding-inline: 4px;
  text-align: center;
}
/* right-aligned, and a hair less on the left so "100 %" fits its 57px */
.cp-right input {
  text-align: right;
  padding-inline-start: 6px;
}
/* the stop's place reads gray-400 in the file; room for "100%" beside the
   chevron */
.cp-stop-at input {
  color: var(--ink-gray-4);
  padding-inline-end: 20px;
}
.cp-swatched input {
  padding-inline-start: 34px;
}
</style>
