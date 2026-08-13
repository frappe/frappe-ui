import type {
  MenuGroupOption,
  MenuItem,
  MenuOption,
  MenuOptions,
  MenuTheme,
} from './types'

/**
 * Group object after normalization: conditions applied, themes and
 * selection flags resolved, implicit groups materialized.
 */
export type NormalizedMenuGroup = MenuGroupOption & {
  options: MenuOption[]
}

export const menuClasses = {
  content:
    'menu-content z-[100] min-w-40 divide-y divide-outline-elevation-2 rounded-6 bg-surface-elevation-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none',
  group: 'p-1.5',
  groupLabel: 'flex h-7 items-center px-2 text-sm font-medium text-ink-gray-4',
  itemIcon: 'size-4 shrink-0',
  itemIconPlaceholder: 'size-4 shrink-0',
  chevronIcon: 'size-4 shrink-0',
  menuItem:
    'cursor-pointer rounded-4 outline-none data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed',
} as const

export function isMenuGroupOption(item: MenuItem): item is MenuGroupOption {
  return 'group' in item && ('options' in item || 'items' in item)
}

// These fire from computeds on every recompute; warn once per message, not
// once per offending row per render.
const warned = new Set<string>()

export function warnRemoved(message: string) {
  if (!import.meta.env.DEV || warned.has(message)) return
  warned.add(message)
  console.warn(message)
}

function resolveGroupChildren(group: MenuGroupOption): MenuOption[] {
  if (!group.options && (group as any).items) {
    warnRemoved(
      '[Menu] `{ group, items }` is not supported; this group will not render. Rename `items` to `options`.',
    )
  }

  return group.options ?? []
}

export function isMenuSwitchOption(item: MenuOption) {
  return item.switch === true
}

export function isMenuSubmenuOption(item: MenuOption) {
  return Array.isArray(item.submenu)
}

function shouldRenderOption(option: MenuOption) {
  if ('component' in option && option.component) {
    warnRemoved(
      '[Menu] `component:` rows are not supported; the row renders as a plain action. Use `slots: { item: fn }` for a full-row replacement.',
    )
  }
  return option.condition ? option.condition() : true
}

function normalizeTheme(theme?: MenuTheme): MenuTheme {
  return theme ?? 'gray'
}

export function normalizeMenuOption(option: MenuOption): MenuOption {
  return {
    ...option,
    theme: normalizeTheme(option.theme),
    selected: Boolean(option.selected),
  }
}

function normalizeGroupItems(items: MenuOption[]) {
  return (items || [])
    .filter(Boolean)
    .filter(shouldRenderOption)
    .map(normalizeMenuOption)
}

export function normalizeMenuOptions(
  options: MenuOptions = [],
): NormalizedMenuGroup[] {
  const groups: NormalizedMenuGroup[] = []
  let currentGroup: NormalizedMenuGroup | null = null
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

    if (isMenuGroupOption(item)) {
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

    currentGroup.options.push(normalizeMenuOption(item))
  }

  flushCurrentGroup()

  return groups
}

export function groupHasIcons(group: NormalizedMenuGroup) {
  return group.options.some((item) => Boolean(item.icon))
}

export function getMenuIconColor(item: {
  disabled?: boolean
  theme?: MenuTheme
}) {
  if (item.disabled) return 'text-ink-gray-4'
  return item.theme === 'red' ? 'text-ink-red-7' : 'text-ink-gray-6'
}

export function getMenuTextColor(item: {
  disabled?: boolean
  theme?: MenuTheme
}) {
  if (item.disabled) return 'text-ink-gray-4'
  return item.theme === 'red' ? 'text-ink-red-7' : 'text-ink-gray-7'
}

export function getMenuBackgroundColor(item: { theme?: MenuTheme }) {
  if (item.theme === 'red') {
    return 'focus:bg-surface-red-3 data-[highlighted]:bg-surface-red-3 data-[state=open]:bg-surface-red-3'
  }

  return [
    'focus:bg-surface-alpha-gray-2 data-[highlighted]:bg-surface-alpha-gray-2 data-[state=open]:bg-surface-alpha-gray-2',
    'data-[state=checked]:bg-surface-gray-3',
    'data-[highlighted]:data-[state=checked]:bg-surface-gray-4',
  ].join(' ')
}
