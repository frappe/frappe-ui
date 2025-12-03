import { aC as defineComponent, aR as reactive, aO as resolveComponent, az as openBlock, aH as createBlock, aP as withCtx, aM as createVNode, aA as createElementBlock, aS as renderList, aT as Fragment, aB as createBaseVNode, aU as mergeProps } from "./vendor-Ciyd-VkX.js";
import { T as Textarea } from "./Textarea-TtijDJuH.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./debounce-CRCtzhPg.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Textarea.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      size: "sm",
      placeholder: "Placeholder",
      disabled: false,
      modelValue: "",
      label: "Label"
    });
    const sizes = ["sm", "md", "lg", "xl"];
    const variants = ["subtle", "outline"];
    const __returned__ = { state, sizes, variants, Textarea };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-1" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstSelect = resolveComponent("HstSelect");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 500 } }, {
    controls: withCtx(() => [
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.size,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state.size = $event),
        options: $setup.sizes,
        title: "Size"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      (openBlock(), createElementBlock(
        Fragment,
        null,
        renderList($setup.variants, (type) => {
          return createVNode(_component_Variant, {
            key: type,
            title: `${type} variant`
          }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_1, [
                createVNode($setup["Textarea"], mergeProps({
                  variant: type,
                  ref_for: true
                }, $setup.state), null, 16, ["variant"])
              ])
            ]),
            _: 2
            /* DYNAMIC */
          }, 1032, ["title"]);
        }),
        64
        /* STABLE_FRAGMENT */
      ))
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Textarea/Textarea.story.vue";
const Textarea_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Textarea/Textarea.story.vue"]]);
export {
  Textarea_story as default
};
