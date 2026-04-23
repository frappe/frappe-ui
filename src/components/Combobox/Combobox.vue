<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import {
  computed,
  nextTick,
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
} from 'reka-ui'
import LucideChevronDown from '~icons/lucide/chevron-down'
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
  hiddenTriggerInputClasses,
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

const model = useVModel(props, 'modelValue', emit, {
  defaultValue: null,
  passive: (props.modelValue === undefined) as false,
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

const normalizedGroups = computed(() =>
  normalizeComboboxOptions(props.options),
)

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
    if (
      import.meta.env.DEV &&
      props.placement &&
      !hasWarnedPlacement.value
    ) {
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

  item.onClick(buildCustomOptionContext(query.value))

  if (!item.keepOpen) open.value = false
}

function handleCreateOptionSelect(event: Event) {
  event.preventDefault()
  commitCustomValue(query.value)
}

function handleTriggerSlotClick() {
  if (!slots.trigger || props.disabled || open.value) return
  open.value = true
}

function reset() {
  query.value = ''
  hasTypedSinceOpen.value = false
  model.value = null
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
    <ComboboxAnchor
      data-slot="trigger"
      :data-state="open ? 'open' : 'closed'"
      :data-disabled="disabled ? '' : undefined"
      :data-variant="variant"
      :data-size="size"
      :class="[triggerClasses, attrs.class]"
      :style="attrs.style"
      @click="handleTriggerSlotClick"
      @pointerdown="markPointerDown"
    >
      <template v-if="$slots.trigger">
        <div aria-hidden="true" class="pointer-events-none min-w-0 flex-1">
          <slot
            name="trigger"
            v-bind="{
              open,
              disabled: !!disabled,
              query,
              selectedOption,
              displayValue,
            }"
          />
        </div>

        <ComboboxInput
          :id="id"
          v-bind="inputAttrs"
          data-slot="input"
          :data-variant="variant"
          :data-size="size"
          :value="query"
          :disabled="disabled"
          :class="hiddenTriggerInputClasses"
          :placeholder="placeholder"
          @input="handleInputChange"
          @focus="emit('focus', $event)"
          @blur="emit('blur', $event)"
          @keydown.enter="handleInputEnter"
        />
      </template>

      <template v-else>
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
      </template>
    </ComboboxAnchor>

    <ComboboxPortal :to="portalTo">
      <ComboboxContent
        data-slot="content"
        :data-variant="variant"
        :data-size="size"
        class="z-[100] min-w-[--reka-combobox-trigger-width]"
        position="popper"
        :side="side"
        :align="resolvedAlign"
        :side-offset="offset"
        @openAutoFocus.prevent
        @closeAutoFocus.prevent
      >
        <div
          data-slot="content-body"
          :data-motion="contentMotion"
          class="overflow-hidden rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5"
        >
          <ComboboxResults
            :groups="filteredGroups"
            :size="size"
            :query="query"
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
