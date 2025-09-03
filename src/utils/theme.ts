import { ref, onMounted, Ref } from 'vue'

export type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const currentTheme: Ref<Theme> = ref('light')

  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  const toggleTheme = (): void => {
    const theme: Theme = currentTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(theme)
  }

  const setTheme = (theme: Theme): void => {
    currentTheme.value = theme

    if (theme === 'system') {
      const systemTheme = getSystemTheme()
      document.documentElement.setAttribute('data-theme', systemTheme)
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }

    localStorage.setItem('theme', theme)
  }

  const initializeTheme = (): void => {
    const storedTheme = localStorage.getItem('theme') as Theme | null
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setTheme(storedTheme)
    } else {
      // Default to system theme
      setTheme('system')
    }
  }

  onMounted(() => {
    initializeTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (currentTheme.value === 'system') {
        const systemTheme = getSystemTheme()
        document.documentElement.setAttribute('data-theme', systemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  })

  return {
    currentTheme,
    toggleTheme,
    setTheme,
    initializeTheme,
    getSystemTheme,
  }
}
