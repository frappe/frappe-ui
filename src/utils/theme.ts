import { ref, type Ref } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

const isBrowser = typeof window !== 'undefined'

// Singleton state: hoisted to module scope so every `useTheme()` consumer reads
// and writes the same ref. The switcher card, a toggle button, and anything
// else mirror each other in real time, all driving one `<html data-theme>`.
const currentTheme: Ref<Theme> = ref('light')

function getSystemTheme(): 'light' | 'dark' {
  if (!isBrowser) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyTheme(theme: Theme): void {
  if (!isBrowser) return
  const resolved = theme === 'system' ? getSystemTheme() : theme
  document.documentElement.setAttribute('data-theme', resolved)
}

function setTheme(theme: Theme): void {
  currentTheme.value = theme
  applyTheme(theme)
  if (isBrowser) localStorage.setItem('theme', theme)
}

function toggleTheme(): void {
  setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
}

function initializeTheme(): void {
  if (!isBrowser) return
  const storedTheme = localStorage.getItem('theme') as Theme | null
  const isValid = storedTheme && ['light', 'dark', 'system'].includes(storedTheme)
  setTheme(isValid ? (storedTheme as Theme) : 'system')
}

// Restore the saved theme and keep `system` in sync with the OS. Runs once for
// the whole app — the listener lives for the app's lifetime by design, so there
// is no per-component listener to leak.
let initialized = false
function ensureInitialized(): void {
  if (initialized || !isBrowser) return
  initialized = true
  initializeTheme()
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (currentTheme.value === 'system') applyTheme('system')
    })
}

export function useTheme() {
  ensureInitialized()
  return { currentTheme, toggleTheme, setTheme, initializeTheme, getSystemTheme }
}
