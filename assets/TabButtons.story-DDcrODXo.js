import { ay as _export_sfc, az as defineComponent, aA as ref, aC as resolveComponent, aD as openBlock, aE as createBlock, aF as withCtx, aH as createVNode, aI as createBaseVNode } from "./vendor-By8Zq8JN.js";
import { T as TabButtons } from "./TabButtons-CElIwRdF.js";
import "./Button-IKbSEtY8.js";
import "./FeatherIcon-CkB7nLKC.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TabButtons.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const currentTab = ref("mytasks");
    const __returned__ = { currentTab, TabButtons };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "flex" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: "80%" } }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Tab Buttons" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["TabButtons"], {
              buttons: [
                { label: "Tasks assigned to me", value: "mytasks" },
                { label: "Tasks created by me", value: "created" }
              ],
              modelValue: $setup.currentTab,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.currentTab = $event)
            }, null, 8, ["modelValue"])
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
_sfc_main.__file = "src/components/TabButtons/TabButtons.story.vue";
const TabButtons_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TabButtons/TabButtons.story.vue"]]);
export {
  TabButtons_story as default
};
