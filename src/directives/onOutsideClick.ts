import type { DirectiveBinding, VNode } from 'vue'

const instanceMap = new Map<Element, (e: Event) => void>()

function onDocumentClick(e: Event, el: Element, fn?: (e: Event) => void): void {
  const target = e.target as Element
  if (el !== target && !el.contains(target)) {
    fn?.(e)
  }
}

export default {
  beforeMount(el: Element, binding: DirectiveBinding, vnode: VNode): void {
    const fn = binding.value as (e: Event) => void
    const clickHandler = function (e: Event) {
      onDocumentClick(e, el, fn)
    }

    removeHandlerIfPresent(el)
    instanceMap.set(el, clickHandler)
    document.addEventListener('click', clickHandler)
  },
  unmounted(el: Element): void {
    removeHandlerIfPresent(el)
  },
}

function removeHandlerIfPresent(el: Element): void {
  const clickHandler = instanceMap.get(el)
  if (!clickHandler) {
    return
  }

  instanceMap.delete(el)
  document.removeEventListener('click', clickHandler)
}
