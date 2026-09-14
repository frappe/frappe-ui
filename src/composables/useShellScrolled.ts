import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'

/**
 * Module-level registry connecting an app's shell to its scroll element across
 * the component tree — the shell that owns the scroll region and a routed page
 * that wants to read it aren't ancestor and descendant, so `provide`/`inject`
 * can't carry it: the page renders into the shell's `<slot />`, which belongs to
 * the *parent's* render scope.
 *
 * A stack (not a single ref) so that a desktop <-> mobile layout swap hands the
 * active container over cleanly regardless of mount/unmount order, mirroring the
 * PageHeader target registry (`components/PageHeader/target.ts`).
 */
const containers = ref<HTMLElement[]>([])

/**
 * The scroll element of the mounted app shell — the `DesktopShell` or
 * `MobileShell` that registered most recently. `null` when neither is mounted.
 *
 * Read `scrollTop` off it, or call `scrollTo`/`scrollBy` on it. Usable outside a
 * component too (a vue-router `scrollBehavior`, a navigation guard) since it is
 * a plain computed, not a hook.
 *
 * ```ts
 * shellScrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
 * ```
 */
export const shellScrollContainer: ComputedRef<HTMLElement | null> = computed(
  () => containers.value[containers.value.length - 1] ?? null,
)

/** Register a shell's scroll element. Internal to the two shell components. */
export function registerShellScrollContainer(el: HTMLElement) {
  containers.value = [...containers.value, el]
}

/** Remove a previously registered scroll element. Internal to the two shells. */
export function unregisterShellScrollContainer(el: HTMLElement) {
  containers.value = containers.value.filter((c) => c !== el)
}

/**
 * The scroll element of the nearest enclosing shell, provided by `DesktopShell`
 * and `MobileShell` (SHELL-Q3). Internal.
 *
 * `provide`/`inject` reaches slot content: Vue parents a component by where its
 * vnode is mounted, not by where it was written, so a routed page inside a
 * shell's `<slot />` is a descendant of the shell. Ownership is therefore
 * unambiguous where it can be read, and the module registry above stays as the
 * fallback for what `inject` cannot reach — a `Teleport` out of the shell, and
 * code outside any component.
 */
export const shellScrollElementKey: InjectionKey<Ref<HTMLElement | null>> =
  Symbol('shellScrollElement')

/**
 * Smooth-scroll the shell to the top. Internal — `MobileNavItem` uses it for the
 * tap-the-active-tab gesture. Apps call `shellScrollContainer.value?.scrollTo()`.
 */
export function scrollShellToTop() {
  shellScrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

let warnedNoShell = false

/**
 * Whether the app shell's scroll container is scrolled past `threshold` pixels.
 * The usual driver of a header's border or shadow appearing on scroll.
 *
 * Tracks the *active* container and re-binds automatically across a layout swap,
 * so it stays correct when the desktop and mobile shells hand over.
 *
 * ```ts
 * const scrolled = useShellScrolled({ threshold: 12 })
 * ```
 *
 * `threshold` is required. There is no default: 200px suits a long document and
 * nothing else, and a header border that appears 200px late reads as a bug
 * rather than as a missing argument (SHELL-Q10).
 *
 * Requires a mounted `DesktopShell` or `MobileShell`; without one it stays
 * `false` and warns once in development.
 */
export function useShellScrolled(options: {
  threshold: number
}): ComputedRef<boolean> {
  const threshold = options?.threshold

  if (import.meta.env.DEV && typeof threshold !== 'number') {
    console.warn(
      '[frappe-ui] useShellScrolled() requires a threshold in pixels, ' +
        'for example useShellScrolled({ threshold: 12 }). ' +
        'Without one it will never report true.',
    )
  }

  // The nearest shell wins; the registry is the fallback for what `inject`
  // cannot reach (SHELL-Q3). `inject` outside a setup scope warns, so only ask
  // when there is an instance.
  const provided = getCurrentInstance()
    ? inject(shellScrollElementKey, null)
    : null
  const element = computed(
    () => provided?.value ?? shellScrollContainer.value ?? null,
  )

  const scrollTop = ref(0)

  const onScroll = () => {
    scrollTop.value = element.value?.scrollTop ?? 0
  }

  // Follow the active container as it changes (layout swap): detach from the
  // previous element, attach to the new one, and re-read immediately.
  watch(
    element,
    (el, prev) => {
      prev?.removeEventListener('scroll', onScroll)
      el?.addEventListener('scroll', onScroll, { passive: true })
      onScroll()
    },
    { immediate: true },
  )

  // A routed page renders into the shell's `<slot />`, so it is a child
  // component: its `mounted` runs *before* the shell's, which is where the
  // shells register their scroll element. `MobileShell` registers in its own
  // `mounted`, `DesktopShell` from a watcher on a template ref that resolves
  // later still. Checking at our own `mounted` would warn at every legitimate
  // call site, and no fixed number of ticks is a fact about either shell. A
  // timeout is: mounting settles in microtasks, and all of them have run by the
  // time a macrotask does.
  let warnTimer: ReturnType<typeof setTimeout> | null = null

  onMounted(() => {
    if (import.meta.env.PROD || warnedNoShell) return
    warnTimer = setTimeout(() => {
      warnTimer = null
      if (element.value || warnedNoShell) return
      warnedNoShell = true
      console.warn(
        '[frappe-ui] useShellScrolled() found no app shell, so it will stay false. ' +
          'It reads the scroll region of a mounted <DesktopShell> or <MobileShell>.',
      )
    })
  })

  onBeforeUnmount(() => {
    if (warnTimer !== null) clearTimeout(warnTimer)
    element.value?.removeEventListener('scroll', onScroll)
  })

  return computed(
    () => typeof threshold === 'number' && scrollTop.value > threshold,
  )
}

/** Test-only: allow the no-shell warning to fire again. */
export function _resetShellScrolledWarning() {
  warnedNoShell = false
}
