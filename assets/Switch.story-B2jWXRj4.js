import { ay as defineComponent, aI as reactive, az as ref, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aL as mergeProps } from "./vendor-BkoGa0PW.js";
import { S as Switch } from "./Switch-B9eaNGyk.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Switch.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      size: "sm",
      label: "Enable Notifications",
      description: "Get notified when something happens.",
      disabled: false,
      modelValue: false
    });
    const checked = ref(false);
    const sizes = ["sm", "md"];
    const __returned__ = { state, checked, sizes, Switch };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstSelect = resolveComponent("HstSelect");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 300 } }, {
    controls: withCtx(() => [
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.size,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.state.size = $event),
        options: $setup.sizes,
        title: "Size"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Label" }, {
        default: withCtx(() => [
          createVNode($setup["Switch"], mergeProps($setup.state, {
            modelValue: $setup.checked,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.checked = $event),
            description: ""
          }), null, 16, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Label and Description" }, {
        default: withCtx(() => [
          createVNode($setup["Switch"], mergeProps($setup.state, {
            modelValue: $setup.checked,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.checked = $event)
          }), null, 16, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Switch/Switch.story.vue";
const Switch_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Switch/Switch.story.vue"]]);
export {
  Switch_story as default
};
