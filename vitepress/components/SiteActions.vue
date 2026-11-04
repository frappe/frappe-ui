<script setup lang="ts">
// Site-wide controls shared by the marketing Navbar and the docs Header: the
// GitHub link (when themeConfig names a repo) and the color scheme toggle.
import { computed } from 'vue'
import { useData } from 'vitepress'
import { Button, useColorScheme } from 'frappe-ui'

const { theme } = useData()
const githubUrl = computed(() => theme.value.githubUrl ?? '')

// One click flips what's on screen. When the new scheme is the one the OS
// already prefers, it goes back to `system` instead, so the page follows the
// OS again. That keeps a way back to `system` without a menu: on a dark-mode
// OS, dark → light → system.
const { resolvedColorScheme, setColorScheme } = useColorScheme()

const nextScheme = computed(() =>
  resolvedColorScheme.value === 'dark' ? 'light' : 'dark',
)
const toggleLabel = computed(() => `Switch to ${nextScheme.value} theme`)

function toggleTheme() {
  const next = nextScheme.value
  const osPrefers = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
  setColorScheme(next === osPrefers ? 'system' : next)
}
</script>

<template>
  <div class="flex items-center gap-1">
    <Button
      v-if="githubUrl"
      variant="ghost"
      :href="githubUrl"
      aria-label="GitHub repository"
    >
      <template #icon>
        <svg
          viewBox="0 0 16 16"
          class="h-4 w-4 fill-current"
          aria-hidden="true"
        >
          <path
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
          />
        </svg>
      </template>
    </Button>

    <Button
      variant="ghost"
      :icon="resolvedColorScheme === 'dark' ? 'lucide-moon-star' : 'lucide-sun'"
      :label="toggleLabel"
      :tooltip="toggleLabel"
      @click="toggleTheme"
    />
  </div>
</template>
