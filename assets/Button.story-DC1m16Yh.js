import { ay as _export_sfc, az as defineComponent, aB as reactive, aC as resolveComponent, aD as openBlock, aE as createBlock, aF as withCtx, aH as createVNode, aL as createElementBlock, aU as renderList, aV as Fragment, aI as createBaseVNode, aW as mergeProps, aT as createTextVNode, aJ as toDisplayString } from "./vendor-By8Zq8JN.js";
import { B as Button } from "./Button-IKbSEtY8.js";
import "./FeatherIcon-CkB7nLKC.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Button.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      theme: "gray",
      size: "sm",
      label: "Button",
      loading: false,
      loadingText: null,
      disabled: false,
      link: null,
      tooltip: "Hover for more!"
    });
    const variants = ["solid", "subtle", "outline", "ghost"];
    const themes = ["gray", "blue", "green", "red"];
    const sizes = ["sm", "md", "lg", "xl", "2xl"];
    const __returned__ = { state, variants, themes, sizes, get Button() {
      return Button;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-1" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstText = resolveComponent("HstText");
  const _component_HstCheckbox = resolveComponent("HstCheckbox");
  const _component_HstSelect = resolveComponent("HstSelect");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 300 } }, {
    controls: withCtx(() => [
      createVNode(_component_HstText, {
        modelValue: $setup.state.label,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state.label = $event),
        title: "Content"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.disabled,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.state.disabled = $event),
        title: "Disabled"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.theme,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.state.theme = $event),
        options: $setup.themes,
        title: "Theme"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.size,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.state.size = $event),
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
              createBaseVNode("div", _hoisted_1, [
                createVNode($setup["Button"], mergeProps({
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
_sfc_main.__file = "src/components/Button/Button.story.vue";
const Button_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Button/Button.story.vue"]]);
export {
  Button_story as default
};
