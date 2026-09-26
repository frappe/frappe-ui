import { readonly, ref, type Ref } from 'vue'

/**
 * Light/dark preference. Distinct from `theme`, which everywhere else in the
 * library means a color tone (`blue`, `red`, …) — see CONTEXT.md.
 */
export type ColorScheme = 'light' | 'dark' | 'system'

/**
 * A preference with `system` already resolved, i.e. what the page is actually
 * painted in. What anything that has to pick a value per scheme reads.
 */
export type ResolvedColorScheme = Exclude<ColorScheme, 'system'>

const isBrowser = typeof window !== 'undefined'

/**
 * The `localStorage` key and the `<html>` attribute both keep the word `theme`.
 * Apps target `[data-theme='dark']` in their own CSS and users have a saved
 * value under this key; renaming either would break live apps silently.
 */
const STORAGE_KEY = 'theme'
const DOM_ATTRIBUTE = 'data-theme'

// Singleton state: hoisted to module scope so every `useColorScheme()` consumer
// reads the same ref. A switcher card, a toggle button, and anything else mirror
// each other in real time, all driving one `<html data-theme>`.
const currentScheme: Ref<ColorScheme> = ref('light')

/**
 * The resolved half of the same state: what the page is painted in. Written
 * only by `applyColorScheme`, so it follows `setColorScheme` and an OS change
 * under `system` alike.
 */
const currentResolved: Ref<ResolvedColorScheme> = ref('light')

/**
 * Read-only on purpose. The ref is only half the state — the other half is the
 * `data-theme` attribute and the stored value — so a bare assignment would
 * update the ref and leave the document and `localStorage` behind. `setColorScheme`
 * is the only way to move all three together.
 */
const colorScheme = readonly(currentScheme)

/**
 * Read-only for the same reason as `colorScheme`, and one step stronger: this
 * value is derived, so there is nothing an assignment could usefully mean.
 */
const resolvedColorScheme = readonly(currentResolved)

function resolveSystemScheme(): ResolvedColorScheme {
  if (!isBrowser) return 'light'
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * The scheme the document is painted in right now, read from the document
 * rather than from this module's state — so it is right even in an app that
 * never calls `useColorScheme` and sets `data-theme` itself.
 *
 * Reads, in order: the `data-theme` attribute this composable writes, then the
 * `dark` class Tailwind's class strategy uses, then the OS setting. Pure: it
 * neither initializes the shared state nor writes anything.
 *
 * Internal (SHELL-Q11). Charts call it to pick a palette at paint time, outside
 * any component. A component reads `useColorScheme().resolvedColorScheme`
 * instead, which is reactive and needs no observer.
 */
export function getResolvedColorScheme(): ResolvedColorScheme {
  if (typeof document === 'undefined') return 'light'
  const root = document.documentElement
  const attribute = root.getAttribute(DOM_ATTRIBUTE)
  if (attribute === 'dark' || attribute === 'light') return attribute
  if (root.classList.contains('dark')) return 'dark'
  return resolveSystemScheme()
}

// The pending frame that restores transitions, so a second swap arriving mid-
// flight can cancel it rather than uncover its own repaint. Null when idle.
let resumeTransitionsFrame: number | null = null

function applyColorScheme(scheme: ColorScheme): void {
  const resolved = scheme === 'system' ? resolveSystemScheme() : scheme
  currentResolved.value = resolved
  if (!isBrowser) return

  // Components across the library transition their colors, so flipping
  // `data-theme` cross-fades every surface on screen at once — a visible
  // flash. `.no-transition` (see src/style.css) mutes them for the swap.
  document.documentElement.classList.add('no-transition')
  document.documentElement.setAttribute(DOM_ATTRIBUTE, resolved)

  // Two frames, not one: the first callback still runs before the repaint that
  // lands the new `data-theme`, so unmuting there would restore transitions in
  // time to animate the very swap being hidden. The second is past that paint.
  if (resumeTransitionsFrame !== null) {
    cancelAnimationFrame(resumeTransitionsFrame)
  }
  resumeTransitionsFrame = requestAnimationFrame(() => {
    resumeTransitionsFrame = requestAnimationFrame(() => {
      resumeTransitionsFrame = null
      document.documentElement.classList.remove('no-transition')
    })
  })
}

function setColorScheme(scheme: ColorScheme): void {
  currentScheme.value = scheme
  applyColorScheme(scheme)
  if (isBrowser) localStorage.setItem(STORAGE_KEY, scheme)
}

/**
 * Flips the scheme the page is painted in, not the stored preference
 * (SHELL-Q12). Under `system` on a dark OS the old version wrote `light` on the
 * first press and nothing changed on screen, because `currentScheme` was
 * `system`, not `dark`. Toggling always moves.
 */
function toggleColorScheme(): void {
  setColorScheme(currentResolved.value === 'dark' ? 'light' : 'dark')
}

// Restore the saved preference and keep `system` in sync with the OS. Runs once
// for the whole app; the listener lives for the app's lifetime by design, so
// there is no per-component listener to leak.
let initialized = false
function ensureInitialized(): void {
  if (initialized || !isBrowser) return
  initialized = true

  const stored = localStorage.getItem(STORAGE_KEY) as ColorScheme | null
  const isValid = stored && ['light', 'dark', 'system'].includes(stored)
  setColorScheme(isValid ? (stored as ColorScheme) : 'system')

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (currentScheme.value === 'system') applyColorScheme('system')
    })
}

/**
 * The app's light/dark preference, shared by every caller.
 *
 * The first call restores the saved preference and starts following the OS
 * setting, so there is nothing to install or initialize.
 *
 * ```ts
 * const { colorScheme, resolvedColorScheme, setColorScheme, toggleColorScheme } =
 *   useColorScheme()
 * ```
 *
 * `colorScheme` is the preference and can be `system`. `resolvedColorScheme` is
 * what the page shows, so it changes with the OS setting while `colorScheme`
 * stays `system` — read it to pick a sun or moon icon, or a per-scheme asset.
 */
export function useColorScheme(): {
  /** The selected preference. Read-only — write through `setColorScheme`. */
  colorScheme: Readonly<Ref<ColorScheme>>
  /**
   * What the page is painted in, with `system` resolved. Read-only, and
   * reactive: under `system` it follows the OS setting while `colorScheme`
   * stays `system`.
   */
  resolvedColorScheme: Readonly<Ref<ResolvedColorScheme>>
  /** Select a preference: applies `data-theme` and persists it. */
  setColorScheme: (scheme: ColorScheme) => void
  /** Switch to the opposite of the scheme on screen right now. */
  toggleColorScheme: () => void
} {
  ensureInitialized()
  return {
    colorScheme,
    resolvedColorScheme,
    setColorScheme,
    toggleColorScheme,
  }
}

// The observed half of the module, kept apart from the writer above on
// purpose: nothing below this line writes `data-theme`, `localStorage` or the
// preference, and nothing below it calls `ensureInitialized`.
const observedScheme: Ref<ResolvedColorScheme> = ref('light')
const observedColorScheme = readonly(observedScheme)
let observing = false
let schemeObserver: MutationObserver | null = null
let osQuery: MediaQueryList | null = null
const readDocument = () => {
  observedScheme.value = getResolvedColorScheme()
}

// One observer for the whole app, started on the first call. Like the OS
// listener in `ensureInitialized`, it lives for the app's lifetime by design:
// there is nothing per component to leak, and a component unmounting must not
// stop the ref another component is still reading.
function ensureObserving(): void {
  if (observing || typeof document === 'undefined') return
  observing = true
  readDocument()
  // `class` as well as `data-theme`: `getResolvedColorScheme` reads Tailwind's
  // `dark` class too, so an app that flips only the class still moves this ref.
  // `applyColorScheme` also puts `no-transition` on and off the same element,
  // so a scheme change re-reads the document twice more. Both re-reads assign
  // the value the ref already holds, which is not a reactive change, and the
  // read is two `getAttribute` calls. Filtering them out costs more than it
  // saves.
  schemeObserver = new MutationObserver(readDocument)
  schemeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: [DOM_ATTRIBUTE, 'class'],
  })
  // The third input of the same read: with neither the attribute nor the class
  // set, the resolved scheme is the OS setting.
  osQuery = window.matchMedia?.('(prefers-color-scheme: dark)') ?? null
  osQuery?.addEventListener('change', readDocument)
}

/**
 * What the page is painted in, as a reactive read-only ref, for a component
 * that must not own the scheme.
 *
 * Reads the document — `data-theme`, then Tailwind's `dark` class, then the OS
 * setting — and follows it through a `MutationObserver`. It writes nothing:
 * no `data-theme`, no `localStorage`, and it does not start `useColorScheme`'s
 * singleton. Use it when something else owns the attribute: an app that
 * bootstraps its own theme before paint, a page embedded in a host shell, or a
 * demo inside an iframe.
 *
 * ```ts
 * const scheme = useResolvedColorScheme()
 * // scheme.value === 'light' | 'dark'
 * ```
 *
 * When the app owns the scheme, read `useColorScheme().resolvedColorScheme`
 * instead — same value, and the same object that sets it. Outside the browser
 * the ref holds `light` and no observer is installed.
 */
export function useResolvedColorScheme(): Readonly<Ref<ResolvedColorScheme>> {
  ensureObserving()
  return observedColorScheme
}

/** Test-only: forget that the singleton has been initialized. */
export function _resetColorScheme() {
  initialized = false
  currentScheme.value = 'light'
  currentResolved.value = 'light'
  observing = false
  observedScheme.value = 'light'
  schemeObserver?.disconnect()
  schemeObserver = null
  osQuery?.removeEventListener('change', readDocument)
  osQuery = null
  if (!isBrowser) return
  if (resumeTransitionsFrame !== null) {
    cancelAnimationFrame(resumeTransitionsFrame)
    resumeTransitionsFrame = null
  }
  document.documentElement.classList.remove('no-transition')
}
