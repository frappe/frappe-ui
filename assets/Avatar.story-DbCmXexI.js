import { ay as defineComponent, aI as reactive, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aG as createElementBlock, aJ as renderList, aK as Fragment, aL as mergeProps } from "./vendor-Y_YrQ_Pm.js";
import { A as Avatar } from "./Avatar-CPrp2s0N.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Avatar.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      image: "https://avatars.githubusercontent.com/u/499550?s=60&v=4",
      label: "EY",
      size: "md"
    });
    const shapes = ["circle", "square"];
    const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"];
    const __returned__ = { state, shapes, sizes, Avatar };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstText = resolveComponent("HstText");
  const _component_HstSelect = resolveComponent("HstSelect");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 300 } }, {
    controls: withCtx(() => [
      createVNode(_component_HstText, {
        modelValue: $setup.state.label,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state.label = $event),
        title: "Label"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.size,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.state.size = $event),
        options: $setup.sizes,
        title: "Size"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      (openBlock(), createElementBlock(
        Fragment,
        null,
        renderList($setup.shapes, (shape) => {
          return createVNode(_component_Variant, {
            key: shape,
            title: shape
          }, {
            default: withCtx(() => [
              createVNode($setup["Avatar"], mergeProps({
                shape,
                ref_for: true
              }, $setup.state), null, 16, ["shape"])
            ]),
            _: 2
            /* DYNAMIC */
          }, 1032, ["title"]);
        }),
        64
        /* STABLE_FRAGMENT */
      )),
      (openBlock(), createElementBlock(
        Fragment,
        null,
        renderList($setup.shapes, (shape) => {
          return createVNode(_component_Variant, {
            key: shape,
            title: shape
          }, {
            default: withCtx(() => [
              createVNode($setup["Avatar"], mergeProps({
                shape,
                ref_for: true
              }, $setup.state, { image: null }), null, 16, ["shape"])
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
_sfc_main.__file = "src/components/Avatar.story.vue";
const Avatar_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Avatar.story.vue"]]);
export {
  Avatar_story as default
};
