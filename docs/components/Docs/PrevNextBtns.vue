<script setup lang="ts">
import { computed } from 'vue'
import { state } from '../../state'
import { useData, useRoute } from 'vitepress'

import LucideLeft from '~icons/lucide/arrow-left'
import LucideRight from '~icons/lucide/arrow-right'

const route = useRoute()
const { frontmatter } = useData()

const visible = computed(() => frontmatter.value.nextprev ?? true)

const linkInfos = state.sidebarList?.reduce((acc, cur) => {
  cur.items ? acc.push(...cur.items) : acc.push(cur)
  return acc
}, [])

const prevLink = computed(() => {
  const index = linkInfos.findIndex((x) => x.link === route.path)

  if (index === 0) {
    return null
  }

  return linkInfos[index - 1]
})

const nextLink = computed(() => {
  const index = linkInfos.findIndex((x) => x.link === route.path)

  if (index === linkInfos.length - 1) {
    return null
  }

  return linkInfos[index + 1]
})

const subtleMdLink =
  'inline-flex items-center gap-2 ' +
  'h-8 px-2.5 rounded ' +
  'text-base font-medium ' +
  'text-ink-gray-8 bg-surface-gray-2 ' +
  'hover:bg-surface-gray-3 active:bg-surface-gray-4 ' +
  'transition-colors ' +
  'focus:outline-none focus-visible:ring focus-visible:ring-outline-gray-3'
</script>

<template>
  <div class="flex justify-between gap-5 mt-10" v-if="visible">
    <a v-if="prevLink" :href="prevLink.link" :class="subtleMdLink">
      <LucideLeft class="h-4 w-4" />
      {{ prevLink.text }}
    </a>

    <a v-if="nextLink" :href="nextLink.link" :class="subtleMdLink">
      {{ nextLink.text }}
      <LucideRight class="h-4 w-4" />
    </a>
  </div>
</template>
