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

const tabIndicatorXCss = `left-0 bottom-0 h-[2px] w-[--reka-tabs-indicator-size] transition-[width,transform] 
                          translate-x-[--reka-tabs-indicator-position] translate-y-[1px]`

const tabIndicatorYCss = `right-0 w-0.5 h-[--reka-tabs-indicator-size] transition-[height,transform]
                           translate-y-[--reka-tabs-indicator-position] translate-x-[1px]`
</script>

<template>
  <TabsRoot
    class="rounded-lg border border-outline-gray-2 data-[orientation=vertical]:flex"
    :orientation="props.vertical ? 'vertical' : 'horizontal'"
    :default-value="props.tabs[0].label"
  >
    <TabsList
      class="relative flex data-[orientation=vertical]:flex-col p-1 border-b border-outline-gray-2 data-[orientation=vertical]:border-r"
    >
      <TabsIndicator
        class="absolute rounded-full duration-300"
        :class="props.vertical ? tabIndicatorYCss : tabIndicatorXCss"
      >
        <div class="bg-grass8 w-full h-full bg-surface-gray-7" />
      </TabsIndicator>

      <TabsTrigger
        as="template"
        v-for="(item, i) in props.tabs"
        :value="item.label"
      >
        <slot name="tab-item" v-bind="{ item }">
          <component
						:is="item.route? 'router-link' : 'div'"
						:to="item.route"
            class="flex items-center gap-1.5 text-base text-ink-gray-5 duration-300 
						ease-in-out hover:text-ink-gray-9 p-2.5 data-[state=active]:text-ink-gray-9"
            :class="{ 'py-2.5 px-4': props.vertical }"
          >
            {{ item.label }}
          </component>
        </slot>
      </TabsTrigger>
    </TabsList>

    <TabsContent v-for="(item, i) in props.tabs" :value="item.label">
      <slot name="tab-panel" v-bind="{ item }"> </slot>
    </TabsContent>
  </TabsRoot>
</template>
