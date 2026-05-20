<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Button, Badge, Breadcrumbs } from 'frappe-ui'
import LucideSun from '~icons/lucide/sun'
import LucideMoon from '~icons/lucide/moon-star'
import LucideSearch from '~icons/lucide/search'
import LucideCommand from '~icons/lucide/command'
import GithubIcon from './Icons/Github.vue'
import SearchPopup from './Search/Popup.vue'

import { state } from '../state'
import { useMagicKeys, whenever } from '@vueuse/core'
import { useRoute, withBase } from 'vitepress'

const theme = ref()

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.theme = theme.value
}

onMounted(() => {
  theme.value = document.documentElement.getAttribute('data-theme')
})

defineProps({
  isDocs: {
    type: Boolean,
  },
})

const route = useRoute()
const routes = computed(() => {
  const curoute = route.path.replace(/\/+$/, '')
  const routelabels = []

  for (const x of state.sidebarList) {
    if (!x.items) {
      routelabels.push({ label: x.text, link: x.link })
    } //
    else {
      const tmp = x.items.map((nested) => ({
        label: x.text + '/' + nested.text,
        link: nested.link,
      }))
      routelabels.push(...tmp)
    }
  }

  const activeLabel = routelabels.find((x) => x.link === curoute)?.label
  return activeLabel?.split('/')?.map((x) => ({ label: x }))
})

watch(route, (x) => {
  state.mobsidebar = false
})

const { meta_k } = useMagicKeys()

whenever(meta_k, (n) => {
  if (n) state.searchDialog = true
})

const devBranch = typeof __DEV_BRANCH__ !== 'undefined' ? __DEV_BRANCH__ : ''
</script>

<template>
  <nav class="border-b sticky top-0 bg-surface-white z-10">
    <SearchPopup v-model:open="state.searchDialog" />

    <div
      class="py-2.5 px-4 sm:px-5 flex items-center gap-2 sm:gap-3"
      :class="{ 'max-w-[1440px] mx-auto': !isDocs }"
    >
      <span
        class="flex gap-2 items-center mr-auto md:mr-0 min-w-0"
        :class="{ 'md:hidden': isDocs }"
      >
        <img src="/logo.svg" class="w-6 shrink-0" />
        <a :href="withBase('/')" class="font-medium truncate">Frappe UI</a>
      </span>

      <Breadcrumbs
        :items="routes"
        class="[&_span]:capitalize hidden md:flex min-w-0"
      />

      <Button
        @click="toggleTheme"
        class="md:hidden ml-auto"
        aria-label="Toggle theme"
      >
        <template #icon>
          <LucideSun v-if="theme === 'dark'" class="size-4" />
          <LucideMoon v-else class="size-4" />
        </template>
      </Button>

      <Badge
        v-if="devBranch"
        :title="`git branch: ${devBranch}`"
        theme="orange"
        variant="outline"
        class="hidden md:flex md:ml-auto"
      >
        <template #prefix>
          <span class="lucide-git-branch" />
        </template>
        {{ devBranch }}
      </Badge>

      <Button
        :class="['hidden md:flex', devBranch ? '' : 'md:ml-auto']"
        @click="state.searchDialog = true"
        aria-label="Open search"
      >
        <template #prefix>
          <LucideSearch class="size-4" />
        </template>
        Search

        <template #suffix>
          <span class="flex gap-1 items-center ml-auto text-xs text-ink-gray-5">
            <LucideCommand class="size-3" />
            K
          </span>
        </template>
      </Button>

      <div class="hidden md:flex items-center gap-3">
        <a :href="withBase('/docs/getting-started')" v-if="route.path == '/'">
          Docs
        </a>

        <Button @click="toggleTheme" class="rounded" aria-label="Toggle theme">
          <template #icon>
            <LucideSun v-if="theme === 'dark'" class="size-4" />
            <LucideMoon v-else class="size-4" />
          </template>
        </Button>

        <a
          href="https://github.com/frappe/frappe-ui"
          target="_blank"
          aria-label="GitHub repository"
        >
          <GithubIcon />
        </a>
      </div>
    </div>

  </nav>
</template>
