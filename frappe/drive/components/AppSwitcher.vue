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
  <div class="fixed left-0 top-0 h-screen w-3 z-40" @mouseenter="open = true" />
  <aside
    class="fixed left-0 top-0 h-screen z-50 transition-transform duration-300 ease-out bg-surface-white border-r border-gray-200 px-2"
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
          class="group flex items-center justify-center rounded-md hover:shadow-sm transition"
        >
          <img
            :src="app.logo"
            :alt="app.title"
            class="size-7 opacity-80 group-hover:opacity-100"
          />
        </a>
      </div>
    </div>
  </aside>
</template>
