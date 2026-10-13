// The line under a tab row's selected tab, drawn once for the row so it
// can slide from one tab to the next: it follows the row's
// [aria-selected="true"] tab, measured against the row itself, and only
// slides once it has first been placed — the row opens with it in place.
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type Ref,
} from 'vue'

export function useTabInk(row: Ref<HTMLElement | null>, active: Ref<unknown>) {
  const left = ref(0)
  const width = ref(0)
  const placed = ref(false)

  function place() {
    const el = row.value
    const on = el?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!el || !on) return
    const r = el.getBoundingClientRect()
    const t = on.getBoundingClientRect()
    left.value = t.left - r.left - el.clientLeft
    width.value = t.width
    if (!placed.value) requestAnimationFrame(() => (placed.value = true))
  }

  // the labels' font can land after the row is drawn, widening the tabs
  let ro: ResizeObserver | null = null
  onMounted(() => {
    place()
    ro = new ResizeObserver(place)
    if (row.value) {
      ro.observe(row.value)
      for (const t of row.value.querySelectorAll('[role="tab"]')) ro.observe(t)
    }
  })
  onBeforeUnmount(() => ro?.disconnect())
  watch(active, () => nextTick(place))

  const style = computed(() => ({
    transform: `translateX(${left.value}px)`,
    width: `${width.value}px`,
    opacity: width.value ? 1 : 0,
  }))
  return { style, placed }
}
