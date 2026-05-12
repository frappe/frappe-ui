<script setup lang="ts">
import { computed, nextTick, ref, useAttrs, useSlots, watch } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
} from 'reka-ui'
import Button from '../Button/Button.vue'
import LoadingIndicator from '../LoadingIndicator.vue'
import MultiSelectResults from './MultiSelectResults.vue'
import { usePopoverMotion } from '../../composables/usePopoverMotion'
import { useEmptyValueMapping } from '../shared/selection/useEmptyValueMapping'
import { useFilteredGroups } from '../shared/selection/useFilteredGroups'
import OptionIcon from '../shared/selection/OptionIcon.vue'
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

const { motion: contentMotion, onPointerDown: markPointerDown } =
  usePopoverMotion(open)

const popoverInputRef = ref<{ $el?: HTMLElement } | null>(null)

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

function handleContentOpenAutoFocus(event: Event) {
  event.preventDefault()
  if (props.hideSearch) return

  nextTick(() => {
    const el = popoverInputRef.value?.$el as HTMLElement | undefined
    el?.focus()
  })
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
          attrs.class,
        ]"
        :style="attrs.style as any"
        :disabled="disabled"
        data-slot="trigger"
        :data-state="open ? 'open' : 'closed'"
        :data-variant="variant"
        :data-size="size"
        :data-disabled="disabled ? '' : undefined"
        :id="id"
        aria-haspopup="listbox"
        :aria-expanded="open"
      >
        <!--
          For exactly one selection, reuse `#item-prefix` (or auto-render
          `option.icon`) so the trigger matches the dropdown row without
          a separate prefix slot. For 0 or 2+ selected, show placeholder
          / "N selected" without a prefix.
        -->
        <template v-if="singleSelectedOption && $slots['item-prefix']">
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
            {{ triggerSummary }}
          </span>
          <span
            aria-hidden="true"
            class="multi-select-trigger-sizer col-start-1 row-start-1"
            :data-width-text="triggerSizingText"
          />
        </span>

        <span
          :class="[
            'lucide-chevron-down size-4 shrink-0 text-ink-gray-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]',
            open && 'rotate-180',
          ]"
        />
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
        @openAutoFocus="handleContentOpenAutoFocus"
        @closeAutoFocus.prevent
      >
        <div
          data-slot="content-body"
          :data-motion="contentMotion"
          class="overflow-hidden rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5"
        >
          <div
            v-if="!hideSearch"
            data-slot="search"
            class="flex items-center gap-2 border-b border-outline-gray-1 px-3"
          >
            <ComboboxInput
              ref="popoverInputRef"
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
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
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
