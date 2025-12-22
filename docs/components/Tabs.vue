<script setup lang="ts">
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "reka-ui";

type Tab = {
  label: string;
  value?: string;
  icon?: string;
  route?: string;
};

interface TabProps {
  as?: string;
  tabs: Tab[];
  vertical?: Boolean;
  variant?: "underline" | "subtle";
}

import { h } from "vue";

const props = withDefaults(defineProps<TabProps>(), {
  variant: "subtle",
});

const indicatorXCss =
  `left-0 bottom-0 h-[2px] w-[--reka-tabs-indicator-size] transition-[width,transform]
                          translate-x-[--reka-tabs-indicator-position] translate-y-[1px]`;

const indicatorYCss = `right-0 top-0 w-[2px] h-[--reka-tabs-indicator-size]
                       translate-y-[--reka-tabs-indicator-position] transition-[height,transform]`;

// Using a plain <button> element via `h('button')` to avoid picking up
// the globally registered Button component and its styles.
const Btn = h("button");

const variants = {
  underline: {
    tablist: "border-b data-[orientation=vertical]:border-r px-3",
  },
  subtle: {
    tablist: "!gap-1",
    tab: "data-[state=active]:bg-surface-gray-3 px-2 rounded",
  },
};
</script>

<template>
  <TabsRoot
    :as="props.as"
    class="flex flex-1 overflow-hidden flex-col data-[orientation=vertical]:flex-row"
    :orientation='props.vertical ? "vertical" : "horizontal"'
    :default-value="props.tabs[0].label"
  >
    <TabsList
      class="relative min-h-fit flex data-[orientation=vertical]:flex-col p-1 gap-5"
      :class='
        {
          "overflow-x-auto overflow-y-hidden ": !props.vertical,
          "py-3": props.vertical,
          [variants[props.variant]?.tablist]: true,
        }
      '
    >
      <TabsIndicator
        v-if='variant == "underline"'
        class="absolute rounded-full duration-300"
        :class="props.vertical ? indicatorYCss : indicatorXCss"
      >
        <div class="w-full h-full bg-surface-gray-7" />
      </TabsIndicator>

      <TabsTrigger
        as="template"
        v-for="(tab, i) in props.tabs"
        :value="tab?.value || i"
      >
        <slot name="tab-item" v-bind="{ tab }">
          <component
            :is='tab.route ? "router-link" : Btn'
            :to="tab.route"
            class="flex items-center gap-1.5 text-base text-ink-gray-5 duration-300 ease-in-out hover:text-ink-gray-9 data-[state=active]:text-ink-gray-9"
            :class='
              {
                "px-2.5": props.vertical,
                "py-2.5": !props.vertical,
                [variants[props.variant]?.tab]: true,
              }
            '
          >
            <component v-if="tab.icon" :is="tab.icon" class="size-4">
            </component>

            {{ tab.label }}
          </component>
        </slot>
      </TabsTrigger>
    </TabsList>

    <TabsContent
      v-if="!tabs[0]?.value"
      v-for="(tab, i) in tabs"
      :value="i"
      class="flex flex-col overflow-auto"
    >
      <slot name="tab-panel" v-bind="{ tab }" />
    </TabsContent>
  </TabsRoot>
</template>
