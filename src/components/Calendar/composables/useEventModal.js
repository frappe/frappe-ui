import { ref, reactive } from 'vue'
import {
  parseDate,
  convertMinutesToHours,
  calculateMinutes,
} from '../calendarUtils'

export default function useEventModal() {
  const showEventModal = ref(false)
  const newEvent = reactive({
    date: '',
    participant: '',
    from_time: '',
    to_time: '',
    venue: '',
    title: '',
  })
  function openNewEventModal(e, view, date, isEditMode, from_time = '') {
    if (!isEditMode) return
    date =
      view === 'Week'
        ? e.target.parentNode.parentNode.getAttribute('data-date-attr')
        : date
    newEvent.date = parseDate(new Date(date))
    if (view === 'Month') {
      showEventModal.value = true
      return
    }

    let to_time = convertMinutesToHours(calculateMinutes(from_time) + 60).slice(
      0,
      -3,
    )

    newEvent.from_time = from_time
    newEvent.to_time = to_time
    showEventModal.value = true
  }

  return { showEventModal, newEvent, openNewEventModal }
}
