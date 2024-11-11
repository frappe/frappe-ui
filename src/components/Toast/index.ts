import { markRaw } from 'vue'
import Toast from './Toast.vue'
import { toast as _toast } from 'vue-sonner'

export { Toaster } from 'vue-sonner'

export function toast(...args) {
  return _toast.custom(markRaw(Toast), ...args)
}
