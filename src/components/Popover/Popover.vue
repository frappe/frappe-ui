<template>
  <PopoverRoot v-model:open="isOpen">
    <!--
      New API: #trigger is rendered through reka's PopoverTrigger as-child, so
      click / keyboard / aria are auto-wired and pointerdown feeds the motion
      classifier. The legacy #target slot keeps using PopoverAnchor with manual
      wiring (and hover timers) so existing callers do not double-toggle.
    -->
    <PopoverTrigger
      v-if="useNewTrigger"
      ref="triggerRef"
      as-child
      data-slot="trigger"
      @pointerdown="markPointerDown"
    >
      <slot name="trigger" v-bind="newSlotProps" />
    </PopoverTrigger>
    <PopoverAnchor v-else as-child>
      <div
        ref="anchorRef"
        v-bind="$attrs"
        class="flex"
        @pointerdown="markPointerDown"
        @mouseover="onMouseover"
        @mouseleave="onMouseleave"
      >
        <slot name="target" v-bind="legacySlotProps" />
      </div>
    </PopoverAnchor>

    <PopoverPortal :to="portalTo">
      <PopoverContent
        data-slot="content"
        class="z-[100] origin-[var(--reka-popover-content-transform-origin)]"
        :side="resolvedSide"
        :align="resolvedAlign"
        :side-offset="offset"
        :collision-padding="collisionPadding"
        :style="{
          minWidth: resolvedMatchTriggerWidth
            ? 'var(--reka-popover-trigger-width)'
            : undefined,
        }"
        @mouseover="onContentMouseover"
        @mouseleave="onMouseleave"
        @interact-outside="onInteractOutside"
      >
        <!--
          Bare content renders without the shell: the `bare` prop on #default,
          or the legacy #body slot (a full body override that never had default
          chrome). Everything else renders inside the shared PopoverPanel shell.
        -->
        <slot v-if="hasBareBody" name="body" v-bind="legacySlotProps" />
        <slot v-else-if="hasNewContent && bare" v-bind="newSlotProps" />
        <PopoverPanel v-else :motion="contentMotion">
          <slot v-if="hasNewContent" v-bind="newSlotProps" />
          <slot v-else name="body-main" v-bind="legacySlotProps" />
        </PopoverPanel>
        <PopoverArrow
          v-if="arrow"
          data-slot="arrow"
          class="fill-surface-elevation-2"
        />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, useSlots, watch } from 'vue'
import {
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import PopoverPanel from '../shared/popover/PopoverPanel.vue'
import { usePopoverMotion } from '../../composables/usePopoverMotion'
import { warnDeprecated } from '../../utils/warnDeprecated'
import type {
  PopoverEmits,
  PopoverLegacySlotProps,
  PopoverProps,
  PopoverSlotProps,
} from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PopoverProps>(), {
  open: undefined,
  side: 'bottom',
  align: 'start',
  offset: 4,
  portalTo: 'body',
  collisionPadding: 10,
  dismissible: true,
  matchTriggerWidth: false,
  bare: false,
  arrow: false,
  // Deprecated defaults preserved for the legacy paths.
  show: undefined,
  trigger: 'click',
  hoverDelay: 0,
  leaveDelay: 0.5,
  placement: undefined,
  popoverClass: undefined,
  transition: undefined,
  hideOnBlur: undefined,
  matchTargetWidth: undefined,
})

const emit = defineEmits<PopoverEmits>()

const slots = useSlots()

// -----------------------------------------------------------------------------
// Slot selection — new contract on #trigger/#default, legacy on #target/#body.
// -----------------------------------------------------------------------------
const useNewTrigger = computed(() => Boolean(slots.trigger))
const hasNewContent = computed(
  () => Boolean(slots.default) && !slots.body && !slots['body-main'],
)
// Legacy #body was a full body override with no default chrome. It must render
// OUTSIDE PopoverPanel so consumers that bring their own surface (e.g. gameplan
// EmojiPicker) don't get a panel-in-a-panel. #body-main still renders inside.
const hasBareBody = computed(() => !hasNewContent.value && Boolean(slots.body))

// -----------------------------------------------------------------------------
// Back-compat: precedence is "new prop wins", with a one-time dev warning when
// BOTH the old and the new prop are bound and a silent mapping when only the old
// one is bound.
// -----------------------------------------------------------------------------
function bound(value: unknown): boolean {
  return value !== undefined
}

// show / v-model:show -> open / v-model:open
const showControlled = computed(() => bound(props.open) || bound(props.show))
function readDeprecatedOpen(): boolean | undefined {
  if (bound(props.open) && bound(props.show)) {
    warnDeprecated('Popover prop "show"', '"open" / v-model:open')
  }
  if (bound(props.open)) return props.open
  return props.show
}

// placement -> side + align
const resolvedSide = computed(() => {
  if (bound(props.placement)) {
    if (props.side !== 'bottom') {
      warnDeprecated('Popover prop "placement"', '"side" + "align"')
      return props.side
    }
    return props.placement!.split('-')[0] as PopoverProps['side']
  }
  return props.side
})
const resolvedAlign = computed(() => {
  if (bound(props.placement)) {
    if (props.align !== 'start') {
      warnDeprecated('Popover prop "placement"', '"side" + "align"')
      return props.align
    }
    const [, align] = props.placement!.split('-')
    return (align ?? 'center') as PopoverProps['align']
  }
  return props.align
})

// hideOnBlur -> dismissible
const resolvedDismissible = computed(() => {
  if (bound(props.hideOnBlur)) {
    if (props.dismissible !== true) {
      warnDeprecated('Popover prop "hideOnBlur"', '"dismissible"')
      return props.dismissible
    }
    return props.hideOnBlur as boolean
  }
  return props.dismissible
})

// matchTargetWidth -> matchTriggerWidth
const resolvedMatchTriggerWidth = computed(() => {
  if (bound(props.matchTargetWidth)) {
    if (props.matchTriggerWidth !== false) {
      warnDeprecated('Popover prop "matchTargetWidth"', '"matchTriggerWidth"')
      return props.matchTriggerWidth
    }
    return props.matchTargetWidth as boolean
  }
  return props.matchTriggerWidth
})

// One-time warnings for no-op / split-out deprecated surfaces.
watch(
  () => props.trigger,
  (value) => {
    if (value === 'hover') {
      warnDeprecated(
        'Popover prop trigger="hover"',
        'the <HoverCard> component',
      )
    }
  },
  { immediate: true },
)
if (bound(props.popoverClass) && props.popoverClass !== '') {
  warnDeprecated('Popover prop "popoverClass"', 'the data-slot CSS hooks')
}
if (props.transition === 'default') {
  warnDeprecated('Popover prop transition="default"', 'the built-in motion')
}
if (slots.target) {
  warnDeprecated('Popover slot "#target"', 'the "#trigger" slot')
}
if (slots.body || slots['body-main']) {
  warnDeprecated(
    'Popover slots "#body"/"#body-main"',
    'the "#default" slot (use the `bare` prop in place of "#body")',
  )
}

// -----------------------------------------------------------------------------
// Open state (controlled via open/show, otherwise uncontrolled).
// -----------------------------------------------------------------------------
const _isOpen = ref(false)
const anchorRef = ref<HTMLElement | null>(null)
// reka's PopoverTrigger, exposes the trigger DOM node via `$el`.
const triggerRef = ref<{ $el: Element } | null>(null)

const isOpen = computed<boolean>({
  get: () =>
    showControlled.value ? Boolean(readDeprecatedOpen()) : _isOpen.value,
  set: (value: boolean) => {
    if (!showControlled.value) {
      _isOpen.value = value
    }
    emit('update:open', value)
    // Deprecated mirror — keep firing for callers still listening on it.
    emit('update:show', value)
    if (value) emit('open')
    else emit('close')
  },
})

const { motion: contentMotion, onPointerDown: markPointerDown } =
  usePopoverMotion(
    computed(() =>
      showControlled.value ? Boolean(readDeprecatedOpen()) : _isOpen.value,
    ),
  )

function open() {
  if (isOpen.value) return
  isOpen.value = true
}

function close() {
  if (!isOpen.value) return
  isOpen.value = false
}

function togglePopover(flag?: boolean | Event) {
  if (flag instanceof Event) flag = undefined
  if (flag == null) flag = !isOpen.value
  if (Boolean(flag)) open()
  else close()
}

function updatePosition() {
  // No-op — reka handles positioning. Kept for legacy #target callers.
}

defineExpose({ open, close })

// -----------------------------------------------------------------------------
// Slot props.
// -----------------------------------------------------------------------------
const newSlotProps = computed<PopoverSlotProps>(() => ({
  open,
  close,
  toggle: togglePopover,
  isOpen: isOpen.value,
}))
const legacySlotProps = computed<PopoverLegacySlotProps>(() => ({
  togglePopover,
  updatePosition,
  open,
  close,
  toggle: togglePopover,
  isOpen: isOpen.value,
}))

// -----------------------------------------------------------------------------
// Legacy hover behavior (trigger="hover") — preserved verbatim for v1.x.
// Moves to <HoverCard> in a future release; warning fires above.
// -----------------------------------------------------------------------------
const pointerOverTargetOrPopup = ref(false)
const hoverTimer = ref<number | null>(null)
const leaveTimer = ref<number | null>(null)

function onMouseover() {
  pointerOverTargetOrPopup.value = true
  if (leaveTimer.value) {
    clearTimeout(leaveTimer.value)
    leaveTimer.value = null
  }
  if (props.trigger !== 'hover') return
  if (props.hoverDelay) {
    hoverTimer.value = setTimeout(
      () => {
        if (pointerOverTargetOrPopup.value) open()
      },
      Number(props.hoverDelay) * 1000,
    ) as unknown as number
  } else {
    open()
  }
}

function onContentMouseover() {
  pointerOverTargetOrPopup.value = true
}

function onMouseleave() {
  pointerOverTargetOrPopup.value = false
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }
  if (props.trigger !== 'hover') return
  if (leaveTimer.value) clearTimeout(leaveTimer.value)
  if (props.leaveDelay) {
    leaveTimer.value = setTimeout(
      () => {
        if (!pointerOverTargetOrPopup.value) close()
      },
      Number(props.leaveDelay) * 1000,
    ) as unknown as number
  } else if (!pointerOverTargetOrPopup.value) {
    close()
  }
}

function onInteractOutside(event: Event) {
  if (!resolvedDismissible.value) {
    event.preventDefault()
    return
  }
  // Prevent close-then-reopen flicker when clicking the trigger itself.
  // The trigger's own click already toggles the popover (legacy #target via
  // `togglePopover`, new #trigger via reka's `onOpenToggle`). Letting the
  // dismissable layer also close it would race that toggle, so we suppress the
  // outside-close and let the toggle decide the final state.
  const target = event.target as Element
  const triggerEl = triggerRef.value?.$el ?? anchorRef.value
  if (triggerEl && (triggerEl.contains(target) || triggerEl === target)) {
    event.preventDefault()
  }
}

onUnmounted(() => {
  if (hoverTimer.value) clearTimeout(hoverTimer.value)
  if (leaveTimer.value) clearTimeout(leaveTimer.value)
})

defineSlots<{
  /** Trigger element. Rendered via reka PopoverTrigger as-child. */
  trigger?: (props: PopoverSlotProps) => any
  /** Popover content, rendered inside the shared panel shell. */
  default?: (props: PopoverSlotProps) => any

  /** @deprecated Use `#trigger`. Rendered via reka PopoverAnchor (manual wiring). */
  target?: (props: PopoverLegacySlotProps) => any
  /** @deprecated Use `#default`. Full body override (no default chrome). */
  body?: (props: PopoverLegacySlotProps) => any
  /** @deprecated Use `#default`. Inner content inside the default container. */
  'body-main'?: (props: PopoverLegacySlotProps) => any
}>()
</script>
