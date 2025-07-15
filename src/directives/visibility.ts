import { nextTick } from 'vue'
import type { DirectiveBinding, VNode } from 'vue'

interface VisibilityElement extends Element {
  _visibility_observer?: IntersectionObserver
}

export default {
  beforeMount(
    el: VisibilityElement,
    binding: DirectiveBinding,
    vnode: VNode,
  ): void {
    const fn = binding.value as (
      visible: boolean,
      entry: IntersectionObserverEntry,
    ) => void
    if (!fn) return

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0]
        const visible = entry.isIntersecting && entry.intersectionRatio > 0
        fn(visible, entry)
      },
    )

    nextTick(() => {
      observer.observe(el)
    })

    el._visibility_observer = observer
  },
  unmounted(el: VisibilityElement): void {
    if (el._visibility_observer) {
      el._visibility_observer.disconnect()
      delete el._visibility_observer
    }
  },
}
