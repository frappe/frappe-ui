import { aC as defineComponent, aN as ref, b3 as watch, aF as computed, az as openBlock, aA as createElementBlock, aM as createVNode, aP as withCtx, aI as normalizeClass, aB as createBaseVNode, aH as createBlock, aK as createCommentVNode, a_ as withModifiers, aQ as createTextVNode, aL as toDisplayString, aT as Fragment, aS as renderList, aG as renderSlot, aJ as resolveDynamicComponent, bi as ComboboxAnchor_default, bj as ComboboxContent_default, bk as ComboboxEmpty_default, bl as ComboboxGroup_default, bm as ComboboxInput_default, bn as ComboboxItem_default, bo as ComboboxItemIndicator_default, bp as ComboboxLabel_default, bq as ComboboxPortal_default, br as ComboboxRoot_default, bs as ComboboxTrigger_default, bt as ComboboxViewport_default, bu as h, ay as markRaw, aR as reactive, aO as resolveComponent } from "./vendor-Z3Z6twb9.js";
import { L as LucideCheck } from "./check-Dd9LrAlQ.js";
import { L as LucideChevronDown } from "./chevron-down-BXGBFc47.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { L as LucidePlus } from "./plus-5mplhOBa.js";
import { S as Settings } from "./settings-BmAg1D8A.js";
import { A as Avatar } from "./Avatar-d8jw2j2h.js";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Combobox",
  props: {
    variant: { type: String, required: false, default: "subtle" },
    options: { type: Array, required: true, default: () => [] },
    modelValue: { type: [String, null], required: false },
    placeholder: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    openOnFocus: { type: Boolean, required: false },
    openOnClick: { type: Boolean, required: false },
    placement: { type: String, required: false }
  },
  emits: [
    "update:modelValue",
    "update:selectedOption",
    "focus",
    "blur",
    "input"
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
    watch(
      () => getDisplayValue(props.modelValue),
      (newDisplay) => {
        if (!userHasTyped.value) searchTerm.value = newDisplay;
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
      emit("input", searchTerm.value);
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
    const variantClasses = computed(() => {
      const borderCss = "border focus-within:border-outline-gray-4 focus-within:ring-2 focus-within:ring-outline-gray-3";
      return {
        subtle: `${borderCss} bg-surface-gray-2 hover:bg-surface-gray-3 border-transparent`,
        outline: `${borderCss} border-outline-gray-2`,
        ghost: ""
      }[props.variant];
    });
    __expose({
      reset
    });
    const __returned__ = { props, emit, searchTerm, internalModelValue, isOpen, userHasTyped, lastSearchTerm, onUpdateModelValue, isGroup, isCustomOption, getLabel, getValue, getKey, isDisabled, getIcon, getSlotName, getRenderFunction, allOptionsFlat, getDisplayValue, selectedOption, selectedOptionIcon, RenderIcon, shouldShowOption, filterFunction, filteredOptions, handleInputChange, handleOpenChange, handleFocus, handleBlur, handleClick, reset, variantClasses, get ComboboxAnchor() {
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
const _hoisted_1$2 = { class: "relative" };
const _hoisted_2$1 = { class: "flex items-center gap-2 flex-1 overflow-hidden" };
const _hoisted_3$1 = { class: "flex items-center gap-2 pr-6 flex-1" };
const _hoisted_4$1 = { class: "flex items-center gap-2 pr-6 flex-1" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$2, [
    createVNode($setup["ComboboxRoot"], {
      "model-value": $setup.internalModelValue,
      "onUpdate:modelValue": $setup.onUpdateModelValue,
      "onUpdate:open": $setup.handleOpenChange,
      "ignore-filter": true,
      open: $setup.isOpen
    }, {
      default: withCtx(() => [
        createVNode($setup["ComboboxAnchor"], {
          class: normalizeClass(["flex h-7 w-full items-center justify-between gap-2 rounded px-2 py-1 transition-colors", {
            "opacity-50 pointer-events-none": $props.disabled,
            [$setup.variantClasses]: true
          }]),
          onClick: $setup.handleClick
        }, {
          default: withCtx(() => [
            createBaseVNode("div", _hoisted_2$1, [
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
              align: $setup.props.placement || "start"
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
                                              createBaseVNode("span", _hoisted_3$1, [
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
                                    createBaseVNode("span", _hoisted_4$1, [
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
            }, 8, ["align"])
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
_sfc_main$1.__file = "src/components/Combobox/Combobox.vue";
const Combobox = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Combobox/Combobox.vue"]]);
const _hoisted_1$1 = {
  class: "lucide lucide-search",
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
      { d: "m21 21-4.34-4.34" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "circle",
      {
        cx: "11",
        cy: "11",
        r: "8"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideSearch = markRaw({ name: "lucide-search", render });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Combobox.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const simpleValue = ref("");
    const objectValue = ref("");
    const iconValue = ref("");
    const groupedValue = ref("");
    const disabledValue = ref("");
    const preselectedValue = ref("john-doe");
    const customOptionValue = ref("");
    const customWithRenderValue = ref("");
    const customWithSlotValue = ref("");
    const selectedOption = ref(null);
    const simpleOptions = [
      "John Doe",
      "Jane Doe",
      "John Smith",
      "Jane Smith",
      "John Wayne",
      "Jane Wayne",
      "Alice Johnson",
      "Bob Wilson",
      "Charlie Brown",
      "Diana Prince"
    ];
    const objectOptions = [
      { label: "John Doe", value: "john-doe" },
      { label: "Jane Doe", value: "jane-doe" },
      { label: "John Smith", value: "john-smith" },
      { label: "Jane Smith", value: "jane-smith", disabled: true },
      { label: "John Wayne", value: "john-wayne" },
      { label: "Jane Wayne", value: "jane-wayne" },
      { label: "Alice Johnson", value: "alice-johnson" },
      { label: "Bob Wilson", value: "bob-wilson" }
    ];
    const optionsWithIcons = [
      { label: "Dashboard", value: "dashboard", icon: "📊" },
      { label: "Projects", value: "projects", icon: "📁" },
      { label: "Tasks", value: "tasks", icon: "✅" },
      { label: "Calendar", value: "calendar", icon: "📅" },
      { label: "Reports", value: "reports", icon: "📈" },
      { label: "Settings", value: "settings", icon: "⚙️" }
    ];
    const groupedOptions = [
      {
        group: "Fruits",
        options: [
          { label: "Apple", value: "apple", icon: "🍎" },
          { label: "Banana", value: "banana", icon: "🍌" },
          { label: "Orange", value: "orange", icon: "🍊" },
          { label: "Grape", value: "grape", icon: "🍇" }
        ]
      },
      {
        group: "Vegetables",
        options: [
          { label: "Carrot", value: "carrot", icon: "🥕" },
          { label: "Broccoli", value: "broccoli", icon: "🥦" },
          { label: "Tomato", value: "tomato", icon: "🍅" },
          { label: "Lettuce", value: "lettuce", icon: "🥬" }
        ]
      },
      {
        group: "Proteins",
        options: [
          { label: "Chicken", value: "chicken", icon: "🍗" },
          { label: "Fish", value: "fish", icon: "🐟" },
          { label: "Beef", value: "beef", icon: "🥩" },
          { label: "Tofu", value: "tofu", icon: "🪤", disabled: true }
        ]
      }
    ];
    const customOptions = [
      ...objectOptions,
      {
        type: "custom",
        key: "create-new",
        label: "Create New Item",
        icon: LucidePlus,
        condition: (context) => context.searchTerm.toLowerCase().includes("new") || context.searchTerm.toLowerCase().includes("create"),
        onClick: (context) => {
          alert(`Creating new item: "${context.searchTerm}"`);
        }
      },
      {
        type: "custom",
        key: "advanced-search",
        label: "Advanced Search",
        icon: LucideSearch,
        condition: (context) => context.searchTerm.length > 3,
        onClick: (context) => {
          alert(`Opening advanced search for: "${context.searchTerm}"`);
        },
        keepOpen: true
      }
    ];
    const customRenderOptions = [
      ...objectOptions.slice(0, 3),
      {
        type: "custom",
        key: "help-option",
        label: "Need Help?",
        render: () => [
          h(Settings, { class: "size-4" }),
          h("span", { class: "font-medium ml-2" }, "Need Help?")
        ],
        onClick: () => {
          alert("Opening help documentation...");
        }
      }
    ];
    const customSlotOptions = [
      ...objectOptions.slice(0, 2),
      {
        type: "custom",
        key: "user-profile",
        label: "View User Profile",
        slotName: "user-profile",
        onClick: () => {
          alert("Opening user profile...");
        }
      },
      {
        type: "custom",
        key: "settings",
        label: "Open Settings",
        slotName: "settings",
        condition: (context) => context.searchTerm.toLowerCase().includes("setting") || context.searchTerm.toLowerCase().includes("config"),
        onClick: () => {
          alert("Opening settings...");
        }
      }
    ];
    const state = reactive({
      disabled: false,
      placeholder: "Select an option...",
      showCancel: true
    });
    const __returned__ = { simpleValue, objectValue, iconValue, groupedValue, disabledValue, preselectedValue, customOptionValue, customWithRenderValue, customWithSlotValue, selectedOption, simpleOptions, objectOptions, optionsWithIcons, groupedOptions, customOptions, customRenderOptions, customSlotOptions, state, Combobox, get LucideSettings() {
      return Settings;
    }, get Avatar() {
      return Avatar;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-4" };
const _hoisted_2 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_3 = { class: "p-4" };
const _hoisted_4 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_5 = { class: "p-4" };
const _hoisted_6 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_7 = { class: "p-4" };
const _hoisted_8 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_9 = { class: "p-4" };
const _hoisted_10 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_11 = { class: "p-4" };
const _hoisted_12 = { class: "p-4" };
const _hoisted_13 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_14 = { class: "p-4" };
const _hoisted_15 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_16 = { class: "p-4" };
const _hoisted_17 = { class: "mt-2 text-sm text-gray-600" };
const _hoisted_18 = { class: "p-4" };
const _hoisted_19 = { class: "flex items-center gap-2" };
const _hoisted_20 = { class: "mt-2 text-sm text-gray-600" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstText = resolveComponent("HstText");
  const _component_HstCheckbox = resolveComponent("HstCheckbox");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, {
    title: "Combobox",
    layout: { type: "grid", width: 400 }
  }, {
    controls: withCtx(() => [
      createVNode(_component_HstText, {
        modelValue: $setup.state.placeholder,
        "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => $setup.state.placeholder = $event),
        title: "Placeholder"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.disabled,
        "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => $setup.state.disabled = $event),
        title: "Disabled"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Simple String Options" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            _cache[14] || (_cache[14] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Simple Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.simpleOptions,
              modelValue: $setup.simpleValue,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.simpleValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled,
              "show-cancel": $setup.state.showCancel,
              "onUpdate:selectedOption": _cache[1] || (_cache[1] = ($event) => $setup.selectedOption = $event)
            }, null, 8, ["modelValue", "placeholder", "disabled", "show-cancel"]),
            createBaseVNode(
              "div",
              _hoisted_2,
              " Selected: " + toDisplayString($setup.simpleValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Outline variant" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_3, [
            _cache[15] || (_cache[15] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Simple Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              variant: "outline",
              options: $setup.simpleOptions,
              modelValue: $setup.simpleValue,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.simpleValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled,
              "show-cancel": $setup.state.showCancel,
              "onUpdate:selectedOption": _cache[3] || (_cache[3] = ($event) => $setup.selectedOption = $event)
            }, null, 8, ["modelValue", "placeholder", "disabled", "show-cancel"]),
            createBaseVNode(
              "div",
              _hoisted_4,
              " Selected: " + toDisplayString($setup.simpleValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Object Options" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_5, [
            _cache[16] || (_cache[16] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Object Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.objectOptions,
              modelValue: $setup.objectValue,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.objectValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled,
              "show-cancel": $setup.state.showCancel
            }, null, 8, ["modelValue", "placeholder", "disabled", "show-cancel"]),
            createBaseVNode(
              "div",
              _hoisted_6,
              " Selected: " + toDisplayString($setup.objectValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Options with Icons" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_7, [
            _cache[17] || (_cache[17] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Options with Icons",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.optionsWithIcons,
              modelValue: $setup.iconValue,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $setup.iconValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_8,
              " Selected: " + toDisplayString($setup.iconValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Grouped Options" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_9, [
            _cache[18] || (_cache[18] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Grouped Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.groupedOptions,
              modelValue: $setup.groupedValue,
              "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => $setup.groupedValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_10,
              " Selected: " + toDisplayString($setup.groupedValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Disabled State" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_11, [
            _cache[19] || (_cache[19] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Disabled Combobox",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.simpleOptions,
              modelValue: $setup.disabledValue,
              "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => $setup.disabledValue = $event),
              placeholder: "This is disabled",
              disabled: true
            }, null, 8, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Pre-selected Value" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_12, [
            _cache[20] || (_cache[20] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Pre-selected Value",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.objectOptions,
              modelValue: $setup.preselectedValue,
              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => $setup.preselectedValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_13,
              " Selected: " + toDisplayString($setup.preselectedValue || "None"),
              1
              /* TEXT */
            )
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Custom Options with onClick" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_14, [
            _cache[21] || (_cache[21] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              "Custom Options",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.customOptions,
              modelValue: $setup.customOptionValue,
              "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $setup.customOptionValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled,
              "show-cancel": $setup.state.showCancel
            }, null, 8, ["modelValue", "placeholder", "disabled", "show-cancel"]),
            createBaseVNode(
              "div",
              _hoisted_15,
              " Selected: " + toDisplayString($setup.customOptionValue || "None"),
              1
              /* TEXT */
            ),
            _cache[22] || (_cache[22] = createBaseVNode(
              "div",
              { class: "mt-2 text-xs text-gray-500" },
              " Try typing 'new' or 'create' to see custom options ",
              -1
              /* HOISTED */
            ))
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Custom Options with Render Function" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_16, [
            _cache[23] || (_cache[23] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              " Custom Render Options ",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.customRenderOptions,
              modelValue: $setup.customWithRenderValue,
              "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $setup.customWithRenderValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, null, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_17,
              " Selected: " + toDisplayString($setup.customWithRenderValue || "None"),
              1
              /* TEXT */
            ),
            _cache[24] || (_cache[24] = createBaseVNode(
              "div",
              { class: "mt-2 text-xs text-gray-500" },
              " Custom options with render functions and conditional display ",
              -1
              /* HOISTED */
            ))
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Custom Options with Slots" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_18, [
            _cache[27] || (_cache[27] = createBaseVNode(
              "label",
              { class: "block text-sm font-medium mb-2" },
              " Custom Slot Options ",
              -1
              /* HOISTED */
            )),
            createVNode($setup["Combobox"], {
              options: $setup.customSlotOptions,
              modelValue: $setup.customWithSlotValue,
              "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => $setup.customWithSlotValue = $event),
              placeholder: $setup.state.placeholder,
              disabled: $setup.state.disabled
            }, {
              "user-profile": withCtx(({ option }) => [
                createVNode($setup["Avatar"], {
                  label: "F",
                  size: "sm"
                }),
                _cache[25] || (_cache[25] = createBaseVNode(
                  "span",
                  { class: "ml-2" },
                  " View User Profile → ",
                  -1
                  /* HOISTED */
                ))
              ]),
              settings: withCtx(({ option }) => [
                createBaseVNode("div", _hoisted_19, [
                  createVNode($setup["LucideSettings"], { class: "w-4 h-4 text-gray-600" }),
                  _cache[26] || (_cache[26] = createBaseVNode(
                    "div",
                    { class: "font-medium text-sm" },
                    "Open Settings",
                    -1
                    /* HOISTED */
                  ))
                ])
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue", "placeholder", "disabled"]),
            createBaseVNode(
              "div",
              _hoisted_20,
              " Selected: " + toDisplayString($setup.customWithSlotValue || "None"),
              1
              /* TEXT */
            ),
            _cache[28] || (_cache[28] = createBaseVNode(
              "div",
              { class: "mt-2 text-xs text-gray-500" },
              " Try typing 'setting' to see the settings option. Slots allow full template control. ",
              -1
              /* HOISTED */
            ))
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
_sfc_main.__file = "src/components/Combobox/Combobox.story.vue";
const Combobox_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Combobox/Combobox.story.vue"]]);
export {
  Combobox_story as default
};
