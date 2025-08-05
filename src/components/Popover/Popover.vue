<template>
  <PopoverRoot v-model:open="isOpen" @update:open="onUpdateOpen">
    <PopoverAnchor asChild>
      <div
        ref="anchorRef"
        :class="['flex', $attrs.class]"
        @mouseover="onMouseover"
        @mouseleave="onMouseleave"
      >
        <slot
          name="target"
          v-bind="{
            togglePopover,
            updatePosition,
            open,
            close,
            isOpen,
          }"
        />
      </div>
    </PopoverAnchor>
    <PopoverPortal>
      <PopoverContent
        :side="placementSide"
        :align="placementAlign"
        :style="{
          minWidth: 'var(--reka-popover-trigger-width)',
        }"
        class="PopoverContent"
        :class="{ 'has-transition': hasTransition }"
        @mouseover="
          () => {
            pointerOverTargetOrPopup = true
          }
        "
        @mouseleave="onMouseleave"
        @interact-outside="onInteractOutside"
      >
        <div class="relative" :class="['body-container', popoverClass]">
          <slot
            name="body"
            v-bind="{ togglePopover, updatePosition, open, close, isOpen }"
          >
            <div class="rounded-lg border bg-surface-modal shadow-xl">
              <slot
                name="body-main"
                v-bind="{
                  togglePopover,
                  updatePosition,
                  open,
                  close,
                  isOpen,
                }"
              />
            </div>
          </slot>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import {
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
} from 'reka-ui'
import { PopoverProps } from './types'

const props = withDefaults(defineProps<PopoverProps>(), {
  show: undefined,
  trigger: 'click',
  hoverDelay: 0,
  leaveDelay: 0.5,
  placement: 'bottom-start',
  popoverClass: '',
  transition: null,
  hideOnBlur: true,
})

const emit = defineEmits<{
  (event: 'open'): void
  (event: 'close'): void
  (event: 'update:show', value: boolean): void
}>()

defineExpose({ open, close })

defineOptions({
  inheritAttrs: false,
})

const _isOpen = ref(false)
const pointerOverTargetOrPopup = ref(false)
const hoverTimer = ref<number | null>(null)
const leaveTimer = ref<number | null>(null)
const anchorRef = ref<HTMLElement | null>(null)

const isOpen = computed({
  get: () => (isShowPropPassed.value ? props.show : _isOpen.value),
  set: (value: boolean) => {
    if (!isShowPropPassed.value) {
      _isOpen.value = value
    }
    emit('update:show', value)
  },
})

const isShowPropPassed = computed(() => {
  return props.show !== undefined
})

const placementSide = computed(() => {
  const [side] = props.placement.split('-')
  return side as 'top' | 'right' | 'bottom' | 'left'
})

const placementAlign = computed(() => {
  const [, align] = props.placement.split('-')
  if (!align) return 'center'
  return align as 'start' | 'center' | 'end'
})

function togglePopover(flag?: boolean | Event) {
  if (flag instanceof Event) {
    flag = undefined
  }
  if (flag == null) {
    flag = !isOpen.value
  }
  flag = Boolean(flag)
  if (flag) {
    open()
  } else {
    close()
  }
}

function updatePosition() {
  // not needed
}

function open() {
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function onUpdateOpen(value: boolean) {
  emit('update:show', value)
  if (value) {
    emit('open')
  } else {
    emit('close')
  }
}

function onMouseover() {
  pointerOverTargetOrPopup.value = true
  if (leaveTimer.value) {
    clearTimeout(leaveTimer.value)
    leaveTimer.value = null
  }
  if (props.trigger === 'hover') {
    if (props.hoverDelay) {
      hoverTimer.value = setTimeout(
        () => {
          if (pointerOverTargetOrPopup.value) {
            open()
          }
        },
        Number(props.hoverDelay) * 1000,
      ) as unknown as number
    } else {
      open()
    }
  }
}

function onMouseleave() {
  pointerOverTargetOrPopup.value = false
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }
  if (props.trigger === 'hover') {
    if (leaveTimer.value) {
      clearTimeout(leaveTimer.value)
    }
    if (props.leaveDelay) {
      leaveTimer.value = setTimeout(
        () => {
          if (!pointerOverTargetOrPopup.value) {
            close()
          }
        },
        Number(props.leaveDelay) * 1000,
      ) as unknown as number
    } else {
      if (!pointerOverTargetOrPopup.value) {
        close()
      }
    }
  }
}

function onInteractOutside(event: Event) {
  if (!props.hideOnBlur) {
    event.preventDefault()
    return
  }

  // Check if the click is on the trigger/anchor element
  const target = event.target as Element
  if (
    anchorRef.value &&
    (anchorRef.value.contains(target) || anchorRef.value === target)
  ) {
    event.preventDefault()
    return
  }
}

const hasTransition = computed(() => {
  return props.transition === 'default'
})

// Cleanup timers on unmount
onUnmounted(() => {
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
  }
  if (leaveTimer.value) {
    clearTimeout(leaveTimer.value)
  }
})
</script>

<style>
/* Default transition animations */
@keyframes popover-enter {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes popover-exit {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(4px);
  }
}

/* Default transition */
.PopoverContent.has-transition[data-state='open'] {
  animation: popover-enter 150ms ease-out;
}

.PopoverContent.has-transition[data-state='closed'] {
  animation: popover-exit 150ms ease-in;
}
</style>
