import DOMPurify from 'dompurify'
import { h, isVNode, type Component, type VNode } from 'vue'
import { toast as sonnerToast } from 'vue-sonner'
import { warnDeprecated } from '../../utils/warnDeprecated'

type ToastType = 'success' | 'error' | 'warning' | 'info'

type SonnerData = Parameters<typeof sonnerToast>[1]

// Tags that are safe to render inside a toast message. Anything outside this set is stripped by DOMPurify.
const ALLOWED_TAGS = ['a', 'em', 'strong', 'i', 'b', 'u']

// Sonner renders a string message as plain text and a VNode via
// `<component :is>`. To render safe HTML we sanitize the string and return a
// render function; non-string values (already VNodes/components) pass through.
function renderSafeHTML<T>(message: T): T | (() => VNode) {
  if (typeof message !== 'string') return message
  const html = DOMPurify.sanitize(message, { ALLOWED_TAGS })
  return () => h('span', { innerHTML: html })
}

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
  // Legacy "no timeout" idiom: duration/timeout: 0 meant persistent in
  // reka-ui's Toast.vue (`:duration="closable ? duration : 0"`). Sonner
  // treats 0 as "close immediately", so map it to Infinity.
  if (seconds === 0) return Infinity
  return seconds * 1000
}

function resolveIcon(
  icon: LegacyCreateOptions['icon'],
  iconClasses?: string,
): Component | undefined {
  if (icon == null) return undefined
  if (typeof icon === 'string') {
    const className = ['lucide-' + icon, 'size-4', iconClasses]
      .filter(Boolean)
      .join(' ')
    return () => h('span', { class: className })
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
  message: string | Component | VNode,
  data: SonnerData,
) {
  const safeMessage = renderSafeHTML(message)
  switch (type) {
    case 'success':
      return sonnerToast.success(safeMessage, data)
    case 'error':
      return sonnerToast.error(safeMessage, data)
    case 'warning':
      return sonnerToast.warning(safeMessage, data)
    case 'info':
      return sonnerToast.info(safeMessage, data)
    default:
      return sonnerToast(safeMessage, data)
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
  return sonnerToast(renderSafeHTML(message as string), options)
}

function create(options: LegacyCreateOptions) {
  warnDeprecated(
    `toast.create({ message, type })`,
    `toast.success(message) / toast.error(message) / toast(message)`,
    TOAST_DOCS,
  )
  const { message, type, icon, duration, action, closable, id } = options
  // closable: false in reka-ui meant fully locked: no × button, no
  // auto-dismiss, no user interaction. Sonner splits those into three
  // separate flags — preserve all three so the helpdesk loading-indicator
  // pattern can't be swiped away or click-dismissed.
  return dispatch(type, message, {
    id,
    duration: closable === false ? Infinity : toMs(duration),
    action,
    icon: resolveIcon(icon),
    closeButton: closable,
    dismissible: closable !== false,
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
  success: (message: string | Component | VNode, data?: SonnerData) =>
    dispatch('success', message, data),
  error: (message: string | Component | VNode, data?: SonnerData) =>
    dispatch('error', message, data),
  warning: (message: string | Component | VNode, data?: SonnerData) =>
    dispatch('warning', message, data),
  info: (message: string | Component | VNode, data?: SonnerData) =>
    dispatch('info', message, data),
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
