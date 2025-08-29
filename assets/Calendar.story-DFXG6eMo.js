import { az as ref, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aO as logEvent, aE as createVNode, aF as createBaseVNode, aN as toDisplayString } from "./vendor-Dk0c65vB.js";
import { C as Calendar } from "./Calendar-CTMwfaNG.js";
import { T as TabButtons } from "./TabButtons-Bd5Ho3RO.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Button-CLC7qZNJ.js";
import "./FeatherIcon-DBjVIOGs.js";
import "./dayjs-CcJYGp7u.js";
import "./Popover-BMBT1KJZ.js";
import "./Dialog-BExLj_74.js";
import "./FormControl-BJFHM5NO.js";
import "./Checkbox-Dlnwj1Dc.js";
import "./TextInput-B7BOT4fb.js";
import "./debounce-CRCtzhPg.js";
import "./Select-DdaP9TXq.js";
import "./Textarea-DgNRQxgR.js";
import "./Autocomplete-3pb3DAv6.js";
import "./ErrorMessage-By7PG3gO.js";
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
    const __returned__ = { config, getCurrentMonthYear, currentMonthYear, events, ref, Calendar, get logEvent() {
      return logEvent;
    }, get TabButtons() {
      return TabButtons;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1 = { class: "flex h-screen flex-col overflow-hidden p-5" };
const _hoisted_2 = { class: "flex h-screen flex-col overflow-hidden p-5" };
const _hoisted_3 = ["onClick"];
const _hoisted_4 = ["onClick"];
const _hoisted_5 = { class: "flex h-screen flex-col overflow-hidden p-5" };
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
              header: withCtx(({
                currentMonthYear,
                enabledModes,
                activeView,
                decrement,
                increment,
                updateActiveView
              }) => [
                createVNode($setup["TabButtons"], {
                  buttons: enabledModes,
                  class: "ml-2",
                  modelValue: activeView,
                  "onUpdate:modelValue": ($event) => updateActiveView($event)
                }, null, 8, ["buttons", "modelValue", "onUpdate:modelValue"]),
                createBaseVNode("button", { onClick: decrement }, "Previous", 8, _hoisted_3),
                createBaseVNode("button", { onClick: increment }, "Next", 8, _hoisted_4),
                createBaseVNode(
                  "h1",
                  null,
                  toDisplayString(currentMonthYear),
                  1
                  /* TEXT */
                )
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
          createBaseVNode("div", _hoisted_5, [
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
