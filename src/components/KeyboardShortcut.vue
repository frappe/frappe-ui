<template>
  <div
    class="inline-flex items-center gap-0.5 text-sm"
    :class="rootClasses"
    :aria-label="ariaLabel"
    role="note"
    v-bind="$attrs"
  >
    <!-- Primary combo rendering -->
    <template v-if="parsedParts.length">
      <template v-for="(part, idx) in parsedParts" :key="idx + '-' + part.raw">
        <!-- Explicit modifier icons -->
        <span v-if="part.type === 'cmd'">
          <LucideCommand class="w-3 h-3" aria-label="Command" />
        </span>
        <span v-else-if="part.type === 'shift'">
          <LucideShift class="w-3 h-3" aria-label="Shift" />
        </span>
        <span v-else-if="part.type === 'alt'">
          <LucideAlt class="w-3 h-3" aria-label="Option" />
        </span>
        <!-- Non-modifier key -->
        <span v-else>
          <component
            v-if="iconFor(part)"
            :is="iconFor(part)"
            class="w-3 h-3"
            :aria-label="part.display"
          />
          <span
            v-else
            class="font-mono leading-none tracking-wide uppercase text-[10px]"
            >{{ part.display }}</span
          >
        </span>
        <!-- + separator (visually): hidden from screen readers because ariaLabel combines sequence -->
        <span
          v-if="idx < parsedParts.length - 1 && showPlus"
          class="font-mono text-[10px] leading-none opacity-60"
          aria-hidden="true"
          >+</span
        >
      </template>
    </template>
    <!-- Backward compatibility path (legacy boolean props + slot) -->
    <template v-else>
      <span v-if="ctrl || meta">
        <LucideCommand v-if="isMac" class="w-3 h-3" aria-label="Command" />
        <span v-else class="font-mono text-[10px] leading-none">Ctrl</span>
      </span>
      <span v-if="shift"
        ><LucideShift class="w-3 h-3" aria-label="Shift"
      /></span>
      <span v-if="alt"><LucideAlt class="w-3 h-3" aria-label="Option" /></span>
      <slot></slot>
    </template>
  </div>
  <!-- Alternative combos (equivalents) rendered alongside -->
  <template v-if="altCombos && altCombos.length">
    <span class="inline-flex items-center gap-1 ml-1">
      <div
        v-for="(alt, i) in altCombos"
        :key="'alt-' + i + alt"
        class="inline-flex items-center gap-0.5 text-sm bg-surface-gray-2 rounded-sm text-ink-gray-5 py-0.5 px-1"
        :aria-label="'Alternative shortcut ' + alt"
      >
        <!-- Pass primitive boolean, not Ref -->
        <KeyboardShortcut :combo="alt" :show-plus="showPlus" />
      </div>
    </span>
  </template>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import LucideCommand from '~icons/lucide/command'
import LucideShift from '~icons/lucide/arrow-big-up'
import LucideAlt from '~icons/lucide/option'
import IconArrowUp from '~icons/lucide/arrow-up'
import IconArrowDown from '~icons/lucide/arrow-down'
import IconArrowLeft from '~icons/lucide/arrow-left'
import IconArrowRight from '~icons/lucide/arrow-right'
import IconEnter from '~icons/lucide/corner-down-left'
import IconBackspace from '~icons/lucide/delete'

// Robust mac detection (navigator.platform deprecated)
const isMac = computed(() => {
  if (typeof navigator === 'undefined') return false
  const p =
    (navigator as any).userAgentData?.platform || navigator.platform || ''
  if (/Mac|iPod|iPhone|iPad/i.test(p)) return true
  return /Mac OS X|Macintosh|iPhone|iPad|iPod/i.test(navigator.userAgent)
})

interface Part {
  raw: string
  type: string // cmd|ctrl|shift|alt|key|win
  display: string
}

const props = withDefaults(
  defineProps<{
    meta?: boolean
    ctrl?: boolean
    shift?: boolean
    alt?: boolean
    /** Deprecated: use combo instead */
    shortcut?: string
    /** Background chip style */
    bg?: boolean
    /** Modern single shortcut combo string, e.g. "Mod+Shift+K" */
    combo?: string
    /** Whether to visually show + separators between keys */
    showPlus?: boolean
    /** Alternative equivalent combos (display only) */
    altCombos?: string[]
    /** Render icons for certain non-modifier keys (arrows, enter, backspace) */
    useIcons?: boolean
  }>(),
  { showPlus: true, altCombos: () => [], useIcons: true },
)

const showPlus = computed<boolean>(() => props.showPlus)

// Dynamic root styling based on bg prop
const rootClasses = computed(() =>
  props.bg
    ? 'bg-surface-gray-2 rounded-sm text-ink-gray-5 py-0.5 px-1'
    : 'text-ink-gray-4',
)

// Normalize one combo string (e.g. Mod+Shift+K)
function parseCombo(raw?: string): Part[] {
  if (!raw) return []
  // Maps input token (lowercased) to a canonical type (modifier) or leaves as key.
  const aliasMap: Record<string, string> = {
    mod: isMac.value ? 'cmd' : 'ctrl',
    command: 'cmd',
    cmd: 'cmd',
    '⌘': 'cmd',
    control: 'ctrl',
    ctrl: 'ctrl',
    option: 'alt',
    opt: 'alt',
    alt: 'alt',
    '⌥': 'alt',
    shift: 'shift',
    '⇧': 'shift',
    meta: isMac.value ? 'cmd' : 'win',
    win: 'win',
    windows: 'win',
  }
  const keyMap: Record<string, string> = {
    esc: 'Esc',
    escape: 'Esc',
    enter: '↵',
    return: '↵',
    space: 'Space',
    ' ': 'Space',
    tab: 'Tab',
    backspace: '⌫',
    delete: '⌦',
    del: '⌦',
    up: '↑',
    arrowup: '↑',
    down: '↓',
    arrowdown: '↓',
    left: '←',
    arrowleft: '←',
    right: '→',
    arrowright: '→',
    pageup: 'PgUp',
    pagedown: 'PgDn',
    home: 'Home',
    end: 'End',
  }

  const result: Part[] = raw
    .split('+')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((original) => {
      const lower = original.toLowerCase()
      const type = aliasMap[lower] || 'key'
      let display = original
      if (type !== 'key') {
        // Standardize modifier glyphs / text
        if (type === 'cmd') display = '⌘'
        else if (type === 'shift') display = '⇧'
        else if (type === 'alt') display = '⌥'
        else if (type === 'ctrl') display = 'Ctrl'
        else if (type === 'win') display = 'Win'
      } else {
        if (keyMap[lower]) display = keyMap[lower]
        else if (/^[a-z]$/.test(lower)) display = lower.toUpperCase()
        else if (/^f\d{1,2}$/i.test(original)) display = original.toUpperCase()
      }
      return { raw: original, type, display }
    })

  return dedupeDeleteKeys(result)
}

// If both Backspace (⌫) and Forward Delete (⌦) are present unmodified, prefer a single representation.
function dedupeDeleteKeys(parts: Part[]): Part[] {
  const hasBack = parts.some((r) => r.display === '⌫')
  const hasFDel = parts.some((r) => r.display === '⌦')
  if (hasBack && hasFDel) {
    // On Mac, forward delete is less common (fn+Delete). Prefer just Backspace glyph.
    if (isMac.value) return parts.filter((r) => r.display !== '⌦')
    // On other platforms keep Backspace for brevity unless user explicitly wants both.
    return parts.filter((r) => r.display !== '⌦')
  }
  return parts
}

const parsedParts = computed<Part[]>(() => parseCombo(props.combo))

const ariaLabel = computed(() => {
  if (!parsedParts.value.length) return undefined
  // Build a spoken-friendly label: expand symbols to words where needed.
  const wordMap: Record<string, string> = {
    '⌘': 'Command',
    '⇧': 'Shift',
    '⌥': 'Option',
    Ctrl: 'Control',
    Win: 'Windows',
    '↵': 'Enter',
    '⌫': 'Backspace',
    '⌦': 'Delete',
    '↑': 'Up Arrow',
    '↓': 'Down Arrow',
    '←': 'Left Arrow',
    '→': 'Right Arrow',
  }
  const seq = parsedParts.value
    .map((p) => wordMap[p.display] || p.display)
    .join(' + ')
  return 'Shortcut ' + seq
})

defineOptions({ name: 'KeyboardShortcut' })

// Icon mapping for non-modifier keys when useIcons enabled
const keyIconMap: Record<string, any> = {
  '↑': IconArrowUp,
  '↓': IconArrowDown,
  '←': IconArrowLeft,
  '→': IconArrowRight,
  '↵': IconEnter,
  '⌫': IconBackspace,
}

function iconFor(part: Part) {
  if (!props.useIcons) return null
  if (['cmd', 'shift', 'alt'].includes(part.type)) return null // modifier icons handled separately
  return keyIconMap[part.display] || null
}
</script>
