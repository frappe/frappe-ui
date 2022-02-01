<template>
  <TransitionRoot as="template" :show="open">
    <Dialog
      as="div"
      class="fixed inset-0 z-10 overflow-y-auto"
      @close="open = false"
    >
      <div
        class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay
            class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:-translate-y-12 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          >
            <slot name="dialog-body">
              <slot name="dialog-main">
                <div class="px-4 py-5 bg-white sm:p-6">
                  <div>
                    <div
                      v-if="icon"
                      class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto mb-3 rounded-full sm:mx-0 sm:h-10 sm:w-10 sm:mb-0 sm:mr-4"
                      :class="{
                        'bg-yellow-100': icon.type === 'warning',
                        'bg-blue-100': icon.type === 'info',
                        'bg-red-100': icon.type === 'danger',
                        'bg-green-100': icon.type === 'success',
                      }"
                    >
                      <FeatherIcon
                        :name="icon.name"
                        class="w-6 h-6 text-red-600"
                        :class="{
                          'text-yellow-600': icon.type === 'warning',
                          'text-blue-600': icon.type === 'info',
                          'text-red-600': icon.type === 'danger',
                          'text-green-600': icon.type === 'success',
                        }"
                        aria-hidden="true"
                      />
                    </div>
                    <div class="text-center sm:text-left">
                      <DialogTitle
                        as="h3"
                        class="text-lg font-medium leading-6 text-gray-900"
                      >
                        {{ options.title || 'Untitled' }}
                      </DialogTitle>
                      <div class="mt-2">
                        <slot name="dialog-content">
                          <p
                            class="text-sm text-gray-500"
                            v-if="options.message"
                          >
                            {{ options.message }}
                          </p>
                        </slot>
                      </div>
                    </div>
                  </div>
                </div>
              </slot>
              <div
                class="px-4 py-3 space-y-2 sm:space-x-reverse sm:space-x-3 sm:space-y-0 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse"
                v-if="options?.actions || $slots['dialog-actions']"
              >
                <slot
                  name="dialog-actions"
                  v-bind="{ close: () => (open = false) }"
                >
                  <button
                    v-for="action in options.actions"
                    :key="action.label"
                    type="button"
                    class="inline-flex justify-center w-full px-4 py-2 text-base font-medium border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm"
                    :class="{
                      'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-primary-500':
                        !action.type || action.type === 'default',
                      'text-white bg-yellow-600 border-transparent hover:bg-yellow-700 focus:ring-yellow-500':
                        action.type === 'warning',
                      'text-white bg-blue-600 border-transparent hover:bg-blue-700 focus:ring-blue-500':
                        action.type === 'info',
                      'text-white bg-red-600 border-transparent hover:bg-red-700 focus:ring-red-500':
                        action.type === 'danger',
                      'text-white bg-green-600 border-transparent hover:bg-green-700 focus:ring-green-500':
                        action.type === 'success',
                    }"
                    @click="
                      () => {
                        if (action.action && action.action === 'cancel') {
                          open = false
                        } else {
                          action.action()
                        }
                      }
                    "
                  >
                    {{ action.label }}
                  </button>
                </slot>
              </div>
            </slot>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

export default {
  name: 'NewDialog',
  props: ['modelValue', 'options'],
  emits: ['update:modelValue'],
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
  },
  setup(props, { emit }) {
    let open = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val),
    })
    return {
      open,
    }
  },
  computed: {
    icon() {
      if (!this.options?.icon) return null

      let icon = this.options.icon
      if (typeof icon === 'string') {
        icon = {
          name: icon,
          type: 'info',
        }
      }
      return icon
    },
  },
}
</script>
