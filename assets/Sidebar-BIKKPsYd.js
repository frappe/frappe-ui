import { aP as markRaw, aB as openBlock, aG as createElementBlock, aF as createBaseVNode, ay as defineComponent, aY as inject, aC as createBlock, aD as withCtx, aR as normalizeClass, aZ as renderSlot, aN as toDisplayString, bx as resolveDynamicComponent, aE as createVNode, cl as useRouter, aH as createCommentVNode, az as ref, aK as Fragment, aJ as renderList, bg as Transition, cb as mergeModels, cc as useModel, bV as provide, aW as computed, d0 as useBreakpoints, d1 as breakpointsTailwind, aS as normalizeProps, aT as guardReactiveProps } from "./vendor-DISWWsWY.js";
import { L as LucideChevronDown } from "./chevron-down-D-_-s-uA.js";
import { D as Dropdown } from "./Dropdown-DGNrRokw.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { B as Button, _ as __unplugin_components_0 } from "./Button-DtJxsHYT.js";
const _hoisted_1$6 = {
  class: "lucide lucide-chevron-right",
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
function render$2(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$6, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "m9 18 6-6-6-6" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideChevronRight = markRaw({ name: "lucide-chevron-right", render: render$2 });
const _hoisted_1$5 = {
  class: "lucide lucide-link",
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
  return openBlock(), createElementBlock("svg", _hoisted_1$5, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const Link = markRaw({ name: "lucide-link", render: render$1 });
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "SidebarHeader",
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    logo: { type: null, required: false },
    menuItems: { type: Array, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const isCollapsed = inject("isSidebarCollapsed", false);
    const __returned__ = { props, isCollapsed, get LucideChevronDown() {
      return LucideChevronDown;
    }, Dropdown };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$4 = { class: "w-8 h-8 rounded overflow-hidden" };
const _hoisted_2$2 = ["src"];
const _hoisted_3$2 = {
  key: 1,
  class: "w-full h-full bg-surface-gray-4 flex items-center justify-center text-ink-gray-7"
};
const _hoisted_4$1 = { class: "text-base font-medium text-ink-gray-8 leading-none" };
const _hoisted_5$1 = { class: "mt-1 text-sm text-ink-gray-6 leading-none" };
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Dropdown"], {
    options: $setup.props.menuItems
  }, {
    default: withCtx(({ open }) => [
      createBaseVNode(
        "button",
        {
          class: normalizeClass([
            "flex h-12 items-center rounded-md py-2 duration-300 ease-in-out w-[14rem]",
            $setup.isCollapsed ? "w-auto px-0" : open ? "bg-surface-white px-2 shadow-sm" : "px-2 hover:bg-surface-gray-3"
          ])
        },
        [
          createBaseVNode("div", _hoisted_1$4, [
            renderSlot(_ctx.$slots, "logo", {}, () => [
              typeof $setup.props.logo === "string" ? (openBlock(), createElementBlock("img", {
                key: 0,
                src: $setup.props.logo,
                class: "w-full h-full object-cover",
                alt: "Logo"
              }, null, 8, _hoisted_2$2)) : !$setup.props.logo ? (openBlock(), createElementBlock(
                "div",
                _hoisted_3$2,
                toDisplayString($setup.props.title.charAt(0).toUpperCase()),
                1
                /* TEXT */
              )) : (openBlock(), createBlock(resolveDynamicComponent($setup.props.logo), {
                key: 2,
                class: "w-full h-full"
              }))
            ])
          ]),
          createBaseVNode(
            "div",
            {
              class: normalizeClass([
                "flex flex-1 flex-col text-left duration-300 ease-in-out truncate",
                $setup.isCollapsed ? "ml-0 w-0 overflow-hidden opacity-0" : "ml-2 w-auto opacity-100"
              ])
            },
            [
              createBaseVNode(
                "div",
                _hoisted_4$1,
                toDisplayString($setup.props.title),
                1
                /* TEXT */
              ),
              createBaseVNode(
                "div",
                _hoisted_5$1,
                toDisplayString($setup.props.subtitle),
                1
                /* TEXT */
              )
            ],
            2
            /* CLASS */
          ),
          createBaseVNode(
            "div",
            {
              class: normalizeClass([
                "duration-300 ease-in-out",
                $setup.isCollapsed ? "ml-0 w-0 overflow-hidden opacity-0" : "ml-2 w-auto opacity-100"
              ])
            },
            [
              createVNode($setup["LucideChevronDown"], { class: "h-4 w-4 text-ink-gray-7" })
            ],
            2
            /* CLASS */
          )
        ],
        2
        /* CLASS */
      )
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["options"]);
}
_sfc_main$3.__file = "src/components/Sidebar/SidebarHeader.vue";
const SidebarHeader = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Sidebar/SidebarHeader.vue"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SidebarItem",
  props: {
    label: { type: String, required: true },
    icon: { type: null, required: false },
    suffix: { type: String, required: false },
    to: { type: null, required: false },
    isActive: { type: Boolean, required: false },
    onClick: { type: Function, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const isCollapsed = inject("isSidebarCollapsed", false);
    const router = useRouter();
    function handleClick() {
      if (props.onClick) {
        props.onClick();
      } else if (props.to) {
        router.replace(props.to);
      }
    }
    const __returned__ = { props, isCollapsed, router, handleClick, Button, Tooltip: __unplugin_components_0 };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$3 = { class: "flex w-full items-center justify-between transition-all ease-in-out px-2 py-1" };
const _hoisted_2$1 = { class: "flex items-center truncate" };
const _hoisted_3$1 = { class: "grid flex-shrink-0 place-items-center" };
const _hoisted_4 = {
  key: 0,
  class: "size-4 text-ink-gray-6"
};
const _hoisted_5 = {
  key: 0,
  class: "text-sm text-ink-gray-4"
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Button"], {
    label: $setup.props.label,
    onClick: $setup.handleClick,
    class: normalizeClass([
      "!w-full",
      $setup.props.isActive ? "!bg-surface-selected shadow-sm" : "hover:bg-surface-gray-2"
    ]),
    variant: "ghost"
  }, {
    icon: withCtx(() => [
      createBaseVNode("div", _hoisted_1$3, [
        createBaseVNode("div", _hoisted_2$1, [
          createVNode($setup["Tooltip"], {
            text: $setup.props.label,
            placement: "right",
            disabled: !$setup.isCollapsed
          }, {
            default: withCtx(() => [
              createBaseVNode("span", _hoisted_3$1, [
                renderSlot(_ctx.$slots, "icon", {}, () => [
                  $setup.props.icon && typeof $setup.props.icon === "string" ? (openBlock(), createElementBlock(
                    "span",
                    _hoisted_4,
                    toDisplayString($setup.props.icon),
                    1
                    /* TEXT */
                  )) : (openBlock(), createBlock(resolveDynamicComponent($setup.props.icon), {
                    key: 1,
                    class: "size-4 text-ink-gray-6"
                  }))
                ])
              ])
            ]),
            _: 3
            /* FORWARDED */
          }, 8, ["text", "disabled"]),
          createVNode($setup["Tooltip"], {
            text: $setup.props.label,
            placement: "right",
            disabled: $setup.isCollapsed,
            hoverDelay: 1.5
          }, {
            default: withCtx(() => [
              createBaseVNode(
                "span",
                {
                  class: normalizeClass([
                    "flex-1 flex-shrink-0 truncate text-sm transition-all ease-in-out",
                    $setup.isCollapsed ? "ml-0 w-0 overflow-hidden opacity-0" : "ml-2 w-auto opacity-100"
                  ])
                },
                toDisplayString($setup.props.label),
                3
                /* TEXT, CLASS */
              )
            ]),
            _: 1
            /* STABLE */
          }, 8, ["text", "disabled"])
        ]),
        createBaseVNode(
          "div",
          {
            class: normalizeClass([
              "transition-all ease-in-out",
              $setup.isCollapsed ? "ml-0 w-0 overflow-hidden opacity-0" : "ml-auto w-auto opacity-100"
            ])
          },
          [
            renderSlot(_ctx.$slots, "suffix", {}, () => [
              $setup.props.suffix ? (openBlock(), createElementBlock(
                "span",
                _hoisted_5,
                toDisplayString($setup.props.suffix),
                1
                /* TEXT */
              )) : createCommentVNode("v-if", true)
            ])
          ],
          2
          /* CLASS */
        )
      ])
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["label", "class"]);
}
_sfc_main$2.__file = "src/components/Sidebar/SidebarItem.vue";
const SidebarItem = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Sidebar/SidebarItem.vue"]]);
const _hoisted_1$2 = {
  class: "lucide lucide-panel-right-open",
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
  return openBlock(), createElementBlock("svg", _hoisted_1$2, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "rect",
      {
        width: "18",
        height: "18",
        x: "3",
        y: "3",
        rx: "2"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "M15 3v18" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "m10 15-3-3 3-3" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucidePanelRightOpen = markRaw({ name: "lucide-panel-right-open", render });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SidebarSection",
  props: {
    label: { type: String, required: false },
    items: { type: Array, required: true },
    collapsible: { type: Boolean, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const isSidebarCollapsed = inject("isSidebarCollapsed", false);
    const isCollapsed = ref(false);
    const __returned__ = { props, isSidebarCollapsed, isCollapsed, SidebarItem, get LucideChevronRight() {
      return LucideChevronRight;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = { class: "flex flex-col mt-2" };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = {
  key: 0,
  class: "space-y-0.5"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    $setup.props.label ? (openBlock(), createElementBlock(
      "div",
      {
        key: 0,
        class: normalizeClass(["relative flex items-center gap-1 px-2 py-1.5", $setup.props.collapsible ? "cursor-pointer" : ""]),
        onClick: _cache[0] || (_cache[0] = ($event) => $setup.props.collapsible ? $setup.isCollapsed = !$setup.isCollapsed : null)
      },
      [
        createBaseVNode(
          "h3",
          {
            class: normalizeClass([
              "h-4 text-sm text-ink-gray-5 transition-all duration-300 ease-in-out",
              $setup.isSidebarCollapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100"
            ])
          },
          toDisplayString($setup.props.label),
          3
          /* TEXT, CLASS */
        ),
        $setup.props.collapsible ? (openBlock(), createElementBlock("div", _hoisted_2, [
          !$setup.isSidebarCollapsed ? (openBlock(), createBlock($setup["LucideChevronRight"], {
            key: 0,
            class: normalizeClass(["w-4 h-4 text-ink-gray-5 transition-all duration-300 ease-in-out", { "rotate-90": !$setup.isCollapsed }])
          }, null, 8, ["class"])) : createCommentVNode("v-if", true)
        ])) : createCommentVNode("v-if", true),
        $setup.isSidebarCollapsed ? (openBlock(), createElementBlock(
          "div",
          {
            key: 1,
            class: normalizeClass(["absolute top-0 left-0 flex h-full w-full items-center justify-center transition-all duration-300 ease-in-out", $setup.isSidebarCollapsed ? "opacity-100" : "opacity-0"])
          },
          _cache[1] || (_cache[1] = [
            createBaseVNode(
              "hr",
              { class: "w-full border-t border-ink-gray-3" },
              null,
              -1
              /* HOISTED */
            )
          ]),
          2
          /* CLASS */
        )) : createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    )) : createCommentVNode("v-if", true),
    createVNode(Transition, {
      "enter-active-class": "duration-300 ease-in",
      "leave-active-class": "duration-300 ease-[cubic-bezier(0, 1, 0.5, 1)]",
      "enter-to-class": "max-h-[200px] overflow-hidden",
      "leave-from-class": "max-h-[200px] overflow-hidden",
      "enter-from-class": "max-h-0 overflow-hidden",
      "leave-to-class": "max-h-0 overflow-hidden"
    }, {
      default: withCtx(() => [
        !$setup.isCollapsed ? (openBlock(), createElementBlock("nav", _hoisted_3, [
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList($setup.props.items, (item) => {
              return openBlock(), createBlock($setup["SidebarItem"], {
                key: item.label,
                label: item.label,
                icon: item.icon,
                suffix: item.suffix,
                to: item.to,
                isActive: item.isActive,
                isCollapsed: $setup.isSidebarCollapsed,
                onClick: item.onClick
              }, null, 8, ["label", "icon", "suffix", "to", "isActive", "isCollapsed", "onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : createCommentVNode("v-if", true)
      ]),
      _: 1
      /* STABLE */
    })
  ]);
}
_sfc_main$1.__file = "src/components/Sidebar/SidebarSection.vue";
const SidebarSection = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Sidebar/SidebarSection.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Sidebar",
  props: /* @__PURE__ */ mergeModels({
    header: { type: Object, required: false },
    sections: { type: Array, required: false }
  }, {
    "collapsed": {
      type: Boolean,
      default: null
    },
    "collapsedModifiers": {}
  }),
  emits: ["update:collapsed"],
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const isCollapsed = useModel(__props, "collapsed");
    provide("isSidebarCollapsed", isCollapsed);
    const shouldCollapse = computed(() => isCollapsed.value || isMobile.value);
    const breakpoints = useBreakpoints(breakpointsTailwind);
    const isMobile = breakpoints.smaller("sm");
    const __returned__ = { props, isCollapsed, shouldCollapse, breakpoints, isMobile, SidebarHeader, SidebarItem, get LucidePanelRightOpen() {
      return LucidePanelRightOpen;
    }, SidebarSection };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "mt-auto flex flex-col gap-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      class: normalizeClass(["flex h-full flex-col flex-shrink-0 overflow-y-auto overflow-x-hidden border-r border-outline-gray-1 bg-surface-menu-bar transition-all duration-300 ease-in-out p-2", $setup.shouldCollapse ? "w-12" : "w-60"])
    },
    [
      $setup.props.header ? (openBlock(), createBlock($setup["SidebarHeader"], {
        key: 0,
        isCollapsed: $setup.shouldCollapse,
        title: $setup.props.header.title,
        subtitle: $setup.props.header.subtitle,
        logo: $setup.props.header.logo,
        "menu-items": $setup.props.header.menuItems
      }, {
        logo: withCtx(() => [
          renderSlot(_ctx.$slots, "header-logo")
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["isCollapsed", "title", "subtitle", "logo", "menu-items"])) : createCommentVNode("v-if", true),
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($setup.props.sections, (section) => {
          return openBlock(), createBlock($setup["SidebarSection"], {
            key: section.label,
            label: section.label,
            items: section.items,
            collapsible: section.collapsible
          }, null, 8, ["label", "items", "collapsible"]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      createBaseVNode("div", _hoisted_1, [
        renderSlot(_ctx.$slots, "footer-items", normalizeProps(guardReactiveProps({ isCollapsed: $setup.shouldCollapse, isMobile: $setup.isMobile }))),
        createVNode($setup["SidebarItem"], {
          label: $setup.shouldCollapse ? "Expand" : "Collapse",
          isCollapsed: $setup.shouldCollapse,
          onClick: _cache[0] || (_cache[0] = ($event) => $setup.isCollapsed = !$setup.isCollapsed)
        }, {
          icon: withCtx(() => [
            createVNode($setup["LucidePanelRightOpen"], {
              class: normalizeClass(["size-4 text-ink-gray-6 duration-300 ease-in-out", { "rotate-180": $setup.shouldCollapse }])
            }, null, 8, ["class"])
          ]),
          _: 1
          /* STABLE */
        }, 8, ["label", "isCollapsed"])
      ])
    ],
    2
    /* CLASS */
  );
}
_sfc_main.__file = "src/components/Sidebar/Sidebar.vue";
const Sidebar = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Sidebar/Sidebar.vue"]]);
export {
  Link as L,
  Sidebar as S,
  LucideChevronRight as a
};
