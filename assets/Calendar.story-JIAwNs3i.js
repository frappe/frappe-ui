import { az as ref, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aO as logEvent, aE as createVNode, aF as createBaseVNode, aN as toDisplayString } from "./vendor-BP1AGND6.js";
import { C as Calendar } from "./Calendar-BHIi-OIE.js";
import { T as TabButtons } from "./TabButtons-BpqGjBNz.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Button-zBOSESzj.js";
import "./FeatherIcon-BzgW0hzY.js";
import "./dayjs-CFHY1ZhP.js";
import "./Dialog-BuPj01EH.js";
import "./FormControl-CirdNY3a.js";
import "./Checkbox-D4r0RsLI.js";
import "./TextInput-CmbGdYYw.js";
import "./debounce-CRCtzhPg.js";
import "./Select-Bl5pqpM3.js";
import "./Textarea-NlPXJbhn.js";
import "./Autocomplete-DyS_Dh_p.js";
import "./Popover-9KC61xfK.js";
import "./ErrorMessage-OwkvjpmT.js";
const _sfc_main = {
  __name: "Calendar.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const config = {
      defaultMode: "Month",
      isEditMode: true,
      eventIcons: {},
      allowCustomClickEvents: true,
      redundantCellHeight: 100,
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
        fromDate: currentMonthYear + "-02 16:30:00",
        //can be a date object
        toDate: currentMonthYear + "-02 17:30:00",
        color: "violet"
      },
      {
        title: "English by Ryan Mathew",
        participant: "Ryan Mathew",
        id: "EDU-CSH-2024-00092",
        venue: "CNF-ROOM-2024-00002",
        fromDate: currentMonthYear + "-04 13:30:00",
        toDate: currentMonthYear + "-04 17:30:00",
        color: "green"
      },
      {
        title: "English by Sheldon",
        participant: "Sheldon",
        id: "EDU-CSH-2024-00093",
        venue: "CNF-ROOM-2024-00001",
        fromDate: currentMonthYear + "-16 10:30:00",
        toDate: currentMonthYear + "-16 11:30:00",
        color: "blue"
      },
      {
        title: "English by Ryan Mathew",
        participant: "Ryan Mathew",
        id: "EDU-CSH-2024-00094",
        venue: "CNF-ROOM-2024-00001",
        fromDate: currentMonthYear + "-21 16:30:00",
        toDate: currentMonthYear + "-21 17:30:00",
        color: "red"
      },
      {
        title: "Google Meet with John ",
        participant: "John",
        id: "#htrht41",
        venue: "Google Meet",
        fromDate: currentMonthYear + "-11 00:00:00",
        toDate: currentMonthYear + "-11 23:59:59",
        color: "amber",
        isFullDay: true
      },
      {
        title: "Zoom Meet with Sheldon",
        participant: "Sheldon",
        id: "#htrht42",
        venue: "Google Meet",
        fromDate: currentMonthYear + "-07 00:00:00",
        toDate: currentMonthYear + "-07 23:59:59",
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
              onCellDblClick: (data) => $setup.logEvent("onCellDblClick", data)
            }, null, 8, ["events", "onClick", "onDblClick", "onCellDblClick"])
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
