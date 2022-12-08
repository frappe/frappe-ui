<template>
  <TransitionRoot
    as="template"
    :show="open"
    @after-leave="$emit('after-leave')"
  >
    <HDialog
      as="div"
      class="fixed inset-0 z-10 overflow-y-auto"
      @close="open = false"
    >
      <div
        class="flex min-h-screen flex-col items-center px-4 py-4 text-center"
        :class="dialogPositionClasses"
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
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          />
        </TransitionChild>

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
            class="my-8 inline-block w-full transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all"
            :class="{
              'max-w-7xl': options.size === '7xl',
              'max-w-6xl': options.size === '6xl',
              'max-w-5xl': options.size === '5xl',
              'max-w-4xl': options.size === '4xl',
              'max-w-3xl': options.size === '3xl',
              'max-w-2xl': options.size === '2xl',
              'max-w-xl': options.size === 'xl',
              'max-w-lg': options.size === 'lg' || !options.size,
              'max-w-md': options.size === 'md',
              'max-w-sm': options.size === 'sm',
              'max-w-xs': options.size === 'xs',
            }"
          >
            <slot name="body">
              <slot name="body-main">
                <div class="bg-white px-4 py-5 sm:p-6">
                  <div class="flex flex-col sm:flex-row">
                    <div
                      v-if="icon"
                      class="mx-auto mb-3 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:mb-0 sm:mr-4 sm:h-9 sm:w-9"
                      :class="{
                        'bg-gray-100': !icon.appearance,
                        'bg-yellow-100': icon.appearance === 'warning',
                        'bg-blue-100': icon.appearance === 'info',
                        'bg-red-100': icon.appearance === 'danger',
                        'bg-green-100': icon.appearance === 'success',
                      }"
                    >
                      <FeatherIcon
                        :name="icon.name"
                        class="h-6 w-6 sm:h-5 sm:w-5"
                        :class="{
                          'text-gray-600': !icon.appearance,
                          'text-yellow-600': icon.appearance === 'warning',
                          'text-blue-600': icon.appearance === 'info',
                          'text-red-600': icon.appearance === 'danger',
                          'text-green-600': icon.appearance === 'success',
                        }"
                        aria-hidden="true"
                      />
                    </div>
                    <div class="flex-1">
                      <DialogTitle as="header">
                        <slot name="body-title">
                          <h3
                            class="mb-2 text-lg font-medium leading-6 text-gray-900"
                          >
                            {{ options.title || 'Untitled' }}
                          </h3>
                        </slot>
                      </DialogTitle>

                      <slot name="body-content">
                        <p
                          class="text-base text-gray-600"
                          v-if="options.message"
                        >
                          {{ options.message }}
                        </p>
                      </slot>
                    </div>
                  </div>
                </div>
              </slot>
              <div
                class="space-y-2 bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:space-x-3 sm:space-y-0 sm:space-x-reverse sm:px-6"
                v-if="options?.actions || $slots.actions"
              >
                <slot name="actions" v-bind="{ close: () => (open = false) }">
                  <Button
                    class="w-full sm:w-max"
                    v-for="action in options.actions"
                    :key="action.label"
                    :loading="action.loading"
                    v-bind="action"
                    @click="handleAction(action)"
                  >
                    {{ action.label }}
                  </Button>
                </slot>
              </div>
            </slot>
          </div>
        </TransitionChild>
      </div>
    </HDialog>
  </TransitionRoot>
</template>

<script>
import { computed } from 'vue'
import {
  Dialog as HDialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import Button from './Button.vue'
import FeatherIcon from './FeatherIcon.vue'

export default {
  name: 'Dialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    options: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  emits: ['update:modelValue', 'close', 'after-leave'],
  components: {
    HDialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    Button,
    FeatherIcon,
  },
  setup(props, { emit }) {
    let open = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit('update:modelValue', val)
        if (!val) {
          emit('close')
        }
      },
    })
    return {
      open,
    }
  },
  methods: {
    handleAction(action) {
      let close = () => (this.open = false)
      if (action.handler && typeof action.handler === 'function') {
        action.loading = true
        let result = action.handler({ close })
        if (result && result.then) {
          result.then(() => (action.loading = false))
        } else {
          action.loading = false
        }
      } else {
        close()
      }
    },
  },
  computed: {
    icon() {
      if (!this.options?.icon) return null

      let icon = this.options.icon
      if (typeof icon === 'string') {
        icon = { name: icon }
      }
      return icon
    },
    dialogPositionClasses() {
      let position = this.options?.position || 'center'
      return {
        'justify-center': position === 'center',
        'pt-[20vh]': position === 'top',
      }
    },
  },
}
</script>
