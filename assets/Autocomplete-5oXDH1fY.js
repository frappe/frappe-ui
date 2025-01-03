import { ay as defineComponent, az as ref, br as computed, bt as watch, bu as nextTick, bv as lt, bw as it, bx as rt, by as ut, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, bk as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aQ as normalizeClass, aG as createElementBlock, aN as toDisplayString, b0 as withDirectives, aH as createCommentVNode, aK as Fragment, aJ as renderList, aL as mergeProps, b1 as vShow, bz as withModifiers } from "./vendor-CZR7kRIJ.js";
import { P as Popover } from "./Popover-CwVMLQxm.js";
import { B as Button } from "./Button-BudQeXFQ.js";
import { F as FeatherIcon } from "./FeatherIcon-DmwCMaH1.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Autocomplete",
  props: {
    options: { type: Array, required: true },
    hideSearch: { type: Boolean, required: false, default: false },
    placeholder: { type: String, required: false },
    bodyClasses: { type: [String, Array], required: false },
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
          return findOption(props.modelValue);
        }
        let values = props.modelValue;
        if (!values) return [];
        return isOption(values[0]) ? values : values.map((v) => findOption(v));
      },
      set(val) {
        query.value = "";
        if (val && !props.multiple) showOptions.value = false;
        if (!props.multiple) {
          emit("update:modelValue", val);
          return;
        }
        emit("update:modelValue", val);
      }
    });
    const findOption = (option) => {
      if (!option) return option;
      const value = isOption(option) ? option.value : option;
      return allOptions.value.find((o) => o.value === value);
    };
    const getLabel = (option) => {
      if (isOption(option)) {
        return (option == null ? void 0 : option.label) || (option == null ? void 0 : option.value) || "No label";
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
    const __returned__ = { props, emit, searchInput, showOptions, query, groups, allOptions, sanitizeOptions, filterOptions, selectedValue, findOption, getLabel, displayValue, isOptionSelected, areAllOptionsSelected, selectAll, clearAll, isOption, isOptionGroup, rootRef, togglePopover, get Combobox() {
      return lt;
    }, get ComboboxInput() {
      return it;
    }, get ComboboxOption() {
      return rt;
    }, get ComboboxOptions() {
      return ut;
    }, Popover, get Button() {
      return Button;
    }, FeatherIcon };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "w-full" };
const _hoisted_2 = ["onClick"];
const _hoisted_3 = { class: "flex items-center overflow-hidden" };
const _hoisted_4 = {
  key: 0,
  class: "truncate text-base leading-5 text-ink-gray-8"
};
const _hoisted_5 = {
  key: 1,
  class: "text-base leading-5 text-ink-gray-4"
};
const _hoisted_6 = {
  key: 0,
  class: "sticky top-0 z-10 flex items-stretch space-x-1.5 bg-surface-modal py-1.5"
};
const _hoisted_7 = { class: "relative w-full" };
const _hoisted_8 = {
  key: 0,
  class: "sticky top-10 truncate bg-surface-modal px-2.5 py-1.5 text-sm font-medium text-ink-gray-5"
};
const _hoisted_9 = { class: "flex flex-1 gap-2 overflow-hidden items-center" };
const _hoisted_10 = {
  key: 0,
  class: "flex flex-shrink-0"
};
const _hoisted_11 = {
  key: 1,
  class: "h-4 w-4"
};
const _hoisted_12 = { class: "flex-1 truncate text-ink-gray-7" };
const _hoisted_13 = {
  key: 0,
  class: "ml-2 flex-shrink-0"
};
const _hoisted_14 = {
  key: 0,
  class: "text-sm text-ink-gray-5"
};
const _hoisted_15 = {
  key: 1,
  class: "rounded-md px-2.5 py-1.5 text-base text-ink-gray-5"
};
const _hoisted_16 = {
  key: 0,
  class: "border-t p-1"
};
const _hoisted_17 = {
  key: 0,
  class: "flex items-center justify-end"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Combobox"], {
    modelValue: $setup.selectedValue,
    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.selectedValue = $event),
    multiple: $props.multiple,
    nullable: ""
  }, {
    default: withCtx(({ open: isComboboxOpen }) => [
      createVNode($setup["Popover"], {
        class: "w-full",
        show: $setup.showOptions,
        "onUpdate:show": _cache[1] || (_cache[1] = ($event) => $setup.showOptions = $event),
        ref: "rootRef"
      }, {
        target: withCtx(({ open: openPopover, togglePopover }) => [
          renderSlot(_ctx.$slots, "target", normalizeProps(guardReactiveProps({ open: openPopover, togglePopover })), () => [
            createBaseVNode("div", _hoisted_1, [
              createBaseVNode("button", {
                class: normalizeClass(["flex h-7 w-full items-center justify-between gap-2 rounded bg-surface-gray-2 px-2 py-1 transition-colors hover:bg-surface-gray-3 border border-transparent focus:border-outline-gray-4 focus:outline-none focus:ring-2 focus:ring-outline-gray-3", { "bg-surface-gray-3": isComboboxOpen }]),
                onClick: () => togglePopover()
              }, [
                createBaseVNode("div", _hoisted_3, [
                  renderSlot(_ctx.$slots, "prefix"),
                  $setup.displayValue ? (openBlock(), createElementBlock(
                    "span",
                    _hoisted_4,
                    toDisplayString($setup.displayValue),
                    1
                    /* TEXT */
                  )) : (openBlock(), createElementBlock(
                    "span",
                    _hoisted_5,
                    toDisplayString($props.placeholder || ""),
                    1
                    /* TEXT */
                  ))
                ]),
                createVNode($setup["FeatherIcon"], {
                  name: "chevron-down",
                  class: "h-4 w-4 text-ink-gray-5",
                  "aria-hidden": "true"
                })
              ], 10, _hoisted_2)
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
                      !$props.hideSearch ? (openBlock(), createElementBlock("div", _hoisted_6, [
                        createBaseVNode("div", _hoisted_7, [
                          createVNode($setup["ComboboxInput"], {
                            ref: "searchInput",
                            class: "form-input w-full focus:bg-surface-gray-3 hover:bg-surface-gray-4 text-ink-gray-8",
                            type: "text",
                            value: $setup.query,
                            onChange: _cache[0] || (_cache[0] = ($event) => $setup.query = $event.target.value),
                            autocomplete: "off",
                            placeholder: "Search"
                          }, null, 8, ["value"]),
                          createBaseVNode("button", {
                            class: "absolute right-0 inline-flex h-7 w-7 items-center justify-center",
                            onClick: $setup.clearAll
                          }, [
                            createVNode($setup["FeatherIcon"], {
                              name: "x",
                              class: "w-4 text-ink-gray-8"
                            })
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
                              _hoisted_8,
                              toDisplayString(group.group),
                              1
                              /* TEXT */
                            )) : createCommentVNode("v-if", true),
                            (openBlock(true), createElementBlock(
                              Fragment,
                              null,
                              renderList(group.items.slice(0, 50), (option, idx) => {
                                return openBlock(), createBlock($setup["ComboboxOption"], {
                                  as: "template",
                                  key: idx,
                                  value: option
                                }, {
                                  default: withCtx(({ active, selected }) => [
                                    createBaseVNode(
                                      "li",
                                      {
                                        class: normalizeClass([
                                          "flex cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-base",
                                          { "bg-surface-gray-3": active }
                                        ])
                                      },
                                      [
                                        createBaseVNode("div", _hoisted_9, [
                                          _ctx.$slots["item-prefix"] || _ctx.$props.multiple ? (openBlock(), createElementBlock("div", _hoisted_10, [
                                            renderSlot(_ctx.$slots, "item-prefix", mergeProps({ ref_for: true }, { active, selected, option }), () => [
                                              $setup.isOptionSelected(option) ? (openBlock(), createBlock($setup["FeatherIcon"], {
                                                key: 0,
                                                name: "check",
                                                class: "h-4 w-4 text-ink-gray-7"
                                              })) : (openBlock(), createElementBlock("div", _hoisted_11))
                                            ])
                                          ])) : createCommentVNode("v-if", true),
                                          createBaseVNode(
                                            "span",
                                            _hoisted_12,
                                            toDisplayString($setup.getLabel(option)),
                                            1
                                            /* TEXT */
                                          )
                                        ]),
                                        _ctx.$slots["item-suffix"] || (option == null ? void 0 : option.description) ? (openBlock(), createElementBlock("div", _hoisted_13, [
                                          renderSlot(_ctx.$slots, "item-suffix", mergeProps({ ref_for: true }, { active, selected, option }), () => [
                                            (option == null ? void 0 : option.description) ? (openBlock(), createElementBlock(
                                              "div",
                                              _hoisted_14,
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
                                }, 1032, ["value"]);
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
                      $setup.groups.length == 0 ? (openBlock(), createElementBlock("li", _hoisted_15, " No results found ")) : createCommentVNode("v-if", true)
                    ]),
                    _: 3
                    /* FORWARDED */
                  }, 8, ["class"]),
                  _ctx.$slots.footer || $props.multiple ? (openBlock(), createElementBlock("div", _hoisted_16, [
                    renderSlot(_ctx.$slots, "footer", normalizeProps(guardReactiveProps({ togglePopover })), () => [
                      $props.multiple ? (openBlock(), createElementBlock("div", _hoisted_17, [
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
                      ])) : createCommentVNode("v-if", true)
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
      }, 1032, ["show"])
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["modelValue", "multiple"]);
}
_sfc_main.__file = "src/components/Autocomplete.vue";
const Autocomplete = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Autocomplete.vue"]]);
export {
  Autocomplete as A
};