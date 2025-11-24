<script setup lang="ts">
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from 'reka-ui'

import type { TabProps } from './types'
import { h } from 'vue'

const props = defineProps<TabProps>()

const indicatorXCss = `left-0 bottom-0 h-[1px] w-[--reka-tabs-indicator-size] transition-[width,transform] 
                          translate-x-[--reka-tabs-indicator-position] translate-y-[1px]`

const indicatorYCss = `right-0 w-[1px] h-[--reka-tabs-indicator-size] transition-[height,transform]
                           translate-y-[--reka-tabs-indicator-position] translate-x-[1px]`

// Using a plain <button> element via `h('button')` to avoid picking up
// the globally registered Button component and its styles.
const Btn = h('button')
</script>

<template>
  <TabsRoot
    :as="props.as"
    class="data-[orientation=vertical]:flex"
    :orientation="props.vertical ? 'vertical' : 'horizontal'"
    :default-value="props.tabs[0].label"
  >
    <TabsList
      class="relative flex data-[orientation=vertical]:flex-col p-1 border-b  data-[orientation=vertical]:border-r"
    >
      <TabsIndicator
        class="absolute rounded-full duration-300"
        :class="props.vertical ? indicatorYCss : indicatorXCss"
      >
        <div class="w-full h-full bg-surface-gray-7" />
      </TabsIndicator>

      <TabsTrigger as="template" v-for="(tab, i) in props.tabs" :value="i">
        <slot name="tab-item" v-bind="{ tab }">
          <component
            :is="tab.route ? 'router-link' : Btn"
            :to="tab.route"
            class="flex items-center gap-1.5 text-base text-ink-gray-5 duration-300 ease-in-out hover:text-ink-gray-9 p-2.5 data-[state=active]:text-ink-gray-9"
            :class="{ 'py-2.5': props.vertical,  }"
          >
            <component v-if="tab.icon" :is="tab.icon" class="size-4">
            </component>

            {{ tab.label }}
          </component>
        </slot>
      </TabsTrigger>
    </TabsList>

    <TabsContent v-for="(tab, i) in props.tabs" :value="i">
      <slot name="tab-panel" v-bind="{ tab }"> </slot>
    </TabsContent>
  </TabsRoot>
</template>
