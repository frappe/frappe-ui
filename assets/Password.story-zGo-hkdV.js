import { ay as defineComponent, az as ref, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aF as createBaseVNode, aE as createVNode } from "./vendor-DJfK-8-n.js";
import { P as Password } from "./Password-QdEbIyEG.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./FormControl-D1BIU5aK.js";
import "./Checkbox-CoEuEWhv.js";
import "./TextInput-C2e82ZEX.js";
import "./debounce-CRCtzhPg.js";
import "./Select-BDpENZF3.js";
import "./Textarea-D-pIHq9s.js";
import "./Autocomplete-D8qb5tEd.js";
import "./Popover-BWYlhtYc.js";
import "./Button-C7Z5NtZB.js";
import "./FeatherIcon-njTlGqML.js";
import "./Tooltip-BzifAxYb.js";
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
