import { ref, inject, computed, watch, reactive } from 'vue'
import { activeEvent } from './composables/useCalendarData'
import { colorMap, colorMapDark } from './calendarUtils'
import {
  CALENDAR_ACTIONS_KEY,
  CALENDAR_CONFIG_KEY,
  type CalendarColor,
  type CalendarEvent,
} from './types'

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
    for (const value of Object.values(map)) {
      if (value.color === colorValue) return value
    }
    return map['green']!
  }

  const eventBgStyle = computed(() => {
    const _color = color(props.event.color || 'green')
    return {
      '--bg': _color.bg,
      '--text': _color.text,
      '--subtext': _color.subtext,
      '--text-active': _color.textActive,
      '--subtext-active': _color.subtextActive,
      '--bg-hover': _color.bgHover,
      '--bg-active': _color.bgActive,
    }
  })

  const eventBorderStyle = computed(() => {
    const _color = color(props.event.color || 'green')
    return { '--border': _color.border, '--border-active': _color.borderActive }
  })

  // ── Delete shortcut ──────────────────────────────────────────────────────

  function registerDeleteShortcut() {
    if (!config.isEditMode || !config.enableShortcuts) return
    document.addEventListener('keydown', handleDeleteShortcut)
  }

  function unregisterDeleteShortcut() {
    document.removeEventListener('keydown', handleDeleteShortcut)
  }

  function handleDeleteShortcut(e: KeyboardEvent) {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      handleEventDelete()
    }
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
    eventBorderStyle,
    preventClick,
    handleEventClick,
    handleEventEdit,
    handleEventDelete,
    registerDeleteShortcut,
    unregisterDeleteShortcut,
  }
}
