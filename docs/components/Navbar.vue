<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Button, Breadcrumbs } from 'frappe-ui'
import LucideSun from '~icons/lucide/sun'
import LucideMoon from '~icons/lucide/moon-star'
import LucideSearch from '~icons/lucide/search'
import LucideMenu from '~icons/lucide/menu'
import LucideSide from '~icons/lucide/panel-right'
import GithubIcon from './Icons/Github.vue'
import SearchPopup from './Search/Popup.vue'

import { state } from '../state'
import { useMagicKeys, whenever } from '@vueuse/core'
import { useRoute } from 'vitepress'

const theme = ref()

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme.value)
  localStorage.theme = theme.value
}

const toggleMobSidebar = () => (state.mobsidebar = !state.mobsidebar)
const toggleNavbar = () => (state.mobnavbar = !state.mobnavbar)

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
  state.mobnavbar = false
  state.mobsidebar = false
})

const { meta_k } = useMagicKeys()

whenever(meta_k, (n) => {
  if (n) state.searchDialog = true
})
</script>

<template>
  <nav class="border-b sticky top-0 bg-surface-white !z-50">
    <SearchPopup
      v-if="state.searchDialog"
      @close="state.searchDialog = false"
    />

    <div
      class="py-2.5 px-5 flex items-center gap-3 flex-wrap"
      :class="{ 'max-w-[1440px] mx-auto': !isDocs }"
    >
      <span
        class="flex gap-2 items-center mr-auto md:mr-0"
        :class="{ 'md:hidden': isDocs }"
      >
        <img src="/logo.svg" class="w-6" />
        <a href="/" class="font-medium">Frappe UI</a>
      </span>

      <Breadcrumbs :items="routes" class="[&_span]:capitalize hidden md:flex" />

      <Button v-if="isDocs" @click="toggleMobSidebar" class="md:hidden">
        <template #icon>
          <LucideSide class="size-4" />
        </template>
      </Button>

      <Button @click="toggleNavbar" class="md:hidden">
        <template #icon>
          <LucideMenu class="size-4" />
        </template>
      </Button>

      <div
        class="gap-3 md:flex items-center w-full ml-auto md:w-auto"
        :class="{ flex: state.mobnavbar, hidden: !state.mobnavbar }"
      >
        <a href="/docs/getting-started" v-if="route.path == '/'">Docs</a>

        <Button class="hidden md:flex" @click="state.searchDialog = true">
          <template #prefix>
            <LucideSearch class="size-4" />
          </template>
          Search
        </Button>

        <Button @click="toggleTheme" class="rounded">
          <template #icon>
            <LucideSun v-if="theme === 'dark'" class="size-4" />
            <LucideMoon v-else class="size-4" />
          </template>
        </Button>

        <a href="https://github.com/frappe/frappe-ui">
          <GithubIcon />
        </a>
      </div>
    </div>
  </nav>
</template>
