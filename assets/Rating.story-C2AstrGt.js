import { ay as defineComponent, aI as reactive, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aF as createBaseVNode, aR as normalizeProps, aS as guardReactiveProps } from "./vendor-BNOKmoOQ.js";
import { R as Rating } from "./Rating-B1FSFkAD.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./FeatherIcon-BCv2YB17.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Rating.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      size: "md",
      label: "Rating"
    });
    const __returned__ = { state, Rating };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 300 } }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "default" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode(
              $setup["Rating"],
              normalizeProps(guardReactiveProps($setup.state)),
              null,
              16
              /* FULL_PROPS */
            )
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
_sfc_main.__file = "src/components/Rating/Rating.story.vue";
const Rating_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Rating/Rating.story.vue"]]);
export {
  Rating_story as default
};
