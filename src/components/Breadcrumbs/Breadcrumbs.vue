<template>
  <div class="flex min-w-0 items-center" ref="crumbsRef">
    <template v-if="overflowedX">
      <Dropdown class="h-7" :options="dropdownItems">
        <Button variant="ghost">
          <template #icon>
            <LucideEllipsis class="w-4 text-ink-gray-5" />
          </template>
        </Button>
      </Dropdown>
      <span class="ml-1 mr-0.5 text-base text-ink-gray-4" aria-hidden="true">
        /
      </span>
    </template>

    <div class="flex min-w-0 items-center text-ellipsis whitespace-nowrap">
      <template v-for="(item, i) in crumbs" :key="item.label">
        <router-link
          v-if="item.route"
          :to="item.route"
          @click="item.onClick ? item.onClick() : null"
          class="flex items-center rounded px-0.5 py-1 text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-3"
          :class="[
            i == crumbs.length - 1
              ? 'text-ink-gray-9'
              : 'text-ink-gray-5 hover:text-ink-gray-7',
          ]"
        >
          <slot name="prefix" :item="item" />
          <span>
            {{ item.label }}
          </span>
          <slot name="suffix" :item="item" />
        </router-link>
        <button
          v-else
          @click="item.onClick ? item.onClick() : null"
          class="flex items-center rounded px-0.5 py-1 text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-3"
          :class="[
            i == crumbs.length - 1
              ? 'text-ink-gray-9'
              : 'text-ink-gray-5 hover:text-ink-gray-7',
          ]"
        >
          <slot name="prefix" :item="item" />
          <span>
            {{ item.label }}
          </span>
          <slot name="suffix" :item="item" />
        </button>
        <span
          v-if="i != crumbs.length - 1"
          class="mx-0.5 text-base text-ink-gray-4"
          aria-hidden="true"
        >
          /
        </span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Dropdown } from '../Dropdown'
import { Button } from '../Button'
import type { BreadcrumbsProps } from './types'
import { ref, computed, nextTick, useTemplateRef } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import LucideEllipsis from '~icons/lucide/ellipsis'

const crumbsEl = useTemplateRef<HTMLDivElement>('crumbsRef')

const props = defineProps<BreadcrumbsProps>()

const router = useRouter()
const overflowedX = ref(false)

const items = computed(() => {
  return (props.items || []).filter(Boolean)
})

const checkOverflow = () => {
  if (!crumbsEl.value) return

  // tmp show all items to measure item width
  overflowedX.value = false

  nextTick(() => {
    const scrollWidth = crumbsEl.value?.scrollWidth || 0
    const clientWidth = crumbsEl.value?.clientWidth || 0
    overflowedX.value = scrollWidth > clientWidth
  })
}

useResizeObserver(crumbsEl, checkOverflow)

const dropdownItems = computed(() => {
  let allExceptLastTwo = items.value.slice(0, -2)
  return allExceptLastTwo.map((item) => {
    let onClick = () => {
      if (item.onClick) {
        item.onClick()
      }
      if (item.route) {
        router.push(item.route)
      }
    }
    return {
      ...item,
      icon: null,
      label: item.label,
      onClick,
    }
  })
})

const crumbs = computed(() => items.value.slice(overflowedX.value ? -2 : 0))
</script>
