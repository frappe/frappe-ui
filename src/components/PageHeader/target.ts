import { computed, ref } from 'vue'

// Module-level registry connecting shells to targets across the component
// tree (a layout's target and a routed page's header aren't ancestor and
// descendant). A stack so that layout swaps (desktop ↔ mobile) hand over
// cleanly regardless of mount/unmount order.
const targets = ref<HTMLElement[]>([])

export const activeTarget = computed(
  () => targets.value[targets.value.length - 1] ?? null,
)

export function registerTarget(el: HTMLElement) {
  targets.value = [...targets.value, el]
}

export function unregisterTarget(el: HTMLElement) {
  targets.value = targets.value.filter((t) => t !== el)
}
