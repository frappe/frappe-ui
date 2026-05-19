<script setup lang="ts">
import {
  computed,
  nextTick,
  ref,
  useAttrs,
  useSlots,
  watch,
  watchEffect,
} from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  FocusScope,
} from 'reka-ui'
import OptionIcon from '../shared/selection/OptionIcon.vue'
import '../shared/selection/popoverMotion.css'
import ComboboxResults from './ComboboxResults.vue'
import { usePopoverMotion } from '../../composables/usePopoverMotion'
import { useInputLabeling } from '../../composables/useInputLabeling'
import { useEmptyValueMapping } from '../shared/selection/useEmptyValueMapping'
import { useFilteredGroups } from '../shared/selection/useFilteredGroups'
import {
  InputDescription,
  InputError,
  InputLabel,
  LabelingWrapper,
} from '../InputLabeling'
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
  openOnClick: true,
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

const model = defineModel<string | null>({ default: null })

const open = ref(props.open ?? false)

const rootRef = ref<{ highlightFirstItem?: () => void } | null>(null)
const query = ref('')
const hasTypedSinceOpen = ref(false)
const hasWarnedPlacement = ref(false)

const { motion: contentMotion, onPointerDown: markPointerDown } =
  usePopoverMotion(open)

const {
  inputId,
  labelId,
  descriptionId,
  errorMessageId,
  describedBy,
  hasError,
  errorLines,
  showDescription,
} = useInputLabeling(props, {
  size: () => props.size,
  variant: () => props.variant,
  disabled: () => props.disabled,
})

const hasLabeling = computed(() => {
  return Boolean(
    props.label ||
      props.description ||
      hasError.value ||
      slots.label ||
      slots.description,
  )
})

const inputAriaAttrs = computed(() => ({
  'aria-invalid': hasError.value || undefined,
  'aria-errormessage': hasError.value ? errorMessageId.value : undefined,
  'aria-describedby': describedBy.value,
  'aria-required': props.required || undefined,
}))

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

const {
  toInternal: getSelectableInternalValue,
  toExternal: toExternalSelectableValue,
} = useEmptyValueMapping(allSelectableOptions, EMPTY_SELECTABLE_VALUE_PREFIX)

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
  if (props.align !== undefined) return props.align
  return props.placement ?? 'start'
})

if (import.meta.env.DEV) {
  watchEffect(() => {
    if (
      props.align !== undefined &&
      props.placement &&
      !hasWarnedPlacement.value
    ) {
      console.warn(
        '[Combobox] `placement` is deprecated and ignored when `align` is provided. Use `align` instead.',
      )
      hasWarnedPlacement.value = true
    }
  })
}

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

const filteredGroups = useFilteredGroups({
  groups: normalizedGroups,
  open,
  hasTypedSinceOpen,
  query,
  // Selectable rows: query-driven substring match. Custom rows: skip here
  // and let `alwaysMatch` consult `condition` so the row's visibility is
  // bespoke (works even before the user types, when the typed-query path
  // is otherwise bypassed).
  matches: (item, q) =>
    item.type === 'custom' ? true : matchesSelectableOption(item, q),
  alwaysMatch: (item) =>
    item.type !== 'custom' || matchesCustomOption(item, typedQuery.value),
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

  // In input mode the input IS the selected-value display, so clearing it
  // clears the model. In button mode the input lives in the popover and is
  // only a filter — emptying it must not wipe the selection.
  if (value === '' && !isButtonMode.value) clearSelection()

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

function handleFocusScopeMountAutoFocus(event: Event) {
  // In input mode the trigger is the search input — keep focus there so the
  // user can keep typing. FocusScope's default would yank focus to the first
  // tabbable inside the popover (an item).
  // In button mode, let FocusScope's default run: it focuses the first
  // tabbable inside the popover (our search input). Critically, this fires
  // AFTER FocusScope adds itself to the focus-scope stack, so it works even
  // when the Combobox is rendered inside a Dialog whose FocusScope is
  // trapping focus.
  if (!isButtonMode.value) event.preventDefault()
}

function reset() {
  query.value = ''
  hasTypedSinceOpen.value = false
  model.value = null
  emit('update:query', '')
  emit('update:selectedOption', null)
}

function focus() {
  const id = isButtonMode.value ? `${inputId.value}-search-input` : inputId.value
  const el = document.getElementById(id) as HTMLInputElement | null
  el?.focus()
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
    // Button mode keeps query decoupled — input is just a filter, the trigger
    // shows the selected value independently.
    if (isButtonMode.value) return
    if (!open.value || !hasTypedSinceOpen.value) query.value = value
  },
  { immediate: true },
)

watch(open, (isOpen, wasOpen) => {
  if (isOpen === wasOpen) return
  if (isOpen) {
    // On open in button mode, start the filter fresh — no leftover label
    // like "In Progress" in the search input.
    if (isButtonMode.value) query.value = ''
    return
  }
  hasTypedSinceOpen.value = false
  query.value = isButtonMode.value ? '' : displayValue.value
})

defineExpose<ComboboxExposed>({ reset, focus })
defineSlots<ComboboxSlots>()
</script>

<template>
  <LabelingWrapper
    :enabled="hasLabeling"
    :wrapper-class="['space-y-1.5', attrs.class as any]"
    :wrapper-style="attrs.style as any"
  >
    <InputLabel
      v-if="label || $slots.label"
      :id="labelId"
      :for-id="inputId"
      :label="label"
      :required="required"
      class="text-p-sm font-medium text-ink-gray-7"
    >
      <template v-if="$slots.label" #default="slotProps">
        <slot name="label" v-bind="slotProps" />
      </template>
    </InputLabel>
    <!--
      ComboboxRoot uses `display: contents` so it's invisible to layout —
      space-y-1.5 on LabelingWrapper would try to attach margin-top to it
      and the rule gets dropped, collapsing the gap between label and
      trigger. Wrap in a div that drops back to `display: contents` when
      there's no labeling, so bare usage keeps its flattened layout.
    -->
    <div :class="hasLabeling ? null : 'contents'">
  <ComboboxRoot
    ref="rootRef"
    class="contents"
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
        reka's `ComboboxTrigger` hardcodes `tabindex="-1"` — it assumes
        the ComboboxInput is the tab-stop and the trigger is just a
        mouse-clickable chevron. That's wrong for button mode where
        there's no visible input to focus. Use `ComboboxAnchor`
        (positioning only, no tabindex meddling) with a real <button>
        as the child, and wire the open toggle ourselves.

        Click + pointerdown are attached on the anchor so they forward
        to the child via `as-child` — this makes consumer-supplied
        `#trigger` elements "just work" without wiring handlers.
      -->
      <ComboboxAnchor
        as-child
        @click="open = !open"
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

        <!--
          Rendered as a raw `<button>` (not the `<Button>` component) so
          the prefix / label / chevron are direct flex children and
          `justify-between` + label `flex-1` align cleanly. Wrapping in
          `<Button>` would put the label inside Button's own default-slot
          `<span>`, which is content-sized and would center the label in
          `w-full` buttons.
        -->
        <button
          v-else
          type="button"
          :class="[
            triggerClasses,
            'justify-between',
            disabled && 'cursor-not-allowed',
            hasLabeling ? 'w-full' : null,
            hasLabeling ? null : (attrs.class as any),
          ]"
          :style="hasLabeling ? null : (attrs.style as any)"
          :disabled="disabled"
          data-slot="trigger"
          :data-state="open ? 'open' : 'closed'"
          :data-variant="variant"
          :data-size="size"
          :data-invalid="hasError ? 'true' : undefined"
          :data-required="required ? 'true' : undefined"
          :id="inputId"
          aria-haspopup="listbox"
          :aria-expanded="open"
          v-bind="inputAriaAttrs"
        >
          <!--
            Prefix precedence on the trigger:
              1. selected + `#item-prefix` slot → reuse the list's per-item
                 prefix renderer so the trigger matches the dropdown row
                 without a second slot definition.
              2. selected + `option.icon` → auto-render the icon (lucide
                 string / emoji / component).
              3. not selected + `#prefix` slot → user's placeholder affordance.
          -->
          <template v-if="selectedOption && $slots['item-prefix']">
            <slot
              name="item-prefix"
              v-bind="{
                item: selectedOption,
                query: '',
                selected: true,
              }"
            />
          </template>
          <OptionIcon
            v-else-if="selectedOption?.icon"
            :icon="selectedOption.icon"
          />
          <slot
            v-else-if="!selectedOption && $slots.prefix"
            name="prefix"
            v-bind="{
              open,
              disabled: !!disabled,
              query: typedQuery,
              selectedOption,
              displayValue,
            }"
          />

          <span
            :class="[
              'min-w-0 flex-1 truncate text-left font-normal',
              !selectedOption && 'text-ink-gray-4',
            ]"
          >
            {{ selectedOption?.label ?? placeholder }}
          </span>

          <slot
            name="suffix"
            v-bind="{
              open,
              disabled: !!disabled,
              query: typedQuery,
              selectedOption,
              displayValue,
            }"
          >
            <span
              :class="[
                'lucide-chevron-down size-4 shrink-0 text-ink-gray-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]',
                open && 'rotate-180',
              ]"
            />
          </slot>
        </button>
      </ComboboxAnchor>
    </template>

    <template v-else>
      <ComboboxAnchor
        data-slot="trigger"
        :data-state="open ? 'open' : 'closed'"
        :data-disabled="disabled ? '' : undefined"
        :data-variant="variant"
        :data-size="size"
        :data-invalid="hasError ? 'true' : undefined"
        :data-required="required ? 'true' : undefined"
        :class="[
          triggerClasses,
          hasLabeling ? 'w-full' : null,
          hasLabeling ? null : (attrs.class as any),
        ]"
        :style="hasLabeling ? null : (attrs.style as any)"
        @pointerdown="markPointerDown"
      >
        <!--
          Prefix precedence matches button mode: selected option's
          `#item-prefix` → selected option's icon auto-render →
          user's `#prefix` slot.
        -->
        <template v-if="selectedOption && $slots['item-prefix']">
          <slot
            name="item-prefix"
            v-bind="{ item: selectedOption, query: '', selected: true }"
          />
        </template>
        <OptionIcon
          v-else-if="selectedOption?.icon"
          :icon="selectedOption.icon"
        />
        <slot
          v-else
          name="prefix"
          v-bind="{
            open,
            disabled: !!disabled,
            query: typedQuery,
            selectedOption,
            displayValue,
          }"
        />

        <ComboboxInput
          :id="inputId"
          v-bind="{ ...inputAttrs, ...inputAriaAttrs }"
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

        <slot
          name="suffix"
          v-bind="{
            open,
            disabled: !!disabled,
            query: typedQuery,
            selectedOption,
            displayValue,
          }"
        >
          <ComboboxTrigger
            :disabled="disabled"
            data-slot="chevron"
            class="inline-flex shrink-0 items-center justify-center text-ink-gray-4 outline-none transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[state=open]:rotate-180"
          >
            <span class="lucide-chevron-down size-4 text-ink-gray-6" />
          </ComboboxTrigger>
        </slot>
      </ComboboxAnchor>
    </template>

    <ComboboxPortal :to="portalTo">
      <ComboboxContent
        data-slot="content"
        data-selection
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
      >
        <!--
          Why FocusScope lives here (inside ComboboxContent) and not around it:

          ComboboxContent is a <Presence> wrapper — it renders null when the
          popover is closed. Placing FocusScope outside with `as-child` means
          its container is null while closed, so it never registers on reka's
          global focus-scope stack, and the fix has no effect.

          By sitting on the always-present content-body div, FocusScope mounts
          the moment the popover opens. It pushes itself onto the stack, which
          pauses any parent Dialog's trapped FocusScope. That allows focus to
          move freely into the portaled popover.

          Why we don't prevent mountAutoFocus (in button mode):
          ComboboxContentImpl.onMounted synchronously calls inputElement.focus()
          before our FocusScope has had a chance to register — the dialog trap
          immediately reverts it. FocusScope's own auto-focus fires after the
          stack push, so it re-focuses the first tabbable (the search input)
          once the dialog trap is paused. In input mode we prevent it so the
          trigger input keeps focus while the list opens.
        -->
        <FocusScope
          as-child
          @mount-auto-focus="handleFocusScopeMountAutoFocus"
          @unmount-auto-focus.prevent
        >
          <div
            data-slot="content-body"
            :data-motion="contentMotion"
            class="overflow-hidden rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5"
          >
            <div
              v-if="isButtonMode"
              data-slot="content-search"
              class="flex items-center gap-2 border-b border-outline-gray-1 px-3"
            >
              <ComboboxInput
                :id="`${inputId}-search-input`"
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
        </FocusScope>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
    </div>
    <InputDescription
      v-if="showDescription || $slots.description"
      :id="descriptionId"
      :description="description"
    >
      <slot v-if="$slots.description" name="description" />
    </InputDescription>
    <InputError v-if="hasError" :id="errorMessageId" :lines="errorLines" />
  </LabelingWrapper>
</template>

<style scoped>
[data-highlighted],
[data-state='checked'] {
  outline: none !important;
}

/* Component-specific transform-origin; the rest of the motion lives in
   shared/selection/popoverMotion.css. */
[data-slot='content-body'][data-motion='animated'] {
  transform-origin: var(--reka-combobox-content-transform-origin);
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='chevron'] {
    transition-duration: 0ms !important;
  }
}
</style>
