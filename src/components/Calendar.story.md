## Props

### events

`events` is an array of objects, where each object consists of a single event.
By default the value of events props is an empty array `[]`

A single event can be of 2 types

1. Timed Event, event which has a start and end time.

Event object looks like:

    {
    	title: 'English by Ryan Mathew',
    	participant: 'Ryan Mathew',
    	id: 'EDU-CSH-2024-00091',
    	venue: 'CNF-ROOM-2024-00001',
    	fromDate: '2024-07-08 16:30:00',
    	toDate: '2024-07-08 17:30:00',
    	color: 'green',
    },

- `id, fromDate, toDate,` keys are mandatory for this kind of event.

- `id` should be unique for each event.

- `fromDate` and `toDate` should be in the above format or can be a date object.
  Currently Single date event is created and it is taken from fromDate. In
  future multiple day events will also be introduced.

- `color` can be from a list of

`["blue","green", "red", "orange", "yellow", "teal", "violet", "cyan", "purple", "pink", "amber"].`

If any other color is provided then the default color will be "green".

2. Full Day Event

The object for this kind of event looks like:

    {
    	title: 'Zoom Meet with Sheldon',
    	participant: 'Sheldon',
    	id: '#htrht42',
    	venue: 'Google Meet',
    	fromDate: '2024-07-21 00:00:00',
    	toDate: '2024-07-21 23:59:59',
    	color: 'amber',
    	isFullDay: true,
    },

- `id, isFullDay,fromDate, toDate` keys are mandatory for this kind of event.

### config

`config` is an object which consists of the following keys:

    {

    	disableModes: [],
    	defaultMode: 'Month',
    	isEditMode: false,
    	eventIcons: {},
    	redundantCellHeight: 50,
    	hourHeight: 50,
    	enableShortcuts: true,

    }

- `disableModes`: This is an array of strings which consists of the modes which
  are to be disabled. The default value is an empty array. If the value is
  ['Day'] then the Day mode will be disabled and the user will not be able to
  switch to the Day mode. Only the Week and Month mode will be available.

- `defaultMode`: This is the default mode in which the calendar will be loaded.
  The default value is 'Month'. It can be one of the following values:

      - Day
      - Week
      - Month

- `isEditMode`: This is a boolean value which is used to enable or disable the
  edit mode. The default value is false. So by default the calendar is in
  read-only mode. If it is set to true then the user can perform actions like
  adding, editing, and deleting the events.

- `eventIcons`: This is an object which consists of the icons which are to be
  displayed for the events. The default value is an empty object. This objects
  changes the icon of the event on the basis of the type of event. If the type
  of event is not present in the object then the default icon will be displayed.
  `type_of_event` property can be set in the event object to display the icon.
  The icon of the event will be taken from this object. So if your event has an
  event type of "Call" then the icon will be taken from this object. The object
  should be in the following format:

      {
      	'type_of_event1': 'icon_component1',
      	'type_of_event2': 'icon_component2',
      }

e.g.

    {
    	'Call': <CallIcon />,
    	'Meeting': <MeetingIcon />,
    }

- `redundantCellHeight`: The height of the cell to display full day events. This
  value is in Pixel, by default the value is `50px`.
- `hourHeight`: The height of each cell below the full day events cell. This
  value is in pixel, by default the value is `50px`.
- `enableShortcuts`: Boolean value which determines whether shortcuts will be
  enabled or not. By default the value is true i.e. shortcuts will be enabled,
  can be disabled by setting it to false, currently the calendar supports
  shortcuts like

  - Navigating between views: By pressing M(monthly), W(weekly), D(daily), you
    can navigate between the views.
  - Navigating inside a view: By pressing right arrow(→) or left arrow(←) key on
    your keyboard you can navigate inside a view.
  - Delete: When an event is focused you can press the delete button to delete
    the event.

- Many functional props are also there which will be discussed in the below
  sections.

## Custom API Integrations with Prop functions

To integrate the calendar with your API, you need to pass the following
functions as props to the Calendar component:

- create: This function is called when a new event is created from the UI. The
  first argument in the function is the new event created.

- update: This function is called when an existing event is updated. The first
  argument in the function is an object which has the updated event.

- delete: This function is called when an existing event is deleted. The first
  argument in the function is the id of the event to be deleted.

e.g.

    <Calendar
    	:config="config"
    	:events="events"
    	:create="(event) => console.log('createEvent', event)"
    	:update="(event) => console.log('updateEvent', event)"
    	:delete="(eventID) => console.log('deleteEvent', eventID)"
    />

In these functions, you can set up your API calls to create, update, and delete
events.

## Calendar Click Events

1. Single Click any event to get additional data of the event via Popover,
   edit/delete the event from the popover.

2. Double Click any cell to create a new event.

3. Double Click any Event to edit an event. When an event is updated the update
   function is called (mentioned above)

## Custom Calendar Click Events

If you wish to handle clicks on your own, the Calendar provides 3 functions to
handle clicks via props.

<Calendar
		:config="config"
		:events="events"
		:onClick="(event) =>  console.log('onClick', event)"
		:onDblClick="(event) =>  console.log('onDblClick', event)"
		:onCellDblClick="(data) =>  console.log('onCellDblClick', data)"
	/>

`Note: while using custom click events, the create, update & delete prop functions will not be triggered.`

- `onClick`: The function is triggered when an event is clicked. In the callback
  function you receive an argument which is an object and it looks like this:

      {
      	e:MouseEvent,
      	calendarEvent: Object
      }

  - e: this key represent the MouseEvent.
  - calendarEvent: This key is an object, the object of calendarEvent is
    displayed above

- `onDblClick`: The function is triggered when an event is double clicked. In
  the callback function you receive an argument which is an object and it looks
  like this:

      {
      	e:MouseEvent,
      	calendarEvent: Object
      }

  - e: this key represent the MouseEvent.
  - calendarEvent: This key is an object, the object of calendarEvent is
    displayed above

- `onCellDblClick`: The function is triggered when a cell is double clicked. In
  the callback function you receive an argument which is an object and it looks
  like this:

      {
      	e:MouseEvent,
      	date: Date Object,
      	time: String,
      	view: "Day" | "Week" | "Month"
      }

  - e: this key represent the MouseEvent.
  - date: Date Object, which has the date of the cell which was double clicked.
  - time: String, ranges from "00:00" to "23:00", where the cell was clicked in
    the grid that time value will be displayed over here. (Note, this will be
    empty in Month view)
  - view: String, shows the view in which the event was triggered.

## Custom Header

If you wish to create your own header instead of the default header, you can use
a slot called "header". It can be implemented in a way shown in the story with
variant "custom-header".

```
 <template #header="{ currentMonthYear, enabledModes, activeView, decrement, increment, updateActiveView }">
 </template>
```

The header slot return 6 props:

1. `currentMonthYear`: String, returns the current month and the current year.
   e.g. August, 2024
2. `enabledModes`: Array of Objects, returns the enabled modes which can be
   configured using "config" prop.
3. `decrement`: Function, returns a function which allows user to navigate to
   previous month/week/day in the current view.
4. `increment`: Function, returns a function which allows user to navigate to
   next month/week/day in the current view.
5. `activeView`: String, returns the current view of the calendar. This can be
   used as modelValue.
6. `updateActiveView`: Function, this function can be used to update the current
   view of the calendar.
