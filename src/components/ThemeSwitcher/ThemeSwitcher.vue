<template>
  <div class="flex flex-col gap-4">
    <div
      v-if="showLabel || showDescription"
      class="flex flex-col gap-1"
    >
      <span
        v-if="showLabel"
        :id="headingId"
        class="text-base font-medium text-ink-gray-8"
      >
        <slot name="label">{{ props.label }}</slot>
      </span>
      <span
        v-if="showDescription"
        class="text-p-sm text-ink-gray-6"
      >
        <slot name="description">{{ props.description }}</slot>
      </span>
    </div>

    <RadioGroupRoot
      v-model="selected"
      orientation="horizontal"
      loop
      data-slot="control"
      class="flex items-center gap-3"
      :aria-label="showLabel ? undefined : props.label || 'Theme'"
      :aria-labelledby="showLabel ? headingId : undefined"
    >
      <RadioGroupItem
        v-for="option in themeOptions"
        :key="option.value"
        v-slot="{ checked }"
        as="template"
        :value="option.value"
      >
        <div
          data-slot="option"
          :data-theme-option="option.value"
          class="flex-1 max-w-[227px] min-h-[42px] cursor-pointer overflow-hidden rounded-lg border outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-outline-gray-3"
          :class="checked ? 'border-outline-gray-5' : 'border-outline-gray-modals'"
        >
          <ThemePreview
            :theme="option.value"
            :logo="props.logo"
            :name="props.name"
            :logo-is-image="logoIsImage"
          />
          <div class="flex items-center justify-between border-t px-3 py-2 relative z-10 overflow-hidden">
            <div class="text-base text-ink-gray-7">
              <slot name="item-label" :value="option.value">{{
                optionLabel(option)
              }}</slot>
            </div>
            <div
              class="size-3.5 rounded-full"
              :class="
                checked
                  ? 'border-4 border-outline-gray-5'
                  : 'border border-outline-gray-4'
              "
            />
          </div>
        </div>
      </RadioGroupItem>
    </RadioGroupRoot>
  </div>
</template>

<script setup lang="ts">
import { computed, useId, useSlots } from 'vue'
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'
import { useTheme, type Theme } from '../../utils/theme'
import ThemePreview from './ThemePreview.vue'
import type { ThemeSwitcherProps } from './types'

defineOptions({ name: 'ThemeSwitcher' })

interface ThemeOption {
  value: Theme
  defaultLabel: string
}

const themeOptions: ThemeOption[] = [
  { value: 'light', defaultLabel: 'Light' },
  { value: 'dark', defaultLabel: 'Dark' },
  { value: 'system', defaultLabel: 'System' },
]

const props = withDefaults(defineProps<ThemeSwitcherProps>(), {
  label: 'Theme',
  description: 'Switch between light, dark, or system theme',
  name: '',
})

const emit = defineEmits<{
  /** Fired when the selected theme changes. */
  'update:modelValue': [theme: Theme]
}>()

defineSlots<{
  /** Overrides the heading content. */
  label?: () => any
  /** Overrides the helper-text content. */
  description?: () => any
  /**
   * Overrides a single option's label. Receives the option's `value`.
   * Falls back to the `themeLabels` prop, then the built-in label.
   */
  'item-label'?: (props: { value: Theme }) => any
}>()

const { currentTheme, setTheme } = useTheme()

// Not `defineModel`: when unbound, the switcher falls back to the shared
// `currentTheme` and must keep mirroring it in real time (so a separate toggle
// button stays in sync); a local `defineModel` ref can't track that once
// written. The setter always drives `setTheme`, so a bare `<ThemeSwitcher />`
// still switches the app theme.
const selected = computed<Theme>({
  get: () => props.modelValue ?? currentTheme.value,
  set: (value) => {
    setTheme(value)
    emit('update:modelValue', value)
  },
})

const slots = useSlots()
const headingId = useId()
const showLabel = computed(() => Boolean(props.label || slots.label))
const showDescription = computed(() =>
  Boolean(props.description || slots.description),
)
const logoIsImage = computed(
  () => typeof props.logo === 'string' && props.logo.length > 0,
)

function optionLabel(option: ThemeOption): string {
  return props.themeLabels?.[option.value] ?? option.defaultLabel
}
</script>
