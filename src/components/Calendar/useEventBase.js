import { ref, inject, computed, watch, reactive } from 'vue'
import { activeEvent } from './composables/useCalendarData.js'
import { colorMap, colorMapDark } from './calendarUtils'

export const eventProps = {
	event: {
		type: Object,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
}

export function useEventBase(props) {
	const config = inject('config')
	const calendarActions = inject('calendarActions')

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
		return document.documentElement.classList.contains('htw-dark') ? 'dark' : 'light'
	}

	function color(colorValue) {
		const map = getTheme() === 'dark' ? colorMapDark : colorMap
		if (!colorValue?.startsWith('#')) return map[colorValue] || map['green']
		for (const value of Object.values(map)) {
			if (value.color === colorValue) return value
		}
		return map['green']
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

	function handleDeleteShortcut(e) {
		if (e.key === 'Delete' || e.key === 'Backspace') handleEventDelete()
	}

	// ── Click / edit / delete ────────────────────────────────────────────────

	const preventClick = ref(false)
	let clickTimer = null

	function handleEventClick(e, togglePopover) {
		if (preventClick.value) {
			preventClick.value = false
			return
		}
		if (e.detail === 1) {
			clickTimer = setTimeout(() => {
				calendarActions.props.onClick
					? calendarActions.props.onClick({ e, calendarEvent: calendarEvent.value })
					: togglePopover()
			}, 200)
		}
	}

	const showEventModal = ref(false)

	function handleEventEdit(e = null) {
		e && (e.cancelBubble = true)
		clearTimeout(clickTimer)
		if (calendarActions.props.onDblClick) {
			calendarActions.props.onDblClick({ e, calendarEvent: calendarEvent.value })
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
