import type { TabsSide, TabsSize, TabsVariant } from '../../Tabs/types'
import type { BrowserTabBase, PillOrientation } from './pillTypes'

// Single source of styling truth for tab tracks and triggers, shared by
// `TabList` (tablist semantics) and `TabButtons` (radiogroup semantics).
// Pixel values come from Figma espresso-2.0, frame 23602:24584.

/**
 * Track (container) visuals.
 *
 * Ghost tracks: md = 2px padding, 10px radius, 6px gap; sm = 1px padding,
 * 8px radius, 4px gap. The Figma file has a stray 1px padding on the md
 * vertical tracks; the md horizontal value (2px) is canonical.
 * Subtle tracks keep the shipped v1 geometry instead: 1px padding at both
 * sizes (10px radius at md).
 */
export function tabTrackClasses(opts: {
  variant: TabsVariant
  size: TabsSize
  orientation: PillOrientation
  side: TabsSide
}): string[] {
  const { variant, size, orientation, side } = opts
  const isSm = size === 'sm'
  const vertical = orientation === 'vertical'

  switch (variant) {
    case 'subtle':
      // Shipped v1 geometry (overrides Figma): 1px padding at both sizes,
      // 10px radius at md.
      // No `overflow-hidden` on the track itself: with 1px of padding it also
      // clips the outer half of a focused trigger's 2px ring. The indicator's
      // shadow is clipped one layer down instead — see
      // `tabIndicatorClipClasses`.
      return [
        'bg-surface-gray-2',
        isSm ? 'gap-1 p-px' : 'gap-1.5 p-px',
        tabTrackRadiusClasses(variant, size),
      ]
    case 'ghost':
      return [
        'bg-surface-base',
        isSm ? 'gap-1 p-px' : 'gap-1.5 p-0.5',
        tabTrackRadiusClasses(variant, size),
      ]
    case 'underline':
      return vertical
        ? ['gap-1.5 border-e border-outline-gray-1']
        : ['gap-6 border-b border-outline-gray-1']
    case 'browser-tab':
      if (!vertical) return ['gap-1 border-b border-outline-gray-1']
      return [
        'gap-1',
        side === 'right'
          ? 'border-r border-outline-gray-1'
          : 'border-l border-outline-gray-1',
      ]
  }
}

/**
 * Sliding active-pill indicator surface (subtle/ghost). The indicator is a
 * layer behind the triggers that carries the active background and shadow;
 * the pills themselves stay transparent so the
 * surface can slide between them, segmented-control style.
 */
export function tabIndicatorSurfaceClasses(
  variant: TabsVariant,
  size: TabsSize,
): string[] {
  return [
    variant === 'ghost'
      ? 'bg-surface-gray-2'
      : 'bg-surface-elevation-3 shadow-base',
    tabRadiusClasses(variant, size),
  ]
}

/**
 * Track radius, one step outside the trigger radius: 8px at sm, 10px at md.
 * Subtle md keeps its literal (a deliberate Figma override) where ghost md
 * uses `rounded-5`; both land on 10px today. The track and the indicator's
 * clip layer both read it here, so the clip can't drift off the track's own
 * rounded box.
 */
export function tabTrackRadiusClasses(
  variant: TabsVariant,
  size: TabsSize,
): string {
  if (size === 'sm') return 'rounded-4'
  return variant === 'ghost' ? 'rounded-5' : 'rounded-[10px]'
}

/**
 * Clip layer for the sliding pill indicator (subtle/ghost). The track can't
 * carry `overflow-hidden` itself — it would clip the outer half of a focused
 * trigger's 2px ring too. A layer that holds only the indicator keeps both:
 * the active pill's shadow stops at the track edge, the ring still paints.
 * Matches the track's own box, so the shadow is cut on the same rounded rect.
 */
export function tabIndicatorClipClasses(
  variant: TabsVariant,
  size: TabsSize,
): string[] {
  return [
    'pointer-events-none absolute inset-0 overflow-hidden',
    tabTrackRadiusClasses(variant, size),
  ]
}

/**
 * Inset that centers the indicator inside the track: equal to the track's
 * padding (1px everywhere except the ghost md track's 2px).
 */
export function tabIndicatorInsetClasses(opts: {
  variant: TabsVariant
  size: TabsSize
  orientation: PillOrientation
}): string {
  const { variant, size, orientation } = opts
  const thick = variant === 'ghost' && size === 'md'
  return orientation === 'vertical'
    ? thick
      ? 'inset-x-0.5'
      : 'inset-x-px'
    : thick
      ? 'inset-y-0.5'
      : 'inset-y-px'
}

/**
 * Browser-tab active card: opaque surface with a 1px border on every edge
 * except the attached one (kept transparent so the box never changes), plus
 * an `after` pseudo that paints over the track's 1px rail segment so the
 * card fuses with the area beyond the rail. Shared by `Pill` (static card
 * when it owns the active surface) and the track indicators (sliding card —
 * the mask travels with the indicator). Callers add `relative`/`absolute`
 * positioning and `tabRadiusClasses` themselves.
 */
export function browserTabCardClasses(base: BrowserTabBase): string {
  if (base === 'left') {
    return 'border border-outline-gray-1 border-l-transparent bg-surface-base after:absolute after:-inset-y-px after:-left-[2px] after:w-px after:bg-surface-base'
  }
  if (base === 'right') {
    return 'border border-outline-gray-1 border-r-transparent bg-surface-base after:absolute after:-inset-y-px after:-right-[2px] after:w-px after:bg-surface-base'
  }
  return 'border border-outline-gray-1 border-b-transparent bg-surface-base after:absolute after:-inset-x-px after:-bottom-[2px] after:h-px after:bg-surface-base'
}

/**
 * Sliding-indicator motion, shared by every variant (underline, subtle,
 * ghost, browser-tab) in both `TabList` and `TabButtons`: 200ms easeOutQuint.
 * The strong deceleration front-loads the travel (~73% at 50ms) so the
 * switch feels immediate, while the 200ms tail lets the indicator settle
 * instead of stopping hard. Callers add the `transition-[...]` property list
 * and `motion-reduce:transition-none` themselves.
 */
export const tabIndicatorMotionClasses =
  'duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]'

/**
 * Reset, focus ring, and disabled treatment for the focusable element
 * wrapping a pill. The shell owns the ring (P12) so every track and both
 * components get the same one; `focus-visible:ring-0` clears the UA ring
 * first, matching `SidebarItem` and `RailItem`.
 */
export const tabShellClasses =
  'inline-flex appearance-none border-0 bg-transparent p-0 text-inherit no-underline focus-visible:ring-0 focus-visible:focus-ring disabled:pointer-events-none disabled:opacity-60'

/**
 * Trigger radius: 8px (`rounded-4`) at md, 7px at sm. Browser tabs round the
 * detached corners at 8px in both sizes; the attached edge stays square.
 */
export function tabRadiusClasses(
  variant: TabsVariant,
  size: TabsSize,
  browserTabBase: BrowserTabBase = 'none',
): string {
  if (variant === 'underline') return ''
  // Shipped v1 subtle radii (overrides Figma): 7px at sm, 9px at md — one
  // step inside the track's 8/10px radius.
  if (variant === 'subtle') {
    return size === 'sm' ? 'rounded-[7px]' : 'rounded-[9px]'
  }
  if (variant === 'browser-tab') {
    if (browserTabBase === 'left') return 'rounded-r-4'
    if (browserTabBase === 'right') return 'rounded-l-4'
    if (browserTabBase === 'default') return 'rounded-t-4'
  }
  return size === 'sm' ? 'rounded-[7px]' : 'rounded-4'
}
