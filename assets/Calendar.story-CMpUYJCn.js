import { az as ref, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aF as createBaseVNode, aH as createCommentVNode } from "./vendor-DBifjAOG.js";
import { C as Calendar } from "./Calendar-DwLAH31N.js";
import { S as Select } from "./Select-BoYEnLk5.js";
import { D as DatePicker } from "./DatePicker-DyI-6_Zz.js";
import { B as Button } from "./Button-D5TvV9Gh.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./TabButtons-Df2mV-WA.js";
import "./FeatherIcon-Wmu1TLct.js";
import "./dayjs-PBW4btL-.js";
import "./Dialog-BZs9Q_RZ.js";
import "./FormControl-k2bBSPHV.js";
import "./useId-DJabvbK8.js";
import "./TextInput-BToXGlmY.js";
import "./debounce-CRCtzhPg.js";
import "./Textarea-BnV_RuZB.js";
import "./Checkbox-Cj0eIozS.js";
import "./Autocomplete-DwtwZ628.js";
import "./Popover-CzA9YWcp.js";
import "./ErrorMessage-D_JwCCeS.js";
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
              onCreate: _cache[0] || (_cache[0] = (event) => _ctx.logEvent("createEvent", event)),
              onUpdate: _cache[1] || (_cache[1] = (event) => _ctx.logEvent("updateEvent", event)),
              onDelete: _cache[2] || (_cache[2] = (eventID) => _ctx.logEvent("deleteEvent", eventID))
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
              onCreate: _cache[3] || (_cache[3] = (event) => _ctx.logEvent("createEvent", event)),
              onUpdate: _cache[4] || (_cache[4] = (event) => _ctx.logEvent("updateEvent", event)),
              onDelete: _cache[5] || (_cache[5] = (eventID) => _ctx.logEvent("deleteEvent", eventID))
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
              onClick: (event) => _ctx.logEvent("onClick", event),
              onDblClick: (event) => _ctx.logEvent("onDblClick", event),
              onCellClick: (data) => _ctx.logEvent("onCellClick", data)
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
