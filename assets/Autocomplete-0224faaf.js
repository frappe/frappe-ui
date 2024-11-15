import { bw as lt, bx as it, bz as ut, by as rt, c3 as nt, bE as nextTick, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aT as renderSlot, aU as normalizeProps, aV as guardReactiveProps, aF as createBaseVNode, aW as normalizeClass, aG as createElementBlock, aN as toDisplayString, b5 as withDirectives, aH as createCommentVNode, aK as Fragment, aJ as renderList, aL as mergeProps, b6 as vShow, aX as withModifiers } from "./vendor-e5ffe8f5.js";
import { P as Popover } from "./Popover-55b035bc.js";
import { B as Button } from "./Button-e61b5378.js";
import { F as FeatherIcon } from "./FeatherIcon-720d315b.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
const _sfc_main = {
  name: "Autocomplete",
  props: {
    options: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: [String, Object, Array]
    },
    placeholder: {
      type: String
    },
    bodyClasses: {
      type: [String, Array, Object]
    },
    multiple: {
      type: Boolean,
      default: false
    },
    hideSearch: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue", "update:query", "change"],
  components: {
    Popover,
    Button,
    FeatherIcon,
    Combobox: lt,
    ComboboxInput: it,
    ComboboxOptions: ut,
    ComboboxOption: rt,
    ComboboxButton: nt
  },
  expose: ["togglePopover", "rootRef"],
  data() {
    return {
      query: "",
      showOptions: false
    };
  },
  computed: {
    selectedValue: {
      get() {
        var _a, _b;
        if (!this.multiple) {
          return this.findOption(this.modelValue);
        }
        return isOptionOrValue((_a = this.modelValue) == null ? void 0 : _a[0]) === "value" ? (_b = this.modelValue) == null ? void 0 : _b.map((v) => this.findOption(v)) : this.modelValue;
      },
      set(val) {
        this.query = "";
        if (val && !this.multiple)
          this.showOptions = false;
        if (!this.multiple) {
          this.$emit("update:modelValue", val);
          return;
        }
        this.$emit("update:modelValue", val);
      }
    },
    groups() {
      var _a;
      if (!this.options || this.options.length == 0)
        return [];
      let groups = ((_a = this.options[0]) == null ? void 0 : _a.group) ? this.options : [{ group: "", items: this.sanitizeOptions(this.options) }];
      return groups.map((group, i) => {
        return {
          key: i,
          group: group.group,
          hideLabel: group.hideLabel || false,
          items: this.filterOptions(this.sanitizeOptions(group.items))
        };
      }).filter((group) => group.items.length > 0);
    },
    allOptions() {
      return this.groups.flatMap((group) => group.items);
    },
    areAllOptionsSelected() {
      var _a;
      if (!this.multiple)
        return false;
      return this.allOptions.length === ((_a = this.selectedValue) == null ? void 0 : _a.length);
    }
  },
  watch: {
    query(q) {
      this.$emit("update:query", q);
    },
    showOptions(val) {
      if (val)
        nextTick(() => {
          var _a, _b;
          return (_b = (_a = this.$refs.searchInput) == null ? void 0 : _a.$el) == null ? void 0 : _b.focus();
        });
    }
  },
  methods: {
    rootRef() {
      return this.$refs["rootRef"];
    },
    togglePopover(val) {
      this.showOptions = val ?? !this.showOptions;
    },
    findOption(option) {
      if (!option)
        return option;
      const value = isOptionOrValue(option) === "value" ? option : option.value;
      return this.allOptions.find((o) => o.value === value);
    },
    filterOptions(options) {
      if (!this.query)
        return options;
      return options.filter((option) => {
        return option.label.toLowerCase().includes(this.query.trim().toLowerCase()) || option.value.toLowerCase().includes(this.query.trim().toLowerCase());
      });
    },
    displayValue(option) {
      if (!option)
        return "";
      if (!this.multiple) {
        return this.getLabel(this.findOption(option));
      }
      if (!Array.isArray(option))
        return "";
      return option.map((v) => this.getLabel(this.findOption(v))).join(", ");
    },
    getLabel(option) {
      if (isOptionOrValue(option) === "value")
        return option;
      return (option == null ? void 0 : option.label) || (option == null ? void 0 : option.value) || "No label";
    },
    sanitizeOptions(options) {
      if (!options)
        return [];
      return options.map((option) => {
        return isOptionOrValue(option) === "option" ? option : { label: option, value: option };
      });
    },
    isOptionSelected(option) {
      var _a, _b;
      if (!this.selectedValue)
        return false;
      const value = isOptionOrValue(option) === "value" ? option : option.value;
      if (!this.multiple) {
        return ((_a = this.selectedValue) == null ? void 0 : _a.value) === value;
      }
      return (_b = this.selectedValue) == null ? void 0 : _b.find((v) => v && v.value === value);
    },
    selectAll() {
      this.selectedValue = this.allOptions;
    },
    clearAll() {
      this.selectedValue = [];
    }
  }
};
function isOptionOrValue(optionOrValue) {
  return typeof optionOrValue === "object" ? "option" : "value";
}
const _hoisted_1 = { class: "w-full" };
const _hoisted_2 = ["onClick"];
const _hoisted_3 = { class: "flex items-center overflow-hidden" };
const _hoisted_4 = {
  key: 0,
  class: "truncate text-base leading-5"
};
const _hoisted_5 = {
  key: 1,
  class: "text-base leading-5 text-gray-500"
};
const _hoisted_6 = {
  key: 0,
  class: "sticky top-0 z-10 flex items-stretch space-x-1.5 bg-white py-1.5"
};
const _hoisted_7 = { class: "relative w-full" };
const _hoisted_8 = {
  key: 0,
  class: "sticky top-10 truncate bg-white px-2.5 py-1.5 text-sm font-medium text-gray-600"
};
const _hoisted_9 = { class: "flex flex-1 gap-2 overflow-hidden" };
const _hoisted_10 = {
  key: 0,
  class: "flex-shrink-0"
};
const _hoisted_11 = {
  key: 1,
  class: "h-4 w-4"
};
const _hoisted_12 = { class: "flex-1 truncate" };
const _hoisted_13 = {
  key: 0,
  class: "ml-2 flex-shrink-0"
};
const _hoisted_14 = {
  key: 0,
  class: "text-sm text-gray-600"
};
const _hoisted_15 = {
  key: 1,
  class: "rounded-md px-2.5 py-1.5 text-base text-gray-600"
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
  const _component_FeatherIcon = resolveComponent("FeatherIcon");
  const _component_ComboboxInput = resolveComponent("ComboboxInput");
  const _component_ComboboxOption = resolveComponent("ComboboxOption");
  const _component_ComboboxOptions = resolveComponent("ComboboxOptions");
  const _component_Button = resolveComponent("Button");
  const _component_Popover = resolveComponent("Popover");
  const _component_Combobox = resolveComponent("Combobox");
  return openBlock(), createBlock(_component_Combobox, {
    modelValue: $options.selectedValue,
    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $options.selectedValue = $event),
    multiple: $props.multiple,
    nullable: ""
  }, {
    default: withCtx(({ open: isComboboxOpen }) => [
      createVNode(_component_Popover, {
        class: "w-full",
        show: $data.showOptions,
        "onUpdate:show": _cache[2] || (_cache[2] = ($event) => $data.showOptions = $event),
        ref: "rootRef"
      }, {
        target: withCtx(({ open: openPopover, togglePopover }) => [
          renderSlot(_ctx.$slots, "target", normalizeProps(guardReactiveProps({ open: openPopover, togglePopover })), () => [
            createBaseVNode("div", _hoisted_1, [
              createBaseVNode("button", {
                class: normalizeClass(["flex h-7 w-full items-center justify-between gap-2 rounded bg-gray-100 px-2 py-1 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-400", { "bg-gray-200": isComboboxOpen }]),
                onClick: () => togglePopover()
              }, [
                createBaseVNode("div", _hoisted_3, [
                  renderSlot(_ctx.$slots, "prefix"),
                  $options.selectedValue ? (openBlock(), createElementBlock(
                    "span",
                    _hoisted_4,
                    toDisplayString($options.displayValue($options.selectedValue)),
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
                createVNode(_component_FeatherIcon, {
                  name: "chevron-down",
                  class: "h-4 w-4 text-gray-600",
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
                  class: normalizeClass(["relative mt-1 rounded-lg bg-white text-base shadow-2xl", $props.bodyClasses])
                },
                [
                  createVNode(_component_ComboboxOptions, {
                    class: normalizeClass(["max-h-[15rem] overflow-y-auto px-1.5 pb-1.5", { "pt-1.5": $props.hideSearch }]),
                    static: ""
                  }, {
                    default: withCtx(() => [
                      !$props.hideSearch ? (openBlock(), createElementBlock("div", _hoisted_6, [
                        createBaseVNode("div", _hoisted_7, [
                          createVNode(_component_ComboboxInput, {
                            ref: "searchInput",
                            class: "form-input w-full",
                            type: "text",
                            onChange: _cache[0] || (_cache[0] = (e) => {
                              $data.query = e.target.value;
                            }),
                            value: $data.query,
                            autocomplete: "off",
                            placeholder: "Search"
                          }, null, 8, ["value"]),
                          createBaseVNode("button", {
                            class: "absolute right-0 inline-flex h-7 w-7 items-center justify-center",
                            onClick: _cache[1] || (_cache[1] = ($event) => $options.selectedValue = null)
                          }, [
                            createVNode(_component_FeatherIcon, {
                              name: "x",
                              class: "w-4"
                            })
                          ])
                        ])
                      ])) : createCommentVNode("v-if", true),
                      (openBlock(true), createElementBlock(
                        Fragment,
                        null,
                        renderList($options.groups, (group) => {
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
                                return openBlock(), createBlock(_component_ComboboxOption, {
                                  as: "template",
                                  key: (option == null ? void 0 : option.value) || idx,
                                  value: option
                                }, {
                                  default: withCtx(({ active, selected }) => [
                                    createBaseVNode(
                                      "li",
                                      {
                                        class: normalizeClass([
                                          "flex cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-base",
                                          { "bg-gray-100": active }
                                        ])
                                      },
                                      [
                                        createBaseVNode("div", _hoisted_9, [
                                          _ctx.$slots["item-prefix"] || _ctx.$props.multiple ? (openBlock(), createElementBlock("div", _hoisted_10, [
                                            renderSlot(_ctx.$slots, "item-prefix", mergeProps({ ref_for: true }, { active, selected, option }), () => [
                                              $options.isOptionSelected(option) ? (openBlock(), createBlock(_component_FeatherIcon, {
                                                key: 0,
                                                name: "check",
                                                class: "h-4 w-4 text-gray-700"
                                              })) : (openBlock(), createElementBlock("div", _hoisted_11))
                                            ])
                                          ])) : createCommentVNode("v-if", true),
                                          createBaseVNode(
                                            "span",
                                            _hoisted_12,
                                            toDisplayString($options.getLabel(option)),
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
                      $options.groups.length == 0 ? (openBlock(), createElementBlock("li", _hoisted_15, " No results found ")) : createCommentVNode("v-if", true)
                    ]),
                    _: 3
                    /* FORWARDED */
                  }, 8, ["class"]),
                  _ctx.$slots.footer || $props.multiple ? (openBlock(), createElementBlock("div", _hoisted_16, [
                    renderSlot(_ctx.$slots, "footer", normalizeProps(guardReactiveProps({ togglePopover })), () => [
                      $props.multiple ? (openBlock(), createElementBlock("div", _hoisted_17, [
                        !$options.areAllOptionsSelected ? (openBlock(), createBlock(_component_Button, {
                          key: 0,
                          label: "Select All",
                          onClick: withModifiers($options.selectAll, ["stop"])
                        }, null, 8, ["onClick"])) : createCommentVNode("v-if", true),
                        $options.areAllOptionsSelected ? (openBlock(), createBlock(_component_Button, {
                          key: 1,
                          label: "Clear All",
                          onClick: withModifiers($options.clearAll, ["stop"])
                        }, null, 8, ["onClick"])) : createCommentVNode("v-if", true)
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
