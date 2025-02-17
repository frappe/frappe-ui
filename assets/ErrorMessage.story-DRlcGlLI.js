import { ay as defineComponent, az as ref, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aF as createBaseVNode } from "./vendor-DmvhPIvt.js";
import { E as ErrorMessage } from "./ErrorMessage-vheIRImH.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ErrorMessage.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const message = ref("Invalid value");
    const error = new Error("There was an error");
    const __returned__ = { message, error, ErrorMessage };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, {
    layout: { width: 500, type: "grid" },
    autoPropsDisabled: ""
  }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "String message" }, {
        default: withCtx(() => [
          createVNode($setup["ErrorMessage"], { message: $setup.message }, null, 8, ["message"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Error object" }, {
        source: withCtx(() => _cache[0] || (_cache[0] = [
          createBaseVNode(
            "textarea",
            null,
            `          <ErrorMessage :message="Error('There was an error')" />
        `,
            -1
            /* HOISTED */
          )
        ])),
        default: withCtx(() => [
          createVNode($setup["ErrorMessage"], { message: $setup.error }, null, 8, ["message"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Falsy value" }, {
        default: withCtx(() => [
          createVNode($setup["ErrorMessage"], { message: "" })
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/ErrorMessage.story.vue";
const ErrorMessage_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ErrorMessage.story.vue"]]);
export {
  ErrorMessage_story as default
};
