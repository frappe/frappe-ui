import { aP as markRaw, aB as openBlock, aG as createElementBlock, aF as createBaseVNode, ay as defineComponent, az as ref, bb as watch, aW as computed, cx as ComboboxAnchor_default, cy as ComboboxContent_default, cz as ComboboxEmpty_default, cA as ComboboxGroup_default, cB as ComboboxInput_default, cC as ComboboxItem_default, cD as ComboboxItemIndicator_default, cE as ComboboxLabel_default, cF as ComboboxPortal_default, cG as ComboboxRoot_default, cH as ComboboxTrigger_default, cI as ComboboxViewport_default, aE as createVNode, aD as withCtx, aR as normalizeClass, aC as createBlock, aH as createCommentVNode, a_ as withModifiers, aM as createTextVNode, aN as toDisplayString, aK as Fragment, aJ as renderList, aZ as renderSlot, bx as resolveDynamicComponent, aQ as h } from "./vendor-DsK-IN2t.js";
import { L as LucideChevronDown } from "./chevron-down-BO4-o0FC.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _hoisted_1$2 = {
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
function render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$2, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "M20 6 9 17l-5-5" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideCheck = markRaw({ name: "lucide-check", render: render$1 });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Combobox",
  props: {
    options: { type: Array, required: true },
    modelValue: { type: [String, null], required: false },
    placeholder: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    openOnFocus: { type: Boolean, required: false },
    openOnClick: { type: Boolean, required: false }
  },
  emits: [
    "update:modelValue",
    "update:selectedOption",
    "focus",
    "blur"
  ],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const searchTerm = ref(getDisplayValue(props.modelValue));
    const internalModelValue = ref(props.modelValue);
    const isOpen = ref(false);
    const userHasTyped = ref(false);
    const lastSearchTerm = ref("");
    watch(
      () => props.modelValue,
      (newValue) => {
        internalModelValue.value = newValue;
        searchTerm.value = getDisplayValue(newValue);
      }
    );
    const onUpdateModelValue = (value) => {
      const selectedOpt = value ? allOptionsFlat.value.find((opt) => getKey(opt) === value) || null : null;
      if (selectedOpt && isCustomOption(selectedOpt)) {
        const context = { searchTerm: lastSearchTerm.value };
        selectedOpt.onClick(context);
        if (selectedOpt.keepOpen) {
          setTimeout(() => {
            isOpen.value = true;
          }, 0);
        } else {
          isOpen.value = false;
          searchTerm.value = getDisplayValue(internalModelValue.value);
          lastSearchTerm.value = "";
          userHasTyped.value = false;
        }
        return;
      }
      internalModelValue.value = value;
      emit("update:modelValue", value);
      searchTerm.value = getDisplayValue(value);
      lastSearchTerm.value = "";
      userHasTyped.value = false;
      emit("update:selectedOption", selectedOpt);
    };
    function isGroup(option) {
      return typeof option === "object" && "group" in option;
    }
    function isCustomOption(option) {
      return typeof option === "object" && option.type === "custom";
    }
    function getLabel(option) {
      return typeof option === "string" ? option : option.label;
    }
    function getValue(option) {
      if (typeof option === "string") return option;
      if (isCustomOption(option)) return void 0;
      return option.value;
    }
    function getKey(option) {
      if (typeof option === "string") return option;
      if (isCustomOption(option)) return option.key;
      return option.value;
    }
    function isDisabled(option) {
      return typeof option === "object" && !!option.disabled;
    }
    function getIcon(option) {
      return typeof option === "object" ? option.icon : void 0;
    }
    function getSlotName(option) {
      return isCustomOption(option) ? option.slotName : void 0;
    }
    function getRenderFunction(option) {
      return isCustomOption(option) ? option.render : void 0;
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
    const shouldShowOption = (option, search, context) => {
      var _a;
      if (isCustomOption(option)) {
        if (option.condition) {
          return option.condition(context);
        }
        if (!search) return true;
        return getLabel(option).toLowerCase().includes(search.toLowerCase());
      }
      if (!search) return true;
      const label = getLabel(option).toLowerCase();
      const value = ((_a = getValue(option)) == null ? void 0 : _a.toLowerCase()) || "";
      const lowerSearch = search.toLowerCase();
      return label.includes(lowerSearch) || value.includes(lowerSearch);
    };
    const filterFunction = (options, search) => {
      const context = { searchTerm: search };
      const filtered = [];
      options.forEach((optionOrGroup) => {
        if (isGroup(optionOrGroup)) {
          const filteredGroupOptions = optionOrGroup.options.filter(
            (opt) => shouldShowOption(opt, search, context)
          );
          if (filteredGroupOptions.length > 0) {
            filtered.push({ ...optionOrGroup, options: filteredGroupOptions });
          }
        } else if (shouldShowOption(optionOrGroup, search, context)) {
          filtered.push(optionOrGroup);
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
      lastSearchTerm.value = target.value;
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
      if (props.openOnFocus) {
        isOpen.value = true;
      }
      emit("focus", event);
    };
    const handleBlur = (event) => {
      emit("blur", event);
    };
    const handleClick = () => {
      if (props.openOnClick) {
        isOpen.value = true;
      }
    };
    const reset = () => {
      searchTerm.value = "";
      userHasTyped.value = false;
      internalModelValue.value = null;
      emit("update:modelValue", null);
      emit("update:selectedOption", null);
    };
    __expose({
      reset
    });
    const __returned__ = { props, emit, searchTerm, internalModelValue, isOpen, userHasTyped, lastSearchTerm, onUpdateModelValue, isGroup, isCustomOption, getLabel, getValue, getKey, isDisabled, getIcon, getSlotName, getRenderFunction, allOptionsFlat, getDisplayValue, selectedOption, selectedOptionIcon, RenderIcon, shouldShowOption, filterFunction, filteredOptions, handleInputChange, handleOpenChange, handleFocus, handleBlur, handleClick, reset, get ComboboxAnchor() {
      return ComboboxAnchor_default;
    }, get ComboboxContent() {
      return ComboboxContent_default;
    }, get ComboboxEmpty() {
      return ComboboxEmpty_default;
    }, get ComboboxGroup() {
      return ComboboxGroup_default;
    }, get ComboboxInput() {
      return ComboboxInput_default;
    }, get ComboboxItem() {
      return ComboboxItem_default;
    }, get ComboboxItemIndicator() {
      return ComboboxItemIndicator_default;
    }, get ComboboxLabel() {
      return ComboboxLabel_default;
    }, get ComboboxPortal() {
      return ComboboxPortal_default;
    }, get ComboboxRoot() {
      return ComboboxRoot_default;
    }, get ComboboxTrigger() {
      return ComboboxTrigger_default;
    }, get ComboboxViewport() {
      return ComboboxViewport_default;
    }, get LucideCheck() {
      return LucideCheck;
    }, get LucideChevronDown() {
      return LucideChevronDown;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = { class: "relative" };
const _hoisted_2 = { class: "flex items-center gap-2 flex-1 overflow-hidden" };
const _hoisted_3 = { class: "flex items-center gap-2 pr-6 flex-1" };
const _hoisted_4 = { class: "flex items-center gap-2 pr-6 flex-1" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    createVNode($setup["ComboboxRoot"], {
      "model-value": $setup.internalModelValue,
      "onUpdate:modelValue": $setup.onUpdateModelValue,
      "onUpdate:open": $setup.handleOpenChange,
      "ignore-filter": true,
      open: $setup.isOpen
    }, {
      default: withCtx(() => [
        createVNode($setup["ComboboxAnchor"], {
          class: normalizeClass(["flex h-7 w-full items-center justify-between gap-2 rounded bg-surface-gray-2 px-2 py-1 transition-colors hover:bg-surface-gray-3 border border-transparent focus-within:border-outline-gray-4 focus-within:ring-2 focus-within:ring-outline-gray-3", { "opacity-50 pointer-events-none": $props.disabled }]),
          onClick: $setup.handleClick
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
                                        value: $setup.getKey(option),
                                        disabled: $setup.isDisabled(option),
                                        class: "text-base leading-none text-ink-gray-7 rounded flex items-center h-7 px-2.5 py-1.5 relative select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-surface-gray-3"
                                      }, {
                                        default: withCtx(() => [
                                          $setup.getSlotName(option) ? renderSlot(_ctx.$slots, $setup.getSlotName(option), {
                                            key: 0,
                                            option,
                                            searchTerm: $setup.searchTerm
                                          }) : $setup.getRenderFunction(option) ? (openBlock(), createBlock(resolveDynamicComponent($setup.getRenderFunction(option)), { key: 1 })) : (openBlock(), createElementBlock(
                                            Fragment,
                                            { key: 2 },
                                            [
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
                                              createVNode($setup["ComboboxItemIndicator"], { class: "absolute right-0 w-6 inline-flex items-center justify-center" }, {
                                                default: withCtx(() => [
                                                  createVNode($setup["LucideCheck"], { class: "size-4" })
                                                ]),
                                                _: 1
                                                /* STABLE */
                                              })
                                            ],
                                            64
                                            /* STABLE_FRAGMENT */
                                          ))
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
                              value: $setup.getKey(optionOrGroup),
                              disabled: $setup.isDisabled(optionOrGroup),
                              class: "text-base leading-none text-ink-gray-7 rounded flex items-center h-7 px-2.5 py-1.5 relative select-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-surface-gray-3"
                            }, {
                              default: withCtx(() => [
                                $setup.getSlotName(optionOrGroup) ? renderSlot(_ctx.$slots, $setup.getSlotName(optionOrGroup), {
                                  key: 0,
                                  option: optionOrGroup,
                                  searchTerm: $setup.searchTerm
                                }) : $setup.getRenderFunction(optionOrGroup) ? (openBlock(), createBlock(resolveDynamicComponent($setup.getRenderFunction(optionOrGroup)), { key: 1 })) : (openBlock(), createElementBlock(
                                  Fragment,
                                  { key: 2 },
                                  [
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
                                  ],
                                  64
                                  /* STABLE_FRAGMENT */
                                ))
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
                  _: 3
                  /* FORWARDED */
                }, 8, ["class"])
              ]),
              _: 3
              /* FORWARDED */
            })
          ]),
          _: 3
          /* FORWARDED */
        })
      ]),
      _: 3
      /* FORWARDED */
    }, 8, ["model-value", "open"])
  ]);
}
_sfc_main.__file = "src/components/Combobox/Combobox.vue";
const Combobox = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Combobox/Combobox.vue"]]);
const _hoisted_1 = {
  class: "lucide lucide-plus",
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
  return openBlock(), createElementBlock("svg", _hoisted_1, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "M5 12h14" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "M12 5v14" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucidePlus = markRaw({ name: "lucide-plus", render });
export {
  Combobox as C,
  LucidePlus as L,
  LucideCheck as a
};
