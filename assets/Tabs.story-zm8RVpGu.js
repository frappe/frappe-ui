import { ay as defineComponent, aI as reactive, aQ as h, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aF as createBaseVNode, aN as toDisplayString } from "./vendor-YOH0Ssd3.js";
import { T as Tabs } from "./Tabs-BYCXaimP.js";
import { F as FeatherIcon } from "./FeatherIcon-Dy_wld2O.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Tabs.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      index: 0,
      tabs_without_icon: [
        {
          label: "Github",
          content: "Github is a code hosting platform for version control and collaboration. It lets you and others work together on projects from anywhere."
        },
        {
          label: "Twitter",
          content: 'Twitter is an American microblogging and social networking service on which users post and interact with messages known as "tweets".'
        },
        {
          label: "Linkedin",
          content: "LinkedIn is an American business and employment-oriented online service that operates via websites and mobile apps."
        }
      ],
      tabs_with_icon: [
        {
          label: "Github",
          content: "Github is a code hosting platform for version control and collaboration. It lets you and others work together on projects from anywhere.",
          icon: h(FeatherIcon, { class: "w-4 h-4", name: "github" })
        },
        {
          label: "Twitter",
          content: 'Twitter is an American microblogging and social networking service on which users post and interact with messages known as "tweets".',
          icon: h(FeatherIcon, { class: "w-4 h-4", name: "twitter" })
        },
        {
          label: "Linkedin",
          content: "LinkedIn is an American business and employment-oriented online service that operates via websites and mobile apps.",
          icon: h(FeatherIcon, { class: "w-4 h-4", name: "linkedin" })
        }
      ]
    });
    const __returned__ = { state, Tabs };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-5" };
const _hoisted_2 = { class: "p-5" };
const _hoisted_3 = { class: "p-5" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstNumber = resolveComponent("HstNumber");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: "80%" } }, {
    controls: withCtx(() => [
      createVNode(_component_HstNumber, {
        modelValue: $setup.state.index,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.state.index = $event),
        title: "Tab Index"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Without Icon" }, {
        default: withCtx(() => [
          createVNode($setup["Tabs"], {
            as: "div",
            class: "border rounded",
            modelValue: $setup.state.index,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state.index = $event),
            tabs: $setup.state.tabs_without_icon
          }, {
            "tab-panel": withCtx(({ tab }) => [
              createBaseVNode(
                "div",
                _hoisted_1,
                toDisplayString(tab.content),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue", "tabs"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "With Icon" }, {
        default: withCtx(() => [
          createVNode($setup["Tabs"], {
            as: "div",
            class: "border rounded",
            modelValue: $setup.state.index,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.state.index = $event),
            tabs: $setup.state.tabs_with_icon
          }, {
            "tab-panel": withCtx(({ tab }) => [
              createBaseVNode(
                "div",
                _hoisted_2,
                toDisplayString(tab.content),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue", "tabs"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Vertical Tabs" }, {
        default: withCtx(() => [
          createVNode($setup["Tabs"], {
            as: "div",
            class: "border rounded",
            modelValue: $setup.state.index,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.state.index = $event),
            tabs: $setup.state.tabs_with_icon,
            vertical: ""
          }, {
            "tab-panel": withCtx(({ tab }) => [
              createBaseVNode(
                "div",
                _hoisted_3,
                toDisplayString(tab.content),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue", "tabs"])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Tabs/Tabs.story.vue";
const Tabs_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tabs/Tabs.story.vue"]]);
export {
  Tabs_story as default
};
