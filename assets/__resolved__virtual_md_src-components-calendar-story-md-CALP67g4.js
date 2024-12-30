const html = `<h2 id="props" tabindex="-1">Props <a class="header-anchor" href="#props" aria-hidden="true">#</a></h2>
<h3 id="events" tabindex="-1">events <a class="header-anchor" href="#events" aria-hidden="true">#</a></h3>
<p><code>events</code> is an array of objects, where each object consists of a single event.
By default the value of events props is an empty array <code>[]</code></p>
<p>A single event can be of 2 types</p>
<ol>
<li>Timed Event, event which has a start and end time.</li>
</ol>
<p>Event object looks like:</p>
<pre><code>{
	title: 'English by Ryan Mathew',
	participant: 'Ryan Mathew',
	id: 'EDU-CSH-2024-00091',
	venue: 'CNF-ROOM-2024-00001',
	fromDate: '2024-07-08 16:30:00',
	toDate: '2024-07-08 17:30:00',
	color: 'green',
},
</code></pre>
<ul>
<li>
<p><code>id, fromDate, toDate,</code> keys are mandatory for this kind of event.</p>
</li>
<li>
<p><code>id</code> should be unique for each event.</p>
</li>
<li>
<p><code>fromDate</code> and <code>toDate</code> should be in the above format or can be a date object.
Currently Single date event is created and it is taken from fromDate. In
future multiple day events will also be introduced.</p>
</li>
<li>
<p><code>color</code> can be from a list of</p>
</li>
</ul>
<p><code>[&quot;blue&quot;,&quot;green&quot;, &quot;red&quot;, &quot;orange&quot;, &quot;yellow&quot;, &quot;teal&quot;, &quot;violet&quot;, &quot;cyan&quot;, &quot;purple&quot;, &quot;pink&quot;, &quot;amber&quot;].</code></p>
<p>If any other color is provided then the default color will be &quot;green&quot;.</p>
<ol start="2">
<li>Full Day Event</li>
</ol>
<p>The object for this kind of event looks like:</p>
<pre><code>{
	title: 'Zoom Meet with Sheldon',
	participant: 'Sheldon',
	id: '#htrht42',
	venue: 'Google Meet',
	fromDate: '2024-07-21 00:00:00',
	toDate: '2024-07-21 23:59:59',
	color: 'amber',
	isFullDay: true,
},
</code></pre>
<ul>
<li><code>id, isFullDay,fromDate, toDate</code> keys are mandatory for this kind of event.</li>
</ul>
<h3 id="config" tabindex="-1">config <a class="header-anchor" href="#config" aria-hidden="true">#</a></h3>
<p><code>config</code> is an object which consists of the following keys:</p>
<pre><code>{

	disableModes: [],
	defaultMode: 'Month',
	isEditMode: false,
	eventIcons: {},
	redundantCellHeight: 50,
	hourHeight: 50,
	enableShortcuts: true,
  showIcon: true,

}
</code></pre>
<ul>
<li>
<p><code>disableModes</code>: This is an array of strings which consists of the modes which
are to be disabled. The default value is an empty array. If the value is
['Day'] then the Day mode will be disabled and the user will not be able to
switch to the Day mode. Only the Week and Month mode will be available.</p>
</li>
<li>
<p><code>defaultMode</code>: This is the default mode in which the calendar will be loaded.
The default value is 'Month'. It can be one of the following values:</p>
<pre><code>- Day
- Week
- Month
</code></pre>
</li>
<li>
<p><code>isEditMode</code>: This is a boolean value which is used to enable or disable the
edit mode. The default value is false. So by default the calendar is in
read-only mode. If it is set to true then the user can perform actions like
adding, editing, and deleting the events.</p>
</li>
<li>
<p><code>eventIcons</code>: This is an object which consists of the icons which are to be
displayed for the events. The default value is an empty object. This objects
changes the icon of the event on the basis of the type of event. If the type
of event is not present in the object then the default icon will be displayed.
<code>type_of_event</code> property can be set in the event object to display the icon.
The icon of the event will be taken from this object. So if your event has an
event type of &quot;Call&quot; then the icon will be taken from this object. The object
should be in the following format:</p>
<pre><code>{
	'type_of_event1': 'icon_component1',
	'type_of_event2': 'icon_component2',
}
</code></pre>
</li>
</ul>
<p>e.g.</p>
<pre><code>{
	'Call': &lt;CallIcon /&gt;,
	'Meeting': &lt;MeetingIcon /&gt;,
}
</code></pre>
<ul>
<li>
<p><code>redundantCellHeight</code>: The height of the cell to display full day events. This
value is in Pixel, by default the value is <code>50px</code>.</p>
</li>
<li>
<p><code>hourHeight</code>: The height of each cell below the full day events cell. This
value is in pixel, by default the value is <code>50px</code>.</p>
</li>
<li>
<p><code>enableShortcuts</code>: Boolean value which determines whether shortcuts will be
enabled or not. By default the value is true i.e. shortcuts will be enabled,
can be disabled by setting it to false, currently the calendar supports
shortcuts like</p>
<ul>
<li>Navigating between views: By pressing M(monthly), W(weekly), D(daily), you
can navigate between the views.</li>
<li>Navigating inside a view: By pressing right arrow(→) or left arrow(←) key on
your keyboard you can navigate inside a view.</li>
<li>Delete: When an event is focused you can press the delete button to delete
the event.</li>
</ul>
</li>
<li>
<p><code>showIcon</code>: Boolean value which determines whether the icon will be displayed
or not in the Event. By default the value is true i.e. icon will be displayed,
can be disabled by setting it to false.</p>
</li>
<li>
<p>Many functional props are also there which will be discussed in the below
sections.</p>
</li>
</ul>
<h2 id="custom-api-integrations-with-prop-functions" tabindex="-1">Custom API Integrations with Prop functions <a class="header-anchor" href="#custom-api-integrations-with-prop-functions" aria-hidden="true">#</a></h2>
<p>To integrate the calendar with your API, you need to pass the following
functions as props to the Calendar component:</p>
<ul>
<li>
<p>create: This function is called when a new event is created from the UI. The
first argument in the function is the new event created.</p>
</li>
<li>
<p>update: This function is called when an existing event is updated. The first
argument in the function is an object which has the updated event.</p>
</li>
<li>
<p>delete: This function is called when an existing event is deleted. The first
argument in the function is the id of the event to be deleted.</p>
</li>
</ul>
<p>e.g.</p>
<pre><code>&lt;Calendar
	:config=&quot;config&quot;
	:events=&quot;events&quot;
	:create=&quot;(event) =&gt; console.log('createEvent', event)&quot;
	:update=&quot;(event) =&gt; console.log('updateEvent', event)&quot;
	:delete=&quot;(eventID) =&gt; console.log('deleteEvent', eventID)&quot;
/&gt;
</code></pre>
<p>In these functions, you can set up your API calls to create, update, and delete
events.</p>
<h2 id="calendar-click-events" tabindex="-1">Calendar Click Events <a class="header-anchor" href="#calendar-click-events" aria-hidden="true">#</a></h2>
<ol>
<li>
<p>Single Click any event to get additional data of the event via Popover,
edit/delete the event from the popover.</p>
</li>
<li>
<p>Double Click any cell to create a new event.</p>
</li>
<li>
<p>Double Click any Event to edit an event. When an event is updated the update
function is called (mentioned above)</p>
</li>
</ol>
<h2 id="custom-calendar-click-events" tabindex="-1">Custom Calendar Click Events <a class="header-anchor" href="#custom-calendar-click-events" aria-hidden="true">#</a></h2>
<p>If you wish to handle clicks on your own, the Calendar provides 3 functions to
handle clicks via props.</p>
<p><Calendar
		:config="config"
		:events="events"
		:onClick="(event) =>  console.log('onClick', event)"
		:onDblClick="(event) =>  console.log('onDblClick', event)"
		:onCellDblClick="(data) =>  console.log('onCellDblClick', data)"
	/></p>
<p><code>Note: while using custom click events, the create, update &amp; delete prop functions will not be triggered.</code></p>
<ul>
<li>
<p><code>onClick</code>: The function is triggered when an event is clicked. In the callback
function you receive an argument which is an object and it looks like this:</p>
<pre><code>{
	e:MouseEvent,
	calendarEvent: Object
}
</code></pre>
<ul>
<li>e: this key represent the MouseEvent.</li>
<li>calendarEvent: This key is an object, the object of calendarEvent is
displayed above</li>
</ul>
</li>
<li>
<p><code>onDblClick</code>: The function is triggered when an event is double clicked. In
the callback function you receive an argument which is an object and it looks
like this:</p>
<pre><code>{
	e:MouseEvent,
	calendarEvent: Object
}
</code></pre>
<ul>
<li>e: this key represent the MouseEvent.</li>
<li>calendarEvent: This key is an object, the object of calendarEvent is
displayed above</li>
</ul>
</li>
<li>
<p><code>onCellDblClick</code>: The function is triggered when a cell is double clicked. In
the callback function you receive an argument which is an object and it looks
like this:</p>
<pre><code>{
	e:MouseEvent,
	date: Date Object,
	time: String,
	view: &quot;Day&quot; | &quot;Week&quot; | &quot;Month&quot;
}
</code></pre>
<ul>
<li>e: this key represent the MouseEvent.</li>
<li>date: Date Object, which has the date of the cell which was double clicked.</li>
<li>time: String, ranges from &quot;00:00&quot; to &quot;23:00&quot;, where the cell was clicked in
the grid that time value will be displayed over here. (Note, this will be
empty in Month view)</li>
<li>view: String, shows the view in which the event was triggered.</li>
</ul>
</li>
</ul>
<h2 id="custom-header" tabindex="-1">Custom Header <a class="header-anchor" href="#custom-header" aria-hidden="true">#</a></h2>
<p>If you wish to create your own header instead of the default header, you can use
a slot called &quot;header&quot;. It can be implemented in a way shown in the story with
variant &quot;custom-header&quot;.</p>
<pre><code><div class="htw-relative htw-not-prose __histoire-code"><div class="htw-absolute htw-top-0 htw-right-0 htw-text-xs htw-text-white/40"></div><pre class="shiki github-dark" style="background-color: #0d1117"><code><span class="line"><span style="color: #c9d1d9"> &lt;template #header=&quot;{ currentMonthYear, enabledModes, activeView, decrement, increment, updateActiveView }&quot;&gt;</span></span>
<span class="line"><span style="color: #c9d1d9"> &lt;/template&gt;</span></span>
<span class="line"><span style="color: #c9d1d9"></span></span></code></pre></div></code></pre>
<p>The header slot return 6 props:</p>
<ol>
<li><code>currentMonthYear</code>: String, returns the current month and the current year.
e.g. August, 2024</li>
<li><code>enabledModes</code>: Array of Objects, returns the enabled modes which can be
configured using &quot;config&quot; prop.</li>
<li><code>decrement</code>: Function, returns a function which allows user to navigate to
previous month/week/day in the current view.</li>
<li><code>increment</code>: Function, returns a function which allows user to navigate to
next month/week/day in the current view.</li>
<li><code>activeView</code>: String, returns the current view of the calendar. This can be
used as modelValue.</li>
<li><code>updateActiveView</code>: Function, this function can be used to update the current
view of the calendar.</li>
</ol>
`;
const frontmatter = {};
const relativePath = "src/components/Calendar.story.md";
export {
  frontmatter,
  html,
  relativePath
};
