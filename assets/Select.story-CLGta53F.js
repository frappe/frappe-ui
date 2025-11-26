import { aC as defineComponent, aN as ref, aO as resolveComponent, az as openBlock, aH as createBlock, aP as withCtx, aM as createVNode, aB as createBaseVNode } from "./vendor-Cta8fDfw.js";
import { S as Select } from "./Select-CN54Zi25.js";
import { U as User } from "./user-Cr5aTZBo.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./chevron-down-DM1T5rC7.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Select.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const value = ref("");
    const options = [
      { label: "John Doe", value: "john-doe" },
      { label: "Jane Doe", value: "jane-doe" },
      { label: "John Smith", value: "john-smith" },
      { label: "Jane Smith", value: "jane-smith", disabled: true },
      { label: "John Wayne", value: "john-wayne" },
      { label: "Jane Wayne", value: "jane-wayne" }
    ];
    const __returned__ = { value, options, Select, get LucideUser() {
      return User;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-2" };
const _hoisted_2 = { class: "p-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { width: 500, type: "grid" } }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Default" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["Select"], {
              options: $setup.options,
              modelValue: $setup.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.value = $event)
            }, null, 8, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "With prefix" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_2, [
            createVNode($setup["Select"], {
              options: $setup.options,
              modelValue: $setup.value,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.value = $event)
            }, {
              prefix: withCtx(() => [
                createVNode($setup["LucideUser"], { class: "size-4 text-ink-gray-9" })
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
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
_sfc_main.__file = "src/components/Select/Select.story.vue";
const Select_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Select/Select.story.vue"]]);
export {
  Select_story as default
};
