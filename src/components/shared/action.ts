/**
 * Shared action-button config for components that render caller-provided
 * actions (`Alert`, `SidebarCard`): `ButtonProps` plus a context-aware
 * `onClick`.
 */
import type { ButtonProps } from '../Button'

/** Context passed to an action's `onClick` handler. */
export type ActionContext = {
  /** Emits the component's `dismiss` event. The parent owns hiding. */
  dismiss: () => void
}

/** Button config for action props: `ButtonProps` plus a context-aware `onClick`. */
export type Action = ButtonProps & {
  /** Called on click with `{ dismiss }` to dismiss the component from the handler. */
  onClick?: (context: ActionContext) => void | Promise<void>
}

/**
 * Merges per-layout Button defaults with a caller-provided action; caller
 * fields win. `onClick` is stripped — the component binds it separately with
 * the `{ dismiss }` context.
 */
export function mergeActionProps<
  A extends ButtonProps & { onClick?: (...args: any[]) => any },
>(defaults: ButtonProps, action: A): ButtonProps {
  const { onClick: _onClick, ...rest } = action
  void _onClick
  return { ...defaults, ...rest }
}
