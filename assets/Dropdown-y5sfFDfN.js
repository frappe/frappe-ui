import { aC as defineComponent, aN as ref, aW as useRouter, bH as useAttrs, aF as computed, az as openBlock, aH as createBlock, aP as withCtx, aM as createVNode, aG as renderSlot, bc as normalizeProps, aU as mergeProps, aQ as createTextVNode, aL as toDisplayString, aI as normalizeClass, aA as createElementBlock, aT as Fragment, aS as renderList, aK as createCommentVNode, aJ as resolveDynamicComponent, aB as createBaseVNode, bU as DropdownMenuRoot_default, bV as DropdownMenuTrigger_default, bW as DropdownMenuPortal_default, bX as DropdownMenuContent_default, bY as DropdownMenuLabel_default, bZ as DropdownMenuItem_default, b_ as DropdownMenuSub_default, b$ as DropdownMenuSubTrigger_default, c0 as DropdownMenuSubContent_default } from "./vendor-qMtrkshJ.js";
import { F as FeatherIcon } from "./FeatherIcon-DQakqR8i.js";
import { S as Switch } from "./Switch-Dx7Ok9Aq.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { B as Button } from "./Button-eDSbRhnh.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "Dropdown",
  props: {
    button: { type: Object, required: false },
    options: { type: Array, required: false, default: () => [] },
    placement: { type: String, required: false, default: "left" },
    side: { type: String, required: false, default: "bottom" },
    offset: { type: Number, required: false, default: 4 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const toggleState = ref(false);
    const test = ref(true);
    const router = useRouter();
    const attrs = useAttrs();
    const props = __props;
    function close() {
      toggleState.value = false;
    }
    const handleItemClick = (item, event) => {
      if (item.route) {
        router.push(item.route);
      } else if (item.onClick) {
        item.onClick(event);
      }
    };
    const normalizeDropdownItem = (option) => {
      return {
        ...option,
        label: option.label,
        theme: option.theme || "gray",
        icon: option.icon,
        component: option.component,
        onClick: (event) => handleItemClick(option, event),
        submenu: option.submenu
      };
    };
    const getIconColor = (item) => {
      if (item.disabled) return "text-ink-gray-4";
      return item.theme === "red" ? "text-ink-red-3" : "text-ink-gray-6";
    };
    const getTextColor = (item) => {
      if (item.disabled) return "text-ink-gray-4";
      return item.theme === "red" ? "text-ink-red-3" : "text-ink-gray-7";
    };
    const getBackgroundColor = (item) => item.theme === "red" ? "focus:bg-surface-red-3 data-[highlighted]:bg-surface-red-3 data-[state=open]:bg-surface-red-3" : "focus:bg-surface-gray-3 data-[highlighted]:bg-surface-gray-3 data-[state=open]:bg-surface-gray-3";
    const getSubmenuBackgroundColor = (item) => getBackgroundColor(item) + " data-[state=open]:bg-surface-" + (item.theme === "red" ? "red-3" : "gray-3");
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
    const groupHasIcons = (group) => {
      return group.items.some((item) => item.icon);
    };
    const cssClasses = {
      // Container classes
      dropdownContent: "min-w-40 divide-y divide-outline-gray-modals rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dropdown-content",
      groupContainer: "p-1.5",
      // Label classes
      groupLabel: "flex h-7 items-center px-2 text-sm font-medium",
      itemLabel: "whitespace-nowrap",
      // Icon classes
      itemIcon: "mr-2 h-4 w-4 flex-shrink-0",
      itemIconPlaceholder: "mr-2 h-4 w-4 flex-shrink-0",
      chevronIcon: "ml-auto h-4 w-4 flex-shrink-0",
      // Button classes
      itemButton: "group flex h-7 w-full items-center rounded px-2 text-base focus:outline-none",
      submenuTrigger: "group flex h-7 w-full items-center rounded px-2 text-base text-ink-gray-6 focus:outline-none"
    };
    const groups = computed(() => {
      return processOptionsIntoGroups(props.options);
    });
    const align = computed(() => {
      if (props.placement === "left") return "start";
      if (props.placement === "right") return "end";
      if (props.placement === "center") return "center";
      return "start";
    });
    const __returned__ = { toggleState, test, router, attrs, props, close, handleItemClick, normalizeDropdownItem, getIconColor, getTextColor, getBackgroundColor, getSubmenuBackgroundColor, processOptionsIntoGroups, getSubmenuGroups, filterOptions, groupHasIcons, cssClasses, groups, align, get DropdownMenuRoot() {
      return DropdownMenuRoot_default;
    }, get DropdownMenuTrigger() {
      return DropdownMenuTrigger_default;
    }, get DropdownMenuPortal() {
      return DropdownMenuPortal_default;
    }, get DropdownMenuContent() {
      return DropdownMenuContent_default;
    }, get DropdownMenuLabel() {
      return DropdownMenuLabel_default;
    }, get DropdownMenuItem() {
      return DropdownMenuItem_default;
    }, get DropdownMenuSub() {
      return DropdownMenuSub_default;
    }, get DropdownMenuSubTrigger() {
      return DropdownMenuSubTrigger_default;
    }, get DropdownMenuSubContent() {
      return DropdownMenuSubContent_default;
    }, get Button() {
      return Button;
    }, FeatherIcon, Switch };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["DropdownMenuRoot"], {
    open: $setup.toggleState,
    "onUpdate:open": _cache[0] || (_cache[0] = ($event) => $setup.toggleState = $event)
  }, {
    default: withCtx(({ open }) => [
      createVNode(
        $setup["DropdownMenuTrigger"],
        { "as-child": "" },
        {
          default: withCtx(() => [
            _ctx.$slots.default ? renderSlot(_ctx.$slots, "default", normalizeProps(mergeProps({ key: 0 }, { open, close: $setup.close, ...$setup.attrs })), void 0, true) : (openBlock(), createBlock(
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
            side: $props.side,
            align: $setup.align,
            "side-offset": $props.offset
          }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList($setup.groups, (group) => {
                  return openBlock(), createElementBlock(
                    Fragment,
                    {
                      key: group.key
                    },
                    [
                      group.items.length ? (openBlock(), createElementBlock(
                        "div",
                        {
                          key: 0,
                          class: normalizeClass($setup.cssClasses.groupContainer)
                        },
                        [
                          group.group && !group.hideLabel ? (openBlock(), createBlock($setup["DropdownMenuLabel"], {
                            key: 0,
                            class: normalizeClass([$setup.cssClasses.groupLabel, $setup.getTextColor(group)])
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
                              return openBlock(), createElementBlock(
                                Fragment,
                                {
                                  key: item.label
                                },
                                [
                                  item.switch ? (openBlock(), createElementBlock(
                                    "div",
                                    {
                                      key: 0,
                                      class: normalizeClass($setup.cssClasses.itemButton)
                                    },
                                    [
                                      item.icon && typeof item.icon === "string" ? (openBlock(), createBlock($setup["FeatherIcon"], {
                                        key: 0,
                                        name: item.icon,
                                        class: normalizeClass([$setup.cssClasses.itemIcon, $setup.getIconColor(item)]),
                                        "aria-hidden": "true"
                                      }, null, 8, ["name", "class"])) : item.icon ? (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                        key: 1,
                                        class: normalizeClass([$setup.cssClasses.itemIcon, $setup.getIconColor(item)])
                                      }, null, 8, ["class"])) : createCommentVNode("v-if", true),
                                      createBaseVNode(
                                        "span",
                                        {
                                          class: normalizeClass([$setup.cssClasses.itemLabel, $setup.getTextColor(item)])
                                        },
                                        toDisplayString(item.label),
                                        3
                                        /* TEXT, CLASS */
                                      ),
                                      createVNode($setup["Switch"], {
                                        class: "ml-auto",
                                        "label-classes": "font-normal cursor-pointer",
                                        onChange: ($event) => {
                                          var _a;
                                          return (_a = item.onClick) == null ? void 0 : _a.call(item, $event);
                                        },
                                        "model-value": item.switchValue || false
                                      }, null, 8, ["onChange", "model-value"])
                                    ],
                                    2
                                    /* CLASS */
                                  )) : (openBlock(), createBlock($setup["DropdownMenuItem"], {
                                    key: 1,
                                    "as-child": "",
                                    onSelect: item.onClick,
                                    disabled: item.disabled,
                                    class: "data-[disabled]:cursor-not-allowed"
                                  }, {
                                    default: withCtx(() => [
                                      _ctx.$slots.item ? renderSlot(_ctx.$slots, "item", mergeProps({
                                        key: 0,
                                        ref_for: true
                                      }, { item, close: $setup.close }), void 0, true) : item.component ? (openBlock(), createBlock(resolveDynamicComponent(item.component), {
                                        key: 1,
                                        active: false
                                      })) : item.submenu ? (openBlock(), createBlock(
                                        $setup["DropdownMenuSub"],
                                        { key: 2 },
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
                                                      class: normalizeClass([
                                                        $setup.cssClasses.submenuTrigger,
                                                        $setup.getSubmenuBackgroundColor(item)
                                                      ])
                                                    },
                                                    [
                                                      item.icon && typeof item.icon === "string" ? (openBlock(), createBlock($setup["FeatherIcon"], {
                                                        key: 0,
                                                        name: item.icon,
                                                        class: normalizeClass([$setup.cssClasses.itemIcon, $setup.getIconColor(item)]),
                                                        "aria-hidden": "true"
                                                      }, null, 8, ["name", "class"])) : item.icon ? (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                                        key: 1,
                                                        class: normalizeClass([$setup.cssClasses.itemIcon, $setup.getIconColor(item)])
                                                      }, null, 8, ["class"])) : $setup.groupHasIcons(group) ? (openBlock(), createElementBlock(
                                                        "div",
                                                        {
                                                          key: 2,
                                                          class: normalizeClass($setup.cssClasses.itemIconPlaceholder)
                                                        },
                                                        null,
                                                        2
                                                        /* CLASS */
                                                      )) : createCommentVNode("v-if", true),
                                                      createBaseVNode(
                                                        "span",
                                                        {
                                                          class: normalizeClass([$setup.cssClasses.itemLabel, $setup.getTextColor(item)])
                                                        },
                                                        toDisplayString(item.label),
                                                        3
                                                        /* TEXT, CLASS */
                                                      ),
                                                      createVNode($setup["FeatherIcon"], {
                                                        name: "chevron-right",
                                                        class: normalizeClass([$setup.cssClasses.chevronIcon, $setup.getIconColor(item)]),
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
                                                                  return openBlock(), createElementBlock(
                                                                    Fragment,
                                                                    {
                                                                      key: subItem.label
                                                                    },
                                                                    [
                                                                      subItem.switch ? (openBlock(), createElementBlock(
                                                                        "div",
                                                                        {
                                                                          key: 0,
                                                                          class: normalizeClass($setup.cssClasses.itemButton)
                                                                        },
                                                                        [
                                                                          subItem.icon && typeof subItem.icon === "string" ? (openBlock(), createBlock($setup["FeatherIcon"], {
                                                                            key: 0,
                                                                            name: subItem.icon,
                                                                            class: normalizeClass([
                                                                              $setup.cssClasses.itemIcon,
                                                                              $setup.getIconColor(subItem)
                                                                            ]),
                                                                            "aria-hidden": "true"
                                                                          }, null, 8, ["name", "class"])) : subItem.icon ? (openBlock(), createBlock(resolveDynamicComponent(subItem.icon), {
                                                                            key: 1,
                                                                            class: normalizeClass([
                                                                              $setup.cssClasses.itemIcon,
                                                                              $setup.getIconColor(subItem)
                                                                            ])
                                                                          }, null, 8, ["class"])) : createCommentVNode("v-if", true),
                                                                          createBaseVNode(
                                                                            "span",
                                                                            {
                                                                              class: normalizeClass([
                                                                                $setup.cssClasses.itemLabel,
                                                                                $setup.getTextColor(subItem)
                                                                              ])
                                                                            },
                                                                            toDisplayString(subItem.label),
                                                                            3
                                                                            /* TEXT, CLASS */
                                                                          ),
                                                                          createVNode($setup["Switch"], {
                                                                            class: "ml-auto",
                                                                            "label-classes": "font-normal cursor-pointer",
                                                                            onChange: ($event) => {
                                                                              var _a;
                                                                              return (_a = subItem.onClick) == null ? void 0 : _a.call(subItem, $event);
                                                                            },
                                                                            "model-value": subItem.switchValue || false
                                                                          }, null, 8, ["onChange", "model-value"])
                                                                        ],
                                                                        2
                                                                        /* CLASS */
                                                                      )) : (openBlock(), createBlock($setup["DropdownMenuItem"], {
                                                                        key: 1,
                                                                        "as-child": "",
                                                                        onSelect: (event) => $setup.handleItemClick(subItem, event),
                                                                        disabled: subItem.disabled,
                                                                        class: "data-[disabled]:cursor-not-allowed"
                                                                      }, {
                                                                        default: withCtx(() => [
                                                                          subItem.component ? (openBlock(), createBlock(resolveDynamicComponent(subItem.component), {
                                                                            key: 0,
                                                                            active: false
                                                                          })) : (openBlock(), createElementBlock(
                                                                            "button",
                                                                            {
                                                                              key: 1,
                                                                              class: normalizeClass([
                                                                                $setup.cssClasses.itemButton,
                                                                                $setup.getBackgroundColor(subItem)
                                                                              ])
                                                                            },
                                                                            [
                                                                              subItem.icon && typeof subItem.icon === "string" ? (openBlock(), createBlock($setup["FeatherIcon"], {
                                                                                key: 0,
                                                                                name: subItem.icon,
                                                                                class: normalizeClass([
                                                                                  $setup.cssClasses.itemIcon,
                                                                                  $setup.getIconColor(subItem)
                                                                                ]),
                                                                                "aria-hidden": "true"
                                                                              }, null, 8, ["name", "class"])) : subItem.icon ? (openBlock(), createBlock(resolveDynamicComponent(subItem.icon), {
                                                                                key: 1,
                                                                                class: normalizeClass([
                                                                                  $setup.cssClasses.itemIcon,
                                                                                  $setup.getIconColor(subItem)
                                                                                ])
                                                                              }, null, 8, ["class"])) : $setup.groupHasIcons(submenuGroup) ? (openBlock(), createElementBlock(
                                                                                "div",
                                                                                {
                                                                                  key: 2,
                                                                                  class: normalizeClass($setup.cssClasses.itemIconPlaceholder)
                                                                                },
                                                                                null,
                                                                                2
                                                                                /* CLASS */
                                                                              )) : createCommentVNode("v-if", true),
                                                                              createBaseVNode(
                                                                                "span",
                                                                                {
                                                                                  class: normalizeClass([
                                                                                    $setup.cssClasses.itemLabel,
                                                                                    $setup.getTextColor(subItem)
                                                                                  ])
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
                                                                      }, 1032, ["onSelect", "disabled"]))
                                                                    ],
                                                                    64
                                                                    /* STABLE_FRAGMENT */
                                                                  );
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
                                          key: 3,
                                          class: normalizeClass([$setup.cssClasses.itemButton, $setup.getBackgroundColor(item)])
                                        },
                                        [
                                          item.icon && typeof item.icon === "string" ? (openBlock(), createBlock($setup["FeatherIcon"], {
                                            key: 0,
                                            name: item.icon,
                                            class: normalizeClass([$setup.cssClasses.itemIcon, $setup.getIconColor(item)]),
                                            "aria-hidden": "true"
                                          }, null, 8, ["name", "class"])) : item.icon ? (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                            key: 1,
                                            class: normalizeClass([$setup.cssClasses.itemIcon, $setup.getIconColor(item)])
                                          }, null, 8, ["class"])) : $setup.groupHasIcons(group) ? (openBlock(), createElementBlock(
                                            "div",
                                            {
                                              key: 2,
                                              class: normalizeClass($setup.cssClasses.itemIconPlaceholder)
                                            },
                                            null,
                                            2
                                            /* CLASS */
                                          )) : createCommentVNode("v-if", true),
                                          createBaseVNode(
                                            "span",
                                            {
                                              class: normalizeClass([$setup.cssClasses.itemLabel, $setup.getTextColor(item)])
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
                                  }, 1032, ["onSelect", "disabled"]))
                                ],
                                64
                                /* STABLE_FRAGMENT */
                              );
                            }),
                            128
                            /* KEYED_FRAGMENT */
                          ))
                        ],
                        2
                        /* CLASS */
                      )) : createCommentVNode("v-if", true)
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
          }, 8, ["class", "side", "align", "side-offset"])
        ]),
        _: 3
        /* FORWARDED */
      })
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["open"]);
}
_sfc_main.__file = "src/components/Dropdown/Dropdown.vue";
const Dropdown = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7f1b18bd"], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Dropdown/Dropdown.vue"]]);
export {
  Dropdown as D
};
