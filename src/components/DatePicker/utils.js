import { dayjs, dayjsLocal } from '../../utils/dayjs';
// Constant list of month labels
export const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
// Start of given month (0-indexed month)
export function monthStart(year, monthIndex) {
    return dayjs(`${year}-${monthIndex + 1}-01`);
}
// Build weeks grid for the calendar
export function generateWeeks(year, monthIndex, selected) {
    // Always emit 6 rows × 7 days so the calendar height stays constant — both
    // across months in a single pane (no jiggle when navigating) and between
    // panes in dual-pane mode (where one month may span 5 weeks and the other 6).
    const start = monthStart(year, monthIndex).startOf('week');
    const days = [];
    let d = start;
    const sel = dayjs(selected);
    const today = dayjsLocal().format('YYYY-MM-DD');
    for (let i = 0; i < 42; i++) {
        days.push({
            date: d,
            key: d.format('YYYY-MM-DD'),
            inMonth: d.month() === monthIndex,
            isToday: d.isSame(today, 'day'),
            isSelected: sel.isValid() && d.isSame(sel, 'day'),
        });
        d = d.add(1, 'day');
    }
    const chunked = [];
    for (let i = 0; i < days.length; i += 7)
        chunked.push(days.slice(i, i + 7));
    return chunked;
}
export function getDateValue(date) {
    if (!date || date.toString() === 'Invalid Date')
        return '';
    return dayjs(date)
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)
        .format('YYYY-MM-DD');
}
/**
 * @deprecated Legacy helper used by the deprecated {@link useDatePicker} composable.
 * Will be removed after v1.x. Use `dayjs` directly.
 */
export function getDate(...args) {
    return new Date(...args);
}
/**
 * @deprecated Legacy helper used by the deprecated {@link useDatePicker} composable.
 * Will be removed after v1.x. Use `dayjs().add(n, 'day')` instead.
 */
export function getDatesAfter(date, count) {
    let incrementer = 1;
    if (count < 0) {
        incrementer = -1;
        count = Math.abs(count);
    }
    const dates = [];
    while (count) {
        date = getDate(date.getFullYear(), date.getMonth(), date.getDate() + incrementer);
        dates.push(date);
        count--;
    }
    if (incrementer === -1) {
        return dates.reverse();
    }
    return dates;
}
/**
 * @deprecated Legacy helper used by the deprecated {@link useDatePicker} composable.
 * Will be removed after v1.x. Use `dayjs(...).daysInMonth()` instead.
 */
export function getDaysInMonth(monthIndex, year) {
    const daysInMonthMap = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const daysInMonth = daysInMonthMap[monthIndex];
    if (monthIndex === 1 && isLeapYear(year)) {
        return 29;
    }
    return daysInMonth;
}
/**
 * @deprecated Legacy helper used by the deprecated {@link useDatePicker} composable.
 * Will be removed after v1.x.
 */
export function isLeapYear(year) {
    if (year % 400 === 0)
        return true;
    if (year % 100 === 0)
        return false;
    if (year % 4 === 0)
        return true;
    return false;
}
