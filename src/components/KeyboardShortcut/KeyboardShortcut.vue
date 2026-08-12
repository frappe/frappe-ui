<template>
  <span
    class="inline-flex items-center gap-0.5"
    :class="!bg ? 'text-ink-gray-5 text-sm' : ''"
    :aria-label="ariaLabel"
    role="note"
    data-slot="keyboard-shortcut"
    :data-bg="bg ? 'true' : undefined"
    v-bind="$attrs"
  >
    <template v-if="bg && parsedParts.length">
      <kbd
        v-for="(part, idx) in parsedParts"
        :key="idx + '-' + part.raw"
        class="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-4 bg-surface-gray-2 px-1.5 text-xs-medium text-ink-gray-7"
        data-slot="key"
        :data-key-type="part.type"
      >
        <span
          v-if="bgIconFor(part)"
          :class="bgIconFor(part)"
          class="size-3"
          role="img"
          :aria-label="part.display"
        />
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
          <span class="lucide-command size-3" role="img" aria-label="Command" />
        </span>
        <span
          v-else-if="part.type === 'shift'"
          data-slot="key"
          :data-key-type="part.type"
        >
          <span
            class="lucide-arrow-big-up size-3"
            role="img"
            aria-label="Shift"
          />
        </span>
        <span
          v-else-if="part.type === 'alt'"
          data-slot="key"
          :data-key-type="part.type"
        >
          <span class="lucide-option size-3" role="img" aria-label="Option" />
        </span>
        <span v-else data-slot="key" :data-key-type="part.type">
          <span
            v-if="iconFor(part)"
            :class="iconFor(part)"
            class="size-3"
            role="img"
            :aria-label="part.display"
          />
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
    <!-- The root label already spells the alternatives, so hide the nested
         notes and let a screen reader meet each alternative once. -->
    <span
      v-if="uniqueAltCombos.length"
      class="ms-1 inline-flex items-center gap-1.5"
      data-slot="alt-combos"
      :aria-hidden="ariaLabel ? 'true' : undefined"
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
import { parseCombo, spellOut, type ComboPart } from './combo'
import type { KeyboardShortcutProps } from './types'

const isMac = computed(() => {
  if (typeof navigator === 'undefined') return false
  const p =
    (navigator as any).userAgentData?.platform || navigator.platform || ''
  if (/Mac|iPod|iPhone|iPad/i.test(p)) return true
  return /Mac OS X|Macintosh|iPhone|iPad|iPod/i.test(navigator.userAgent)
})

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

// The root is a labelled `role="note"`, so its label replaces everything
// inside it. Name the alternatives here or they are never announced.
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

function iconFor(part: ComboPart): string | null {
  if (!props.useIcons) return null
  if (['cmd', 'shift', 'alt'].includes(part.type)) return null
  return keyIconMap[part.display] || null
}

function bgIconFor(part: ComboPart): string | null {
  if (part.type === 'cmd') return 'lucide-command'
  return keyIconMap[part.display] || null
}
</script>
