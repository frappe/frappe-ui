import { ay as defineComponent, bH as useRouter, aQ as computed, bW as ge, bX as Se, bY as Me, bZ as be, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aT as renderSlot, aU as normalizeProps, aL as mergeProps, aM as createTextVNode, aN as toDisplayString, aW as normalizeClass, aG as createElementBlock, aK as Fragment, aJ as renderList, aH as createCommentVNode, b4 as resolveDynamicComponent, aF as createBaseVNode } from "./vendor-6fc73789.js";
import { P as Popover } from "./Popover-69577747.js";
import { B as Button } from "./Button-f4dec060.js";
import { F as FeatherIcon } from "./FeatherIcon-512d35aa.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Dropdown",
  props: {
    button: { type: Object, required: false },
    options: { type: Array, required: false, default: () => [] },
    placement: { type: String, required: false, default: "left" }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const router = useRouter();
    const props = __props;
    const normalizeDropdownItem = (option) => {
      let onClick = () => {
        if (option.route) {
          router.push(option.route);
        } else if (option.onClick) {
          option.onClick();
        }
      };
      return {
        label: option.label,
        icon: option.icon,
        component: option.component,
        onClick
      };
    };
    const filterOptions = (options) => {
      return (options || []).filter(Boolean).filter((option) => option.condition ? option.condition() : true).map((option) => normalizeDropdownItem(option));
    };
    const groups = computed(() => {
      let groups2 = [];
      let currentGroup = null;
      let i = 0;
      for (let option of props.options) {
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
    });
    const dropdownTransition = computed(() => {
      return {
        enterActiveClass: "transition duration-100 ease-out",
        enterFromClass: "transform scale-95 opacity-0",
        enterToClass: "transform scale-100 opacity-100",
        leaveActiveClass: "transition duration-75 ease-in",
        leaveFromClass: "transform scale-100 opacity-100",
        leaveToClass: "transform scale-95 opacity-0"
      };
    });
    const popoverPlacement = computed(() => {
      if (props.placement === "left")
        return "bottom-start";
      if (props.placement === "right")
        return "bottom-end";
      if (props.placement === "center")
        return "bottom-center";
      return "bottom";
    });
    const __returned__ = { router, props, normalizeDropdownItem, filterOptions, groups, dropdownTransition, popoverPlacement, get Menu() {
      return ge;
    }, get MenuButton() {
      return Se;
    }, get MenuItems() {
      return Me;
    }, get MenuItem() {
      return be;
    }, Popover, get Button() {
      return Button;
    }, FeatherIcon };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = {
  key: 0,
  class: "flex h-7 items-center px-2 text-sm font-medium text-ink-gray-6"
};
const _hoisted_2 = ["onClick"];
const _hoisted_3 = { class: "whitespace-nowrap text-ink-gray-7" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Menu"], {
    as: "div",
    class: "relative inline-block text-left"
  }, {
    default: withCtx(({ open }) => [
      createVNode($setup["Popover"], {
        transition: $setup.dropdownTransition,
        show: open,
        placement: $setup.popoverPlacement
      }, {
        target: withCtx(() => [
          createVNode(
            $setup["MenuButton"],
            { as: "div" },
            {
              default: withCtx(() => [
                _ctx.$slots.default ? renderSlot(_ctx.$slots, "default", normalizeProps(mergeProps({ key: 0 }, { open }))) : (openBlock(), createBlock($setup["Button"], mergeProps({
                  key: 1,
                  active: open
                }, $props.button), {
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
                  _: 2
                  /* DYNAMIC */
                }, 1040, ["active"]))
              ]),
              _: 2
              /* DYNAMIC */
            },
            1024
            /* DYNAMIC_SLOTS */
          )
        ]),
        body: withCtx(() => [
          createVNode($setup["MenuItems"], {
            class: normalizeClass(["mt-2 min-w-40 divide-y divide-outline-gray-1 rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none", {
              "left-0 origin-top-left": $props.placement == "left",
              "right-0 origin-top-right": $props.placement == "right",
              "inset-x-0 origin-top": $props.placement == "center"
            }])
          }, {
            default: withCtx(() => [
              (openBlock(true), createElementBlock(
                Fragment,
                null,
                renderList($setup.groups, (group) => {
                  return openBlock(), createElementBlock("div", {
                    key: group.key,
                    class: "p-1.5"
                  }, [
                    group.group && !group.hideLabel ? (openBlock(), createElementBlock(
                      "div",
                      _hoisted_1,
                      toDisplayString(group.group),
                      1
                      /* TEXT */
                    )) : createCommentVNode("v-if", true),
                    (openBlock(true), createElementBlock(
                      Fragment,
                      null,
                      renderList(group.items, (item) => {
                        return openBlock(), createBlock(
                          $setup["MenuItem"],
                          {
                            key: item.label
                          },
                          {
                            default: withCtx(({ active }) => [
                              item.component ? (openBlock(), createBlock(resolveDynamicComponent(item.component), {
                                key: 0,
                                active
                              }, null, 8, ["active"])) : (openBlock(), createElementBlock("button", {
                                key: 1,
                                class: normalizeClass([
                                  active ? "bg-surface-gray-2" : "text-ink-gray-6",
                                  "group flex h-7 w-full items-center rounded px-2 text-base"
                                ]),
                                onClick: item.onClick
                              }, [
                                item.icon && typeof item.icon === "string" ? (openBlock(), createBlock($setup["FeatherIcon"], {
                                  key: 0,
                                  name: item.icon,
                                  class: "mr-2 h-4 w-4 flex-shrink-0 text-ink-gray-6",
                                  "aria-hidden": "true"
                                }, null, 8, ["name"])) : item.icon ? (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                  key: 1,
                                  class: "mr-2 h-4 w-4 flex-shrink-0 text-ink-gray-6"
                                })) : createCommentVNode("v-if", true),
                                createBaseVNode(
                                  "span",
                                  _hoisted_3,
                                  toDisplayString(item.label),
                                  1
                                  /* TEXT */
                                )
                              ], 10, _hoisted_2))
                            ]),
                            _: 2
                            /* DYNAMIC */
                          },
                          1024
                          /* DYNAMIC_SLOTS */
                        );
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            _: 1
            /* STABLE */
          }, 8, ["class"])
        ]),
        _: 2
        /* DYNAMIC */
      }, 1032, ["transition", "show", "placement"])
    ]),
    _: 3
    /* FORWARDED */
  });
}
_sfc_main.__file = "src/components/Dropdown.vue";
const Dropdown = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Dropdown.vue"]]);
export {
  Dropdown as D
};
