import { ay as defineComponent, aI as reactive, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aG as createElementBlock, aJ as renderList, aK as Fragment, aF as createBaseVNode, aL as mergeProps } from "./vendor-BNOKmoOQ.js";
import { T as TextInput } from "./TextInput-D7pJ_bsV.js";
import { F as FeatherIcon } from "./FeatherIcon-BCv2YB17.js";
import { A as Avatar } from "./Avatar-BKTsmbRi.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./debounce-CRCtzhPg.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TextInput.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      size: "sm",
      variant: "subtle",
      placeholder: "Placeholder",
      disabled: false,
      modelValue: ""
    });
    const inputTypes = [
      "text",
      "number",
      "email",
      "date",
      "datetime-local",
      "password",
      "search",
      "tel",
      "time",
      "url"
    ];
    const sizes = ["sm", "md", "lg", "xl"];
    const variants = ["subtle", "outline"];
    const __returned__ = { state, inputTypes, sizes, variants, TextInput, FeatherIcon, get Avatar() {
      return Avatar;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-2" };
const _hoisted_2 = { class: "p-2" };
const _hoisted_3 = { class: "p-2" };
const _hoisted_4 = { class: "p-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstSelect = resolveComponent("HstSelect");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 500 } }, {
    controls: withCtx(() => [
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.variant,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state.variant = $event),
        options: $setup.variants,
        title: "Variant"
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
        renderList($setup.inputTypes, (inputType) => {
          return createVNode(_component_Variant, {
            key: inputType,
            title: inputType
          }, {
            default: withCtx(() => [
              createBaseVNode("div", _hoisted_1, [
                createVNode($setup["TextInput"], mergeProps({
                  type: inputType,
                  ref_for: true
                }, $setup.state), null, 16, ["type"])
              ])
            ]),
            _: 2
            /* DYNAMIC */
          }, 1032, ["title"]);
        }),
        64
        /* STABLE_FRAGMENT */
      )),
      createVNode(_component_Variant, { title: "prefix slot icon" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_2, [
            createVNode($setup["TextInput"], { type: "text" }, {
              prefix: withCtx(() => [
                createVNode($setup["FeatherIcon"], {
                  class: "w-4",
                  name: "search"
                })
              ]),
              _: 1
              /* STABLE */
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "suffix slot icon" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_3, [
            createVNode($setup["TextInput"], { type: "text" }, {
              suffix: withCtx(() => [
                createVNode($setup["FeatherIcon"], {
                  class: "w-4",
                  name: "search"
                })
              ]),
              _: 1
              /* STABLE */
            })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "prefix slot avatar" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_4, [
            createVNode($setup["TextInput"], { type: "text" }, {
              prefix: withCtx(() => [
                createVNode($setup["Avatar"], {
                  size: "sm",
                  image: "https://avatars.githubusercontent.com/u/499550?s=60&v=4"
                })
              ]),
              _: 1
              /* STABLE */
            })
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
_sfc_main.__file = "src/components/TextInput/TextInput.story.vue";
const TextInput_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextInput/TextInput.story.vue"]]);
export {
  TextInput_story as default
};
