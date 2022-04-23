<template>
  <teleport to="#frappeui-toast-root">
    <transition :name="position.includes('top') ? 'toast-top' : 'toast-bottom'">
      <div
        v-if="shown"
        :style="style"
        :class="[
          'absolute transition duration-200 ease-out m-4 pointer-events-auto',
          position.includes('center') ? '-translate-x-1/2' : '',
        ]"
      >
        <div
          class="px-2.5 py-2 bg-white border rounded-lg shadow-md min-w-[15rem]"
        >
          <div class="flex items-center justify-between">
            <div class="text-lg">
              <slot> Toast Content </slot>
            </div>
            <div>
              <slot name="actions">
                <Button icon="x" @click="shown = false" />
              </slot>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script>
const positions = [
  'top-right',
  'top-center',
  'top-left',
  'bottom-right',
  'bottom-center',
  'bottom-left',
]

export default {
  name: 'Toast',
  props: {
    position: {
      type: String,
      default: 'top-right',
    },
    text: {
      type: String,
    },
  },
  created() {
    if (!document.getElementById('frappeui-toast-root')) {
      const root = document.createElement('div')
      root.id = 'frappeui-toast-root'
      root.style.position = 'fixed'
      root.style.top = '16px'
      root.style.right = '16px'
      root.style.bottom = '16px'
      root.style.left = '16px'
      root.style.zIndex = '9999'
      root.style.pointerEvents = 'none'
      document.body.appendChild(root)
    }
  },
  mounted() {
    this.shown = true
    // setTimeout(() => {
    //   this.shown = false
    // }, 3000)
  },
  data() {
    return {
      shown: false,
    }
  },
  computed: {
    style() {
      let style = {}
      if (this.position.includes('top')) {
        style.top = 0
      }
      if (this.position.includes('bottom')) {
        style.bottom = 0
      }
      if (this.position.includes('right')) {
        style.right = 0
      }
      if (this.position.includes('left')) {
        style.left = 0
      }
      if (this.position.includes('center')) {
        style.left = '50%'
        // style.transform = 'translateX(-50%)'
      }
      return style
    },
    transitionProps() {
      let props = {
        enterActiveClass: 'transition duration-200 ease-out',
        enterFromClass: 'opacity-0',
        enterToClass: 'translate-y-0 opacity-100',
        leaveActiveClass: 'transition duration-100 ease-in',
        leaveFromClass: 'scale-100 translate-y-0 opacity-100',
        leaveToClass: 'scale-75 translate-y-4 opacity-0',
      }

      if (this.position.includes('top')) {
        props.enterFromClass += ' -translate-y-12'
      }
      if (this.position.includes('bottom')) {
        props.enterFromClass += ' translate-y-12'
      }
      return props
    },
  },
}
</script>
<style>
.toast-top-enter-active,
.toast-bottom-enter-active {
  transition: all 200ms ease-out;
}
.toast-top-leave-active,
.toast-bottom-leave-active {
  transition: all 100ms ease-in;
}
.toast-top-enter-from {
  opacity: 0;
  transform: translateY(0);
}
.toast-top-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
