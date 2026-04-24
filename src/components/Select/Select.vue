<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { usePopoverMotion } from '../../composables/usePopoverMotion'
import type {
  SelectNormalizedOption,
  SelectOption,
  SelectOptionValue,
  SelectProps,
  SelectSlots,
} from './types'
import type { ItemListSize } from '../ItemList'
import LucideCheck from '~icons/lucide/check'
import LucideChevronDown from '~icons/lucide/chevron-down'
import ItemListRow from '../ItemList/ItemListRow.vue'
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
import {
  isEmojiIconString,
  isLucideIconString,
} from '../../utils/iconString'

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
const emptyValuePrefix = '__frappe_ui_select_empty__'

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

const triggerSizeClasses = computed(() => {
  return {
    sm: 'min-h-7 rounded px-2',
    md: 'min-h-8 rounded px-2.5',
    lg: 'min-h-10 rounded-md px-3',
    xl: 'min-h-10 rounded-md px-3',
  }[props.size]
})

const triggerFontSizeClasses = computed(() => {
  return {
    sm: 'text-base',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }[props.size]
})

const triggerContentPaddingClasses = computed(() => {
  return {
    sm: 'px-2',
    md: 'px-2.5',
    lg: 'px-3',
    xl: 'px-3',
  }[props.size]
})

const itemSize = computed<ItemListSize>(() => props.size)

const itemRootSizeClasses = computed(() => {
  return {
    sm: 'min-h-7',
    md: 'min-h-8',
    lg: 'min-h-10',
    xl: 'min-h-10',
  }[props.size]
})

const triggerClasses = computed(() => {
  const variant = props.disabled ? 'disabled' : props.variant
  const variantClasses = {
    subtle:
      'border border-[--surface-gray-2] bg-surface-gray-2 hover:border-outline-gray-modals hover:bg-surface-gray-3',
    outline:
      'border border-outline-gray-2 bg-surface-white hover:border-outline-gray-3',
    ghost:
      'border border-transparent bg-transparent hover:bg-surface-gray-3 focus:bg-surface-gray-3',
    disabled: [
      'cursor-not-allowed border',
      props.variant !== 'ghost' ? 'bg-surface-gray-1' : '',
      props.variant === 'outline'
        ? 'border-outline-gray-2'
        : 'border-transparent',
    ].join(' '),
  }[variant]

  return [
    'relative inline-flex items-center gap-2 text-left outline-none transition-[background-color,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-2 data-[state=open]:ring-2 ring-outline-gray-3 text-ink-gray-7 data-[placeholder]:text-ink-gray-4 data-[disabled]:text-ink-gray-4',
    triggerSizeClasses.value,
    triggerFontSizeClasses.value,
    variantClasses,
  ]
})

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

const internalOptions = computed(() => {
  return selectOptions.value.map((option, index) => ({
    option,
    internalValue:
      option.value === '' ? `${emptyValuePrefix}${index}` : option.value,
  }))
})

function toInternalValue(value: SelectOptionValue | undefined) {
  if (value !== '') return value

  return (
    internalOptions.value.find((option) => option.option.value === '')
      ?.internalValue ?? value
  )
}

function toExternalValue(value: SelectOptionValue | undefined) {
  return (
    internalOptions.value.find((option) => option.internalValue === value)
      ?.option.value ?? value
  )
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
            triggerContentPaddingClasses,
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
        <template v-else-if="selectedOption?.icon">
          <span
            v-if="isLucideIconString(selectedOption.icon)"
            :class="[selectedOption.icon, 'size-4 shrink-0 text-ink-gray-6']"
            aria-hidden="true"
          />
          <span
            v-else-if="isEmojiIconString(selectedOption.icon)"
            class="inline-flex size-4 shrink-0 items-center justify-center text-base leading-none"
            aria-hidden="true"
            >{{ selectedOption.icon }}</span
          >
          <component
            v-else-if="typeof selectedOption.icon !== 'string'"
            :is="selectedOption.icon"
            class="size-4 shrink-0 text-ink-gray-6"
          />
        </template>
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
          <LucideChevronDown class="ml-auto size-4 shrink-0 text-ink-gray-4" />
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
                :class="itemRootSizeClasses"
                class="select-none rounded border-0 text-base text-ink-gray-9 data-[disabled]:text-ink-gray-4 data-[highlighted]:bg-surface-gray-2 data-[state=checked]:bg-surface-gray-3 data-[highlighted]:data-[state=checked]:bg-surface-gray-4"
              >
                <ItemListRow
                  :size="itemSize"
                  :selected="internalOption.option.value === model"
                  :disabled="internalOption.option.disabled"
                >
                  <template #prefix>
                    <slot
                      name="item-prefix"
                      v-bind="{ option: internalOption.option }"
                    />
                    <!--
                      Auto-render `option.icon` when the consumer doesn't
                      provide an `#item-prefix`. `lucide-*` strings route
                      through the Tailwind plugin; component values render
                      directly.
                    -->
                    <template v-if="!slots['item-prefix']">
                      <span
                        v-if="isLucideIconString(internalOption.option.icon)"
                        :class="[
                          internalOption.option.icon,
                          'size-4 shrink-0 text-ink-gray-6',
                        ]"
                        aria-hidden="true"
                      />
                      <span
                        v-else-if="isEmojiIconString(internalOption.option.icon)"
                        class="inline-flex size-4 shrink-0 items-center justify-center text-base leading-none"
                        aria-hidden="true"
                        >{{ internalOption.option.icon }}</span
                      >
                      <component
                        v-else-if="
                          internalOption.option.icon &&
                          typeof internalOption.option.icon !== 'string'
                        "
                        :is="internalOption.option.icon"
                        class="size-4 shrink-0 text-ink-gray-6"
                      />
                    </template>
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
                      <LucideCheck class="size-4" />
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

[data-slot='content-body'] {
  animation-fill-mode: both;
}

[data-slot='content-body'][data-motion='animated'] {
  backface-visibility: hidden;
}

[data-slot='content'][data-state='open']
  [data-slot='content-body'][data-motion='animated'] {
  animation: select-content-enter 180ms cubic-bezier(0.23, 1, 0.32, 1);
}

[data-slot='content'][data-state='closed']
  [data-slot='content-body'][data-motion='animated'] {
  animation: select-content-exit 140ms cubic-bezier(0.23, 1, 0.32, 1);
}

/*
 * Keyboard opens skip the scale + translate entrance, but a tiny opacity
 * fade still runs — it masks the 1-frame position-settle reka performs
 * after mount. ~80ms is below the perception threshold for motion but
 * long enough to hide the jump.
 */
[data-slot='content'][data-state='open']
  [data-slot='content-body'][data-motion='instant'] {
  animation: select-content-instant-fade 80ms linear;
}

[data-slot='content'][data-state='closed']
  [data-slot='content-body'][data-motion='instant'] {
  animation: none;
}

[data-slot='content'][data-state='closed'] {
  pointer-events: none;
}

@keyframes select-content-instant-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes select-content-enter {
  from {
    opacity: 0;
    transform: translateY(2px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes select-content-exit {
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
}
</style>
