import { nextTick } from 'vue'

export default {
  beforeMount(el, binding, vnode) {
    let fn = binding.value
    if (!fn) return

    let observer = new IntersectionObserver((entries) => {
      let entry = entries[0]
      let visible = entry.isIntersecting && entry.intersectionRatio > 0
      fn(visible, entry)
    })
    nextTick(() => {
      observer.observe(el)
    })
    el._visibility_observer = observer
  },
  unmounted(el) {
    if (el._visibility_observer) {
      el._visibility_observer.disconnect()
      delete el._visibility_observer
    }
  },
}
