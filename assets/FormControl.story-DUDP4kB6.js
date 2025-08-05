import { ay as defineComponent, aI as reactive, az as ref, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aG as createElementBlock, aJ as renderList, aK as Fragment, aF as createBaseVNode, aL as mergeProps } from "./vendor-haqsgnc2.js";
import { F as FormControl } from "./FormControl-D-whKufM.js";
import { F as FeatherIcon } from "./FeatherIcon-B8HOOsQp.js";
import { A as Avatar } from "./Avatar-DLURLD53.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-CeJsTKu6.js";
import "./TextInput-CG-eeTbS.js";
import "./debounce-CRCtzhPg.js";
import "./Select-tFN35_v_.js";
import "./Textarea-Bux-1JIW.js";
import "./Autocomplete-DAWpJKP8.js";
import "./Popover-BXwVGd5G.js";
import "./Button-DiiIPmkj.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormControl.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      size: "sm",
      variant: "subtle",
      placeholder: "Placeholder",
      disabled: false,
      label: "Label"
    });
    const inputValue = ref("");
    const selectValue = ref(null);
    const autocompleteValue = ref(null);
    const checkboxValue = ref(false);
    const inputTypes = [
      "text",
      "number",
      "email",
      "date",
      "password",
      "search",
      "textarea"
    ];
    const sizes = ["sm", "md", "lg", "xl"];
    const variants = ["subtle", "outline"];
    const __returned__ = { state, inputValue, selectValue, autocompleteValue, checkboxValue, inputTypes, sizes, variants, FormControl, FeatherIcon, get Avatar() {
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
const _hoisted_5 = { class: "p-2" };
const _hoisted_6 = { class: "p-2" };
const _hoisted_7 = { class: "p-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstSelect = resolveComponent("HstSelect");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 500 } }, {
    controls: withCtx(() => [
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.variant,
        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.state.variant = $event),
        options: $setup.variants,
        title: "Variant"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstSelect, {
        modelValue: $setup.state.size,
        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.state.size = $event),
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
                createVNode($setup["FormControl"], mergeProps({
                  type: inputType,
                  ref_for: true
                }, $setup.state, {
                  modelValue: $setup.inputValue,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.inputValue = $event)
                }), null, 16, ["type", "modelValue"])
              ])
            ]),
            _: 2
            /* DYNAMIC */
          }, 1032, ["title"]);
        }),
        64
        /* STABLE_FRAGMENT */
      )),
      createVNode(_component_Variant, { title: "select" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_2, [
            createVNode($setup["FormControl"], mergeProps({
              type: "select",
              options: [
                { label: "One", value: "1" },
                { label: "Two", value: "2" },
                { label: "Three", value: "3" }
              ]
            }, $setup.state, {
              modelValue: $setup.selectValue,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.selectValue = $event)
            }), null, 16, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "autocomplete" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_3, [
            createVNode($setup["FormControl"], mergeProps({
              type: "autocomplete",
              options: [
                { label: "One", value: "1" },
                { label: "Two", value: "2" },
                { label: "Three", value: "3" }
              ]
            }, $setup.state, {
              modelValue: $setup.autocompleteValue,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.autocompleteValue = $event)
            }), null, 16, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "checkbox" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_4, [
            createVNode($setup["FormControl"], mergeProps({ type: "checkbox" }, $setup.state, {
              modelValue: $setup.checkboxValue,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.checkboxValue = $event)
            }), null, 16, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "prefix slot icon" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_5, [
            createVNode($setup["FormControl"], {
              type: "text",
              label: "Label"
            }, {
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
          createBaseVNode("div", _hoisted_6, [
            createVNode($setup["FormControl"], {
              type: "text",
              label: "Label"
            }, {
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
          createBaseVNode("div", _hoisted_7, [
            createVNode($setup["FormControl"], {
              type: "text",
              label: "Label"
            }, {
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
_sfc_main.__file = "src/components/FormControl/FormControl.story.vue";
const FormControl_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/FormControl/FormControl.story.vue"]]);
export {
  FormControl_story as default
};
