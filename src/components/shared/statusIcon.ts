/**
 * Shared status-icon logic for `Alert` and `SidebarCard`.
 *
 * Both components resolve a `boolean | string | Component` icon prop against a
 * theme-keyed map of the exact Figma status glyphs (espresso 2.0): the solid
 * set for Alert's row/banner layouts, the line set for the sidebar card.
 *
 * The icons are imported from their SFC files directly — they are not part of
 * the public `frappe-ui/icons` subpath.
 */
import { computed, toValue, type Component, type MaybeRefOrGetter } from 'vue'
import { isLucideIconString } from '../../utils/iconString'
import AlertCircleSolidIcon from '../../../icons/AlertCircleSolidIcon.vue'
import SuccessSolidIcon from '../../../icons/SuccessSolidIcon.vue'
import AlertTriangleSolidIcon from '../../../icons/AlertTriangleSolidIcon.vue'
import CloseCircleSolidIcon from '../../../icons/CloseCircleSolidIcon.vue'
import AlertCircleLineIcon from '../../../icons/AlertCircleLineIcon.vue'
import SuccessLineIcon from '../../../icons/SuccessLineIcon.vue'
import AlertTriangleLineIcon from '../../../icons/AlertTriangleLineIcon.vue'
import CloseCircleLineIcon from '../../../icons/CloseCircleLineIcon.vue'

/** Theme values shared by `Alert` and `SidebarCard`. */
export type StatusTheme = 'gray' | 'blue' | 'green' | 'amber' | 'red'

/** Figma `icon/solid/*` status glyphs — used by Alert (row and banner). */
export const solidStatusIcons: Record<StatusTheme, Component> = {
  gray: AlertCircleSolidIcon,
  blue: AlertCircleSolidIcon,
  green: SuccessSolidIcon,
  amber: AlertTriangleSolidIcon,
  red: CloseCircleSolidIcon,
}

/** Figma `icon/line/*` status glyphs — used by SidebarCard. */
export const lineStatusIcons: Record<StatusTheme, Component> = {
  gray: AlertCircleLineIcon,
  blue: AlertCircleLineIcon,
  green: SuccessLineIcon,
  amber: AlertTriangleLineIcon,
  red: CloseCircleLineIcon,
}

/**
 * Resolves the three-state `icon` prop against a theme's auto glyph:
 * unset or `true` → the theme's icon (every theme has one — gray uses the
 * info glyph in black ink), `false` → none, string/Component → the caller's
 * custom glyph.
 */
export function useStatusIcon(options: {
  icon: MaybeRefOrGetter<boolean | string | Component | undefined>
  theme: MaybeRefOrGetter<StatusTheme>
  icons: Record<StatusTheme, Component>
}) {
  const resolvedIcon = computed<string | Component | null>(() => {
    const icon = toValue(options.icon)
    const theme = toValue(options.theme)
    if (icon === false) return null
    if (icon === true || icon === undefined) return options.icons[theme]
    return icon
  })

  const lucideIcon = computed(() =>
    isLucideIconString(resolvedIcon.value) ? resolvedIcon.value : null,
  )

  const componentIcon = computed(() =>
    resolvedIcon.value && typeof resolvedIcon.value !== 'string'
      ? resolvedIcon.value
      : null,
  )

  return { resolvedIcon, lucideIcon, componentIcon }
}
