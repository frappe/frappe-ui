<script setup lang="ts">
// Tag (node 25406:19493) — a base for the Tag frappe-ui doesn't have yet: "a
// small element that attaches and groups related information to a record".
// Built here in the playground while library changes wait for the team.
//
//   sizes      sm 20 tall, 6 / 4 in, radius 5, 12px text
//              md 24 tall, 6 / 4 in, radius 6, 13px text
//              lg 28 tall, 8 / 6 in, radius 8, 14px text
//              regular weight; the 12px glyphs 4 from the label (2 + 2)
//   variants   solid · subtle · outline · ghost, in six themes (gray, amber,
//              red, green, blue, violet)
//   states     hover and active a step darker; focus a ring (solid: 2px of
//              the surface, then 2px outline-gray-3; the rest: 2px
//              outline-gray-3, outline and ghost on a white fill with no
//              border); disabled at half opacity on the hover fill
//   prefix     optional glyph before the label (the file's small-add, or
//              anything in the slot — an avatar, say)
//   suffix     the small-close: a dismissible tag removes itself with it,
//              or with Backspace / Delete when focused; a tag without it is
//              plain information (the file's "non dismissive" tags)
//   label      truncates to fit its container (the file's guideline)
import { computed } from 'vue'
import closeSvg from './icons/small-close.svg?raw'
import addSvg from './icons/small-add.svg?raw'

export type TagSize = 'sm' | 'md' | 'lg'
export type TagVariant = 'solid' | 'subtle' | 'outline' | 'ghost'
export type TagTheme = 'gray' | 'amber' | 'red' | 'green' | 'blue' | 'violet'

const props = withDefaults(
  defineProps<{
    label?: string
    size?: TagSize
    variant?: TagVariant
    theme?: TagTheme
    /** Show the file's add glyph before the label (the prefix slot wins). */
    prefixIcon?: boolean
    /** Show the close glyph and let the tag be removed. */
    dismissible?: boolean
    disabled?: boolean
  }>(),
  {
    size: 'sm',
    variant: 'subtle',
    theme: 'gray',
    prefixIcon: false,
    dismissible: true,
    disabled: false,
  },
)
const emit = defineEmits<{ dismiss: [] }>()
defineSlots<{ prefix?: () => unknown; default?: () => unknown }>()

// the right inset is the file's when the close glyph ends the tag; without
// it the label ends it, and the tag is even on both sides
const sizeClass = computed(
  () =>
    ({
      sm: [
        'h-5 pl-1.5 rounded-2 text-xs',
        props.dismissible ? 'pr-1' : 'pr-1.5',
      ],
      md: [
        'h-6 pl-1.5 rounded-3 text-sm',
        props.dismissible ? 'pr-1' : 'pr-1.5',
      ],
      lg: [
        'h-7 pl-2 rounded-4 text-base',
        props.dismissible ? 'pr-1.5' : 'pr-2',
      ],
    })[props.size],
)

function dismiss() {
  if (props.disabled || !props.dismissible) return
  emit('dismiss')
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Backspace' || e.key === 'Delete') {
    e.preventDefault()
    dismiss()
  }
}
</script>

<template>
  <span
    class="tag inline-flex max-w-full shrink-0 select-none items-center gap-1 whitespace-nowrap outline-none"
    :class="[
      sizeClass,
      `tag--${variant}`,
      `tag--${theme}`,
      disabled && 'tag--disabled',
    ]"
    :tabindex="disabled ? undefined : 0"
    :aria-disabled="disabled || undefined"
    @keydown="onKey"
  >
    <span v-if="$slots.prefix" class="flex shrink-0 items-center">
      <slot name="prefix" />
    </span>
    <span
      v-else-if="prefixIcon"
      class="tag-glyph tag-glyph--prefix"
      aria-hidden="true"
      v-html="addSvg"
    />
    <span class="flex min-w-0 items-center gap-0.5">
      <span class="min-w-0 truncate" :class="dismissible && 'pr-0.5'">
        <slot>{{ label }}</slot>
      </span>
      <button
        v-if="dismissible"
        type="button"
        class="tag-glyph tag-close"
        tabindex="-1"
        :disabled="disabled"
        :aria-label="`Remove ${label ?? ''}`.trim()"
        @click.stop="dismiss"
        v-html="closeSvg"
      />
    </span>
  </span>
</template>

<style scoped>
/* the theme's colours, as variables the variants read; gray is the one
   whose solid runs dark-to-darker (10 → 9 → 8), the colours run 7 → 8 → 9 */
.tag--gray {
  --tag-solid: var(--surface-gray-10);
  --tag-solid-hover: var(--surface-gray-9);
  --tag-solid-active: var(--surface-gray-8);
  --tag-soft: var(--surface-gray-2);
  --tag-soft-hover: var(--surface-gray-3);
  --tag-soft-active: var(--surface-gray-4);
  --tag-ink: var(--ink-gray-7);
  --tag-line: var(--outline-gray-2);
  --tag-line-hover: var(--outline-gray-3);
}
.tag--amber,
.tag--red,
.tag--green,
.tag--blue,
.tag--violet {
  --tag-on-solid: var(--ink-base);
}
.tag--amber {
  --tag-solid: var(--surface-amber-7);
  --tag-solid-hover: var(--surface-amber-8);
  --tag-solid-active: var(--surface-amber-9);
  --tag-soft: var(--surface-amber-2);
  --tag-soft-hover: var(--surface-amber-3);
  --tag-soft-active: var(--surface-amber-4);
  --tag-ink: var(--ink-amber-7);
  --tag-line: var(--outline-amber-2);
  --tag-line-hover: var(--outline-amber-3);
}
.tag--red {
  --tag-solid: var(--surface-red-7);
  --tag-solid-hover: var(--surface-red-8);
  --tag-solid-active: var(--surface-red-9);
  --tag-soft: var(--surface-red-2);
  --tag-soft-hover: var(--surface-red-3);
  --tag-soft-active: var(--surface-red-4);
  --tag-ink: var(--ink-red-7);
  --tag-line: var(--outline-red-2);
  --tag-line-hover: var(--outline-red-3);
}
.tag--green {
  --tag-solid: var(--surface-green-7);
  --tag-solid-hover: var(--surface-green-8);
  --tag-solid-active: var(--surface-green-9);
  --tag-soft: var(--surface-green-2);
  --tag-soft-hover: var(--surface-green-3);
  --tag-soft-active: var(--surface-green-4);
  --tag-ink: var(--ink-green-7);
  --tag-line: var(--outline-green-2);
  --tag-line-hover: var(--outline-green-3);
}
.tag--blue {
  --tag-solid: var(--surface-blue-7);
  --tag-solid-hover: var(--surface-blue-8);
  --tag-solid-active: var(--surface-blue-9);
  --tag-soft: var(--surface-blue-2);
  --tag-soft-hover: var(--surface-blue-3);
  --tag-soft-active: var(--surface-blue-4);
  --tag-ink: var(--ink-blue-7);
  --tag-line: var(--outline-blue-2);
  --tag-line-hover: var(--outline-blue-3);
}
.tag--violet {
  --tag-solid: var(--surface-violet-7);
  --tag-solid-hover: var(--surface-violet-8);
  --tag-solid-active: var(--surface-violet-9);
  --tag-soft: var(--surface-violet-2);
  --tag-soft-hover: var(--surface-violet-3);
  --tag-soft-active: var(--surface-violet-4);
  --tag-ink: var(--ink-violet-7);
  /* the file's violet outline sits a step darker than blue's */
  --tag-line: var(--outline-violet-3);
  --tag-line-hover: var(--outline-violet-4);
}

.tag {
  font-weight: 420;
  letter-spacing: 0.02em;
  transition:
    background-color 100ms ease-out,
    box-shadow 100ms ease-out;
}

/* solid */
.tag--solid {
  background: var(--tag-solid);
  color: var(--tag-on-solid, var(--ink-base));
}
.tag--solid:hover {
  background: var(--tag-solid-hover);
}
.tag--solid:active {
  background: var(--tag-solid-active);
}
.tag--solid:focus-visible {
  box-shadow:
    0 0 0 2px var(--surface-base),
    0 0 0 4px var(--outline-gray-3);
}
.tag--solid.tag--disabled {
  background: var(--tag-solid-hover);
}

/* subtle */
.tag--subtle {
  background: var(--tag-soft);
  color: var(--tag-ink);
}
.tag--subtle:hover,
.tag--subtle.tag--disabled {
  background: var(--tag-soft-hover);
}
.tag--subtle:active {
  background: var(--tag-soft-active);
}

/* outline: a 1px line inside */
.tag--outline {
  color: var(--tag-ink);
  box-shadow: inset 0 0 0 1px var(--tag-line);
}
.tag--outline:hover {
  box-shadow: inset 0 0 0 1px var(--tag-line-hover);
}
.tag--outline:active {
  background: var(--tag-soft-active);
  box-shadow: none;
}

/* ghost */
.tag--ghost {
  color: var(--tag-ink);
}
.tag--ghost:hover {
  background: var(--tag-soft-hover);
}
.tag--ghost:active {
  background: var(--tag-soft-active);
}

/* focus (not solid): a 2px ring; outline and ghost sit on the surface */
.tag--subtle:focus-visible {
  box-shadow: 0 0 0 2px var(--outline-gray-3);
}
.tag--outline:focus-visible,
.tag--ghost:focus-visible {
  background: var(--surface-base);
  box-shadow: 0 0 0 2px var(--outline-gray-3);
}

/* disabled: half opacity, nothing reacts */
.tag--disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* the 12px glyphs */
.tag-glyph {
  display: inline-flex;
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  color: currentColor;
}
.tag-glyph :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
/* the file keeps the prefix glyph out of the theme: ink-gray-7, white on
   solid */
.tag-glyph--prefix {
  color: var(--ink-gray-7);
}
.tag--solid .tag-glyph--prefix {
  color: var(--ink-base);
}
.tag-close {
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}
</style>
