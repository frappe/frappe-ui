import {
  defineComponent,
  h,
  reactive,
  ref,
  type Component,
  type Ref,
} from 'vue'
import Dialog from '../components/Dialog/Dialog.vue'
import { Button } from '../components/Button'
import FormControl from '../components/FormControl/FormControl.vue'
import ErrorMessage from '../components/ErrorMessage/ErrorMessage.vue'
import type {
  DialogIcon,
  DialogSize,
  DialogTheme,
} from '../components/Dialog/types'
import type { ButtonProps } from '../components/Button'
import type { ComboboxOption } from '../components/Combobox/types'

// -- Public types --------------------------------------------------------

/** Helpers passed to imperative dialog callbacks. */
export interface DialogControl {
  /** Manually dismiss the dialog. */
  close: () => void
  /**
   * Show an inline error and reset the loading state so the user can retry
   * or cancel. Pass `null` / `''` to clear. Usually you don't need this —
   * throwing from `onConfirm` auto-wires to it.
   */
  setError: (message: string | null | undefined) => void
}

export interface PromptControl extends DialogControl {
  values: Record<string, any>
}

/**
 * A button rendered in the dialog's action row. Extends `ButtonProps` so any
 * Button visual prop (theme, variant, icon, …) is accepted. `onClick` receives
 * the same lifecycle helpers as `onConfirm` and is awaited — the button's
 * loading state is held for as long as the returned promise is pending.
 *
 * If `onClick` rejects, the thrown error is rendered inline via `setError`.
 * If `onClick` is omitted, the action simply closes the dialog.
 */
export type DialogAction = Omit<ButtonProps, 'onClick' | 'loading'> & {
  label: string
  onClick?: (ctx: DialogControl) => void | Promise<void>
}

export interface ConfirmArgs {
  title?: string
  message?: string
  /** @default 'Confirm'. Ignored when `actions` is provided. */
  confirmLabel?: string
  /** @default 'Cancel'. Ignored when `actions` is provided. */
  cancelLabel?: string
  /** Colors the confirm button + picks the default icon. */
  theme?: DialogTheme
  /** Overrides the theme-derived default icon. */
  icon?: string | DialogIcon
  /** @default 'md' */
  size?: DialogSize
  /**
   * Whether the dialog can be dismissed via Esc / outside-click / close button.
   * @default true
   */
  dismissible?: boolean
  /**
   * Invoked when the user clicks the confirm button. Loading state is held
   * for as long as the returned promise is pending. Resolving auto-closes;
   * rejecting auto-renders the error inline and re-enables the buttons.
   *
   * Ignored when `actions` is provided.
   */
  onConfirm?: (ctx: DialogControl) => void | Promise<void>
  /**
   * Invoked when the user clicks cancel or dismisses the dialog (Esc /
   * outside-click / close button). Only needed when the cancel path has
   * side effects — usually you can omit this.
   *
   * Still fires on Esc/overlay dismiss when `actions` is provided.
   */
  onCancel?: () => void | Promise<void>
  /**
   * Render a custom set of buttons instead of the default confirm + cancel
   * pair. Rendered left-to-right in the order given. Each action's loading
   * state is tracked independently. When set, `confirmLabel`, `cancelLabel`,
   * and `onConfirm` are ignored.
   */
  actions?: DialogAction[]
}

/**
 * Per-field validator. Return a non-empty string to mark the field invalid
 * (the string is shown inline under the field), or `null` / `undefined` /
 * empty-string for "valid". Validators may be async — the submit button
 * stays in its loading state until all validators settle.
 *
 * Validators run after the built-in `required` check; if `required` fails
 * the validator is not called.
 */
export type PromptFieldValidator = (
  value: any,
  allValues: Record<string, any>,
) => string | null | undefined | Promise<string | null | undefined>

interface BasePromptField {
  name: string
  label?: string
  placeholder?: string
  required?: boolean
  description?: string
  validate?: PromptFieldValidator
}

export type PromptField =
  | (BasePromptField & {
      /** @default 'text' */
      type?: 'text' | 'textarea'
      defaultValue?: string
    })
  | (BasePromptField & {
      type: 'select'
      defaultValue?: string
      options: Array<{ label: string; value: string }>
    })
  | (BasePromptField & {
      type: 'checkbox'
      defaultValue?: boolean
    })
  | (BasePromptField & {
      type: 'combobox'
      defaultValue?: string
      /**
       * Options shown in the combobox popover. Accepts the same shape as the
       * `Combobox` component — typically `Array<{ label, value }>`. Grouped
       * options are supported via `{ group, options }` entries.
       */
      options: ComboboxOption[]
      /**
       * Allow the typed query through as the value when no option matches.
       * Maps to the underlying `Combobox`'s `allowCustomValue` prop.
       */
      allowCreate?: boolean
    })

export interface PromptArgs {
  title?: string
  message?: string
  fields: PromptField[]
  /** @default 'Submit' */
  confirmLabel?: string
  /** @default 'Cancel' */
  cancelLabel?: string
  theme?: DialogTheme
  icon?: string | DialogIcon
  /** @default 'md' */
  size?: DialogSize
  /**
   * Whether the dialog can be dismissed via Esc / outside-click / close button.
   * @default true
   */
  dismissible?: boolean
  /**
   * Invoked when the user submits and required fields pass validation.
   * Promise behavior matches `confirm.onConfirm`.
   */
  onConfirm: (ctx: PromptControl) => void | Promise<void>
  /** Optional — see `ConfirmArgs.onCancel`. */
  onCancel?: () => void | Promise<void>
}

/** Handle returned synchronously so callers can dismiss programmatically. */
export interface DialogHandle {
  close: () => void
}

// -- Internal mount state -----------------------------------------------

interface DialogInstance {
  id: number
  component: Component
}

export const dialogs: Ref<DialogInstance[]> = ref([])
let nextId = 0

function add(component: Component): number {
  const id = nextId++
  dialogs.value = [...dialogs.value, { id, component }]
  return id
}

function remove(id: number) {
  dialogs.value = dialogs.value.filter((d) => d.id !== id)
}

// -- Theme helpers -------------------------------------------------------

const THEME_DEFAULT_ICON: Record<DialogTheme, string> = {
  red: 'lucide-alert-triangle',
  yellow: 'lucide-alert-triangle',
  blue: 'lucide-info',
  green: 'lucide-check-circle',
}

type ButtonTheme = NonNullable<ButtonProps['theme']>

function themeToButtonTheme(theme?: DialogTheme): ButtonTheme | undefined {
  if (!theme) return undefined
  // Button doesn't have `yellow`; fall back to default solid (no theme).
  if (theme === 'yellow') return undefined
  return theme as ButtonTheme
}

function resolveIcon(
  theme?: DialogTheme,
  icon?: string | DialogIcon,
): DialogIcon | undefined {
  if (icon) {
    if (typeof icon === 'string') return { name: icon, theme }
    return { ...icon, theme: icon.theme ?? theme }
  }
  if (theme) return { name: THEME_DEFAULT_ICON[theme], theme }
  return undefined
}

// -- Helpers -------------------------------------------------------------

/** State shared between the imperative helpers. */
type LifecycleState = {
  open: boolean
  loading: boolean
  error: string
}

// Flips the dialog's `open` flag (idempotent). The instance is removed from
// the active list by the Dialog overlay's `after-leave` callback.
function makeClose(state: LifecycleState) {
  let closed = false
  return () => {
    if (closed) return
    closed = true
    state.open = false
    state.loading = false
  }
}

// Returns a stable callback that updates the dialog's inline error message
// and clears the loading state so action buttons re-enable.
function makeSetError(state: LifecycleState) {
  return (message: string | null | undefined) => {
    state.error = message || ''
    state.loading = false
  }
}

// Best-effort extraction of a user-facing error message. Frappe errors
// typically expose a `messages: string[]` array; fall back to `.message`
// and finally a generic string so we never crash on a bad reject value.
function extractErrorMessage(err: unknown): string {
  if (err == null) return 'Something went wrong'
  if (typeof err === 'string') return err
  const e = err as { messages?: unknown; message?: unknown }
  if (Array.isArray(e.messages) && typeof e.messages[0] === 'string') {
    return e.messages[0]
  }
  if (typeof e.message === 'string' && e.message) return e.message
  return 'Something went wrong'
}

// -- confirm -------------------------------------------------------------

// Wraps a `DialogAction.onClick` so each button tracks its own loading state.
// Awaits the user-supplied handler, auto-closes on success, and surfaces
// thrown errors inline via the shared `setError` channel (which also resets
// every button's loading flag).
function makeActionRunner(
  action: DialogAction,
  state: LifecycleState,
  actionStates: Array<{ loading: boolean }>,
  index: number,
  close: () => void,
  setError: (message: string | null | undefined) => void,
  isAnyLoading: () => boolean,
) {
  return async () => {
    if (isAnyLoading()) return
    if (!action.onClick) {
      close()
      return
    }
    actionStates[index].loading = true
    state.error = ''
    try {
      await action.onClick({ close, setError })
      close()
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      actionStates[index].loading = false
    }
  }
}

export function confirm(args: ConfirmArgs): DialogHandle {
  const state = reactive<LifecycleState>({
    open: true,
    loading: false,
    error: '',
  })
  let assignedId = -1
  const close = makeClose(state)
  const setError = makeSetError(state)

  // Per-action loading state — only used when `args.actions` is set. Kept in
  // a parallel array so we can mutate without cloning the user's action defs.
  const actionStates = reactive(
    (args.actions ?? []).map(() => ({ loading: false })),
  )
  const isAnyLoading = () =>
    state.loading || actionStates.some((s) => s.loading)

  const onConfirm = async () => {
    if (state.loading) return
    if (!args.onConfirm) {
      close()
      return
    }
    state.loading = true
    state.error = ''
    try {
      await args.onConfirm({ close, setError })
      close()
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const onCancel = () => {
    if (isAnyLoading()) return
    close()
    args.onCancel?.()
  }

  const dismissible = args.dismissible !== false

  const resolvedIcon = resolveIcon(args.theme, args.icon)
  const buttonTheme = themeToButtonTheme(args.theme)

  const renderActions = () => {
    if (args.actions && args.actions.length > 0) {
      // Custom actions: render in author-supplied order. Each button locks
      // out the others while its own onClick is pending.
      return h(
        'div',
        { class: 'flex justify-end gap-2' },
        args.actions.map((action, index) => {
          const { onClick: _omit, ...buttonProps } = action
          return h(Button, {
            ...buttonProps,
            key: action.label ?? index,
            loading: actionStates[index].loading,
            disabled: isAnyLoading() && !actionStates[index].loading,
            onClick: makeActionRunner(
              action,
              state,
              actionStates,
              index,
              close,
              setError,
              isAnyLoading,
            ),
          })
        }),
      )
    }
    return h('div', { class: 'flex flex-row-reverse gap-2' }, [
      h(Button, {
        label: args.confirmLabel || 'Confirm',
        variant: 'solid',
        theme: buttonTheme,
        loading: state.loading,
        onClick: onConfirm,
      }),
      h(Button, {
        label: args.cancelLabel || 'Cancel',
        variant: 'outline',
        disabled: state.loading,
        onClick: onCancel,
      }),
    ])
  }

  const component = defineComponent({
    name: 'ImperativeConfirmDialog',
    setup() {
      return () =>
        h(
          Dialog,
          {
            'open': state.open,
            'onUpdate:open': (val: boolean) => {
              if (!val) onCancel()
            },
            'title': args.title,
            'icon': resolvedIcon,
            'size': args.size || 'md',
            dismissible,
            'showCloseButton': dismissible,
            'onAfterLeave': () => remove(assignedId),
          },
          {
            default: () =>
              h('div', { class: 'space-y-2' }, [
                args.message
                  ? h(
                      'p',
                      { class: 'text-p-base text-ink-gray-7' },
                      args.message,
                    )
                  : null,
                state.error ? h(ErrorMessage, { message: state.error }) : null,
              ]),
            actions: renderActions,
          },
        )
    },
  })

  assignedId = add(component)
  return { close }
}

// -- prompt --------------------------------------------------------------

// Initial value for a prompt field. Checkbox defaults to false; everything
// else (text/textarea/select/combobox) defaults to an empty string so the
// `required` check has something concrete to compare against.
function initialFieldValue(field: PromptField): any {
  if (field.defaultValue !== undefined) return field.defaultValue
  return field.type === 'checkbox' ? false : ''
}

export function prompt(args: PromptArgs): DialogHandle {
  const state = reactive<LifecycleState>({
    open: true,
    loading: false,
    error: '',
  })
  let assignedId = -1
  const close = makeClose(state)
  const setError = makeSetError(state)

  const values = reactive<Record<string, any>>(
    Object.fromEntries(args.fields.map((f) => [f.name, initialFieldValue(f)])),
  )

  // Per-field error messages, keyed by field name. Populated by `validate`
  // hooks; cleared whenever the user edits the corresponding field.
  const fieldErrors = reactive<Record<string, string>>({})

  // Required-field check. Returns the first failing field name so we can
  // highlight it inline rather than throwing a generic error.
  const checkRequired = (): string | null => {
    for (const f of args.fields) {
      if (!f.required) continue
      if (f.type === 'checkbox') continue
      const v = values[f.name]
      if (v == null || v === '') return f.name
    }
    return null
  }

  // Runs every field's `validate` in parallel. Mutates `fieldErrors` and
  // returns true when every validator passed.
  const runValidators = async (): Promise<boolean> => {
    const snapshot = { ...values }
    const results = await Promise.all(
      args.fields.map(async (f) => {
        if (!f.validate) return { name: f.name, error: null as string | null }
        try {
          const result = await f.validate(values[f.name], snapshot)
          return { name: f.name, error: result || null }
        } catch (err) {
          return { name: f.name, error: extractErrorMessage(err) }
        }
      }),
    )
    let ok = true
    for (const { name, error } of results) {
      if (error) {
        fieldErrors[name] = error
        ok = false
      } else {
        delete fieldErrors[name]
      }
    }
    return ok
  }

  const onSubmit = async () => {
    if (state.loading) return
    const missing = checkRequired()
    if (missing) {
      // Match the previous behavior — silently no-op so HTML5 required UI
      // can take over via the underlying FormControl.
      return
    }
    state.loading = true
    state.error = ''
    try {
      const valid = await runValidators()
      if (!valid) {
        state.loading = false
        return
      }
      await args.onConfirm({ values: { ...values }, close, setError })
      close()
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const onCancel = () => {
    close()
    args.onCancel?.()
  }

  const dismissible = args.dismissible !== false

  const resolvedIcon = resolveIcon(args.theme, args.icon)
  const buttonTheme = themeToButtonTheme(args.theme)

  const renderField = (field: PromptField) => {
    const onUpdate = (val: any) => {
      values[field.name] = val
      // Clear the stale error the moment the user edits the field.
      if (fieldErrors[field.name]) delete fieldErrors[field.name]
    }

    // Combobox-only knobs are forwarded as fallthrough attrs; FormControl
    // re-emits them onto the underlying <Combobox> via `controlAttrs`.
    const comboboxAttrs =
      field.type === 'combobox'
        ? { openOnClick: true, allowCustomValue: field.allowCreate }
        : null

    const modelValue =
      field.type === 'combobox'
        ? values[field.name] || null
        : values[field.name]

    const fieldNode = h(FormControl, {
      'label': field.label,
      'description': field.description,
      'type': (field.type as any) || 'text',
      'required': field.required,
      'placeholder': field.placeholder,
      'options': (field as any).options,
      modelValue,
      'onUpdate:modelValue': onUpdate,
      ...comboboxAttrs,
    })

    return h('div', { key: field.name, class: 'space-y-1' }, [
      fieldNode,
      fieldErrors[field.name]
        ? h(ErrorMessage, { message: fieldErrors[field.name] })
        : null,
    ])
  }

  const component = defineComponent({
    name: 'ImperativePromptDialog',
    setup() {
      return () =>
        h(
          Dialog,
          {
            'open': state.open,
            'onUpdate:open': (val: boolean) => {
              if (!val) onCancel()
            },
            'title': args.title,
            'icon': resolvedIcon,
            'size': args.size || 'md',
            dismissible,
            'showCloseButton': dismissible,
            'onAfterLeave': () => remove(assignedId),
          },
          {
            default: () =>
              h('div', { class: 'space-y-3' }, [
                args.message
                  ? h(
                      'p',
                      { class: 'text-p-base text-ink-gray-7' },
                      args.message,
                    )
                  : null,
                ...args.fields.map(renderField),
                state.error ? h(ErrorMessage, { message: state.error }) : null,
              ]),
            actions: () =>
              h('div', { class: 'flex flex-row-reverse gap-2' }, [
                h(Button, {
                  label: args.confirmLabel || 'Submit',
                  variant: 'solid',
                  theme: buttonTheme,
                  loading: state.loading,
                  onClick: onSubmit,
                }),
                h(Button, {
                  label: args.cancelLabel || 'Cancel',
                  variant: 'outline',
                  disabled: state.loading,
                  onClick: onCancel,
                }),
              ]),
          },
        )
    },
  })

  assignedId = add(component)
  return { close }
}

// -- danger --------------------------------------------------------------

/**
 * Shape accepted by `dialog.danger`. Mirrors `ConfirmArgs` but drops `theme`
 * and `icon` (forced to red / alert-triangle) and renames the action label
 * default to `'Delete'`.
 */
export type DangerArgs = Omit<ConfirmArgs, 'theme' | 'icon'>

/**
 * Destructive confirm preset. Forces `theme: 'red'`, defaults the icon to
 * `lucide-alert-triangle`, and defaults `confirmLabel` to `'Delete'`. Use
 * for irreversible actions like deleting, revoking, or discarding data.
 *
 * Everything else (actions[], dismissible, onCancel, …) works identically
 * to `confirm`.
 */
export function danger(args: DangerArgs): DialogHandle {
  return confirm({
    ...args,
    theme: 'red',
    confirmLabel: args.confirmLabel ?? 'Delete',
  })
}

// -- namespace -----------------------------------------------------------

export const dialog = {
  confirm,
  prompt,
  danger,
}

export type DialogNamespace = typeof dialog
