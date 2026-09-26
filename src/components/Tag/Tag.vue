<template>
  <component
    :is="interactive ? 'button' : 'span'"
    ref="rootRef"
    :type="interactive ? 'button' : undefined"
    class="inline-flex shrink-0 select-none items-center whitespace-nowrap leading-tighter transition-colors disabled:cursor-not-allowed disabled:opacity-50"
    :class="classes"
    :disabled="interactive ? props.disabled : undefined"
    :aria-disabled="!interactive && props.disabled ? 'true' : undefined"
    :aria-keyshortcuts="props.dismissible ? 'Delete Backspace' : undefined"
    :aria-describedby="props.dismissible ? hintId : undefined"
    data-slot="tag"
    :data-variant="variant"
    :data-size="size"
    :data-color="theme"
    :data-disabled="props.disabled ? '' : undefined"
    @keydown.delete="dismiss"
  >
    <span class="flex min-w-0 items-center gap-0.5">
      <span
        v-if="$slots.prefix"
        data-slot="prefix"
        class="flex size-3 shrink-0 items-center justify-center *:size-full"
      >
        <slot name="prefix" />
      </span>
      <span class="truncate pr-0.5">
        <slot>{{ props.label?.toString() }}</slot>
      </span>
      <span
        v-if="$slots.suffix"
        data-slot="suffix"
        class="flex size-3 shrink-0 items-center justify-center *:size-full"
      >
        <slot name="suffix" />
      </span>
      <span
        v-if="props.dismissible"
        data-slot="dismiss"
        class="flex size-3 shrink-0 items-center justify-center"
        aria-hidden="true"
        @click.stop="dismiss"
      >
        <span class="lucide-x size-3" />
      </span>
    </span>
    <span v-if="props.dismissible" :id="hintId" class="sr-only">
      Press Delete to remove
    </span>
  </component>
</template>

<script lang="ts" setup>
import { computed, ref, useAttrs, useId } from 'vue'
import { resolvePropValue } from '../../utils/resolvePropValue'
import type { TagEmits, TagExposed, TagProps, TagSlots } from './types'

const props = withDefaults(defineProps<TagProps>(), {
  theme: 'gray',
  size: 'md',
  variant: 'subtle',
  dismissible: false,
  disabled: false,
})

const emit = defineEmits<TagEmits>()

defineSlots<TagSlots>()

const attrs = useAttrs()
const rootRef = ref<HTMLElement | null>(null)
const hintId = useId()

// A tag with nothing to do (no click listener, not dismissible) renders as a
// plain span: no tab stop, no button role and no hover or pressed states, so
// a static label is not announced as a button that does nothing.
const interactive = computed(() => props.dismissible || !!attrs.onClick)

defineExpose<TagExposed>({
  /** Moves focus to the tag. Does nothing on a non-interactive tag. */
  focus: (options?: FocusOptions) => rootRef.value?.focus(options),
})

// Every value below is the espresso 2.0 `tag` component's variable binding,
// one Figma variable to one frappe-ui token. Tailwind's JIT needs literal
// class names, so the per-theme strings are inlined.
//
//   rest    the default state, also what a disabled tag shows at 50%
//   states  hover, pressed and keyboard focus
//
// The outline border is an inset ring, like Figma's inside stroke, so all
// four variants keep the same box and dropping the border on press or focus
// does not move the label. Pressed and focused outline tags lose the border
// and take a fill instead; focused outline and ghost tags sit on
// `surface-base`.
const themeClasses = {
  gray: {
    solid: {
      rest: 'text-ink-base bg-surface-gray-10',
      states: 'hover:bg-surface-gray-9 active:bg-surface-gray-8',
    },
    subtle: {
      rest: 'text-ink-gray-7 bg-surface-gray-2',
      states: 'hover:bg-surface-gray-3 active:bg-surface-gray-4',
      // The one theme whose disabled fill is not its resting fill.
      disabled: 'text-ink-gray-7 bg-surface-gray-3',
    },
    outline: {
      rest: 'text-ink-gray-7 ring-1 ring-inset ring-outline-gray-2',
      states:
        'hover:ring-outline-gray-3 focus-visible:ring-0 focus-visible:bg-surface-base active:ring-0 active:bg-surface-gray-4',
    },
    ghost: {
      rest: 'text-ink-gray-7',
      states:
        'hover:bg-surface-gray-3 focus-visible:bg-surface-base active:bg-surface-gray-4',
    },
  },
  blue: {
    solid: {
      rest: 'text-white bg-surface-blue-7',
      states: 'hover:bg-surface-blue-8 active:bg-surface-blue-6',
    },
    subtle: {
      rest: 'text-ink-blue-7 bg-surface-blue-2',
      states: 'hover:bg-surface-blue-3 active:bg-surface-blue-4',
    },
    outline: {
      rest: 'text-ink-blue-7 ring-1 ring-inset ring-outline-blue-2',
      states:
        'hover:ring-outline-blue-3 focus-visible:ring-0 focus-visible:bg-surface-base active:ring-0 active:bg-surface-blue-4',
    },
    ghost: {
      rest: 'text-ink-blue-7',
      states:
        'hover:bg-surface-blue-3 focus-visible:bg-surface-base active:bg-surface-blue-4',
    },
  },
  green: {
    solid: {
      rest: 'text-white bg-surface-green-7',
      states: 'hover:bg-surface-green-8 active:bg-surface-green-6',
    },
    subtle: {
      rest: 'text-ink-green-7 bg-surface-green-2',
      states: 'hover:bg-surface-green-3 active:bg-surface-green-4',
    },
    outline: {
      rest: 'text-ink-green-7 ring-1 ring-inset ring-outline-green-2',
      states:
        'hover:ring-outline-green-3 focus-visible:ring-0 focus-visible:bg-surface-base active:ring-0 active:bg-surface-green-4',
    },
    ghost: {
      rest: 'text-ink-green-7',
      states:
        'hover:bg-surface-green-3 focus-visible:bg-surface-base active:bg-surface-green-4',
    },
  },
  amber: {
    solid: {
      rest: 'text-white bg-surface-amber-7',
      states: 'hover:bg-surface-amber-8 active:bg-surface-amber-6',
    },
    subtle: {
      rest: 'text-ink-amber-7 bg-surface-amber-2',
      states: 'hover:bg-surface-amber-3 active:bg-surface-amber-4',
    },
    outline: {
      rest: 'text-ink-amber-7 ring-1 ring-inset ring-outline-amber-3',
      states:
        'hover:ring-outline-amber-4 focus-visible:ring-0 focus-visible:bg-surface-base active:ring-0 active:bg-surface-amber-4',
    },
    ghost: {
      rest: 'text-ink-amber-7',
      states:
        'hover:bg-surface-amber-3 focus-visible:bg-surface-base active:bg-surface-amber-4',
    },
  },
  red: {
    solid: {
      rest: 'text-white bg-surface-red-7',
      states: 'hover:bg-surface-red-8 active:bg-surface-red-6',
    },
    subtle: {
      rest: 'text-ink-red-7 bg-surface-red-2',
      states: 'hover:bg-surface-red-3 active:bg-surface-red-4',
    },
    outline: {
      rest: 'text-ink-red-7 ring-1 ring-inset ring-outline-red-3',
      states:
        'hover:ring-outline-red-4 focus-visible:ring-0 focus-visible:bg-surface-base active:ring-0 active:bg-surface-red-4',
    },
    ghost: {
      rest: 'text-ink-red-7',
      states:
        'hover:bg-surface-red-3 focus-visible:bg-surface-base active:bg-surface-red-4',
    },
  },
  violet: {
    solid: {
      rest: 'text-white bg-surface-violet-7',
      states: 'hover:bg-surface-violet-8 active:bg-surface-violet-6',
    },
    subtle: {
      rest: 'text-ink-violet-7 bg-surface-violet-2',
      states: 'hover:bg-surface-violet-3 active:bg-surface-violet-4',
    },
    outline: {
      rest: 'text-ink-violet-7 ring-1 ring-inset ring-outline-violet-3',
      states:
        'hover:ring-outline-violet-4 focus-visible:ring-0 focus-visible:bg-surface-base active:ring-0 active:bg-surface-violet-4',
    },
    ghost: {
      rest: 'text-ink-violet-7',
      states:
        'hover:bg-surface-violet-3 focus-visible:bg-surface-base active:bg-surface-violet-4',
    },
  },
}

// The tag's focus ring is the theme's `outline-*-3`, not the global
// `focus-*` token. Only the colour is set, so the width still comes from the
// global `:focus-visible` rule (2px light, 3px dark).
const focusClasses = {
  gray: 'focus-visible:[outline-color:var(--outline-gray-3)]',
  blue: 'focus-visible:[outline-color:var(--outline-blue-3)]',
  green: 'focus-visible:[outline-color:var(--outline-green-3)]',
  amber: 'focus-visible:[outline-color:var(--outline-amber-3)]',
  red: 'focus-visible:[outline-color:var(--outline-red-3)]',
  violet: 'focus-visible:[outline-color:var(--outline-violet-3)]',
}

// A solid tag's ring stands 2px off its edge; the others sit tight against it.
const focusOffsetClasses = {
  solid: 'focus-visible:outline-offset-2',
  subtle: '',
  outline: '',
  ghost: '',
}

// Heights 20 / 24 / 28. The label keeps 2px on its right, so without a suffix
// the right inset matches the left one.
const sizeClasses = {
  sm: 'h-5 rounded-2 pl-1.5 pr-1 text-xs',
  md: 'h-6 rounded-3 pl-1.5 pr-1 text-sm',
  lg: 'h-7 rounded-4 pl-2 pr-1.5 text-base',
}

// Each axis resolves through `resolvePropValue`, so a value outside the union
// degrades to the prop's default and warns in dev, as it does on Badge. The
// resolved names, not the raw props, also feed the `data-*` hooks.
function keysOf<K extends string>(table: Record<K, unknown>) {
  return Object.fromEntries(Object.keys(table).map((k) => [k, k])) as Record<
    K,
    K
  >
}

const theme = computed(() =>
  resolvePropValue(keysOf(themeClasses), props.theme, 'gray', {
    component: 'Tag',
    prop: 'theme',
  }),
)
const variant = computed(() =>
  resolvePropValue(keysOf(focusOffsetClasses), props.variant, 'subtle', {
    component: 'Tag',
    prop: 'variant',
  }),
)
const size = computed(() =>
  resolvePropValue(keysOf(sizeClasses), props.size, 'md', {
    component: 'Tag',
    prop: 'size',
  }),
)

const classes = computed(() => {
  const look: { rest: string; states: string; disabled?: string } =
    themeClasses[theme.value][variant.value]
  return [
    sizeClasses[size.value],
    props.disabled || !interactive.value
      ? props.disabled
        ? (look.disabled ?? look.rest)
        : look.rest
      : [
          look.rest,
          look.states,
          focusClasses[theme.value],
          focusOffsetClasses[variant.value],
        ],
  ]
})

function dismiss() {
  if (!props.dismissible || props.disabled) return
  emit('dismiss')
}
</script>
