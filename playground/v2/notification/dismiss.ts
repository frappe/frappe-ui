import { ref } from 'vue'

// A card's close takes it away; a moment later it is back, so the stage
// never loses a variant. Hidden, not removed, so the others hold their
// places.
export function useDismiss() {
  const gone = ref(new Set<string>())
  function dismiss(id: string) {
    gone.value = new Set([...gone.value, id])
    setTimeout(() => {
      const next = new Set(gone.value)
      next.delete(id)
      gone.value = next
    }, 1600)
  }
  const hiddenClass = (id: string) =>
    gone.value.has(id) ? 'pointer-events-none opacity-0' : 'opacity-100'
  return { gone, dismiss, hiddenClass }
}
