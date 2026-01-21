import type {
  CustomOption,
  SimpleOption,
  GroupedOption,
  ComboboxOption,
} from './types'
import { type Component, type FunctionalComponent, h } from 'vue'

export function isCustomOption(option: SimpleOption): option is CustomOption {
  return typeof option === 'object' && option.type === 'custom'
}

export function getLabel(option: SimpleOption): string {
  return typeof option === 'string' ? option : option.label
}

export function getMultipleLabel(options: [SimpleOption]) {
  if (options.length === 1) return getLabel(options[0])
  return `${options.length} options selected`
}

export function getValue(option: SimpleOption): string | undefined {
  if (typeof option === 'string') return option
  return option.value
}

export function getKey(option: SimpleOption): string {
  if (typeof option === 'string') return option
  if (isCustomOption(option)) return option.key
  return option.value
}

export function isDisabled(option: SimpleOption): boolean {
  // fix: this breaks when a new element is added in TagINput
  return false
  return typeof option === 'object' && !!option.disabled
}

export function isGroup(option: ComboboxOption): option is GroupedOption {
  return typeof option === 'object' && 'group' in option
}

export function getIcon(option: SimpleOption): string | Component | undefined {
  return typeof option === 'object' ? option.icon : undefined
}

export const RenderIcon: FunctionalComponent<{ icon?: string | Component }> = (
  props,
) => {
  if (!props.icon) return null
  const iconContent =
    typeof props.icon === 'string'
      ? h('span', props.icon)
      : h(props.icon, { class: 'w-4 h-4' })

  return h(
    'span',
    {
      class: 'flex-shrink-0 w-4 h-4 inline-flex items-center justify-center',
    },
    [iconContent],
  )
}
