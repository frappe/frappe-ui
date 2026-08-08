import { readonly, ref, type Ref } from 'vue'

/**
 * Light/dark preference. Distinct from `theme`, which everywhere else in the
 * library means a color tone (`blue`, `red`, …) — see CONTEXT.md.
 */
export type ColorScheme = 'light' | 'dark' | 'system'

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

function resolveSystemScheme(): 'light' | 'dark' {
  if (!isBrowser) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyColorScheme(scheme: ColorScheme): void {
  if (!isBrowser) return
  const resolved = scheme === 'system' ? resolveSystemScheme() : scheme
  document.documentElement.setAttribute(DOM_ATTRIBUTE, resolved)
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
}
