import { aC as defineComponent, aR as reactive, aO as resolveComponent, az as openBlock, aH as createBlock, aP as withCtx, aM as createVNode, bc as normalizeProps, bd as guardReactiveProps, aB as createBaseVNode, aU as mergeProps } from "./vendor-BvAOpJo0.js";
import { S as Switch } from "./Switch-DpWIZJHk.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useId-DJabvbK8.js";
import "./FeatherIcon-Zdns-zCj.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Switch.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      size: "sm",
      label: "Enable Notifications",
      disabled: false,
      modelValue: false
    });
    const sizes = ["sm", "md"];
    const __returned__ = { state, sizes, Switch };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "flex flex-col gap-2" };
const _hoisted_2 = { class: "flex flex-col gap-2" };
const _hoisted_3 = { class: "flex flex-col gap-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstSelect = resolveComponent("HstSelect");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 300 } }, {
    controls: withCtx(() => [
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.size,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state.size = $event),
        options: $setup.sizes,
        title: "Size"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Plain" }, {
        default: withCtx(() => [
          createVNode($setup["Switch"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Label" }, {
        default: withCtx(() => [
          createVNode(
            $setup["Switch"],
            normalizeProps(guardReactiveProps($setup.state)),
            null,
            16
            /* FULL_PROPS */
          )
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Description and icon" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode(
              $setup["Switch"],
              mergeProps($setup.state, { description: "Get notified when something happens." }),
              null,
              16
              /* FULL_PROPS */
            ),
            createVNode(
              $setup["Switch"],
              mergeProps($setup.state, {
                icon: "inbox",
                description: "This has an icon."
              }),
              null,
              16
              /* FULL_PROPS */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Size " }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_2, [
            createVNode(
              $setup["Switch"],
              mergeProps($setup.state, { size: "sm" }),
              null,
              16
              /* FULL_PROPS */
            ),
            createVNode(
              $setup["Switch"],
              mergeProps($setup.state, { size: "md" }),
              null,
              16
              /* FULL_PROPS */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Disabled" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_3, [
            createVNode(
              $setup["Switch"],
              mergeProps($setup.state, { disabled: true }),
              null,
              16
              /* FULL_PROPS */
            ),
            createVNode(
              $setup["Switch"],
              mergeProps($setup.state, {
                description: "This is a description.",
                disabled: true
              }),
              null,
              16
              /* FULL_PROPS */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Classes" }, {
        default: withCtx(() => [
          createVNode(
            $setup["Switch"],
            mergeProps($setup.state, {
              "label-classes": "font-normal",
              description: "This switch has a normal font."
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
_sfc_main.__file = "src/components/Switch/Switch.story.vue";
const Switch_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Switch/Switch.story.vue"]]);
export {
  Switch_story as default
};
