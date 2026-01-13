
import type {
  CustomOption,
  SimpleOption,
} from './types'
import {
  type Component,
  type FunctionalComponent,
  h,
} from 'vue'

export function isCustomOption(option: SimpleOption): option is CustomOption {
  return typeof option === 'object' && option.type === 'custom'
}


export function getLabel(option: SimpleOption): string {
  return typeof option === 'string' ? option : option.label
}


export function getValue(option: SimpleOption): string | undefined {
  if (typeof option === 'string') return option
  if (isCustomOption(option)) return undefined
  return option.value
}

export function getKey(option: SimpleOption): string {
  if (typeof option === 'string') return option
  if (isCustomOption(option)) return option.key
  return option.value
}

export function isDisabled(option: SimpleOption): boolean {
  return typeof option === 'object' && !!option.disabled
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
