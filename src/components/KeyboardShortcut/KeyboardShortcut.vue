<template>
  <span
    class="inline-flex items-center gap-0.5"
    :class="!bg ? 'text-ink-gray-5 text-sm' : ''"
    :aria-label="ariaLabel"
    role="note"
    data-slot="keyboard-shortcut"
    :data-variant="bg ? 'bg' : 'plain'"
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
  </span>
  <template v-if="uniqueAltCombos.length">
    <span class="inline-flex items-center gap-1.5" data-slot="alt-combos">
      <template
        v-for="(altCombo, i) in uniqueAltCombos"
        :key="'alt-' + i + altCombo"
      >
        <span class="text-xs text-ink-gray-4" aria-hidden="true">/</span>
        <KeyboardShortcut
          :combo="altCombo"
          :bg="bg"
          :show-plus="showPlus"
          :aria-label="'Alternative shortcut ' + altCombo"
        />
      </template>
    </span>
  </template>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { KeyboardShortcutProps } from './types'

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

const props = withDefaults(defineProps<KeyboardShortcutProps>(), {
  showPlus: true,
  altCombos: () => [],
  useIcons: true,
})

const showPlus = computed<boolean>(() => props.showPlus)

const effectiveCombo = computed(() => props.combo)

function parseCombo(raw?: string): Part[] {
  if (!raw) return []
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
    plus: '+', // alias used by toCombo to avoid delimiter collision
    '=': '+',  // equals key displayed as + (Ctrl+= fires without Shift, avoids browser zoom)
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
    // Named keys the shortcut grammar uses for digits and punctuation, so a
    // combo reads the same in `useKeyboardShortcut` and on screen.
    digit0: '0',
    digit1: '1',
    digit2: '2',
    digit3: '3',
    digit4: '4',
    digit5: '5',
    digit6: '6',
    digit7: '7',
    digit8: '8',
    digit9: '9',
    minus: '-',
    equal: '=',
    slash: '/',
    backslash: '\\',
    backtick: '`',
    comma: ',',
    period: '.',
    semicolon: ';',
    quote: "'",
    bracketleft: '[',
    bracketright: ']',
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
        if (type === 'cmd') display = '⌘'
        else if (type === 'shift') display = 'Shift'
        else if (type === 'alt') display = isMac.value ? '⌥' : 'Alt'
        else if (type === 'ctrl') display = 'Ctrl'
        else if (type === 'win') display = 'Win'
      } else {
        if (keyMap[lower]) display = keyMap[lower]
        else if (/^[a-z]$/.test(lower)) display = lower.toUpperCase()
        else if (/^f\d{1,2}$/i.test(original)) display = original.toUpperCase()
      }
      return { raw: original, type, display }
    })
  return result
}

const parsedParts = computed<Part[]>(() => parseCombo(effectiveCombo.value))

const uniqueAltCombos = computed<string[]>(() => {
  if (!props.altCombos?.length) return []
  const seen = new Set<string>([
    parsedParts.value.map((p) => p.display).join('+'),
  ])
  return props.altCombos.filter((combo) => {
    const key = parseCombo(combo)
      .map((p) => p.display)
      .join('+')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})

const ariaLabel = computed(() => {
  if (!parsedParts.value.length) return undefined
  const wordMap: Record<string, string> = {
    '⌘': 'Command',
    Shift: 'Shift',
    '⌥': 'Option',
    Alt: 'Alt',
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

function iconFor(part: Part): string | null {
  if (!props.useIcons) return null
  if (['cmd', 'shift', 'alt'].includes(part.type)) return null
  return keyIconMap[part.display] || null
}

function bgIconFor(part: Part): string | null {
  if (part.type === 'cmd') return 'lucide-command'
  return keyIconMap[part.display] || null
}
</script>
