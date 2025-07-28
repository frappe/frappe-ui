import { ay as defineComponent, cm as useRouter, bH as useAttrs, aW as computed, c_ as _sfc_main$1, c$ as _sfc_main$2, d0 as _sfc_main$3, d1 as _sfc_main$4, d2 as _sfc_main$5, d3 as _sfc_main$6, d4 as _sfc_main$7, d5 as _sfc_main$8, d6 as _sfc_main$9, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aZ as renderSlot, aR as normalizeProps, aL as mergeProps, aM as createTextVNode, aN as toDisplayString, aQ as normalizeClass, aG as createElementBlock, aK as Fragment, aJ as renderList, aH as createCommentVNode, bv as resolveDynamicComponent, aF as createBaseVNode } from "./vendor-uK6N0wnM.js";
import { B as Button } from "./Button-CcM5oPQc.js";
import { F as FeatherIcon } from "./FeatherIcon-UgcFzfKq.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "Dropdown",
  props: {
    button: { type: Object, required: false },
    options: { type: Array, required: false, default: () => [] },
    placement: { type: String, required: false, default: "left" }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const router = useRouter();
    const attrs = useAttrs();
    const props = __props;
    const handleItemClick = (item) => {
      if (item.route) {
        router.push(item.route);
      } else if (item.onClick) {
        item.onClick();
      }
    };
    const normalizeDropdownItem = (option) => {
      return {
        label: option.label,
        icon: option.icon,
        component: option.component,
        onClick: () => handleItemClick(option),
        submenu: option.submenu
      };
    };
    const processOptionsIntoGroups = (options) => {
      let groups2 = [];
      let currentGroup = null;
      let i = 0;
      for (let option of options) {
        if (option == null) {
          continue;
        }
        if ("group" in option) {
          if (currentGroup) {
            groups2.push(currentGroup);
            currentGroup = null;
          }
          let groupOption = {
            key: i,
            ...option,
            items: filterOptions(option.items)
          };
          groups2.push(groupOption);
        } else {
          if (!currentGroup) {
            currentGroup = {
              key: i,
              group: "",
              hideLabel: true,
              items: []
            };
          }
          currentGroup.items.push(...filterOptions([option]));
        }
        i++;
      }
      if (currentGroup) {
        groups2.push(currentGroup);
      }
      return groups2;
    };
    const getSubmenuGroups = (submenuOptions) => {
      return processOptionsIntoGroups(submenuOptions);
    };
    const filterOptions = (options) => {
      return (options || []).filter(Boolean).filter((option) => option.condition ? option.condition() : true).map((option) => normalizeDropdownItem(option));
    };
    const cssClasses = {
      // Container classes
      dropdownContent: "min-w-40 divide-y divide-outline-gray-modals rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dropdown-content",
      groupContainer: "p-1.5",
      // Label classes
      groupLabel: "flex h-7 items-center px-2 text-sm font-medium text-ink-gray-6",
      itemLabel: "whitespace-nowrap text-ink-gray-7",
      // Icon classes
      itemIcon: "mr-2 h-4 w-4 flex-shrink-0 text-ink-gray-6",
      chevronIcon: "ml-auto h-4 w-4 flex-shrink-0 text-ink-gray-6",
      // Button classes
      itemButton: "group flex h-7 w-full items-center rounded px-2 text-base text-ink-gray-6 focus:bg-surface-gray-3 focus:outline-none data-[highlighted]:bg-surface-gray-3",
      submenuTrigger: "group flex h-7 w-full items-center rounded px-2 text-base text-ink-gray-6 focus:bg-surface-gray-3 focus:outline-none data-[highlighted]:bg-surface-gray-3 data-[state=open]:bg-surface-gray-3"
    };
    const groups = computed(() => {
      return processOptionsIntoGroups(props.options);
    });
    const contentSide = computed(() => {
      return "bottom";
    });
    const contentAlign = computed(() => {
      if (props.placement === "left") return "start";
      if (props.placement === "right") return "end";
      if (props.placement === "center") return "center";
      return "start";
    });
    const __returned__ = { router, attrs, props, handleItemClick, normalizeDropdownItem, processOptionsIntoGroups, getSubmenuGroups, filterOptions, cssClasses, groups, contentSide, contentAlign, get DropdownMenuRoot() {
      return _sfc_main$1;
    }, get DropdownMenuTrigger() {
      return _sfc_main$2;
    }, get DropdownMenuPortal() {
      return _sfc_main$3;
    }, get DropdownMenuContent() {
      return _sfc_main$4;
    }, get DropdownMenuLabel() {
      return _sfc_main$5;
    }, get DropdownMenuItem() {
      return _sfc_main$6;
    }, get DropdownMenuSub() {
      return _sfc_main$7;
    }, get DropdownMenuSubTrigger() {
      return _sfc_main$8;
    }, get DropdownMenuSubContent() {
      return _sfc_main$9;
    }, get Button() {
      return Button;
    }, FeatherIcon };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["DropdownMenuRoot"], null, {
    default: withCtx(({ open }) => [
      createVNode(
        $setup["DropdownMenuTrigger"],
        { "as-child": "" },
        {
          default: withCtx(() => [
            _ctx.$slots.default ? renderSlot(_ctx.$slots, "default", normalizeProps(mergeProps({ key: 0 }, { open, ...$setup.attrs })), void 0, true) : (openBlock(), createBlock(
              $setup["Button"],
              mergeProps({
                key: 1,
                active: false
              }, { ...$props.button, ...$setup.attrs }),
              {
                default: withCtx(() => {
                  var _a;
                  return [
                    createTextVNode(
                      toDisplayString($props.button ? ((_a = $props.button) == null ? void 0 : _a.label) || null : "Options"),
                      1
                      /* TEXT */
                    )
                  ];
                }),
                _: 1
                /* STABLE */
              },
              16
              /* FULL_PROPS */
            ))
          ]),
          _: 2
          /* DYNAMIC */
        },
        1024
        /* DYNAMIC_SLOTS */
      ),
      createVNode($setup["DropdownMenuPortal"], null, {
        default: withCtx(() => [
          createVNode($setup["DropdownMenuContent"], {
            class: normalizeClass([
              $setup.cssClasses.dropdownContent,
              {
                "origin-top-left": $props.placement == "left",
                "origin-top-right": $props.placement == "right",
                "origin-top": $props.placement == "center"
              }
            ]),
            side: $setup.contentSide,
            align: $setup.contentAlign,
            "side-offset": 4
          }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList($setup.groups, (group) => {
                  return openBlock(), createElementBlock(
                    "div",
                    {
                      key: group.key,
                      class: normalizeClass($setup.cssClasses.groupContainer)
                    },
                    [
                      group.group && !group.hideLabel ? (openBlock(), createBlock($setup["DropdownMenuLabel"], {
                        key: 0,
                        class: normalizeClass($setup.cssClasses.groupLabel)
                      }, {
                        default: withCtx(() => [
                          createTextVNode(
                            toDisplayString(group.group),
                            1
                            /* TEXT */
                          )
                        ]),
                        _: 2
                        /* DYNAMIC */
                      }, 1032, ["class"])) : createCommentVNode("v-if", true),
                      (openBlock(true), createElementBlock(
                        Fragment,
                        null,
                        renderList(group.items, (item) => {
                          return openBlock(), createBlock($setup["DropdownMenuItem"], {
                            key: item.label,
                            "as-child": "",
                            onSelect: item.onClick
                          }, {
                            default: withCtx(() => [
                              item.component ? (openBlock(), createBlock(resolveDynamicComponent(item.component), {
                                key: 0,
                                active: false
                              })) : item.submenu ? (openBlock(), createBlock(
                                $setup["DropdownMenuSub"],
                                { key: 1 },
                                {
                                  default: withCtx(() => [
                                    createVNode(
                                      $setup["DropdownMenuSubTrigger"],
                                      { "as-child": "" },
                                      {
                                        default: withCtx(() => [
                                          createBaseVNode(
                                            "button",
                                            {
                                              class: normalizeClass($setup.cssClasses.submenuTrigger)
                                            },
                                            [
                                              item.icon && typeof item.icon === "string" ? (openBlock(), createBlock($setup["FeatherIcon"], {
                                                key: 0,
                                                name: item.icon,
                                                class: normalizeClass($setup.cssClasses.itemIcon),
                                                "aria-hidden": "true"
                                              }, null, 8, ["name", "class"])) : item.icon ? (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                                key: 1,
                                                class: normalizeClass($setup.cssClasses.itemIcon)
                                              }, null, 8, ["class"])) : createCommentVNode("v-if", true),
                                              createBaseVNode(
                                                "span",
                                                {
                                                  class: normalizeClass($setup.cssClasses.itemLabel)
                                                },
                                                toDisplayString(item.label),
                                                3
                                                /* TEXT, CLASS */
                                              ),
                                              createVNode($setup["FeatherIcon"], {
                                                name: "chevron-right",
                                                class: normalizeClass($setup.cssClasses.chevronIcon),
                                                "aria-hidden": "true"
                                              }, null, 8, ["class"])
                                            ],
                                            2
                                            /* CLASS */
                                          )
                                        ]),
                                        _: 2
                                        /* DYNAMIC */
                                      },
                                      1024
                                      /* DYNAMIC_SLOTS */
                                    ),
                                    createVNode(
                                      $setup["DropdownMenuPortal"],
                                      null,
                                      {
                                        default: withCtx(() => [
                                          createVNode($setup["DropdownMenuSubContent"], {
                                            class: normalizeClass($setup.cssClasses.dropdownContent),
                                            "side-offset": 4
                                          }, {
                                            default: withCtx(() => [
                                              (openBlock(true), createElementBlock(
                                                Fragment,
                                                null,
                                                renderList($setup.getSubmenuGroups(item.submenu), (submenuGroup) => {
                                                  return openBlock(), createElementBlock(
                                                    "div",
                                                    {
                                                      key: submenuGroup.key,
                                                      class: normalizeClass($setup.cssClasses.groupContainer)
                                                    },
                                                    [
                                                      submenuGroup.group && !submenuGroup.hideLabel ? (openBlock(), createBlock($setup["DropdownMenuLabel"], {
                                                        key: 0,
                                                        class: normalizeClass($setup.cssClasses.groupLabel)
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(
                                                            toDisplayString(submenuGroup.group),
                                                            1
                                                            /* TEXT */
                                                          )
                                                        ]),
                                                        _: 2
                                                        /* DYNAMIC */
                                                      }, 1032, ["class"])) : createCommentVNode("v-if", true),
                                                      (openBlock(true), createElementBlock(
                                                        Fragment,
                                                        null,
                                                        renderList(submenuGroup.items, (subItem) => {
                                                          return openBlock(), createBlock($setup["DropdownMenuItem"], {
                                                            key: subItem.label,
                                                            "as-child": "",
                                                            onSelect: () => $setup.handleItemClick(subItem)
                                                          }, {
                                                            default: withCtx(() => [
                                                              subItem.component ? (openBlock(), createBlock(resolveDynamicComponent(subItem.component), {
                                                                key: 0,
                                                                active: false
                                                              })) : (openBlock(), createElementBlock(
                                                                "button",
                                                                {
                                                                  key: 1,
                                                                  class: normalizeClass($setup.cssClasses.itemButton)
                                                                },
                                                                [
                                                                  subItem.icon && typeof subItem.icon === "string" ? (openBlock(), createBlock($setup["FeatherIcon"], {
                                                                    key: 0,
                                                                    name: subItem.icon,
                                                                    class: normalizeClass($setup.cssClasses.itemIcon),
                                                                    "aria-hidden": "true"
                                                                  }, null, 8, ["name", "class"])) : subItem.icon ? (openBlock(), createBlock(resolveDynamicComponent(subItem.icon), {
                                                                    key: 1,
                                                                    class: normalizeClass($setup.cssClasses.itemIcon)
                                                                  }, null, 8, ["class"])) : createCommentVNode("v-if", true),
                                                                  createBaseVNode(
                                                                    "span",
                                                                    {
                                                                      class: normalizeClass($setup.cssClasses.itemLabel)
                                                                    },
                                                                    toDisplayString(subItem.label),
                                                                    3
                                                                    /* TEXT, CLASS */
                                                                  )
                                                                ],
                                                                2
                                                                /* CLASS */
                                                              ))
                                                            ]),
                                                            _: 2
                                                            /* DYNAMIC */
                                                          }, 1032, ["onSelect"]);
                                                        }),
                                                        128
                                                        /* KEYED_FRAGMENT */
                                                      ))
                                                    ],
                                                    2
                                                    /* CLASS */
                                                  );
                                                }),
                                                128
                                                /* KEYED_FRAGMENT */
                                              ))
                                            ]),
                                            _: 2
                                            /* DYNAMIC */
                                          }, 1032, ["class"])
                                        ]),
                                        _: 2
                                        /* DYNAMIC */
                                      },
                                      1024
                                      /* DYNAMIC_SLOTS */
                                    )
                                  ]),
                                  _: 2
                                  /* DYNAMIC */
                                },
                                1024
                                /* DYNAMIC_SLOTS */
                              )) : (openBlock(), createElementBlock(
                                "button",
                                {
                                  key: 2,
                                  class: normalizeClass($setup.cssClasses.itemButton)
                                },
                                [
                                  item.icon && typeof item.icon === "string" ? (openBlock(), createBlock($setup["FeatherIcon"], {
                                    key: 0,
                                    name: item.icon,
                                    class: normalizeClass($setup.cssClasses.itemIcon),
                                    "aria-hidden": "true"
                                  }, null, 8, ["name", "class"])) : item.icon ? (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                    key: 1,
                                    class: normalizeClass($setup.cssClasses.itemIcon)
                                  }, null, 8, ["class"])) : createCommentVNode("v-if", true),
                                  createBaseVNode(
                                    "span",
                                    {
                                      class: normalizeClass($setup.cssClasses.itemLabel)
                                    },
                                    toDisplayString(item.label),
                                    3
                                    /* TEXT, CLASS */
                                  )
                                ],
                                2
                                /* CLASS */
                              ))
                            ]),
                            _: 2
                            /* DYNAMIC */
                          }, 1032, ["onSelect"]);
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ],
                    2
                    /* CLASS */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            _: 1
            /* STABLE */
          }, 8, ["class", "side", "align"])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 3
    /* FORWARDED */
  });
}
_sfc_main.__file = "src/components/Dropdown/Dropdown.vue";
const Dropdown = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7f1b18bd"], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Dropdown/Dropdown.vue"]]);
export {
  Dropdown as D
};
