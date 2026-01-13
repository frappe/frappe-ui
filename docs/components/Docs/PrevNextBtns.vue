<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import LucideLeft from '~icons/lucide/arrow-left'
import LucideRight from '~icons/lucide/arrow-right'
import sidebarConfig from '../../.vitepress/sidebar'
import { Button } from 'frappe-ui'

const route = useRoute()
const { frontmatter } = useData()

const visible = computed(() => frontmatter.value.nextprev ?? true)

const linkInfos = sidebarConfig.reduce((acc, cur) => {
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
</script>

<template>
  <div class="flex justify-between gap-5 mt-10" v-if="visible">
    <Button v-if="prevLink" as="a" :href="prevLink?.link">
      <template #prefix>
        <LucideLeft class="size-4" />
      </template>

      {{ prevLink?.text }}
    </Button>

    <Button as="a" v-if="nextLink" :href="nextLink?.link">
      {{ nextLink?.text }}
      <template #suffix>
        <LucideRight class="size-4" />
      </template>
    </Button>
  </div>
</template>
