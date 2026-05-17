import { h, isVNode, type Component, type VNode } from 'vue'
import { toast as sonnerToast } from 'vue-sonner'
import FeatherIcon from '../FeatherIcon.vue'
import { warnDeprecated } from '../../utils/warnDeprecated'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface LegacyCreateOptions {
  id?: string | number
  message: string
  type?: ToastType
  icon?: string | Component | VNode | (() => VNode)
  duration?: number
  closable?: boolean
  action?: { label: string; onClick: () => void; altText?: string }
}

interface LegacyToastObject {
  title?: string
  text?: string
  message?: string
  icon?: string | Component | VNode | (() => VNode)
  iconClasses?: string
  position?: string
  timeout?: number
  duration?: number
  type?: ToastType
}

const TOAST_DOCS = 'https://ui.frappe.io/docs/components/toast'

function toMs(seconds?: number): number | undefined {
  if (seconds == null) return undefined
  return seconds * 1000
}

function resolveIcon(
  icon: LegacyCreateOptions['icon'],
  iconClasses?: string,
): Component | undefined {
  if (icon == null) return undefined
  if (typeof icon === 'string') {
    return () => h(FeatherIcon, { name: icon, class: iconClasses })
  }
  if (isVNode(icon)) {
    return () => icon
  }
  return icon as Component
}

function isLegacyObject(arg: unknown): arg is LegacyToastObject {
  if (!arg || typeof arg !== 'object') return false
  const o = arg as Record<string, unknown>
  return 'title' in o || 'text' in o || 'message' in o
}

function dispatch(
  type: ToastType | undefined,
  message: string,
  data: Parameters<typeof sonnerToast>[1],
) {
  switch (type) {
    case 'success':
      return sonnerToast.success(message, data)
    case 'error':
      return sonnerToast.error(message, data)
    case 'warning':
      return sonnerToast.warning(message, data)
    case 'info':
      return sonnerToast.info(message, data)
    default:
      return sonnerToast(message, data)
  }
}

function callLegacyObject(o: LegacyToastObject) {
  warnDeprecated(
    `toast({ title, text })`,
    `toast(title, { description: text })`,
    TOAST_DOCS,
  )
  if (o.position) {
    warnDeprecated(
      `toast({ position })`,
      `<ToastProvider /> (position is set globally, not per-toast)`,
      TOAST_DOCS,
    )
  }
  const title = o.title ?? o.message ?? ''
  return dispatch(o.type, title, {
    description: o.text,
    icon: resolveIcon(o.icon, o.iconClasses),
    duration: toMs(o.timeout ?? o.duration),
  })
}

function toastFn(
  message: string | LegacyToastObject,
  options?: Parameters<typeof sonnerToast>[1],
) {
  if (isLegacyObject(message)) {
    return callLegacyObject(message)
  }
  return sonnerToast(message as string, options)
}

function create(options: LegacyCreateOptions) {
  warnDeprecated(
    `toast.create({ message, type })`,
    `toast.success(message) / toast.error(message) / toast(message)`,
    TOAST_DOCS,
  )
  const { message, type, icon, duration, action, closable, id } = options
  return dispatch(type, message, {
    id,
    duration: toMs(duration),
    action,
    icon: resolveIcon(icon),
    closeButton: closable,
  })
}

function remove(id: string | number) {
  warnDeprecated(`toast.remove(id)`, `toast.dismiss(id)`, TOAST_DOCS)
  return sonnerToast.dismiss(id)
}

function removeAll() {
  warnDeprecated(`toast.removeAll()`, `toast.dismiss()`, TOAST_DOCS)
  return sonnerToast.dismiss()
}

export const toast = Object.assign(toastFn, sonnerToast, {
  create,
  remove,
  removeAll,
}) as typeof sonnerToast & {
  (
    message: string | LegacyToastObject,
    options?: Parameters<typeof sonnerToast>[1],
  ): string | number
  create: typeof create
  remove: typeof remove
  removeAll: typeof removeAll
}
