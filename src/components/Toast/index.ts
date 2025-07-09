import DOMPurify from 'dompurify'
import { defineComponent, h, ref, Ref } from 'vue'
import LoadingIndicator from '../LoadingIndicator.vue'
import ToastComponent from './Toast.vue'
import type { ToastProps } from './types'

interface ToastOptions
  extends Omit<Partial<ToastProps>, 'open' | 'message' | 'title'> {
  id?: string
  message: string
}

interface ToastItem
  extends Pick<
    ToastProps,
    'duration' | 'action' | 'type' | 'icon' | 'closable'
  > {
  id: string
  open: boolean
  message: string
}

interface ToastPromiseOptions<TData = any, TError = any> {
  loading: string
  /** Message for success state, or a function that returns a message. */
  success: string | ((data: TData) => string)
  /** Message for error state, or a function that returns a message. */
  error: string | ((error: TError) => string)
  /** Optional: Duration in seconds for the success toast. Defaults to 5 seconds. */
  successDuration?: number
  /** Optional: Duration in seconds for the error toast. Defaults to 5 seconds. */
  errorDuration?: number
  /** Optional: Common duration in seconds for all toast states, unless overridden by successDuration or errorDuration. */
  duration?: number
}

const toastsState: Ref<ToastItem[]> = ref([])
let toastIdCounter = 0

const updateToastInState = (
  id: string,
  updates: Partial<Omit<ToastItem, 'id'>>,
) => {
  const index = toastsState.value.findIndex((t) => t.id === id)
  if (index !== -1) {
    toastsState.value[index] = {
      ...toastsState.value[index],
      ...updates,
      open: true,
    }
  }
}

export const toast = {
  create: (options: ToastOptions): string => {
    const id = `toast-${toastIdCounter++}`
    const durationInMs =
      options.duration != null ? options.duration * 1000 : 5000

    const sanitizedMessage = DOMPurify.sanitize(options.message, {
      ALLOWED_TAGS: ['a', 'em', 'strong', 'i', 'b', 'u'],
    })

    const toastItem: ToastItem = {
      id: options.id || id,
      open: true,
      message: sanitizedMessage,
      type: options.type || 'info',
      duration: durationInMs,
      action: options.action,
      icon: options.icon,
      closable: options.closable ?? true,
    }
    toastsState.value.push(toastItem)
    return toastItem.id
  },
  remove: (id: string) => {
    toastsState.value = toastsState.value.filter((t) => t.id !== id)
  },
  removeAll: () => {
    toastsState.value = []
  },

  promise: async <TData = any, TError = any>(
    promiseToResolve: Promise<TData>,
    options: ToastPromiseOptions<TData, TError>,
  ): Promise<TData> => {
    const loadingDurationInSeconds = options.duration ?? 0

    const toastId = toast.create({
      message: options.loading,
      type: 'info',
      icon: () => h(LoadingIndicator, { class: 'text-ink-white' }),
      duration: loadingDurationInSeconds,
      closable: false,
    })

    try {
      const data = await promiseToResolve
      const successMessage =
        typeof options.success === 'function'
          ? options.success(data)
          : options.success

      const successToastDurationInSeconds =
        options.successDuration ?? options.duration ?? 5

      updateToastInState(toastId, {
        message: successMessage,
        type: 'success',
        duration: successToastDurationInSeconds * 1000,
        icon: undefined,
        closable: true,
      })
      return data
    } catch (error) {
      const errorMessage =
        typeof options.error === 'function'
          ? options.error(error as TError)
          : options.error

      const errorToastDurationInSeconds =
        options.errorDuration ?? options.duration ?? 5

      updateToastInState(toastId, {
        message: errorMessage,
        type: 'error',
        duration: errorToastDurationInSeconds * 1000,
        icon: undefined,
        closable: true,
      })
      throw error
    }
  },

  success: (
    message: string,
    options: Omit<ToastOptions, 'message' | 'type'> = {},
  ) => toast.create({ message, type: 'success', ...options }),
  error: (
    message: string,
    options: Omit<ToastOptions, 'message' | 'type'> = {},
  ) => toast.create({ message, type: 'error', ...options }),
  warning: (
    message: string,
    options: Omit<ToastOptions, 'message' | 'type'> = {},
  ) => toast.create({ message, type: 'warning', ...options }),
  info: (
    message: string,
    options: Omit<ToastOptions, 'message' | 'type'> = {},
  ) => toast.create({ message, type: 'info', ...options }),
}

export const Toasts = defineComponent({
  name: 'FrappeToasts',
  setup() {
    const handleUpdateOpen = (id: string, isOpen: boolean) => {
      if (!isOpen) {
        toast.remove(id)
      } else {
        const t = toastsState.value.find((item) => item.id === id)
        if (t) t.open = true
      }
    }

    const handleActionForItem = (toastItem: ToastItem) => {
      toast.remove(toastItem.id)
    }

    return () =>
      toastsState.value.map((t) =>
        h(ToastComponent, {
          key: t.id,
          open: t.open,
          message: t.message,
          type: t.type,
          duration: t.duration,
          action: t.action,
          icon: t.icon,
          closable: t.closable,
          'onUpdate:open': (isOpen) => handleUpdateOpen(t.id, isOpen),
          onAction: () => handleActionForItem(t),
        }),
      )
  },
})
