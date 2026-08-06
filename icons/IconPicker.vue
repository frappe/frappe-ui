<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { isLucideIconString } from '../src/utils/iconString'
import { loadLucideIconSet, type LucideIconSet } from './lucideIconSet'

export interface IconPickerProps {
  variant?: 'subtle' | 'outline' | 'ghost'
  /**
   * The picked icon, as a `lucide-*` string — the same form every other
   * icon prop in the library takes. Any other non-empty string (an emoji,
   * say) is shown as-is and handed back unchanged.
   */
  modelValue?: string | null
  placeholder?: string
  disabled?: boolean
  openOnFocus?: boolean
  openOnClick?: boolean
  placement?: 'start' | 'center' | 'end'
  maxIcons?: number
}

const props = withDefaults(defineProps<IconPickerProps>(), {
  variant: 'subtle',
  openOnClick: true,
  openOnFocus: true,
  maxIcons: 100,
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'input'])

const LUCIDE_PREFIX = 'lucide-'

const searchTerm = ref(getLabel(props.modelValue))
const internalModelValue = ref(props.modelValue)
const isOpen = ref(false)
const iconSet = shallowRef<LucideIconSet | null>(null)

watch(
  () => props.modelValue,
  (newValue) => {
    internalModelValue.value = newValue
    searchTerm.value = getLabel(newValue)
    if (isLucideIconString(newValue)) loadIcons()
  },
)

// The grid needs the whole set, and the anchor needs one icon out of it, so
// both paths wait on the same download. Nothing loads for a picker that is
// never opened and starts empty.
watch(isOpen, (open) => {
  if (open) loadIcons()
})

onMounted(() => {
  if (isLucideIconString(props.modelValue)) loadIcons()
})

function loadIcons() {
  if (iconSet.value) return
  loadLucideIconSet().then((set) => (iconSet.value = set))
}

/** `lucide-circle-check` to `circle-check`. Empty for anything else. */
function toIconName(value?: string | null) {
  return isLucideIconString(value) ? value.slice(LUCIDE_PREFIX.length) : ''
}

/**
 * The text the search box shows for a value. Only lucide icons have a name
 * worth reading; a stored emoji is drawn in the anchor instead, so repeating
 * it as text would just say the same thing twice.
 */
function getLabel(value?: string | null) {
  const name = toIconName(value)
  if (!name) return ''
  return name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const iconNames = computed(() => iconSet.value?.names ?? [])

const filteredIcons = computed(() => {
  if (!searchTerm.value) return iconNames.value
  const lowerSearch = searchTerm.value.toLowerCase()
  return iconNames.value.filter((name) =>
    name.replace(/-/g, ' ').toLowerCase().includes(lowerSearch),
  )
})

const visibleIcons = computed(() =>
  filteredIcons.value.slice(0, props.maxIcons),
)

/** SVG markup for the picked icon, once the set has arrived. */
const selectedMarkup = computed(() => {
  const name = toIconName(internalModelValue.value)
  return name ? iconSet.value?.markup[name] : undefined
})

/** A non-lucide value the picker shows but cannot offer in its grid. */
const selectedText = computed(() => {
  const value = internalModelValue.value
  return value && !isLucideIconString(value) ? value : ''
})

const onUpdateModelValue = (value: string | null) => {
  internalModelValue.value = value
  emit('update:modelValue', value)
  searchTerm.value = getLabel(value)
  isOpen.value = false
}

const handleInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchTerm.value = target.value

  if (searchTerm.value === '') {
    internalModelValue.value = null
    emit('update:modelValue', null)
  }
  emit('input', searchTerm.value)
}

const handleOpenChange = (open: boolean) => {
  isOpen.value = open
  if (!open) searchTerm.value = getLabel(internalModelValue.value)
}

const handleClick = () => {
  if (props.openOnClick) isOpen.value = true
}

const handleFocus = (event: FocusEvent) => {
  if (props.openOnFocus) isOpen.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const reset = () => {
  searchTerm.value = ''
  internalModelValue.value = null
  emit('update:modelValue', null)
}

const variantClasses = computed(() => {
  const borderCss =
    'border focus-within:border-outline-gray-4 focus-within:ring-2 focus-within:ring-outline-gray-3'

  return {
    subtle: `${borderCss} bg-surface-gray-2 hover:bg-surface-gray-3 border-transparent`,
    outline: `${borderCss} border-outline-gray-2`,
    ghost: '',
  }[props.variant]
})

defineExpose({
  reset,
})
</script>

<template>
  <div class="relative">
    <ComboboxRoot
      :model-value="internalModelValue"
      @update:modelValue="onUpdateModelValue"
      @update:open="handleOpenChange"
      :ignore-filter="true"
      :open="isOpen"
    >
      <ComboboxAnchor
        class="flex h-7 w-full items-center justify-between gap-2 rounded px-2 py-1 transition-colors"
        :class="{
          'opacity-50 pointer-events-none': disabled,
          [variantClasses]: true,
        }"
        @click="handleClick"
      >
        <div class="flex items-center gap-2 flex-1 overflow-hidden">
          <!-- The picked icon: lucide markup, a stored emoji, or a dashed
               placeholder while nothing is picked. -->
          <span
            v-if="selectedMarkup"
            class="w-4 h-4 flex-shrink-0 [&>svg]:size-full"
            aria-hidden="true"
            v-html="selectedMarkup"
          />
          <span
            v-else-if="selectedText"
            class="w-4 h-4 flex-shrink-0 inline-flex items-center justify-center leading-none"
            aria-hidden="true"
            >{{ selectedText }}</span
          >
          <span
            v-else
            class="w-4 h-4 flex-shrink-0 rounded-full border border-dashed border-outline-gray-3"
            aria-hidden="true"
          />
          <ComboboxInput
            :value="searchTerm"
            @input="handleInputChange"
            @focus="handleFocus"
            @blur="handleBlur"
            class="bg-transparent p-0 focus:outline-0 border-0 focus:border-0 focus:ring-0 text-base text-ink-gray-8 h-full placeholder:text-ink-gray-4 w-full"
            :placeholder="placeholder || 'Select an icon...'"
            :disabled="disabled"
            autocomplete="off"
          />
        </div>
        <ComboboxTrigger :disabled="disabled">
          <!-- Written out rather than used as a `lucide-chevron-down` class:
               apps hand-maintain their Tailwind content globs and several do
               not scan this directory, so the class would emit no CSS. -->
          <svg
            class="h-4 w-4 text-ink-gray-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </ComboboxTrigger>
      </ComboboxAnchor>
      <ComboboxPortal>
        <ComboboxContent
          class="z-10 w-60 mt-1 bg-surface-elevation-2 overflow-hidden rounded-lg shadow-2xl"
          position="popper"
          @openAutoFocus.prevent
          @closeAutoFocus.prevent
          :align="props.placement || 'start'"
        >
          <ComboboxViewport class="max-h-60 overflow-auto p-2">
            <ComboboxEmpty
              v-if="visibleIcons.length === 0"
              class="text-ink-gray-5 text-base text-center py-1.5 px-2.5"
            >
              <template v-if="!iconSet">Loading icons...</template>
              <template v-else-if="searchTerm">
                No icons found for "{{ searchTerm }}"
              </template>
              <template v-else>No icons available.</template>
            </ComboboxEmpty>
            <div v-else class="flex flex-wrap">
              <ComboboxItem
                v-for="name in visibleIcons"
                :key="name"
                :value="`${LUCIDE_PREFIX}${name}`"
                :text-value="name"
                class="w-8 h-8 flex items-center justify-center rounded cursor-pointer data-[highlighted]:bg-surface-gray-3 hover:bg-surface-gray-3 transition-colors"
                :class="{
                  'bg-surface-gray-3':
                    internalModelValue === `${LUCIDE_PREFIX}${name}`,
                }"
                :aria-label="getLabel(`${LUCIDE_PREFIX}${name}`)"
                :title="getLabel(`${LUCIDE_PREFIX}${name}`)"
              >
                <span
                  class="w-4 h-4 [&>svg]:size-full"
                  aria-hidden="true"
                  v-html="iconSet?.markup[name]"
                />
              </ComboboxItem>
            </div>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </div>
</template>
