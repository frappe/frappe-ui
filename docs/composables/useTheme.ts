import { onBeforeUnmount, onMounted, ref } from 'vue'

export type DocsTheme = 'light' | 'dark'

// Navbar.vue sets `data-theme` on <html>; observe it so other pages can
// react to global theme toggles without coupling to the Navbar component.
export function useTheme() {
  const theme = ref<DocsTheme>('light')
  let observer: MutationObserver | null = null

  const read = () => {
    const value = document.documentElement.getAttribute('data-theme')
    theme.value = value === 'dark' ? 'dark' : 'light'
  }

  onMounted(() => {
    read()
    observer = new MutationObserver(read)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  return theme
}
