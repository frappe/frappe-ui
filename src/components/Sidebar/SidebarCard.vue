<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import Button from '../Button/Button.vue'
import { warnUnsupportedIconString } from '../../utils/iconString'
import { mergeActionProps } from '../shared/action'
import type { AlertAction } from '../Alert'
import {
  lineStatusIcons,
  useStatusIcon,
  type StatusTheme,
} from '../shared/statusIcon'
import type {
  SidebarCardEmits,
  SidebarCardProps,
  SidebarCardSlots,
} from './types'

// `icon` needs its three-state semantics (unset = auto icon). The explicit
// `default: undefined` stops Vue's Boolean-prop casting from coercing an
// absent value to `false` (same trick as SidebarHeader's `showLogo`).
const props = withDefaults(defineProps<SidebarCardProps>(), {
  theme: 'gray',
  icon: undefined,
  dismissible: false,
})

const emit = defineEmits<SidebarCardEmits>()

const slots = defineSlots<SidebarCardSlots>()

watchEffect(() => {
  if (typeof props.icon === 'string') {
    warnUnsupportedIconString('SidebarCard', 'icon', props.icon)
  }
})

// The card uses the 700-level ink — one step deeper than Alert's icons,
// per the Figma compact masters.
const iconColorClasses: Record<StatusTheme, string> = {
  gray: 'text-ink-gray-8',
  blue: 'text-ink-blue-7',
  green: 'text-ink-green-7',
  amber: 'text-ink-amber-7',
  red: 'text-ink-red-7',
}

// Auto icons are the exact Figma line status glyphs (the compact-card set).
const { lucideIcon, componentIcon } = useStatusIcon({
  icon: () => props.icon,
  theme: () => props.theme,
  icons: lineStatusIcons,
})

const showPrefix = computed(() =>
  Boolean(slots.prefix || lucideIcon.value || componentIcon.value),
)

const iconColorClass = computed(() => iconColorClasses[props.theme])

const showTitle = computed(() => Boolean(props.title || slots.title))

const showDescription = computed(() =>
  Boolean(props.description || slots.description),
)

const showActions = computed(() => Boolean(slots.actions || props.action))

function dismiss() {
  emit('dismiss')
}

// While an async `onClick` is pending the button shows `loading` and
// re-clicks are ignored (same pattern as Dialog's actions). A caller-provided
// `loading` always wins over the internal pending state.
const actionPending = ref(false)

async function handleAction(action?: AlertAction) {
  if (!action?.onClick || actionPending.value) return
  actionPending.value = true
  try {
    await action.onClick({ dismiss })
  } finally {
    actionPending.value = false
  }
}

const actionLoading = computed(
  () => props.action?.loading ?? actionPending.value,
)

// Button has no `amber` theme, so amber falls back to gray and gets its ramp
// from `actionClass` below.
//
// Approved deviation from Figma: the default button uses Button's own subtle
// ramp instead of the design's intent-50 bg + intent-700 label. Reusing the
// Button ramp keeps hover/active states for free; do not "fix" toward the
// Figma hexes.
const actionProps = computed(() =>
  props.action
    ? mergeActionProps(
        {
          variant: 'subtle',
          theme: props.theme === 'amber' ? 'gray' : props.theme,
          size: 'sm',
        },
        props.action,
      )
    : undefined,
)

// Emulates an amber subtle Button at Button's own subtle steps. `!` wins over
// Button's utilities without depending on stylesheet order. Skipped when the
// caller restyles the button.
const amberActionClass =
  '!bg-surface-amber-2 hover:!bg-surface-amber-3 active:!bg-surface-amber-4 !text-ink-amber-7'

const actionClass = computed(() =>
  props.theme === 'amber' &&
  props.action &&
  !props.action.variant &&
  !props.action.theme
    ? ['w-full', amberActionClass]
    : 'w-full',
)
</script>

<template>
  <!-- Promotional content, not a status announcement — no role="alert"/"status". -->
  <div
    data-slot="sidebar-card"
    :data-color="props.theme"
    class="relative rounded-6 border border-outline-alpha-gray-1 bg-surface-base p-3"
  >
    <div
      class="flex items-center gap-1.5"
      :class="props.dismissible ? 'pr-8' : ''"
    >
      <div
        v-if="showPrefix"
        data-slot="prefix"
        class="flex size-4 shrink-0 items-center justify-center"
      >
        <slot name="prefix">
          <span
            v-if="lucideIcon"
            class="size-4"
            :class="[lucideIcon, iconColorClass]"
            aria-hidden="true"
          />
          <component
            :is="componentIcon"
            v-else-if="componentIcon"
            class="size-4"
            :class="iconColorClass"
          />
        </slot>
      </div>
      <div
        v-if="showTitle"
        data-slot="title"
        class="min-w-0 text-sm-medium text-ink-gray-8"
      >
        <slot name="title">{{ props.title }}</slot>
      </div>
    </div>

    <div
      v-if="showDescription || showActions"
      class="mt-1 flex flex-col gap-3"
    >
      <p
        v-if="showDescription"
        data-slot="description"
        class="text-p-xs text-ink-gray-6"
      >
        <slot name="description">{{ props.description }}</slot>
      </p>
      <div v-if="showActions" data-slot="actions" class="flex flex-col">
        <slot name="actions" :dismiss="dismiss">
          <Button
            v-if="props.action"
            data-slot="action"
            v-bind="actionProps"
            :loading="actionLoading"
            :class="actionClass"
            @click="handleAction(props.action)"
          />
        </slot>
      </div>
    </div>

    <Button
      v-if="props.dismissible"
      data-slot="dismiss"
      class="absolute right-1.5 top-1.5"
      variant="ghost"
      theme="gray"
      size="xs"
      icon="lucide-x"
      aria-label="Dismiss"
      @click="dismiss"
    />
  </div>
</template>
