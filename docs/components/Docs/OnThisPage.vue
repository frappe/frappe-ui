<script setup lang="ts">
import { useRoute } from 'vitepress'
import { onMounted, onUnmounted, ref, watch } from 'vue'

interface Heading {
  type: string
  name: string
  id: string
  scrollPos: number
}

const headings = ref<Heading[]>([])
const activeHeading = ref()
const h2Exists = ref(false)

const setHeadings = () => {
  const elements = Array.from(document.querySelectorAll('h2, h3'))

  h2Exists.value = elements.some((el) => el.tagName == 'H2')

  headings.value = elements.map((el) => ({
    type: el.tagName.toLowerCase(),
    name: el.textContent?.trim(),
    id: el.id,
    scrollPos: el.offsetTop,
  }))
}

const setActiveHeading = () => {
  const curScrollPos = document.documentElement.scrollTop

  for (let i = 0; i < headings.value.length; i++) {
    if (curScrollPos <= headings.value[i].scrollPos) {
      activeHeading.value = headings.value[i].id
      break
    }
  }
}

const route = useRoute()

onMounted(() => {
  setHeadings()
  document.addEventListener('scroll', setActiveHeading)
})

onUnmounted(() => {
  document.removeEventListener('scroll', setActiveHeading)
})

watch(route, setHeadings)
</script>

<template>
  <aside
    class="sticky top-24 mt-10 hidden h-fit w-[200px] flex-col leading-relaxed lg:flex"
    :class="{ invisible: headings.length == 0 }"
  >
    <span class="whitespace-nowrap pl-3 font-medium">On this page</span>

    <a
      v-for="x in headings"
      :href="`#${x.id}`"
      class="whitespace-nowrap border-l py-1 pl-4 text-ink-gray-6 !no-underline hover:text-ink-gray-9"
      @click="activeHeading = x.id"
      :class="{
        'pl-7': x.type == 'h3' && h2Exists,
        'border-outline-gray-5 text-ink-gray-9': activeHeading && x.id == activeHeading,
      }"
    >
      {{ x.name }}
    </a>
  </aside>
</template>
