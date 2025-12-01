import { aC as defineComponent, aN as ref, aF as computed, b3 as watch, aY as nextTick, az as openBlock, aH as createBlock, aP as withCtx, aM as createVNode, aG as renderSlot, bc as normalizeProps, bd as guardReactiveProps, aB as createBaseVNode, aA as createElementBlock, aL as toDisplayString, aK as createCommentVNode, aI as normalizeClass, bf as withDirectives, aT as Fragment, aS as renderList, aU as mergeProps, bg as vShow, a_ as withModifiers, bN as lt, bO as it, bP as rt, bQ as ut } from "./vendor-DVeEFjyo.js";
import { F as FeatherIcon } from "./FeatherIcon-BGhd6Bgj.js";
import { B as Button, L as LoadingIndicator } from "./Button-e4mNc2B-.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { _ as __unplugin_components_1 } from "./Popover-NMMjY9D9.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Autocomplete",
  props: {
    label: { type: String, required: false },
    options: { type: Array, required: true },
    hideSearch: { type: Boolean, required: false, default: false },
    placeholder: { type: String, required: false },
    bodyClasses: { type: [String, Array], required: false },
    loading: { type: Boolean, required: false },
    placement: { type: String, required: false },
    showFooter: { type: Boolean, required: false },
    compareFn: { type: Function, required: false, default: (a, b) => a.value === b.value },
    maxOptions: { type: Number, required: false, default: 50 },
    multiple: { type: Boolean, required: false, default: false },
    modelValue: { type: [Array, null, String, Number, Boolean, Object], required: false }
  },
  emits: ["update:modelValue", "update:query", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const searchInput = ref();
    const showOptions = ref(false);
    const query = ref("");
    const groups = computed(() => {
      var _a;
      if (!((_a = props.options) == null ? void 0 : _a.length)) return [];
      let groups2;
      if (isOptionGroup(props.options[0])) {
        groups2 = props.options;
      } else {
        groups2 = [
          {
            group: "",
            items: sanitizeOptions(props.options),
            hideLabel: false
          }
        ];
      }
      return groups2.map((group, i) => {
        return {
          key: i,
          group: group.group,
          hideLabel: group.hideLabel,
          items: filterOptions(sanitizeOptions(group.items || []))
        };
      }).filter((group) => group.items.length > 0);
    });
    const allOptions = computed(() => {
      return groups.value.flatMap((group) => group.items);
    });
    const sanitizeOptions = (options) => {
      if (!options) return [];
      return options.map((option) => {
        return isOption(option) ? option : { label: option.toString(), value: option };
      });
    };
    const filterOptions = (options) => {
      if (!query.value) return options;
      return options.filter((option) => {
        return option.label.toLowerCase().includes(query.value.trim().toLowerCase()) || option.value.toString().toLowerCase().includes(query.value.trim().toLowerCase());
      });
    };
    const selectedValue = computed({
      get() {
        if (!props.multiple) {
          return findOption(props.modelValue) || // if the modelValue is not found in the option list
          // return the modelValue as is
          makeOption(props.modelValue);
        }
        const values = props.modelValue || [];
        return isOption(values[0]) ? values : values.map((v) => findOption(v) || makeOption(v));
      },
      set(val) {
        query.value = "";
        if (val && !props.multiple) showOptions.value = false;
        emit("update:modelValue", val);
        emit("change", val);
      }
    });
    const findOption = (option) => {
      if (!option) return option;
      const value = isOption(option) ? option.value : option;
      return allOptions.value.find((o) => o.value === value);
    };
    const makeOption = (option) => {
      return isOption(option) ? option : { label: option, value: option };
    };
    const getLabel = (option) => {
      if (isOption(option)) {
        return (option == null ? void 0 : option.label) || (option == null ? void 0 : option.value);
      }
      return option;
    };
    const displayValue = computed(() => {
      if (!selectedValue.value) return "";
      if (!props.multiple) {
        return getLabel(selectedValue.value);
      }
      return selectedValue.value.map((v) => getLabel(v)).join(", ");
    });
    const isOptionSelected = (option) => {
      if (!selectedValue.value) return false;
      const value = isOption(option) ? option.value : option;
      if (!props.multiple) {
        return selectedValue.value === value;
      }
      return selectedValue.value.find(
        (v) => isOption(v) ? v.value === value : v === value
      );
    };
    const areAllOptionsSelected = computed(() => {
      var _a;
      if (!props.multiple) return false;
      return allOptions.value.length === ((_a = selectedValue.value) == null ? void 0 : _a.length);
    });
    const selectAll = () => {
      selectedValue.value = allOptions.value;
    };
    const clearAll = () => {
      selectedValue.value = props.multiple ? [] : void 0;
    };
    const isOption = (option) => {
      return typeof option === "object";
    };
    const isOptionGroup = (option) => {
      return typeof option === "object" && "items" in option && "group" in option;
    };
    watch(
      () => query.value,
      () => {
        emit("update:query", query.value);
      }
    );
    watch(
      () => showOptions.value,
      () => {
        if (showOptions.value) {
          nextTick(() => {
            var _a;
            return (_a = searchInput.value) == null ? void 0 : _a.$el.focus();
          });
        }
      }
    );
    const rootRef = ref();
    const togglePopover = () => {
      showOptions.value = !showOptions.value;
    };
    __expose({
      rootRef,
      togglePopover
    });
    const __returned__ = { props, emit, searchInput, showOptions, query, groups, allOptions, sanitizeOptions, filterOptions, selectedValue, findOption, makeOption, getLabel, displayValue, isOptionSelected, areAllOptionsSelected, selectAll, clearAll, isOption, isOptionGroup, rootRef, togglePopover, get Combobox() {
      return lt;
    }, get ComboboxInput() {
      return it;
    }, get ComboboxOption() {
      return rt;
    }, get ComboboxOptions() {
      return ut;
    }, get Popover() {
      return __unplugin_components_1;
    }, get Button() {
      return Button;
    }, FeatherIcon, LoadingIndicator };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "w-full space-y-1.5" };
const _hoisted_2 = {
  key: 0,
  class: "block text-xs text-ink-gray-5"
};
const _hoisted_3 = ["onClick"];
const _hoisted_4 = { class: "flex items-center overflow-hidden" };
const _hoisted_5 = {
  key: 0,
  class: "truncate text-base leading-5 text-ink-gray-8"
};
const _hoisted_6 = {
  key: 1,
  class: "text-base leading-5 text-ink-gray-4"
};
const _hoisted_7 = {
  key: 0,
  class: "sticky top-0 z-10 flex items-stretch space-x-1.5 bg-surface-modal py-1.5"
};
const _hoisted_8 = { class: "relative w-full" };
const _hoisted_9 = { class: "absolute right-0 inline-flex h-7 w-7 items-center justify-center" };
const _hoisted_10 = {
  key: 0,
  class: "sticky top-10 truncate bg-surface-modal px-2.5 py-1.5 text-sm font-medium text-ink-gray-5"
};
const _hoisted_11 = { class: "flex flex-1 gap-2 overflow-hidden items-center" };
const _hoisted_12 = {
  key: 0,
  class: "flex flex-shrink-0"
};
const _hoisted_13 = {
  key: 1,
  class: "h-4 w-4"
};
const _hoisted_14 = { class: "flex-1 truncate text-ink-gray-7" };
const _hoisted_15 = {
  key: 0,
  class: "ml-2 flex-shrink-0"
};
const _hoisted_16 = {
  key: 0,
  class: "text-sm text-ink-gray-5"
};
const _hoisted_17 = {
  key: 1,
  class: "rounded-md px-2.5 py-1.5 text-base text-ink-gray-5"
};
const _hoisted_18 = {
  key: 0,
  class: "border-t p-1"
};
const _hoisted_19 = {
  key: 0,
  class: "flex items-center justify-end"
};
const _hoisted_20 = {
  key: 1,
  class: "flex items-center justify-end"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Combobox"], {
    modelValue: $setup.selectedValue,
    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.selectedValue = $event),
    multiple: $props.multiple,
    nullable: "",
    by: $props.compareFn
  }, {
    default: withCtx(({ open: isComboboxOpen }) => [
      createVNode($setup["Popover"], {
        class: "w-full",
        show: $setup.showOptions,
        "onUpdate:show": _cache[1] || (_cache[1] = ($event) => $setup.showOptions = $event),
        ref: "rootRef",
        placement: $props.placement,
        "match-target-width": true
      }, {
        target: withCtx(({ open: openPopover, togglePopover, close: closePopover }) => [
          renderSlot(_ctx.$slots, "target", normalizeProps(guardReactiveProps({
            open: openPopover,
            close: closePopover,
            togglePopover,
            isOpen: isComboboxOpen
          })), () => [
            createBaseVNode("div", _hoisted_1, [
              $setup.props.label ? (openBlock(), createElementBlock(
                "label",
                _hoisted_2,
                toDisplayString($setup.props.label),
                1
                /* TEXT */
              )) : createCommentVNode("v-if", true),
              createBaseVNode("button", {
                class: normalizeClass(["flex h-7 w-full items-center justify-between gap-2 rounded bg-surface-gray-2 px-2 py-1 transition-colors hover:bg-surface-gray-3 border border-transparent focus:border-outline-gray-4 focus:outline-none focus:ring-2 focus:ring-outline-gray-3", { "bg-surface-gray-3": isComboboxOpen }]),
                onClick: () => togglePopover()
              }, [
                createBaseVNode("div", _hoisted_4, [
                  renderSlot(_ctx.$slots, "prefix"),
                  $setup.displayValue ? (openBlock(), createElementBlock(
                    "span",
                    _hoisted_5,
                    toDisplayString($setup.displayValue),
                    1
                    /* TEXT */
                  )) : (openBlock(), createElementBlock(
                    "span",
                    _hoisted_6,
                    toDisplayString($props.placeholder || ""),
                    1
                    /* TEXT */
                  )),
                  renderSlot(_ctx.$slots, "suffix")
                ]),
                createVNode($setup["FeatherIcon"], {
                  name: "chevron-down",
                  class: "h-4 w-4 text-ink-gray-5",
                  "aria-hidden": "true"
                })
              ], 10, _hoisted_3)
            ])
          ])
        ]),
        body: withCtx(({ isOpen, togglePopover }) => [
          withDirectives(createBaseVNode(
            "div",
            null,
            [
              createBaseVNode(
                "div",
                {
                  class: normalizeClass(["relative mt-1 rounded-lg bg-surface-modal text-base shadow-2xl", $props.bodyClasses])
                },
                [
                  createVNode($setup["ComboboxOptions"], {
                    class: normalizeClass(["max-h-[15rem] overflow-y-auto px-1.5 pb-1.5", { "pt-1.5": $props.hideSearch }]),
                    static: ""
                  }, {
                    default: withCtx(() => [
                      !$props.hideSearch ? (openBlock(), createElementBlock("div", _hoisted_7, [
                        createBaseVNode("div", _hoisted_8, [
                          createVNode($setup["ComboboxInput"], {
                            ref: "searchInput",
                            class: "form-input w-full focus:bg-surface-gray-3 hover:bg-surface-gray-4 text-ink-gray-8",
                            type: "text",
                            value: $setup.query,
                            onChange: _cache[0] || (_cache[0] = ($event) => $setup.query = $event.target.value),
                            autocomplete: "off",
                            placeholder: "Search"
                          }, null, 8, ["value"]),
                          createBaseVNode("div", _hoisted_9, [
                            $setup.props.loading ? (openBlock(), createBlock($setup["LoadingIndicator"], {
                              key: 0,
                              class: "h-4 w-4 text-ink-gray-5"
                            })) : (openBlock(), createElementBlock("button", {
                              key: 1,
                              onClick: $setup.clearAll
                            }, [
                              createVNode($setup["FeatherIcon"], {
                                name: "x",
                                class: "w-4 text-ink-gray-8"
                              })
                            ]))
                          ])
                        ])
                      ])) : createCommentVNode("v-if", true),
                      (openBlock(true), createElementBlock(
                        Fragment,
                        null,
                        renderList($setup.groups, (group) => {
                          return withDirectives((openBlock(), createElementBlock("div", {
                            key: group.key
                          }, [
                            group.group && !group.hideLabel ? (openBlock(), createElementBlock(
                              "div",
                              _hoisted_10,
                              toDisplayString(group.group),
                              1
                              /* TEXT */
                            )) : createCommentVNode("v-if", true),
                            (openBlock(true), createElementBlock(
                              Fragment,
                              null,
                              renderList(group.items.slice(
                                0,
                                $setup.props.maxOptions
                              ), (option, idx) => {
                                return openBlock(), createBlock($setup["ComboboxOption"], {
                                  as: "template",
                                  key: idx,
                                  value: option,
                                  disabled: option.disabled
                                }, {
                                  default: withCtx(({ active, selected }) => [
                                    createBaseVNode(
                                      "li",
                                      {
                                        class: normalizeClass([
                                          "flex cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-base",
                                          {
                                            "bg-surface-gray-3": active,
                                            "opacity-50": option.disabled
                                          }
                                        ])
                                      },
                                      [
                                        createBaseVNode("div", _hoisted_11, [
                                          _ctx.$slots["item-prefix"] || $setup.props.multiple ? (openBlock(), createElementBlock("div", _hoisted_12, [
                                            renderSlot(_ctx.$slots, "item-prefix", mergeProps({ ref_for: true }, { active, selected, option }), () => [
                                              $setup.isOptionSelected(option) ? (openBlock(), createBlock($setup["FeatherIcon"], {
                                                key: 0,
                                                name: "check",
                                                class: "h-4 w-4 text-ink-gray-7"
                                              })) : (openBlock(), createElementBlock("div", _hoisted_13))
                                            ])
                                          ])) : createCommentVNode("v-if", true),
                                          createBaseVNode(
                                            "span",
                                            _hoisted_14,
                                            toDisplayString($setup.getLabel(option)),
                                            1
                                            /* TEXT */
                                          )
                                        ]),
                                        _ctx.$slots["item-suffix"] || (option == null ? void 0 : option.description) ? (openBlock(), createElementBlock("div", _hoisted_15, [
                                          renderSlot(_ctx.$slots, "item-suffix", mergeProps({ ref_for: true }, { active, selected, option }), () => [
                                            (option == null ? void 0 : option.description) ? (openBlock(), createElementBlock(
                                              "div",
                                              _hoisted_16,
                                              toDisplayString(option.description),
                                              1
                                              /* TEXT */
                                            )) : createCommentVNode("v-if", true)
                                          ])
                                        ])) : createCommentVNode("v-if", true)
                                      ],
                                      2
                                      /* CLASS */
                                    )
                                  ]),
                                  _: 2
                                  /* DYNAMIC */
                                }, 1032, ["value", "disabled"]);
                              }),
                              128
                              /* KEYED_FRAGMENT */
                            ))
                          ])), [
                            [vShow, group.items.length > 0]
                          ]);
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      )),
                      $setup.groups.length == 0 ? (openBlock(), createElementBlock("li", _hoisted_17, " No results found ")) : createCommentVNode("v-if", true)
                    ]),
                    _: 3
                    /* FORWARDED */
                  }, 8, ["class"]),
                  _ctx.$slots.footer || $setup.props.showFooter || $props.multiple ? (openBlock(), createElementBlock("div", _hoisted_18, [
                    renderSlot(_ctx.$slots, "footer", normalizeProps(guardReactiveProps({ togglePopover })), () => [
                      $props.multiple ? (openBlock(), createElementBlock("div", _hoisted_19, [
                        !$setup.areAllOptionsSelected ? (openBlock(), createBlock($setup["Button"], {
                          key: 0,
                          label: "Select All",
                          onClick: withModifiers($setup.selectAll, ["stop"])
                        })) : createCommentVNode("v-if", true),
                        $setup.areAllOptionsSelected ? (openBlock(), createBlock($setup["Button"], {
                          key: 1,
                          label: "Clear All",
                          onClick: withModifiers($setup.clearAll, ["stop"])
                        })) : createCommentVNode("v-if", true)
                      ])) : (openBlock(), createElementBlock("div", _hoisted_20, [
                        createVNode($setup["Button"], {
                          label: "Clear",
                          onClick: withModifiers($setup.clearAll, ["stop"])
                        })
                      ]))
                    ])
                  ])) : createCommentVNode("v-if", true)
                ],
                2
                /* CLASS */
              )
            ],
            512
            /* NEED_PATCH */
          ), [
            [vShow, isOpen]
          ])
        ]),
        _: 2
        /* DYNAMIC */
      }, 1032, ["show", "placement"])
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["modelValue", "multiple", "by"]);
}
_sfc_main.__file = "src/components/Autocomplete/Autocomplete.vue";
const Autocomplete = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Autocomplete/Autocomplete.vue"]]);
export {
  Autocomplete as A
};
