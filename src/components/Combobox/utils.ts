import { type Component, h, FunctionalComponent } from 'vue'

export type SimpleOption =
  | string
  | {
      label: string
      value: string
      icon?: string | Component
      disabled?: boolean
    }
export type GroupedOption = { group: string; options: SimpleOption[] }
export type GenericOption = SimpleOption | GroupedOption

export function getDisplayValue(
  options: Array<GenericOption>,
  selectedValue: string | null | undefined,
): string {
  if (!selectedValue) return ''
  const flatOptions = options.flatMap((opt) =>
    isGroup(opt) ? opt.options : opt,
  )
  const selectedOption = flatOptions.find(
    (opt) => getValue(opt) === selectedValue,
  )
  return selectedOption ? getLabel(selectedOption) : selectedValue || ''
}

export function isGroup(option: GenericOption): option is GroupedOption {
  return typeof option === 'object' && 'group' in option
}

export function getMultipleLabel(options: [SimpleOption]) {
  if (options.length === 1) return getLabel(options[0])
  return `${options.length} options selected`
}

export function getLabel(option: SimpleOption): string {
  return typeof option === 'string' ? option : option.label
}

export function getValue(option: SimpleOption): string {
  return typeof option === 'string' ? option : option.value
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
