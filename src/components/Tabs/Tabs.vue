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
const model = defineModel<string | number>({ default: 0 })

const indicatorXCss = `left-0 bottom-0 h-[2px] w-[--reka-tabs-indicator-size] transition-[width,transform]
                          translate-x-[--reka-tabs-indicator-position] translate-y-[1px]`

const indicatorYCss = `end-0 top-0 w-[2px] h-[--reka-tabs-indicator-size]
                       translate-y-[--reka-tabs-indicator-position] transition-[height,transform]`

// Using a plain <button> element via `h('button')` to avoid picking up
// the globally registered Button component and its styles.
const Btn = h('button')

defineSlots<{
  /** Custom renderer for a tab trigger (icon + label / router-link). */
  'tab-item'?: (props: { tab: { label: string; icon?: string; route?: string } }) => any

  /** Content rendered for each tab panel. */
  'tab-panel'?: (props: { tab: { label: string; icon?: string; route?: string } }) => any
}>()
</script>

<template>
  <TabsRoot
    :as="props.as"
    class="flex flex-1 overflow-hidden flex-col data-[orientation=vertical]:flex-row"
    :orientation="props.vertical ? 'vertical' : 'horizontal'"
    :default-value="props.tabs[0].label"
    v-model="model"
  >
    <TabsList
      class="relative min-h-fit flex data-[orientation=vertical]:flex-col p-1 border-b data-[orientation=vertical]:border-e gap-5"
      :class="{
        'overflow-x-auto overflow-y-hidden px-5': !props.vertical,
        'py-3': props.vertical,
      }"
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
            class="flex items-center gap-1.5 text-base text-ink-gray-5 duration-300 ease-in-out hover:text-ink-gray-9 data-[state=active]:text-ink-gray-9"
            :class="{ 'px-2.5': props.vertical, 'py-2.5': !props.vertical }"
          >
            <component v-if="tab.icon" :is="tab.icon" class="size-4">
            </component>

            {{ tab.label }}
          </component>
        </slot>
      </TabsTrigger>
    </TabsList>

    <TabsContent
      v-for="(tab, i) in props.tabs"
      :value="i"
      class="flex flex-col overflow-auto"
    >
      <slot name="tab-panel" v-bind="{ tab }" />
    </TabsContent>
  </TabsRoot>
</template>
