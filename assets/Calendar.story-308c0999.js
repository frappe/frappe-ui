import { az as ref, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aO as logEvent, aE as createVNode, aF as createBaseVNode, aN as toDisplayString } from "./vendor-e88d1662.js";
import { C as Calendar } from "./Calendar-0d22e329.js";
import { T as TabButtons } from "./TabButtons-e488cd1c.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
import "./Button-992731ef.js";
import "./FeatherIcon-69703505.js";
import "./Dialog-019c142a.js";
import "./FormControl-aa196c3f.js";
import "./Checkbox-a9a36550.js";
import "./TextInput-7dab3a3b.js";
import "./debounce-d11286cd.js";
import "./Select-f64a6a0d.js";
import "./Textarea-52e867af.js";
import "./Autocomplete-b9abfdc4.js";
import "./Popover-f6af0041.js";
import "./ErrorMessage-0369058a.js";
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
    const events = ref([
      {
        title: "English by Ryan Mathew",
        participant: "Ryan Mathew",
        id: "EDU-CSH-2024-00091",
        venue: "CNF-ROOM-2024-00001",
        fromDate: "2024-10-08 16:30:00",
        //can be a date object
        toDate: "2024-10-08 17:30:00",
        color: "violet"
      },
      {
        title: "English by Ryan Mathew",
        participant: "Ryan Mathew",
        id: "EDU-CSH-2024-00092",
        venue: "CNF-ROOM-2024-00002",
        fromDate: "2024-10-08 13:30:00",
        toDate: "2024-10-08 17:30:00",
        color: "green"
      },
      {
        title: "English by Sheldon",
        participant: "Sheldon",
        id: "EDU-CSH-2024-00093",
        venue: "CNF-ROOM-2024-00001",
        fromDate: "2024-10-09 10:30:00",
        toDate: "2024-10-09 11:30:00",
        color: "blue"
      },
      {
        title: "English by Ryan Mathew",
        participant: "Ryan Mathew",
        id: "EDU-CSH-2024-00094",
        venue: "CNF-ROOM-2024-00001",
        fromDate: "2024-10-17 16:30:00",
        toDate: "2024-10-17 17:30:00",
        color: "red"
      },
      {
        title: "Google Meet with John ",
        participant: "John",
        id: "#htrht41",
        venue: "Google Meet",
        fromDate: "2024-10-21 00:00:00",
        toDate: "2024-10-21 23:59:59",
        color: "amber",
        isFullDay: true
      },
      {
        title: "Zoom Meet with Sheldon",
        participant: "Sheldon",
        id: "#htrht42",
        venue: "Google Meet",
        fromDate: "2024-10-21 00:00:00",
        toDate: "2024-10-21 23:59:59",
        color: "amber",
        isFullDay: true
      }
    ]);
    const __returned__ = { config, events, ref, Calendar, get logEvent() {
      return logEvent;
    }, TabButtons };
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
              create: (event) => $setup.logEvent("createEvent", event),
              update: (event) => $setup.logEvent("updateEvent", event),
              delete: (event) => $setup.logEvent("deleteEvent", event)
            }, null, 8, ["events", "create", "update", "delete"])
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
              create: (event) => $setup.logEvent("createEvent", event),
              update: (event) => $setup.logEvent("updateEvent", event),
              delete: (event) => $setup.logEvent("deleteEvent", event)
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
            }, 8, ["events", "create", "update", "delete"])
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
_sfc_main.__file = "src/components/Calendar.story.vue";
const Calendar_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Calendar.story.vue"]]);
export {
  Calendar_story as default
};
