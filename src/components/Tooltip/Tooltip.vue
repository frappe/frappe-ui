<script setup lang="ts">
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  injectTooltipProviderContext,
} from 'reka-ui'
import TooltipBubble from './TooltipBubble.vue'
import { computed, type Component } from 'vue'
import type { TooltipProps } from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TooltipProps>(), {
  text: '',
  side: 'top',
  offset: 4,
  hoverDelay: 0.5,
  bare: false,
  disabled: false,
})

const delayDuration = computed(() => props.hoverDelay * 1000)

// When already inside a <TooltipProvider> (a button group), reuse that shared
// context so the group's skip-delay spans this tooltip too, instead of
// mounting a private provider that would isolate it.
const parentProvider = injectTooltipProviderContext(null)
const Passthrough: Component = (_, { slots }) => slots.default?.()
const Provider = computed(() => (parentProvider ? Passthrough : TooltipProvider))
const providerProps = computed(() =>
  parentProvider ? {} : { delayDuration: delayDuration.value },
)

defineSlots<{
  /**
   * The trigger. Tooltip is the one overlay whose `#default` is the trigger
   * rather than the content — the shorthand `<Tooltip text="…"><Button /></Tooltip>`
   * is the overwhelmingly common shape, and `#content` names the other half.
   */
  default?: () => any

  /** The tooltip's content. Takes precedence over `text`. */
  content?: () => any
}>()
</script>

<template>
  <slot v-if="disabled" />
  <component :is="Provider" v-else v-bind="providerProps">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipBubble
        v-if="props.text || $slots.content"
        :side="props.side"
        :offset="props.offset"
        :text="props.text"
        :bare="props.bare"
      >
        <template v-if="$slots.content" #content>
          <slot name="content" />
        </template>
      </TooltipBubble>
    </TooltipRoot>
  </component>
</template>
