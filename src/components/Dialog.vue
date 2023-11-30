<template>
  <TransitionRoot
    as="template"
    :show="open"
    @after-leave="$emit('after-leave')"
  >
    <HDialog as="div" class="fixed inset-0 z-10 overflow-y-auto" @close="close">
      <div
        class="flex min-h-screen flex-col items-center px-4 py-4 text-center"
        :class="dialogPositionClasses"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-150"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-150"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-black-overlay-200 transition-opacity"
            :data-dialog="options.title"
          />
        </TransitionChild>

        <TransitionChild
          as="template"
          enter="ease-out duration-150"
          enter-from="opacity-50 translate-y-2 scale-95"
          enter-to="opacity-100 translate-y-0 scale-100"
          leave="ease-in duration-150"
          leave-from="opacity-100 translate-y-0 scale-100"
          leave-to="opacity-50 translate-y-4 translate-y-4 scale-95"
        >
          <DialogPanel
            class="my-8 inline-block w-full transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all"
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
                <div class="bg-white px-4 pb-6 pt-5 sm:px-6">
                  <div class="flex">
                    <div class="flex-1">
                      <div class="mb-6 flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                          <div
                            v-if="icon"
                            class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
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
                              class="h-4 w-4"
                              :class="{
                                'text-gray-600': !icon.appearance,
                                'text-yellow-600':
                                  icon.appearance === 'warning',
                                'text-blue-600': icon.appearance === 'info',
                                'text-red-600': icon.appearance === 'danger',
                                'text-green-600': icon.appearance === 'success',
                              }"
                              aria-hidden="true"
                            />
                          </div>
                          <DialogTitle as="header">
                            <slot name="body-title">
                              <h3
                                class="text-2xl font-semibold leading-6 text-gray-900"
                              >
                                {{ options.title || 'Untitled' }}
                              </h3>
                            </slot>
                          </DialogTitle>
                        </div>
                        <Button variant="ghost" @click="close">
                          <template #icon>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M12.8567 3.85355C13.052 3.65829 13.052 3.34171 12.8567 3.14645C12.6615 2.95118 12.3449 2.95118 12.1496 3.14645L8.00201 7.29405L3.85441 3.14645C3.65914 2.95118 3.34256 2.95118 3.1473 3.14645C2.95204 3.34171 2.95204 3.65829 3.1473 3.85355L7.29491 8.00116L3.14645 12.1496C2.95118 12.3449 2.95118 12.6615 3.14645 12.8567C3.34171 13.052 3.65829 13.052 3.85355 12.8567L8.00201 8.70827L12.1505 12.8567C12.3457 13.052 12.6623 13.052 12.8576 12.8567C13.0528 12.6615 13.0528 12.3449 12.8576 12.1496L8.70912 8.00116L12.8567 3.85355Z"
                                fill="#383838"
                              />
                            </svg>
                          </template>
                        </Button>
                      </div>

                      <slot name="body-content">
                        <p
                          class="text-p-base text-gray-700"
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
                class="px-4 pb-7 pt-4 sm:px-6"
                v-if="dialogActions.length || $slots.actions"
              >
                <slot name="actions" v-bind="{ close }">
                  <div class="space-y-2">
                    <Button
                      class="w-full"
                      v-for="action in dialogActions"
                      :key="action.label"
                      v-bind="action"
                    >
                      {{ action.label }}
                    </Button>
                  </div>
                </slot>
              </div>
            </slot>
          </DialogPanel>
        </TransitionChild>
      </div>
    </HDialog>
  </TransitionRoot>
</template>

<script>
import { computed, ref } from 'vue'
import {
  Dialog as HDialog,
  DialogPanel,
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
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    Button,
    FeatherIcon,
  },
  data() {
    return {
      dialogActions: [],
    }
  },
  watch: {
    'options.actions': {
      handler(actions) {
        if (!actions) return
        this.dialogActions = actions.map((action) => {
          let loading = ref(false)
          return {
            ...action,
            loading,
            onClick: !action.onClick
              ? this.close
              : async () => {
                  loading.value = true
                  try {
                    await action.onClick(this.close)
                  } finally {
                    loading.value = false
                  }
                },
          }
        })
      },
      immediate: true,
    },
  },
  methods: {
    close() {
      this.open = false
    },
  },
  computed: {
    open: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
        if (!val) {
          this.$emit('close')
        }
      },
    },
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
