<template>
  <span
    class="inline-flex items-center gap-1"
    :class="!bg ? 'text-ink-gray-4 text-sm' : ''"
    :aria-label="ariaLabel"
    role="note"
    v-bind="$attrs"
  >
    <template v-if="bg && parsedParts.length">
      <kbd
        v-for="(part, idx) in parsedParts"
        :key="idx + '-' + part.raw"
        class="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded bg-surface-gray-2 px-1.5 text-xs font-medium text-ink-gray-7"
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
        <span v-if="part.type === 'cmd'">
          <span class="lucide-command size-3" role="img" aria-label="Command" />
        </span>
        <span v-else-if="part.type === 'shift'">
          <span
            class="lucide-arrow-big-up size-3"
            role="img"
            aria-label="Shift"
          />
        </span>
        <span v-else-if="part.type === 'alt'">
          <span class="lucide-option size-3" role="img" aria-label="Option" />
        </span>
        <span v-else>
          <span
            v-if="iconFor(part)"
            :class="iconFor(part)"
            class="size-3"
            role="img"
            :aria-label="part.display"
          />
          <span
            v-else
            class="font-mono leading-none tracking-wide uppercase text-[10px]"
            >{{ part.display }}</span
          >
        </span>
        <span
          v-if="idx < parsedParts.length - 1 && showPlus"
          class="font-mono text-[10px] leading-none opacity-60"
          aria-hidden="true"
          >+</span
        >
      </template>
    </template>
    <template v-else>
      <span v-if="ctrl || meta">
        <span
          v-if="isMac"
          class="lucide-command size-3"
          role="img"
          aria-label="Command"
        />
        <span v-else class="font-mono text-[10px] leading-none">Ctrl</span>
      </span>
      <span v-if="shift">
        <span
          class="lucide-arrow-big-up size-3"
          role="img"
          aria-label="Shift"
        />
      </span>
      <span v-if="alt">
        <span class="lucide-option size-3" role="img" aria-label="Option" />
      </span>
      <slot></slot>
    </template>
  </span>
  <template v-if="uniqueAltCombos.length">
    <span class="inline-flex items-center gap-1.5">
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
    /** Background chip style */
    bg?: boolean
    /** Modern single shortcut combo string, e.g. "Mod+Shift+K" */
    combo?: string
    /**
     * @deprecated Use `combo` instead. Will be removed in the next major.
     * @example `<KeyboardShortcut combo="Mod+K" />` instead of `<KeyboardShortcut shortcut="Mod+K" />`
     */
    shortcut?: string
    /** Whether to visually show + separators between keys (non-bg mode only) */
    showPlus?: boolean
    /** Alternative equivalent combos (display only) */
    altCombos?: string[]
    /** Render icons for certain non-modifier keys (arrows, enter, backspace) */
    useIcons?: boolean
  }>(),
  { showPlus: true, altCombos: () => [], useIcons: true },
)

const showPlus = computed<boolean>(() => props.showPlus)

if (process.env.NODE_ENV !== 'production' && props.shortcut) {
  console.warn(
    '[KeyboardShortcut] The `shortcut` prop is deprecated. Use `combo` instead.',
  )
}

const effectiveCombo = computed(() => props.combo ?? props.shortcut)

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
    plus: '+',  // alias used by toCombo to avoid delimiter collision
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
