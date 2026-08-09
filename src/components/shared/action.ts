/**
 * Shared action-button config for components that render caller-provided
 * actions (`Dialog`, `Alert`, `SidebarCard`): `ButtonProps` plus a
 * context-aware `onClick`.
 */
import type { ButtonProps } from '../Button'

/**
 * Internal generic behind the public action types (`AlertAction`,
 * `DialogAction`): `ButtonProps` plus an `onClick` that receives the
 * component's context — `{ close }` for Dialog, `{ dismiss }` for Alert
 * and SidebarCard. Not exported from the package root.
 */
export type Action<Ctx> = ButtonProps & {
  /** Called on click with the component's context (e.g. `{ dismiss }` or `{ close }`). */
  onClick?: (context: Ctx) => void | Promise<void>
}

/**
 * Merges per-layout Button defaults with a caller-provided action; caller
 * fields win. `onClick` is stripped — the component binds it separately with
 * its own context.
 */
export function mergeActionProps<
  A extends ButtonProps & { onClick?: (...args: any[]) => any },
>(defaults: ButtonProps, action: A): ButtonProps {
  const { onClick: _onClick, ...rest } = action
  void _onClick
  return { ...defaults, ...rest }
}
