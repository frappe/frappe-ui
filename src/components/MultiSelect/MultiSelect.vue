<script setup lang="ts">
import { computed, ref, useAttrs, useSlots, watch } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
  FocusScope,
} from 'reka-ui'
import Button from '../Button/Button.vue'
import LoadingIndicator from '../LoadingIndicator.vue'
import MultiSelectResults from './MultiSelectResults.vue'
import { usePopoverMotion } from '../../composables/usePopoverMotion'
import { useInputLabeling } from '../../composables/useInputLabeling'
import { useEmptyValueMapping } from '../shared/selection/useEmptyValueMapping'
import { useFilteredGroups } from '../shared/selection/useFilteredGroups'
import OptionIcon from '../shared/selection/OptionIcon.vue'
import {
  InputDescription,
  InputError,
  InputLabel,
  LabelingWrapper,
} from '../InputLabeling'
import '../shared/selection/popoverMotion.css'
import type {
  MultiSelectEmits,
  MultiSelectProps,
  MultiSelectSlots,
} from './types'
import {
  EMPTY_VALUE_PREFIX,
  inputFontSizeClasses,
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
  emptyText: 'No results',
  side: 'bottom',
  align: 'start',
  offset: 4,
  portalTo: 'body',
})

const emit = defineEmits<MultiSelectEmits>()
const attrs = useAttrs()
const slots = useSlots()

const model = defineModel<string[]>({ default: () => [] })
const open = defineModel<boolean>('open', { default: false })

const query = ref('')
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

const { motion: contentMotion, onPointerDown: markPointerDown } =
  usePopoverMotion(open)

const normalizedGroups = computed(() =>
  normalizeMultiSelectOptions(props.options),
)

const allOptions = computed<NormalizedOption[]>(() =>
  normalizedGroups.value.flatMap((group) => group.options),
)

const { toInternal: getInternalValue, toExternal: toExternalValue } =
  useEmptyValueMapping(allOptions, EMPTY_VALUE_PREFIX)

const safeModel = computed<string[]>(() =>
  Array.isArray(model.value) ? model.value : [],
)

const internalModel = computed<string[]>(() =>
  safeModel.value.map((value) => {
    const option = allOptions.value.find((item) => item.value === value)
    return option ? getInternalValue(option) : value
  }),
)

function findOptionByValue(value: string): NormalizedOption | null {
  if (props.compareFn) {
    const probe = { label: value, value } as NormalizedOption
    return (
      allOptions.value.find((option) => props.compareFn!(option, probe)) ?? null
    )
  }
  return allOptions.value.find((option) => option.value === value) ?? null
}

const selectedOptions = computed(() =>
  safeModel.value
    .map((value) => findOptionByValue(value))
    .filter((option): option is NormalizedOption => Boolean(option)),
)

const displayValue = computed(() =>
  selectedOptions.value.map((option) => option.label).join(', '),
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

function clearAll() {
  model.value = []
}

function selectAll() {
  model.value = allOptions.value
    .filter((option) => !option.disabled)
    .map((option) => option.value)
}

function toggleOpen() {
  if (props.disabled) return
  open.value = !open.value
}

function handleRootModelValueChange(value: string | string[] | undefined) {
  const arr = Array.isArray(value) ? value : value ? [value] : []
  const mapped = arr.map(toExternalValue)
  model.value = mapped
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
}

const triggerClasses = computed(() => [
  triggerBaseClasses,
  triggerSizeClasses(props.size),
  inputFontSizeClasses(props.size),
  triggerVariantClasses(props.variant, Boolean(props.disabled)),
])

watch(open, (isOpen, wasOpen) => {
  if (isOpen === wasOpen) return
  query.value = ''
  hasTypedSinceOpen.value = false
})

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
      class="text-p-sm font-medium text-ink-gray-7"
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
    <ComboboxAnchor
      as-child
      @click="toggleOpen"
      @pointerdown="markPointerDown"
    >
      <slot
        v-if="$slots.trigger"
        name="trigger"
        v-bind="{
          open,
          disabled: !!disabled,
          query: typedQuery,
          selectedOptions,
          displayValue,
          clearAll,
          toggleOpen,
        }"
      />

      <!--
        Rendered as a raw `<button>` so prefix / label / chevron are
        direct flex children and `justify-between` + label `flex-1` align
        cleanly. Wrapping in `<Button>` would nest the label inside
        Button's own default-slot `<span>`, which is content-sized and
        would center the label when a width class is applied.
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
        <slot
          v-if="$slots.prefix"
          name="prefix"
          v-bind="{
            open,
            disabled: !!disabled,
            query: typedQuery,
            selectedOptions,
            displayValue,
            clearAll,
            toggleOpen,
          }"
        />
        <template
          v-else-if="singleSelectedOption && $slots['item-prefix']"
        >
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
                open,
                disabled: !!disabled,
                query: typedQuery,
                selectedOptions,
                displayValue,
                clearAll,
                toggleOpen,
                summary: triggerSummary,
              }"
            >{{ triggerSummary }}</slot>
          </span>
          <span
            v-if="!$slots.summary"
            aria-hidden="true"
            class="multi-select-trigger-sizer col-start-1 row-start-1"
            :data-width-text="triggerSizingText"
          />
        </span>

        <slot
          name="suffix"
          v-bind="{
            open,
            disabled: !!disabled,
            query: typedQuery,
            selectedOptions,
            displayValue,
            clearAll,
            toggleOpen,
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

    <ComboboxPortal :to="portalTo">
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
            :data-motion="contentMotion"
            class="overflow-hidden rounded-lg bg-surface-elevation-2 shadow-2xl ring-1 ring-black ring-opacity-5"
          >
            <div
              v-if="!hideSearch"
              data-slot="search"
              class="flex items-center gap-2 border-b border-outline-gray-1 px-3"
            >
              <ComboboxInput
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
                    clearAll,
                    selectAll,
                    selectedOptions,
                    query: typedQuery,
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
                @click="clearAll"
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

/* Component-specific transform-origin; the rest of the motion lives in
   shared/selection/popoverMotion.css. */
[data-slot='content-body'][data-motion='animated'] {
  transform-origin: var(--reka-combobox-content-transform-origin);
}
</style>
