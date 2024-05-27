## Props

### events

`events` is an array of object, where each object consists of a single event. By
default the value of events props is `[]`

A single event can be of 2 types

1.  Event with from_time and to_time

    Event object looks like:

            {
        	    title: 'English by Ryan Mathew',
        	    participant: 'Ryan Mathew',
        		id: 'EDU-CSH-2024-00099',
        		venue: 'CNF-ROOM-00001',
        		date: '2024-05-06',
        		from_time: '16:30:00',
        		to_time: '17:30:00',
        		color: 'green',
            }

- `ID, from_time, to_time keys,date` keys are mandatory for this kind of event.

- `date` is in the format of `YYYY-MM-DD`.
- `color` can be from a list of
  `["blue","green", "red", "orange", "yellow", "teal", "violet", "cyan", "purple", "pink", "amber"].`
  If any other color is provided then the default color will be "green".

2.  Full Day Event

    The object for this kind of event looks like:

        {

        	title: 'Google Meet with John ',
        	date: '2024-05-21',
        	participant: 'John',
        	venue: 'Google Meet',
        	color: 'amber',
        	id: '#htrht4',
        	isFullDay: true,
        }

- `isFullDay,date,id` keys are mandatory for this kind of event.

- Full day event will not have `from_time` and `to_time` keys.

- `color` can be from a list of
  `["blue","green", "red", "orange", "yellow", "teal", "violet", "cyan", "purple", "pink", "amber"].`
  If any other color is provided then the default color will be "green".

### config

`config` is an object which consists of the following keys:

- `disableModes`: This is an array of strings which consists of the modes which
  are to be disabled. The default value is an empty array.

- `defaultMode`: This is the default mode in which the calendar will be loaded.
  The default value is 'Month'. It can be one of the following values:

  - Day
  - Week
  - Month

- `isEditMode`: This is a boolean value which is used to enable or disable the
  edit mode. The default value is false. If it is set to true then the user can
  perform actions like adding, editing, and deleting the events.

- `eventIcons`: This is an object which consists of the icons which are to be
  displayed for the events. The default value is an empty object. This objects
  changes the icon of the event on the basis of the type of event. If the type
  of event is not present in the object then the default icon will be displayed.

The object should be in the following format:

    {

    	'type_of_event1': 'icon_component1',

    	'type_of_event2': 'icon_component2',

    }

e.g.

    {

    	'Call': <CallIcon />,

    	'Meeting': <MeetingIcon />,

    }

## Custom API Integrations with Emit events

To integrate the calendar with your API, you need to pass the following
functions as props to the CalendarView component:

- createEvent: This function is called when a new event is created from the UI.
  The first argument in the function is the new event created.

- updateEvent: This function is called when an existing event is updated. The
  first argument in the function is the updated event.

- deleteEvent: This function is called when an existing event is deleted. The
  first argument in the function is the id of the event to be deleted.

e.g.

    <CalendarView

    	:events=events

    	:config=config

    	@createEvent=(event) => createEvent(event)

    	@updateEvent=(event) => updateEvent(event)

    	@deleteEvent=(eventID) => deleteEvent(eventID)

    />

## Calendar Events

1. Single Click any event to get additional data of the event via Popover,
   edit/delete the event from the popover.
2. Double Click any cell to create a new event.
3. Double Click any Event to edit an event.
