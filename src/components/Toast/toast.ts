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

// Item 6: `description` gets the same limited inline HTML as the message.
// Sanitizing twice is harmless — `renderSafeHTML` returns non-strings
// untouched, so an already-wrapped render function passes straight through.
function withSafeDescription(data: SonnerData): SonnerData {
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

export const toast = Object.assign(toastFn, sonnerToast, {
  success: (message: string | Component | VNode, data?: SonnerData) =>
    dispatch('success', message, data),
  error: (message: string | Component | VNode, data?: SonnerData) =>
    dispatch('error', message, data),
  warning: (message: string | Component | VNode, data?: SonnerData) =>
    dispatch('warning', message, data),
  info: (message: string | Component | VNode, data?: SonnerData) =>
    dispatch('info', message, data),
}) as typeof sonnerToast
