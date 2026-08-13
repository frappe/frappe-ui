<template>
  <span
    class="inline-flex items-center gap-0.5"
    :class="!bg ? 'text-ink-gray-5 text-sm' : ''"
    :aria-label="ariaLabel"
    :role="ariaLabel ? 'img' : undefined"
    data-slot="keyboard-shortcut"
    :data-bg="bg ? 'true' : undefined"
  >
    <template v-if="bg && parsedParts.length">
      <kbd
        v-for="(part, idx) in parsedParts"
        :key="idx + '-' + part.raw"
        class="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-4 bg-surface-gray-2 px-1.5 text-xs-medium text-ink-gray-7"
        data-slot="key"
        :data-key-type="part.type"
      >
        <span v-if="bgIconFor(part)" :class="bgIconFor(part)" class="size-3" />
        <template v-else>{{ part.display }}</template>
      </kbd>
    </template>
    <template v-else-if="parsedParts.length">
      <template v-for="(part, idx) in parsedParts" :key="idx + '-' + part.raw">
        <span
          v-if="part.type === 'cmd'"
          data-slot="key"
          :data-key-type="part.type"
        >
          <span class="lucide-command size-3" />
        </span>
        <span
          v-else-if="part.type === 'shift'"
          data-slot="key"
          :data-key-type="part.type"
        >
          <span class="lucide-arrow-big-up size-3" />
        </span>
        <span
          v-else-if="part.type === 'alt'"
          data-slot="key"
          :data-key-type="part.type"
        >
          <span class="lucide-option size-3" />
        </span>
        <span v-else data-slot="key" :data-key-type="part.type">
          <span v-if="iconFor(part)" :class="iconFor(part)" class="size-3" />
          <span v-else class="leading-none uppercase">{{ part.display }}</span>
        </span>
        <span
          v-if="idx < parsedParts.length - 1 && showPlus"
          class="font-mono text-[10px] leading-none opacity-60"
          aria-hidden="true"
          data-slot="separator"
          >+</span
        >
      </template>
    </template>
    <template v-else>
      <slot></slot>
    </template>
    <!-- The root label already spells the alternatives. A labelled `role="img"`
         replaces its whole subtree, so these chips need no `aria-hidden`. -->
    <span
      v-if="uniqueAltCombos.length"
      class="ms-1 inline-flex items-center gap-1.5"
      data-slot="alt-combos"
    >
      <template
        v-for="(altCombo, i) in uniqueAltCombos"
        :key="'alt-' + i + altCombo"
      >
        <span class="text-xs text-ink-gray-4" aria-hidden="true">/</span>
        <KeyboardShortcut :combo="altCombo" :bg="bg" :show-plus="showPlus" />
      </template>
    </span>
  </span>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import {
  isMacPlatform,
  parseCombo,
  spellOut,
  type ComboPart,
} from '../../utils/keyboardShortcutCombo'
import type { KeyboardShortcutProps } from './types'

const isMac = computed(() => isMacPlatform())

const props = withDefaults(defineProps<KeyboardShortcutProps>(), {
  showPlus: true,
  altCombos: () => [],
  useIcons: true,
})

const showPlus = computed<boolean>(() => props.showPlus)

const effectiveCombo = computed(() => props.combo)

const parse = (raw?: string) => parseCombo(raw, isMac.value)

const parsedParts = computed<ComboPart[]>(() => parse(effectiveCombo.value))

const uniqueAltCombos = computed<string[]>(() => {
  if (!props.altCombos?.length) return []
  const seen = new Set<string>([
    parsedParts.value.map((p) => p.display).join('+'),
  ])
  return props.altCombos.filter((combo) => {
    const key = parse(combo)
      .map((p) => p.display)
      .join('+')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})

// A labelled `role="img"` replaces everything inside it, so the chips are not
// read a second time. Name the alternatives here or they are never announced.
// Without a combo the root has no label, so it takes no role and the fallback
// slot stays readable.
const ariaLabel = computed(() => {
  if (!parsedParts.value.length) return undefined
  const sequences = [
    spellOut(parsedParts.value),
    ...uniqueAltCombos.value.map((combo) => spellOut(parse(combo))),
  ]
  return 'Shortcut ' + sequences.join(', or ')
})

defineOptions({ name: 'KeyboardShortcut' })

defineSlots<{
  /** Fallback content shown when no `combo` is given. */
  default?: () => any
}>()

const keyIconMap: Record<string, string> = {
  '↑': 'lucide-arrow-up',
  '↓': 'lucide-arrow-down',
  '←': 'lucide-arrow-left',
  '→': 'lucide-arrow-right',
  '↵': 'lucide-corner-down-left',
  '⌫': 'lucide-delete',
  '⌦': 'lucide-arrow-big-right-dash',
}

// Own keys only: a plain lookup walks the prototype, so an unknown token like
// `constructor` would resolve to a function and be bound as a class.
const iconNameFor = (display: string): string | null =>
  Object.hasOwn(keyIconMap, display) ? keyIconMap[display] : null

function iconFor(part: ComboPart): string | null {
  if (!props.useIcons) return null
  if (['cmd', 'shift', 'alt'].includes(part.type)) return null
  return iconNameFor(part.display)
}

// `useIcons` covers the non-modifier keys, the same set `iconFor` covers in
// plain mode. A modifier glyph is not one of them, so ⌘ stays an icon either
// way and the two modes agree.
function bgIconFor(part: ComboPart): string | null {
  if (part.type === 'cmd') return 'lucide-command'
  if (!props.useIcons) return null
  return iconNameFor(part.display)
}
</script>
