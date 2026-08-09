import type { TabsDirection, TabsSize, TabsVariant } from '../../Tabs/types'
import type { BrowserTabBase, PillOrientation } from './pillTypes'

// Single source of styling truth for tab tracks and triggers, shared by
// `TabList` (tablist semantics) and `TabButtons` (radiogroup semantics).
// Pixel values come from Figma espresso-2.0, frame 23602:24584.

/**
 * Track (container) visuals.
 *
 * Pill tracks (subtle/ghost): md = 2px padding, 10px radius, 6px gap;
 * sm = 1px padding, 8px radius, 4px gap. The Figma file has a stray 1px
 * padding on the md vertical tracks; the md horizontal value (2px) is
 * canonical.
 */
export function tabTrackClasses(opts: {
  variant: TabsVariant
  size: TabsSize
  orientation: PillOrientation
  direction: TabsDirection
}): string[] {
  const { variant, size, orientation, direction } = opts
  const isSm = size === 'sm'
  const vertical = orientation === 'vertical'

  switch (variant) {
    case 'subtle':
    case 'ghost':
      return [
        variant === 'subtle' ? 'bg-surface-gray-2' : 'bg-surface-base',
        isSm ? 'gap-1 rounded p-px' : 'gap-1.5 rounded-md p-0.5',
      ]
    case 'underline':
      return vertical
        ? ['gap-1.5 border-e border-outline-gray-1']
        : ['gap-6 border-b border-outline-gray-1']
    case 'browser-tab':
      if (!vertical) return ['gap-1 border-b border-outline-gray-1']
      return [
        'gap-1',
        direction === 'right'
          ? 'border-r border-outline-gray-1'
          : 'border-l border-outline-gray-1',
      ]
  }
}

/** Reset + disabled treatment for the focusable element wrapping a pill. */
export const tabShellClasses =
  'inline-flex appearance-none border-0 bg-transparent p-0 text-inherit no-underline disabled:pointer-events-none disabled:opacity-60'

/**
 * Trigger radius: 8px (`rounded`) at md, 7px at sm. Browser tabs round the
 * detached corners at 8px in both sizes; the attached edge stays square.
 */
export function tabRadiusClasses(
  variant: TabsVariant,
  size: TabsSize,
  browserTabBase: BrowserTabBase = 'none',
): string {
  if (variant === 'underline') return ''
  if (variant === 'browser-tab') {
    if (browserTabBase === 'left') return 'rounded-r'
    if (browserTabBase === 'right') return 'rounded-l'
    if (browserTabBase === 'default') return 'rounded-t'
  }
  return size === 'sm' ? 'rounded-[7px]' : 'rounded'
}
