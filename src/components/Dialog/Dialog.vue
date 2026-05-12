<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 bg-black-overlay-200 dark:bg-black-overlay-700 overflow-y-auto dialog-overlay outline-none"
        :data-dialog="resolved.title"
        @after-leave="$emit('after-leave')"
      >
        <div
          class="flex min-h-screen flex-col items-center px-4 py-4 text-center"
          :class="dialogPositionClasses"
          :style="dialogPositionStyles"
          :data-position="resolved.position || 'center'"
        >
          <DialogContent
            class="my-8 inline-block w-full transform overflow-hidden rounded-xl bg-surface-modal text-start align-middle shadow-xl dialog-content focus-visible:outline-none"
            :class="sizeClass"
            @open-auto-focus="handleOpenAutoFocus"
            @escape-key-down="
              (e: Event) => {
                if (!isDismissable) e.preventDefault()
              }
            "
            @interact-outside="
              (e: Event) => {
                if (!isDismissable) e.preventDefault()
              }
            "
          >
            <!-- bare: no chrome, render default slot directly -->
            <slot v-if="resolved.bare" :close="close" />

            <!-- legacy `#body` slot: full layout override (deprecated) -->
            <slot v-else-if="$slots.body" name="body" />

            <template v-else>
              <!-- legacy `#body-main`: full middle override (deprecated) -->
              <slot v-if="$slots['body-main']" name="body-main" />
              <div v-else class="bg-surface-modal px-4 pb-6 pt-5 sm:px-6">
                <div class="flex">
                  <div class="w-full flex-1">
                    <!-- legacy `#body-header` (deprecated, warns + renders nothing if used; preserved for back-compat by rendering header) -->
                    <slot
                      v-if="$slots['body-header']"
                      name="body-header"
                    />
                    <div
                      v-else-if="showHeader"
                      class="mb-6 flex items-center justify-between"
                    >
                      <div class="flex items-center space-x-2">
                        <div
                          v-if="resolvedIcon"
                          class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                          :class="dialogIconBgClasses"
                        >
                          <span
                            v-if="isLucide(resolvedIcon.name)"
                            :class="[resolvedIcon.name, 'size-4', dialogIconClasses]"
                            aria-hidden="true"
                          />
                          <FeatherIcon
                            v-else
                            :name="resolvedIcon.name"
                            class="h-4 w-4"
                            :class="dialogIconClasses"
                            aria-hidden="true"
                          />
                        </div>
                        <DialogTitle as="header">
                          <slot name="title" :close="close">
                            <slot name="body-title">
                              <h3
                                v-if="resolved.title"
                                class="text-2xl font-semibold leading-6 text-ink-gray-9"
                              >
                                {{ resolved.title }}
                              </h3>
                            </slot>
                          </slot>
                        </DialogTitle>
                      </div>
                      <DialogClose
                        v-if="resolved.showCloseButton"
                        as-child
                      >
                        <Button variant="ghost" label="Close">
                          <template #icon>
                            <span class="lucide-x size-4 text-ink-gray-9" />
                          </template>
                        </Button>
                      </DialogClose>
                    </div>

                    <slot name="body-content">
                      <slot :close="close">
                        <DialogDescription as-child v-if="resolved.message">
                          <p class="text-p-base text-ink-gray-7">
                            {{ resolved.message }}
                          </p>
                        </DialogDescription>
                      </slot>
                    </slot>
                  </div>
                </div>
              </div>

              <div
                v-if="reactiveActions.length || $slots.actions"
                class="px-4 pb-7 pt-4 sm:px-6"
              >
                <slot
                  name="actions"
                  v-bind="{ close, actions: reactiveActions }"
                >
                  <div class="space-y-2">
                    <Button
                      class="w-full"
                      v-for="action in reactiveActions"
                      :key="action.label"
                      :disabled="action.disabled"
                      v-bind="action"
                    >
                      {{ action.label }}
                    </Button>
                  </div>
                </slot>
              </div>
            </template>

            <!-- close button when auto-header is suppressed but caller still wants a close affordance -->
            <!-- Suppressed for legacy slots that own their own header chrome: `#body` is a full override, `#body-header` replaced the header (incl. close) in v0. -->
            <DialogClose
              v-if="
                resolved.showCloseButton &&
                !showHeader &&
                !resolved.bare &&
                !$slots['body'] &&
                !$slots['body-header']
              "
              as-child
            >
              <Button
                class="absolute right-4 top-4 z-10"
                variant="ghost"
                label="Close"
              >
                <template #icon>
                  <span class="lucide-x size-4 text-ink-gray-9" />
                </template>
              </Button>
            </DialogClose>
          </DialogContent>
        </div>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'reka-ui'
import { computed, reactive, useSlots, watchEffect } from 'vue'
import { Button } from '../Button'
import FeatherIcon from '../FeatherIcon.vue'
import {
  warnFeatherIconUsage,
  isLucideIconString,
} from '../../utils/iconString'
import { warnDeprecated } from '../../utils/warnDeprecated'
import type {
  DialogProps,
  DialogEmits,
  DialogSlots,
  DialogExposed,
  DialogIcon,
  DialogActionContext,
  DialogOptions,
  DialogTheme,
  DialogIconAppearance,
  DialogReactiveAction,
} from './types'

const props = withDefaults(defineProps<DialogProps>(), {
  // Boolean props default to `undefined` so we can detect "not passed" — Vue
  // otherwise casts absent boolean props to `false`, which would defeat the
  // `open` vs `modelValue` precedence below.
  open: undefined,
  modelValue: undefined,
  disableOutsideClickToClose: undefined,
  // `size`/`position` intentionally left undefined so legacy `options.size`
  // and `options.position` still take effect when the top-level prop is omitted.
  // Defaults are applied inside `resolved`.
  size: undefined,
  position: undefined,
  dismissable: true,
  showCloseButton: true,
  bare: false,
})

const emit = defineEmits<DialogEmits>()

const slots = defineSlots<DialogSlots>()

// Deprecation warnings for legacy surfaces.
watchEffect(() => {
  if (props.options !== undefined) {
    warnDeprecated('Dialog `options` prop', 'flat top-level props')
  }
  if (props.disableOutsideClickToClose !== undefined) {
    warnDeprecated(
      'Dialog `disableOutsideClickToClose` prop',
      '`dismissable` (inverted)',
    )
  }
})

const allSlots = useSlots()
watchEffect(() => {
  if (allSlots['body-content']) {
    warnDeprecated('Dialog `#body-content` slot', '`#default`')
  }
  if (allSlots['body-main']) {
    warnDeprecated('Dialog `#body-main` slot', '`#default`')
  }
  if (allSlots['body-title']) {
    warnDeprecated('Dialog `#body-title` slot', '`#title`')
  }
  if (allSlots['body-header']) {
    warnDeprecated(
      'Dialog `#body-header` slot',
      '`#title` (no direct replacement)',
    )
  }
  if (allSlots['body']) {
    warnDeprecated('Dialog `#body` slot', '`#default` + `bare` prop')
  }
})

// Flatten props: top-level props win over `options` keys.
const resolved = computed(() => {
  const o = props.options || ({} as DialogOptions)
  return {
    title: props.title ?? o.title,
    message: props.message ?? o.message,
    icon: props.icon ?? o.icon,
    size: props.size ?? o.size ?? 'lg',
    position: props.position ?? o.position ?? 'center',
    paddingTop: props.paddingTop ?? o.paddingTop,
    actions: props.actions ?? o.actions ?? [],
    showCloseButton: props.showCloseButton,
    bare: props.bare,
  }
})

const isDismissable = computed(() => {
  if (props.disableOutsideClickToClose) return false
  return props.dismissable !== false
})

const sizeClass = computed(() => {
  const size = resolved.value.size
  const map: Record<string, string> = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
  }
  return map[size] || 'max-w-lg'
})

// Visibility model.
// `open` is canonical and wins if both bindings are present.
const isOpen = computed({
  get() {
    if (props.open !== undefined) return !!props.open
    return !!props.modelValue
  },
  set(val: boolean) {
    emit('update:open', val)
    emit('update:modelValue', val)
    if (!val) emit('close')
  },
})

function close() {
  isOpen.value = false
}

defineExpose({ close } satisfies DialogExposed)

// Resolved icon — also maps deprecated `appearance` to `theme`.
const resolvedIcon = computed<DialogIcon | null>(() => {
  const raw = resolved.value.icon
  if (!raw) return null
  if (typeof raw === 'string') return { name: raw }
  return raw
})

watchEffect(() => {
  warnFeatherIconUsage('Dialog', 'icon', resolvedIcon.value?.name)
  if (resolvedIcon.value?.appearance) {
    warnDeprecated(
      'Dialog `icon.appearance`',
      "`icon.theme` ('yellow' | 'blue' | 'red' | 'green')",
    )
  }
  if (props.bare && (props.title || resolvedIcon.value)) {
    // soft warning — props become no-ops when bare
    warnDeprecated(
      'Dialog `title`/`icon` props with `bare: true`',
      'render the title yourself inside `#default`',
    )
  }
  if (props.bare && (props.actions || props.options?.actions)) {
    warnDeprecated(
      'Dialog `actions` prop with `bare: true`',
      'render actions inside `#default`',
    )
  }
})

const iconTheme = computed<DialogTheme | null>(() => {
  const icon = resolvedIcon.value
  if (!icon) return null
  if (icon.theme) return icon.theme
  // Back-compat: map `appearance` to `theme`.
  const map: Record<DialogIconAppearance, DialogTheme> = {
    warning: 'yellow',
    info: 'blue',
    danger: 'red',
    success: 'green',
  }
  return icon.appearance ? map[icon.appearance] : null
})

const dialogIconBgClasses = computed(() => {
  const theme = iconTheme.value
  if (!theme) return 'bg-surface-gray-2'
  const map: Record<DialogTheme, string> = {
    yellow: 'bg-surface-amber-2',
    blue: 'bg-surface-blue-2',
    red: 'bg-surface-red-2',
    green: 'bg-surface-green-2',
  }
  return map[theme]
})

const dialogIconClasses = computed(() => {
  const theme = iconTheme.value
  if (!theme) return 'text-ink-gray-5'
  const map: Record<DialogTheme, string> = {
    yellow: 'text-ink-amber-3',
    blue: 'text-ink-blue-3',
    red: 'text-ink-red-4',
    green: 'text-ink-green-3',
  }
  return map[theme]
})

const dialogPositionClasses = computed(() => {
  if (resolved.value.paddingTop) return ''
  const position = resolved.value.position
  const map: Record<string, string> = {
    center: 'justify-center',
    top: 'pt-[20vh]',
  }
  return map[position] || 'justify-center'
})

const dialogPositionStyles = computed(() => {
  if (resolved.value.paddingTop) {
    return { paddingTop: resolved.value.paddingTop }
  }
  return {}
})

const reactiveActions = computed((): DialogReactiveAction[] => {
  if (resolved.value.bare) return []
  const list = resolved.value.actions
  if (!list?.length) return []
  return list.map((action) => {
    const _action = reactive({
      ...action,
      loading: false,
      onClick: !action.onClick
        ? close
        : async () => {
            _action.loading = true
            try {
              // Back-compat: callable context shim — `context()` still closes.
              type LegacyContext = (() => void) & DialogActionContext
              const ctx = (() => {
                warnDeprecated(
                  'Dialog action.onClick(callableContext)',
                  'action.onClick({ close })',
                )
                close()
              }) as LegacyContext
              ctx.close = close
              await action.onClick!(ctx)
            } finally {
              _action.loading = false
            }
          },
    })
    return _action
  })
})

// Whether the auto-header should render at all. Per spec, the header
// is title/slot-driven only — the close button lives independently.
const showHeader = computed(() => {
  if (resolved.value.bare) return false
  if (allSlots.title || allSlots['body-title']) return true
  if (resolved.value.title) return true
  return false
})

function isLucide(name: string | undefined) {
  return isLucideIconString(name)
}

// Honor a descendant `[autofocus]` element on open. Reka's FocusScope
// otherwise focuses the content wrapper (or the first tabbable element),
// which is good for screen readers but inconvenient for form dialogs.
// Marking the input opts in.
//
// Components that don't forward attrs onto a focusable DOM node (Switch,
// Combobox, Select, …) can still opt in by wrapping the slot with a
// marker — `<div autofocus>…</div>` — and we walk into it to find the
// first focusable descendant.
const FOCUSABLE_SELECTOR = [
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  '[contenteditable=""]',
].join(',')

function handleOpenAutoFocus(event: Event) {
  const container = event.target as HTMLElement | null
  const marker = container?.querySelector<HTMLElement>('[autofocus]')
  if (!marker) return
  const target = marker.matches(FOCUSABLE_SELECTOR)
    ? marker
    : marker.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
  if (!target) return
  event.preventDefault()
  target.focus()
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement
  ) {
    try {
      target.select()
    } catch {}
  }
}
</script>

<style scoped>
@keyframes dialog-overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes dialog-overlay-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes dialog-content-in {
  from {
    opacity: 0.5;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes dialog-content-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0.5;
    transform: scale(0.98);
  }
}

:global(.dialog-overlay[data-state='open']) {
  animation: dialog-overlay-in 100ms ease-out;
}

:global(.dialog-overlay[data-state='closed']) {
  animation: dialog-overlay-out 150ms ease-in;
}

:global(.dialog-content[data-state='open']) {
  animation: dialog-content-in 100ms ease-out;
}

:global(.dialog-content[data-state='closed']) {
  animation: dialog-content-out 150ms ease-in;
}
</style>
