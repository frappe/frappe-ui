import type { InjectionKey, Ref } from 'vue'
import type { DesktopShellProps } from '../DesktopShell/types'

/**
 * The physical side `DesktopShell` draws its navigation on, provided to the
 * `SidebarRailItem`s and `SidebarItem`s it renders. Internal.
 */
export const navSideKey: InjectionKey<
  Ref<NonNullable<DesktopShellProps['navSide']>>
> = Symbol('navSide')
