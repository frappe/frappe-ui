import { readonly, ref } from 'vue';
const isBrowser = typeof window !== 'undefined';
/**
 * The `localStorage` key and the `<html>` attribute both keep the word `theme`.
 * Apps target `[data-theme='dark']` in their own CSS and users have a saved
 * value under this key; renaming either would break live apps silently.
 */
const STORAGE_KEY = 'theme';
const DOM_ATTRIBUTE = 'data-theme';
// Singleton state: hoisted to module scope so every `useColorScheme()` consumer
// reads the same ref. A switcher card, a toggle button, and anything else mirror
// each other in real time, all driving one `<html data-theme>`.
const currentScheme = ref('light');
/**
 * Read-only on purpose. The ref is only half the state — the other half is the
 * `data-theme` attribute and the stored value — so a bare assignment would
 * update the ref and leave the document and `localStorage` behind. `setColorScheme`
 * is the only way to move all three together.
 */
const colorScheme = readonly(currentScheme);
function resolveSystemScheme() {
    if (!isBrowser)
        return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}
function applyColorScheme(scheme) {
    if (!isBrowser)
        return;
    const resolved = scheme === 'system' ? resolveSystemScheme() : scheme;
    document.documentElement.setAttribute(DOM_ATTRIBUTE, resolved);
}
function setColorScheme(scheme) {
    currentScheme.value = scheme;
    applyColorScheme(scheme);
    if (isBrowser)
        localStorage.setItem(STORAGE_KEY, scheme);
}
function toggleColorScheme() {
    setColorScheme(currentScheme.value === 'dark' ? 'light' : 'dark');
}
// Restore the saved preference and keep `system` in sync with the OS. Runs once
// for the whole app; the listener lives for the app's lifetime by design, so
// there is no per-component listener to leak.
let initialized = false;
function ensureInitialized() {
    if (initialized || !isBrowser)
        return;
    initialized = true;
    const stored = localStorage.getItem(STORAGE_KEY);
    const isValid = stored && ['light', 'dark', 'system'].includes(stored);
    setColorScheme(isValid ? stored : 'system');
    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
        if (currentScheme.value === 'system')
            applyColorScheme('system');
    });
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
export function useColorScheme() {
    ensureInitialized();
    return { colorScheme, setColorScheme, toggleColorScheme };
}
/** Test-only: forget that the singleton has been initialized. */
export function _resetColorScheme() {
    initialized = false;
    currentScheme.value = 'light';
}
