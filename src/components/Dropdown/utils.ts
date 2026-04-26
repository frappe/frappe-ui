import type {
  DropdownGroupOption,
  DropdownItem,
  DropdownOption,
  DropdownOptions,
  DropdownTheme,
} from './types'

/**
 * Group object after normalization. `options` is guaranteed to be present
 * (the deprecated `items` alias has been resolved into it).
 */
export type NormalizedDropdownGroup = DropdownGroupOption & {
  options: DropdownOption[]
}

export const dropdownClasses = {
  content:
    'dropdown-content min-w-40 divide-y divide-outline-gray-modals rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none',
  group: 'p-1.5',
  groupLabel: 'flex h-7 items-center px-2 text-sm font-medium text-ink-gray-4',
  itemIcon: 'size-4 shrink-0',
  itemIconPlaceholder: 'size-4 shrink-0',
  chevronIcon: 'size-4 shrink-0',
  menuItem:
    'cursor-pointer rounded outline-none data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed',
} as const

export function isDropdownGroupOption(
  item: DropdownItem,
): item is DropdownGroupOption {
  return 'group' in item && ('options' in item || 'items' in item)
}

function resolveGroupChildren(group: DropdownGroupOption): DropdownOption[] {
  if (import.meta.env.DEV && group.options && group.items) {
    console.warn(
      '[Dropdown] grouped entry has both `options` and `items`. `options` wins; `items` is the deprecated alias.',
    )
  }

  return group.options ?? group.items ?? []
}

export function isDropdownSwitchOption(item: DropdownOption) {
  return item.switch === true
}

export function isDropdownSubmenuOption(item: DropdownOption) {
  return Array.isArray(item.submenu)
}

export function isDropdownComponentOption(item: DropdownOption) {
  return 'component' in item && Boolean(item.component)
}

function shouldRenderOption(option: DropdownOption) {
  return option.condition ? option.condition() : true
}

function normalizeTheme(theme?: DropdownTheme): DropdownTheme {
  return theme ?? 'gray'
}

export function normalizeDropdownOption(
  option: DropdownOption,
): DropdownOption {
  return {
    ...option,
    theme: normalizeTheme(option.theme),
    selected: Boolean(option.selected),
  }
}

function normalizeGroupItems(items: DropdownOption[]) {
  return (items || [])
    .filter(Boolean)
    .filter(shouldRenderOption)
    .map(normalizeDropdownOption)
}

export function normalizeDropdownOptions(
  options: DropdownOptions = [],
): NormalizedDropdownGroup[] {
  const groups: NormalizedDropdownGroup[] = []
  let currentGroup: NormalizedDropdownGroup | null = null
  let implicitGroupIndex = 0

  function flushCurrentGroup() {
    if (!currentGroup || !currentGroup.options.length) {
      currentGroup = null
      return
    }

    groups.push(currentGroup)
    currentGroup = null
  }

  for (const [index, item] of options.entries()) {
    if (!item) continue

    if (isDropdownGroupOption(item)) {
      flushCurrentGroup()

      const visibleItems = normalizeGroupItems(resolveGroupChildren(item))

      if (!visibleItems.length) continue

      const { items: _legacyItems, ...rest } = item

      groups.push({
        ...rest,
        key: item.key ?? index,
        options: visibleItems,
      })
      continue
    }

    if (!shouldRenderOption(item)) {
      continue
    }

    if (!currentGroup) {
      currentGroup = {
        key: `implicit-${implicitGroupIndex++}`,
        group: '',
        hideLabel: true,
        options: [],
      }
    }

    currentGroup.options.push(normalizeDropdownOption(item))
  }

  flushCurrentGroup()

  return groups
}

export function groupHasIcons(group: NormalizedDropdownGroup) {
  return group.options.some((item) => Boolean(item.icon))
}

export function getDropdownIconColor(item: {
  disabled?: boolean
  theme?: DropdownTheme
}) {
  if (item.disabled) return 'text-ink-gray-4'
  return item.theme === 'red' ? 'text-ink-red-3' : 'text-ink-gray-6'
}

export function getDropdownTextColor(item: {
  disabled?: boolean
  theme?: DropdownTheme
}) {
  if (item.disabled) return 'text-ink-gray-4'
  return item.theme === 'red' ? 'text-ink-red-3' : 'text-ink-gray-7'
}

export function getDropdownBackgroundColor(item: { theme?: DropdownTheme }) {
  if (item.theme === 'red') {
    return 'focus:bg-surface-red-3 data-[highlighted]:bg-surface-red-3 data-[state=open]:bg-surface-red-3'
  }

  return [
    'focus:bg-surface-gray-2 data-[highlighted]:bg-surface-gray-2 data-[state=open]:bg-surface-gray-2',
    'data-[state=checked]:bg-surface-gray-3',
    'data-[highlighted]:data-[state=checked]:bg-surface-gray-4',
  ].join(' ')
}
