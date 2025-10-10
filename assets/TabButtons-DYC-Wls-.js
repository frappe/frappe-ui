import { B as Button } from "./Button-SEBbO4PF.js";
import { F as FeatherIcon } from "./FeatherIcon-ciI4L3s3.js";
import { db as he, dc as Oe, dd as ke, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aF as createBaseVNode, aG as createElementBlock, aK as Fragment, aJ as renderList, aE as createVNode, aL as mergeProps, b3 as withDirectives, aM as createTextVNode, aN as toDisplayString, by as vShow } from "./vendor-F5kC6_Yf.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  name: "TabButtons",
  props: {
    buttons: {
      type: Array,
      required: true
    },
    modelValue: {
      type: [String, Boolean, Number]
    }
  },
  emits: ["update:modelValue"],
  components: {
    Button,
    FeatherIcon,
    RadioGroup: he,
    RadioGroupOption: Oe,
    RadioGroupLabel: ke
  },
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      }
    }
  }
};
const _hoisted_1 = { class: "flex space-x-0.5 rounded-md bg-surface-gray-2 h-7 items-center px-[1px] text-sm" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_RadioGroupLabel = resolveComponent("RadioGroupLabel");
  const _component_Button = Button;
  const _component_RadioGroupOption = resolveComponent("RadioGroupOption");
  const _component_RadioGroup = resolveComponent("RadioGroup");
  return openBlock(), createBlock(_component_RadioGroup, {
    modelValue: $options.value,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $options.value = $event)
  }, {
    default: withCtx(() => [
      createBaseVNode("div", _hoisted_1, [
        (openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList($props.buttons, (button) => {
            return openBlock(), createBlock(_component_RadioGroupOption, {
              as: "div",
              key: button.label,
              disabled: button.disabled,
              value: button.value ?? button.label
            }, {
              default: withCtx(({ active, checked }) => [
                createVNode(_component_Button, mergeProps({
                  onClick: button.onClick,
                  ref_for: true
                }, button, {
                  class: ["!h-6.5", [
                    active ? "ring-outline-gray-2 focus-visible:ring" : "",
                    checked && "!bg-surface-white",
                    button.disabled ? "" : checked ? " text-ink-gray-8 shadow" : "!text-ink-gray-5"
                  ]]
                }), {
                  default: withCtx(() => [
                    withDirectives(createVNode(
                      _component_RadioGroupLabel,
                      {
                        as: "span",
                        class: "flex h-4 items-center"
                      },
                      {
                        default: withCtx(() => [
                          createTextVNode(
                            toDisplayString(button.label),
                            1
                            /* TEXT */
                          )
                        ]),
                        _: 2
                        /* DYNAMIC */
                      },
                      1536
                      /* NEED_PATCH, DYNAMIC_SLOTS */
                    ), [
                      [vShow, button.label && !button.hideLabel]
                    ])
                  ]),
                  _: 2
                  /* DYNAMIC */
                }, 1040, ["onClick", "class"])
              ]),
              _: 2
              /* DYNAMIC */
            }, 1032, ["disabled", "value"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]),
    _: 1
    /* STABLE */
  }, 8, ["modelValue"]);
}
_sfc_main.__file = "src/components/TabButtons/TabButtons.vue";
const TabButtons = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TabButtons/TabButtons.vue"]]);
export {
  TabButtons as T
};
