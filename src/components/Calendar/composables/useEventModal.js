import { ref, reactive } from 'vue';
import { parseDate, convertMinutesToHours, calculateMinutes, } from '../calendarUtils';
export default function useEventModal() {
    const showEventModal = ref(false);
    const newEvent = reactive({
        date: '',
        participant: '',
        fromDate: '',
        toDate: '',
        fromTime: '',
        toTime: '',
        venue: '',
        title: '',
        isFullDay: false,
    });
    function openNewEventModal(e, view, date, isEditMode, fromTime = '', isFullDay = false) {
        if (!isEditMode)
            return;
        date = view === 'Week' ? getDateFromWeeklyCell(e) || date : date;
        const formattedDate = parseDate(new Date(date));
        newEvent.date = formattedDate;
        newEvent.fromDate = formattedDate;
        newEvent.toDate = formattedDate;
        newEvent.isFullDay = isFullDay;
        if (view === 'Month') {
            showEventModal.value = true;
            return;
        }
        let toTime = convertMinutesToHours(calculateMinutes(fromTime) + 60).slice(0, -3);
        newEvent.fromTime = fromTime;
        newEvent.toTime = toTime;
        showEventModal.value = true;
    }
    return { showEventModal, newEvent, openNewEventModal };
}
function getDateFromWeeklyCell(e) {
    const target = e.target;
    return target?.parentElement?.parentElement?.getAttribute('data-date-attr');
}
