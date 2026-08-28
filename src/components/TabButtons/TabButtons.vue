<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  watchEffect,
} from 'vue'
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { RouterLink } from 'vue-router'
import Pill from '../shared/tabs/Pill.vue'
import { NativeAnchor, NativeButton } from '../shared/nativeElements'
import {
  browserTabCardClasses,
  tabIndicatorClipClasses,
  tabIndicatorMotionClasses,
  tabIndicatorSurfaceClasses,
  tabRadiusClasses,
  tabShellClasses,
  tabTrackClasses,
} from '../shared/tabs/styles'
import { warnUnsupportedIconString } from '../../utils/iconString'
import type { BrowserTabBase } from '../shared/tabs/pillTypes'
import type {
  TabButton,
  TabButtonsEmits,
  TabButtonsProps,
  TabButtonValue,
} from './types'

defineOptions({
  name: 'TabButtons',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TabButtonsProps>(), {
  variant: 'subtle',
  size: 'sm',
  vertical: false,
  side: 'left',
  fluid: false,
})

const emit = defineEmits<TabButtonsEmits>()

const options = computed(() => props.options ?? [])

watchEffect(() => {
  for (const option of options.value) {
    warnUnsupportedIconString('TabButtons', 'options.icon', option.icon)
    warnUnsupportedIconString('TabButtons', 'options.iconLeft', option.iconLeft)
  }
})

const resolvedButtons = computed(() => {
  return options.value.map((button) => {
    const { value, label, icon, tooltip } = button

    const isIconOnly = Boolean(icon)
    const visibleLabel = hasLabel(label) && !isIconOnly
    const accessibleLabel = hasLabel(label) ? String(label) : tooltip

    return {
      ...button,
      value,
      visibleLabel,
      accessibleLabel,
    }
  })
})

// Selection state. A bound `modelValue` wins; otherwise the component holds
// its own, so `RadioGroupRoot` is always controlled. Handing it `undefined`
// would let reka fall back to its own uncontrolled state: the checked pill
// would change text color while `props.modelValue` stayed `undefined`, so the
// re-measure watcher below would never fire and the sliding indicator would
// stay parked — or stay hidden, when nothing was checked at mount.
const internalValue = ref<TabButtonValue | undefined>(props.modelValue)

// Handed to `RadioGroupRoot` when nothing is selected, for the same reason
// `Tabs` does it: an undefined model reads as uncontrolled, and reka would
// then track the checked item privately where nothing here can see it.
const NO_SELECTION = '__frappe-ui-tab-buttons-none__'

const model = computed({
  get: () =>
    props.modelValue !== undefined
      ? props.modelValue
      : (internalValue.value ?? NO_SELECTION),
  set: (value) => {
    if (value === undefined || value === NO_SELECTION) return
    internalValue.value = value
    emit('update:modelValue', value)
  },
})

const rootClasses = computed(() => [
  props.fluid ? 'flex w-full' : 'inline-flex shrink-0',
  props.vertical ? 'flex-col' : 'items-center',
  // `isolate` keeps the -z-10 sliding indicator above the track's own
  // background and rail border while staying behind the (static) tab
  // buttons.
  (pillTrack.value || browserTrack.value) && 'relative isolate',
  underlineTrack.value && 'relative',
  ...tabTrackClasses({
    variant: props.variant,
    size: props.size,
    orientation: props.vertical ? 'vertical' : 'horizontal',
    side: props.side,
  }),
])

// Sliding active-pill surface for subtle/ghost, equivalent to TabList's
// reka TabsIndicator (RadioGroup has no indicator primitive, so the checked
// item is measured directly). Pills never paint an active background
// themselves; this layer carries it between selections.
const pillTrack = computed(
  () => props.variant === 'subtle' || props.variant === 'ghost',
)

// The underline variant slides a 1px rail bar instead of a pill surface,
// matching TabList's underline TabsIndicator.
const underlineTrack = computed(() => props.variant === 'underline')

// browser-tab slides the active card itself: the indicator carries the
// opaque surface, borders, radii, and the rail fusion mask; the checked
// pill keeps its transparent inactive box.
const browserTrack = computed(() => props.variant === 'browser-tab')

const hasIndicator = computed(
  () => pillTrack.value || underlineTrack.value || browserTrack.value,
)

const trackRef = ref<HTMLElement | null>(null)
const indicatorRect = ref<{
  x: number
  y: number
  w: number
  h: number
} | null>(null)
// Transitions switch on only after the first paint so the indicator never
// slides in on mount.
const indicatorAnimated = ref(false)

function measureIndicator() {
  const track = trackRef.value
  if (!track || !hasIndicator.value) {
    indicatorRect.value = null
    return
  }
  const checked = track.querySelector<HTMLElement>(
    '[data-slot="tab-button"][data-state="checked"]',
  )
  if (!checked) {
    indicatorRect.value = null
    return
  }
  // Rect deltas, not offsetLeft/offsetWidth: offsets round to integers,
  // which leaves the indicator up to half a pixel off fractional layouts
  // (fluid tracks especially).
  const trackRect = track.getBoundingClientRect()
  const rect = checked.getBoundingClientRect()
  // The indicator is positioned from the track's padding box; subtract any
  // start-side border (the underline track has a rail border).
  const style = getComputedStyle(track)
  const border = {
    top: parseFloat(style.borderTopWidth) || 0,
    bottom: parseFloat(style.borderBottomWidth) || 0,
    left: parseFloat(style.borderLeftWidth) || 0,
    right: parseFloat(style.borderRightWidth) || 0,
  }
  const x = rect.left - trackRect.left - border.left
  const y = rect.top - trackRect.top - border.top

  if (underlineTrack.value) {
    // 1px bar overlaying the track's rail border, shifted one pixel outward
    // past the padding box — same geometry as TabList's underline indicator.
    if (props.vertical) {
      const innerW = trackRect.width - border.left - border.right
      indicatorRect.value = {
        x: style.direction === 'rtl' ? -1 : innerW,
        y,
        w: 1,
        h: rect.height,
      }
    } else {
      const innerH = trackRect.height - border.top - border.bottom
      indicatorRect.value = { x, y: innerH, w: rect.width, h: 1 }
    }
    return
  }

  indicatorRect.value = { x, y, w: rect.width, h: rect.height }
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  measureIndicator()
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => measureIndicator())
    watch(
      trackRef,
      (track) => {
        resizeObserver?.disconnect()
        if (track) resizeObserver?.observe(track)
      },
      { immediate: true },
    )
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      indicatorAnimated.value = true
    })
  })
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

watch(
  [
    // `model`, not `props.modelValue`: an unbound component moves selection
    // through `internalValue`, and the indicator has to follow that too.
    model,
    () => props.variant,
    () => props.size,
    () => props.vertical,
    () => props.fluid,
    options,
  ],
  () => nextTick(measureIndicator),
)

const browserCardBase = computed<BrowserTabBase>(() =>
  props.vertical ? props.side : 'default',
)

// Layer that clips the pill indicator's shadow to the track's rounded box.
const indicatorClipClasses = computed(() =>
  tabIndicatorClipClasses(props.variant, props.size),
)

const indicatorClasses = computed(() => [
  'pointer-events-none absolute left-0 top-0 motion-reduce:transition-none',
  indicatorAnimated.value &&
    `transition-[width,height,transform] ${tabIndicatorMotionClasses}`,
  ...(underlineTrack.value
    ? ['bg-[var(--outline-gray-8)]']
    : browserTrack.value
      ? [
          '-z-10',
          tabRadiusClasses('browser-tab', props.size, browserCardBase.value),
          browserTabCardClasses(browserCardBase.value),
        ]
      : ['-z-10', ...tabIndicatorSurfaceClasses(props.variant, props.size)]),
])

const indicatorStyle = computed(() => {
  const r = indicatorRect.value
  if (!r) return { display: 'none' }
  return {
    width: `${r.w}px`,
    height: `${r.h}px`,
    transform: `translate(${r.x}px, ${r.y}px)`,
  }
})

function browserTabBase(checked: boolean): BrowserTabBase {
  if (props.variant !== 'browser-tab') return 'none'
  if (!props.vertical) return 'default'
  return checked ? props.side : 'default'
}

function hasLabel(label: TabButton['label']) {
  return label !== undefined && label !== null && label !== ''
}

// Pick the wrapper element for a tab. `route` → RouterLink, `href` →
// anchor, otherwise a native button. Disabled forces the button form so
// `:disabled` actually blocks interaction.
function tabElement(button: (typeof resolvedButtons.value)[number]) {
  if (button.disabled) return NativeButton
  if (button.route) return RouterLink
  if (button.href) return NativeAnchor
  return NativeButton
}

function tabElementProps(button: (typeof resolvedButtons.value)[number]) {
  if (!button.disabled && button.route) {
    return { to: button.route }
  }
  if (!button.disabled && button.href) {
    return {
      href: button.href,
      target: '_blank',
      rel: 'noreferrer noopener',
    }
  }
  return { type: 'button' as const, disabled: button.disabled }
}
</script>

<template>
  <RadioGroupRoot
    v-model="model"
    :orientation="vertical ? 'vertical' : 'horizontal'"
    v-bind="$attrs"
  >
    <div ref="trackRef" data-slot="tab-buttons" :class="rootClasses">
      <!-- Presentational clip layer, deliberately without a `data-slot`: it
           carries no contract, it only stops the indicator's shadow at the
           track edge. -->
      <div v-if="pillTrack" aria-hidden="true" :class="indicatorClipClasses">
        <div
          data-slot="tab-indicator"
          :class="indicatorClasses"
          :style="indicatorStyle"
        />
      </div>
      <div
        v-else-if="hasIndicator"
        aria-hidden="true"
        data-slot="tab-indicator"
        :class="indicatorClasses"
        :style="indicatorStyle"
      />
      <RadioGroupItem
        v-for="button in resolvedButtons"
        :key="button.value"
        v-slot="{ checked, disabled }"
        as="template"
        :disabled="button.disabled"
        :value="button.value"
      >
        <component
          :is="tabElement(button)"
          v-bind="tabElementProps(button)"
          data-slot="tab-button"
          :data-value="button.value"
          :data-state="checked ? 'checked' : 'unchecked'"
          :data-disabled="disabled ? '' : undefined"
          :aria-label="
            button.accessibleLabel && !button.visibleLabel
              ? button.accessibleLabel
              : undefined
          "
          :title="
            button.accessibleLabel && !button.visibleLabel
              ? button.accessibleLabel
              : button.tooltip
          "
          :class="[
            tabShellClasses,
            tabRadiusClasses(variant, size, browserTabBase(checked)),
            vertical && 'w-full',
            fluid && 'flex-1 min-w-0',
          ]"
          @click="button.onClick?.($event)"
        >
          <Pill
            :class="[
              vertical ? 'w-full !justify-start' : '',
              fluid ? 'w-full' : '',
            ]"
            :label="button.label"
            :icon="button.icon"
            :icon-left="button.iconLeft"
            :active="checked"
            :size="size"
            :variant="variant"
            :browser-tab-base="browserTabBase(checked)"
            :orientation="vertical ? 'vertical' : 'horizontal'"
          >
            <template v-if="$slots.prefix" #prefix>
              <slot
                name="prefix"
                :button="button"
                :checked="checked"
                :disabled="disabled"
              />
            </template>
            <template v-if="$slots.suffix" #suffix>
              <slot
                name="suffix"
                :button="button"
                :checked="checked"
                :disabled="disabled"
              />
            </template>
          </Pill>
        </component>
      </RadioGroupItem>
    </div>
  </RadioGroupRoot>
</template>
