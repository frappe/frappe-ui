import { aB as openBlock, aG as createElementBlock, aF as createBaseVNode, aE as createVNode, aH as createCommentVNode, aN as toDisplayString, az as ref, aI as reactive, br as computed, bF as inject, aC as createBlock, aD as withCtx, aQ as normalizeClass, bG as onMounted, bH as onBeforeUnmount, bt as watch, bI as useFloating, bJ as offset, bK as flip, bL as shift, bM as autoUpdate, aL as mergeProps, bN as toHandlers, bz as withModifiers, a$ as resolveDynamicComponent, aK as Fragment, bn as normalizeStyle, aJ as renderList, aM as createTextVNode, bO as onUnmounted, bP as provide, bk as renderSlot, aR as normalizeProps, aS as guardReactiveProps } from "./vendor-DgQF0n7J.js";
import { B as Button } from "./Button-DVn34zbs.js";
import { T as TabButtons } from "./TabButtons-DDYTPjFY.js";
import { F as FeatherIcon } from "./FeatherIcon-D1791lN0.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { D as Dialog } from "./Dialog-YNpJnq1y.js";
import { F as FormControl } from "./FormControl-BvIiBugk.js";
import { E as ErrorMessage } from "./ErrorMessage-D4b6KNFG.js";
function getCalendarDates(month, year) {
  let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let firstDay = new Date(year, month, 1);
  let leftPadding = firstDay.getDay();
  let datesInPreviousMonth = getBeforeDates(firstDay, leftPadding);
  let datesInCurrentMonth = getCurrentMonthDates(firstDay);
  let datesTillNow = [...datesInPreviousMonth, ...datesInCurrentMonth];
  let datesInNextMonth = getNextMonthDates(datesTillNow);
  let allDates = [...datesTillNow, ...datesInNextMonth];
  return allDates;
  function getCurrentMonthDates(date) {
    let month2 = date.getMonth();
    if (month2 == 1 && isLeapYear(date)) {
      daysInMonth[month2] = 29;
    }
    let numberOfDays = daysInMonth[month2] + 1;
    let allDates2 = getDatesAfter(date, 1, numberOfDays);
    return allDates2;
  }
  function getBeforeDates(firstDay2, leftPadding2) {
    let allDates2 = getDatesAfter(firstDay2, 0, leftPadding2, -1);
    allDates2 = allDates2.reverse();
    return allDates2;
  }
  function getNextMonthDates(currentAndPreviousMonthDates) {
    const numberofDaysInCalendar = currentAndPreviousMonthDates.length > 35 ? 42 : 35;
    let lengthOfDates = currentAndPreviousMonthDates.length;
    let lastDate = currentAndPreviousMonthDates[lengthOfDates - 1];
    let diff = numberofDaysInCalendar - lengthOfDates + 1;
    let allDates2 = getDatesAfter(lastDate, 1, diff, 1, true);
    return allDates2;
  }
  function getDatesAfter(date, startIndex, counter, stepper = 1, getNextMonthDates2 = false) {
    let allDates2 = [];
    for (let index = startIndex; index < counter; index++) {
      let tempDate = new Date(
        date.getFullYear(),
        getNextMonthDates2 ? date.getMonth() + 1 : date.getMonth(),
        index * stepper
      );
      allDates2.push(tempDate);
    }
    return allDates2;
  }
  function isLeapYear(date) {
    let year2 = date.getFullYear();
    return year2 % 400 === 0 || year2 % 100 !== 0 && year2 % 4 === 0;
  }
}
function groupBy(obj, fn) {
  if (typeof fn !== "function") throw new Error(`${fn} should be a function`);
  return Object.keys(obj).reduce((acc, key) => {
    const group = fn(obj[key]);
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(obj[key]);
    return acc;
  }, {});
}
function calculateMinutes(time) {
  let [hours, minutes] = time.split(":");
  return parseInt(hours) * 60 + parseInt(minutes);
}
function convertMinutesToHours(minutes) {
  let hours = Math.floor(minutes / 60);
  let remainingMinutes = minutes % 60;
  if (hours < 10) hours = `0${hours}`;
  if (remainingMinutes < 10) remainingMinutes = `0${remainingMinutes}`;
  return `${hours}:${remainingMinutes}:00`;
}
function parseDate(date) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let yyyy = date.getFullYear();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return `${yyyy}-${mm}-${dd}`;
}
function parseDateEventPopupFormat(date, showDay = true, showMonth = true, weekDay = "short") {
  const options = {
    day: "numeric"
  };
  if (showMonth) {
    options.month = "short";
  }
  if (showDay) {
    options.weekday = weekDay;
  }
  return date.toLocaleDateString("en-US", options);
}
function parseDateWithDay(date, fullDay = false) {
  return fullDay ? daysListFull[date.getDay()] + ", " + date.getDate() : daysList[date.getDay()] + " " + date.getDate();
}
function calculateDiff(from, to) {
  let fromMinutes = calculateMinutes(from);
  let toMinutes = calculateMinutes(to);
  return toMinutes - fromMinutes;
}
function handleSeconds(time) {
  return time.split(":").slice(0, 2).join(":") + ":00";
}
function findOverlappingEventsCount(events) {
  events = events.sort((a, b) => a.startTime - b.startTime);
  const result = [];
  for (const event of events) {
    const availableHall = result.find(
      (hall) => hall[hall.length - 1].endTime <= event.startTime
    );
    if (availableHall) {
      availableHall.push(event);
    } else {
      result.push([event]);
    }
  }
  return result.map(
    (hall, idx) => hall.map((event, eventIdx) => ({
      ...event,
      hallNumber: idx,
      idx: eventIdx
    }))
  ).flat();
}
const monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const daysList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const daysListFull = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const twentyFourHoursFormat = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00"
];
const colorMap = {
  blue: {
    background_color: "bg-blue-100",
    border_color: "border-blue-600"
  },
  green: {
    background_color: "bg-green-100",
    border_color: "border-green-600"
  },
  red: {
    background_color: "bg-red-200",
    border_color: "border-red-600"
  },
  orange: {
    background_color: "bg-orange-100",
    border_color: "border-orange-600"
  },
  yellow: {
    background_color: "bg-yellow-100",
    border_color: "border-yellow-600"
  },
  teal: {
    background_color: "bg-teal-100",
    border_color: "border-teal-600"
  },
  violet: {
    background_color: "bg-violet-100",
    border_color: "border-violet-600"
  },
  cyan: {
    background_color: "bg-cyan-100",
    border_color: "border-cyan-600"
  },
  purple: {
    background_color: "bg-purple-100",
    border_color: "border-purple-600"
  },
  pink: {
    background_color: "bg-pink-100",
    border_color: "border-pink-600"
  },
  amber: {
    background_color: "bg-amber-100",
    border_color: "border-amber-600"
  }
};
const _sfc_main$8 = {
  __name: "EventModalContent",
  props: {
    calendarEvent: { type: Object, required: true },
    date: { type: Date, required: true },
    isEditMode: { type: Boolean }
  },
  emits: ["close", "edit", "delete"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emits = __emit;
    const __returned__ = { props, emits, FeatherIcon, get parseDateEventPopupFormat() {
      return parseDateEventPopupFormat;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$6 = { class: "w-80 rounded bg-surface-white p-4 shadow" };
const _hoisted_2$6 = { class: "flex flex-row-reverse gap-2" };
const _hoisted_3$5 = { class: "flex flex-col gap-5" };
const _hoisted_4$5 = { class: "flex justify-between text-xl font-semibold" };
const _hoisted_5$4 = { class: "flex flex-col gap-4" };
const _hoisted_6$4 = { class: "flex items-center gap-2" };
const _hoisted_7$4 = { class: "text-sm font-normal" };
const _hoisted_8$4 = {
  key: 0,
  class: "flex items-center gap-2"
};
const _hoisted_9$1 = { class: "text-sm font-normal" };
const _hoisted_10$1 = {
  key: 1,
  class: "flex items-center gap-2"
};
const _hoisted_11$1 = { class: "text-sm font-normal" };
const _hoisted_12$1 = {
  key: 2,
  class: "flex items-center gap-2"
};
const _hoisted_13$1 = { class: "text-sm font-normal" };
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$6, [
    createBaseVNode("div", _hoisted_2$6, [
      createBaseVNode("span", {
        class: "cursor-pointer",
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
      }, [
        createVNode($setup["FeatherIcon"], {
          name: "x",
          class: "h-4 w-4"
        })
      ]),
      $props.isEditMode ? (openBlock(), createElementBlock("span", {
        key: 0,
        class: "cursor-pointer",
        onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("edit"))
      }, [
        createVNode($setup["FeatherIcon"], {
          name: "edit-2",
          class: "h-4 w-4"
        })
      ])) : createCommentVNode("v-if", true),
      $props.isEditMode ? (openBlock(), createElementBlock("span", {
        key: 1,
        class: "cursor-pointer",
        onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("delete"))
      }, [
        createVNode($setup["FeatherIcon"], {
          name: "trash-2",
          class: "h-4 w-4"
        })
      ])) : createCommentVNode("v-if", true)
    ]),
    createBaseVNode("div", _hoisted_3$5, [
      createBaseVNode("div", _hoisted_4$5, [
        createBaseVNode(
          "span",
          null,
          toDisplayString($props.calendarEvent.title || "New Event"),
          1
          /* TEXT */
        )
      ]),
      createBaseVNode("div", _hoisted_5$4, [
        createBaseVNode("div", _hoisted_6$4, [
          createVNode($setup["FeatherIcon"], {
            name: "calendar",
            class: "h-4 w-4"
          }),
          createBaseVNode(
            "span",
            _hoisted_7$4,
            toDisplayString($setup.parseDateEventPopupFormat($props.date)),
            1
            /* TEXT */
          )
        ]),
        $props.calendarEvent.participant ? (openBlock(), createElementBlock("div", _hoisted_8$4, [
          createVNode($setup["FeatherIcon"], {
            name: "user",
            class: "h-4 w-4"
          }),
          createBaseVNode(
            "span",
            _hoisted_9$1,
            toDisplayString($props.calendarEvent.participant),
            1
            /* TEXT */
          )
        ])) : createCommentVNode("v-if", true),
        $props.calendarEvent.from_time && $props.calendarEvent.to_time ? (openBlock(), createElementBlock("div", _hoisted_10$1, [
          createVNode($setup["FeatherIcon"], {
            name: "clock",
            class: "h-4 w-4"
          }),
          createBaseVNode(
            "span",
            _hoisted_11$1,
            toDisplayString($props.calendarEvent.from_time) + " - " + toDisplayString($props.calendarEvent.to_time),
            1
            /* TEXT */
          )
        ])) : createCommentVNode("v-if", true),
        $props.calendarEvent.venue ? (openBlock(), createElementBlock("div", _hoisted_12$1, [
          createVNode($setup["FeatherIcon"], {
            name: "map-pin",
            class: "h-4 w-4"
          }),
          createBaseVNode(
            "span",
            _hoisted_13$1,
            toDisplayString($props.calendarEvent.venue),
            1
            /* TEXT */
          )
        ])) : createCommentVNode("v-if", true)
      ])
    ])
  ]);
}
_sfc_main$8.__file = "src/components/Calendar/EventModalContent.vue";
const EventModalContent = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/EventModalContent.vue"]]);
const _sfc_main$7 = {
  __name: "NewEventModal",
  props: {
    event: {
      type: Object
    }
  },
  setup(__props, { expose: __expose }) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    __expose();
    const show = ref(false);
    const props = __props;
    const newEvent = reactive({
      title: ((_a = props.event) == null ? void 0 : _a.title) || "",
      date: ((_b = props.event) == null ? void 0 : _b.date) || "",
      participant: ((_c = props.event) == null ? void 0 : _c.participant) || "",
      from_time: ((_d = props.event) == null ? void 0 : _d.from_time) || "",
      to_time: ((_e = props.event) == null ? void 0 : _e.to_time) || "",
      venue: ((_f = props.event) == null ? void 0 : _f.venue) || "",
      color: ((_g = props.event) == null ? void 0 : _g.color) || "green",
      id: "",
      isFullDay: ((_h = props.event) == null ? void 0 : _h.isFullDay) || false
    });
    const isUpdated = computed(() => {
      return newEvent.title !== props.event.title || newEvent.date !== props.event.date || newEvent.participant !== props.event.participant || newEvent.from_time !== props.event.from_time || newEvent.to_time !== props.event.to_time || newEvent.venue !== props.event.venue || newEvent.color !== props.event.color || newEvent.isFullDay !== props.event.isFullDay;
    });
    const colors = Object.keys(colorMap);
    const errorMessage = ref("");
    function validateFields() {
      if (!newEvent.date) {
        errorMessage.value = "Date is required";
      } else if (!newEvent.from_time && !newEvent.isFullDay) {
        errorMessage.value = "Start Time is required";
      } else if (!newEvent.to_time && !newEvent.isFullDay) {
        errorMessage.value = "End Time is required";
      } else {
        errorMessage.value = "";
      }
      if (newEvent.hasOwnProperty("from_time") && newEvent.hasOwnProperty("to_time")) {
        validateStartEndTime();
      }
    }
    function validateStartEndTime() {
      let timeDiff = calculateDiff(newEvent.from_time, newEvent.to_time);
      if (timeDiff <= 0) {
        errorMessage.value = "Start time must be less than End Time";
      }
    }
    const calendarActions = inject("calendarActions");
    function submitEvent(close) {
      validateFields();
      if (errorMessage.value) {
        return;
      }
      if (!isUpdated.value) {
        close();
        return;
      }
      handleEventTime();
      if (props.event.hasOwnProperty("id")) {
        newEvent.id = props.event.id;
        calendarActions.updateEventState(newEvent);
      } else {
        const id = "#" + Math.random().toString(36).substring(3, 9);
        newEvent.id = id;
        calendarActions.createNewEvent(newEvent);
      }
      close();
    }
    function handleEventTime() {
      if (newEvent.isFullDay) {
        newEvent.from_time = "";
        newEvent.to_time = "";
      } else {
        newEvent.from_time = handleSeconds(newEvent.from_time);
        newEvent.to_time = handleSeconds(newEvent.to_time);
      }
    }
    const __returned__ = { show, props, newEvent, isUpdated, colors, errorMessage, validateFields, validateStartEndTime, calendarActions, submitEvent, handleEventTime, computed, inject, reactive, ref, Dialog, FormControl, ErrorMessage, get Button() {
      return Button;
    }, get calculateDiff() {
      return calculateDiff;
    }, get colorMap() {
      return colorMap;
    }, get handleSeconds() {
      return handleSeconds;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$5 = { class: "grid grid-cols-1 gap-4" };
const _hoisted_2$5 = { class: "flex flex-row-reverse gap-2" };
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Dialog"], {
    modelValue: $setup.show,
    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $setup.show = $event),
    options: {
      title: $setup.props.event.hasOwnProperty("id") ? "Edit Event" : "New Event",
      actions: [
        {
          label: "Submit",
          variant: "solid"
        }
      ]
    },
    class: "z-50"
  }, {
    "body-content": withCtx(() => [
      createBaseVNode("div", null, [
        createBaseVNode("div", _hoisted_1$5, [
          createVNode($setup["FormControl"], {
            type: "Input",
            modelValue: $setup.newEvent.title,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.newEvent.title = $event),
            label: "Title",
            placeholder: "Meet with John Doe"
          }, null, 8, ["modelValue"]),
          createVNode($setup["FormControl"], {
            type: "Date",
            modelValue: $setup.newEvent.date,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.newEvent.date = $event),
            label: "Date",
            required: "true",
            onBlur: _cache[2] || (_cache[2] = ($event) => $setup.validateFields())
          }, null, 8, ["modelValue"]),
          createVNode($setup["FormControl"], {
            type: "Input",
            modelValue: $setup.newEvent.participant,
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.newEvent.participant = $event),
            label: "Person",
            placeholder: "John Doe"
          }, null, 8, ["modelValue"]),
          !$setup.newEvent.isFullDay ? (openBlock(), createBlock($setup["FormControl"], {
            key: 0,
            type: "time",
            modelValue: $setup.newEvent.from_time,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.newEvent.from_time = $event),
            label: "Start Time",
            onBlur: _cache[5] || (_cache[5] = ($event) => $setup.validateFields())
          }, null, 8, ["modelValue"])) : createCommentVNode("v-if", true),
          !$setup.newEvent.isFullDay ? (openBlock(), createBlock($setup["FormControl"], {
            key: 1,
            type: "time",
            modelValue: $setup.newEvent.to_time,
            "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.newEvent.to_time = $event),
            label: "End Time",
            onBlur: _cache[7] || (_cache[7] = ($event) => $setup.validateFields())
          }, null, 8, ["modelValue"])) : createCommentVNode("v-if", true),
          createVNode($setup["FormControl"], {
            type: "Input",
            modelValue: $setup.newEvent.venue,
            "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.newEvent.venue = $event),
            label: "Venue",
            placeholder: "Frappe, Neelkanth Business Park"
          }, null, 8, ["modelValue"]),
          createVNode($setup["FormControl"], {
            type: "select",
            modelValue: $setup.newEvent.color,
            "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.newEvent.color = $event),
            options: $setup.colors,
            label: "Color",
            class: "form-control prefix"
          }, {
            prefix: withCtx(() => {
              var _a, _b;
              return [
                createBaseVNode(
                  "div",
                  {
                    class: normalizeClass(["h-5 w-5 rounded-full shadow-md", [
                      ((_b = $setup.colorMap[(_a = $setup.newEvent) == null ? void 0 : _a.color]) == null ? void 0 : _b.background_color) || "bg-green-100"
                    ]])
                  },
                  null,
                  2
                  /* CLASS */
                )
              ];
            }),
            _: 1
            /* STABLE */
          }, 8, ["modelValue", "options"]),
          createVNode($setup["FormControl"], {
            type: "checkbox",
            label: "Full Day Event?",
            modelValue: $setup.newEvent.isFullDay,
            "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $setup.newEvent.isFullDay = $event)
          }, null, 8, ["modelValue"]),
          $setup.errorMessage ? (openBlock(), createBlock($setup["ErrorMessage"], {
            key: 2,
            message: $setup.errorMessage
          }, null, 8, ["message"])) : createCommentVNode("v-if", true)
        ])
      ])
    ]),
    actions: withCtx(({ close }) => [
      createBaseVNode("div", _hoisted_2$5, [
        createVNode($setup["Button"], {
          class: "w-full",
          variant: "solid",
          onClick: ($event) => $setup.submitEvent(close),
          label: "Submit"
        }, null, 8, ["onClick"])
      ])
    ]),
    _: 1
    /* STABLE */
  }, 8, ["modelValue", "options"]);
}
_sfc_main$7.__file = "src/components/Calendar/NewEventModal.vue";
const NewEventModal = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/NewEventModal.vue"]]);
const heightThreshold = 40;
const minimumHeight = 32.5;
const _sfc_main$6 = {
  __name: "CalendarEvent",
  props: {
    event: {
      type: Object,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const activeView = inject("activeView");
    const config = inject("config");
    const calendarActions = inject("calendarActions");
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
    });
    function handleClickOutside(e) {
      const insidePopover = floating.value && floating.value.contains(e.target);
      if (insidePopover) return;
      const insideTarget = eventRef.value && eventRef.value.contains(e.target);
      if (insideTarget) return;
      close();
    }
    const calendarEvent = ref(props.event);
    const updatedEvent = reactive({
      ...props.event
    });
    watch(
      () => props.event,
      (newVal) => {
        updatedEvent.from_time = newVal.from_time;
        updatedEvent.to_time = newVal.to_time;
        calendarEvent.value = newVal;
      },
      { deep: true }
    );
    const eventIcons = config.eventIcons;
    const minuteHeight = config.hourHeight / 60;
    const height_15_min = minuteHeight * 15;
    const state = reactive({
      xAxis: 0,
      yAxis: 0
    });
    const setEventStyles = computed(() => {
      if (props.event.isFullDay) {
        return {
          transform: `translate(${state.xAxis}px, ${state.yAxis}px)`,
          zIndex: isRepositioning ? 100 : props.event.idx + 1
        };
      }
      let diff = calculateDiff(
        calendarEvent.value.from_time,
        calendarEvent.value.to_time
      );
      let height = diff * minuteHeight;
      if (height < heightThreshold) {
        height = minimumHeight;
      }
      height += "px";
      let top = calculateMinutes(calendarEvent.value.from_time) * minuteHeight;
      if (activeView.value === "Day") {
        top += config.redundantCellHeight;
      }
      let hallNumber = calendarEvent.value.hallNumber;
      let width = isResizing.value || isRepositioning.value ? "100%" : `${80 - hallNumber * 20}%`;
      let left = isResizing.value || isRepositioning.value ? "0" : `${hallNumber * 20}%`;
      let zIndex = isResizing.value || isRepositioning.value ? 100 : (props.event.idx || 1) * hallNumber + 1;
      let border = hallNumber >= 1 ? "1px solid #fff" : "";
      return {
        height,
        top: top + "px",
        zIndex,
        left,
        width,
        transform: `translate(${state.xAxis}px, ${state.yAxis}px)`,
        borderLeft: border,
        borderTop: border
      };
    });
    const eventRef = ref(null);
    const floating = ref(null);
    const { floatingStyles } = useFloating(eventRef, floating, {
      placement: activeView.value === "Day" ? "top" : "right",
      middleware: [offset(10), flip(), shift()],
      whileElementsMounted: autoUpdate
    });
    const opened = ref(false);
    const resize = ref(null);
    const isResizing = ref(false);
    const isRepositioning = ref(false);
    const isEventUpdated = ref(false);
    function newEventEndTime(newHeight) {
      let newEndTime = parseFloat(newHeight) / minuteHeight + calculateMinutes(calendarEvent.value.from_time);
      newEndTime = Math.floor(newEndTime);
      if (newEndTime > 1440) {
        newEndTime = 1440;
      }
      return convertMinutesToHours(newEndTime);
    }
    const preventClick = ref(false);
    function handleResizeMouseDown(e) {
      isResizing.value = true;
      isRepositioning.value = false;
      let oldTime = calendarEvent.value.to_time;
      window.addEventListener("mousemove", resize2);
      window.addEventListener("mouseup", stopResize, { once: true });
      function resize2(e2) {
        preventClick.value = true;
        let diffX = e2.clientY - eventRef.value.getBoundingClientRect().top;
        eventRef.value.style.height = Math.round(diffX / height_15_min) * height_15_min + "px";
        eventRef.value.style.width = "100%";
        updatedEvent.to_time = newEventEndTime(eventRef.value.style.height);
        calendarEvent.value.to_time = newEventEndTime(eventRef.value.style.height);
      }
      function stopResize() {
        isResizing.value = false;
        if (oldTime !== calendarEvent.value.to_time) {
          calendarActions.updateEventState(calendarEvent.value);
        }
        window.removeEventListener("mousemove", resize2);
      }
    }
    function handleRepositionMouseDown(e) {
      e.preventDefault();
      let prevY = e.clientY;
      const rect = eventRef.value.getBoundingClientRect();
      if (isResizing.value) return;
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
      function mousemove(e2) {
        isRepositioning.value = true;
        preventClick.value = true;
        if (!eventRef.value) return;
        close();
        eventRef.value.style.cursor = "grabbing";
        if (activeView.value === "Week") {
          handleHorizontalMovement(e2.clientX, rect);
        }
        if (!props.event.isFullDay) handleVerticalMovement(e2.clientY, prevY, rect);
        if (calendarEvent.value.from_time !== updatedEvent.from_time || calendarEvent.value.to_time !== updatedEvent.to_time) {
          isEventUpdated.value = true;
        } else {
          isEventUpdated.value = false;
        }
      }
      function mouseup(e2) {
        e2.preventDefault();
        isRepositioning.value = false;
        if (!eventRef.value) return;
        eventRef.value.style.cursor = "pointer";
        if (calendarEvent.value.isFullDay && activeView.value === "Week") {
          eventRef.value.style.width = "90%";
        }
        if (calendarEvent.value.date !== updatedEvent.date) {
          isEventUpdated.value = true;
        }
        if (isEventUpdated.value) {
          calendarEvent.value.date = updatedEvent.date;
          calendarEvent.value.from_time = updatedEvent.from_time;
          calendarEvent.value.to_time = updatedEvent.to_time;
          calendarActions.updateEventState(calendarEvent.value);
          isEventUpdated.value = false;
          state.xAxis = 0;
          state.yAxis = 0;
        }
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
      }
    }
    function getDate(date, nextDate = 0) {
      let newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + nextDate
      );
      return newDate;
    }
    function handleHorizontalMovement(clientX, rect) {
      const currentDate = new Date(
        props.event.isFullDay ? eventRef.value.parentNode.parentNode.getAttribute("data-date-attr") : eventRef.value.parentNode.getAttribute("data-date-attr")
      );
      if (props.event.isFullDay) {
        eventRef.value.style.width = "100%";
      }
      let eventWidth = eventRef.value.clientWidth;
      let diff = Math.floor((clientX - rect.left) / eventWidth);
      const leftBoundary = currentDate.getDay();
      const rightBoundary = 6 - currentDate.getDay();
      diff = handleHorizontalBoundary(diff, leftBoundary, rightBoundary);
      let xPos = Math.ceil(diff * eventWidth);
      state.xAxis = xPos;
      updatedEvent.date = parseDate(getDate(currentDate, diff));
    }
    function handleHorizontalBoundary(diff, leftBoundary, rightBoundary) {
      if (diff < -leftBoundary) {
        diff = -leftBoundary;
      } else if (diff > rightBoundary) {
        diff = rightBoundary;
      }
      return diff;
    }
    function handleVerticalMovement(clientY, prevY, rect) {
      let diffY = clientY - prevY;
      let parentTop = eventRef.value.parentNode.getBoundingClientRect().top;
      let parentBottom = eventRef.value.parentNode.getBoundingClientRect().bottom;
      if (clientY < parentTop) {
        diffY = parentTop - rect.top;
      }
      if (clientY > parentBottom) {
        diffY = parentBottom - rect.bottom;
      }
      diffY = Math.round(diffY / height_15_min) * height_15_min;
      state.yAxis = diffY;
      updatedEvent.from_time = convertMinutesToHours(
        calculateMinutes(calendarEvent.value.from_time) + Math.round(diffY / minuteHeight)
      );
      updatedEvent.to_time = convertMinutesToHours(
        calculateMinutes(calendarEvent.value.to_time) + Math.round(diffY / minuteHeight)
      );
      handleTimeConstraints();
    }
    function handleTimeConstraints() {
      if (updatedEvent.from_time < "00:00:00") {
        updatedEvent.from_time = "00:00:00";
      }
      if (updatedEvent.from_time > "24:00:00") {
        updatedEvent.from_time = "24:00:00";
      }
      if (updatedEvent.to_time < "00:00:00") {
        updatedEvent.to_time = "00:00:00";
      }
      if (updatedEvent.to_time > "24:00:00") {
        updatedEvent.to_time = "24:00:00";
      }
    }
    const toggle = () => opened.value = !opened.value;
    const close = () => opened.value = false;
    function handleDeleteShortcut(e) {
      if (e.key === "Delete" || e.key === "Backspace") {
        opened.value = false;
        handleEventDelete();
      }
    }
    watch(
      () => opened.value,
      (newVal) => {
        if (newVal) {
          if (!config.isEditMode) return;
          if (!config.enableShortcuts) return;
          document.addEventListener("keydown", handleDeleteShortcut, { once: true });
        }
      }
    );
    let clickTimer = null;
    function handleEventClick(e) {
      if (preventClick.value) {
        preventClick.value = false;
        return;
      }
      if (e.detail === 1) {
        clickTimer = setTimeout(() => {
          calendarActions.props.onClick ? calendarActions.props.onClick({
            e,
            calendarEvent: calendarEvent.value
          }) : toggle();
        }, 200);
      }
    }
    const showEventModal = ref(false);
    function handleEventEdit(e = null) {
      e && (e.cancelBubble = true);
      clearTimeout(clickTimer);
      if (calendarActions.props.onDblClick) {
        calendarActions.props.onDblClick({
          e,
          calendarEvent: calendarEvent.value
        });
        return;
      }
      if (!config.isEditMode) return;
      close();
      showEventModal.value = true;
    }
    function handleEventDelete() {
      calendarActions.deleteEvent(calendarEvent.value.id);
      close();
    }
    const __returned__ = { props, activeView, config, calendarActions, handleClickOutside, calendarEvent, updatedEvent, eventIcons, minuteHeight, height_15_min, state, heightThreshold, minimumHeight, setEventStyles, eventRef, floating, floatingStyles, opened, resize, isResizing, isRepositioning, isEventUpdated, newEventEndTime, preventClick, handleResizeMouseDown, handleRepositionMouseDown, getDate, handleHorizontalMovement, handleHorizontalBoundary, handleVerticalMovement, handleTimeConstraints, toggle, close, handleDeleteShortcut, get clickTimer() {
      return clickTimer;
    }, set clickTimer(v) {
      clickTimer = v;
    }, handleEventClick, showEventModal, handleEventEdit, handleEventDelete, FeatherIcon, EventModalContent, NewEventModal, get useFloating() {
      return useFloating;
    }, get shift() {
      return shift;
    }, get flip() {
      return flip;
    }, get offset() {
      return offset;
    }, get autoUpdate() {
      return autoUpdate;
    }, ref, inject, computed, onMounted, onBeforeUnmount, watch, reactive, get calculateMinutes() {
      return calculateMinutes;
    }, get convertMinutesToHours() {
      return convertMinutesToHours;
    }, get calculateDiff() {
      return calculateDiff;
    }, get parseDate() {
      return parseDate;
    }, get colorMap() {
      return colorMap;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$4 = { key: 0 };
const _hoisted_2$4 = { class: "flex w-fit flex-col overflow-hidden whitespace-nowrap" };
const _hoisted_3$4 = { class: "text-ellipsis text-sm font-medium text-gray-800" };
const _hoisted_4$4 = {
  key: 0,
  class: "text-ellipsis text-xs font-normal text-gray-800"
};
const _hoisted_5$3 = { key: 0 };
const _hoisted_6$3 = { class: "flex w-fit flex-col overflow-hidden whitespace-nowrap" };
const _hoisted_7$3 = { class: "text-ellipsis text-sm font-medium text-gray-800" };
const _hoisted_8$3 = {
  key: 0,
  class: "text-ellipsis text-xs font-normal text-gray-800"
};
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      createCommentVNode(" Weekly and Daily Event Template  "),
      $setup.activeView !== "Month" ? (openBlock(), createElementBlock(
        "div",
        mergeProps({
          key: 0,
          class: "h-min-[18px] rounded-lg p-2 transition-all duration-75",
          ref: "eventRef"
        }, _ctx.$attrs, {
          class: [
            ((_b = $setup.colorMap[(_a = $setup.props.event) == null ? void 0 : _a.color]) == null ? void 0 : _b.background_color) || "bg-green-100",
            "shadow-lg",
            $setup.opened && "!z-20 drop-shadow-xl"
          ],
          style: $setup.setEventStyles,
          onDblclick: _cache[0] || (_cache[0] = withModifiers(($event) => $setup.handleEventEdit($event), ["prevent"])),
          onClick: _cache[1] || (_cache[1] = withModifiers(($event) => $setup.handleEventClick($event), ["prevent"]))
        }, toHandlers({
          mousedown: $setup.config.isEditMode && $setup.handleRepositionMouseDown
        }, true)),
        [
          createBaseVNode(
            "div",
            {
              class: normalizeClass([
                "relative flex h-full select-none items-start gap-2 overflow-hidden px-2",
                $setup.props.event.from_time && [
                  "border-l-2",
                  ((_d = $setup.colorMap[(_c = $setup.props.event) == null ? void 0 : _c.color]) == null ? void 0 : _d.border_color) || "border-green-600"
                ]
              ])
            },
            [
              $setup.config.showIcon ? (openBlock(), createElementBlock("div", _hoisted_1$4, [
                $setup.eventIcons[$setup.props.event.type] ? (openBlock(), createBlock(resolveDynamicComponent($setup.eventIcons[$setup.props.event.type]), {
                  key: 0,
                  class: "h-4 w-4 text-black"
                })) : (openBlock(), createBlock($setup["FeatherIcon"], {
                  key: 1,
                  name: "circle",
                  class: "h-4 text-black"
                }))
              ])) : createCommentVNode("v-if", true),
              createBaseVNode("div", _hoisted_2$4, [
                createBaseVNode(
                  "p",
                  _hoisted_3$4,
                  toDisplayString($setup.props.event.title || "New Event"),
                  1
                  /* TEXT */
                ),
                !$setup.props.event.isFullDay ? (openBlock(), createElementBlock(
                  "p",
                  _hoisted_4$4,
                  toDisplayString($setup.updatedEvent.from_time) + " - " + toDisplayString($setup.updatedEvent.to_time),
                  1
                  /* TEXT */
                )) : createCommentVNode("v-if", true)
              ])
            ],
            2
            /* CLASS */
          ),
          $setup.config.isEditMode && !$props.event.isFullDay ? (openBlock(), createElementBlock(
            "div",
            {
              key: 0,
              class: "absolute h-[8px] w-[100%] cursor-row-resize",
              ref: "resize",
              onMousedown: $setup.handleResizeMouseDown
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          )) : createCommentVNode("v-if", true)
        ],
        16
        /* FULL_PROPS */
      )) : (openBlock(), createElementBlock(
        Fragment,
        { key: 1 },
        [
          createCommentVNode(" Monthly Event Template "),
          createBaseVNode(
            "div",
            mergeProps({
              class: "h-min-[18px] rounded-lg p-2 transition-all duration-75",
              ref: "eventRef"
            }, _ctx.$attrs, {
              class: [((_f = $setup.colorMap[(_e = $setup.props.event) == null ? void 0 : _e.color]) == null ? void 0 : _f.background_color) || "bg-green-100"],
              onDblclick: _cache[2] || (_cache[2] = withModifiers(($event) => $setup.handleEventEdit($event), ["prevent"])),
              onClick: _cache[3] || (_cache[3] = ($event) => $setup.handleEventClick($event))
            }),
            [
              createBaseVNode(
                "div",
                {
                  class: normalizeClass([
                    "relative flex h-full select-none items-start gap-2 overflow-hidden px-2",
                    $setup.props.event.from_time && [
                      "border-l-2",
                      ((_h = $setup.colorMap[(_g = $setup.props.event) == null ? void 0 : _g.color]) == null ? void 0 : _h.border_color) || "border-green-600"
                    ]
                  ])
                },
                [
                  $setup.config.showIcon ? (openBlock(), createElementBlock("div", _hoisted_5$3, [
                    $setup.eventIcons[$setup.props.event.type] ? (openBlock(), createBlock(resolveDynamicComponent($setup.eventIcons[$setup.props.event.type]), {
                      key: 0,
                      class: "h-4 w-4 text-black"
                    })) : (openBlock(), createBlock($setup["FeatherIcon"], {
                      key: 1,
                      name: "circle",
                      class: "h-4 text-black"
                    }))
                  ])) : createCommentVNode("v-if", true),
                  createBaseVNode("div", _hoisted_6$3, [
                    createBaseVNode(
                      "p",
                      _hoisted_7$3,
                      toDisplayString($setup.props.event.title || "New Event"),
                      1
                      /* TEXT */
                    ),
                    $setup.props.event.from_time ? (openBlock(), createElementBlock(
                      "p",
                      _hoisted_8$3,
                      toDisplayString($setup.updatedEvent.from_time) + " - " + toDisplayString($setup.updatedEvent.to_time),
                      1
                      /* TEXT */
                    )) : createCommentVNode("v-if", true)
                  ])
                ],
                2
                /* CLASS */
              )
            ],
            16
            /* FULL_PROPS */
          )
        ],
        2112
        /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
      )),
      $setup.opened ? (openBlock(), createElementBlock(
        "div",
        {
          key: 2,
          ref: "floating",
          style: normalizeStyle({ ...$setup.floatingStyles, zIndex: 100 }),
          class: "rounded shadow-xl"
        },
        [
          createVNode($setup["EventModalContent"], {
            calendarEvent: $setup.calendarEvent,
            date: $props.date,
            isEditMode: $setup.config.isEditMode,
            onClose: $setup.close,
            onEdit: $setup.handleEventEdit,
            onDelete: $setup.handleEventDelete,
            class: "shadow-xl"
          }, null, 8, ["calendarEvent", "date", "isEditMode"])
        ],
        4
        /* STYLE */
      )) : createCommentVNode("v-if", true),
      createVNode($setup["NewEventModal"], {
        modelValue: $setup.showEventModal,
        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.showEventModal = $event),
        event: $setup.updatedEvent
      }, null, 8, ["modelValue", "event"])
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
_sfc_main$6.__file = "src/components/Calendar/CalendarEvent.vue";
const CalendarEvent = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/CalendarEvent.vue"]]);
function useCalendarData(events, view = "") {
  const timedEvents = computed(() => {
    let groupByDate = groupBy(events, (row) => row.date);
    let sortedArray = {};
    if (view === "Month") {
      for (const [key, value] of Object.entries(groupByDate)) {
        sortedArray[key] = sortMonthlyEvents(value);
      }
    } else {
      for (let [key, value] of Object.entries(groupByDate)) {
        value = value.filter((event) => !event.isFullDay);
        value.forEach((task) => {
          task.startTime = calculateMinutes(task.from_time);
          task.endTime = calculateMinutes(task.to_time);
        });
        let sortedEvents = value.sort((a, b) => a.startTime - b.startTime);
        sortedArray[key] = findOverlappingEventsCount(sortedEvents);
      }
    }
    return sortedArray;
  });
  const fullDayEvents = computed(() => {
    let fullDay = events.filter((event) => event.isFullDay);
    let dateGroup = groupBy(fullDay, (row) => row.date);
    return dateGroup;
  });
  return { timedEvents, fullDayEvents };
}
function sortMonthlyEvents(events) {
  let fullDayEvents = events.filter((event) => event.isFullDay);
  let timedEvents = events.filter((event) => !event.isFullDay).sort(
    (a, b) => a.from_time !== b.from_time ? calculateMinutes(a.from_time) > calculateMinutes(b.from_time) ? 1 : -1 : calculateMinutes(a.to_time) > calculateMinutes(b.to_time) ? 1 : -1
  );
  return [...fullDayEvents, ...timedEvents];
}
const _sfc_main$5 = {
  __name: "ShowMoreCalendarEvent",
  props: {
    event: {
      type: Object,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    totalEventsCount: {
      type: Number,
      required: true
    }
  },
  emits: ["showMoreEvents"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const __returned__ = { props, emit, CalendarEvent };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      (openBlock(), createBlock($setup["CalendarEvent"], mergeProps({
        event: $props.event,
        date: $props.date,
        key: $props.event.id,
        class: "mb-1 cursor-pointer"
      }, _ctx.$attrs), null, 16, ["event", "date"])),
      $props.totalEventsCount > 1 ? (openBlock(), createElementBlock(
        "span",
        {
          key: 0,
          class: "w-fit self-center rounded-sm p-[1px] text-sm font-bold text-gray-600 hover:cursor-pointer hover:bg-gray-200",
          onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("showMoreEvents"))
        },
        " +" + toDisplayString($props.totalEventsCount - 1) + " more ",
        1
        /* TEXT */
      )) : createCommentVNode("v-if", true)
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
_sfc_main$5.__file = "src/components/Calendar/ShowMoreCalendarEvent.vue";
const ShowMoreCalendarEvent = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/ShowMoreCalendarEvent.vue"]]);
const _sfc_main$4 = {
  __name: "CalendarMonthly",
  props: {
    events: {
      type: Object,
      required: true
    },
    currentMonthDates: {
      type: Array,
      required: true
    },
    currentMonth: {
      type: Number,
      required: true
    },
    config: {
      type: Object
    }
  },
  emits: ["setCurrentDate"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const timedEvents = computed(
      () => useCalendarData(props.events, "Month").timedEvents.value
    );
    const maxEventsInCell = computed(
      () => props.currentMonthDates.length > 35 ? 1 : 2
    );
    function currentMonthDate(date) {
      return date.getMonth() === props.currentMonth;
    }
    const calendarActions = inject("calendarActions");
    const onDragStart = (event, calendarEventID) => {
      if (!calendarEventID) return;
      event.target.style.opacity = "0.5";
      event.target.style.cursor = "move";
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("calendarEventID", calendarEventID);
    };
    const onDrop = (event, date) => {
      let calendarEventID = event.dataTransfer.getData("calendarEventID");
      if (!calendarEventID) return;
      event.target.style.cursor = "default";
      let e = props.events.find((e2) => e2.id === calendarEventID);
      if (parseDate(date) === e.date) return;
      let calendarEvent = props.events.find((e2) => e2.id === calendarEventID);
      calendarEvent.date = parseDate(date);
      calendarActions.updateEventState(calendarEvent);
    };
    const __returned__ = { props, emit, timedEvents, maxEventsInCell, currentMonthDate, calendarActions, onDragStart, onDrop, get parseDateEventPopupFormat() {
      return parseDateEventPopupFormat;
    }, get daysList() {
      return daysList;
    }, get parseDate() {
      return parseDate;
    }, inject, CalendarEvent, get useCalendarData() {
      return useCalendarData;
    }, computed, ShowMoreCalendarEvent };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$3 = { class: "flex flex-1 flex-col overflow-scroll" };
const _hoisted_2$3 = { class: "grid w-full grid-cols-7 pb-2" };
const _hoisted_3$3 = { class: "text-center text-sm font-normal text-gray-600" };
const _hoisted_4$3 = ["onDrop", "onDblclick"];
const _hoisted_5$2 = { class: "flex w-full flex-col items-center" };
const _hoisted_6$2 = {
  key: 1,
  class: "z-10 w-full bg-surface-white py-1 text-center text-ink-gray-5"
};
const _hoisted_7$2 = {
  key: 2,
  class: "w-full"
};
const _hoisted_8$2 = {
  key: 3,
  class: "flex w-full flex-col justify-between"
};
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$3, [
    createCommentVNode(" Day List "),
    createBaseVNode("div", _hoisted_2$3, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($setup.daysList, (day) => {
          return openBlock(), createElementBlock(
            "span",
            _hoisted_3$3,
            toDisplayString(day),
            1
            /* TEXT */
          );
        }),
        256
        /* UNKEYED_FRAGMENT */
      ))
    ]),
    createCommentVNode(" Date Grid "),
    createBaseVNode(
      "div",
      {
        class: normalizeClass(["grid w-full flex-1 grid-cols-7 border-2 rounded-md", $props.currentMonthDates.length > 35 ? "grid-rows-6" : "grid-rows-5"])
      },
      [
        (openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList($props.currentMonthDates, (date) => {
            var _a;
            return openBlock(), createElementBlock("div", {
              class: "overflow-y-auto border",
              onDragover: _cache[4] || (_cache[4] = withModifiers(() => {
              }, ["prevent"])),
              onDrageneter: _cache[5] || (_cache[5] = withModifiers(() => {
              }, ["prevent"])),
              onDrop: ($event) => $setup.onDrop($event, date),
              onDblclick: ($event) => $setup.calendarActions.handleCellDblClick($event, date)
            }, [
              createBaseVNode(
                "div",
                {
                  class: normalizeClass(["mx-2 flex justify-center font-normal", $setup.currentMonthDate(date) ? "text-gray-700" : "text-gray-200"])
                },
                [
                  createBaseVNode("div", _hoisted_5$2, [
                    $setup.currentMonthDate(date) ? (openBlock(), createElementBlock(
                      "span",
                      {
                        key: 0,
                        class: normalizeClass([
                          "z-10 w-full bg-surface-white py-1 text-center text-ink-gray-9",
                          date.toDateString() === (/* @__PURE__ */ new Date()).toDateString() && "font-bold"
                        ])
                      },
                      toDisplayString(date.getDate()),
                      3
                      /* TEXT, CLASS */
                    )) : (openBlock(), createElementBlock(
                      "span",
                      _hoisted_6$2,
                      toDisplayString($setup.parseDateEventPopupFormat(date, _ctx.showDay = false)),
                      1
                      /* TEXT */
                    )),
                    ((_a = $setup.timedEvents[$setup.parseDate(date)]) == null ? void 0 : _a.length) <= $setup.maxEventsInCell ? (openBlock(), createElementBlock("div", _hoisted_7$2, [
                      (openBlock(true), createElementBlock(
                        Fragment,
                        null,
                        renderList($setup.timedEvents[$setup.parseDate(date)], (calendarEvent) => {
                          return openBlock(), createBlock($setup["CalendarEvent"], {
                            event: calendarEvent,
                            date,
                            class: "z-10 mb-2 w-full cursor-pointer",
                            key: calendarEvent.id,
                            draggable: $props.config.isEditMode,
                            onDragstart: ($event) => $setup.onDragStart($event, calendarEvent.id),
                            onDragend: _cache[0] || (_cache[0] = ($event) => $event.target.style.opacity = "1"),
                            onDragover: _cache[1] || (_cache[1] = withModifiers(() => {
                            }, ["prevent"]))
                          }, null, 8, ["event", "date", "draggable", "onDragstart"]);
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])) : (openBlock(), createElementBlock("div", _hoisted_8$2, [
                      $setup.timedEvents[$setup.parseDate(date)] ? (openBlock(), createBlock($setup["ShowMoreCalendarEvent"], {
                        key: 0,
                        class: "z-10 mb-2 cursor-pointer",
                        draggable: $props.config.isEditMode,
                        onDragstart: ($event) => $setup.onDragStart($event, $setup.timedEvents[$setup.parseDate(date)][0].id),
                        onDragend: _cache[2] || (_cache[2] = ($event) => $event.target.style.opacity = "1"),
                        onDragover: _cache[3] || (_cache[3] = withModifiers(() => {
                        }, ["prevent"])),
                        event: $setup.timedEvents[$setup.parseDate(date)][0],
                        date,
                        totalEventsCount: $setup.timedEvents[$setup.parseDate(date)].length,
                        onShowMoreEvents: ($event) => $setup.emit("setCurrentDate", date)
                      }, null, 8, ["draggable", "onDragstart", "event", "date", "totalEventsCount", "onShowMoreEvents"])) : createCommentVNode("v-if", true)
                    ]))
                  ])
                ],
                2
                /* CLASS */
              )
            ], 40, _hoisted_4$3);
          }),
          256
          /* UNKEYED_FRAGMENT */
        ))
      ],
      2
      /* CLASS */
    )
  ]);
}
_sfc_main$4.__file = "src/components/Calendar/CalendarMonthly.vue";
const CalendarMonthly = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/CalendarMonthly.vue"]]);
const _sfc_main$3 = {
  __name: "CalendarTimeMarker",
  props: {
    date: {
      type: String,
      required: true
    },
    redundantCellHeight: {
      type: Number,
      default: 0
    }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const config = inject("config");
    const hourHeight = config.hourHeight;
    const minuteHeight = hourHeight / 60;
    const setCurrentTime = computed(() => {
      let d = /* @__PURE__ */ new Date();
      let hour = d.getHours();
      let minutes = d.getMinutes();
      let top = (hour * 60 + minutes) * minuteHeight + props.redundantCellHeight + "px";
      return { top };
    });
    const __returned__ = { props, config, hourHeight, minuteHeight, setCurrentTime, computed, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return new Date($props.date).toDateString() === (/* @__PURE__ */ new Date()).toDateString() ? (openBlock(), createElementBlock(
    "div",
    {
      key: 0,
      class: "absolute top-20 z-50 w-full pl-2",
      style: normalizeStyle($setup.setCurrentTime)
    },
    _cache[0] || (_cache[0] = [
      createBaseVNode(
        "div",
        { class: "current-time relative h-0.5 bg-red-600" },
        null,
        -1
        /* HOISTED */
      )
    ]),
    4
    /* STYLE */
  )) : createCommentVNode("v-if", true);
}
_sfc_main$3.__file = "src/components/Calendar/CalendarTimeMarker.vue";
const CalendarTimeMarker = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-d36ad733"], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/CalendarTimeMarker.vue"]]);
const _sfc_main$2 = {
  __name: "CalendarWeekly",
  props: {
    events: {
      type: Object,
      required: true
    },
    config: {
      type: Object
    },
    weeklyDates: {
      type: Array,
      required: false
    }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const gridRef = ref(null);
    const allDayCells = ref(null);
    const showCollapsable = ref(false);
    const isCollapsed = ref(false);
    const hourHeight = props.config.hourHeight;
    const minuteHeight = hourHeight / 60;
    const timedEvents = computed(
      () => useCalendarData(props.events).timedEvents.value
    );
    const fullDayEvents = computed(
      () => useCalendarData(props.events).fullDayEvents.value
    );
    const isToday = (date) => new Date(date).toDateString() === (/* @__PURE__ */ new Date()).toDateString();
    const calendarActions = inject("calendarActions");
    const redundantCellHeight = props.config.redundantCellHeight;
    const getCellHeight = (length) => redundantCellHeight + 36 * (length - 1);
    function getFullDayEventsInCurrentWeek(eventsObject, weeklyDates) {
      let currentWeekEvents = {};
      let weeklyFullDayEvents = Object.keys(eventsObject);
      weeklyDates.forEach((date) => {
        date = parseDate(date);
        if (weeklyFullDayEvents.includes(date)) {
          currentWeekEvents[date] = eventsObject[date];
        }
      });
      return currentWeekEvents;
    }
    function getFullDayEventsCount(eventsObject) {
      let lengthArray = [];
      Object.values(eventsObject).forEach((events) => {
        lengthArray.push(events.length);
      });
      let maxEventsInWeek = Math.max(...lengthArray, 1);
      return maxEventsInWeek;
    }
    function setFullDayEventsHeight(eventsObject, weeklyDates) {
      let currentWeekEvents = getFullDayEventsInCurrentWeek(
        eventsObject,
        weeklyDates
      );
      let maxEvents = getFullDayEventsCount(currentWeekEvents);
      if (maxEvents > 3) {
        showCollapsable.value = true;
      } else {
        showCollapsable.value = false;
      }
      let height = getCellHeight(maxEvents);
      if (isCollapsed.value) return;
      allDayCells.value.forEach((cell) => {
        cell.style.height = height + "px";
      });
    }
    onMounted(() => {
      setFullDayEventsHeight(fullDayEvents.value, props.weeklyDates);
      const currentHour = (/* @__PURE__ */ new Date()).getHours();
      gridRef.value.scrollBy(0, currentHour * 60 * minuteHeight);
    });
    watch(isCollapsed, (newVal) => {
      if (newVal) {
        allDayCells.value.forEach((cell) => {
          cell.style.height = "56px";
        });
      } else {
        setFullDayEventsHeight(fullDayEvents.value, props.weeklyDates);
      }
    });
    watch(
      () => fullDayEvents.value,
      (newFullDayEvents) => {
        setFullDayEventsHeight(newFullDayEvents, props.weeklyDates);
      }
    );
    watch(
      () => props.weeklyDates,
      (newWeeklyDates) => {
        setFullDayEventsHeight(fullDayEvents.value, newWeeklyDates);
      }
    );
    const __returned__ = { props, gridRef, allDayCells, showCollapsable, isCollapsed, hourHeight, minuteHeight, timedEvents, fullDayEvents, isToday, calendarActions, redundantCellHeight, getCellHeight, getFullDayEventsInCurrentWeek, getFullDayEventsCount, setFullDayEventsHeight, ref, onMounted, watch, computed, inject, CalendarEvent, CalendarTimeMarker, get twentyFourHoursFormat() {
      return twentyFourHoursFormat;
    }, get parseDateWithDay() {
      return parseDateWithDay;
    }, get parseDate() {
      return parseDate;
    }, get Button() {
      return Button;
    }, ShowMoreCalendarEvent, get useCalendarData() {
      return useCalendarData;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$2 = { class: "flex flex-col overflow-y-auto" };
const _hoisted_2$2 = { class: "flex border-b-[1px]" };
const _hoisted_3$2 = { class: "mb-2 grid w-full grid-cols-7" };
const _hoisted_4$2 = {
  key: 0,
  class: "absolute left-[45%] top-0 h-[2px] w-5 bg-gray-800"
};
const _hoisted_5$1 = {
  class: "relative flex h-full flex-col overflow-auto",
  ref: "gridRef"
};
const _hoisted_6$1 = { class: "flex border-b-[1px] border-l-[1px]" };
const _hoisted_7$1 = { class: "grid w-16 grid-cols-1" };
const _hoisted_8$1 = { class: "flex w-full flex-col" };
const _hoisted_9 = { class: "grid w-full grid-cols-7" };
const _hoisted_10 = ["data-date-attr"];
const _hoisted_11 = {
  key: 1,
  class: "w-full"
};
const _hoisted_12 = {
  key: 2,
  class: "flex flex-col justify-between"
};
const _hoisted_13 = { class: "grid w-full grid-cols-7" };
const _hoisted_14 = ["data-date-attr"];
const _hoisted_15 = ["data-time-attr", "onDblclick"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$2, [
    createCommentVNode(" Day List "),
    createBaseVNode("div", _hoisted_2$2, [
      _cache[2] || (_cache[2] = createBaseVNode(
        "div",
        { class: "w-16" },
        null,
        -1
        /* HOISTED */
      )),
      createBaseVNode("div", _hoisted_3$2, [
        (openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList($props.weeklyDates, (date) => {
            return openBlock(), createElementBlock(
              "span",
              {
                class: normalizeClass(["relative p-2 text-center text-sm text-gray-600", $setup.isToday(date) ? "font-bold text-gray-800" : "font-normal"])
              },
              [
                $setup.isToday(date) ? (openBlock(), createElementBlock("div", _hoisted_4$2)) : createCommentVNode("v-if", true),
                createTextVNode(
                  " " + toDisplayString($setup.parseDateWithDay(date)),
                  1
                  /* TEXT */
                )
              ],
              2
              /* CLASS */
            );
          }),
          256
          /* UNKEYED_FRAGMENT */
        ))
      ])
    ]),
    createBaseVNode(
      "div",
      _hoisted_5$1,
      [
        createBaseVNode("div", _hoisted_6$1, [
          createCommentVNode(" Time List form 0 - 24 "),
          createBaseVNode("div", _hoisted_7$1, [
            (openBlock(), createElementBlock(
              Fragment,
              null,
              renderList(24, (time) => {
                return createBaseVNode(
                  "span",
                  {
                    class: "flex items-end justify-center text-center text-sm font-normal text-gray-600",
                    style: normalizeStyle({ height: `${$setup.hourHeight}px` })
                  },
                  null,
                  4
                  /* STYLE */
                );
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ]),
          createCommentVNode(" Grid "),
          createBaseVNode("div", _hoisted_8$1, [
            createCommentVNode(" full day events "),
            createBaseVNode("div", _hoisted_9, [
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList($props.weeklyDates, (date, idx) => {
                  var _a;
                  return openBlock(), createElementBlock("div", null, [
                    createBaseVNode("div", {
                      class: normalizeClass(["flex w-full flex-col gap-1 border-b-[1px] border-r-[1px] border-gray-200 transition-all", [idx === 0 && "relative border-l-[1px]"]]),
                      ref_for: true,
                      ref: "allDayCells",
                      "data-date-attr": date
                    }, [
                      $setup.showCollapsable ? (openBlock(), createBlock($setup["Button"], {
                        key: 0,
                        onClick: _cache[0] || (_cache[0] = ($event) => $setup.isCollapsed = !$setup.isCollapsed),
                        class: "absolute -left-[42px] bottom-[4px] cursor-pointer font-bold",
                        icon: $setup.isCollapsed ? "chevron-down" : "chevron-up",
                        variant: "ghost",
                        size: "lg"
                      }, null, 8, ["icon"])) : createCommentVNode("v-if", true),
                      !$setup.isCollapsed ? (openBlock(), createElementBlock("div", _hoisted_11, [
                        (openBlock(true), createElementBlock(
                          Fragment,
                          null,
                          renderList($setup.fullDayEvents[$setup.parseDate(date)], (calendarEvent, idx2) => {
                            return openBlock(), createBlock($setup["CalendarEvent"], {
                              class: "!z-1 mb-1 w-[90%] cursor-pointer",
                              event: { ...calendarEvent, idx: idx2 },
                              key: calendarEvent.id,
                              date
                            }, null, 8, ["event", "date"]);
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])) : (openBlock(), createElementBlock("div", _hoisted_12, [
                        ((_a = $setup.fullDayEvents[$setup.parseDate(date)]) == null ? void 0 : _a.length) > 0 ? (openBlock(), createBlock($setup["ShowMoreCalendarEvent"], {
                          key: 0,
                          event: $setup.fullDayEvents[$setup.parseDate(date)][0],
                          class: "w-[90%]",
                          date,
                          totalEventsCount: $setup.fullDayEvents[$setup.parseDate(date)].length,
                          onShowMoreEvents: _cache[1] || (_cache[1] = ($event) => $setup.isCollapsed = !$setup.isCollapsed)
                        }, null, 8, ["event", "date", "totalEventsCount"])) : createCommentVNode("v-if", true)
                      ]))
                    ], 10, _hoisted_10)
                  ]);
                }),
                256
                /* UNKEYED_FRAGMENT */
              ))
            ]),
            createCommentVNode(" time events => not full day events => overflow-scroll here "),
            createBaseVNode("div", _hoisted_13, [
              createCommentVNode(" 7 Columns "),
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList($props.weeklyDates, (date, idx) => {
                  return openBlock(), createElementBlock("div", {
                    class: normalizeClass(["relative w-full border-r-[1px]", idx === 0 && "calendar-column"]),
                    "data-date-attr": date
                  }, [
                    createCommentVNode(" Time Grid "),
                    (openBlock(true), createElementBlock(
                      Fragment,
                      null,
                      renderList($setup.twentyFourHoursFormat, (time) => {
                        return openBlock(), createElementBlock("div", {
                          class: "cell relative flex cursor-pointer",
                          "data-time-attr": time,
                          onDblclick: withModifiers(($event) => $setup.calendarActions.handleCellDblClick($event, date, time), ["prevent"])
                        }, [
                          createBaseVNode(
                            "div",
                            {
                              class: "border-gray-20 w-full border-b-[1px]",
                              style: normalizeStyle({ height: `${$setup.hourHeight}px` })
                            },
                            null,
                            4
                            /* STYLE */
                          )
                        ], 40, _hoisted_15);
                      }),
                      256
                      /* UNKEYED_FRAGMENT */
                    )),
                    createCommentVNode(" Calendar Events populations  "),
                    (openBlock(true), createElementBlock(
                      Fragment,
                      null,
                      renderList($setup.timedEvents[$setup.parseDate(date)], (calendarEvent, idx2) => {
                        return openBlock(), createBlock($setup["CalendarEvent"], {
                          class: "absolute mb-2 w-[90%] cursor-pointer",
                          event: calendarEvent,
                          key: calendarEvent.id,
                          date
                        }, null, 8, ["event", "date"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    )),
                    createCommentVNode(" Current time Marker  "),
                    createVNode($setup["CalendarTimeMarker"], { date }, null, 8, ["date"])
                  ], 10, _hoisted_14);
                }),
                256
                /* UNKEYED_FRAGMENT */
              ))
            ])
          ])
        ])
      ],
      512
      /* NEED_PATCH */
    )
  ]);
}
_sfc_main$2.__file = "src/components/Calendar/CalendarWeekly.vue";
const CalendarWeekly = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/CalendarWeekly.vue"]]);
const _sfc_main$1 = {
  __name: "CalendarDaily",
  props: {
    events: {
      type: Object,
      required: false
    },
    config: {
      type: Object
    },
    currentDate: {
      type: Object,
      required: true
    }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const timedEvents = computed(
      () => useCalendarData(props.events).timedEvents.value
    );
    const fullDayEvents = computed(
      () => useCalendarData(props.events).fullDayEvents.value
    );
    const gridRef = ref(null);
    const hourHeight = props.config.hourHeight;
    const minuteHeight = hourHeight / 60;
    onMounted(() => {
      const currentHour = (/* @__PURE__ */ new Date()).getHours();
      gridRef.value.scrollBy(0, currentHour * 60 * minuteHeight);
    });
    const calendarActions = inject("calendarActions");
    const __returned__ = { props, timedEvents, fullDayEvents, gridRef, hourHeight, minuteHeight, calendarActions, computed, inject, onMounted, ref, CalendarEvent, CalendarTimeMarker, get parseDate() {
      return parseDate;
    }, get parseDateWithDay() {
      return parseDateWithDay;
    }, get twentyFourHoursFormat() {
      return twentyFourHoursFormat;
    }, get useCalendarData() {
      return useCalendarData;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$1 = { class: "h-[90%] min-h-[500px] min-w-[600px]" };
const _hoisted_2$1 = { class: "pb-2 text-base font-bold text-gray-800" };
const _hoisted_3$1 = { class: "h-full overflow-hidden" };
const _hoisted_4$1 = {
  class: "flex h-full w-full overflow-scroll border-b-[1px] border-l-[1px] border-t-[1px]",
  ref: "gridRef"
};
const _hoisted_5 = { class: "grid h-full w-16 grid-cols-1" };
const _hoisted_6 = { class: "grid h-full w-full grid-cols-1 pb-2" };
const _hoisted_7 = { class: "calendar-column relative border-r-[1px]" };
const _hoisted_8 = ["data-time-attr", "onDblclick"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    createBaseVNode(
      "p",
      _hoisted_2$1,
      toDisplayString($setup.parseDateWithDay($props.currentDate, _ctx.fullDay = true)),
      1
      /* TEXT */
    ),
    createBaseVNode("div", _hoisted_3$1, [
      createBaseVNode(
        "div",
        _hoisted_4$1,
        [
          createCommentVNode(" Left column "),
          createBaseVNode("div", _hoisted_5, [
            (openBlock(), createElementBlock(
              Fragment,
              null,
              renderList(24, (time) => {
                return createBaseVNode(
                  "span",
                  {
                    class: "flex h-[72px] items-end justify-center text-center text-sm font-normal text-gray-600",
                    style: normalizeStyle({ height: `${$setup.hourHeight}px` })
                  },
                  null,
                  4
                  /* STYLE */
                );
              }),
              64
              /* STABLE_FRAGMENT */
            ))
          ]),
          createCommentVNode(" Calendar Grid / Right Column "),
          createBaseVNode("div", _hoisted_6, [
            createBaseVNode("div", _hoisted_7, [
              createCommentVNode(" Top Redundant Cell before time starts for giving the calendar some space "),
              createBaseVNode(
                "div",
                {
                  class: "flex h-[50px] w-full flex-wrap gap-2 overflow-y-scroll border-b-[1px] border-gray-200 transition-all",
                  style: normalizeStyle({ height: `${$props.config.redundantCellHeight}px` })
                },
                [
                  (openBlock(true), createElementBlock(
                    Fragment,
                    null,
                    renderList($setup.fullDayEvents[$setup.parseDate($props.currentDate)], (calendarEvent, idx) => {
                      return openBlock(), createBlock($setup["CalendarEvent"], {
                        class: "mb-1 w-[20%] cursor-pointer",
                        event: { ...calendarEvent, idx },
                        key: calendarEvent.id,
                        date: $props.currentDate
                      }, null, 8, ["event", "date"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ],
                4
                /* STYLE */
              ),
              createCommentVNode(" Day Grid "),
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList($setup.twentyFourHoursFormat, (time) => {
                  return openBlock(), createElementBlock("div", {
                    class: "relative flex",
                    "data-time-attr": time,
                    onDblclick: ($event) => $setup.calendarActions.handleCellDblClick($event, $props.currentDate, time)
                  }, [
                    createBaseVNode(
                      "div",
                      {
                        class: "w-full border-b-[1px] border-gray-200",
                        style: normalizeStyle({ height: `${$setup.hourHeight}px` })
                      },
                      null,
                      4
                      /* STYLE */
                    )
                  ], 40, _hoisted_8);
                }),
                256
                /* UNKEYED_FRAGMENT */
              )),
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList($setup.timedEvents[$setup.parseDate($props.currentDate)], (calendarEvent, idx) => {
                  return openBlock(), createBlock($setup["CalendarEvent"], {
                    class: "absolute mb-2 cursor-pointer",
                    event: calendarEvent,
                    key: calendarEvent.id,
                    date: $props.currentDate
                  }, null, 8, ["event", "date"]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              createCommentVNode(" Current time Marker "),
              createVNode($setup["CalendarTimeMarker"], {
                date: $props.currentDate,
                redundantCellHeight: $props.config.redundantCellHeight
              }, null, 8, ["date", "redundantCellHeight"])
            ])
          ])
        ],
        512
        /* NEED_PATCH */
      )
    ])
  ]);
}
_sfc_main$1.__file = "src/components/Calendar/CalendarDaily.vue";
const CalendarDaily = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/CalendarDaily.vue"]]);
function useEventModal() {
  const showEventModal = ref(false);
  const newEvent = reactive({
    date: "",
    participant: "",
    from_time: "",
    to_time: "",
    venue: "",
    title: ""
  });
  function openNewEventModal(e, view, date, isEditMode, from_time = "") {
    if (!isEditMode) return;
    date = view === "Week" ? e.target.parentNode.parentNode.getAttribute("data-date-attr") : date;
    newEvent.date = parseDate(new Date(date));
    if (view === "Month") {
      showEventModal.value = true;
      return;
    }
    let to_time = convertMinutesToHours(calculateMinutes(from_time) + 60).slice(
      0,
      -3
    );
    newEvent.from_time = from_time;
    newEvent.to_time = to_time;
    showEventModal.value = true;
  }
  return { showEventModal, newEvent, openNewEventModal };
}
const _sfc_main = {
  __name: "Calendar",
  props: {
    events: {
      type: Object,
      required: false,
      default: []
    },
    config: {
      type: Object
    },
    create: {
      type: Function,
      required: false
    },
    update: {
      type: Function,
      required: false
    },
    delete: {
      type: Function,
      required: false
    },
    onClick: {
      type: Function,
      required: false
    },
    onDblClick: {
      type: Function,
      required: false
    },
    onCellDblClick: {
      type: Function,
      required: false
    }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const defaultConfig = {
      scrollToHour: 15,
      disableModes: [],
      defaultMode: "Month",
      isEditMode: false,
      eventIcons: {},
      redundantCellHeight: 50,
      hourHeight: 50,
      enableShortcuts: true,
      showIcon: true
    };
    const overrideConfig = { ...defaultConfig, ...props.config };
    let activeView = ref(overrideConfig.defaultMode);
    function updateActiveView(value) {
      console.log(value);
      activeView.value = value;
    }
    onMounted(() => {
      if (!overrideConfig.enableShortcuts) return;
      window.addEventListener("keydown", handleShortcuts);
    });
    onUnmounted(() => {
      window.removeEventListener("keydown", handleShortcuts);
    });
    function handleShortcuts(e) {
      if (e.key === "m" || e.key === "M") {
        activeView.value = "Month";
      }
      if (e.key === "w" || e.key === "W") {
        activeView.value = "Week";
      }
      if (e.key === "d" || e.key === "D") {
        activeView.value = "Day";
      }
      if (e.key === "ArrowLeft") {
        decrement();
      }
      if (e.key === "ArrowRight") {
        increment();
      }
    }
    provide("activeView", activeView);
    provide("config", overrideConfig);
    const parseEvents = computed(() => {
      return props.events.map((event) => {
        const { fromDate, toDate, ...rest } = event;
        const date2 = parseDate(fromDate);
        const from_time = new Date(fromDate).toLocaleTimeString();
        const to_time = new Date(toDate).toLocaleTimeString();
        if (event.isFullDay) {
          return { ...rest, date: date2 };
        }
        return { ...rest, date: date2, from_time, to_time };
      });
    });
    const events = ref(parseEvents.value);
    events.value.forEach((event) => {
      if (!event.from_time || !event.to_time) {
        return;
      }
      event.from_time = handleSeconds(event.from_time);
      event.to_time = handleSeconds(event.to_time);
    });
    const { showEventModal, newEvent, openNewEventModal } = useEventModal();
    provide("calendarActions", {
      createNewEvent,
      updateEventState,
      deleteEvent,
      handleCellDblClick,
      props
    });
    function createNewEvent(event) {
      events.value.push(event);
      props.create && props.create(event);
    }
    function updateEventState(event) {
      const eventID = event.id;
      let eventIndex = events.value.findIndex((e) => e.id === eventID);
      events.value[eventIndex] = event;
      props.update && props.update(events.value[eventIndex]);
    }
    function deleteEvent(eventID) {
      const eventIndex = events.value.findIndex((event) => event.id === eventID);
      events.value.splice(eventIndex, 1);
      props.delete && props.delete(eventID);
    }
    function openModal(data) {
      const { e, view, date: date2, time } = data;
      const config = overrideConfig.isEditMode;
      openNewEventModal(e, view, date2, config, time);
    }
    function handleCellDblClick(e, date2, time = "") {
      const data = {
        e,
        view: activeView.value,
        date: date2,
        time
      };
      if (props.onCellDblClick) {
        props.onCellDblClick(data);
        return;
      }
      openModal(data);
    }
    const actionOptions = [
      { label: "Day", variant: "solid" },
      { label: "Week", variant: "solid" },
      { label: "Month", variant: "solid" }
    ];
    let enabledModes = actionOptions.filter(
      (mode) => !overrideConfig.disableModes.includes(mode.label)
    );
    let currentYear = ref((/* @__PURE__ */ new Date()).getFullYear());
    let currentMonth = ref((/* @__PURE__ */ new Date()).getMonth());
    let currentDate = ref(/* @__PURE__ */ new Date());
    let currentMonthDates = computed(() => {
      let dates = getCalendarDates(currentMonth.value, currentYear.value);
      return dates;
    });
    let datesInWeeks = computed(() => {
      let dates = [...currentMonthDates.value];
      let datesInWeeks2 = [];
      while (dates.length) {
        let week2 = dates.splice(0, 7);
        datesInWeeks2.push(week2);
      }
      return datesInWeeks2;
    });
    function findCurrentWeek(date2) {
      return datesInWeeks.value.findIndex(
        (week2) => week2.find(
          (d) => new Date(d).toLocaleDateString().split("T")[0] === new Date(date2).toLocaleDateString().split("T")[0]
        )
      );
    }
    let week = ref(findCurrentWeek(currentDate.value));
    let date = ref(
      currentMonthDates.value.findIndex(
        (d) => new Date(d).toDateString() === currentDate.value.toDateString()
      )
    );
    let selectedDay = computed(() => currentMonthDates.value[date.value]);
    function updateCurrentDate(d) {
      activeView.value = "Day";
      date.value = findIndexOfDate(d);
      week.value = findCurrentWeek(d);
    }
    const incrementClickEvents = {
      Month: incrementMonth,
      Week: incrementWeek,
      Day: incrementDay
    };
    const decrementClickEvents = {
      Month: decrementMonth,
      Week: decrementWeek,
      Day: decrementDay
    };
    function incrementMonth() {
      currentMonth.value++;
      date.value = findFirstDateOfMonth(currentMonth.value, currentYear.value);
      week.value = findCurrentWeek(currentMonthDates.value[date.value]) + 1;
      if (currentMonth.value > 11) {
        currentMonth.value = 0;
        currentYear.value++;
      }
    }
    function decrementMonth() {
      currentMonth.value--;
      date.value = findLastDateOfMonth(currentMonth.value, currentYear.value);
      week.value = findCurrentWeek(currentMonthDates.value[date.value]);
      if (currentMonth.value < 0) {
        currentMonth.value = 11;
        currentYear.value--;
      }
    }
    function increment() {
      incrementClickEvents[activeView.value]();
    }
    function decrement() {
      decrementClickEvents[activeView.value]();
    }
    function incrementWeek() {
      week.value += 1;
      if (week.value < datesInWeeks.value.length) {
        date.value = findIndexOfDate(datesInWeeks.value[week.value][0]);
      }
      if (week.value > datesInWeeks.value.length - 1) {
        incrementMonth();
      }
      let nextMonthDates = filterCurrentWeekDates();
      if (nextMonthDates.length > 0) {
        incrementMonth();
        week.value = findCurrentWeek(nextMonthDates[0]);
      }
    }
    function decrementWeek() {
      week.value -= 1;
      if (week.value < 0) {
        decrementMonth();
        return;
      }
      if (week.value > 0) {
        date.value = findIndexOfDate(datesInWeeks.value[week.value][0]);
      }
      let previousMonthDates = filterCurrentWeekDates();
      if (previousMonthDates.length > 0) {
        decrementMonth();
        week.value = findCurrentWeek(previousMonthDates[0]);
      }
    }
    function filterCurrentWeekDates() {
      let currentWeekDates = datesInWeeks.value[week.value];
      let differentMonthDates = currentWeekDates.filter(
        (d) => d.getMonth() !== currentMonth.value
      );
      return differentMonthDates;
    }
    function incrementDay() {
      date.value++;
      if (date.value > currentMonthDates.value.length - 1 || !isCurrentMonthDate(currentMonthDates.value[date.value])) {
        incrementMonth();
      }
    }
    function decrementDay() {
      date.value--;
      if (date.value < 0 || !isCurrentMonthDate(currentMonthDates.value[date.value])) {
        decrementMonth();
      }
    }
    function findLastDateOfMonth(month, year) {
      let inputDate = new Date(year, month + 1, 0);
      let lastDateIndex = currentMonthDates.value.findIndex(
        (date2) => new Date(date2).toDateString() === inputDate.toDateString()
      );
      return lastDateIndex;
    }
    function findFirstDateOfMonth(month, year) {
      let inputDate = new Date(year, month, 1);
      let firstDateIndex = currentMonthDates.value.findIndex(
        (date2) => new Date(date2).toDateString() === inputDate.toDateString()
      );
      return firstDateIndex;
    }
    function findIndexOfDate(date2) {
      return currentMonthDates.value.findIndex(
        (d) => new Date(d).toDateString() === new Date(date2).toDateString()
      );
    }
    const currentMonthYear = computed(() => {
      return monthList[currentMonth.value] + ", " + currentYear.value;
    });
    function isCurrentMonthDate(date2) {
      date2 = new Date(date2);
      return date2.getMonth() === currentMonth.value;
    }
    const __returned__ = { props, defaultConfig, overrideConfig, get activeView() {
      return activeView;
    }, set activeView(v) {
      activeView = v;
    }, updateActiveView, handleShortcuts, parseEvents, events, showEventModal, newEvent, openNewEventModal, createNewEvent, updateEventState, deleteEvent, openModal, handleCellDblClick, actionOptions, get enabledModes() {
      return enabledModes;
    }, set enabledModes(v) {
      enabledModes = v;
    }, get currentYear() {
      return currentYear;
    }, set currentYear(v) {
      currentYear = v;
    }, get currentMonth() {
      return currentMonth;
    }, set currentMonth(v) {
      currentMonth = v;
    }, get currentDate() {
      return currentDate;
    }, set currentDate(v) {
      currentDate = v;
    }, get currentMonthDates() {
      return currentMonthDates;
    }, set currentMonthDates(v) {
      currentMonthDates = v;
    }, get datesInWeeks() {
      return datesInWeeks;
    }, set datesInWeeks(v) {
      datesInWeeks = v;
    }, findCurrentWeek, get week() {
      return week;
    }, set week(v) {
      week = v;
    }, get date() {
      return date;
    }, set date(v) {
      date = v;
    }, get selectedDay() {
      return selectedDay;
    }, set selectedDay(v) {
      selectedDay = v;
    }, updateCurrentDate, incrementClickEvents, decrementClickEvents, incrementMonth, decrementMonth, increment, decrement, incrementWeek, decrementWeek, filterCurrentWeekDates, incrementDay, decrementDay, findLastDateOfMonth, findFirstDateOfMonth, findIndexOfDate, currentMonthYear, isCurrentMonthDate, computed, onMounted, onUnmounted, provide, ref, watch, get Button() {
      return Button;
    }, TabButtons, get getCalendarDates() {
      return getCalendarDates;
    }, get monthList() {
      return monthList;
    }, get handleSeconds() {
      return handleSeconds;
    }, get parseDate() {
      return parseDate;
    }, CalendarMonthly, CalendarWeekly, CalendarDaily, NewEventModal, get useEventModal() {
      return useEventModal;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1 = { class: "flex h-full flex-col overflow-hidden" };
const _hoisted_2 = { class: "mb-2 flex justify-between" };
const _hoisted_3 = { class: "text-xl font-medium" };
const _hoisted_4 = { class: "flex gap-x-1" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    renderSlot(_ctx.$slots, "header", normalizeProps(guardReactiveProps({
      currentMonthYear: $setup.currentMonthYear,
      enabledModes: $setup.enabledModes,
      activeView: $setup.activeView,
      decrement: $setup.decrement,
      increment: $setup.increment,
      updateActiveView: $setup.updateActiveView
    })), () => [
      createBaseVNode("div", _hoisted_2, [
        createCommentVNode(" left side  "),
        createCommentVNode(" Year, Month "),
        createBaseVNode(
          "span",
          _hoisted_3,
          toDisplayString($setup.currentMonthYear),
          1
          /* TEXT */
        ),
        createCommentVNode(" right side "),
        createCommentVNode(" actions buttons for calendar "),
        createBaseVNode("div", _hoisted_4, [
          createCommentVNode(" Increment and Decrement Button"),
          createVNode($setup["Button"], {
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.decrement()),
            variant: "ghost",
            class: "h-4 w-4",
            icon: "chevron-left"
          }),
          createVNode($setup["Button"], {
            onClick: _cache[1] || (_cache[1] = ($event) => $setup.increment()),
            variant: "ghost",
            class: "h-4 w-4",
            icon: "chevron-right"
          }),
          createCommentVNode("  View change button, default is months or can be set via props!  "),
          createVNode($setup["TabButtons"], {
            buttons: $setup.enabledModes,
            class: "ml-2",
            modelValue: $setup.activeView,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.activeView = $event)
          }, null, 8, ["buttons", "modelValue"])
        ])
      ])
    ]),
    $setup.activeView === "Month" ? (openBlock(), createBlock($setup["CalendarMonthly"], {
      key: 0,
      events: $setup.events,
      currentMonth: $setup.currentMonth,
      currentMonthDates: $setup.currentMonthDates,
      config: $setup.overrideConfig,
      onSetCurrentDate: _cache[3] || (_cache[3] = (d) => $setup.updateCurrentDate(d))
    }, null, 8, ["events", "currentMonth", "currentMonthDates"])) : $setup.activeView === "Week" ? (openBlock(), createBlock($setup["CalendarWeekly"], {
      key: 1,
      events: $setup.events,
      weeklyDates: $setup.datesInWeeks[$setup.week],
      config: $setup.overrideConfig
    }, null, 8, ["events", "weeklyDates"])) : $setup.activeView === "Day" ? (openBlock(), createBlock($setup["CalendarDaily"], {
      key: 2,
      events: $setup.events,
      "current-date": $setup.selectedDay,
      config: $setup.overrideConfig
    }, null, 8, ["events", "current-date"])) : createCommentVNode("v-if", true),
    $setup.showEventModal ? (openBlock(), createBlock($setup["NewEventModal"], {
      key: 3,
      modelValue: $setup.showEventModal,
      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.showEventModal = $event),
      event: $setup.newEvent
    }, null, 8, ["modelValue", "event"])) : createCommentVNode("v-if", true)
  ]);
}
_sfc_main.__file = "src/components/Calendar/Calendar.vue";
const Calendar = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/Calendar.vue"]]);
export {
  Calendar as C
};
