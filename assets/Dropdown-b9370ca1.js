import { ay as defineComponent, bH as useRouter, aQ as computed, bZ as ge, b_ as Se, b$ as Me, c0 as be, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aT as renderSlot, aU as normalizeProps, aL as mergeProps, aM as createTextVNode, aN as toDisplayString, aW as normalizeClass, aG as createElementBlock, aK as Fragment, aJ as renderList, aH as createCommentVNode, b4 as resolveDynamicComponent, aF as createBaseVNode } from "./vendor-ff760363.js";
import { P as Popover } from "./Popover-31ec707d.js";
import { B as Button } from "./Button-1d9c794b.js";
import { F as FeatherIcon } from "./FeatherIcon-9c46386e.js";
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
      let onClick = option.onClick || null;
      if (!onClick && option.route && router) {
        onClick = () => router.push(option.route);
      }
      return {
        label: option.label,
        icon: option.icon,
        group: option.group,
        component: option.component,
        onClick
      };
    };
    const filterOptions = (options) => {
      return (options || []).filter(Boolean).filter(
        (option) => option.condition ? option.condition() : true
      ).map((option) => normalizeDropdownItem(option));
    };
    const groups = computed(() => {
      var _a;
      let groups2 = ((_a = props.options[0]) == null ? void 0 : _a.group) ? props.options : [{ group: "", items: props.options }];
      return groups2.map((group, i) => {
        return {
          key: i,
          group: group.group,
          hideLabel: group.hideLabel || false,
          items: filterOptions(group.items)
        };
      });
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
    }, Popover, Button, FeatherIcon };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = {
  key: 0,
  class: "flex h-7 items-center px-2 text-sm font-medium text-text-icons-gray-6"
};
const _hoisted_2 = ["onClick"];
const _hoisted_3 = { class: "whitespace-nowrap" };
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
            class: normalizeClass(["mt-2 min-w-40 divide-y divide-gray-100 rounded-lg bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none", {
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
                                  active ? "bg-gray-100" : "text-text-icons-gray-6",
                                  "group flex h-7 w-full items-center rounded px-2 text-base"
                                ]),
                                onClick: item.onClick
                              }, [
                                item.icon && typeof item.icon === "string" ? (openBlock(), createBlock($setup["FeatherIcon"], {
                                  key: 0,
                                  name: item.icon,
                                  class: "mr-2 h-4 w-4 flex-shrink-0 text-text-icons-gray-6",
                                  "aria-hidden": "true"
                                }, null, 8, ["name"])) : item.icon ? (openBlock(), createBlock(resolveDynamicComponent(item.icon), {
                                  key: 1,
                                  class: "mr-2 h-4 w-4 flex-shrink-0 text-text-icons-gray-6"
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
