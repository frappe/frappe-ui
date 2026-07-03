import {
  computed,
  onBeforeUnmount,
  ref,
  watch,
  type ComputedRef,
} from 'vue'

/**
 * Module-level registry connecting an app's shell to its scroll element across
 * the component tree — the shell that owns the scroll region and a routed page
 * that wants to read/drive it aren't ancestor and descendant.
 *
 * A stack (not a single ref) so that a desktop <-> mobile layout swap hands the
 * active container over cleanly regardless of mount/unmount order, mirroring the
 * PageHeader target registry (`components/PageHeader/target.ts`).
 */
const containers = ref<HTMLElement[]>([])

/** The current scroll container — the most recently registered one. */
export const activeScrollContainer: ComputedRef<HTMLElement | null> = computed(
  () => containers.value[containers.value.length - 1] ?? null,
)

/** Register a shell's scroll element. Called by the shell, not by app code. */
export function registerScrollContainer(el: HTMLElement) {
  containers.value = [...containers.value, el]
}

/** Remove a previously registered scroll element. */
export function unregisterScrollContainer(el: HTMLElement) {
  containers.value = containers.value.filter((c) => c !== el)
}

/**
 * Plain (non-hook) accessor for the active scroll container. Usable outside a
 * component `setup()` — e.g. inside a vue-router `scrollBehavior` or navigation
 * guard, where composables can't run. Returns `null` if no shell is mounted.
 */
export function getScrollContainer(): HTMLElement | null {
  return activeScrollContainer.value
}

/** Scroll the active container. No-op when none is registered. */
export function scrollTo(options: ScrollToOptions = {}) {
  activeScrollContainer.value?.scrollTo(options)
}

/** Smooth-scroll the active container to the top. No-op when none is registered. */
export function scrollToTop() {
  activeScrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

export interface UseScrollContainerOptions {
  /** Scroll offset (px) past which `isScrolled` flips to true. Default 200. */
  threshold?: number
}

export interface UseScrollContainer {
  /** The live scroll element — read `scrollTop`/`scrollHeight` or call `scrollBy` on it. */
  el: ComputedRef<HTMLElement | null>
  /** Scroll the active container. */
  scrollTo: (options?: ScrollToOptions) => void
  /** Smooth-scroll to the top. */
  scrollToTop: () => void
  /** Reactive: is the container scrolled past `threshold`. */
  isScrolled: ComputedRef<boolean>
}

/**
 * Reactive access to the app shell's scroll container.
 *
 * `isScrolled` tracks the *active* container and re-binds automatically across a
 * layout swap, so it stays correct when desktop and mobile shells hand over.
 */
export function useScrollContainer(
  options: UseScrollContainerOptions = {},
): UseScrollContainer {
  const { threshold = 200 } = options
  const scrollTop = ref(0)

  const onScroll = () => {
    scrollTop.value = activeScrollContainer.value?.scrollTop ?? 0
  }

  // Follow the active container as it changes (layout swap): detach from the
  // previous element, attach to the new one, and re-read immediately.
  watch(
    activeScrollContainer,
    (el, prev) => {
      prev?.removeEventListener('scroll', onScroll)
      el?.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    activeScrollContainer.value?.removeEventListener('scroll', onScroll)
  })

  return {
    el: activeScrollContainer,
    scrollTo,
    scrollToTop,
    isScrolled: computed(() => scrollTop.value > threshold),
  }
}
