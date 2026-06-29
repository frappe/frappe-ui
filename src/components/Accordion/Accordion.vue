<script setup lang="ts">
import { computed } from 'vue'
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from 'reka-ui'
import type {
  AccordionItem as AccordionItemType,
  AccordionProps,
} from './types'

const props = withDefaults(defineProps<AccordionProps>(), {
  type: 'single',
  collapsible: true,
  disabled: false,
  headingTag: 'h3',
})

// Bound when the consumer uses `v-model`; otherwise reka falls back to
// `defaultValue` and manages the open state itself.
const model = defineModel<string | string[]>()

const dir = computed<'rtl' | 'ltr'>(() =>
  typeof document !== 'undefined' && document.documentElement.dir === 'rtl'
    ? 'rtl'
    : 'ltr',
)

// reka treats `collapsible` as meaningful only for single-select accordions.
const collapsible = computed(() =>
  props.type === 'single' ? props.collapsible : undefined,
)

function itemValue(item: AccordionItemType, index: number) {
  return item.value ?? String(index)
}

defineSlots<{
  /** Custom renderer for an item's trigger label. Receives `{ item, index }`. */
  'item-label'?: (props: { item: AccordionItemType; index: number }) => any

  /**
   * Trailing, non-interactive header content (e.g. a `Badge` or count) shown
   * before the chevron. Receives `{ item, index }`.
   */
  'item-suffix'?: (props: { item: AccordionItemType; index: number }) => any

  /** Custom renderer for an item's panel. Receives `{ item, index }`. */
  'item-content'?: (props: { item: AccordionItemType; index: number }) => any
}>()
</script>

<template>
  <AccordionRoot
    :as="props.as"
    :type="props.type"
    :collapsible="collapsible"
    :disabled="props.disabled"
    :dir="dir"
    :default-value="props.defaultValue"
    v-model="model"
    class="w-full divide-y divide-outline-gray-1"
    data-slot="root"
  >
    <AccordionItem
      v-for="(item, index) in props.items"
      :key="itemValue(item, index)"
      :value="itemValue(item, index)"
      :disabled="item.disabled"
      data-slot="item"
    >
      <AccordionHeader :as="props.headingTag" class="m-0 flex">
        <AccordionTrigger
          class="group flex flex-1 select-none items-center gap-2 rounded px-2 py-3 text-left text-base font-medium text-ink-gray-8 outline-none transition-colors duration-150 hover:text-ink-gray-9 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-outline-gray-3 disabled:cursor-not-allowed disabled:text-ink-gray-4 disabled:hover:text-ink-gray-4"
          data-slot="trigger"
        >
          <span class="flex min-w-0 flex-1 items-center gap-2">
            <span
              v-if="
                item.icon &&
                typeof item.icon === 'string' &&
                item.icon.startsWith('lucide-')
              "
              class="size-4 shrink-0 text-ink-gray-6"
              :class="item.icon"
              aria-hidden="true"
            />
            <component
              v-else-if="item.icon"
              :is="item.icon"
              class="size-4 shrink-0 text-ink-gray-6"
            />
            <span class="truncate">
              <slot name="item-label" v-bind="{ item, index }">
                {{ item.title }}
              </slot>
            </span>
          </span>

          <slot name="item-suffix" v-bind="{ item, index }" />

          <span
            class="lucide-chevron-down size-4 shrink-0 text-ink-gray-5 transition-[transform,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:text-ink-gray-8 group-data-[state=open]:rotate-180 group-disabled:text-ink-gray-4 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </AccordionTrigger>
      </AccordionHeader>

      <AccordionContent class="accordion-content" data-slot="content">
        <div class="px-2 pb-3 text-p-base text-ink-gray-6">
          <slot name="item-content" v-bind="{ item, index }">
            {{ item.content }}
          </slot>
        </div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>

<style scoped>
/*
 * reka measures the panel's natural height into `--reka-accordion-content-height`,
 * so we animate height to an exact pixel target — no JS, no magic numbers. A
 * strong custom ease-out (Emil Kowalski) kept at 200ms makes it feel fast and
 * settled; a paired opacity fade keeps the reveal from popping.
 */
.accordion-content {
  overflow: hidden;
}

.accordion-content[data-state='open'] {
  animation: accordion-down 200ms cubic-bezier(0.23, 1, 0.32, 1);
}

.accordion-content[data-state='closed'] {
  animation: accordion-up 200ms cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes accordion-down {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: var(--reka-accordion-content-height);
    opacity: 1;
  }
}

@keyframes accordion-up {
  from {
    height: var(--reka-accordion-content-height);
    opacity: 1;
  }
  to {
    height: 0;
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .accordion-content[data-state='open'],
  .accordion-content[data-state='closed'] {
    animation-duration: 1ms;
  }
}
</style>
