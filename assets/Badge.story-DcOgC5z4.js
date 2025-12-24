import { aC as defineComponent, aR as reactive, aO as resolveComponent, az as openBlock, aH as createBlock, aP as withCtx, aM as createVNode, aA as createElementBlock, aS as renderList, aT as Fragment, aU as mergeProps, aQ as createTextVNode, aL as toDisplayString } from "./vendor-DfdkrUQI.js";
import { B as Badge } from "./Badge-DgGbfTpQ.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Badge.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      theme: "gray",
      size: "sm",
      label: "Badge"
    });
    const variants = ["solid", "subtle", "outline", "ghost"];
    const themes = ["gray", "blue", "green", "orange", "red"];
    const sizes = ["sm", "md", "lg"];
    const __returned__ = { state, variants, themes, sizes, Badge };
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
        title: "Content"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.theme,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.state.theme = $event),
        options: $setup.themes,
        title: "Theme"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.size,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.state.size = $event),
        options: $setup.sizes,
        title: "Size"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      (openBlock(), createElementBlock(
        Fragment,
        null,
        renderList($setup.variants, (variant) => {
          return createVNode(_component_Variant, {
            key: variant,
            title: variant
          }, {
            default: withCtx(() => [
              createVNode($setup["Badge"], mergeProps({
                variant,
                ref_for: true
              }, $setup.state), {
                default: withCtx(() => [
                  createTextVNode(
                    toDisplayString($setup.state.label),
                    1
                    /* TEXT */
                  )
                ]),
                _: 2
                /* DYNAMIC */
              }, 1040, ["variant"])
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
_sfc_main.__file = "src/components/Badge/Badge.story.vue";
const Badge_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Badge/Badge.story.vue"]]);
export {
  Badge_story as default
};
