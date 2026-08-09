# Calendar

A date and event view for schedules, with Month, Week, and Day modes.

## Default

<ComponentPreview name="Calendar-Examples" csr="true" />

## Custom Header

Pass a `#header` slot to replace the default toolbar. The slot receives the
current title (`currentMonthYear`), the active view (`activeView`), the
enabled view options (`enabledModes`), and navigation functions
(`increment`, `decrement`, `updateActiveView`, `setCalendarDate`,
`onMonthYearChange`).

<ComponentPreview name="Calendar-CustomHeader" csr="true" />

## Events

Each entry in `events` is a `CalendarEvent`:

```ts
{
  id: 'EV-001',
  title: 'Design review',
  participant: 'Jane Doe',
  venue: 'Room 1',
  fromDate: '2026-08-10',
  toDate: '2026-08-10',
  fromTime: '10:00',
  toTime: '11:00',
  color: 'blue',       // amber | violet | pink | cyan | blue | orange | green
  isFullDay: false,
}
```

The calendar keeps an internal copy of `events` and refreshes it when the
prop changes. Edits made inside the calendar (create, drag, resize, delete)
mutate the copy and come back through the `create`, `update`, and `delete`
emits — persist them and refresh your source of truth from there.

`CalendarColorMap` exports the color palette (`amber`, `violet`, `pink`,
`cyan`, `blue`, `orange`, `green`) with the CSS variables used per state, for
building matching UI such as a color picker.

## Config

The `config` prop takes a partial `CalendarConfig`; unset keys use these
defaults:

```ts
{
  defaultMode: 'Month',   // 'Day' | 'Week' | 'Month'
  disableModes: [],       // views removed from the view switcher
  isEditMode: false,      // create / drag / resize / delete
  enableShortcuts: true,  // keyboard shortcuts (below)
  scrollToHour: 15,       // hour Week and Day views scroll to
  hourHeight: 50,         // pixel height of one hour row
  timeFormat: '12h',      // '12h' | '24h'
  weekends: ['sunday'],   // days shaded as weekend
  eventIcons: {},         // icons keyed by an event's `type`
  showIcon: true,         // show the eventIcons icon on cards
  noBorder: false,        // remove the outer grid border
}
```

`eventIcons` values are Vue components.

## Keyboard shortcuts

With `enableShortcuts` on: `m` / `w` / `d` switch views, `t` jumps to today,
`←` / `→` navigate, and `Delete` removes the event whose popover is open
(edit mode only).

## Click handling

By default, a single click on an event opens its detail popover and a double
click opens the edit modal (edit mode only). Clicking an empty cell opens the
new-event modal in edit mode. Each behavior is replaceable with the
`onClick`, `onDblClick`, and `onCellClick` callback props — passing one turns
the default off for that interaction.

The popover's content is replaceable with the `#event-popover-content` slot,
which receives `{ calendarEvent, date, isEditMode, close }`.

`CalendarActiveEvent` exports the ref holding the id of the event whose
popover is open. Set it from outside to highlight an event, or clear it with
an empty string. The ref is module-level: every `<Calendar>` on the page
shares it.

## Template ref

A template ref on `<Calendar>` exposes the calendar's state and navigation:

```vue
<Calendar ref="calendar" :events="events" />
```

```ts
const calendar = useTemplateRef('calendar')

calendar.value.setCalendarDate('2026-08-10') // jump to a date (today if omitted)
calendar.value.updateActiveView('Week') // switch the view
calendar.value.activeView // the visible view
calendar.value.increment() // move forward one day / week / month
calendar.value.decrement() // move back one day / week / month
calendar.value.reloadEvents() // re-sync the internal copy of `events`
calendar.value.currentMonthYear // formatted title, e.g. "August 2026"
calendar.value.currentYear // 2026
calendar.value.currentMonth // 7 (0 = January)
calendar.value.currentDay // day of month anchoring the view
calendar.value.enabledModes // view options not disabled via config (fixed at mount)
calendar.value.selectedMonthDate // the month picker's date, `YYYY-MM-DD`
calendar.value.onMonthYearChange // jump to a date and sync the month picker
```

<!-- @include: ./Calendar.api.md -->
