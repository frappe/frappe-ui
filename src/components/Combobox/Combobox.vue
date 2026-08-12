<script setup lang="ts">
import {
  computed,
  nextTick,
  ref,
  useAttrs,
  useSlots,
  useTemplateRef,
  watch,
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
import PopoverPanel from '../shared/popover/PopoverPanel.vue'
import ComboboxResults from './ComboboxResults.vue'
import { useInputLabeling } from '../../composables/useInputLabeling'
import { usePortalTarget } from '../../composables/usePortalTarget'
import { useEmptyValueMapping } from '../shared/selection/useEmptyValueMapping'
import { useFilteredGroups } from '../shared/selection/useFilteredGroups'
import { useIsModelBound } from '../shared/selection/useIsModelBound'
import {
  InputDescription,
  InputError,
  InputLabel,
  LabelingWrapper,
} from '../InputLabeling'
import type {
  ComboboxEmits,
  ComboboxOptionValue,
  ComboboxProps,
  ComboboxSearchSlotProps,
  ComboboxSelectableOption,
  ComboboxSlots,
  ComboboxControlSlotProps,
} from './types'
import type { SelectionExposed } from '../shared/selection/types'
import {
  buildCustomOptionContext,
  customOptionIsVisible,
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
  NormalizedGroup,
  NormalizedItem,
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
  align: 'start',
  offset: 4,
  loading: false,
  emptyText: 'No results',
  hideSearch: false,
  filterable: true,
})

const portalTarget = usePortalTarget(() => props.portalTo)

const emit = defineEmits<ComboboxEmits>()
const attrs = useAttrs()
const slots = useSlots()

const model = defineModel<ComboboxOptionValue | null>({ default: null })
const open = defineModel<boolean>('open', { default: false })
const query = defineModel<string>('query', { default: '' })
// Bound, the query is the consumer's — the component never resets it on its
// own (see `skipInitialDisplaySync` and the open watcher below).
const isQueryBound = useIsModelBound('query')

const rootRef = ref<{ highlightFirstItem?: () => void } | null>(null)
const inputRef = useTemplateRef('inputRef')
const searchInputRef = useTemplateRef('searchInputRef')
const triggerButtonRef = useTemplateRef('triggerButtonRef')
const anchorRef = useTemplateRef('anchorRef')
const hasTypedSinceOpen = ref(false)

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
  hasLabelSlot: () => Boolean(slots.label),
  hasDescriptionSlot: () => Boolean(slots.description),
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
  return model.value === null || model.value === undefined
    ? ''
    : String(model.value)
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

const filteredGroups = useFilteredGroups<NormalizedItem, NormalizedGroup>({
  groups: normalizedGroups,
  open,
  hasTypedSinceOpen,
  query,
  filterable: () => props.filterable ?? true,
  // `matches` is the client-side query filter — it runs only once the user
  // types and is switched off by `filterable: false`. Both row kinds go
  // through it, including custom rows that declare no `condition` (their
  // label substring match is ordinary filtering, not declared visibility).
  matches: (item, q) =>
    item.type === 'custom'
      ? matchesCustomOption(item, q)
      : matchesSelectableOption(item, q),
  // `alwaysMatch` carries consumer-declared visibility: a custom row's
  // `condition` is authoritative and runs even before the user types, so it
  // is deliberately unaffected by `filterable`.
  alwaysMatch: (item) =>
    item.type !== 'custom' || customOptionIsVisible(item, typedQuery.value),
})

const hasVisibleItems = computed(() => filteredGroups.value.length > 0)

// Keep the first item highlighted while the user is typing. The per-keystroke
// highlight in handleInputChange only covers the client-filtered list — options
// that arrive asynchronously (a debounced server search resolving) land after
// that pass and would leave nothing highlighted. Gated to the typing path so
// merely opening the list still lets reka highlight the committed selection.
watch(filteredGroups, () => {
  if (!open.value || !hasTypedSinceOpen.value) return
  nextTick(() => rootRef.value?.highlightFirstItem?.())
})

const showEmpty = computed(() => !props.loading && !hasVisibleItems.value)

// Clears the selection, and nothing else — same meaning as `clear()` on Select
// and MultiSelect. The query is left alone: in input mode the display-sync
// watcher below already follows the model down to an empty input, and in
// button mode the query is a separate filter that the user still owns.
function clear() {
  model.value = null
  emit('update:selectedOption', null)
}

function handleTriggerClick() {
  setOpen(!open.value)
}

function setOpen(value: boolean) {
  if (props.disabled) return
  open.value = value
}

function setQuery(value: string) {
  if (props.disabled) return
  query.value = value
  // Clearing the query restores the "hasn't typed since opening" state.
  hasTypedSinceOpen.value = value !== ''
}

// Shared shape for the #trigger, #prefix, #suffix, and #footer slots. `clear`
// and `setOpen` are exposed alongside the read-only fields so consumers
// can wire clear / open affordances (e.g. a custom #trigger or an inline
// button in #suffix) without hoisting into #trigger or managing the model
// and open state themselves.
const controlSlotProps = computed<ComboboxControlSlotProps>(() => ({
  open: open.value,
  disabled: Boolean(props.disabled),
  query: typedQuery.value,
  selectedOption: selectedOption.value,
  displayValue: displayValue.value,
  clear,
  setOpen,
}))

const searchSlotProps = computed<ComboboxSearchSlotProps>(() => ({
  query: typedQuery.value,
  setQuery,
  disabled: Boolean(props.disabled),
  focus: focusSearch,
}))

function commitSelectableOption(value: ComboboxOptionValue) {
  const option =
    allSelectableOptions.value.find((item) => item.value === value) ?? null

  model.value = value
  emit('update:selectedOption', option)
  query.value = option?.label ?? String(value)
  hasTypedSinceOpen.value = false
}

function handleRootModelValueChange(
  value: ComboboxOptionValue | null | undefined,
) {
  if (value == null) {
    clear()
    return
  }

  const externalValue = toExternalSelectableValue(value)
  const selectableOption = allSelectableOptions.value.find(
    (item) => item.value === externalValue,
  )

  if (selectableOption) {
    commitSelectableOption(selectableOption.value)
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

  // In input mode the input IS the selected-value display, so clearing it
  // clears the model. In button mode the input lives in the popover and is
  // only a filter — emptying it must not wipe the selection.
  if (value === '' && !isButtonMode.value) clear()

  nextTick(() => rootRef.value?.highlightFirstItem?.())
}

function handleCustomItemSelect(item: NormalizedCustomOption, event: Event) {
  event.preventDefault()
  if (item.disabled) return

  item.onClick(buildCustomOptionContext(typedQuery.value))

  if (!item.keepOpen) open.value = false
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

/** Unwraps a template ref that may hold a component instance or an element. */
function toElement(target: unknown): HTMLElement | null {
  if (!target) return null
  if (target instanceof HTMLElement) return target
  const el = (target as { $el?: unknown }).$el
  return el instanceof HTMLElement ? el : null
}

/** Focuses the in-popover search input (button mode, popover open). */
function focusSearch(options?: FocusOptions) {
  toElement(searchInputRef.value)?.focus(options)
}

/**
 * Focuses the combobox's control: the in-popover search input when button
 * mode has it mounted, otherwise the trigger (button mode) or the input
 * (input mode).
 */
function focus(options?: FocusOptions) {
  const target = isButtonMode.value
    ? (toElement(searchInputRef.value) ??
      toElement(triggerButtonRef.value) ??
      toElement(anchorRef.value))
    : toElement(inputRef.value)

  target?.focus(options)
}

// A consumer-supplied `query` owns the input text on first render; without
// this the immediate sync below would overwrite it with the (usually empty)
// display value.
let skipInitialDisplaySync = query.value !== ''

watch(
  () => displayValue.value,
  (value) => {
    const skip = skipInitialDisplaySync
    skipInitialDisplaySync = false

    // Button mode keeps query decoupled — input is just a filter, the trigger
    // shows the selected value independently.
    if (isButtonMode.value || skip) return
    if (!open.value || !hasTypedSinceOpen.value) query.value = value
  },
  { immediate: true },
)

watch(open, (isOpen, wasOpen) => {
  if (isOpen === wasOpen) return

  if (isOpen) {
    if (!isButtonMode.value) return
    // On open in button mode, start the filter fresh — no leftover label
    // like "In Progress" in the search input. A bound query is the
    // consumer's, so it survives instead; treat it as an active filter so the
    // search box and the list agree. (Input mode is untouched: there the
    // query IS the display value and follows the model, not the open state.)
    if (isQueryBound()) hasTypedSinceOpen.value = query.value !== ''
    else query.value = ''
    return
  }

  hasTypedSinceOpen.value = false
  // Input mode: the input is the value display, so it goes back to showing the
  // committed label — that is model sync, not a reset, and it applies to a
  // bound query too. Button mode's clear is a plain reset, so it is skipped
  // when the consumer owns the query.
  if (!isButtonMode.value) query.value = displayValue.value
  else if (!isQueryBound()) query.value = ''
})

// Same reasoning as the open watcher, for a combobox that mounts already open:
// a consumer-seeded query in button mode is an active filter from the start.
// Input mode is excluded because there a non-empty query may just be the
// committed label, which must not filter the list to itself.
if (isButtonMode.value && isQueryBound() && query.value !== '') {
  hasTypedSinceOpen.value = true
}

defineExpose<SelectionExposed>({ clear, focus })
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

        Click is attached on the anchor so it forwards to the child via
        `as-child` — this makes consumer-supplied `#trigger` elements
        "just work" without wiring handlers.

        `anchorRef` is the `focus()` fallback for a consumer-supplied
        `#trigger`, which we have no direct ref to.
      -->
          <ComboboxAnchor ref="anchorRef" as-child @click="handleTriggerClick">
            <slot
              v-if="$slots.trigger"
              name="trigger"
              v-bind="controlSlotProps"
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
              ref="triggerButtonRef"
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
                v-bind="controlSlotProps"
              />

              <span
                :class="[
                  'min-w-0 flex-1 truncate text-left font-normal',
                  !selectedOption && 'text-ink-gray-4',
                ]"
              >
                {{ selectedOption?.label ?? placeholder }}
              </span>

              <slot name="suffix" v-bind="controlSlotProps">
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
            <slot v-else name="prefix" v-bind="controlSlotProps" />

            <ComboboxInput
              :id="inputId"
              ref="inputRef"
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
            />

            <slot name="suffix" v-bind="controlSlotProps">
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

        <ComboboxPortal :to="portalTarget">
          <ComboboxContent
            data-slot="content"
            data-selection
            :data-variant="variant"
            :data-size="size"
            :data-loading="loading ? '' : undefined"
            :class="[
              'z-[100]',
              !isButtonMode && 'min-w-[--reka-combobox-trigger-width]',
            ]"
            position="popper"
            :side="side"
            :align="align"
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
              <PopoverPanel>
                <!--
                  The in-popover search row exists only in button mode, and
                  `hideSearch` removes it entirely — the `#search-prefix` /
                  `#search-suffix` slots live inside it and disappear with it.
                -->
                <div
                  v-if="isButtonMode && !hideSearch"
                  data-slot="search"
                  class="flex items-center gap-2 border-b border-outline-gray-1 px-3"
                >
                  <slot
                    v-if="$slots['search-prefix']"
                    name="search-prefix"
                    v-bind="searchSlotProps"
                  />
                  <ComboboxInput
                    :id="`${inputId}-search-input`"
                    ref="searchInputRef"
                    v-bind="inputAttrs"
                    data-slot="input"
                    :value="query"
                    :disabled="disabled"
                    :placeholder="placeholder"
                    class="min-w-0 flex-1 px-0 border-0 bg-transparent py-2 text-base text-ink-gray-8 outline-none placeholder:text-ink-gray-4 focus:ring-0"
                    @input="handleInputChange"
                    @focus="emit('focus', $event)"
                    @blur="emit('blur', $event)"
                  />
                  <slot
                    v-if="$slots['search-suffix']"
                    name="search-suffix"
                    v-bind="searchSlotProps"
                  />
                </div>

                <ComboboxResults
                  :groups="filteredGroups"
                  :size="size"
                  :query="typedQuery"
                  :model="model ?? null"
                  :loading="loading"
                  :empty-text="emptyText"
                  :show-empty="showEmpty"
                  :slot-fns="slots"
                  :all-selectable-options="allSelectableOptions"
                  @select-custom="handleCustomItemSelect"
                />

                <div v-if="$slots.footer" data-slot="footer">
                  <slot name="footer" v-bind="controlSlotProps" />
                </div>
              </PopoverPanel>
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

/* Block clicks while the panel plays its exit animation (the shell + open/close
   motion now come from PopoverPanel; only this component-specific rule remains). */
[data-slot='content'][data-state='closed'] {
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='chevron'] {
    transition-duration: 0ms !important;
  }
}
</style>
