<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal :to="portalTarget">
      <DialogOverlay
        class="fixed inset-0 z-50 bg-black-overlay-200 dark:bg-black-overlay-700 dialog-overlay outline-none"
        :data-dialog="props.title"
        @after-leave="$emit('after-leave')"
      />
      <!--
        The scroll container is a plain element, NOT the DialogOverlay, and the
        content is a sibling of the overlay (the standard reka structure).
        reka-ui's DialogOverlay has an internal `@pointerdown.left.prevent`
        (DialogOverlayImpl); when focusable content is nested inside the overlay,
        a pointerdown on any field bubbles up to it and its `preventDefault()`
        cancels the browser's native focus-on-click. The result: only the
        auto-focused field is usable and clicking a second field (e.g. a
        textarea) silently fails, dropping the keystrokes into the first field.
        Keeping the content out of the overlay restores click-to-focus.
      -->
      <div
        class="fixed inset-0 z-50 overflow-y-auto dialog-scroll-container"
        :class="{ 'pointer-events-none': !isOpen }"
      >
        <div
          class="flex min-h-screen flex-col items-center px-4 py-4 text-center"
          :class="dialogPositionClasses"
          :style="dialogPositionStyles"
          :data-position="props.position"
        >
          <DialogContent
            ref="contentRef"
            class="my-8 inline-block w-full transform overflow-hidden rounded-7 bg-surface-elevation-1 text-start align-middle shadow-xl dialog-content focus-visible:outline-none"
            :class="sizeClass"
            @open-auto-focus="handleOpenAutoFocus"
            @escape-key-down="
              (e: Event) => {
                if (!isDismissible) e.preventDefault()
              }
            "
            @interact-outside="
              (e: Event) => {
                if (!isDismissible) e.preventDefault()
              }
            "
          >
            <!-- bare: no chrome, render default slot directly -->
            <slot v-if="props.bare" :close="close" />

            <template v-else>
              <div class="bg-surface-elevation-1 px-4 pb-6 pt-5 sm:px-6">
                <div class="flex">
                  <div class="w-full flex-1">
                    <div
                      v-if="showHeader"
                      class="mb-6 flex items-center justify-between"
                    >
                      <div class="flex items-center space-x-2 flex-1">
                        <div
                          v-if="resolvedIcon && isLucide(resolvedIcon.name)"
                          class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                          :class="dialogIconBgClasses"
                        >
                          <span
                            :class="[
                              resolvedIcon.name,
                              'size-4',
                              dialogIconClasses,
                            ]"
                            aria-hidden="true"
                          />
                        </div>
                        <DialogTitle as="header" class="flex-1">
                          <slot name="title" :close="close">
                            <h3
                              v-if="props.title"
                              class="text-2xl-semibold leading-6 text-ink-gray-8"
                            >
                              {{ props.title }}
                            </h3>
                          </slot>
                        </DialogTitle>
                      </div>
                      <DialogClose v-if="props.showCloseButton" as-child>
                        <Button variant="ghost" label="Close">
                          <template #icon>
                            <span class="lucide-x size-4 text-ink-gray-9" />
                          </template>
                        </Button>
                      </DialogClose>
                    </div>

                    <slot :close="close">
                      <DialogDescription as-child v-if="props.message">
                        <p class="text-p-base text-ink-gray-7">
                          {{ props.message }}
                        </p>
                      </DialogDescription>
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
                  <div
                    :class="
                      isSingleActionFullWidth ? '' : 'flex justify-end gap-2'
                    "
                  >
                    <Button
                      v-for="action in reactiveActions"
                      :key="action.label"
                      :class="isSingleActionFullWidth ? 'w-full' : ''"
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
            <DialogClose
              v-if="props.showCloseButton && !showHeader && !props.bare"
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
      </div>
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
import { computed, reactive, ref, useSlots, watchEffect } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useAutofocusOnOpen } from '../../composables/useAutofocusOnOpen'
import { usePortalTarget } from '../../composables/usePortalTarget'
import { Button } from '../Button'
import {
  warnUnsupportedIconString,
  isLucideIconString,
} from '../../utils/iconString'
import type {
  DialogProps,
  DialogEmits,
  DialogSlots,
  DialogIcon,
  DialogTheme,
  DialogReactiveAction,
} from './types'

const props = withDefaults(defineProps<DialogProps>(), {
  // Boolean props default to `undefined` so we can detect "not passed" — Vue
  // otherwise casts absent boolean props to `false`, which would defeat the
  // `open` vs `modelValue` precedence below.
  open: undefined,
  modelValue: undefined,
  size: 'lg',
  position: 'center',
  dismissible: true,
  showCloseButton: true,
  bare: false,
})

const emit = defineEmits<DialogEmits>()

const slots = defineSlots<DialogSlots>()

const portalTarget = usePortalTarget()

const allSlots = useSlots()

const isDismissible = computed(() => props.dismissible !== false)

const sizeClass = computed(() => {
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
  return map[props.size] || 'max-w-lg'
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

// Resolved icon.
const resolvedIcon = computed<DialogIcon | null>(() => {
  const raw = props.icon
  if (!raw) return null
  if (typeof raw === 'string') return { name: raw }
  return raw
})

watchEffect(() => {
  warnUnsupportedIconString('Dialog', 'icon', resolvedIcon.value?.name)
})

if (import.meta.env.DEV) {
  let warnedBareTitle = false
  let warnedBareActions = false
  watchEffect(() => {
    if (props.bare && (props.title || resolvedIcon.value) && !warnedBareTitle) {
      console.warn(
        '[frappe-ui] Dialog `title`/`icon` have no effect when `bare` is true. Render them yourself inside `#default`.',
      )
      warnedBareTitle = true
    }
    if (props.bare && props.actions?.length && !warnedBareActions) {
      console.warn(
        '[frappe-ui] Dialog `actions` has no effect when `bare` is true. Render actions inside `#default`.',
      )
      warnedBareActions = true
    }
  })
}

const iconTheme = computed<DialogTheme | null>(
  () => resolvedIcon.value?.theme ?? null,
)

const dialogIconBgClasses = computed(() => {
  const theme = iconTheme.value
  if (!theme) return 'bg-surface-gray-2'
  const map: Record<DialogTheme, string> = {
    amber: 'bg-surface-amber-2',
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
    amber: 'text-ink-amber-5',
    blue: 'text-ink-blue-5',
    red: 'text-ink-red-7',
    green: 'text-ink-green-5',
  }
  return map[theme]
})

const dialogPositionClasses = computed(() => {
  if (props.paddingTop) return ''
  const map: Record<string, string> = {
    center: 'justify-center',
    top: 'pt-[20vh]',
  }
  return map[props.position] || 'justify-center'
})

const dialogPositionStyles = computed(() => {
  if (props.paddingTop) {
    return { paddingTop: props.paddingTop }
  }
  return {}
})

const reactiveActions = computed((): DialogReactiveAction[] => {
  if (props.bare) return []
  const list = props.actions
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
              await action.onClick!({ close })
            } finally {
              _action.loading = false
            }
          },
    })
    return _action
  })
})

const isSingleActionFullWidth = computed(() => {
  const smallSizes = ['xs', 'sm', 'md']
  return (
    reactiveActions.value.length === 1 && smallSizes.includes(props.size)
  )
})

// Whether the auto-header should render at all. Per spec, the header
// is title/slot-driven only — the close button lives independently.
const showHeader = computed(() => {
  if (props.bare) return false
  if (allSlots.title) return true
  if (props.title) return true
  return false
})

function isLucide(name: string | undefined) {
  return isLucideIconString(name)
}

// Honor a descendant `[autofocus]` element on open. Reka's FocusScope
// otherwise focuses the content wrapper (or the first tabbable element),
// which is good for screen readers but inconvenient for form dialogs.
// Marking an element opts in. Components that don't forward attrs to a
// focusable DOM node can wrap their slot with `<div autofocus>…</div>` —
// the composable walks into it to find the first focusable descendant.
const contentRef = ref<ComponentPublicInstance | null>(null)
useAutofocusOnOpen(
  isOpen,
  () => contentRef.value?.$el as HTMLElement | undefined,
)

function handleOpenAutoFocus(event: Event) {
  // If the caller marked an element with `[autofocus]`, we own initial
  // focus — preventDefault so Reka's FocusScope doesn't yank focus to the
  // first tabbable; `useAutofocusOnOpen` does the actual focus. Otherwise,
  // let Reka focus the first tabbable as usual.
  const container = event.target as HTMLElement | null
  if (container?.querySelector('[autofocus]')) {
    event.preventDefault()
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
