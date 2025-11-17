<script setup lang="ts">
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'reka-ui'

import type { TabProps } from './types'

const props = defineProps<TabProps>()
</script>

<template>
  <TabsRoot
    class="rounded-lg border border-outline-gray-1"
    :default-value="props.tabs[0].label"
  >
    <TabsList
      class="relative shrink-0 flex gap-3.5 px-3.5 border-b border-outline-gray-1"
    >
      <TabsIndicator
        class="absolute left-0 h-[2px] bottom-0 w-[--reka-tabs-indicator-size] translate-x-[--reka-tabs-indicator-position] translate-y-[1px] rounded-full transition-[width,transform] duration-300"
      >
        <div class="bg-grass8 w-full h-full bg-surface-gray-7" />
      </TabsIndicator>

      <TabsTrigger
        as="template"
        v-for="(item, i) in props.tabs"
        :value="item.label"
      >
        <slot name="tab-item" v-bind="{ item }">
          <button
            class="flex items-center gap-1.5 text-base text-ink-gray-5 duration-300 ease-in-out hover:text-ink-gray-9 py-3"
            :class="['data-[state=active]:text-ink-gray-9']"
          >
            {{ item.label }}
          </button>
        </slot>
      </TabsTrigger>
    </TabsList>

    <TabsContent
      v-for="(item, i) in props.tabs"
      class="bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
      :value="item.label"
    >
      <div class="p-5">{{ item.label + ' .' }}</div>
    </TabsContent>
  </TabsRoot>
</template>
