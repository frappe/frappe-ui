<template>
  <DialogRoot v-model:open="isOpen" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 bg-black-overlay-200 backdrop-filter backdrop-blur-[12px] overflow-y-auto dialog-overlay outline-none"
        :data-dialog="options.title"
        @after-leave="$emit('after-leave')"
      >
        <div
          class="flex min-h-screen flex-col items-center px-4 py-4 text-center"
          :class="dialogPositionClasses"
          :style="dialogPositionStyles"
        >
          <DialogContent
            class="my-8 inline-block w-full transform overflow-hidden rounded-xl bg-surface-modal text-left align-middle shadow-xl dialog-content focus-visible:outline-none"
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
            @escape-key-down="close()"
            @interact-outside="
              (e: Event) => {
                if (props.disableOutsideClickToClose) {
                  e.preventDefault()
                }
              }
            "
          >
            <slot name="body">
              <slot name="body-main">
                <div class="bg-surface-modal px-4 pb-6 pt-5 sm:px-6">
                  <div class="flex">
                    <div class="w-full flex-1">
                      <slot name="body-header">
                        <div class="mb-6 flex items-center justify-between">
                          <div class="flex items-center space-x-2">
                            <div
                              v-if="icon"
                              class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                              :class="dialogIconBgClasses"
                            >
                              <FeatherIcon
                                :name="icon.name"
                                class="h-4 w-4"
                                :class="dialogIconClasses"
                                aria-hidden="true"
                              />
                            </div>
                            <DialogTitle as="header">
                              <slot name="body-title">
                                <h3
                                  class="text-2xl font-semibold leading-6 text-ink-gray-9"
                                >
                                  {{ options.title || 'Untitled' }}
                                </h3>
                              </slot>
                            </DialogTitle>
                          </div>
                          <DialogClose as-child>
                            <Button variant="ghost" @click="close">
                              <template #icon>
                                <LucideX class="h-4 w-4 text-ink-gray-9" />
                              </template>
                            </Button>
                          </DialogClose>
                        </div>
                      </slot>

                      <slot name="body-content">
                        <DialogDescription as-child v-if="options.message">
                          <p class="text-p-base text-ink-gray-7">
                            {{ options.message }}
                          </p>
                        </DialogDescription>
                      </slot>
                    </div>
                  </div>
                </div>
              </slot>
              <div
                class="px-4 pb-7 pt-4 sm:px-6"
                v-if="actions.length || $slots.actions"
              >
                <slot name="actions" v-bind="{ close }">
                  <div class="space-y-2">
                    <Button
                      class="w-full"
                      v-for="action in actions"
                      :key="action.label"
                      :disabled="action.disabled"
                      v-bind="action"
                    >
                      {{ action.label }}
                    </Button>
                  </div>
                </slot>
              </div>
            </slot>
          </DialogContent>
        </div>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'reka-ui'
import { computed, reactive } from 'vue'
import { Button } from '../Button'
import FeatherIcon from '../FeatherIcon.vue'
import LucideX from '~icons/lucide/x'
import type {
  DialogProps,
  DialogIcon,
  DialogAction,
  DialogActionContext,
} from './types'

// Type for dialog action with reactive loading state
type ReactiveDialogAction = DialogAction & {
  loading: boolean
}

const props = withDefaults(defineProps<DialogProps>(), {
  options: () => ({}),
  disableOutsideClickToClose: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'close'): void
  (event: 'after-leave'): void
}>()

const actions = computed((): ReactiveDialogAction[] => {
  let actions = props.options.actions
  if (!actions?.length) return []

  return actions.map((action) => {
    let _action = reactive({
      ...action,
      loading: false,
      onClick: !action.onClick
        ? close
        : async () => {
            _action.loading = true
            try {
              if (action.onClick) {
                // deprecated: uncomment this when we remove the backwards compatibility
                // let context: DialogActionContext = { close }
                type BackwardsCompatibleDialogActionContext = (() => void) &
                  DialogActionContext

                let backwardsCompatibleContext = (() => {
                  console.warn(
                    'Value passed to onClick is a context object. Please use context.close() instead of context() to close the dialog.',
                  )
                  close()
                }) as BackwardsCompatibleDialogActionContext
                backwardsCompatibleContext.close = close
                await action.onClick(backwardsCompatibleContext)
              }
            } finally {
              _action.loading = false
            }
          },
    })
    return _action
  })
})

const isOpen = computed({
  get() {
    return props.modelValue
  },
  set(val: boolean) {
    emit('update:modelValue', val)
    if (!val) {
      emit('close')
    }
  },
})

function handleOpenChange(open: boolean) {
  isOpen.value = open
}

function close() {
  isOpen.value = false
}

const icon = computed(() => {
  if (!props.options?.icon) return null

  let icon = props.options.icon
  if (typeof icon === 'string') {
    icon = { name: icon }
  }
  return icon as DialogIcon
})

const dialogPositionClasses = computed(() => {
  if (props.options?.paddingTop) return ''

  const position = props.options?.position || 'center'
  const classMap: Record<string, string> = {
    center: 'justify-center',
    top: 'pt-[20vh]',
  }
  return classMap[position]
})

const dialogPositionStyles = computed(() => {
  if (props.options?.paddingTop) {
    return { paddingTop: props.options.paddingTop }
  }
  return {}
})

const dialogIconBgClasses = computed(() => {
  const appearance = icon.value?.appearance
  if (!appearance) return 'bg-surface-gray-2'
  const classMap: Record<string, string> = {
    warning: 'bg-surface-amber-2',
    info: 'bg-surface-blue-2',
    danger: 'bg-surface-red-2',
    success: 'bg-surface-green-2',
  }
  return classMap[appearance]
})

const dialogIconClasses = computed(() => {
  const appearance = icon.value?.appearance
  if (!appearance) return 'text-ink-gray-5'
  const classMap: Record<string, string> = {
    warning: 'text-ink-amber-3',
    info: 'text-ink-blue-3',
    danger: 'text-ink-red-4',
    success: 'text-ink-green-3',
  }
  return classMap[appearance]
})
</script>

<style scoped>
@keyframes dialog-overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes dialog-overlay-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes dialog-content-in {
  from {
    opacity: 0.5;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes dialog-content-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0.5;
    transform: scale(0.98);
  }
}

:global(.dialog-overlay[data-state='open']) {
  animation: dialog-overlay-in 100ms ease-out;
}

:global(.dialog-overlay[data-state='closed']) {
  animation: dialog-overlay-out 150ms ease-in;
}

:global(.dialog-content[data-state='open']) {
  animation: dialog-content-in 100ms ease-out;
}

:global(.dialog-content[data-state='closed']) {
  animation: dialog-content-out 150ms ease-in;
}
</style>
