<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { useInputLabeling } from '../../composables/useInputLabeling'
import { useEmptyValueMapping } from '../shared/selection/useEmptyValueMapping'
import type {
  SelectNormalizedOption,
  SelectOption,
  SelectOptionValue,
  SelectProps,
  SelectSlots,
  SelectTriggerSlotProps,
} from './types'
import ItemListRow from '../ItemListRow/ItemListRow.vue'
import {
  InputDescription,
  InputError,
  InputLabel,
  LabelingWrapper,
} from '../InputLabeling'
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import OptionIcon from '../shared/selection/OptionIcon.vue'
import PopoverPanel from '../shared/popover/PopoverPanel.vue'
import {
  EMPTY_VALUE_PREFIX,
  inputFontSizeClasses,
  itemRootSizeClasses,
  toItemListSize,
  triggerBaseClasses,
  triggerContentPaddingClasses,
  triggerSizeClasses,
  triggerVariantClasses,
} from './utils'

defineOptions({
  inheritAttrs: false,
})

const model = defineModel<SelectOptionValue | undefined>()
const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(defineProps<SelectProps>(), {
  size: 'sm',
  variant: 'subtle',
  placeholder: 'Select option',
  options: () => [],
  emptyText: 'No options',
})

const attrs = useAttrs()
const slots = useSlots()

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

const formAttrKeys = ['name', 'autocomplete'] as const

const rootAttrs = computed(() => {
  const out: Record<string, unknown> = Object.fromEntries(
    formAttrKeys.filter((key) => key in attrs).map((key) => [key, attrs[key]]),
  )
  if (props.required) out.required = true
  return out
})

const triggerAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    name: _name,
    autocomplete: _autocomplete,
    ...rest
  } = attrs

  return rest
})

const itemSize = computed(() => toItemListSize(props.size))

const itemRootClasses = computed(() => itemRootSizeClasses(props.size))

const triggerContentPadding = computed(() =>
  triggerContentPaddingClasses(props.size),
)

const triggerClasses = computed(() => [
  triggerBaseClasses,
  triggerSizeClasses(props.size),
  inputFontSizeClasses(props.size),
  triggerVariantClasses(props.variant, Boolean(props.disabled)),
])

function normalizeOption(option: SelectOption): SelectNormalizedOption | null {
  if (!option) return null

  const normalized =
    typeof option === 'string' ? { label: option, value: option } : option

  if (normalized.value === undefined || normalized.value === null) {
    return null
  }

  return normalized
}

const selectOptions = computed(() => {
  return (props.options || [])
    .map(normalizeOption)
    .filter((option): option is SelectNormalizedOption => Boolean(option))
})

const { toInternal, toExternal } = useEmptyValueMapping(
  selectOptions,
  EMPTY_VALUE_PREFIX,
)

const internalOptions = computed(() =>
  selectOptions.value.map((option) => ({
    option,
    internalValue: toInternal(option),
  })),
)

function toInternalValue(value: SelectOptionValue | undefined) {
  if (value !== '') return value
  const empty = selectOptions.value.find((option) => option.value === '')
  return empty ? toInternal(empty) : value
}

function toExternalValue(value: SelectOptionValue | undefined) {
  return toExternal(value)
}

const internalModel = computed<SelectOptionValue | undefined>({
  get: () => toInternalValue(model.value),
  set: (value) => {
    model.value = toExternalValue(value)
  },
})

const selectedOption = computed(() => {
  return (
    selectOptions.value.find((option) => option.value === model.value) ?? null
  )
})

function clearSelection() {
  model.value = undefined
}

// Shared shape for the #trigger, #prefix, and #suffix slots. `clearSelection`
// is exposed alongside the read-only fields so consumers can wire a clear
// affordance without managing the model themselves.
const triggerSlotProps = computed<SelectTriggerSlotProps>(() => ({
  open: open.value,
  disabled: Boolean(props.disabled),
  selectedOption: selectedOption.value,
  displayValue: displayValue.value,
  clearSelection,
}))

function isBlank(value: unknown) {
  return value === '' || value === null || value === undefined
}

const showPlaceholderForSelected = computed(() => {
  if (!selectedOption.value) return false
  return (
    isBlank(selectedOption.value.value) && isBlank(selectedOption.value.label)
  )
})

const displayValue = computed(() => {
  if (showPlaceholderForSelected.value) return props.placeholder
  return selectedOption.value?.label || ''
})

// Text the hidden sizer reserves trigger width for: the current value (or
// placeholder when unselected). The trigger hugs the selection, so the
// item-aligned dropdown — anchored over the trigger — expands outward to fit
// longer options (Linear-style). Trigger width shifts as the value changes.
const selectSizingText = computed(() => displayValue.value || props.placeholder)

function getOptionSlotName(option: SelectNormalizedOption) {
  return option.slot ? `item-${option.slot}` : undefined
}

function getOptionKey(option: SelectNormalizedOption, index: number) {
  return `${index}:${typeof option.value}:${String(option.value)}`
}

defineSlots<SelectSlots>()
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
    <SelectRoot v-model="internalModel" v-model:open="open" v-bind="rootAttrs">
      <SelectTrigger
        :id="inputId"
        data-slot="trigger"
        v-bind="triggerAttrs"
        :class="[
          triggerClasses,
          hasLabeling ? 'w-full' : null,
          hasLabeling ? null : (attrs.class as any),
        ]"
        :style="hasLabeling ? null : (attrs.style as any)"
        :disabled="disabled"
        :aria-invalid="hasError || undefined"
        :aria-errormessage="hasError ? errorMessageId : undefined"
        :aria-describedby="describedBy"
        :aria-required="required || undefined"
        :data-invalid="hasError ? 'true' : undefined"
        :data-required="required ? 'true' : undefined"
      >
        <template v-if="$slots.trigger">
          <slot name="trigger" v-bind="triggerSlotProps" />
          <div
            data-slot="trigger-value"
            :class="[
              'pointer-events-none absolute inset-0 flex items-center overflow-hidden',
              triggerContentPadding,
            ]"
            aria-hidden="true"
          >
            <SelectValue
              :placeholder="placeholder"
              class="max-w-full truncate opacity-0"
              :class="{ 'text-ink-gray-4': showPlaceholderForSelected }"
            >
              <template v-if="selectedOption">
                {{
                  showPlaceholderForSelected
                    ? placeholder
                    : selectedOption.label
                }}
              </template>
            </SelectValue>
          </div>
        </template>
        <template v-else>
          <!--
          Prefix precedence on the trigger:
            1. selected + `#item-prefix` slot → reuse the list's per-item
               prefix renderer so the trigger matches the dropdown row
               without a second slot definition.
            2. selected + `option.icon` → auto-render the icon (lucide
               string / emoji / component).
            3. not selected + `#prefix` slot → user's placeholder affordance.
        -->
          <template v-if="selectedOption && slots['item-prefix']">
            <slot
              name="item-prefix"
              v-bind="{ item: selectedOption, option: selectedOption }"
            />
          </template>
          <OptionIcon
            v-else-if="selectedOption?.icon"
            :icon="selectedOption.icon"
          />
          <slot v-else name="prefix" v-bind="triggerSlotProps" />

          <div class="grid min-w-0 text-left truncate">
            <SelectValue
              :placeholder="placeholder"
              class="col-start-1 row-start-1 max-w-full truncate"
              :class="{ 'text-ink-gray-4': showPlaceholderForSelected }"
            >
              <template v-if="selectedOption">
                {{
                  showPlaceholderForSelected
                    ? placeholder
                    : selectedOption.label
                }}
              </template>
            </SelectValue>
            <span
              aria-hidden="true"
              class="select-trigger-sizer col-start-1 row-start-1"
              :data-width-text="selectSizingText"
            />
          </div>

          <slot name="suffix" v-bind="triggerSlotProps">
            <span
              class="lucide-chevron-down ml-auto size-4 shrink-0 text-ink-gray-4"
            />
          </slot>
        </template>
      </SelectTrigger>

      <SelectPortal>
        <SelectContent
          data-slot="content"
          class="z-[100] origin-[var(--reka-select-content-transform-origin)]"
        >
          <!--
          `instant` (no scale-from-trigger enter, no exit) rather than the
          animated rhythm: the menu is anchored item-aligned *over* the
          trigger, so a scale/translate entrance reads as a glitch. The ~80ms
          opacity fade `instant` keeps masks reka's 1-frame position-settle.
        -->
          <PopoverPanel
            motion="instant"
            class="flex flex-col origin-[var(--reka-select-content-transform-origin)]"
          >
            <SelectViewport class="flex min-h-0 flex-col p-1">
              <div
                v-if="!selectOptions.length"
                data-slot="empty"
                class="px-2 py-1.5 text-base text-ink-gray-5"
              >
                <slot name="empty">{{ emptyText }}</slot>
              </div>

              <template v-else>
                <SelectItem
                  v-for="(internalOption, index) in internalOptions"
                  :key="getOptionKey(internalOption.option, index)"
                  :disabled="internalOption.option.disabled"
                  :value="internalOption.internalValue"
                  data-slot="item"
                  :class="itemRootClasses"
                  class="select-none rounded border-0 text-base text-ink-gray-9 data-[disabled]:text-ink-gray-4 data-[highlighted]:bg-surface-gray-2 data-[state=checked]:bg-surface-gray-3 data-[highlighted]:data-[state=checked]:bg-surface-gray-4"
                >
                  <ItemListRow
                    :size="itemSize"
                    :selected="internalOption.option.value === model"
                    :disabled="internalOption.option.disabled"
                  >
                    <template #prefix>
                      <!--
                      v-if chain (not unconditional slot + v-if icon) so that
                      with neither a consumer `#item-prefix` slot nor an
                      `option.icon`, the prefix template renders only
                      comment vnodes. Otherwise the unconditional `<slot>` /
                      `<OptionIcon>` leaves a real vnode in the tree,
                      `hasRenderableContent` returns true, and ItemListRow
                      paints an empty prefix container — visible as a
                      stray left gap from the parent's `gap-2`.

                      Auto-render `option.icon` when the consumer doesn't
                      provide `#item-prefix`. `lucide-*` strings route
                      through the Tailwind plugin; component values render
                      directly.
                    -->
                      <slot
                        v-if="slots['item-prefix']"
                        name="item-prefix"
                        v-bind="{
                          item: internalOption.option,
                          option: internalOption.option,
                        }"
                      />
                      <OptionIcon
                        v-else-if="internalOption.option.icon"
                        :icon="internalOption.option.icon"
                      />
                    </template>

                    <template #label>
                      <!--
                      SelectItemText must wrap the visible label so reka's
                      item-aligned positioning uses the on-screen label rect.
                      Previously rendered as `sr-only`, which gave a 1x1 rect
                      and mis-anchored the popup (prefix not covered).
                    -->
                      <SelectItemText as="div" class="min-w-0">
                        <slot
                          v-if="
                            getOptionSlotName(internalOption.option) &&
                            slots[getOptionSlotName(internalOption.option)!]
                          "
                          :name="getOptionSlotName(internalOption.option)!"
                          v-bind="{
                            item: internalOption.option,
                            option: internalOption.option,
                          }"
                        />
                        <slot
                          v-else
                          name="item-label"
                          v-bind="{
                            item: internalOption.option,
                            option: internalOption.option,
                          }"
                        >
                          <slot
                            name="option"
                            v-bind="{
                              item: internalOption.option,
                              option: internalOption.option,
                            }"
                          >
                            <div class="truncate">
                              {{ internalOption.option.label }}
                            </div>
                            <div
                              v-if="internalOption.option.description"
                              class="truncate text-p-sm text-ink-gray-5"
                            >
                              {{ internalOption.option.description }}
                            </div>
                          </slot>
                        </slot>
                      </SelectItemText>
                    </template>

                    <template #suffix>
                      <slot
                        name="item-suffix"
                        v-bind="{
                          item: internalOption.option,
                          option: internalOption.option,
                        }"
                      />
                      <SelectItemIndicator
                        class="ml-1 inline-flex items-center justify-center"
                      >
                        <span class="lucide-check size-4 text-ink-gray-6" />
                      </SelectItemIndicator>
                    </template>
                  </ItemListRow>
                </SelectItem>
              </template>
            </SelectViewport>

            <div v-if="$slots.footer" data-slot="footer">
              <slot name="footer" v-bind="{ selectedOption, clearSelection }" />
            </div>
          </PopoverPanel>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
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
/*
 * Block interaction with the content while it plays its exit animation.
 * PopoverPanel's motion CSS owns the animation; this pointer-events guard
 * lived on the old `[data-selection]` content element and is preserved here.
 */
[data-slot='content'][data-state='closed'] {
  pointer-events: none;
}

[data-highlighted],
[data-state='checked'] {
  outline: none !important;
}

/*
 * The outer item row paints its own bg via data-[highlighted] /
 * data-[state=checked] utilities — including the combined hover+selected
 * state. Clear ItemListRow's own bg so the outer color always shows
 * through; text emphasis on selected stays.
 */
[data-slot='item'] [data-slot='item-list-row'] {
  background-color: transparent;
}

.select-trigger-sizer::after {
  content: attr(data-width-text);
  display: block;
  height: 0;
  overflow: hidden;
  white-space: pre;
  visibility: hidden;
}
</style>
