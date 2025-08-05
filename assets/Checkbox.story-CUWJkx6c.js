import { ay as defineComponent, aI as reactive, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aF as createBaseVNode, aL as mergeProps } from "./vendor-DWblPeGU.js";
import { C as Checkbox } from "./Checkbox-B_v-QdPC.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Checkbox.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      size: "sm",
      value: false
    });
    const sizes = ["sm", "md"];
    const __returned__ = { state, sizes, Checkbox };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_HstSelect = resolveComponent("HstSelect");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { width: 500, type: "grid" } }, {
    controls: withCtx(() => [
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.size,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.state.size = $event),
        options: $setup.sizes,
        title: "Size"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      createBaseVNode("div", _hoisted_1, [
        createVNode($setup["Checkbox"], mergeProps($setup.state, {
          modelValue: $setup.state.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state.value = $event),
          label: "Enable feature"
        }), null, 16, ["modelValue"])
      ])
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Checkbox/Checkbox.story.vue";
const Checkbox_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Checkbox/Checkbox.story.vue"]]);
export {
  Checkbox_story as default
};
