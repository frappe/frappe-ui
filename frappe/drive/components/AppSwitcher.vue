<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

router.afterEach(() => {
  open.value = false
})

defineProps<{
  apps: Array<{
    title: string
    logo: string
    route: string
  }>
}>()

const open = ref(false)
</script>

<template>
  <div class="fixed left-0 top-0 z-40 h-screen w-3" @mouseenter="open = true" />
  <aside
    class="fixed left-0 top-0 z-50 h-screen border-r border-gray-200 bg-surface-white px-2 transition-transform duration-300 ease-out"
    :class="!open && '-translate-x-full'"
    @mouseleave="open = false"
  >
    <div class="flex h-full items-center justify-center">
      <div class="flex flex-col gap-6">
        <a
          v-for="app in apps"
          :key="app.route"
          :href="app.route"
          :title="app.title"
          class="group flex items-center justify-center rounded-md transition hover:shadow-sm"
        >
          <img :src="app.logo" :alt="app.title" class="size-7 opacity-80 group-hover:opacity-100" />
        </a>
      </div>
    </div>
  </aside>
</template>
