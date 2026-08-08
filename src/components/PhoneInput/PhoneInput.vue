<template>
  <div class="space-y-1.5">
    <InputLabel
      v-if="label"
      :label="label"
      :required="required"
    />
    <div
      class="relative flex items-center transition-colors border"
      :class="[
        containerClasses,
        {
          'h-7 text-base': size === 'sm',
          'h-8 text-base': size === 'md' || !size,
          'h-10 text-lg': size === 'lg',
          'h-10 text-2xl': size === 'xl',
          'opacity-50 pointer-events-none': disabled || isLoading
        }
      ]"
    >
      <Popover placement="bottom-start" class="shrink-0 flex items-center h-full">
        <template #target="{ togglePopover }">
          <button
            type="button"
            class="flex items-center gap-1.5 pl-2.5 pr-1 focus:outline-none select-none shrink-0 cursor-pointer text-ink-gray-8 hover:text-ink-gray-9 h-full"
            :disabled="disabled || isLoading"
            @click="togglePopover"
          >
            <img
              v-if="currentCountry?.code"
              :src="`https://flagcdn.com/${currentCountry.code.toLowerCase()}.svg`"
              :alt="currentCountry.name"
              class="w-4 h-3 object-cover rounded-[2px] shrink-0"
            />
            <span v-else class="text-xs shrink-0">🌐</span>
            <span class="font-normal whitespace-nowrap text-ink-gray-8 leading-normal flex items-center">
              {{ currentCountry?.dialCode }}
            </span>
          </button>
        </template>
        <template #body="{ close }">
          <div class="p-2 w-64 max-h-64 flex flex-col bg-surface-base rounded-lg shadow-xl border border-outline-gray-2 text-sm z-50">
            <div class="mb-2 shrink-0">
              <TextInput
                v-model="searchQuery"
                type="search"
                placeholder="Search for countries..."
                size="sm"
                variant="subtle"
                class="w-full"
              >
                <template #prefix>
                  <FeatherIcon name="search" class="w-3.5 h-3.5 text-ink-gray-4" />
                </template>
              </TextInput>
            </div>
            <div class="overflow-y-auto space-y-0.5 max-h-48 pr-1">
              <div
                v-for="country in filteredCountries"
                :key="country.code"
                class="flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors"
                :class="[
                  currentCountry?.code === country.code
                    ? 'bg-surface-gray-3 font-semibold text-ink-gray-9'
                    : 'hover:bg-surface-gray-2 text-ink-gray-7'
                ]"
                @click="selectCountry(country, close)"
              >
                <div class="flex items-center gap-2 truncate">
                  <img
                    v-if="country.code"
                    :src="`https://flagcdn.com/${country.code.toLowerCase()}.svg`"
                    :alt="country.name"
                    class="w-4 h-3 object-cover rounded-[2px] shrink-0"
                  />
                  <span v-else class="shrink-0 text-xs">🌐</span>
                  <span class="truncate text-xs">{{ country.name }}</span>
                </div>
                <span class="text-xs text-ink-gray-5 font-mono shrink-0">({{ country.dialCode }})</span>
              </div>
              <div v-if="filteredCountries.length === 0" class="py-3 text-center text-xs text-ink-gray-4">
                No countries found
              </div>
            </div>
          </div>
        </template>
      </Popover>

      <input
        :value="phoneNumber"
        type="tel"
        :placeholder="placeholder || 'Enter phone number'"
        :disabled="disabled || isLoading"
        :minlength="minlength"
        :maxlength="maxlength"
        :required="required"
        class="flex-1 min-w-0 h-full pr-2.5 pl-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-ink-gray-9 placeholder-ink-gray-4 leading-normal"
        @input="handleInput"
      />
    </div>
    <InputDescription v-if="description" :description="description" />
    <InputError v-if="hasError" :id="errorMessageId" :lines="errorLines" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import TextInput from '../TextInput/TextInput.vue'
import Popover from '../Popover/Popover.vue'
import FeatherIcon from '../FeatherIcon.vue'
import InputLabel from '../InputLabeling/InputLabel.vue'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import { useInputLabeling } from '../../composables/useInputLabeling'
import type { PhoneInputProps, CountryCode } from './types'
import { defaultCountries } from './utils'

const props = withDefaults(defineProps<PhoneInputProps>(), {
  modelValue: '',
  default_country: 'in',
  variant: 'subtle',
  size: 'sm'
})

const emit = defineEmits(['update:modelValue', 'change', 'country-change'])

const {
  errorMessageId,
  hasError,
  errorLines,
} = useInputLabeling(props, {
  size: () => props.size,
  variant: () => props.variant,
  disabled: () => props.disabled,
})

const containerClasses = computed(() => {
  if (props.disabled) {
    return [
      'rounded border bg-surface-gray-1 text-ink-gray-5',
      props.variant === 'outline' ? 'border-outline-gray-2' : 'border-transparent',
    ]
  }
  if (props.variant === 'outline') {
    return 'rounded border border-outline-gray-2 bg-surface-base hover:border-outline-gray-3 hover:shadow-sm focus-within:bg-surface-base focus-within:border-outline-gray-4 focus-within:shadow-sm'
  }
  return 'rounded border border-[--surface-gray-2] bg-surface-gray-2 hover:border-outline-elevation-2 hover:bg-surface-gray-3 focus-within:bg-surface-base focus-within:border-outline-gray-4 focus-within:shadow-sm'
})

const countriesList = ref<CountryCode[]>(defaultCountries)
const fetchingCountries = ref(false)
const isLoading = computed(() => Boolean(props.loading || fetchingCountries.value))

const searchQuery = ref('')
const currentCountry = ref<CountryCode | null>(null)
const phoneNumber = ref('')

const filteredCountries = computed(() => {
  if (!searchQuery.value) return countriesList.value
  const q = searchQuery.value.toLowerCase()
  return countriesList.value.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.code.toLowerCase().includes(q)
  )
})

function setDefaultCountry() {
  const targetCountry = props.default_country || 'in'
  currentCountry.value =
    countriesList.value.find(
      (c) =>
        c.code.toLowerCase() === targetCountry.toLowerCase() ||
        c.name.toLowerCase() === targetCountry.toLowerCase()
    ) || countriesList.value[0] || null
}

function parseAndSetModelValue(val?: string) {
  if (!val) {
    phoneNumber.value = ''
    if (!currentCountry.value) {
      setDefaultCountry()
    }
    return
  }

  let dial = ''
  let num = val

  if (val.includes('-')) {
    const parts = val.split('-')
    dial = parts[0].trim()
    num = parts.slice(1).join('-').trim()
  } else if (val.startsWith('+')) {
    const sorted = [...countriesList.value].sort((a, b) => b.dialCode.length - a.dialCode.length)
    const matched = sorted.find((c) => val.startsWith(c.dialCode))
    if (matched) {
      dial = matched.dialCode
      num = val.slice(matched.dialCode.length).trim()
    }
  }

  if (dial) {
    const found = countriesList.value.find(
      (c) => c.dialCode.toLowerCase() === dial.toLowerCase() || c.code.toLowerCase() === dial.toLowerCase()
    )
    if (found) {
      currentCountry.value = found
    }
  }

  phoneNumber.value = num.replace(/[^0-9\s-]/g, '')
}

watch(
  () => props.modelValue,
  (newVal) => {
    const currentFullValue = `${currentCountry.value?.dialCode || ''}-${phoneNumber.value}`
    if (newVal && newVal !== currentFullValue) {
      parseAndSetModelValue(newVal)
    }
  },
  { immediate: true }
)

watch(
  () => props.countries,
  (newCountries) => {
    if (newCountries?.length) {
      countriesList.value = newCountries
      setDefaultCountry()
      parseAndSetModelValue(props.modelValue)
    }
  }
)

onMounted(async () => {

  if (!currentCountry.value) {
    setDefaultCountry()
  }

  if (props.countries?.length) {
    countriesList.value = props.countries
    setDefaultCountry()
  } else if (props.fetchCountries) {
    fetchingCountries.value = true
    try {
      const res = await props.fetchCountries()
      if (res?.length) {
        countriesList.value = res
        setDefaultCountry()
      }
    } finally {
      fetchingCountries.value = false
    }
  }

  parseAndSetModelValue(props.modelValue)
})

function selectCountry(country: CountryCode, closePopover?: () => void) {
  currentCountry.value = country
  emit('country-change', country)
  emitValue()
  closePopover?.()
}

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  phoneNumber.value = target.value.replace(/[^0-9\s-]/g, '')
  emitValue()
}

function emitValue() {
  const fullValue = `${currentCountry.value?.dialCode || ''}-${phoneNumber.value}`
  emit('update:modelValue', fullValue)
  emit('change', fullValue)
}
</script>