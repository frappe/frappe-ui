import { ay as defineComponent, aI as reactive, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aL as mergeProps } from "./vendor-CsNZJHhL.js";
import { P as Progress } from "./Progress-f1Z57HAG.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Progress.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      size: "sm",
      value: 50
    });
    const sizes = ["sm", "md", "lg", "xl"];
    const __returned__ = { state, sizes, Progress };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstSlider = resolveComponent("HstSlider");
  const _component_HstSelect = resolveComponent("HstSelect");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 300 } }, {
    controls: withCtx(() => [
      createVNode(_component_HstSlider, {
        modelValue: $setup.state.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state.value = $event),
        min: 0,
        max: 100,
        title: "Value"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.size,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.state.size = $event),
        options: $setup.sizes,
        title: "Size"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Label" }, {
        default: withCtx(() => [
          createVNode(
            $setup["Progress"],
            mergeProps($setup.state, { label: "Progress" }),
            null,
            16
            /* FULL_PROPS */
          )
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Hint" }, {
        default: withCtx(() => [
          createVNode(
            $setup["Progress"],
            mergeProps($setup.state, {
              label: "Progress",
              hint: true
            }),
            null,
            16
            /* FULL_PROPS */
          )
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Intervals" }, {
        default: withCtx(() => [
          createVNode(
            $setup["Progress"],
            mergeProps($setup.state, {
              label: "Progress",
              intervals: true,
              "interval-count": 5
            }),
            null,
            16
            /* FULL_PROPS */
          )
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Progress.story.vue";
const Progress_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Progress.story.vue"]]);
export {
  Progress_story as default
};
