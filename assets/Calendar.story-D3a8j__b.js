import { ay as _export_sfc, aD as openBlock, aL as createElementBlock, aI as createBaseVNode, b0 as withModifiers, aH as createVNode, aS as createCommentVNode, aJ as toDisplayString, aA as ref, aB as reactive, aO as computed, b1 as inject, aE as createBlock, aF as withCtx, b2 as normalizeStyle, b3 as onMounted, b4 as onBeforeUnmount, b5 as watch, b6 as useFloating, b7 as offset, b8 as flip, b9 as shift, ba as autoUpdate, aW as mergeProps, bb as toHandlers, aR as resolveDynamicComponent, aQ as normalizeClass, aV as Fragment, aU as renderList, aT as createTextVNode, bc as onUnmounted, bd as provide, a_ as nextTick, aP as renderSlot, be as normalizeProps, bf as guardReactiveProps, aC as resolveComponent, a$ as logEvent } from "./vendor-DFWYVX6c.js";
import { d as dayjs } from "./dayjs-dpZEAMpw.js";
import { D as DatePicker } from "./DatePicker-CXH-wbaw.js";
import { F as FeatherIcon } from "./FeatherIcon-l6CDdi5b.js";
import { D as Dialog } from "./index-vCchaNu8.js";
import { F as FormControl } from "./FormControl-xQlG1R2m.js";
import { E as ErrorMessage } from "./ErrorMessage-Cw_hOyAl.js";
import { B as Button, _ as __unplugin_components_0 } from "./Button-Dbj1SmcA.js";
import { T as TabButtons } from "./TabButtons-BX31351A.js";
import { S as Select } from "./Select-CaFXYj6M.js";
import "./Popover-BzLleygG.js";
import "./TextInput-DNvqakca.js";
import "./debounce-CRCtzhPg.js";
import "./Dialog-CQ0gWXg1.js";
import "./x-BEdNj-u5.js";
import "./useId-DJabvbK8.js";
import "./Textarea-qsrl0N9f.js";
import "./Checkbox-DvNOQBo8.js";
import "./Autocomplete-Dr_hhpuw.js";
import "./Combobox-Bm4wvYY-.js";
import "./check-CgU1q1Gn.js";
import "./chevron-down-DCQC5Avw.js";
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
const twelveHoursFormat = [
  "12 am",
  "1 am",
  "2 am",
  "3 am",
  "4 am",
  "5 am",
  "6 am",
  "7 am",
  "8 am",
  "9 am",
  "10 am",
  "11 am",
  "12 pm",
  "1 pm",
  "2 pm",
  "3 pm",
  "4 pm",
  "5 pm",
  "6 pm",
  "7 pm",
  "8 pm",
  "9 pm",
  "10 pm",
  "11 pm"
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
function formattedDuration(fromTime, toTime, timeFormat) {
  fromTime = formatTime(fromTime, timeFormat);
  toTime = formatTime(toTime, timeFormat);
  if (fromTime.split(" ")[1] === toTime.split(" ")[1]) {
    fromTime = fromTime.split(" ")[0];
  }
  return fromTime + " - " + toTime;
}
function formatTime(time, format) {
  if (format === "12h") {
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours);
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    if (minutes === "00") {
      return `${hours} ${ampm}`;
    }
    time = `${hours}:${minutes} ${ampm}`;
  }
  return time;
}
const colorMap = {
  amber: {
    color: "#DB7706",
    border: "#DB7706",
    borderActive: "#FBCC55",
    text: "#91400D",
    subtext: "#AD8460",
    subtextActive: "#FAEBD0",
    bg: "#FFF7D3",
    bgHover: "#FEEDA9",
    bgActive: "#E79913"
  },
  violet: {
    color: "#6846E3",
    border: "#6846E3",
    borderActive: "#B3A1F5",
    text: "#5F46C7",
    subtext: "#766D9B",
    subtextActive: "#E4DCFD",
    bg: "#F0EBFF",
    bgHover: "#DBD5FF",
    bgActive: "#7A51F4"
  },
  pink: {
    color: "#E34AA6",
    border: "#E34AA6",
    borderActive: "#F6A7D6",
    text: "#CF3A96",
    subtext: "#B26997",
    subtextActive: "#F9DBED",
    bg: "#FDE8F5",
    bgHover: "#FFD5F0",
    bgActive: "#E34AA6"
  },
  cyan: {
    color: "#3BBDE5",
    border: "#3BBDE5",
    borderActive: "#72D5F3",
    text: "#267A94",
    subtext: "#668E9C",
    subtextActive: "#D6EDF4",
    bg: "#DDF7FF",
    bgHover: "#B3E8F7",
    bgActive: "#32A4C7"
  },
  blue: {
    color: "#0289F7",
    border: "#0289F7",
    borderActive: "#A7D7FD",
    text: "#007BE0",
    subtext: "#5C8DB3",
    subtextActive: "#CCE7FD",
    bg: "#E6F4FF",
    bgHover: "#C8E6FF",
    bgActive: "#0289F7"
  },
  orange: {
    color: "#E86C13",
    border: "#E86C13",
    borderActive: "#FFCBA3",
    text: "#E86C13",
    subtext: "#A67765",
    subtextActive: "#FAE2D0",
    bg: "#FFEFE4",
    bgHover: "#FFDEC5",
    bgActive: "#E86C13"
  },
  green: {
    color: "#30A66D",
    border: "#30A66D",
    borderActive: "#88D5A5",
    text: "#137949",
    subtext: "#678877",
    subtextActive: "#D6EDE2",
    bg: "#E4FAEB",
    bgHover: "#CBF3D7",
    bgActive: "#30A66D"
  }
};
const colorMapDark = {
  amber: {
    color: "#DB7706",
    border: "#C57411",
    borderActive: "#C57411",
    text: "#C57411",
    textActive: "#824108",
    subtext: "#988356",
    subtextActive: "#8E6026",
    bg: "#371E06",
    bgHover: "#4B2606",
    bgActive: "#F8D16E"
  },
  violet: {
    color: "#6846E3",
    border: "#A384EC",
    borderActive: "#8867E8",
    text: "#A384EC",
    textActive: "#4639A6",
    subtext: "#9389AE",
    subtextActive: "#332978",
    bg: "#221C42",
    bgHover: "#281E5D",
    bgActive: "#C4AFEE"
  },
  pink: {
    color: "#E34AA6",
    border: "#CB4394",
    borderActive: "#CB4394",
    text: "#E359AB",
    textActive: "#822A5F",
    subtext: "#B07E99",
    subtextActive: "#935277",
    bg: "#471432",
    bgHover: "#68204B",
    bgActive: "#F6C5DE"
  },
  cyan: {
    color: "#3BBDE5",
    border: "#2B8DAB",
    borderActive: "#2B8DAB",
    text: "#3CB8DC",
    textActive: "#155266",
    subtext: "#819FA8",
    subtextActive: "#3A6E7D",
    bg: "#0B252D",
    bgHover: "#0E3B49",
    bgActive: "#A0E6F7"
  },
  blue: {
    color: "#0289F7",
    border: "#3294E3",
    borderActive: "#1580D8",
    text: "#5AAEF2",
    textActive: "#155999",
    subtext: "#7F95AC",
    subtextActive: "#386A99",
    bg: "#10243E",
    bgHover: "#052B53",
    bgActive: "#ADD2F5"
  },
  orange: {
    color: "#E86C13",
    border: "#C45A0E",
    borderActive: "#C45A0E",
    text: "#DE6D1B",
    textActive: "#823906",
    subtext: "#B3876B",
    subtextActive: "#955528",
    bg: "#401F07",
    bgHover: "#532707",
    bgActive: "#FFA873"
  },
  green: {
    color: "#30A66D",
    border: "#35AE74",
    borderActive: "#35AE74",
    text: "#58C08E",
    textActive: "#0B6139",
    subtext: "#7CA490",
    subtextActive: "#0B6139",
    bg: "#0B2E1C",
    bgHover: "#0A3F27",
    bgActive: "#9BE6C1"
  }
};
const _weekdayNameToIndex = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};
function getWeekendDays(config) {
  const raw = (config == null ? void 0 : config.weekendDays) || (config == null ? void 0 : config.weekends);
  if (!raw || !Array.isArray(raw) || raw.length === 0) return [0];
  return raw.map((d) => {
    if (typeof d === "number") return d;
    if (typeof d === "string") {
      const key = d.trim().toLowerCase();
      if (_weekdayNameToIndex.hasOwnProperty(key))
        return _weekdayNameToIndex[key];
    }
    return null;
  }).filter((v) => v !== null && v >= 0 && v <= 6);
}
function isWeekend(date, config) {
  const day = new Date(date).getDay();
  const weekendDays = getWeekendDays(config);
  return weekendDays.includes(day);
}
function formatMonthYear(month, year) {
  return `${monthList[month]} ${year}`;
}
function getWeekMonthParts(weekDates) {
  const parts = [];
  for (const d of weekDates || []) {
    const dt = new Date(d);
    const m = dt.getMonth();
    const y = dt.getFullYear();
    const key = `${y}-${m}`;
    if (!parts.find((p) => p.key === key))
      parts.push({ key, month: m, year: y });
  }
  return parts;
}
const _sfc_main$c = {};
const _hoisted_1$a = {
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function _sfc_render$c(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$a, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        d: "M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6ZM8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7Z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$c.__file = "src/components/Calendar/Icon/DayIcon.vue";
const DayIcon = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/Icon/DayIcon.vue"]]);
const _sfc_main$b = {};
const _hoisted_1$9 = {
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function _sfc_render$b(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$9, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        d: "M3 6C4.10457 6 5 6.89543 5 8C5 9.10457 4.10457 10 3 10C1.89543 10 1 9.10457 1 8C1 6.89543 1.89543 6 3 6ZM8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6ZM13 6C14.1046 6 15 6.89543 15 8C15 9.10457 14.1046 10 13 10C11.8954 10 11 9.10457 11 8C11 6.89543 11.8954 6 13 6ZM13 7C12.4477 7 12 7.44772 12 8C12 8.55228 12.4477 9 13 9C13.5523 9 14 8.55228 14 8C14 7.44772 13.5523 7 13 7ZM3 7C2.44772 7 2 7.44772 2 8C2 8.55228 2.44772 9 3 9C3.55228 9 4 8.55228 4 8C4 7.44772 3.55228 7 3 7ZM8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7Z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$b.__file = "src/components/Calendar/Icon/WeekIcon.vue";
const WeekIcon = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/Icon/WeekIcon.vue"]]);
const _sfc_main$a = {};
const _hoisted_1$8 = {
  width: "16",
  height: "16",
  viewBox: "0 0 16 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function _sfc_render$a(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$8, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        d: "M5 9C6.10457 9 7 9.89543 7 11C7 12.1046 6.10457 13 5 13C3.89543 13 3 12.1046 3 11C3 9.89543 3.89543 9 5 9ZM11 9C12.1046 9 13 9.89543 13 11C13 12.1046 12.1046 13 11 13C9.89543 13 9 12.1046 9 11C9 9.89543 9.89543 9 11 9ZM5 10C4.44772 10 4 10.4477 4 11C4 11.5523 4.44772 12 5 12C5.55228 12 6 11.5523 6 11C6 10.4477 5.55228 10 5 10ZM11 10C10.4477 10 10 10.4477 10 11C10 11.5523 10.4477 12 11 12C11.5523 12 12 11.5523 12 11C12 10.4477 11.5523 10 11 10ZM5 3C6.10457 3 7 3.89543 7 5C7 6.10457 6.10457 7 5 7C3.89543 7 3 6.10457 3 5C3 3.89543 3.89543 3 5 3ZM11 3C12.1046 3 13 3.89543 13 5C13 6.10457 12.1046 7 11 7C9.89543 7 9 6.10457 9 5C9 3.89543 9.89543 3 11 3ZM5 4C4.44772 4 4 4.44772 4 5C4 5.55228 4.44772 6 5 6C5.55228 6 6 5.55228 6 5C6 4.44772 5.55228 4 5 4ZM11 4C10.4477 4 10 4.44772 10 5C10 5.55228 10.4477 6 11 6C11.5523 6 12 5.55228 12 5C12 4.44772 11.5523 4 11 4Z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$a.__file = "src/components/Calendar/Icon/MonthIcon.vue";
const MonthIcon = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/Icon/MonthIcon.vue"]]);
const _sfc_main$9 = {
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
const _hoisted_1$7 = { class: "flex flex-row-reverse gap-2" };
const _hoisted_2$7 = { class: "flex flex-col gap-5" };
const _hoisted_3$6 = { class: "flex justify-between text-xl font-semibold" };
const _hoisted_4$6 = { class: "flex flex-col gap-4" };
const _hoisted_5$5 = { class: "flex items-center gap-2" };
const _hoisted_6$5 = { class: "text-sm font-normal" };
const _hoisted_7$5 = {
  key: 0,
  class: "flex items-center gap-2"
};
const _hoisted_8$2 = { class: "text-sm font-normal" };
const _hoisted_9$1 = {
  key: 1,
  class: "flex items-center gap-2"
};
const _hoisted_10$1 = { class: "text-sm font-normal" };
const _hoisted_11$1 = {
  key: 2,
  class: "flex items-center gap-2"
};
const _hoisted_12$1 = { class: "text-sm font-normal" };
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: "w-80 rounded bg-surface-modal text-ink-gray-8 p-4 shadow",
    onClick: _cache[3] || (_cache[3] = withModifiers(() => {
    }, ["stop"]))
  }, [
    createBaseVNode("div", _hoisted_1$7, [
      createBaseVNode("span", {
        class: "cursor-pointer",
        onClick: _cache[0] || (_cache[0] = withModifiers(($event) => _ctx.$emit("close"), ["stop"]))
      }, [
        createVNode($setup["FeatherIcon"], {
          name: "x",
          class: "h-4 w-4"
        })
      ]),
      $props.isEditMode ? (openBlock(), createElementBlock("span", {
        key: 0,
        class: "cursor-pointer",
        onClick: _cache[1] || (_cache[1] = withModifiers(($event) => _ctx.$emit("edit"), ["stop"]))
      }, [
        createVNode($setup["FeatherIcon"], {
          name: "edit-2",
          class: "h-4 w-4"
        })
      ])) : createCommentVNode("v-if", true),
      $props.isEditMode ? (openBlock(), createElementBlock("span", {
        key: 1,
        class: "cursor-pointer",
        onClick: _cache[2] || (_cache[2] = withModifiers(($event) => _ctx.$emit("delete"), ["stop"]))
      }, [
        createVNode($setup["FeatherIcon"], {
          name: "trash-2",
          class: "h-4 w-4"
        })
      ])) : createCommentVNode("v-if", true)
    ]),
    createBaseVNode("div", _hoisted_2$7, [
      createBaseVNode("div", _hoisted_3$6, [
        createBaseVNode(
          "span",
          null,
          toDisplayString($props.calendarEvent.title || "New Event"),
          1
          /* TEXT */
        )
      ]),
      createBaseVNode("div", _hoisted_4$6, [
        createBaseVNode("div", _hoisted_5$5, [
          createVNode($setup["FeatherIcon"], {
            name: "calendar",
            class: "h-4 w-4"
          }),
          createBaseVNode(
            "span",
            _hoisted_6$5,
            toDisplayString($setup.parseDateEventPopupFormat($props.date)),
            1
            /* TEXT */
          )
        ]),
        $props.calendarEvent.participant ? (openBlock(), createElementBlock("div", _hoisted_7$5, [
          createVNode($setup["FeatherIcon"], {
            name: "user",
            class: "h-4 w-4"
          }),
          createBaseVNode(
            "span",
            _hoisted_8$2,
            toDisplayString($props.calendarEvent.participant),
            1
            /* TEXT */
          )
        ])) : createCommentVNode("v-if", true),
        $props.calendarEvent.fromTime && $props.calendarEvent.toTime ? (openBlock(), createElementBlock("div", _hoisted_9$1, [
          createVNode($setup["FeatherIcon"], {
            name: "clock",
            class: "h-4 w-4"
          }),
          createBaseVNode(
            "span",
            _hoisted_10$1,
            toDisplayString($props.calendarEvent.fromTime) + " - " + toDisplayString($props.calendarEvent.toTime),
            1
            /* TEXT */
          )
        ])) : createCommentVNode("v-if", true),
        $props.calendarEvent.venue ? (openBlock(), createElementBlock("div", _hoisted_11$1, [
          createVNode($setup["FeatherIcon"], {
            name: "map-pin",
            class: "h-4 w-4"
          }),
          createBaseVNode(
            "span",
            _hoisted_12$1,
            toDisplayString($props.calendarEvent.venue),
            1
            /* TEXT */
          )
        ])) : createCommentVNode("v-if", true)
      ])
    ])
  ]);
}
_sfc_main$9.__file = "src/components/Calendar/EventModalContent.vue";
const EventModalContent = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/EventModalContent.vue"]]);
const _sfc_main$8 = {
  __name: "NewEventModal",
  props: {
    event: {
      type: Object
    }
  },
  setup(__props, { expose: __expose }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    __expose();
    const show = ref(false);
    const props = __props;
    const newEvent = reactive({
      title: ((_a = props.event) == null ? void 0 : _a.title) || "",
      date: ((_b = props.event) == null ? void 0 : _b.date) || "",
      participant: ((_c = props.event) == null ? void 0 : _c.participant) || "",
      fromDateTime: ((_d = props.event) == null ? void 0 : _d.fromDateTime) || "",
      toDateTime: ((_e = props.event) == null ? void 0 : _e.toDateTime) || "",
      fromDate: ((_f = props.event) == null ? void 0 : _f.fromDate) || "",
      toDate: ((_g = props.event) == null ? void 0 : _g.toDate) || "",
      fromTime: ((_h = props.event) == null ? void 0 : _h.fromTime) || "",
      toTime: ((_i = props.event) == null ? void 0 : _i.toTime) || "",
      venue: ((_j = props.event) == null ? void 0 : _j.venue) || "",
      color: ((_k = props.event) == null ? void 0 : _k.color) || "green",
      id: "",
      isFullDay: ((_l = props.event) == null ? void 0 : _l.isFullDay) || false
    });
    const isUpdated = computed(() => {
      return newEvent.title !== props.event.title || newEvent.date !== props.event.date || newEvent.participant !== props.event.participant || newEvent.fromDate !== props.event.fromDate || newEvent.toDate !== props.event.toDate || newEvent.fromTime !== props.event.fromTime || newEvent.toTime !== props.event.toTime || newEvent.venue !== props.event.venue || newEvent.color !== props.event.color || newEvent.isFullDay !== props.event.isFullDay;
    });
    const colors = Object.keys(colorMap);
    const errorMessage = ref("");
    function validateFields() {
      if (!newEvent.date) {
        errorMessage.value = "Date is required";
      } else if (!newEvent.fromTime && !newEvent.isFullDay) {
        errorMessage.value = "Start Time is required";
      } else if (!newEvent.toTime && !newEvent.isFullDay) {
        errorMessage.value = "End Time is required";
      } else {
        errorMessage.value = "";
      }
      if (newEvent.hasOwnProperty("fromTime") && newEvent.hasOwnProperty("toTime")) {
        validateStartEndTime();
      }
    }
    function validateStartEndTime() {
      let timeDiff = calculateDiff(newEvent.fromTime, newEvent.toTime);
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
        newEvent.fromTime = "";
        newEvent.toTime = "";
      } else {
        newEvent.fromTime = handleSeconds(newEvent.fromTime);
        newEvent.toTime = handleSeconds(newEvent.toTime);
      }
    }
    const __returned__ = { show, props, newEvent, isUpdated, colors, errorMessage, validateFields, validateStartEndTime, calendarActions, submitEvent, handleEventTime, computed, inject, reactive, ref, get Dialog() {
      return Dialog;
    }, get FormControl() {
      return FormControl;
    }, get ErrorMessage() {
      return ErrorMessage;
    }, get Button() {
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
const _hoisted_1$6 = { class: "grid grid-cols-1 gap-4" };
const _hoisted_2$6 = { class: "flex flex-row-reverse gap-2" };
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
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
        createBaseVNode("div", _hoisted_1$6, [
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
            modelValue: $setup.newEvent.fromTime,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.newEvent.fromTime = $event),
            label: "Start Time",
            onBlur: _cache[5] || (_cache[5] = ($event) => $setup.validateFields())
          }, null, 8, ["modelValue"])) : createCommentVNode("v-if", true),
          !$setup.newEvent.isFullDay ? (openBlock(), createBlock($setup["FormControl"], {
            key: 1,
            type: "time",
            modelValue: $setup.newEvent.toTime,
            "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.newEvent.toTime = $event),
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
                    class: "h-5 w-5 rounded-full shadow-md",
                    style: normalizeStyle({
                      backgroundColor: (_b = $setup.colorMap[(_a = $setup.newEvent) == null ? void 0 : _a.color]) == null ? void 0 : _b.color
                    })
                  },
                  null,
                  4
                  /* STYLE */
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
      createBaseVNode("div", _hoisted_2$6, [
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
_sfc_main$8.__file = "src/components/Calendar/NewEventModal.vue";
const NewEventModal = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/NewEventModal.vue"]]);
const activeEvent = ref("");
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
          task.startTime = calculateMinutes(task.fromTime);
          task.endTime = calculateMinutes(task.toTime);
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
    (a, b) => a.fromTime !== b.fromTime ? calculateMinutes(a.fromTime) > calculateMinutes(b.fromTime) ? 1 : -1 : calculateMinutes(a.toTime) > calculateMinutes(b.toTime) ? 1 : -1
  );
  return [...fullDayEvents, ...timedEvents];
}
const heightThreshold = 40;
const minimumHeight = 32.5;
const _sfc_main$7 = {
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
        updatedEvent.fromTime = newVal.fromTime;
        updatedEvent.toTime = newVal.toTime;
        updatedEvent.fromDate = newVal.fromDate;
        updatedEvent.toDate = newVal.toDate;
        updatedEvent.fromDateTime = newVal.fromDate + " " + newVal.fromTime;
        updatedEvent.toDateTime = newVal.toDate + " " + newVal.toTime;
        calendarEvent.value = newVal;
      },
      { deep: true }
    );
    const eventIcons = config.eventIcons;
    const minuteHeight = config.hourHeight / 60;
    const height15Min = minuteHeight * 15;
    const state = reactive({
      xAxis: 0,
      yAxis: 0
    });
    const setEventStyles = computed(() => {
      if (props.event.isFullDay) {
        return {
          transform: `translate(${state.xAxis}px, ${state.yAxis}px)`,
          zIndex: isRepositioning.value ? 100 : props.event.idx + 1
        };
      }
      let diff = calculateDiff(
        calendarEvent.value.fromTime,
        calendarEvent.value.toTime
      );
      let height = diff * minuteHeight;
      if (height < heightThreshold) {
        height = minimumHeight;
      }
      height += "px";
      let top = calculateMinutes(calendarEvent.value.fromTime) * minuteHeight;
      let hallNumber = calendarEvent.value.hallNumber;
      let width = isResizing.value || isRepositioning.value ? "100%" : `${93 - hallNumber * 20}%`;
      let left = isResizing.value || isRepositioning.value ? "0" : `${hallNumber * 20}%`;
      let zIndex = isResizing.value || isRepositioning.value ? 100 : (props.event.idx || 1) * hallNumber + 1;
      return {
        height,
        top: top + "px",
        zIndex,
        left,
        width,
        transform: `translate(${state.xAxis}px, ${state.yAxis}px)`
      };
    });
    const eventBgStyle = computed(() => {
      let _color = props.event.color || "green";
      _color = color(_color);
      return {
        "--bg": _color.bg,
        "--text": _color.text,
        "--subtext": _color.subtext,
        "--text-active": _color.textActive,
        "--subtext-active": _color.subtextActive,
        "--bg-hover": _color.bgHover,
        "--bg-active": _color.bgActive
      };
    });
    const eventBorderStyle = computed(() => {
      let _color = props.event.color || "green";
      _color = color(_color);
      return { "--border": _color.border, "--border-active": _color.borderActive };
    });
    const getTheme = () => {
      const theme = document.documentElement.getAttribute("data-theme");
      if (theme) return theme;
      return document.documentElement.classList.contains("htw-dark") ? "dark" : "light";
    };
    function color(color2) {
      let map = getTheme() === "dark" ? colorMapDark : colorMap;
      if (!(color2 == null ? void 0 : color2.startsWith("#"))) {
        return map[color2] || map["green"];
      }
      for (const value of Object.values(map)) {
        if (value.color === color2) return value;
      }
      return map["green"];
    }
    const eventTitleRef = ref(null);
    const eventTimeRef = ref(null);
    const lineClampClass = computed(() => {
      if (activeView.value === "Month") return;
      if (props.event.isFullDay) return "line-clamp-1";
      if (!eventRef.value || !eventTitleRef.value || !eventTimeRef.value) return;
      if (!props.event.fromTime && !props.event.toTime) return;
      const containerHeight = eventRef.value.clientHeight;
      const subtitleHeight = eventTimeRef.value.offsetHeight;
      const availableHeightForTitle = containerHeight - subtitleHeight - 8;
      const computedStyle = getComputedStyle(eventTitleRef.value);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const maxLines = Math.max(1, Math.floor(availableHeightForTitle / lineHeight));
      const clampValue = Math.min(maxLines, 6);
      return `line-clamp-${clampValue}`;
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
      let newEndTime = parseFloat(newHeight) / minuteHeight + calculateMinutes(calendarEvent.value.fromTime);
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
      let oldTime = calendarEvent.value.toTime;
      window.addEventListener("mousemove", resize2);
      window.addEventListener("mouseup", stopResize, { once: true });
      function resize2(e2) {
        preventClick.value = true;
        let diffX = e2.clientY - eventRef.value.getBoundingClientRect().top;
        eventRef.value.style.height = Math.round(diffX / height15Min) * height15Min + "px";
        eventRef.value.style.width = "100%";
        updatedEvent.toTime = newEventEndTime(eventRef.value.style.height);
        calendarEvent.value.toTime = newEventEndTime(eventRef.value.style.height);
      }
      function stopResize() {
        isResizing.value = false;
        if (oldTime !== calendarEvent.value.toTime) {
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
        if (calendarEvent.value.fromTime !== updatedEvent.fromTime || calendarEvent.value.toTime !== updatedEvent.toTime) {
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
          calendarEvent.value.fromDate = updatedEvent.date;
          calendarEvent.value.toDate = updatedEvent.date;
          calendarEvent.value.fromDateTime = updatedEvent.date + " " + updatedEvent.fromTime;
          calendarEvent.value.toDateTime = updatedEvent.date + " " + updatedEvent.toTime;
          calendarEvent.value.fromTime = updatedEvent.fromTime;
          calendarEvent.value.toTime = updatedEvent.toTime;
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
        eventRef.value.parentNode.getAttribute("data-date-attr")
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
      diffY = Math.round(diffY / height15Min) * height15Min;
      state.yAxis = diffY;
      updatedEvent.fromTime = convertMinutesToHours(
        calculateMinutes(calendarEvent.value.fromTime) + Math.round(diffY / minuteHeight)
      );
      updatedEvent.toTime = convertMinutesToHours(
        calculateMinutes(calendarEvent.value.toTime) + Math.round(diffY / minuteHeight)
      );
      handleTimeConstraints();
    }
    function handleTimeConstraints() {
      if (updatedEvent.fromTime < "00:00:00") {
        updatedEvent.fromTime = "00:00:00";
      }
      if (updatedEvent.fromTime > "24:00:00") {
        updatedEvent.fromTime = "24:00:00";
      }
      if (updatedEvent.toTime < "00:00:00") {
        updatedEvent.toTime = "00:00:00";
      }
      if (updatedEvent.toTime > "24:00:00") {
        updatedEvent.toTime = "24:00:00";
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
    const isPastEvent = computed(() => {
      try {
        const endDateStr = calendarEvent.value.toDate || calendarEvent.value.date || calendarEvent.value.fromDate || props.event.toDate || props.event.date || props.event.fromDate;
        if (!endDateStr) return false;
        let endTimeStr = "00:00:00";
        if (calendarEvent.value.isFullDay || props.event.isFullDay)
          endTimeStr = "23:59:59";
        else if (calendarEvent.value.toTime) endTimeStr = calendarEvent.value.toTime;
        const end = new Date(`${endDateStr}T${endTimeStr}`.replace(" ", "T"));
        return end.getTime() < (/* @__PURE__ */ new Date()).getTime();
      } catch (e) {
        return false;
      }
    });
    const __returned__ = { props, activeView, config, calendarActions, handleClickOutside, calendarEvent, updatedEvent, eventIcons, minuteHeight, height15Min, state, heightThreshold, minimumHeight, setEventStyles, eventBgStyle, eventBorderStyle, getTheme, color, eventTitleRef, eventTimeRef, lineClampClass, eventRef, floating, floatingStyles, opened, resize, isResizing, isRepositioning, isEventUpdated, newEventEndTime, preventClick, handleResizeMouseDown, handleRepositionMouseDown, getDate, handleHorizontalMovement, handleHorizontalBoundary, handleVerticalMovement, handleTimeConstraints, toggle, close, handleDeleteShortcut, get clickTimer() {
      return clickTimer;
    }, set clickTimer(v) {
      clickTimer = v;
    }, handleEventClick, showEventModal, handleEventEdit, handleEventDelete, isPastEvent, EventModalContent, NewEventModal, get useFloating() {
      return useFloating;
    }, get shift() {
      return shift;
    }, get flip() {
      return flip;
    }, get offset() {
      return offset;
    }, get autoUpdate() {
      return autoUpdate;
    }, get activeEvent() {
      return activeEvent;
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
    }, get colorMapDark() {
      return colorMapDark;
    }, get formattedDuration() {
      return formattedDuration;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$5 = { class: "relative flex h-full select-none items-start gap-2 overflow-hidden" };
const _hoisted_2$5 = { key: 0 };
const _hoisted_3$5 = { class: "flex w-fit flex-col gap-0.5 overflow-hidden" };
const _hoisted_4$5 = { class: "relative flex h-full select-none items-start gap-2 overflow-hidden" };
const _hoisted_5$4 = { key: 0 };
const _hoisted_6$4 = { class: "flex w-fit flex-col text-start overflow-hidden whitespace-nowrap" };
const _hoisted_7$4 = { class: "text-sm font-medium truncate" };
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d;
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      createCommentVNode(" Weekly and Daily Event Template  "),
      $setup.activeView !== "Month" ? (openBlock(), createElementBlock(
        "div",
        mergeProps({
          key: 0,
          class: "event min-h-6 mx-px shadow rounded transition-all duration-75 shrink-0",
          ref: "eventRef"
        }, _ctx.$attrs, {
          class: [
            $setup.opened && "!z-20 drop-shadow-xl",
            $setup.activeEvent == (((_a = $setup.props.event) == null ? void 0 : _a.id) || ((_b = $setup.props.event) == null ? void 0 : _b.name)) && "active"
          ],
          style: [$setup.setEventStyles, $setup.eventBgStyle],
          onDblclick: _cache[0] || (_cache[0] = withModifiers(($event) => $setup.handleEventEdit($event), ["prevent"])),
          onClick: _cache[1] || (_cache[1] = withModifiers(($event) => $setup.handleEventClick($event), ["prevent"]))
        }, toHandlers({
          mousedown: $setup.config.isEditMode && $setup.handleRepositionMouseDown
        }, true)),
        [
          createBaseVNode(
            "div",
            {
              class: normalizeClass(["flex gap-1.5 h-full p-[5px]", $setup.isPastEvent && "past"])
            },
            [
              $setup.props.event.fromTime ? (openBlock(), createElementBlock(
                "div",
                {
                  key: 0,
                  class: "event-border h-full w-[2px] rounded shrink-0",
                  style: normalizeStyle($setup.eventBorderStyle)
                },
                null,
                4
                /* STYLE */
              )) : createCommentVNode("v-if", true),
              createBaseVNode("div", _hoisted_1$5, [
                $setup.config.showIcon && $setup.eventIcons[$setup.props.event.type] ? (openBlock(), createElementBlock("div", _hoisted_2$5, [
                  $setup.eventIcons[$setup.props.event.type] ? (openBlock(), createBlock(resolveDynamicComponent($setup.eventIcons[$setup.props.event.type]), {
                    key: 0,
                    class: "h-4 w-4"
                  })) : createCommentVNode("v-if", true)
                ])) : createCommentVNode("v-if", true),
                createBaseVNode("div", _hoisted_3$5, [
                  createBaseVNode(
                    "p",
                    {
                      ref: "eventTitleRef",
                      class: normalizeClass(["text-sm font-medium event-title", $setup.lineClampClass])
                    },
                    toDisplayString($setup.props.event.title || "(No title)"),
                    3
                    /* TEXT, CLASS */
                  ),
                  !$setup.props.event.isFullDay ? (openBlock(), createElementBlock(
                    "p",
                    {
                      key: 0,
                      ref: "eventTimeRef",
                      class: "text-xs font-normal event-subtitle"
                    },
                    toDisplayString($setup.formattedDuration(
                      $setup.updatedEvent.fromTime,
                      $setup.updatedEvent.toTime,
                      $setup.config.timeFormat
                    )),
                    513
                    /* TEXT, NEED_PATCH */
                  )) : createCommentVNode("v-if", true)
                ])
              ])
            ],
            2
            /* CLASS */
          ),
          $setup.config.isEditMode && !$props.event.isFullDay ? (openBlock(), createElementBlock(
            "div",
            {
              key: 0,
              class: "absolute -bottom-1 h-3 w-full cursor-ns-resize",
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
              class: ["event flex gap-1.5 min-h-6 mx-px rounded p-[5px] transition-all duration-75", [
                $setup.activeEvent == (((_c = $setup.props.event) == null ? void 0 : _c.id) || ((_d = $setup.props.event) == null ? void 0 : _d.name)) && "active",
                $setup.isPastEvent && "past"
              ]],
              ref: "eventRef"
            }, _ctx.$attrs, {
              onDblclick: _cache[2] || (_cache[2] = withModifiers(($event) => $setup.handleEventEdit($event), ["prevent"])),
              onClick: _cache[3] || (_cache[3] = withModifiers(($event) => $setup.handleEventClick($event), ["stop"])),
              style: $setup.eventBgStyle
            }),
            [
              $setup.props.event.fromTime ? (openBlock(), createElementBlock(
                "div",
                {
                  key: 0,
                  class: "event-border w-[2px] rounded shrink-0",
                  style: normalizeStyle($setup.eventBorderStyle)
                },
                null,
                4
                /* STYLE */
              )) : createCommentVNode("v-if", true),
              createBaseVNode("div", _hoisted_4$5, [
                $setup.config.showIcon && $setup.eventIcons[$setup.props.event.type] ? (openBlock(), createElementBlock("div", _hoisted_5$4, [
                  $setup.eventIcons[$setup.props.event.type] ? (openBlock(), createBlock(resolveDynamicComponent($setup.eventIcons[$setup.props.event.type]), {
                    key: 0,
                    class: "h-4 w-4 text-black"
                  })) : createCommentVNode("v-if", true)
                ])) : createCommentVNode("v-if", true),
                createBaseVNode("div", _hoisted_6$4, [
                  createBaseVNode(
                    "p",
                    _hoisted_7$4,
                    toDisplayString($setup.props.event.title || "New Event"),
                    1
                    /* TEXT */
                  )
                ])
              ])
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
_sfc_main$7.__file = "src/components/Calendar/CalendarEvent.vue";
const CalendarEvent = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__scopeId", "data-v-ee68fbdc"], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/CalendarEvent.vue"]]);
const _sfc_main$6 = {
  __name: "ShowMoreCalendarEvent",
  props: {
    events: {
      type: Array,
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
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($props.events.slice(0, 2), (event) => {
          return openBlock(), createBlock($setup["CalendarEvent"], mergeProps({
            key: event.id,
            event,
            date: $props.date,
            class: "mb-1 cursor-pointer",
            ref_for: true
          }, _ctx.$attrs), null, 16, ["event", "date"]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      $props.totalEventsCount > 2 ? (openBlock(), createElementBlock(
        "span",
        {
          key: 0,
          class: "w-fit rounded-sm p-px px-2 mx-px text-base font-medium text-ink-gray-6 hover:cursor-pointer hover:bg-surface-gray-1",
          onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("showMoreEvents"))
        },
        toDisplayString($props.totalEventsCount - 2) + " more ",
        1
        /* TEXT */
      )) : createCommentVNode("v-if", true)
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
_sfc_main$6.__file = "src/components/Calendar/ShowMoreCalendarEvent.vue";
const ShowMoreCalendarEvent = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/ShowMoreCalendarEvent.vue"]]);
const _sfc_main$5 = {
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
    function isCurrentMonth(date) {
      return date.getMonth() === props.currentMonth;
    }
    function isPreviousMonth(date) {
      let previousMonth = false;
      if (date.getMonth() === props.currentMonth - 1) {
        previousMonth = true;
      }
      return previousMonth;
    }
    function isNextMonth(date) {
      let nextMonth = false;
      if (date.getMonth() === props.currentMonth + 1) {
        nextMonth = true;
      }
      return nextMonth;
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
      calendarEvent.fromDate = calendarEvent.date;
      calendarEvent.toDate = calendarEvent.date;
      calendarEvent.fromDateTime = calendarEvent.date + " " + calendarEvent.fromTime;
      calendarEvent.toDateTime = calendarEvent.date + " " + calendarEvent.toTime;
      calendarActions.updateEventState(calendarEvent);
    };
    const __returned__ = { props, emit, timedEvents, maxEventsInCell, isCurrentMonth, isPreviousMonth, isNextMonth, calendarActions, onDragStart, onDrop, get daysList() {
      return daysList;
    }, get parseDate() {
      return parseDate;
    }, get isWeekend() {
      return isWeekend;
    }, inject, CalendarEvent, get useCalendarData() {
      return useCalendarData;
    }, computed, ShowMoreCalendarEvent };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$4 = { class: "flex flex-1 flex-col overflow-scroll" };
const _hoisted_2$4 = { class: "grid w-full grid-cols-7" };
const _hoisted_3$4 = { class: "inline-flex items-center justify-center text-base text-ink-gray-6 h-8" };
const _hoisted_4$4 = ["onDrop", "onClick"];
const _hoisted_5$3 = { class: "flex gap-0.5 w-full flex-col items-center text-xs text-right" };
const _hoisted_6$3 = ["onClick"];
const _hoisted_7$3 = {
  key: 0,
  class: "flex w-full flex-col justify-between"
};
const _hoisted_8$1 = {
  key: 1,
  class: "flex w-full flex-col justify-between"
};
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$4, [
    createCommentVNode(" Day List "),
    createBaseVNode("div", _hoisted_2$4, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($setup.daysList, (day) => {
          return openBlock(), createElementBlock(
            "span",
            _hoisted_3$4,
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
        class: normalizeClass(["grid w-full flex-1 grid-cols-7 border-outline-gray-1", [
          $props.currentMonthDates.length > 35 ? "grid-rows-6" : "grid-rows-5",
          !$props.config.noBorder && "border-[0.5px]"
        ]])
      },
      [
        (openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList($props.currentMonthDates, (date, i) => {
            var _a;
            return openBlock(), createElementBlock("div", {
              class: normalizeClass(["overflow-y-auto", [
                $props.config.noBorder ? "border-l border-t border-0" : "border-[0.5px]",
                $props.config.noBorder && i % 7 === 0 && "border-l-0",
                $setup.isWeekend(date, $props.config) && "bg-surface-gray-1"
              ]]),
              onDragover: _cache[4] || (_cache[4] = withModifiers(() => {
              }, ["prevent"])),
              onDrageneter: _cache[5] || (_cache[5] = withModifiers(() => {
              }, ["prevent"])),
              onDrop: ($event) => $setup.onDrop($event, date),
              onClick: ($event) => $setup.calendarActions.handleCellClick($event, date)
            }, [
              createBaseVNode(
                "div",
                {
                  class: normalizeClass(["flex justify-center font-normal", $setup.isCurrentMonth(date) ? "text-gray-700" : "text-gray-200"])
                },
                [
                  createBaseVNode("div", _hoisted_5$3, [
                    createBaseVNode(
                      "span",
                      {
                        class: normalizeClass(["z-10 w-full flex justify-between items-center", [
                          date.toDateString() === (/* @__PURE__ */ new Date()).toDateString() ? "p-[3px] pb-0.5" : "p-2"
                        ]])
                      },
                      [
                        _cache[6] || (_cache[6] = createBaseVNode(
                          "div",
                          null,
                          null,
                          -1
                          /* HOISTED */
                        )),
                        createBaseVNode("div", {
                          class: normalizeClass(["cursor-pointer", [
                            date.toDateString() === (/* @__PURE__ */ new Date()).toDateString() ? "flex items-center justify-center bg-surface-gray-7 text-ink-white rounded size-[25px]" : "bg-surface-white ",
                            $setup.isCurrentMonth(date) ? "text-ink-gray-6" : "text-ink-gray-4"
                          ]]),
                          onClick: withModifiers(($event) => $setup.isCurrentMonth(date) ? $setup.calendarActions.updateActiveView("Day", date) : $setup.calendarActions.updateActiveView(
                            "Day",
                            date,
                            $setup.isPreviousMonth(date),
                            $setup.isNextMonth(date)
                          ), ["stop"])
                        }, toDisplayString(date.getDate()), 11, _hoisted_6$3)
                      ],
                      2
                      /* CLASS */
                    ),
                    ((_a = $setup.timedEvents[$setup.parseDate(date)]) == null ? void 0 : _a.length) <= $setup.maxEventsInCell ? (openBlock(), createElementBlock("div", _hoisted_7$3, [
                      (openBlock(true), createElementBlock(
                        Fragment,
                        null,
                        renderList($setup.timedEvents[$setup.parseDate(date)], (calendarEvent) => {
                          return openBlock(), createBlock($setup["CalendarEvent"], {
                            event: calendarEvent,
                            date,
                            class: "z-10 mb-2 cursor-pointer",
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
                    ])) : (openBlock(), createElementBlock("div", _hoisted_8$1, [
                      $setup.timedEvents[$setup.parseDate(date)] ? (openBlock(), createBlock($setup["ShowMoreCalendarEvent"], {
                        key: 0,
                        class: "z-10 cursor-pointer",
                        draggable: $props.config.isEditMode,
                        onDragstart: ($event) => $setup.onDragStart($event, $setup.timedEvents[$setup.parseDate(date)][0].id),
                        onDragend: _cache[2] || (_cache[2] = ($event) => $event.target.style.opacity = "1"),
                        onDragover: _cache[3] || (_cache[3] = withModifiers(() => {
                        }, ["prevent"])),
                        events: $setup.timedEvents[$setup.parseDate(date)],
                        date,
                        totalEventsCount: $setup.timedEvents[$setup.parseDate(date)].length,
                        onShowMoreEvents: ($event) => $setup.emit("setCurrentDate", date)
                      }, null, 8, ["draggable", "onDragstart", "events", "date", "totalEventsCount", "onShowMoreEvents"])) : createCommentVNode("v-if", true)
                    ]))
                  ])
                ],
                2
                /* CLASS */
              )
            ], 42, _hoisted_4$4);
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
_sfc_main$5.__file = "src/components/Calendar/CalendarMonthly.vue";
const CalendarMonthly = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/CalendarMonthly.vue"]]);
const _sfc_main$4 = {
  __name: "CalendarTimeMarker",
  props: {
    date: {
      type: [String, Date],
      required: true
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
      let top = (hour * 60 + minutes) * minuteHeight + "px";
      return { top };
    });
    const __returned__ = { props, config, hourHeight, minuteHeight, setCurrentTime, Tooltip: __unplugin_components_0, get dayjs() {
      return dayjs;
    }, computed, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return new Date($props.date).toDateString() === (/* @__PURE__ */ new Date()).toDateString() ? (openBlock(), createElementBlock(
    "div",
    {
      key: 0,
      class: "absolute top-20 z-10 w-full px-px",
      style: normalizeStyle($setup.setCurrentTime)
    },
    [
      createVNode($setup["Tooltip"], {
        text: $setup.dayjs().format("ddd, MMM D, YYYY h:mm a")
      }, {
        default: withCtx(() => _cache[0] || (_cache[0] = [
          createBaseVNode(
            "div",
            { class: "current-time relative h-0.5 bg-[#E03636] rounded" },
            null,
            -1
            /* HOISTED */
          )
        ])),
        _: 1
        /* STABLE */
      }, 8, ["text"])
    ],
    4
    /* STYLE */
  )) : createCommentVNode("v-if", true);
}
_sfc_main$4.__file = "src/components/Calendar/CalendarTimeMarker.vue";
const CalendarTimeMarker = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-d36ad733"], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/CalendarTimeMarker.vue"]]);
const _sfc_main$3 = {
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
    const showCollapsable = ref(false);
    const isCollapsed = ref(true);
    const hourHeight = props.config.hourHeight;
    const minuteHeight = hourHeight / 60;
    const timeArray = props.config.timeFormat == "24h" ? twentyFourHoursFormat : twelveHoursFormat;
    const timedEvents = computed(
      () => useCalendarData(props.events).timedEvents.value
    );
    const fullDayEvents = computed(
      () => useCalendarData(props.events).fullDayEvents.value
    );
    const isToday = (date) => new Date(date).toDateString() === (/* @__PURE__ */ new Date()).toDateString();
    const currentTime = computed(() => {
      let d = /* @__PURE__ */ new Date();
      let hour = d.getHours();
      let minutes = d.getMinutes();
      let top = (hour * 60 + minutes) * minuteHeight + "px";
      return { top };
    });
    const calendarActions = inject("calendarActions");
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
    }
    onMounted(() => {
      setFullDayEventsHeight(fullDayEvents.value, props.weeklyDates);
      const currentHour = (/* @__PURE__ */ new Date()).getHours();
      const scrollToHour = props.config.scrollToHour || currentHour;
      gridRef.value.scrollBy(0, scrollToHour * 60 * minuteHeight - 10);
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
    const __returned__ = { props, gridRef, showCollapsable, isCollapsed, hourHeight, minuteHeight, timeArray, timedEvents, fullDayEvents, isToday, currentTime, calendarActions, getFullDayEventsInCurrentWeek, getFullDayEventsCount, setFullDayEventsHeight, ref, onMounted, watch, computed, inject, CalendarEvent, CalendarTimeMarker, get twelveHoursFormat() {
      return twelveHoursFormat;
    }, get twentyFourHoursFormat() {
      return twentyFourHoursFormat;
    }, get parseDateWithDay() {
      return parseDateWithDay;
    }, get parseDate() {
      return parseDate;
    }, get daysList() {
      return daysList;
    }, get isWeekend() {
      return isWeekend;
    }, get Button() {
      return Button;
    }, get useCalendarData() {
      return useCalendarData;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$3 = { class: "flex flex-1 flex-col overflow-y-auto" };
const _hoisted_2$3 = { class: "flex border-b-[1px]" };
const _hoisted_3$3 = { class: "grid w-full grid-cols-7" };
const _hoisted_4$3 = ["onClick"];
const _hoisted_5$2 = {
  key: 0,
  class: "inline-flex items-center justify-center bg-surface-gray-7 text-ink-white rounded size-[25px]"
};
const _hoisted_6$2 = { class: "flex justify-center items-start py-0.5 w-20 text-base text-ink-gray-6 text-center" };
const _hoisted_7$2 = { class: "grid w-full grid-cols-7 overflow-hidden" };
const _hoisted_8 = ["data-date-attr", "onClick"];
const _hoisted_9 = { class: "flex" };
const _hoisted_10 = { class: "grid w-20 grid-cols-1" };
const _hoisted_11 = { class: "relative flex w-full flex-col" };
const _hoisted_12 = { class: "grid w-full grid-cols-7" };
const _hoisted_13 = ["data-date-attr"];
const _hoisted_14 = ["data-time-attr", "onClick"];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$3, [
    createCommentVNode(" Day List "),
    createBaseVNode("div", _hoisted_2$3, [
      _cache[3] || (_cache[3] = createBaseVNode(
        "div",
        { class: "w-20" },
        null,
        -1
        /* HOISTED */
      )),
      createBaseVNode("div", _hoisted_3$3, [
        (openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList($props.weeklyDates, (date) => {
            return openBlock(), createElementBlock("span", {
              class: "relative flex items-center justify-center gap-1.5 h-8 text-center text-base text-ink-gray-7 cursor-pointer",
              onClick: ($event) => $setup.calendarActions.updateActiveView("Day", date)
            }, [
              createTextVNode(
                toDisplayString($setup.isToday(date) ? $setup.daysList[date.getDay()] : $setup.parseDateWithDay(date)) + " ",
                1
                /* TEXT */
              ),
              $setup.isToday(date) ? (openBlock(), createElementBlock(
                "span",
                _hoisted_5$2,
                toDisplayString(date.getDate()),
                1
                /* TEXT */
              )) : createCommentVNode("v-if", true)
            ], 8, _hoisted_4$3);
          }),
          256
          /* UNKEYED_FRAGMENT */
        ))
      ])
    ]),
    createCommentVNode(" Full day events "),
    createBaseVNode(
      "div",
      {
        class: normalizeClass(["flex shrink-0 h-fit", [$props.config.noBorder ? "border-b-[1px]" : "border-[1px] border-t-0"]])
      },
      [
        createBaseVNode("div", _hoisted_6$2, [
          (openBlock(), createBlock(resolveDynamicComponent($setup.showCollapsable ? $setup.Button : "div"), {
            class: normalizeClass({ "!pl-1.5 pr-1 py-1 !gap-1": $setup.showCollapsable }),
            variant: "ghost",
            iconRight: $setup.showCollapsable ? $setup.isCollapsed ? "chevron-down" : "chevron-up" : "",
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.showCollapsable && ($setup.isCollapsed = !$setup.isCollapsed))
          }, {
            default: withCtx(() => _cache[4] || (_cache[4] = [
              createBaseVNode(
                "div",
                { class: "text-sm text-ink-gray-6 h-[29px] inline-flex items-center" },
                " All day ",
                -1
                /* HOISTED */
              )
            ])),
            _: 1
            /* STABLE */
          }, 8, ["class", "iconRight"]))
        ]),
        createBaseVNode("div", _hoisted_7$2, [
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList($props.weeklyDates, (date, idx) => {
              var _a, _b, _c;
              return openBlock(), createElementBlock("div", {
                class: "cell flex flex-col gap-1 py-1 w-full cursor-pointer",
                "data-date-attr": date,
                onClick: withModifiers(
                  (e) => {
                    var _a2;
                    if (((_a2 = $setup.fullDayEvents[$setup.parseDate(date)]) == null ? void 0 : _a2.length) > 1) {
                      $setup.isCollapsed = false;
                    }
                    $setup.calendarActions.handleCellClick(e, date, "", true);
                  },
                  ["prevent"]
                )
              }, [
                (openBlock(true), createElementBlock(
                  Fragment,
                  null,
                  renderList(!$setup.showCollapsable || !$setup.isCollapsed ? $setup.fullDayEvents[$setup.parseDate(date)] : (_a = $setup.fullDayEvents[$setup.parseDate(date)]) == null ? void 0 : _a.slice(0, 2), (calendarEvent, idx2) => {
                    return openBlock(), createBlock($setup["CalendarEvent"], {
                      class: "w-[90%] cursor-pointer",
                      event: { ...calendarEvent, idx: idx2 },
                      key: calendarEvent.id,
                      date,
                      onClick: _cache[1] || (_cache[1] = withModifiers(() => {
                      }, ["stop"]))
                    }, null, 8, ["event", "date"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )),
                $setup.showCollapsable && $setup.isCollapsed && ((_b = $setup.fullDayEvents[$setup.parseDate(date)]) == null ? void 0 : _b.length) > 2 ? (openBlock(), createBlock($setup["Button"], {
                  key: 0,
                  label: ((_c = $setup.fullDayEvents[$setup.parseDate(date)]) == null ? void 0 : _c.length) - 2 + " more",
                  variant: "ghost",
                  class: "w-fit text-sm !py-0.5 !h-5 !justify-start cursor-pointer",
                  onClick: _cache[2] || (_cache[2] = withModifiers(($event) => $setup.isCollapsed = false, ["stop"]))
                }, null, 8, ["label"])) : createCommentVNode("v-if", true)
              ], 8, _hoisted_8);
            }),
            256
            /* UNKEYED_FRAGMENT */
          ))
        ])
      ],
      2
      /* CLASS */
    ),
    createBaseVNode(
      "div",
      {
        class: normalizeClass(["relative flex h-full flex-col overflow-auto border-outline-gray-1", [$props.config.noBorder ? "" : "border-b-[1px] border-l-[1px]"]]),
        ref: "gridRef"
      },
      [
        createBaseVNode("div", _hoisted_9, [
          createCommentVNode(" Time List form 0 - 24 "),
          createBaseVNode("div", _hoisted_10, [
            (openBlock(), createElementBlock(
              Fragment,
              null,
              renderList(24, (time) => {
                return createBaseVNode(
                  "span",
                  {
                    class: "flex items-end justify-center text-center text-sm font-normal text-ink-gray-5",
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
          createBaseVNode("div", _hoisted_11, [
            createCommentVNode(" time events => not full day events => overflow-scroll here "),
            createBaseVNode(
              "div",
              {
                class: "w-[calc(100%-4px)] h-px z-[2] left-0.5 mt-[0.5px] bg-[#F79596] absolute",
                style: normalizeStyle($setup.currentTime)
              },
              null,
              4
              /* STYLE */
            ),
            createBaseVNode("div", _hoisted_12, [
              createCommentVNode(" 7 Columns "),
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList($props.weeklyDates, (date, idx) => {
                  return openBlock(), createElementBlock("div", {
                    class: normalizeClass(["relative w-full border-outline-gray-1", [
                      idx === 0 && "calendar-column border-l-[1px]",
                      $props.config.noBorder && idx === $props.weeklyDates.length - 1 ? "" : "border-r-[1px]",
                      $setup.isWeekend(date, $props.config) && "bg-surface-gray-1"
                    ]]),
                    "data-date-attr": date
                  }, [
                    createCommentVNode(" Time Grid "),
                    (openBlock(true), createElementBlock(
                      Fragment,
                      null,
                      renderList($setup.timeArray, (time, i) => {
                        return openBlock(), createElementBlock("div", {
                          class: "cell relative flex cursor-pointer text-ink-gray-8",
                          key: time,
                          "data-time-attr": i == 0 ? "" : time,
                          onClick: withModifiers(($event) => $setup.calendarActions.handleCellClick($event, date, time), ["prevent"])
                        }, [
                          createBaseVNode(
                            "div",
                            {
                              class: normalizeClass(["border-outline-gray-1 w-full", i !== $setup.timeArray.length - 1 && "border-b-[1px]"]),
                              style: normalizeStyle({ height: `${$setup.hourHeight}px` })
                            },
                            null,
                            6
                            /* CLASS, STYLE */
                          )
                        ], 8, _hoisted_14);
                      }),
                      128
                      /* KEYED_FRAGMENT */
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
                  ], 10, _hoisted_13);
                }),
                256
                /* UNKEYED_FRAGMENT */
              ))
            ])
          ])
        ])
      ],
      2
      /* CLASS */
    )
  ]);
}
_sfc_main$3.__file = "src/components/Calendar/CalendarWeekly.vue";
const CalendarWeekly = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/CalendarWeekly.vue"]]);
const _sfc_main$2 = {
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
    const showCollapsable = ref(false);
    const isCollapsed = ref(true);
    const dayFullDayEvents = computed(
      () => {
        var _a;
        return ((_a = fullDayEvents.value) == null ? void 0 : _a[parseDate(props.currentDate)]) || [];
      }
    );
    function updateFullDayEventsState() {
      showCollapsable.value = dayFullDayEvents.value.length > 4;
      if (!showCollapsable.value) {
        isCollapsed.value = true;
      }
    }
    watch(dayFullDayEvents, updateFullDayEventsState, { immediate: true });
    const timeArray = props.config.timeFormat == "24h" ? twentyFourHoursFormat : twelveHoursFormat;
    onMounted(() => {
      const currentHour = (/* @__PURE__ */ new Date()).getHours();
      const scrollToHour = props.config.scrollToHour || currentHour;
      gridRef.value.scrollBy(0, scrollToHour * 60 * minuteHeight - 10);
    });
    const calendarActions = inject("calendarActions");
    const __returned__ = { props, timedEvents, fullDayEvents, gridRef, hourHeight, minuteHeight, showCollapsable, isCollapsed, dayFullDayEvents, updateFullDayEventsState, timeArray, calendarActions, computed, inject, onMounted, ref, watch, CalendarEvent, CalendarTimeMarker, get Button() {
      return Button;
    }, get parseDate() {
      return parseDate;
    }, get parseDateWithDay() {
      return parseDateWithDay;
    }, get twelveHoursFormat() {
      return twelveHoursFormat;
    }, get twentyFourHoursFormat() {
      return twentyFourHoursFormat;
    }, get useCalendarData() {
      return useCalendarData;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$2 = { class: "flex flex-col flex-1 overflow-y-auto" };
const _hoisted_2$2 = { class: "flex justify-center items-start pt-[3px] w-20 text-base text-ink-gray-6 text-center" };
const _hoisted_3$2 = ["data-date-attr"];
const _hoisted_4$2 = { class: "h-full overflow-hidden" };
const _hoisted_5$1 = { class: "grid h-full w-20 grid-cols-1" };
const _hoisted_6$1 = { class: "grid h-full w-full grid-cols-1 pb-2" };
const _hoisted_7$1 = ["data-time-attr", "onClick"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$2, [
    createCommentVNode(" Full day events "),
    createBaseVNode(
      "div",
      {
        class: normalizeClass(["flex shrink-0 h-fit", [$props.config.noBorder ? "border-t-[1px]" : "border-[1px] border-b-0"]])
      },
      [
        createBaseVNode("div", _hoisted_2$2, [
          (openBlock(), createBlock(resolveDynamicComponent($setup.showCollapsable ? $setup.Button : "div"), {
            class: normalizeClass({ "!pl-1.5 pr-1 py-1 !gap-1": $setup.showCollapsable }),
            variant: "ghost",
            iconRight: $setup.showCollapsable ? $setup.isCollapsed ? "chevron-down" : "chevron-up" : "",
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.showCollapsable && ($setup.isCollapsed = !$setup.isCollapsed))
          }, {
            default: withCtx(() => _cache[4] || (_cache[4] = [
              createBaseVNode(
                "div",
                { class: "text-sm text-ink-gray-6 h-7 inline-flex items-center" },
                " All day ",
                -1
                /* HOISTED */
              )
            ])),
            _: 1
            /* STABLE */
          }, 8, ["class", "iconRight"]))
        ]),
        createBaseVNode("div", {
          class: "flex flex-wrap gap-1 py-1 w-full overflow-hidden",
          "data-date-attr": $props.currentDate,
          onClick: _cache[3] || (_cache[3] = withModifiers(($event) => $setup.calendarActions.handleCellClick($event, $props.currentDate, "", true), ["prevent"]))
        }, [
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList(!$setup.showCollapsable || !$setup.isCollapsed ? $setup.dayFullDayEvents : $setup.dayFullDayEvents.slice(0, 4), (calendarEvent, idx) => {
              return openBlock(), createBlock($setup["CalendarEvent"], {
                class: "w-[21%] cursor-pointer",
                event: { ...calendarEvent, idx },
                key: calendarEvent.id,
                date: $props.currentDate,
                onClick: _cache[1] || (_cache[1] = withModifiers(() => {
                }, ["stop"]))
              }, null, 8, ["event", "date"]);
            }),
            128
            /* KEYED_FRAGMENT */
          )),
          $setup.showCollapsable && $setup.isCollapsed && $setup.dayFullDayEvents.length > 4 ? (openBlock(), createBlock($setup["Button"], {
            key: 0,
            label: $setup.dayFullDayEvents.length - 4 + " more",
            variant: "ghost",
            class: "w-fit text-sm !h-6 !justify-start cursor-pointer",
            onClick: _cache[2] || (_cache[2] = withModifiers(($event) => $setup.isCollapsed = false, ["stop"]))
          }, null, 8, ["label"])) : createCommentVNode("v-if", true)
        ], 8, _hoisted_3$2)
      ],
      2
      /* CLASS */
    ),
    createBaseVNode("div", _hoisted_4$2, [
      createBaseVNode(
        "div",
        {
          class: normalizeClass(["flex h-full w-full overflow-scroll border-outline-gray-1", [
            $props.config.noBorder ? "border-t-[1px]" : "border-[1px] border-r-0"
          ]]),
          ref: "gridRef"
        },
        [
          createCommentVNode(" Left column "),
          createBaseVNode("div", _hoisted_5$1, [
            (openBlock(), createElementBlock(
              Fragment,
              null,
              renderList(24, (time) => {
                return createBaseVNode(
                  "span",
                  {
                    class: "flex h-[72px] items-end justify-center text-center text-sm font-normal text-ink-gray-5",
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
          createBaseVNode("div", _hoisted_6$1, [
            createBaseVNode(
              "div",
              {
                class: normalizeClass(["calendar-column relative border-l-[1px] border-outline-gray-1", [$props.config.noBorder ? "" : " border-r-[1px]"]])
              },
              [
                createCommentVNode(" Day Grid "),
                (openBlock(true), createElementBlock(
                  Fragment,
                  null,
                  renderList($setup.timeArray, (time, i) => {
                    return openBlock(), createElementBlock("div", {
                      class: "relative flex text-ink-gray-8",
                      key: time,
                      "data-time-attr": i == 0 ? "" : time,
                      onClick: ($event) => $setup.calendarActions.handleCellClick($event, $props.currentDate, time)
                    }, [
                      createBaseVNode(
                        "div",
                        {
                          class: normalizeClass(["w-full border-outline-gray-1", i !== $setup.timeArray.length - 1 && "border-b-[1px]"]),
                          style: normalizeStyle({ height: `${$setup.hourHeight}px` })
                        },
                        null,
                        6
                        /* CLASS, STYLE */
                      )
                    ], 8, _hoisted_7$1);
                  }),
                  128
                  /* KEYED_FRAGMENT */
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
                createVNode($setup["CalendarTimeMarker"], { date: $props.currentDate }, null, 8, ["date"])
              ],
              2
              /* CLASS */
            )
          ])
        ],
        2
        /* CLASS */
      )
    ])
  ]);
}
_sfc_main$2.__file = "src/components/Calendar/CalendarDaily.vue";
const CalendarDaily = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/CalendarDaily.vue"]]);
function useEventModal() {
  const showEventModal = ref(false);
  const newEvent = reactive({
    date: "",
    participant: "",
    fromDate: "",
    toDate: "",
    fromTime: "",
    toTime: "",
    venue: "",
    title: "",
    isFullDay: false
  });
  function openNewEventModal(e, view, date, isEditMode, fromTime = "", isFullDay = false) {
    if (!isEditMode) return;
    date = view === "Week" ? e.target.parentNode.parentNode.getAttribute("data-date-attr") : date;
    newEvent.date = parseDate(new Date(date));
    newEvent.fromDate = date;
    newEvent.toDate = date;
    newEvent.isFullDay = isFullDay;
    if (view === "Month") {
      showEventModal.value = true;
      return;
    }
    let toTime = convertMinutesToHours(calculateMinutes(fromTime) + 60).slice(
      0,
      -3
    );
    newEvent.fromTime = fromTime;
    newEvent.toTime = toTime;
    showEventModal.value = true;
  }
  return { showEventModal, newEvent, openNewEventModal };
}
const _sfc_main$1 = {
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
    onClick: {
      type: Function,
      required: false
    },
    onDblClick: {
      type: Function,
      required: false
    },
    onCellClick: {
      type: Function,
      required: false
    }
  },
  emits: ["create", "update", "delete", "rangeChange"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const defaultConfig = {
      scrollToHour: 15,
      disableModes: [],
      defaultMode: "Month",
      isEditMode: false,
      eventIcons: {},
      hourHeight: 50,
      enableShortcuts: true,
      showIcon: true,
      timeFormat: "12h",
      weekends: ["sunday"]
    };
    const overrideConfig = { ...defaultConfig, ...props.config };
    let activeView = ref(overrideConfig.defaultMode);
    function updateActiveView(value, d, isPreviousMonth, isNextMonth) {
      activeView.value = value;
      if (value == "Day" && d) {
        date.value = findIndexOfDate(d);
        isPreviousMonth && decrementMonth();
        isNextMonth && incrementMonth();
      }
    }
    const selectedMonthDate = ref(dayjs().format("YYYY-MM-DD"));
    function onMonthYearChange(val = "") {
      const d = dayjs(val);
      selectedMonthDate.value = d.format("YYYY-MM-DD");
      setCalendarDate(selectedMonthDate.value);
    }
    function syncSelectedMonth(year, month) {
      if (typeof year === "number" && typeof month === "number") {
        const currentDay = dayjs(selectedMonthDate.value).date();
        let tentative = dayjs(
          `${year}-${String(month + 1).padStart(2, "0")}-01`
        ).date(currentDay);
        if (tentative.month() !== month) {
          tentative = tentative.startOf("month").month(month).endOf("month");
        }
        selectedMonthDate.value = tentative.format("YYYY-MM-DD");
      }
    }
    onMounted(() => {
      if (!overrideConfig.enableShortcuts) return;
      window.addEventListener("keydown", handleShortcuts);
    });
    onUnmounted(() => {
      window.removeEventListener("keydown", handleShortcuts);
    });
    function handleShortcuts(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) {
        return;
      }
      if (e.key.toLowerCase() === "m") {
        activeView.value = "Month";
      }
      if (e.key.toLowerCase() === "w") {
        activeView.value = "Week";
      }
      if (e.key.toLowerCase() === "d") {
        activeView.value = "Day";
      }
      if (e.key.toLowerCase() === "t") {
        setCalendarDate();
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
      var _a;
      return ((_a = props.events) == null ? void 0 : _a.map((event) => {
        const { fromDate, toDate, fromTime, toTime, ...rest } = event;
        const date2 = fromDate;
        const fromDateTime = fromDate + " " + fromTime;
        const toDateTime = toDate + " " + toTime;
        return {
          ...rest,
          date: date2,
          fromDateTime,
          toDateTime,
          fromDate,
          toDate,
          fromTime,
          toTime
        };
      })) || [];
    });
    const events = ref(parseEvents.value);
    watch(
      () => props.events,
      () => reloadEvents(),
      { deep: true }
    );
    function reloadEvents() {
      events.value = parseEvents.value;
    }
    events.value.forEach((event) => {
      if (!event.fromTime || !event.toTime) return;
      event.fromTime = handleSeconds(event.fromTime);
      event.toTime = handleSeconds(event.toTime);
    });
    const { showEventModal, newEvent, openNewEventModal } = useEventModal();
    provide("calendarActions", {
      createNewEvent,
      updateEventState,
      deleteEvent,
      handleCellClick,
      updateActiveView,
      props
    });
    function createNewEvent(event) {
      events.value.push(event);
      event.fromDateTime = event.fromDate + " " + event.fromTime;
      event.toDateTime = event.toDate + " " + event.toTime;
      emit("create", event);
    }
    function updateEventState(event) {
      const eventID = event.id;
      let eventIndex = events.value.findIndex((e) => e.id === eventID);
      event.fromDateTime = event.fromDate + " " + event.fromTime;
      event.toDateTime = event.toDate + " " + event.toTime;
      events.value[eventIndex] = event;
      emit("update", event);
    }
    function deleteEvent(eventID) {
      const eventIndex = events.value.findIndex((event) => event.id === eventID);
      events.value.splice(eventIndex, 1);
      emit("delete", eventID);
    }
    function openModal(data) {
      const { e, view, date: date2, time, isFullDay } = data;
      const config = overrideConfig.isEditMode;
      openNewEventModal(e, view, date2, config, time, isFullDay);
    }
    function handleCellClick(e, date2, time = "", isFullDay = false) {
      const data = {
        e,
        view: activeView.value,
        date: date2,
        time,
        isFullDay
      };
      if (props.onCellClick) {
        props.onCellClick(data);
        return;
      }
      openModal(data);
    }
    const actionOptions = [
      { label: "Day", value: "Day", iconLeft: DayIcon },
      { label: "Week", value: "Week", iconLeft: WeekIcon },
      { label: "Month", value: "Month", iconLeft: MonthIcon }
    ];
    let enabledModes = actionOptions.filter(
      (mode) => !overrideConfig.disableModes.includes(mode.value)
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
    function increment() {
      incrementClickEvents[activeView.value]();
      syncSelectedMonth(currentYear.value, currentMonth.value);
    }
    function decrement() {
      decrementClickEvents[activeView.value]();
      syncSelectedMonth(currentYear.value, currentMonth.value);
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
      if (currentMonth.value > 11) {
        currentMonth.value = 0;
        currentYear.value++;
      }
      date.value = findFirstDateOfMonth(currentMonth.value, currentYear.value);
      week.value = findCurrentWeek(currentMonthDates.value[date.value]);
    }
    function decrementMonth() {
      if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
      } else {
        currentMonth.value--;
      }
      date.value = findLastDateOfMonth(currentMonth.value, currentYear.value);
      week.value = findCurrentWeek(currentMonthDates.value[date.value]);
    }
    function incrementWeek() {
      const nextWeek = week.value + 1;
      if (nextWeek < datesInWeeks.value.length) {
        week.value = nextWeek;
        const weekDates = datesInWeeks.value[week.value];
        const spansNextMonth = weekDates.some(
          (d) => d.getMonth() !== currentMonth.value
        );
        if (spansNextMonth) {
          incrementMonth();
          week.value = 0;
          const firstWeekDates2 = datesInWeeks.value[0];
          const day3 = firstInMonth(firstWeekDates2, currentMonth.value);
          date.value = findIndexOfDate(day3);
          return;
        }
        const day2 = firstInMonth(weekDates, currentMonth.value);
        date.value = findIndexOfDate(day2);
        return;
      }
      incrementMonth();
      week.value = 0;
      const firstWeekDates = datesInWeeks.value[0];
      const day = firstInMonth(firstWeekDates, currentMonth.value);
      date.value = findIndexOfDate(day);
    }
    function decrementWeek() {
      const prevWeek = week.value - 1;
      if (prevWeek >= 0) {
        week.value = prevWeek;
        const weekDates = datesInWeeks.value[week.value];
        const spansPrevMonth = weekDates.some(
          (d) => d.getMonth() !== currentMonth.value
        );
        if (spansPrevMonth) {
          decrementMonth();
          week.value = datesInWeeks.value.length - 1;
          const targetWeekDates2 = datesInWeeks.value[week.value];
          const day3 = firstInMonth(targetWeekDates2, currentMonth.value);
          date.value = findIndexOfDate(day3);
          return;
        }
        const day2 = firstInMonth(weekDates, currentMonth.value);
        date.value = findIndexOfDate(day2);
        return;
      }
      decrementMonth();
      let targetIndex = datesInWeeks.value.length - 1;
      const lastWeekDates = datesInWeeks.value[targetIndex];
      const hasNextMonthDates = lastWeekDates.some(
        (d) => d.getMonth() !== currentMonth.value
      );
      if (hasNextMonthDates && targetIndex > 0) {
        targetIndex = targetIndex - 1;
      }
      week.value = targetIndex;
      const targetWeekDates = datesInWeeks.value[week.value];
      const day = firstInMonth(targetWeekDates, currentMonth.value);
      date.value = findIndexOfDate(day);
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
    function firstInMonth(weekDates, month) {
      return weekDates.find((d) => d.getMonth() === month) || weekDates[0];
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
      if (activeView.value === "Day") {
        const dayDate = currentMonthDates.value[date.value];
        if (dayDate) {
          return dayjs(dayDate).format("ddd, D MMM YYYY");
        }
      }
      if (activeView.value !== "Week")
        return formatMonthYear(currentMonth.value, currentYear.value);
      const weekDates = datesInWeeks.value[week.value] || [];
      if (!weekDates.length)
        return formatMonthYear(currentMonth.value, currentYear.value);
      const parts = getWeekMonthParts(weekDates);
      if (parts.length === 1) return formatMonthYear(parts[0].month, parts[0].year);
      const short = monthList.map((m) => m.slice(0, 3));
      const first = parts[0];
      const last = parts[parts.length - 1];
      return first.year === last.year ? `${short[first.month]} - ${short[last.month]} ${first.year}` : `${short[first.month]} ${first.year} - ${short[last.month]} ${last.year}`;
    });
    function isCurrentMonthDate(date2) {
      date2 = new Date(date2);
      return date2.getMonth() === currentMonth.value;
    }
    function setCalendarDate(d) {
      const dt = d ? new Date(d) : /* @__PURE__ */ new Date();
      if (dt.toString() === "Invalid Date") return;
      currentYear.value = dt.getFullYear();
      currentMonth.value = dt.getMonth();
      currentDate.value = dt;
      nextTick(() => {
        week.value = findCurrentWeek(dt);
        const idx = findIndexOfDate(dt);
        if (idx >= 0) {
          date.value = idx;
        } else {
          date.value = findFirstDateOfMonth(currentMonth.value, currentYear.value);
        }
      });
    }
    function getVisibleRange() {
      const toDateString = (date2) => date2 ? dayjs(date2).format("YYYY-MM-DD") : "";
      if (activeView.value === "Day") {
        const day = selectedDay.value;
        if (!day) return null;
        const start2 = dayjs(day).startOf("day");
        const end2 = dayjs(day).endOf("day");
        return {
          startDate: toDateString(start2),
          endDate: toDateString(end2)
        };
      }
      if (activeView.value === "Week") {
        const weekDates = datesInWeeks.value[week.value] || [];
        if (!weekDates.length) return null;
        const orderedWeek = [...weekDates].sort((a, b) => a - b);
        const start2 = dayjs(orderedWeek[0]).startOf("day");
        const end2 = dayjs(orderedWeek[orderedWeek.length - 1]).endOf("day");
        return {
          startDate: toDateString(start2),
          endDate: toDateString(end2)
        };
      }
      const start = dayjs(
        new Date(currentYear.value, currentMonth.value, 1)
      ).startOf("day");
      const end = dayjs(
        new Date(currentYear.value, currentMonth.value + 1, 0)
      ).endOf("day");
      return {
        startDate: toDateString(start),
        endDate: toDateString(end)
      };
    }
    let lastRangeKey = "";
    watch(
      () => {
        const range = getVisibleRange();
        if (!range) return null;
        return {
          view: activeView.value,
          ...range
        };
      },
      (payload) => {
        if (!payload) return;
        const key = `${payload.view}-${payload.startDate}-${payload.endDate}`;
        if (key === lastRangeKey) return;
        lastRangeKey = key;
        emit("rangeChange", payload);
      },
      { immediate: true }
    );
    __expose({
      reloadEvents,
      currentMonthYear,
      currentYear,
      currentMonth,
      enabledModes,
      activeView,
      decrement,
      increment,
      updateActiveView,
      setCalendarDate,
      onMonthYearChange,
      selectedMonthDate
    });
    const __returned__ = { props, emit, defaultConfig, overrideConfig, get activeView() {
      return activeView;
    }, set activeView(v) {
      activeView = v;
    }, updateActiveView, selectedMonthDate, onMonthYearChange, syncSelectedMonth, handleShortcuts, parseEvents, events, reloadEvents, showEventModal, newEvent, openNewEventModal, createNewEvent, updateEventState, deleteEvent, openModal, handleCellClick, actionOptions, get enabledModes() {
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
    }, updateCurrentDate, increment, decrement, incrementClickEvents, decrementClickEvents, incrementMonth, decrementMonth, incrementWeek, decrementWeek, incrementDay, decrementDay, firstInMonth, findLastDateOfMonth, findFirstDateOfMonth, findIndexOfDate, currentMonthYear, isCurrentMonthDate, setCalendarDate, getVisibleRange, get lastRangeKey() {
      return lastRangeKey;
    }, set lastRangeKey(v) {
      lastRangeKey = v;
    }, computed, onMounted, onUnmounted, provide, ref, watch, nextTick, get Button() {
      return Button;
    }, get TabButtons() {
      return TabButtons;
    }, get getCalendarDates() {
      return getCalendarDates;
    }, get monthList() {
      return monthList;
    }, get handleSeconds() {
      return handleSeconds;
    }, get formatMonthYear() {
      return formatMonthYear;
    }, get getWeekMonthParts() {
      return getWeekMonthParts;
    }, get dayjs() {
      return dayjs;
    }, DayIcon, WeekIcon, MonthIcon, DatePicker, CalendarMonthly, CalendarWeekly, CalendarDaily, NewEventModal, get useEventModal() {
      return useEventModal;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$1 = { class: "flex h-full flex-col overflow-hidden" };
const _hoisted_2$1 = { class: "mb-2 flex justify-between" };
const _hoisted_3$1 = { class: "flex items-center" };
const _hoisted_4$1 = { class: "flex gap-x-1" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    renderSlot(_ctx.$slots, "header", normalizeProps(guardReactiveProps({
      currentMonthYear: $setup.currentMonthYear,
      currentYear: $setup.currentYear,
      currentMonth: $setup.currentMonth,
      enabledModes: $setup.enabledModes,
      activeView: $setup.activeView,
      decrement: $setup.decrement,
      increment: $setup.increment,
      updateActiveView: $setup.updateActiveView,
      setCalendarDate: $setup.setCalendarDate,
      onMonthYearChange: $setup.onMonthYearChange,
      selectedMonthDate: $setup.selectedMonthDate
    })), () => [
      createBaseVNode("div", _hoisted_2$1, [
        createCommentVNode(" left side  "),
        createCommentVNode(" Year, Month "),
        createBaseVNode("div", _hoisted_3$1, [
          createVNode($setup["DatePicker"], {
            modelValue: $setup.selectedMonthDate,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = (val) => $setup.onMonthYearChange(val)),
            clearable: false
          }, {
            target: withCtx(({ togglePopover }) => [
              createVNode($setup["Button"], {
                variant: "ghost",
                class: "text-lg font-medium text-ink-gray-7",
                label: $setup.currentMonthYear,
                iconRight: "chevron-down",
                onClick: togglePopover
              }, null, 8, ["label", "onClick"])
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue"])
        ]),
        createCommentVNode(" right side "),
        createCommentVNode(" actions buttons for calendar "),
        createBaseVNode("div", _hoisted_4$1, [
          createCommentVNode(" Increment and Decrement Button"),
          createVNode($setup["Button"], {
            onClick: $setup.decrement,
            variant: "ghost",
            icon: "chevron-left"
          }),
          createVNode($setup["Button"], {
            label: "Today",
            onClick: _cache[1] || (_cache[1] = ($event) => $setup.setCalendarDate()),
            variant: "ghost"
          }),
          createVNode($setup["Button"], {
            onClick: $setup.increment,
            variant: "ghost",
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
    }, {
      header: withCtx(({ parseDateWithDay: parseDateWithDay2, currentDate, fullDay }) => [
        renderSlot(_ctx.$slots, "daily-header", normalizeProps(guardReactiveProps({ parseDateWithDay: parseDateWithDay2, currentDate, fullDay })))
      ]),
      _: 3
      /* FORWARDED */
    }, 8, ["events", "current-date"])) : createCommentVNode("v-if", true),
    $setup.showEventModal ? (openBlock(), createBlock($setup["NewEventModal"], {
      key: 3,
      modelValue: $setup.showEventModal,
      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.showEventModal = $event),
      event: $setup.newEvent
    }, null, 8, ["modelValue", "event"])) : createCommentVNode("v-if", true)
  ]);
}
_sfc_main$1.__file = "src/components/Calendar/Calendar.vue";
const Calendar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/Calendar.vue"]]);
const _sfc_main = {
  __name: "Calendar.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const config = {
      defaultMode: "Month",
      isEditMode: true,
      eventIcons: {},
      allowCustomClickEvents: true,
      enableShortcuts: false
    };
    function getCurrentMonthYear() {
      const date = /* @__PURE__ */ new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${year}-${month}`;
    }
    const currentMonthYear = getCurrentMonthYear();
    const events = ref([
      {
        title: "English by Ryan Mathew",
        participant: "Ryan Mathew",
        id: "EDU-CSH-2024-00091",
        venue: "CNF-ROOM-2024-00001",
        fromDate: currentMonthYear + "-02",
        //can be a date object
        toDate: currentMonthYear + "-02",
        fromTime: "16:30",
        toTime: "17:30",
        color: "violet"
      },
      {
        title: "English by Ryan Mathew",
        participant: "Ryan Mathew",
        id: "EDU-CSH-2024-00092",
        venue: "CNF-ROOM-2024-00002",
        fromDate: currentMonthYear + "-04",
        toDate: currentMonthYear + "-04",
        fromTime: "13:30",
        toTime: "17:30",
        color: "green"
      },
      {
        title: "English by Sheldon",
        participant: "Sheldon",
        id: "EDU-CSH-2024-00093",
        venue: "CNF-ROOM-2024-00001",
        fromDate: currentMonthYear + "-16",
        toDate: currentMonthYear + "-16",
        fromTime: "10:30",
        toTime: "11:30",
        color: "blue"
      },
      {
        title: "English by Ryan Mathew",
        participant: "Ryan Mathew",
        id: "EDU-CSH-2024-00094",
        venue: "CNF-ROOM-2024-00001",
        fromDate: currentMonthYear + "-21",
        toDate: currentMonthYear + "-21",
        fromTime: "16:30",
        toTime: "17:30",
        color: "red"
      },
      {
        title: "Google Meet with John ",
        participant: "John",
        id: "#htrht41",
        venue: "Google Meet",
        fromDate: currentMonthYear + "-11",
        toDate: currentMonthYear + "-11",
        fromTime: "00:00",
        toTime: "02:00",
        color: "amber",
        isFullDay: true
      },
      {
        title: "Zoom Meet with Sheldon",
        participant: "Sheldon",
        id: "#htrht42",
        venue: "Google Meet",
        fromDate: currentMonthYear + "-07",
        toDate: currentMonthYear + "-07",
        fromTime: "00:00",
        toTime: "02:00",
        color: "amber",
        isFullDay: true
      }
    ]);
    const __returned__ = { config, getCurrentMonthYear, currentMonthYear, events, ref, Calendar, get Select() {
      return Select;
    }, DatePicker, get Button() {
      return Button;
    }, get logEvent() {
      return logEvent;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1 = { class: "flex h-screen flex-col overflow-hidden p-5" };
const _hoisted_2 = { class: "flex h-screen flex-col overflow-hidden p-5" };
const _hoisted_3 = { class: "mb-2 flex items-center justify-between gap-3" };
const _hoisted_4 = { class: "flex items-center gap-2" };
const _hoisted_5 = { class: "flex items-center gap-2" };
const _hoisted_6 = { class: "" };
const _hoisted_7 = { class: "flex h-screen flex-col overflow-hidden p-5" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: "100%" } }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "default" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["Calendar"], {
              config: $setup.config,
              events: $setup.events,
              onCreate: _cache[0] || (_cache[0] = (event) => $setup.logEvent("createEvent", event)),
              onUpdate: _cache[1] || (_cache[1] = (event) => $setup.logEvent("updateEvent", event)),
              onDelete: _cache[2] || (_cache[2] = (eventID) => $setup.logEvent("deleteEvent", eventID))
            }, null, 8, ["events"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "custom-header" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_2, [
            createVNode($setup["Calendar"], {
              config: $setup.config,
              events: $setup.events,
              onCreate: _cache[3] || (_cache[3] = (event) => $setup.logEvent("createEvent", event)),
              onUpdate: _cache[4] || (_cache[4] = (event) => $setup.logEvent("updateEvent", event)),
              onDelete: _cache[5] || (_cache[5] = (eventID) => $setup.logEvent("deleteEvent", eventID))
            }, {
              header: withCtx((headerProps) => [
                createCommentVNode(" Custom header demonstrating full control over layout while keeping design aligned "),
                createBaseVNode("div", _hoisted_3, [
                  createCommentVNode(" Left cluster: date picker + nav + title "),
                  createBaseVNode("div", _hoisted_4, [
                    createVNode($setup["DatePicker"], {
                      modelValue: headerProps.selectedMonthDate,
                      "onUpdate:modelValue": (val) => headerProps.onMonthYearChange(val),
                      clearable: false
                    }, {
                      target: withCtx(({ togglePopover }) => [
                        createVNode($setup["Button"], {
                          variant: "ghost",
                          class: "text-lg font-medium text-ink-gray-7",
                          label: headerProps.currentMonthYear,
                          iconRight: "chevron-down",
                          onClick: togglePopover
                        }, null, 8, ["label", "onClick"])
                      ]),
                      _: 2
                      /* DYNAMIC */
                    }, 1032, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createCommentVNode(" Right cluster: view mode select "),
                  createBaseVNode("div", _hoisted_5, [
                    createVNode($setup["Button"], {
                      variant: "ghost",
                      icon: "chevron-left",
                      onClick: headerProps.decrement
                    }, null, 8, ["onClick"]),
                    createVNode($setup["Button"], {
                      label: "Today",
                      variant: "ghost",
                      onClick: ($event) => headerProps.setCalendarDate()
                    }, null, 8, ["onClick"]),
                    createVNode($setup["Button"], {
                      variant: "ghost",
                      icon: "chevron-right",
                      onClick: headerProps.increment
                    }, null, 8, ["onClick"])
                  ]),
                  createBaseVNode("div", _hoisted_6, [
                    createVNode($setup["Select"], {
                      class: "!w-20",
                      size: "sm",
                      variant: "ghost",
                      options: headerProps.enabledModes,
                      modelValue: headerProps.activeView,
                      "onUpdate:modelValue": (v) => headerProps.updateActiveView(v)
                    }, null, 8, ["options", "modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ]),
              _: 1
              /* STABLE */
            }, 8, ["events"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "custom-click-events" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_7, [
            createVNode($setup["Calendar"], {
              config: $setup.config,
              events: $setup.events,
              onClick: (event) => $setup.logEvent("onClick", event),
              onDblClick: (event) => $setup.logEvent("onDblClick", event),
              onCellClick: (data) => $setup.logEvent("onCellClick", data)
            }, null, 8, ["events", "onClick", "onDblClick", "onCellClick"])
          ])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Calendar/Calendar.story.vue";
const Calendar_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar/Calendar.story.vue"]]);
export {
  Calendar_story as default
};
