<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { usePopoverMotion } from '../../composables/usePopoverMotion'
import { useEmptyValueMapping } from '../shared/selection/useEmptyValueMapping'
import type {
  SelectNormalizedOption,
  SelectOption,
  SelectOptionValue,
  SelectProps,
  SelectSlots,
} from './types'
import ItemListRow from '../ItemListRow/ItemListRow.vue'
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
import '../shared/selection/popoverMotion.css'
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

const formAttrKeys = ['name', 'required', 'autocomplete'] as const

const { motion: contentMotion, onPointerDown: markPointerDown } =
  usePopoverMotion(open)

const rootAttrs = computed(() => {
  return Object.fromEntries(
    formAttrKeys.filter((key) => key in attrs).map((key) => [key, attrs[key]]),
  )
})

const triggerAttrs = computed(() => {
  const {
    class: _class,
    style: _style,
    name: _name,
    required: _required,
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

const displayValue = computed(() => {
  return selectedOption.value?.label || ''
})

const selectSizingText = computed(() => {
  return [
    props.placeholder,
    ...selectOptions.value.map((option) => option.label),
  ].join('\n')
})

function getOptionSlotName(option: SelectNormalizedOption) {
  return option.slot ? `item-${option.slot}` : undefined
}

function getOptionKey(option: SelectNormalizedOption, index: number) {
  return `${index}:${typeof option.value}:${String(option.value)}`
}

defineSlots<SelectSlots>()
</script>

<template>
  <SelectRoot v-model="internalModel" v-model:open="open" v-bind="rootAttrs">
    <SelectTrigger
      :id="id"
      data-slot="trigger"
      v-bind="triggerAttrs"
      :class="[triggerClasses, attrs.class]"
      :style="attrs.style"
      :disabled="disabled"
      @pointerdown="markPointerDown"
    >
      <template v-if="$slots.trigger">
        <slot
          name="trigger"
          v-bind="{ open, disabled: !!disabled, selectedOption, displayValue }"
        />
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
          >
            <template v-if="selectedOption">{{
              selectedOption.label
            }}</template>
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
          <slot name="item-prefix" v-bind="{ option: selectedOption }" />
        </template>
        <OptionIcon
          v-else-if="selectedOption?.icon"
          :icon="selectedOption.icon"
        />
        <slot v-else name="prefix" />

        <div class="grid min-w-0 text-left">
          <SelectValue
            :placeholder="placeholder"
            class="col-start-1 row-start-1 max-w-full truncate"
          >
            <template v-if="selectedOption">{{
              selectedOption.label
            }}</template>
          </SelectValue>
          <span
            aria-hidden="true"
            class="select-trigger-sizer col-start-1 row-start-1"
            :data-width-text="selectSizingText"
          />
        </div>

        <slot name="suffix">
          <span class="lucide-chevron-down ml-auto size-4 shrink-0 text-ink-gray-4" />
        </slot>
      </template>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        data-slot="content"
        class="z-[100] origin-[var(--reka-select-content-transform-origin)]"
      >
        <div
          data-slot="content-body"
          :data-motion="contentMotion"
          class="overflow-hidden rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 will-change-[opacity,transform] origin-[var(--reka-select-content-transform-origin)]"
        >
          <SelectViewport class="flex flex-col p-1">
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
                      v-bind="{ option: internalOption.option }"
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
                        v-bind="{ option: internalOption.option }"
                      />
                      <slot
                        v-else
                        name="item-label"
                        v-bind="{ option: internalOption.option }"
                      >
                        <slot
                          name="option"
                          v-bind="{ option: internalOption.option }"
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
                      v-bind="{ option: internalOption.option }"
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

            <div v-if="$slots.footer" data-slot="footer">
              <slot name="footer" />
            </div>
          </SelectViewport>
        </div>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style scoped>
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
