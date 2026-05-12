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
import type {
  DialogIcon,
  DialogSize,
  DialogTheme,
} from '../components/Dialog/types'
import type { ButtonProps } from '../components/Button'

// -- Public types --------------------------------------------------------

export interface ConfirmArgs {
  title?: string
  message?: string
  /** @default 'Confirm' */
  confirmLabel?: string
  /** @default 'Cancel' */
  cancelLabel?: string
  /** Colors the confirm button + picks the default icon. */
  theme?: DialogTheme
  /** Overrides the theme-derived default icon. */
  icon?: string | DialogIcon
  /** @default 'md' */
  size?: DialogSize
}

export interface AlertArgs {
  title?: string
  message?: string
  /** @default 'OK' */
  label?: string
  theme?: DialogTheme
  icon?: string | DialogIcon
  /** @default 'md' */
  size?: DialogSize
}

export type PromptField = {
  name: string
  label?: string
  /** @default 'text' */
  type?: 'text' | 'textarea' | 'select' | 'checkbox'
  defaultValue?: string | boolean
  placeholder?: string
  required?: boolean
  /** Used when `type: 'select'`. */
  options?: Array<{ label: string; value: string }>
  description?: string
}

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
}

export interface ConfirmResult {
  ok: boolean
  close: () => void
}

export interface AlertResult {
  close: () => void
}

export interface PromptResult {
  values: Record<string, any> | null
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
}

function makeClose(state: LifecycleState, id: () => number) {
  let closed = false
  return () => {
    if (closed) return
    closed = true
    state.open = false
    state.loading = false
    // after-leave on the Dialog overlay removes the instance from the list
    void id
  }
}

// -- confirm -------------------------------------------------------------

export function confirm(args: ConfirmArgs): Promise<ConfirmResult> {
  return new Promise((resolve) => {
    const state = reactive<LifecycleState>({ open: true, loading: false })
    let resolved = false
    let assignedId = -1
    const close = makeClose(state, () => assignedId)

    const onConfirm = () => {
      if (resolved) return
      resolved = true
      state.loading = true
      resolve({ ok: true, close })
    }

    const onCancel = () => {
      if (resolved) {
        // cancel after a confirm — just close
        close()
        return
      }
      resolved = true
      state.open = false
      resolve({ ok: false, close })
    }

    const resolvedIcon = resolveIcon(args.theme, args.icon)
    const buttonTheme = themeToButtonTheme(args.theme)

    const component = defineComponent({
      name: 'ImperativeConfirmDialog',
      setup() {
        return () =>
          h(
            Dialog,
            {
              open: state.open,
              'onUpdate:open': (val: boolean) => {
                if (!val) onCancel()
              },
              title: args.title,
              message: args.message,
              icon: resolvedIcon,
              size: args.size || 'md',
              dismissable: false,
              showCloseButton: false,
              onAfterLeave: () => remove(assignedId),
            },
            {
              actions: () =>
                h('div', { class: 'flex flex-row-reverse gap-2' }, [
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
                ]),
            },
          )
      },
    })

    assignedId = add(component)
  })
}

// -- alert ---------------------------------------------------------------

export function alert(args: AlertArgs): Promise<AlertResult> {
  return new Promise((resolve) => {
    const state = reactive<LifecycleState>({ open: true, loading: false })
    let resolved = false
    let assignedId = -1
    const close = makeClose(state, () => assignedId)

    const onClick = () => {
      if (resolved) return
      resolved = true
      state.loading = true
      resolve({ close })
    }

    const resolvedIcon = resolveIcon(args.theme, args.icon)
    const buttonTheme = themeToButtonTheme(args.theme)

    const component = defineComponent({
      name: 'ImperativeAlertDialog',
      setup() {
        return () =>
          h(
            Dialog,
            {
              open: state.open,
              'onUpdate:open': (val: boolean) => {
                // dismissable: false, but guard anyway
                if (!val && !resolved) onClick()
              },
              title: args.title,
              message: args.message,
              icon: resolvedIcon,
              size: args.size || 'md',
              dismissable: false,
              showCloseButton: false,
              onAfterLeave: () => remove(assignedId),
            },
            {
              actions: () =>
                h(Button, {
                  class: 'w-full',
                  label: args.label || 'OK',
                  variant: 'solid',
                  theme: buttonTheme,
                  loading: state.loading,
                  onClick,
                }),
            },
          )
      },
    })

    assignedId = add(component)
  })
}

// -- prompt --------------------------------------------------------------

export function prompt(args: PromptArgs): Promise<PromptResult> {
  return new Promise((resolve) => {
    const state = reactive<LifecycleState>({ open: true, loading: false })
    let resolved = false
    let assignedId = -1
    const close = makeClose(state, () => assignedId)

    const values = reactive<Record<string, any>>(
      Object.fromEntries(
        args.fields.map((f) => [
          f.name,
          f.defaultValue ?? (f.type === 'checkbox' ? false : ''),
        ]),
      ),
    )

    const onSubmit = () => {
      if (resolved) return
      // basic required-field check
      for (const f of args.fields) {
        if (!f.required) continue
        const v = values[f.name]
        if (f.type === 'checkbox') continue
        if (v == null || v === '') return
      }
      resolved = true
      state.loading = true
      resolve({ values: { ...values }, close })
    }

    const onCancel = () => {
      if (resolved) {
        close()
        return
      }
      resolved = true
      state.open = false
      resolve({ values: null, close })
    }

    const resolvedIcon = resolveIcon(args.theme, args.icon)
    const buttonTheme = themeToButtonTheme(args.theme)

    const component = defineComponent({
      name: 'ImperativePromptDialog',
      setup() {
        return () =>
          h(
            Dialog,
            {
              open: state.open,
              'onUpdate:open': (val: boolean) => {
                if (!val) onCancel()
              },
              title: args.title,
              message: args.message,
              icon: resolvedIcon,
              size: args.size || 'md',
              dismissable: false,
              showCloseButton: false,
              onAfterLeave: () => remove(assignedId),
            },
            {
              default: () =>
                h('div', { class: 'space-y-3' }, [
                  args.message
                    ? h('p', { class: 'text-p-base text-ink-gray-7' }, args.message)
                    : null,
                  ...args.fields.map((field) =>
                    h(FormControl, {
                      key: field.name,
                      label: field.label,
                      description: field.description,
                      type: field.type || 'text',
                      required: field.required,
                      placeholder: field.placeholder,
                      options: field.options,
                      modelValue: values[field.name],
                      'onUpdate:modelValue': (val: any) => {
                        values[field.name] = val
                      },
                    }),
                  ),
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
  })
}

// -- namespace -----------------------------------------------------------

export const dialog = {
  confirm,
  alert,
  prompt,
}

export type DialogNamespace = typeof dialog
