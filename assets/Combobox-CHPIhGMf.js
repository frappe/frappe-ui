import { aT as markRaw, aB as openBlock, aG as createElementBlock, aF as createBaseVNode, ay as defineComponent, az as ref, bb as watch, aW as computed, cu as _sfc_main$1, cv as _sfc_main$2, cw as _sfc_main$3, cx as _sfc_main$4, cy as _sfc_main$5, cz as _sfc_main$6, cA as _sfc_main$7, cB as _sfc_main$8, cC as _sfc_main$9, cD as _sfc_main$a, cE as _sfc_main$b, cF as _sfc_main$c, aE as createVNode, aD as withCtx, aQ as normalizeClass, aC as createBlock, aH as createCommentVNode, a_ as withModifiers, aM as createTextVNode, aN as toDisplayString, aK as Fragment, aJ as renderList, aP as h } from "./vendor-DoyARfCS.js";
import { L as LucideChevronDown } from "./chevron-down-CzvWdg0p.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _hoisted_1$1 = {
  class: "lucide lucide-check",
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$1, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "M20 6 9 17l-5-5" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideCheck = markRaw({ name: "lucide-check", render });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Combobox",
  props: {
    options: { type: Array, required: true },
    modelValue: { type: [String, null], required: false },
    placeholder: { type: String, required: false },
    disabled: { type: Boolean, required: false }
  },
  emits: [
    "update:modelValue",
    "update:selectedOption",
    "focus",
    "blur"
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const searchTerm = ref(getDisplayValue(props.modelValue));
    const internalModelValue = ref(props.modelValue);
    const isOpen = ref(false);
    const userHasTyped = ref(false);
    watch(
      () => props.modelValue,
      (newValue) => {
        internalModelValue.value = newValue;
        searchTerm.value = getDisplayValue(newValue);
      }
    );
    const onUpdateModelValue = (value) => {
      internalModelValue.value = value;
      emit("update:modelValue", value);
      searchTerm.value = getDisplayValue(value);
      userHasTyped.value = false;
      const selectedOpt = value ? allOptionsFlat.value.find((opt) => getValue(opt) === value) || null : null;
      emit("update:selectedOption", selectedOpt);
    };
    function isGroup(option) {
      return typeof option === "object" && "group" in option;
    }
    function getLabel(option) {
      return typeof option === "string" ? option : option.label;
    }
    function getValue(option) {
      return typeof option === "string" ? option : option.value;
    }
    function isDisabled(option) {
      return typeof option === "object" && !!option.disabled;
    }
    function getIcon(option) {
      return typeof option === "object" ? option.icon : void 0;
    }
    const allOptionsFlat = computed(() => {
      const flatOptions = [];
      props.options.forEach((optionOrGroup) => {
        if (isGroup(optionOrGroup)) {
          flatOptions.push(...optionOrGroup.options);
        } else {
          flatOptions.push(optionOrGroup);
        }
      });
      return flatOptions;
    });
    function getDisplayValue(selectedValue) {
      if (!selectedValue) return "";
      const options = props.options.flatMap(
        (opt) => isGroup(opt) ? opt.options : opt
      );
      const selectedOption2 = options.find((opt) => getValue(opt) === selectedValue);
      return selectedOption2 ? getLabel(selectedOption2) : selectedValue || "";
    }
    const selectedOption = computed(() => {
      if (!internalModelValue.value) return null;
      return allOptionsFlat.value.find(
        (opt) => getValue(opt) === internalModelValue.value
      );
    });
    const selectedOptionIcon = computed(() => {
      return selectedOption.value ? getIcon(selectedOption.value) : void 0;
    });
    const RenderIcon = (props2) => {
      if (!props2.icon) return null;
      const iconContent = typeof props2.icon === "string" ? h("span", props2.icon) : h(props2.icon, { class: "w-4 h-4" });
      return h(
        "span",
        {
          class: "flex-shrink-0 w-4 h-4 inline-flex items-center justify-center"
        },
        [iconContent]
      );
    };
    const filterFunction = (options, search) => {
      if (!search) return options;
      const lowerSearch = search.toLowerCase();
      const filtered = [];
      options.forEach((optionOrGroup) => {
        if (isGroup(optionOrGroup)) {
          const filteredGroupOptions = optionOrGroup.options.filter((opt) => {
            const label = getLabel(opt).toLowerCase();
            const value = getValue(opt).toLowerCase();
            return label.includes(lowerSearch) || value.includes(lowerSearch);
          });
          if (filteredGroupOptions.length > 0) {
            filtered.push({ ...optionOrGroup, options: filteredGroupOptions });
          }
        } else {
          const label = getLabel(optionOrGroup).toLowerCase();
          const value = getValue(optionOrGroup).toLowerCase();
          if (label.includes(lowerSearch) || value.includes(lowerSearch)) {
            filtered.push(optionOrGroup);
          }
        }
      });
      return filtered;
    };
    const filteredOptions = computed(() => {
      if (isOpen.value && !userHasTyped.value && internalModelValue.value) {
        return props.options;
      }
      return filterFunction(props.options, searchTerm.value);
    });
    const handleInputChange = (event) => {
      const target = event.target;
      searchTerm.value = target.value;
      userHasTyped.value = true;
      if (searchTerm.value === "") {
        internalModelValue.value = null;
        emit("update:modelValue", null);
      }
    };
    const handleOpenChange = (open) => {
      isOpen.value = open;
      if (!open) {
        searchTerm.value = getDisplayValue(internalModelValue.value);
        userHasTyped.value = false;
      } else {
        userHasTyped.value = false;
      }
    };
    const handleFocus = (event) => {
      emit("focus", event);
    };
    const handleBlur = (event) => {
      emit("blur", event);
    };
    const __returned__ = { props, emit, searchTerm, internalModelValue, isOpen, userHasTyped, onUpdateModelValue, isGroup, getLabel, getValue, isDisabled, getIcon, allOptionsFlat, getDisplayValue, selectedOption, selectedOptionIcon, RenderIcon, filterFunction, filteredOptions, handleInputChange, handleOpenChange, handleFocus, handleBlur, get ComboboxAnchor() {
      return _sfc_main$1;
    }, get ComboboxContent() {
      return _sfc_main$2;
    }, get ComboboxEmpty() {
      return _sfc_main$3;
    }, get ComboboxGroup() {
      return _sfc_main$4;
    }, get ComboboxInput() {
      return _sfc_main$5;
    }, get ComboboxItem() {
      return _sfc_main$6;
    }, get ComboboxItemIndicator() {
      return _sfc_main$7;
    }, get ComboboxLabel() {
      return _sfc_main$8;
    }, get ComboboxPortal() {
      return _sfc_main$9;
    }, get ComboboxRoot() {
      return _sfc_main$a;
    }, get ComboboxTrigger() {
      return _sfc_main$b;
    }, get ComboboxViewport() {
      return _sfc_main$c;
    }, get LucideCheck() {
      return LucideCheck;
    }, get LucideChevronDown() {
      return LucideChevronDown;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "relative" };
const _hoisted_2 = { class: "flex items-center gap-2 flex-1 overflow-hidden" };
const _hoisted_3 = { class: "flex items-center gap-2 pr-6 flex-1" };
const _hoisted_4 = { class: "flex items-center gap-2 pr-6 flex-1" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createVNode($setup["ComboboxRoot"], {
      "model-value": $setup.internalModelValue,
      "onUpdate:modelValue": $setup.onUpdateModelValue,
      "onUpdate:open": $setup.handleOpenChange,
      "ignore-filter": true
    }, {
      default: withCtx(() => [
        createVNode($setup["ComboboxAnchor"], {
          class: normalizeClass(["flex h-7 w-full items-center justify-between gap-2 rounded bg-surface-gray-2 px-2 py-1 transition-colors hover:bg-surface-gray-3 border border-transparent focus-within:border-outline-gray-4 focus-within:ring-2 focus-within:ring-outline-gray-3", { "opacity-50 pointer-events-none": $props.disabled }])
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_2, [
              $setup.selectedOptionIcon ? (openBlock(), createBlock($setup["RenderIcon"], {
                key: 0,
                icon: $setup.selectedOptionIcon
              }, null, 8, ["icon"])) : createCommentVNode("v-if", true),
              createVNode($setup["ComboboxInput"], {
                value: $setup.searchTerm,
                onInput: $setup.handleInputChange,
                onFocus: $setup.handleFocus,
                onBlur: $setup.handleBlur,
                class: "bg-transparent p-0 focus:outline-0 border-0 focus:border-0 focus:ring-0 text-base text-ink-gray-8 h-full placeholder:text-ink-gray-4 w-full",
                placeholder: $props.placeholder || "",
                disabled: $props.disabled,
                autocomplete: "off"
              }, null, 8, ["value", "placeholder", "disabled"])
            ]),
            createVNode($setup["ComboboxTrigger"], { disabled: $props.disabled }, {
              default: withCtx(() => [
                createVNode($setup["LucideChevronDown"], { class: "h-4 w-4 text-ink-gray-5" })
              ]),
              _: 1
              /* STABLE */
            }, 8, ["disabled"])
          ]),
          _: 1
          /* STABLE */
        }, 8, ["class"]),
        createVNode($setup["ComboboxPortal"], null, {
          default: withCtx(() => [
            createVNode($setup["ComboboxContent"], {
              class: "z-10 min-w-[--reka-combobox-trigger-width] mt-1 bg-surface-modal overflow-hidden rounded-lg shadow-2xl",
              position: "popper",
              onOpenAutoFocus: _cache[0] || (_cache[0] = withModifiers(() => {
              }, ["prevent"])),
              onCloseAutoFocus: _cache[1] || (_cache[1] = withModifiers(() => {
              }, ["prevent"])),
              align: "start"
            }, {
              default: withCtx(() => [
                createVNode($setup["ComboboxViewport"], {
                  class: normalizeClass(["max-h-60 overflow-auto pb-1.5", { "px-1.5 pt-1.5": !$setup.isGroup($setup.filteredOptions[0]) }])
                }, {
                  default: withCtx(() => [
                    createVNode($setup["ComboboxEmpty"], { class: "text-ink-gray-5 text-base text-center py-1.5 px-2.5" }, {
                      default: withCtx(() => [
                        createTextVNode(
                          ' No results found for "' + toDisplayString($setup.searchTerm) + '" ',
                          1
                          /* TEXT */
                        )
                      ]),
                      _: 1
                      /* STABLE */
                    }),
                    (openBlock(true), createElementBlock(
                      Fragment,
                      null,
                      renderList($setup.filteredOptions, (optionOrGroup, index) => {
                        return openBlock(), createElementBlock(
                          Fragment,
                          { key: index },
                          [
                            $setup.isGroup(optionOrGroup) ? (openBlock(), createBlock(
                              $setup["ComboboxGroup"],
                              {
                                key: 0,
                                class: "px-1.5"
                              },
                              {
                                default: withCtx(() => [
                                  createVNode(
                                    $setup["ComboboxLabel"],
                                    { class: "px-2.5 pt-3 pb-1.5 text-sm font-medium text-ink-gray-5 sticky top-0 bg-surface-modal z-10" },
                                    {
                                      default: withCtx(() => [
                                        createTextVNode(
                                          toDisplayString(optionOrGroup.group),
                                          1
                                          /* TEXT */
                                        )
                                      ]),
                                      _: 2
                                      /* DYNAMIC */
                                    },
                                    1024
                                    /* DYNAMIC_SLOTS */
                                  ),
                                  (openBlock(true), createElementBlock(
                                    Fragment,
                                    null,
                                    renderList(optionOrGroup.options, (option, idx) => {
                                      return openBlock(), createBlock($setup["ComboboxItem"], {
                                        key: `${index}-${idx}`,
                                        value: $setup.getValue(option),
                                        disabled: $setup.isDisabled(option),
                                        class: "text-base leading-none text-ink-gray-7 rounded flex items-center h-7 px-2.5 py-1.5 relative select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-surface-gray-3"
                                      }, {
                                        default: withCtx(() => [
                                          createBaseVNode("span", _hoisted_3, [
                                            createVNode($setup["RenderIcon"], {
                                              icon: $setup.getIcon(option)
                                            }, null, 8, ["icon"]),
                                            createTextVNode(
                                              " " + toDisplayString($setup.getLabel(option)),
                                              1
                                              /* TEXT */
                                            )
                                          ]),
                                          createVNode($setup["ComboboxItemIndicator"], { class: "inline-flex ml-2 items-center justify-center" }, {
                                            default: withCtx(() => [
                                              createVNode($setup["LucideCheck"], { class: "size-4" })
                                            ]),
                                            _: 1
                                            /* STABLE */
                                          })
                                        ]),
                                        _: 2
                                        /* DYNAMIC */
                                      }, 1032, ["value", "disabled"]);
                                    }),
                                    128
                                    /* KEYED_FRAGMENT */
                                  ))
                                ]),
                                _: 2
                                /* DYNAMIC */
                              },
                              1024
                              /* DYNAMIC_SLOTS */
                            )) : (openBlock(), createBlock($setup["ComboboxItem"], {
                              key: index,
                              value: $setup.getValue(optionOrGroup),
                              disabled: $setup.isDisabled(optionOrGroup),
                              class: "text-base leading-none text-ink-gray-7 rounded flex items-center h-7 px-2.5 py-1.5 relative select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-surface-gray-3"
                            }, {
                              default: withCtx(() => [
                                createBaseVNode("span", _hoisted_4, [
                                  $setup.getIcon(optionOrGroup) ? (openBlock(), createBlock($setup["RenderIcon"], {
                                    key: 0,
                                    icon: $setup.getIcon(optionOrGroup)
                                  }, null, 8, ["icon"])) : createCommentVNode("v-if", true),
                                  createTextVNode(
                                    " " + toDisplayString($setup.getLabel(optionOrGroup)),
                                    1
                                    /* TEXT */
                                  )
                                ]),
                                createVNode($setup["ComboboxItemIndicator"], { class: "absolute right-0 w-6 inline-flex items-center justify-center" }, {
                                  default: withCtx(() => [
                                    createVNode($setup["LucideCheck"], { class: "h-4 w-4" })
                                  ]),
                                  _: 1
                                  /* STABLE */
                                })
                              ]),
                              _: 2
                              /* DYNAMIC */
                            }, 1032, ["value", "disabled"]))
                          ],
                          64
                          /* STABLE_FRAGMENT */
                        );
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]),
                  _: 1
                  /* STABLE */
                }, 8, ["class"])
              ]),
              _: 1
              /* STABLE */
            })
          ]),
          _: 1
          /* STABLE */
        })
      ]),
      _: 1
      /* STABLE */
    }, 8, ["model-value"])
  ]);
}
_sfc_main.__file = "src/components/Combobox/Combobox.vue";
const Combobox = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Combobox/Combobox.vue"]]);
export {
  Combobox as C,
  LucideCheck as L
};
