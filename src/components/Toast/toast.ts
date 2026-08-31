import DOMPurify from 'dompurify'
import { h, type Component, type VNode } from 'vue'
import { toast as sonnerToast } from 'vue-sonner'

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

// `description` gets the same limited inline HTML as the message. Sanitizing
// twice is harmless — `renderSafeHTML` returns non-strings untouched, so an
// already-wrapped render function passes straight through.
function withSafeDescription<T extends { description?: unknown } | undefined>(
  data: T,
): T {
  if (!data || data.description == null) return data
  return { ...data, description: renderSafeHTML(data.description) }
}

function dispatch(
  type: ToastType | undefined,
  message: string | Component | VNode,
  data: SonnerData,
) {
  const safeMessage = renderSafeHTML(message)
  data = withSafeDescription(data)
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

function toastFn(
  message: string | Component | VNode,
  options?: SonnerData,
) {
  return sonnerToast(renderSafeHTML(message), withSafeDescription(options))
}

// Every creator that takes a plain message is wrapped. Anything left to
// `Object.assign` from sonner's namespace would reach vue-sonner untouched and
// silently opt out of the contract above — `message` in particular, which the
// migration guide points `toast.create` callers at.
export const toast = Object.assign(toastFn, sonnerToast, {
  success: (message: string | Component | VNode, data?: SonnerData) =>
    dispatch('success', message, data),
  error: (message: string | Component | VNode, data?: SonnerData) =>
    dispatch('error', message, data),
  warning: (message: string | Component | VNode, data?: SonnerData) =>
    dispatch('warning', message, data),
  info: (message: string | Component | VNode, data?: SonnerData) =>
    dispatch('info', message, data),
  message: (message: string | Component | VNode, data?: SonnerData) =>
    sonnerToast.message(renderSafeHTML(message), withSafeDescription(data)),
  loading: (message: string | Component | VNode, data?: SonnerData) =>
    sonnerToast.loading(renderSafeHTML(message), withSafeDescription(data)),
  // `custom` takes a component, not a message, so only the description applies.
  custom: ((component: Parameters<typeof sonnerToast.custom>[0], data?: SonnerData) =>
    sonnerToast.custom(component, withSafeDescription(data))) as typeof sonnerToast.custom,
  // `promise` keys its strings by state rather than taking a message, and
  // `success`/`error` may be async functions. Only `description` is covered;
  // the state strings render as vue-sonner renders them.
  promise: ((
    promise: Parameters<typeof sonnerToast.promise>[0],
    data?: Parameters<typeof sonnerToast.promise>[1],
  ) =>
    sonnerToast.promise(promise, withSafeDescription(data))) as typeof sonnerToast.promise,
}) as typeof sonnerToast
