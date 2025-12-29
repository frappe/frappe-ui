<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
import { computed, onMounted, ref, watch } from 'vue'
import Icon from './Icon.vue'

export interface IconPickerProps {
  variant?: 'subtle' | 'outline' | 'ghost'
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

const searchTerm = ref(getLabel(props.modelValue || ''))
const internalModelValue = ref(props.modelValue)
const isOpen = ref(false)
const iconNames = ref<string[]>([])

watch(
  () => props.modelValue,
  (newValue) => {
    internalModelValue.value = newValue
    searchTerm.value = newValue ? getLabel(newValue) : ''
  },
)

onMounted(() => {
  const spriteContainer = document.getElementById('lucide-sprite')
  if (!spriteContainer) {
    console.warn('Lucide sprite not found! Make sure to use the spritePlugin.')
    return
  }

  const symbols = spriteContainer.getElementsByTagName('symbol')
  const names: string[] = []
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i]
    names.push(symbol.id)
  }
  iconNames.value = names
})

function getLabel(name: string) {
  return name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const filteredIcons = computed(() => {
  if (!searchTerm.value) return iconNames.value
  const lowerSearch = searchTerm.value.toLowerCase()
  return iconNames.value.filter((name) =>
    name.replace(/-/g, ' ').toLowerCase().includes(lowerSearch),
  )
})

const onUpdateModelValue = (value: string | null) => {
  internalModelValue.value = value
  emit('update:modelValue', value)
  searchTerm.value = value ? getLabel(value) : ''
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
  if (!open) {
    searchTerm.value = internalModelValue.value
      ? getLabel(internalModelValue.value)
      : ''
  }
}

const handleClick = (event: MouseEvent) => {
  if (props.openOnClick) {
    isOpen.value = true
  }
}

const handleFocus = (event: FocusEvent) => {
  if (props.openOnFocus) {
    isOpen.value = true
  }
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleIconClick = (iconName: string) => {
  onUpdateModelValue(iconName)
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
          <Icon
            :name="internalModelValue || 'circle-dashed'"
            class="w-4 h-4 flex-shrink-0"
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
          <Icon name="chevron-down" class="h-4 w-4 text-ink-gray-5" />
        </ComboboxTrigger>
      </ComboboxAnchor>
      <ComboboxPortal>
        <ComboboxContent
          class="z-10 w-[--reka-combobox-trigger-width] mt-1 bg-surface-modal overflow-hidden rounded-lg shadow-2xl"
          position="popper"
          @openAutoFocus.prevent
          @closeAutoFocus.prevent
          :align="props.placement || 'start'"
        >
          <ComboboxViewport class="max-h-60 overflow-auto p-2">
            <ComboboxEmpty
              v-if="filteredIcons.length === 0"
              class="text-ink-gray-5 text-base text-center py-1.5 px-2.5"
            >
              <template v-if="searchTerm">
                No icons found for "{{ searchTerm }}"
              </template>
              <template v-else> No icons available. </template>
            </ComboboxEmpty>
            <div v-if="filteredIcons.length > 0" class="flex flex-wrap gap-1">
              <button
                v-for="iconName in filteredIcons.slice(0, props.maxIcons)"
                :key="iconName"
                @click="handleIconClick(iconName)"
                type="button"
                class="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-gray-3 transition-colors"
                :class="{
                  'bg-surface-gray-3': internalModelValue === iconName,
                }"
                :title="getLabel(iconName)"
              >
                <Icon :name="iconName" class="w-4 h-4" />
              </button>
            </div>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </div>
</template>
