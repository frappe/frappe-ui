<script setup lang="ts" generic="T extends string, V extends string">
// A morphing segmented picker (after the "Frequency" reference). Closed, it
// is a surface-gray-2 pill: the label, then the value in a raised chip.
// Opened, the label stays put and the chip grows into a row of options, the
// pick riding on the same raised chip; an option with
// variants slides a second row in beneath. Picks apply at once, so whatever
// the picker drives updates live; a click outside, Escape or Enter closes it.
// The shell animates its size between states, the content cross-fades with a
// blur, and each row's highlight glides to the picked option.
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

export interface PickerOption<TValue extends string, TVariant extends string> {
  value: TValue
  label: string
  variants?: { value: TVariant; label: string }[]
}

const props = defineProps<{
  label: string
  options: PickerOption<T, V>[]
  /** Wrap the options onto more lines past this width (px). */
  maxRowWidth?: number
  /** Lay the options on a grid of this many columns, so they line up. */
  columns?: number
}>()

const value = defineModel<T>({ required: true })
const variant = defineModel<V | null>('variant', { default: null })

const open = ref(false)

const current = computed(() => props.options.find((o) => o.value === value.value))

const summary = computed(() => {
  const v = current.value?.variants?.find((x) => x.value === variant.value)
  return v ? `${current.value!.label}, ${v.label}` : (current.value?.label ?? '')
})

function pick(option: PickerOption<T, V>) {
  value.value = option.value
  const variants = option.variants
  if (!variants?.length) variant.value = null
  else if (!variants.some((v) => v.value === variant.value)) {
    variant.value = variants[0].value
  }
}

// ---- size morph: the shell tracks its content's size and transitions it
const shell = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const size = ref<{ width: number; height: number } | null>(null)
let observer: ResizeObserver | null = null

watch(content, (el) => {
  observer?.disconnect()
  if (!el) return
  observer = new ResizeObserver(([entry]) => {
    const box = entry.borderBoxSize?.[0]
    size.value = box
      ? { width: box.inlineSize, height: box.blockSize }
      : { width: el.offsetWidth, height: el.offsetHeight }
  })
  observer.observe(el)
})

// ---- gliding highlight: one pill per row, moved under the picked option
const typeRow = ref<HTMLElement | null>(null)
const variantRow = ref<HTMLElement | null>(null)
type Pill = { left: number; top: number; width: number; height: number }
const typePill = ref<Pill | null>(null)
const variantPill = ref<Pill | null>(null)

function measure(row: HTMLElement | null): Pill | null {
  const el = row?.querySelector<HTMLElement>('[aria-checked="true"]')
  return el
    ? { left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight }
    : null
}

const pillStyle = (pill: Pill) => ({
  left: `${pill.left}px`,
  top: `${pill.top}px`,
  width: `${pill.width}px`,
  height: `${pill.height}px`,
})

async function place() {
  await nextTick()
  typePill.value = measure(typeRow.value)
  variantPill.value = measure(variantRow.value)
}

watch([open, value, variant], place)

// ---- close on outside click / Escape / Enter while open
function onPointerDown(event: PointerEvent) {
  if (shell.value && !shell.value.contains(event.target as Node)) open.value = false
}
function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' || event.key === 'Enter') open.value = false
}
watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
  } else {
    document.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('keydown', onKey)
  }
})
onBeforeUnmount(() => {
  observer?.disconnect()
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div
    ref="shell"
    class="espresso-picker relative overflow-hidden bg-surface-gray-2 transition-[width,height,border-radius] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
    :class="open ? 'rounded-[18px]' : 'rounded-full'"
    :style="size ? { width: `${size.width}px`, height: `${size.height}px` } : undefined"
  >
    <!-- the label stays put; only the area beside it morphs -->
    <div ref="content" class="flex w-max items-start gap-6 p-1 pl-3">
      <span class="flex h-7 shrink-0 items-center text-base text-ink-gray-6">
        {{ label }}
      </span>

      <div class="relative">
        <Transition name="espresso-picker-swap">
          <!-- closed: the value in a raised chip -->
          <button
            v-if="!open"
            key="closed"
            type="button"
            class="flex h-7 items-center gap-1.5 rounded-full bg-surface-elevation-3 pl-3 pr-2 text-base-medium text-ink-gray-9 shadow-sm"
            :aria-label="`${label}: ${summary}. Change`"
            aria-haspopup="true"
            :aria-expanded="false"
            @click="open = true"
          >
            {{ summary }}
            <span class="lucide-chevrons-left-right size-3.5 text-ink-gray-5" />
          </button>

          <!-- open: options, variants beneath; the pick sits on the same
               raised chip -->
          <div v-else key="open" class="flex flex-col gap-1" role="group" :aria-label="label">
            <div
              ref="typeRow"
              class="relative gap-x-0.5 gap-y-1"
              :class="columns ? 'grid' : 'flex flex-wrap items-center'"
              :style="
                columns
                  ? { gridTemplateColumns: `repeat(${columns}, auto)` }
                  : maxRowWidth
                    ? { maxWidth: `${maxRowWidth}px` }
                    : undefined
              "
              role="radiogroup"
              :aria-label="label"
            >
              <span
                v-if="typePill"
                class="espresso-picker-pill absolute rounded-full bg-surface-elevation-3 shadow-sm"
                :style="pillStyle(typePill)"
              />
              <button
                v-for="option in options"
                :key="option.value"
                type="button"
                role="radio"
                :aria-checked="option.value === value"
                class="relative h-7 rounded-full px-3 text-base transition-colors duration-200"
                :style="columns ? { textAlign: 'left' } : undefined"
                :class="
                  option.value === value
                    ? 'text-ink-gray-9'
                    : 'text-ink-gray-6 hover:text-ink-gray-8'
                "
                @click="pick(option)"
              >
                {{ option.label }}
              </button>
            </div>

            <Transition name="espresso-picker-row" @after-enter="place">
              <div
                v-if="current?.variants?.length"
                ref="variantRow"
                class="relative flex items-center gap-0.5"
                role="radiogroup"
                :aria-label="`${current.label} layout`"
              >
                <span
                  v-if="variantPill"
                  class="espresso-picker-pill absolute rounded-full bg-surface-elevation-3 shadow-sm"
                  :style="pillStyle(variantPill)"
                />
                <button
                  v-for="v in current.variants"
                  :key="v.value"
                  type="button"
                  role="radio"
                  :aria-checked="v.value === variant"
                  class="relative h-7 rounded-full px-3 text-base transition-colors duration-200"
                :style="columns ? { textAlign: 'left' } : undefined"
                  :class="
                    v.value === variant
                      ? 'text-ink-gray-9'
                      : 'text-ink-gray-6 hover:text-ink-gray-8'
                  "
                  @click="variant = v.value"
                >
                  {{ v.label }}
                </button>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style>
/* The highlight glides between options. */
.espresso-picker-pill {
  transition:
    left 300ms cubic-bezier(0.32, 0.72, 0, 1),
    top 300ms cubic-bezier(0.32, 0.72, 0, 1),
    width 300ms cubic-bezier(0.32, 0.72, 0, 1);
}

/* Content swaps with a quick blur-fade while the shell resizes. The
   leaving side drops out of flow, so the shell morphs straight from the
   old size to the new one. */
.espresso-picker-swap-enter-active,
.espresso-picker-swap-leave-active {
  transition:
    opacity 180ms ease,
    filter 180ms ease;
}
.espresso-picker-swap-leave-active {
  position: absolute;
  inset: 0 auto auto 0;
}
.espresso-picker-swap-enter-from,
.espresso-picker-swap-leave-to {
  opacity: 0;
  filter: blur(4px);
}

/* The variant row blurs in from above; leaving, it drops out of flow so
   the shell closes up while it fades. */
.espresso-picker-row-enter-active,
.espresso-picker-row-leave-active {
  transition:
    opacity 240ms ease,
    filter 240ms ease,
    transform 240ms cubic-bezier(0.32, 0.72, 0, 1);
}
.espresso-picker-row-leave-active {
  position: absolute;
  left: 0;
  bottom: 0;
}
.espresso-picker-row-enter-from,
.espresso-picker-row-leave-to {
  opacity: 0;
  filter: blur(4px);
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .espresso-picker,
  .espresso-picker-pill,
  .espresso-picker-swap-enter-active,
  .espresso-picker-swap-leave-active,
  .espresso-picker-row-enter-active,
  .espresso-picker-row-leave-active {
    transition: none;
  }
}
</style>
