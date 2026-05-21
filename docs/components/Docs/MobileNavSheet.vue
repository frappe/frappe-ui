<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { Button, TextInput } from 'frappe-ui'
import LucideMenu from '~icons/lucide/menu'
import { getSidebarList, isActiveLink } from './sidebarList'
import { state } from '../../state'

const route = useRoute()
const { site, theme } = useData()
const list = getSidebarList(theme.value.componentList)
const query = ref('')

const filteredList = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return list
  return list
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.text.toLowerCase().includes(q),
      ),
    }))
    .filter((section) => section.items.length > 0)
})

function close() {
  state.mobsidebar = false
}
function toggle() {
  state.mobsidebar = !state.mobsidebar
}
function isActive(link: string) {
  return isActiveLink(route.path, link, site.value.base)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

watch(
  () => state.mobsidebar,
  (v) => {
    document.documentElement.classList.toggle('overflow-hidden', v)
    if (!v) query.value = ''
  },
)

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('overflow-hidden')
})
</script>

<template>
  <Button
    v-if="!state.mobsidebar"
    icon-left="lucide-menu"
    theme="gray"
    variant="outline"
    size="lg"
    label="Menu"
    aria-label="Open navigation"
    :aria-expanded="state.mobsidebar"
    class="lg:hidden fixed bottom-4 right-4 z-30 shadow-2xl"
    @click="toggle"
  >
    Menu
  </Button>

  <Transition
    enter-active-class="transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
    leave-active-class="transition-opacity duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="state.mobsidebar"
      class="lg:hidden fixed inset-0 bg-black/40 z-40"
      @click="close"
      aria-hidden="true"
    />
  </Transition>

  <Transition
    enter-active-class="transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
    leave-active-class="transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
    enter-from-class="translate-y-full"
    leave-to-class="translate-y-full"
  >
    <div
      v-if="state.mobsidebar"
      class="lg:hidden fixed inset-x-0 bottom-0 z-50 h-[80dvh] bg-surface-white rounded-t-2xl shadow-2xl flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
    >
      <div class="pt-2 pb-1 flex items-center justify-center shrink-0">
        <div class="h-1.5 w-10 rounded-full bg-surface-gray-3" />
      </div>

      <div class="px-3 pt-2 pb-1 shrink-0">
        <TextInput
          v-model="query"
          type="search"
          size="lg"
          placeholder="Search"
          aria-label="Search navigation"
          class="w-full"
        >
          <template #prefix>
            <span class="lucide-search size-[18px] text-ink-gray-5" />
          </template>
        </TextInput>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 pb-6 pt-2 flex flex-col gap-6">
        <div
          v-if="filteredList.length === 0"
          class="px-2 py-6 text-lg text-ink-gray-5 text-center"
        >
          No results for "{{ query }}"
        </div>
        <div v-for="section in filteredList" :key="section.text">
          <div class="px-2 text-base flex items-center h-8 text-ink-gray-5">
            {{ section.text }}
          </div>
          <div class="flex flex-col gap-0.5">
            <a
              v-for="item in section.items"
              :key="item.text"
              :href="withBase(item.link)"
              class="pl-2 flex h-11 items-center rounded-md text-lg transition-colors"
              :class="
                isActive(item.link)
                  ? 'bg-surface-gray-2 text-ink-gray-8'
                  : 'text-ink-gray-7 hover:bg-surface-gray-2 hover:text-ink-gray-8'
              "
            >
              {{ item.text }}
            </a>
          </div>
        </div>
      </nav>
    </div>
  </Transition>
</template>
