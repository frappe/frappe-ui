<script setup lang="ts">
import { computed, ref, useAttrs, useSlots, useTemplateRef, watch } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
  FocusScope,
} from 'reka-ui'
import Button from '../Button/Button.vue'
import { LoadingIndicator } from '../LoadingIndicator'
import MultiSelectResults from './MultiSelectResults.vue'
import { useInputLabeling } from '../../composables/useInputLabeling'
import { usePortalTarget } from '../../composables/usePortalTarget'
import { useEmptyValueMapping } from '../shared/selection/useEmptyValueMapping'
import { useFilteredGroups } from '../shared/selection/useFilteredGroups'
import { useIsModelBound } from '../shared/selection/useIsModelBound'
import OptionIcon from '../shared/selection/OptionIcon.vue'
import {
  InputDescription,
  InputError,
  InputLabel,
  LabelingWrapper,
} from '../InputLabeling'
import '../shared/selection/popoverMotion.css'
import type { SelectionExposed } from '../shared/selection/types'
import type {
  MultiSelectEmits,
  MultiSelectOption,
  MultiSelectProps,
  MultiSelectSearchSlotProps,
  MultiSelectSlotProps,
  MultiSelectSlots,
} from './types'
import {
  EMPTY_VALUE_PREFIX,
  inputFontSizeClasses,
  isGroupedOption,
  matchesOption,
  normalizeMultiSelectOptions,
  triggerBaseClasses,
  triggerSizeClasses,
  triggerVariantClasses,
} from './utils'
import type { NormalizedOption } from './utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<MultiSelectProps>(), {
  options: () => [],
  variant: 'subtle',
  size: 'sm',
  placeholder: 'Select option',
  disabled: false,
  hideSearch: false,
  loading: false,
  filterable: true,
  emptyText: 'No results',
  side: 'bottom',
  align: 'start',
  offset: 4,
})

const portalTarget = usePortalTarget(() => props.portalTo)

const emit = defineEmits<MultiSelectEmits>()
const attrs = useAttrs()
const slots = useSlots()

const model = defineModel<Array<string | number>>({ default: () => [] })
const open = defineModel<boolean>('open', { default: false })
// Optional outside-in control of the search box. Unbound, `defineModel`
// keeps the value local, so `v-model:query` is never required.
const query = defineModel<string>('query', { default: '' })
// Bound, the query is the consumer's — the component never resets it (see the
// open watcher at the bottom of this block).
const isQueryBound = useIsModelBound('query')

const hasTypedSinceOpen = ref(false)

const searchInputRef = useTemplateRef('searchInput')
const triggerRef = useTemplateRef<HTMLButtonElement>('trigger')

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

const normalizedGroups = computed(() =>
  normalizeMultiSelectOptions(props.options),
)

const allOptions = computed<NormalizedOption[]>(() =>
  normalizedGroups.value.flatMap((group) => group.options),
)

// The consumer's own option objects, untouched by normalization. Handed back
// through `update:selectedOptions` so custom fields survive identity-intact —
// the family rule is that anything returning an option returns the original.
const rawOptions = computed<MultiSelectOption[]>(() =>
  (props.options ?? []).flatMap((entry) => {
    if (!entry) return []
    return isGroupedOption(entry) ? entry.options : [entry]
  }),
)

const { toInternal: getInternalValue, toExternal: toExternalValue } =
  useEmptyValueMapping(allOptions, EMPTY_VALUE_PREFIX)

const safeModel = computed<Array<string | number>>(() =>
  Array.isArray(model.value) ? model.value : [],
)

const internalModel = computed<Array<string | number>>(() =>
  safeModel.value.map((value) => {
    const option = allOptions.value.find((item) => item.value === value)
    return option ? getInternalValue(option) : value
  }),
)

const selectedOptions = computed(() =>
  safeModel.value
    .map(
      (value) =>
        allOptions.value.find((option) => option.value === value) ?? null,
    )
    .filter((option): option is NormalizedOption => Boolean(option)),
)

// The compact label shown in the default button trigger. For exactly
// one selected option we show its label (and its prefix/icon is rendered
// in the trigger's prefix area — see template). For 2+ we collapse to
// "N selected" so the width doesn't balloon.
const triggerSummary = computed(() => {
  if (selectedOptions.value.length === 0) return props.placeholder
  if (selectedOptions.value.length === 1) return selectedOptions.value[0].label
  return `${selectedOptions.value.length} selected`
})

// The single selected option — used by the template to reuse
// `#item-prefix` / auto-render the icon in the trigger prefix area.
const singleSelectedOption = computed(() =>
  selectedOptions.value.length === 1 ? selectedOptions.value[0] : null,
)

// Phantom-sizer text: pins width to the larger of `placeholder` and the
// worst-case "N selected" string, so the trigger doesn't resize as the
// count climbs from one digit to two. Single-label display for 1-selected
// can exceed this width and will truncate — width stays capped by the
// sizer's minimum, not the label's length.
const triggerSizingText = computed(() => {
  const maxCount = Math.max(allOptions.value.length, 1)
  return [props.placeholder, `${maxCount} selected`].join('\n')
})

const typedQuery = computed(() => (hasTypedSinceOpen.value ? query.value : ''))

const filteredGroups = useFilteredGroups({
  groups: normalizedGroups,
  open,
  hasTypedSinceOpen,
  query,
  matches: matchesOption,
  filterable: () => props.filterable ?? true,
})

const hasVisibleItems = computed(() =>
  filteredGroups.value.some((group) => group.options.length > 0),
)

const showEmpty = computed(() => !props.loading && !hasVisibleItems.value)

const allSelected = computed(() => {
  const selectable = allOptions.value.filter((option) => !option.disabled)
  if (selectable.length === 0) return false
  const selected = new Set(safeModel.value)
  return selectable.every((option) => selected.has(option.value))
})

// Single write path for the selection so `update:selectedOptions` cannot
// drift from `update:modelValue`.
function setModel(values: Array<string | number>) {
  model.value = values
  emit(
    'update:selectedOptions',
    values
      .map(
        (value) =>
          rawOptions.value.find((option) => option.value === value) ?? null,
      )
      .filter((option): option is MultiSelectOption => Boolean(option)),
  )
}

function clear() {
  setModel([])
}

function selectAll() {
  setModel(
    allOptions.value
      .filter((option) => !option.disabled)
      .map((option) => option.value),
  )
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
}

function focusSearch(options?: FocusOptions) {
  // `ComboboxInput` renders a single `<input>` root, so the instance's `$el`
  // is that element. Resolved through the template ref rather than
  // `getElementById` so the internal id template stays internal.
  const instance = searchInputRef.value as {
    $el?: HTMLInputElement
  } | null
  const el = (instance?.$el ?? instance) as HTMLInputElement | null
  el?.focus(options)
}

/** Focuses the default trigger, falling back to the popover search input. */
function focus(options?: FocusOptions) {
  const target = triggerRef.value
  if (target) {
    target.focus(options)
    return
  }
  focusSearch(options)
}

const slotProps = computed<MultiSelectSlotProps>(() => ({
  open: open.value,
  disabled: Boolean(props.disabled),
  query: typedQuery.value,
  selectedOptions: selectedOptions.value,
  clear,
  setOpen,
}))

const searchSlotProps = computed<MultiSelectSearchSlotProps>(() => ({
  query: typedQuery.value,
  setQuery,
  disabled: Boolean(props.disabled),
  focus: focusSearch,
}))

function handleRootModelValueChange(value: unknown) {
  const values = Array.isArray(value) ? value : value == null ? [] : [value]
  setModel(
    values.map((item) => toExternalValue(item)) as Array<string | number>,
  )
}

function handleRootOpenChange(value: boolean) {
  open.value = value
}

function handleInputChange(event: Event) {
  setQuery((event.target as HTMLInputElement).value)
}

const triggerClasses = computed(() => [
  triggerBaseClasses,
  triggerSizeClasses(props.size),
  inputFontSizeClasses(props.size),
  triggerVariantClasses(props.variant, Boolean(props.disabled)),
])

// Query filtering is gated on the user having typed since the popover opened.
// Deriving that from the query itself (rather than setting it at each write
// site) keeps it correct for every path into the query: typing, the slot's
// `setQuery`, a bound `v-model:query`, and the reset below. In particular,
// clearing must restore "hasn't typed", not assert the opposite.
watch(
  query,
  (value) => {
    hasTypedSinceOpen.value = value !== ''
  },
  { immediate: true },
)

watch(open, (isOpen, wasOpen) => {
  if (isOpen === wasOpen) return

  // A bound `query` belongs to the consumer: resetting it here would emit
  // `update:query('')` and wipe whatever they seeded. Leave it alone and treat
  // a surviving query as an active filter, otherwise the search box would read
  // "ba" over an unfiltered list.
  if (isQueryBound()) {
    hasTypedSinceOpen.value = query.value !== ''
    return
  }

  if (query.value !== '') query.value = ''
  hasTypedSinceOpen.value = false
})

defineExpose<SelectionExposed>({ clear, focus })
defineSlots<MultiSelectSlots>()
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
    <ComboboxRoot
      multiple
      :model-value="internalModel"
      :open="open"
      :disabled="disabled"
      :ignore-filter="true"
      @update:modelValue="handleRootModelValueChange"
      @update:open="handleRootOpenChange"
    >
      <ComboboxAnchor as-child @click="handleTriggerClick">
        <slot v-if="$slots.trigger" name="trigger" v-bind="slotProps" />

        <!--
        Rendered as a raw `<button>` so prefix / label / chevron are
        direct flex children and `justify-between` + label `flex-1` align
        cleanly. Wrapping in `<Button>` would nest the label inside
        Button's own default-slot `<span>`, which is content-sized and
        would center the label when a width class is applied.
      -->
        <button
          v-else
          ref="trigger"
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
          :data-disabled="disabled ? '' : undefined"
          :data-invalid="hasError ? 'true' : undefined"
          :data-required="required ? 'true' : undefined"
          :id="inputId"
          aria-haspopup="listbox"
          :aria-expanded="open"
          :aria-invalid="hasError || undefined"
          :aria-errormessage="hasError ? errorMessageId : undefined"
          :aria-describedby="describedBy"
          :aria-required="required || undefined"
        >
          <!--
          Prefix precedence on the trigger:
            1. `#prefix` slot, when provided, owns the entire prefix area
               regardless of selection count. Use it for aggregate
               visuals like stacked avatars across multiple selections.
            2. otherwise: exactly one selected + `#item-prefix` → reuse
               the list's per-item prefix renderer so the trigger
               matches the dropdown row.
            3. otherwise: exactly one selected + `option.icon` → auto-render
               the icon.
            4. otherwise: nothing.
        -->
          <slot v-if="$slots.prefix" name="prefix" v-bind="slotProps" />
          <template v-else-if="singleSelectedOption && $slots['item-prefix']">
            <slot
              name="item-prefix"
              v-bind="{
                item: singleSelectedOption,
                query: '',
                selected: true,
              }"
            />
          </template>
          <OptionIcon
            v-else-if="singleSelectedOption?.icon"
            :icon="singleSelectedOption.icon"
          />

          <span class="grid min-w-0 flex-1 text-left font-normal">
            <span
              :class="[
                'col-start-1 row-start-1 max-w-full truncate',
                !selectedOptions.length && 'text-ink-gray-4',
              ]"
            >
              <slot
                name="summary"
                v-bind="{
                  ...slotProps,
                  summary: triggerSummary,
                }"
                >{{ triggerSummary }}</slot
              >
            </span>
            <span
              v-if="!$slots.summary"
              aria-hidden="true"
              class="multi-select-trigger-sizer col-start-1 row-start-1"
              :data-width-text="triggerSizingText"
            />
          </span>

          <slot name="suffix" v-bind="slotProps">
            <span
              data-slot="chevron"
              :class="[
                'lucide-chevron-down size-4 shrink-0 text-ink-gray-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]',
                open && 'rotate-180',
              ]"
            />
          </slot>
        </button>
      </ComboboxAnchor>

      <ComboboxPortal :to="portalTarget">
        <ComboboxContent
          data-slot="content"
          data-selection
          :data-variant="variant"
          :data-size="size"
          :data-loading="loading ? '' : undefined"
          class="z-[100] min-w-[--reka-combobox-trigger-width]"
          position="popper"
          :side="side"
          :align="align"
          :side-offset="offset"
        >
          <!--
          FocusScope sits on the always-present content-body div (inside
          ComboboxContent, which is a <Presence> wrapper that renders null
          while closed). Mounting it here pushes a new entry onto reka's
          focus-scope stack the moment the popover opens, pausing any parent
          Dialog's trapped FocusScope so focus can move into the portaled
          popover (e.g. the search input). See Combobox.vue for the same
          fix and a longer rationale.
        -->
          <FocusScope as-child @unmount-auto-focus.prevent>
            <div
              data-slot="content-body"
              data-motion="instant"
              class="overflow-hidden rounded-6 bg-surface-elevation-2 shadow-2xl ring-1 ring-black ring-opacity-5"
            >
              <div
                v-if="!hideSearch"
                data-slot="search"
                class="flex items-center gap-2 border-b border-outline-gray-1 px-3"
              >
                <slot
                  v-if="$slots['search-prefix']"
                  name="search-prefix"
                  v-bind="searchSlotProps"
                />
                <ComboboxInput
                  ref="searchInput"
                  :id="`${inputId}-search-input`"
                  data-slot="input"
                  :value="query"
                  :disabled="disabled"
                  :placeholder="placeholder"
                  autocomplete="off"
                  class="min-w-0 flex-1 border-0 bg-transparent px-0 py-2 text-base text-ink-gray-8 outline-none placeholder:text-ink-gray-4 focus:ring-0"
                  @input="handleInputChange"
                />
                <LoadingIndicator
                  v-if="loading"
                  class="size-4 shrink-0 text-ink-gray-5"
                />
                <slot
                  v-if="$slots['search-suffix']"
                  name="search-suffix"
                  v-bind="searchSlotProps"
                />
              </div>

              <MultiSelectResults
                :groups="filteredGroups"
                :size="size"
                :query="typedQuery"
                :selected-values="safeModel"
                :loading="loading"
                :hide-search="hideSearch"
                :empty-text="emptyText"
                :show-empty="showEmpty"
                :slot-fns="slots"
                :all-options="allOptions"
              />

              <template v-if="$slots.footer">
                <div data-slot="footer">
                  <slot
                    name="footer"
                    v-bind="{
                      ...slotProps,
                      selectAll,
                    }"
                  />
                </div>
              </template>
              <div
                v-else
                data-slot="footer"
                class="flex items-center justify-between gap-2 border-t border-outline-gray-1 px-2 py-1.5"
              >
                <Button
                  v-if="safeModel.length > 0"
                  variant="ghost"
                  size="sm"
                  @click="clear"
                >
                  Clear All
                </Button>
                <Button
                  v-if="!allSelected"
                  variant="ghost"
                  size="sm"
                  class="ml-auto"
                  @click="selectAll"
                >
                  Select All
                </Button>
              </div>
            </div>
          </FocusScope>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
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

.multi-select-trigger-sizer::after {
  content: attr(data-width-text);
  display: block;
  height: 0;
  overflow: hidden;
  white-space: pre;
  visibility: hidden;
}
</style>
