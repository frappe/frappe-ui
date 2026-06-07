<template>
  <LabelingWrapper
    :enabled="hasLabeling"
    :wrapper-class="['space-y-1.5', attrs.class]"
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

    <div
      data-slot="phone-input"
      v-bind="dataAttrs"
      :class="[inputClasses, hasLabeling ? null : (attrs.class as any)]"
      :style="hasLabeling ? null : (attrs.style as any)"
    >
      <!-- Selector -->
      <Combobox
        v-model="countryCode"
        :options="countryOptions"
        :disabled="disabled"
        :size="size"
        placeholder="Search country"
        empty-text="No country found"
      >
        <template #trigger="{ open }">
          <button
            type="button"
            data-slot="country"
            :data-state="open ? 'open' : 'closed'"
            class="flex min-w-[50px] items-center justify-center gap-1 self-stretch rounded-l px-2 focus:outline-none"
            :class="disabled && 'cursor-not-allowed'"
            :disabled="disabled"
            :aria-label="
              phoneDetails.country
                ? `Country: ${phoneDetails.country.name}`
                : 'Select country'
            "
            aria-haspopup="listbox"
            :aria-expanded="open"
          >
            <img
              v-if="phoneDetails.country"
              :src="getFlagUrl(phoneDetails.country)"
              :alt="phoneDetails.country.name"
              class="h-3 w-4 rounded-sm object-cover"
            />
            <!-- Same-size placeholder so the chevron never shifts. -->
            <span v-else class="lucide-globe size-4 shrink-0 text-ink-gray-6" />
            <span
              class="lucide-chevron-down size-4 shrink-0 text-ink-gray-6 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
              :class="open && 'rotate-180'"
            />
          </button>
        </template>

        <!--
          Full-row takeover, but built from the standard ItemListRow shell
          so metrics and colors stay in sync with Combobox rows. Taking
          over skips the built-in selected checkmark, which doesn't fit
          this design — the selected row is indicated by background alone.
        -->
        <template #item="{ item, selected }">
          <ItemListRow :size="size" :selected="selected">
            <template #prefix>
              <!-- Decorative: the country name is the adjacent text. -->
              <img
                :src="getFlagUrl(item.country)"
                alt=""
                class="h-3 w-4 rounded-sm object-cover"
                loading="lazy"
                decoding="async"
              />
            </template>
            <template #label>
              <div class="truncate">{{ item.country.name }}</div>
            </template>
            <template #suffix>
              <span class="text-ink-gray-5">{{ item.country.isd }}</span>
            </template>
          </ItemListRow>
        </template>
      </Combobox>
      <!-- Divider: one step darker on hover so it doesn't blend into the
           shell's hover background (surface-gray-3 ≈ outline-gray-2). -->
      <div
        class="self-stretch border-l border-outline-gray-2"
        aria-hidden="true"
      />
      <!-- ISD Code -->
      <span
        v-if="phoneDetails.country"
        class="select-none ps-2"
        :class="textColor"
      >
        {{ phoneDetails.country.isd }}
      </span>
      <!-- Number Input -->
      <input
        :id="inputId"
        ref="numberInputRef"
        v-model="phoneDetails.number"
        data-slot="control"
        type="tel"
        inputmode="tel"
        autocomplete="tel"
        class="h-full min-w-0 flex-1 border-0 bg-transparent ps-1 pe-2 outline-none focus:ring-0 focus-visible:ring-0 disabled:cursor-not-allowed"
        :class="[
          textColor,
          inputFontSizeClasses(size),
          disabled ? 'placeholder-ink-gray-3' : 'placeholder-ink-gray-4',
        ]"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-required="required || undefined"
        :aria-invalid="hasError || undefined"
        :aria-errormessage="hasError ? errorMessageId : undefined"
        :aria-describedby="describedBy"
        v-bind="attrsWithoutClassStyle"
        @keydown.backspace="onBackspace"
      />
      <div v-if="$slots.suffix" class="flex items-center gap-2 pe-2.5">
        <slot name="suffix" />
      </div>
    </div>

    <InputDescription
      v-if="showDescription || $slots.description"
      :id="descriptionId"
      :description="props.description"
    >
      <slot v-if="$slots.description" name="description" />
    </InputDescription>
    <InputError v-if="hasError" :id="errorMessageId" :lines="errorLines" />
  </LabelingWrapper>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onMounted,
  reactive,
  ref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import { useInputLabeling } from '../../composables/useInputLabeling'
import { Combobox } from '../Combobox'
import InputDescription from '../InputLabeling/InputDescription.vue'
import InputError from '../InputLabeling/InputError.vue'
import InputLabel from '../InputLabeling/InputLabel.vue'
import LabelingWrapper from '../InputLabeling/LabelingWrapper.vue'
import ItemListRow from '../ItemListRow/ItemListRow.vue'
import { inputFontSizeClasses } from '../shared/selection/utils'
import type { Country, PhoneInputProps, PhoneInputSlots } from './types'
import {
  countries,
  getCountry,
  getCountryFromCode,
  getFlagUrl,
  guessCountryFromTimezone,
  joinPhoneDetails,
  splitPhoneDetails,
} from './utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PhoneInputProps>(), {
  size: 'sm',
  variant: 'subtle',
})

const model = defineModel<string>({ default: '' })

defineSlots<PhoneInputSlots>()

const attrs = useAttrs()
const slots = useSlots()

const attrsWithoutClassStyle = computed(() => {
  return Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
  )
})

const {
  inputId,
  labelId,
  descriptionId,
  errorMessageId,
  describedBy,
  hasError,
  errorLines,
  showDescription,
  dataAttrs,
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

const phoneDetails = reactive<{ country: Country | null; number: string }>({
  country: null,
  number: '',
})

const numberInputRef = ref<HTMLInputElement | null>(null)

// The ISD lives inside `label` so Combobox's built-in filtering matches
// country name and dial code alike; the slots render name and ISD apart.
const countryOptions = countries.map((country) => ({
  label: `${country.name} ${country.isd}`,
  value: country.code,
  country,
}))

const countryCode = computed<string | null>({
  get: () => phoneDetails.country?.code ?? null,
  set: (code) => {
    const country = getCountryFromCode(code)
    if (!country) return
    phoneDetails.country = country
    nextTick(() => numberInputRef.value?.focus())
  },
})

const textColor = computed(() => {
  return props.disabled ? 'text-ink-gray-5' : 'text-ink-gray-8'
})

const inputClasses = computed(() => {
  const sizeClasses = {
    sm: 'h-7 rounded',
    md: 'h-8 rounded',
    lg: 'h-10 rounded-md',
    xl: 'h-10 rounded-md',
  }[props.size]

  const variantClasses = props.disabled
    ? [
        'cursor-not-allowed border bg-surface-gray-1',
        props.variant === 'outline'
          ? 'border-outline-gray-2'
          : 'border-transparent',
      ]
    : {
        subtle:
          'border border-[--surface-gray-2] bg-surface-gray-2 hover:border-outline-gray-modals hover:bg-surface-gray-3 focus-within:bg-surface-white focus-within:border-outline-gray-4 focus-within:shadow-sm focus-within:hover:bg-surface-white focus-within:hover:border-outline-gray-4',
        outline:
          'border border-outline-gray-2 bg-surface-white hover:border-outline-gray-3 hover:shadow-sm focus-within:bg-surface-white focus-within:border-outline-gray-4 focus-within:shadow-sm focus-within:hover:border-outline-gray-4',
      }[props.variant]

  return [
    // Keyboard focus ring, mirroring TextInput's `focus-visible:ring-2`
    // one level up: the inner input is chromeless, so the shell rings
    // when any child has keyboard focus.
    'flex w-full items-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-outline-gray-3',
    sizeClasses,
    inputFontSizeClasses(props.size),
    variantClasses,
  ]
})

function onBackspace() {
  if (!phoneDetails.number) phoneDetails.country = null
}

// Splits a raw value into country + number state.
function setPhoneValue(value: string) {
  const parsed = splitPhoneDetails(value)
  phoneDetails.number = parsed.number
  if (parsed.country && parsed.country.isd !== phoneDetails.country?.isd) {
    phoneDetails.country = parsed.country
  }
}

function getDefaultCountry(): Country | null {
  return getCountry(props.defaultCountry) ?? guessCountryFromTimezone()
}

// Values typed, pasted, or autofilled into the input carrying an ISD
// ("+9198…") re-route through the parser before the model emits.
watch(
  () => phoneDetails.number,
  (value) => {
    if (value.startsWith('+')) setPhoneValue(value)
  },
)

watch(phoneDetails, () => {
  model.value = joinPhoneDetails(phoneDetails.country, phoneDetails.number)
})

// parses input to +country+number and updates the model.
watch(model, (value) => {
  if (value === joinPhoneDetails(phoneDetails.country, phoneDetails.number))
    return
  setPhoneValue(value ?? '')
})

onMounted(() => {
  const parsed = splitPhoneDetails(model.value)
  phoneDetails.country =
    parsed.country ?? (model.value ? null : getDefaultCountry())
  phoneDetails.number = parsed.number
})

defineExpose({ el: numberInputRef })
</script>

<style scoped>
/*
 * Same rule ComboboxResults applies to its default rows: the outer item
 * paints highlight / selected backgrounds (including the combined state),
 * so ItemListRow's own bg must stay transparent for it to show through.
 */
[data-slot='item'] [data-slot='item-list-row'] {
  background-color: transparent;
}

/*
 * Browsers force-paint autofilled inputs
 */
input:-webkit-autofill {
  -webkit-background-clip: text;
  background-clip: text;
}

input:autofill {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
