import { ay as defineComponent, az as ref, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aF as createBaseVNode, aE as createVNode } from "./vendor-B-dtWnil.js";
import { P as Password } from "./Password-BmXh93X6.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./FormControl-B8MhPPPN.js";
import "./Checkbox-UJP1L3ge.js";
import "./TextInput-90pJt4iN.js";
import "./debounce-CRCtzhPg.js";
import "./Select-DKeNDigA.js";
import "./Textarea-BxFhy24L.js";
import "./Autocomplete-H7UMkZPC.js";
import "./Popover-QZlDj51Z.js";
import "./Button-Bk-f01jo.js";
import "./FeatherIcon-CNxkKovQ.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Password.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const value = ref("");
    const __returned__ = { value, get Password() {
      return Password;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, {
    title: "Password",
    layout: { width: 500, type: "grid" }
  }, {
    default: withCtx(() => [
      createBaseVNode("div", _hoisted_1, [
        createVNode($setup["Password"], {
          modelValue: $setup.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.value = $event)
        }, null, 8, ["modelValue"])
      ])
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Password/Password.story.vue";
const Password_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Password/Password.story.vue"]]);
export {
  Password_story as default
};
