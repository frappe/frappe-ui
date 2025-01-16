import { F as FeatherIcon } from "./FeatherIcon-BHSUzXhO.js";
import { bQ as he, bR as Oe, bS as ke, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aF as createBaseVNode, aG as createElementBlock, aK as Fragment, aJ as renderList, aQ as normalizeClass, aH as createCommentVNode, b0 as withDirectives, aE as createVNode, aM as createTextVNode, aN as toDisplayString, b1 as vShow } from "./vendor-BRJWiLio.js";
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
const _hoisted_1 = { class: "flex space-x-1 rounded bg-surface-gray-2 p-0.5 text-sm" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FeatherIcon = resolveComponent("FeatherIcon");
  const _component_RadioGroupLabel = resolveComponent("RadioGroupLabel");
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
              as: "template",
              key: button.label,
              value: button.value ?? button.label
            }, {
              default: withCtx(({ active, checked }) => [
                createBaseVNode(
                  "button",
                  {
                    class: normalizeClass([
                      active ? "ring-outline-gray-2 focus-visible:ring" : "",
                      checked ? "bg-surface-white text-ink-gray-9 shadow" : "text-ink-gray-7",
                      "flex flex-1 justify-center gap-2 whitespace-nowrap rounded-[7px] px-3 py-[5px] leading-none transition-colors focus:outline-none"
                    ])
                  },
                  [
                    button.icon ? (openBlock(), createBlock(_component_FeatherIcon, {
                      key: 0,
                      class: "h-4 w-4",
                      name: button.icon,
                      label: button.label,
                      "aria-label": button.label
                    }, null, 8, ["name", "label", "aria-label"])) : createCommentVNode("v-if", true),
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
                  ],
                  2
                  /* CLASS */
                )
              ]),
              _: 2
              /* DYNAMIC */
            }, 1032, ["value"]);
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
_sfc_main.__file = "src/components/TabButtons.vue";
const TabButtons = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TabButtons.vue"]]);
export {
  TabButtons as T
};
