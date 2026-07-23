<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

interface Heading {
  type: string
  name: string
  id: string
}

const headings = ref<Heading[]>([])
const activeHeading = ref<string>()
const h2Exists = ref(false)

// Cached heading offsets go stale as images/demos load in, so track visibility
// instead: the topmost heading intersecting the band below the navbar wins.
let observer: IntersectionObserver | undefined
const visible = new Set<string>()

const setHeadings = () => {
  const elements = Array.from(document.querySelectorAll('h2, h3'))

  h2Exists.value = elements.some((el) => el.tagName == 'H2')

  headings.value = elements.map((el) => ({
    type: el.tagName.toLowerCase(),
    name: el.textContent?.trim() ?? '',
    id: el.id,
  }))

  observer?.disconnect()
  visible.clear()
  elements.forEach((el) => observer?.observe(el))
}

const syncActive = () => {
  // Fall back to the last heading scrolled past, so the list never goes blank
  // between two widely spaced headings.
  const first = headings.value.find((h) => visible.has(h.id))
  if (first) {
    activeHeading.value = first.id
    return
  }
  const passed = headings.value.filter((h) => {
    const el = document.getElementById(h.id)
    return el && el.getBoundingClientRect().top < 80
  })
  activeHeading.value = passed.at(-1)?.id ?? headings.value[0]?.id
}

const route = useRoute()

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id)
        else visible.delete(entry.target.id)
      }
      syncActive()
    },
    // Band from just under the navbar to the middle of the viewport.
    { rootMargin: '-80px 0px -55% 0px' },
  )
  setHeadings()
})

onUnmounted(() => observer?.disconnect())

watch(route, () => nextTick(setHeadings))
</script>

<template>
  <aside
    class="sticky top-20 hidden lg:flex flex-col h-fit mt-10 leading-relaxed w-[200px]"
    :class="{ invisible: headings.length == 0 }"
  >
    <!-- Transparent border keeps the label on the same left edge as the links,
         which carry the rail's visible border. -->
    <span
      class="font-medium whitespace-nowrap pl-4 pb-1 border-l border-transparent"
      >On this page</span
    >

    <a
      v-for="x in headings"
      :href="`#${x.id}`"
      class="text-ink-gray-6 pl-4 py-1 border-l hover:text-ink-gray-9"
      @click="activeHeading = x.id"
      :class="{
        'pl-7': x.type == 'h3' && h2Exists,
        'border-outline-gray-7 text-ink-gray-9':
          activeHeading && x.id == activeHeading,
      }"
      >{{ x.name }}</a
    >
  </aside>
</template>
