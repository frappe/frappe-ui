/**
 * Owned names for the toast option types.
 *
 * `toast` is vue-sonner's namespace with our sanitizing wrappers around it
 * (`spec/toast.md`), so its options are vue-sonner's. An app that annotates a
 * toast helper of its own needed an import from vue-sonner, a dependency it
 * does not declare. These aliases give those types a frappe-ui name.
 */
import type { Action, ExternalToast } from 'vue-sonner'

/**
 * Options accepted by every `toast.*` call: `description`, `duration`,
 * `action`, `cancel`, `id`, `onDismiss`, and the rest.
 *
 * `duration` defaults to 4000ms. `ToastProvider` takes no props, so a toast
 * that must stay longer sets its own.
 */
export type ToastOptions = ExternalToast

/** The `action` / `cancel` button in {@link ToastOptions}. */
export type ToastAction = Action

/**
 * What a `toast.*` call returns. Pass it back as `id` to update that toast in
 * place, or to `toast.dismiss(id)`.
 */
export type ToastId = string | number
