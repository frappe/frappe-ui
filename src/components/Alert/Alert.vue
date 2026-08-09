<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import Button from '../Button/Button.vue'
import { warnUnsupportedIconString } from '../../utils/iconString'
import {
  mergeActionProps,
  solidStatusIcons,
  useStatusIcon,
} from '../shared/statusIcon'
import { alertProps, type AlertAction, type AlertTheme } from './types'

const props = defineProps(alertProps)

const emit = defineEmits<{
  /** Fired when the user dismisses the alert — the × button or an action's `context.dismiss()`. The parent owns hiding. */
  dismiss: []
}>()

const slots = defineSlots<{
  /** Overrides the status icon area */
  prefix?: () => any

  /** Rich title content (overrides the `title` prop) */
  title?: () => any

  /** Rich description content; its presence forces the banner layout */
  description?: () => any

  /** Replaces the auto-rendered action buttons; receives `{ dismiss }` */
  actions?: (props: { dismiss: () => void }) => any
}>()

watchEffect(() => {
  if (typeof props.icon === 'string') {
    warnUnsupportedIconString('Alert', 'icon', props.icon)
  }
  if (import.meta.env.DEV && props.secondaryAction && !props.primaryAction) {
    console.warn(
      '[frappe-ui] Alert: `secondaryAction` was provided without `primaryAction`.',
    )
  }
})

// Row when the content fits one line; banner when a description or a second
// action needs the stacked layout. There is no layout prop — the computed
// result is stamped as `data-layout`.
const layout = computed(() =>
  props.description || slots.description || props.secondaryAction
    ? 'banner'
    : 'row',
)

// Urgent themes interrupt assistive tech; the rest announce politely.
const role = computed(() =>
  props.theme === 'red' || props.theme === 'amber' ? 'alert' : 'status',
)

const iconColorClasses: Record<AlertTheme, string> = {
  gray: 'text-ink-gray-7',
  blue: 'text-ink-blue-6',
  green: 'text-ink-green-6',
  amber: 'text-ink-amber-6',
  red: 'text-ink-red-6',
}

// Auto icons are the exact Figma solid status glyphs.
const { lucideIcon, componentIcon } = useStatusIcon({
  icon: () => props.icon,
  theme: () => props.theme,
  icons: solidStatusIcons,
})

const showPrefix = computed(() =>
  Boolean(slots.prefix || lucideIcon.value || componentIcon.value),
)

const iconColorClass = computed(() => iconColorClasses[props.theme])

const showDescription = computed(() =>
  Boolean(props.description || slots.description),
)

const showBannerActions = computed(() =>
  Boolean(slots.actions || props.primaryAction || props.secondaryAction),
)

function dismiss() {
  emit('dismiss')
}

function handleAction(action?: AlertAction) {
  action?.onClick?.({ dismiss })
}

const rowActionProps = computed(() =>
  props.primaryAction
    ? mergeActionProps({ variant: 'ghost', size: 'sm' }, props.primaryAction)
    : undefined,
)

// Ghost gray renders ink-gray-8; the design colors the row action label with
// the theme's 600-level ink. `!` wins over Button's own text utility without
// depending on stylesheet order. Skipped when the caller restyles the button.
const rowActionLabelClasses: Record<AlertTheme, string> = {
  gray: '!text-ink-gray-7',
  blue: '!text-ink-blue-7',
  green: '!text-ink-green-7',
  amber: '!text-ink-amber-7',
  red: '!text-ink-red-7',
}

const rowActionLabelClass = computed(() =>
  props.primaryAction &&
  !props.primaryAction.variant &&
  !props.primaryAction.theme
    ? rowActionLabelClasses[props.theme]
    : undefined,
)

const bannerPrimaryProps = computed(() =>
  props.primaryAction
    ? mergeActionProps(
        { variant: 'outline', theme: 'gray', size: 'md' },
        props.primaryAction,
      )
    : undefined,
)

// The design's elevated neutral button — white surface + shadow, no border.
// Outline gray gives the white bg and press state; `!border-transparent`
// removes the border in every state (an important base declaration beats the
// non-important hover/active border rules). Dropped when the caller sets a
// variant.
const bannerPrimaryClass = computed(() =>
  props.primaryAction && !props.primaryAction.variant
    ? 'shadow-sm !border-transparent'
    : undefined,
)

const bannerSecondaryProps = computed(() =>
  props.secondaryAction
    ? mergeActionProps(
        { variant: 'ghost', theme: 'gray', size: 'md' },
        props.secondaryAction,
      )
    : undefined,
)
</script>

<template>
  <div
    :role="role"
    :data-layout="layout"
    :data-theme="props.theme"
    class="rounded-6 bg-surface-gray-1"
    :class="
      layout === 'row'
        ? 'flex h-10 items-center py-1.5 pl-3.5 pr-1.5'
        : 'relative p-3'
    "
  >
    <template v-if="layout === 'row'">
      <div
        v-if="showPrefix"
        data-slot="prefix"
        class="mr-2 flex size-4 shrink-0 items-center justify-center"
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
        data-slot="title"
        class="min-w-0 flex-1 truncate text-base-medium text-ink-gray-8"
      >
        <slot name="title">{{ props.title }}</slot>
      </div>

      <div
        v-if="$slots.actions || props.primaryAction || props.dismissible"
        data-slot="actions"
        class="ml-1.5 flex shrink-0 items-center gap-1"
      >
        <slot name="actions" :dismiss="dismiss">
          <Button
            v-if="props.primaryAction"
            data-slot="action"
            v-bind="rowActionProps"
            :class="rowActionLabelClass"
            @click="handleAction(props.primaryAction)"
          />
        </slot>
        <Button
          v-if="props.dismissible"
          data-slot="dismiss"
          variant="ghost"
          theme="gray"
          size="sm"
          icon="lucide-x"
          aria-label="Dismiss"
          @click="dismiss"
        />
      </div>
    </template>

    <template v-else>
      <div
        class="flex items-center gap-1.5"
        :class="props.dismissible ? 'pr-6' : ''"
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
        <div data-slot="title" class="min-w-0 text-base-medium text-ink-gray-8">
          <slot name="title">{{ props.title }}</slot>
        </div>
      </div>

      <div
        v-if="showDescription || showBannerActions"
        class="mt-1 flex flex-col items-start gap-3"
      >
        <p
          v-if="showDescription"
          data-slot="description"
          class="text-p-base text-ink-gray-6"
        >
          <slot name="description">{{ props.description }}</slot>
        </p>
        <div
          v-if="showBannerActions"
          data-slot="actions"
          class="flex items-center gap-1"
        >
          <slot name="actions" :dismiss="dismiss">
            <Button
              v-if="props.primaryAction"
              data-slot="action"
              v-bind="bannerPrimaryProps"
              :class="bannerPrimaryClass"
              @click="handleAction(props.primaryAction)"
            />
            <Button
              v-if="props.secondaryAction"
              data-slot="action"
              v-bind="bannerSecondaryProps"
              @click="handleAction(props.secondaryAction)"
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
    </template>
  </div>
</template>
