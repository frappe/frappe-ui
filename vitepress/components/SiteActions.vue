<script setup lang="ts">
// Site-wide controls shared by the marketing Navbar and the docs Header: the
// GitHub link (when themeConfig names a repo) and the color scheme picker.
import { computed } from 'vue'
import { useData } from 'vitepress'
import { Button, Select, useColorScheme } from 'frappe-ui'
import type { ColorScheme } from 'frappe-ui'

const { theme } = useData()
const githubUrl = computed(() => theme.value.githubUrl ?? '')

// A picker rather than a light/dark toggle: `system` is the default scheme, and
// a two-state toggle gives no way back to it once the reader has picked a side.
const { colorScheme, setColorScheme } = useColorScheme()

const themeOptions = [
  { label: 'Light', value: 'light', icon: 'lucide-sun' },
  { label: 'Dark', value: 'dark', icon: 'lucide-moon-star' },
  { label: 'System', value: 'system', icon: 'lucide-monitor' },
]

const themeIcon = computed(
  () =>
    themeOptions.find((option) => option.value === colorScheme.value)?.icon ??
    'lucide-monitor',
)
</script>

<template>
  <Button
    v-if="githubUrl"
    variant="ghost"
    :link="githubUrl"
    aria-label="GitHub repository"
  >
    <template #icon>
      <svg viewBox="0 0 16 16" class="h-4 w-4 fill-current" aria-hidden="true">
        <path
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
        />
      </svg>
    </template>
  </Button>

  <Select
    :model-value="colorScheme"
    :options="themeOptions"
    size="sm"
    aria-label="Theme"
    side="bottom"
    align="end"
    class="!h-7 !w-7 !min-h-7 !px-0 !rounded-4 justify-center"
    @update:model-value="
      (value) => value && setColorScheme(value as ColorScheme)
    "
  >
    <template #trigger>
      <span :class="themeIcon" class="size-4" aria-hidden="true" />
    </template>
  </Select>
</template>
