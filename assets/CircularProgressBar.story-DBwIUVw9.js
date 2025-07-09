import { C as CircularProgressBar } from "./CircularProgressBar-CoXDuM70.js";
import { aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aF as createBaseVNode } from "./vendor-BvyPapf4.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./FeatherIcon-C9moqs4Q.js";
const _sfc_main = {
  __name: "CircularProgressBar.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = { CircularProgressBar };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1 = { class: "p-2 w-full h-full" };
const _hoisted_2 = { class: "p-2 w-full h-full" };
const _hoisted_3 = { class: "p-2 w-full h-full" };
const _hoisted_4 = { class: "p-2 w-full h-full" };
const _hoisted_5 = { class: "p-2 w-full h-full" };
const _hoisted_6 = { class: "p-2 w-full h-full" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 500, heigt: 500 } }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Default" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["CircularProgressBar"], {
              step: 1,
              totalSteps: 4
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Size" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_2, [
            createVNode($setup["CircularProgressBar"], {
              step: 1,
              totalSteps: 4,
              size: "lg",
              showPercentage: true
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Theme" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_3, [
            createVNode($setup["CircularProgressBar"], {
              step: 3,
              totalSteps: 4,
              theme: "orange"
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Custom Theme" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_4, [
            createVNode($setup["CircularProgressBar"], {
              step: 2,
              totalSteps: 6,
              theme: {
                primary: "#2376f5",
                secondary: "#ddd5d5"
              }
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Solid Variant" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_5, [
            createVNode($setup["CircularProgressBar"], {
              step: 9,
              totalSteps: 9,
              variant: "solid",
              themeComplete: "lightgreen"
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Outline Variant" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_6, [
            createVNode($setup["CircularProgressBar"], {
              step: 9,
              totalSteps: 9,
              variant: "outline",
              themeComplete: "lightgreen"
            })
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
_sfc_main.__file = "src/components/CircularProgressBar/CircularProgressBar.story.vue";
const CircularProgressBar_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/CircularProgressBar/CircularProgressBar.story.vue"]]);
export {
  CircularProgressBar_story as default
};
