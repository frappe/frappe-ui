import type {
  DropdownGroupOption,
  DropdownItem,
  DropdownOption,
  DropdownOptions,
  DropdownTheme,
} from './types'

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
  return 'items' in item && 'group' in item
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
): DropdownGroupOption[] {
  const groups: DropdownGroupOption[] = []
  let currentGroup: DropdownGroupOption | null = null
  let implicitGroupIndex = 0

  function flushCurrentGroup() {
    if (!currentGroup || !currentGroup.items.length) {
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

      const visibleItems = normalizeGroupItems(item.items)

      if (!visibleItems.length) continue

      groups.push({
        ...item,
        key: item.key ?? index,
        items: visibleItems,
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
        items: [],
      }
    }

    currentGroup.items.push(normalizeDropdownOption(item))
  }

  flushCurrentGroup()

  return groups
}

export function groupHasIcons(group: DropdownGroupOption) {
  return group.items.some((item) => Boolean(item.icon))
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
