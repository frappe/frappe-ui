<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { computed, nextTick, ref, useAttrs, useSlots, watch } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
} from 'reka-ui'
import LucideChevronDown from '~icons/lucide/chevron-down'
import LucideSearch from '~icons/lucide/search'
import ComboboxResults from './ComboboxResults.vue'
import { usePopoverMotion } from '../../composables/usePopoverMotion'
import type {
  ComboboxEmits,
  ComboboxExposed,
  ComboboxProps,
  ComboboxSelectableOption,
  ComboboxSlots,
} from './types'
import {
  buildCustomOptionContext,
  inputClasses,
  inputFontSizeClasses,
  isSelectableOption,
  matchesCustomOption,
  matchesSelectableOption,
  normalizeComboboxOptions,
  triggerBaseClasses,
  triggerSizeClasses,
  triggerVariantClasses,
  EMPTY_SELECTABLE_VALUE_PREFIX,
} from './utils'
import type {
  NormalizedCustomOption,
  NormalizedSelectableOption,
} from './utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ComboboxProps>(), {
  options: () => [],
  trigger: 'input',
  variant: 'subtle',
  size: 'sm',
  placeholder: 'Select option',
  disabled: false,
  openOnFocus: false,
  openOnClick: false,
  side: 'bottom',
  offset: 4,
  portalTo: 'body',
  allowCustomValue: false,
  loading: false,
  emptyText: 'No results',
})

const emit = defineEmits<ComboboxEmits>()
const attrs = useAttrs()
const slots = useSlots()

// `passive: true` is used unconditionally so the return type stays a plain
// Ref regardless of whether the consumer binds `v-model`. The earlier
// `passive: (props.modelValue === undefined) as false` variant tried to
// switch between computed-ref and plain-ref at runtime but leaked a
// misleading type cast; treating the model as a local proxy here is fine
// because the controlled case still syncs via useVModel's internal watcher.
const model = useVModel(props, 'modelValue', emit, {
  defaultValue: null,
  passive: true,
})

const open = ref(props.open ?? false)

const rootRef = ref<{ highlightFirstItem?: () => void } | null>(null)
const query = ref('')
const hasTypedSinceOpen = ref(false)
const hasWarnedPlacement = ref(false)

const { motion: contentMotion, onPointerDown: markPointerDown } =
  usePopoverMotion(open)

const inputAttrs = computed(() => {
  const { class: _class, style: _style, autocomplete, ...rest } = attrs
  return { autocomplete: autocomplete ?? 'off', ...rest }
})

const normalizedGroups = computed(() => normalizeComboboxOptions(props.options))

const allSelectableOptions = computed(() =>
  normalizedGroups.value.flatMap((group) =>
    group.options.filter(isSelectableOption),
  ),
)

function getSelectableInternalValue(item: NormalizedSelectableOption) {
  if (item.value !== '') return item.value
  return `${EMPTY_SELECTABLE_VALUE_PREFIX}${allSelectableOptions.value.indexOf(item)}`
}

function toExternalSelectableValue(value: string) {
  return (
    allSelectableOptions.value.find(
      (item) => getSelectableInternalValue(item) === value,
    )?.value ?? value
  )
}

const internalModelValue = computed(() => {
  if (model.value === null || model.value === undefined) return undefined

  const selectableOption = allSelectableOptions.value.find(
    (option) => option.value === model.value,
  )

  return selectableOption
    ? getSelectableInternalValue(selectableOption)
    : model.value
})

const selectedOption = computed<ComboboxSelectableOption | null>(() => {
  if (model.value === null || model.value === undefined) return null
  return (
    allSelectableOptions.value.find((option) => option.value === model.value) ??
    null
  )
})

const displayValue = computed(() => {
  if (selectedOption.value) return selectedOption.value.label
  return model.value ?? ''
})

const resolvedAlign = computed(() => {
  if (props.align !== undefined) {
    if (import.meta.env.DEV && props.placement && !hasWarnedPlacement.value) {
      console.warn(
        '[Combobox] `placement` is deprecated and ignored when `align` is provided. Use `align` instead.',
      )
      hasWarnedPlacement.value = true
    }
    return props.align
  }
  return props.placement ?? 'start'
})

const triggerClasses = computed(() => [
  triggerBaseClasses,
  triggerSizeClasses(props.size),
  inputFontSizeClasses(props.size),
  triggerVariantClasses(props.variant, Boolean(props.disabled)),
])

const resolvedInputClasses = computed(() => [
  inputClasses,
  inputFontSizeClasses(props.size),
])

// The query exposed to item slots and custom-option handlers — empty unless
// the user has actually typed since opening. Without this, a committed
// label (e.g. "Alex Rivera") leaks into the slot context as if it were
// a search term.
const typedQuery = computed(() => (hasTypedSinceOpen.value ? query.value : ''))

// Button mode covers two paths: caller-provided `#trigger` slot, or the
// built-in button trigger selected via `trigger="button"`. In both cases
// the search input moves into the popover.
const isButtonMode = computed(
  () => Boolean(slots.trigger) || props.trigger === 'button',
)

const filteredGroups = computed(() => {
  if (!open.value || !hasTypedSinceOpen.value) {
    return normalizedGroups.value
  }

  return normalizedGroups.value
    .map((group) => ({
      ...group,
      options: group.options.filter((item) =>
        item.type === 'custom'
          ? matchesCustomOption(item, query.value)
          : matchesSelectableOption(item, query.value),
      ),
    }))
    .filter((group) => group.options.length > 0)
})

const hasVisibleItems = computed(() => filteredGroups.value.length > 0)

const showCreateOption = computed(
  () =>
    props.allowCustomValue &&
    !props.loading &&
    hasTypedSinceOpen.value &&
    query.value.length > 0 &&
    !hasVisibleItems.value,
)

const showEmpty = computed(
  () => !props.loading && !showCreateOption.value && !hasVisibleItems.value,
)

function clearSelection() {
  model.value = null
  emit('update:selectedOption', null)
}

function commitSelectableOption(value: string) {
  const option =
    allSelectableOptions.value.find((item) => item.value === value) ?? null

  model.value = value
  emit('update:selectedOption', option)
  query.value = option?.label ?? value
  hasTypedSinceOpen.value = false
}

function commitCustomValue(value: string) {
  if (!value) return

  model.value = value
  emit('update:selectedOption', null)
  query.value = value
  hasTypedSinceOpen.value = false
  open.value = false
}

function handleRootModelValueChange(value: string | null | undefined) {
  if (value == null) {
    clearSelection()
    return
  }

  const externalValue = toExternalSelectableValue(value)
  const selectableOption = allSelectableOptions.value.find(
    (item) => item.value === externalValue,
  )

  if (selectableOption) {
    commitSelectableOption(selectableOption.value)
    return
  }

  if (props.allowCustomValue && !props.loading) {
    commitCustomValue(externalValue)
  }
}

function handleRootOpenChange(value: boolean) {
  open.value = value
}

function handleInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value

  query.value = value
  hasTypedSinceOpen.value = true
  emit('update:query', value)
  emit('input', value)

  if (value === '') clearSelection()

  nextTick(() => rootRef.value?.highlightFirstItem?.())
}

function handleInputEnter(event: KeyboardEvent) {
  if (!showCreateOption.value) return
  event.preventDefault()
  commitCustomValue(query.value)
}

function handleCustomItemSelect(item: NormalizedCustomOption, event: Event) {
  event.preventDefault()
  if (item.disabled) return

  item.onClick(buildCustomOptionContext(typedQuery.value))

  if (!item.keepOpen) open.value = false
}

function handleCreateOptionSelect(event: Event) {
  event.preventDefault()
  commitCustomValue(query.value)
}

// When a custom trigger is used, move focus to the search input inside the
// popover as it opens. reka's default `openAutoFocus` would put focus on
// the first item; we want the user typing to filter, not navigate.
const popoverInputRef = ref<{ $el?: HTMLElement } | null>(null)

function handleContentOpenAutoFocus(event: Event) {
  event.preventDefault()
  if (!isButtonMode.value) return

  nextTick(() => {
    const el = popoverInputRef.value?.$el as HTMLElement | undefined
    el?.focus()
  })
}

function reset() {
  query.value = ''
  hasTypedSinceOpen.value = false
  model.value = null
  emit('update:query', '')
  emit('update:selectedOption', null)
}

watch(
  () => props.open,
  (value) => {
    if (value === undefined) return
    open.value = value
  },
)

watch(open, (value, previousValue) => {
  if (value === previousValue) return
  emit('update:open', value)
})

watch(
  () => displayValue.value,
  (value) => {
    if (!open.value || !hasTypedSinceOpen.value) query.value = value
  },
  { immediate: true },
)

watch(open, (isOpen, wasOpen) => {
  if (isOpen === wasOpen) return
  if (!isOpen) {
    hasTypedSinceOpen.value = false
    query.value = displayValue.value
  }
})

defineExpose<ComboboxExposed>({ reset })
defineSlots<ComboboxSlots>()
</script>

<template>
  <ComboboxRoot
    ref="rootRef"
    :model-value="internalModelValue"
    :open="open"
    :disabled="disabled"
    :ignore-filter="true"
    :open-on-focus="openOnFocus"
    :open-on-click="openOnClick"
    @update:modelValue="handleRootModelValueChange"
    @update:open="handleRootOpenChange"
  >
    <!--
      Two trigger modes, picked automatically:
        1. Default (`trigger="input"`): the trigger IS the search input.
        2. Button mode (`trigger="button"` or `#trigger` slot provided):
           caller's button — or the built-in auto-wired Button — opens the
           popover; the search input moves into the popover header.
    -->
    <template v-if="isButtonMode">
      <!--
        ComboboxTrigger already renders a native <button> by default —
        use it directly rather than wrapping a `<Button>` (which goes
        through Tooltip with inheritAttrs:false and would drop reka's
        `tabindex`/`aria-expanded` before they reach the real element).

        ComboboxAnchor `as-child` pins the popover's positioning
        reference to the trigger element itself, so we don't need a
        separate DOM node for anchoring.

        For `#trigger` slot callers we additionally flip ComboboxTrigger
        to `as-child` so their own button-like element becomes the DOM
        root.
      -->
      <ComboboxAnchor as-child>
        <ComboboxTrigger
          data-slot="trigger"
          :data-state="open ? 'open' : 'closed'"
          :data-disabled="disabled ? '' : undefined"
          :data-variant="variant"
          :data-size="size"
          :disabled="disabled"
          :class="[triggerClasses, attrs.class]"
          :style="attrs.style"
          :as-child="$slots.trigger ? true : undefined"
          @pointerdown="markPointerDown"
        >
        <slot
          v-if="$slots.trigger"
          name="trigger"
          v-bind="{
            open,
            disabled: !!disabled,
            query: typedQuery,
            selectedOption,
            displayValue,
          }"
        />

        <template v-else>
          <!--
            Prefix priority when trigger="button":
              1. selected + #item-prefix → reuse the per-row prefix slot
              2. selected + option.icon → render the icon component
              3. no selection + #prefix → consumer's placeholder icon
          -->
          <slot
            v-if="selectedOption && $slots['item-prefix']"
            name="item-prefix"
            v-bind="{
              item: selectedOption,
              query: '',
              selected: true,
            }"
          />
          <component
            v-else-if="selectedOption?.icon"
            :is="selectedOption.icon"
            class="size-4"
          />
          <slot v-else-if="!selectedOption && $slots.prefix" name="prefix" />

          <span
            :class="[
              'min-w-0 flex-1 truncate text-left',
              !selectedOption && 'text-ink-gray-4',
            ]"
          >
            {{ selectedOption?.label ?? placeholder }}
          </span>

          <LucideChevronDown
            class="ml-auto size-4 shrink-0 text-ink-gray-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=open]:rotate-180"
            :data-state="open ? 'open' : 'closed'"
          />
        </template>
        </ComboboxTrigger>
      </ComboboxAnchor>
    </template>

    <template v-else>
      <ComboboxAnchor
        data-slot="trigger"
        :data-state="open ? 'open' : 'closed'"
        :data-disabled="disabled ? '' : undefined"
        :data-variant="variant"
        :data-size="size"
        :class="[triggerClasses, attrs.class]"
        :style="attrs.style"
        @pointerdown="markPointerDown"
      >
        <slot name="prefix" />

        <ComboboxInput
          :id="id"
          v-bind="inputAttrs"
          data-slot="input"
          :data-variant="variant"
          :data-size="size"
          :value="query"
          :disabled="disabled"
          :placeholder="placeholder"
          :class="resolvedInputClasses"
          @input="handleInputChange"
          @focus="emit('focus', $event)"
          @blur="emit('blur', $event)"
          @keydown.enter="handleInputEnter"
        />

        <ComboboxTrigger
          :disabled="disabled"
          data-slot="chevron"
          class="ml-auto inline-flex shrink-0 items-center justify-center text-ink-gray-4 outline-none transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=open]:rotate-180"
        >
          <LucideChevronDown class="size-4" />
        </ComboboxTrigger>
      </ComboboxAnchor>
    </template>

    <ComboboxPortal :to="portalTo">
      <ComboboxContent
        data-slot="content"
        :data-variant="variant"
        :data-size="size"
        :class="[
          'z-[100]',
          !isButtonMode && 'min-w-[--reka-combobox-trigger-width]',
        ]"
        position="popper"
        :side="side"
        :align="resolvedAlign"
        :side-offset="offset"
        @openAutoFocus="handleContentOpenAutoFocus"
        @closeAutoFocus.prevent
      >
        <div
          data-slot="content-body"
          :data-motion="contentMotion"
          class="overflow-hidden rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5"
        >
          <div
            v-if="isButtonMode"
            data-slot="content-search"
            class="flex items-center gap-2 border-b border-outline-gray-1 px-2"
          >
            <LucideSearch class="size-4 shrink-0 text-ink-gray-4" />
            <ComboboxInput
              :id="id"
              ref="popoverInputRef"
              v-bind="inputAttrs"
              data-slot="input"
              :value="query"
              :disabled="disabled"
              :placeholder="placeholder"
              class="min-w-0 flex-1 px-0 border-0 bg-transparent py-2 text-base text-ink-gray-8 outline-none placeholder:text-ink-gray-4 focus:ring-0"
              @input="handleInputChange"
              @focus="emit('focus', $event)"
              @blur="emit('blur', $event)"
              @keydown.enter="handleInputEnter"
            />
          </div>

          <ComboboxResults
            :groups="filteredGroups"
            :size="size"
            :query="typedQuery"
            :model="model ?? null"
            :loading="loading"
            :empty-text="emptyText"
            :show-create-option="showCreateOption"
            :show-empty="showEmpty"
            :slot-fns="slots"
            :all-selectable-options="allSelectableOptions"
            @select-custom="handleCustomItemSelect"
            @select-create="handleCreateOptionSelect"
          />
        </div>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>

<style scoped>
[data-highlighted],
[data-state='checked'] {
  outline: none !important;
}

[data-slot='content-body'] {
  animation-fill-mode: both;
}

[data-slot='content-body'][data-motion='animated'] {
  backface-visibility: hidden;
  transform-origin: var(--reka-combobox-content-transform-origin);
}

[data-slot='content'][data-state='open']
  [data-slot='content-body'][data-motion='animated'] {
  animation: combobox-content-enter 180ms cubic-bezier(0.23, 1, 0.32, 1);
}

[data-slot='content'][data-state='closed']
  [data-slot='content-body'][data-motion='animated'] {
  animation: combobox-content-exit 140ms cubic-bezier(0.23, 1, 0.32, 1);
}

/*
 * Keyboard-opens skip the scale + translate enter animation, but a tiny
 * opacity fade still runs — it masks the 1-frame position-settle reka
 * performs after mount. ~80ms is below the perception threshold for
 * motion (feels instant) but long enough to hide the jump.
 */
[data-slot='content'][data-state='open']
  [data-slot='content-body'][data-motion='instant'] {
  animation: combobox-content-instant-fade 80ms linear;
}

[data-slot='content'][data-state='closed']
  [data-slot='content-body'][data-motion='instant'] {
  animation: none;
}

@keyframes combobox-content-instant-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

[data-slot='content'][data-state='closed'] {
  pointer-events: none;
}

@keyframes combobox-content-enter {
  from {
    opacity: 0;
    transform: translateY(2px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes combobox-content-exit {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateY(1px) scale(0.985);
  }
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='content-body'] {
    animation-duration: 0ms !important;
  }

  [data-slot='chevron'] {
    transition-duration: 0ms !important;
  }
}
</style>
