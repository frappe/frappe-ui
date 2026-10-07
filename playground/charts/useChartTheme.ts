// The colours a card draws in, for the theme the page has picked: the
// theme's roles (chartThemes.ts) resolved through the page's custom
// properties (useChartTokens.ts), so a flip to dark mode re-reads every
// one of them. A section asks `colors('series', 4)` and hands the result
// to a library chart's `palette`, which takes an explicit list and cycles
// it — nothing in a section names a colour.
import { computed, type ComputedRef, type Ref } from 'vue'
import {
  OWN_ROLE_FALLBACK,
  THEME_ROLES,
  type ChartTheme,
  type OwnRole,
  type ThemeRole,
} from './chartThemes'
import { useChartTokens } from './useChartTokens'

export type ThemeColors = {
  /** `count` colours for a role, cycled past the role's own length */
  colors: (role: ThemeRole | OwnRole, count?: number) => string[]
  /** the first colour of a role */
  one: (role: ThemeRole | OwnRole) => string
  /** a frappe-ui token (`ink-gray-5`), as a colour the chart can take */
  t: (name: string) => string
  /** the theme's whole ramp, light to dark */
  ramp: ComputedRef<string[]>
}

export function useChartTheme(theme: Ref<ChartTheme>): ThemeColors {
  const { version, t } = useChartTokens()
  const roles = computed(() => THEME_ROLES[theme.value])

  function colors(role: ThemeRole | OwnRole, count?: number): string[] {
    void version.value
    // a card the theme colours on its own, or else what it drew before
    const names =
      roles.value[role] ?? OWN_ROLE_FALLBACK[role as OwnRole](roles.value)
    const n = count ?? names.length
    return Array.from({ length: n }, (_, i) => t(names[i % names.length]))
  }

  return {
    colors,
    one: (role) => colors(role, 1)[0],
    t,
    ramp: computed(() => colors('ramp')),
  }
}
