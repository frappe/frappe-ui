import { ref, inject, computed, watch, reactive, onUnmounted } from 'vue'
import { isTargetEditable } from '#composables/useKeyboardShortcut'
import { activeEvent } from './composables/useCalendarData'
import { colorMap, colorMapDark } from './calendarUtils'
import {
  CALENDAR_ACTIONS_KEY,
  CALENDAR_CONFIG_KEY,
  type CalendarColor,
  type CalendarEvent,
} from './types'

const legacyColorNamesByHex: Record<string, keyof typeof colorMap> = {
  '#db7706': 'amber',
  '#6846e3': 'violet',
  '#e34aa6': 'pink',
  '#3bbde5': 'cyan',
  '#0289f7': 'blue',
  '#e86c13': 'orange',
  '#30a66d': 'green',
}

export const isAnyPopoverOpen = ref(false)

export function useEventBase(props: { event: CalendarEvent; date: Date }) {
  const config = inject(CALENDAR_CONFIG_KEY)!
  const calendarActions = inject(CALENDAR_ACTIONS_KEY)!

  if (!config || !calendarActions) {
    throw new Error(
      'Calendar event components must be rendered inside Calendar.',
    )
  }

  const calendarEvent = ref(props.event)
  const updatedEvent = reactive({ ...props.event })

  watch(
    () => props.event,
    (newVal) => {
      updatedEvent.fromTime = newVal.fromTime
      updatedEvent.toTime = newVal.toTime
      updatedEvent.fromDate = newVal.fromDate
      updatedEvent.toDate = newVal.toDate
      updatedEvent.fromDateTime = newVal.fromDate + ' ' + newVal.fromTime
      updatedEvent.toDateTime = newVal.toDate + ' ' + newVal.toTime
      calendarEvent.value = newVal
    },
    { deep: true },
  )

  // ── Theming ──────────────────────────────────────────────────────────────

  const getTheme = () => {
    const theme = document.documentElement.getAttribute('data-theme')
    if (theme) return theme
    return document.documentElement.classList.contains('htw-dark')
      ? 'dark'
      : 'light'
  }

  function color(colorValue?: string): CalendarColor {
    const map = getTheme() === 'dark' ? colorMapDark : colorMap
    if (!colorValue?.startsWith('#'))
      return map[colorValue || 'green'] || map['green']!
    const legacyColorName = legacyColorNamesByHex[colorValue.toLowerCase()]
    if (legacyColorName) return map[legacyColorName]!
    for (const value of Object.values(map)) {
      if (value.color === colorValue) return value
    }
    return map['green']!
  }

  const eventBgStyle = computed(() => {
    const _color = color(props.event.color || 'green')
    return {
      '--bg': _color.bg,
      '--subtext': _color.subtext,
      '--text-active': _color.textActive,
      '--subtext-active': _color.subtextActive,
      '--bg-hover': _color.bgHover,
      '--bg-active': _color.bgActive,
      // On the root, not only the colour bar: a draft's dashed outline reads
      // it there, and a draft has no bar.
      '--border': _color.border,
      '--border-active': _color.borderActive,
    }
  })

  // ── Delete shortcut ──────────────────────────────────────────────────────

  function registerDeleteShortcut() {
    if (!config.isEditMode || !config.enableShortcuts) return
    document.addEventListener('keydown', handleDeleteShortcut)
  }

  function unregisterDeleteShortcut() {
    document.removeEventListener('keydown', handleDeleteShortcut)
  }

  // `close` is the ordinary way out, but it never comes if the event goes away
  // with its popover still open — which is exactly what the shortcut itself
  // does: the delete drops the event, the pill unmounts, and the listener would
  // outlive the component that owns it.
  onUnmounted(unregisterDeleteShortcut)

  // Asked of the document, so it hears keys that are owed to something else:
  // Backspace in a text field is an edit, not a delete, and swallowing it there
  // leaves the field looking uneditable. An overlay is not excluded the way the
  // view shortcuts exclude one, since an open popover is exactly when this
  // listener is meant to be live.
  function handleDeleteShortcut(e: KeyboardEvent) {
    if (e.key !== 'Delete' && e.key !== 'Backspace') return
    if (isTargetEditable(e)) return

    e.preventDefault()
    handleEventDelete()
  }

  // ── Click / edit / delete ────────────────────────────────────────────────

  const preventClick = ref(false)
  let clickTimer: ReturnType<typeof setTimeout> | null = null

  function handleEventClick(
    e: MouseEvent,
    togglePopover: () => void,
    isPopoverOpen?: boolean,
  ) {
    isAnyPopoverOpen.value = false
    if (preventClick.value) {
      preventClick.value = false
      return
    }
    if (e.detail === 1) {
      clickTimer = setTimeout(() => {
        if (calendarActions.props.onClick)
          calendarActions.props.onClick({
            e,
            calendarEvent: calendarEvent.value,
          })
        else {
          togglePopover()
          isAnyPopoverOpen.value = !isPopoverOpen
        }
      }, 200)
    }
  }

  const showEventModal = ref(false)

  function handleEventEdit(e: MouseEvent | null = null) {
    e && (e.cancelBubble = true)
    if (clickTimer) clearTimeout(clickTimer)
    if (calendarActions.props.onDblClick) {
      calendarActions.props.onDblClick({
        e,
        calendarEvent: calendarEvent.value,
      })
      return
    }
    if (!config.isEditMode) return
    showEventModal.value = true
  }

  function handleEventDelete() {
    calendarActions.deleteEvent(calendarEvent.value.id)
  }

  return {
    activeEvent,
    config,
    calendarActions,
    calendarEvent,
    updatedEvent,
    eventIcons: config.eventIcons,
    showEventModal,
    eventBgStyle,
    preventClick,
    handleEventClick,
    handleEventEdit,
    handleEventDelete,
    registerDeleteShortcut,
    unregisterDeleteShortcut,
  }
}
