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
 * Read-only on purpose. The ref is only half the state — the other half is the
 * `data-theme` attribute and the stored value — so a bare assignment would
 * update the ref and leave the document and `localStorage` behind. `setColorScheme`
 * is the only way to move all three together.
 */
const colorScheme = readonly(currentScheme)

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
 */
export function resolvedColorScheme(): ResolvedColorScheme {
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
  if (!isBrowser) return
  const resolved = scheme === 'system' ? resolveSystemScheme() : scheme

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

function toggleColorScheme(): void {
  setColorScheme(currentScheme.value === 'dark' ? 'light' : 'dark')
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
 * const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme()
 * ```
 */
export function useColorScheme(): {
  /** The selected preference. Read-only — write through `setColorScheme`. */
  colorScheme: Readonly<Ref<ColorScheme>>
  /** Select a preference: applies `data-theme` and persists it. */
  setColorScheme: (scheme: ColorScheme) => void
  /** Flip between light and dark. */
  toggleColorScheme: () => void
} {
  ensureInitialized()
  return { colorScheme, setColorScheme, toggleColorScheme }
}

/** Test-only: forget that the singleton has been initialized. */
export function _resetColorScheme() {
  initialized = false
  currentScheme.value = 'light'
  if (!isBrowser) return
  if (resumeTransitionsFrame !== null) {
    cancelAnimationFrame(resumeTransitionsFrame)
    resumeTransitionsFrame = null
  }
  document.documentElement.classList.remove('no-transition')
}
