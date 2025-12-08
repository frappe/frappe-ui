import { aC as defineComponent, a$ as inject, az as openBlock, aH as createBlock, aP as withCtx, aB as createBaseVNode, aI as normalizeClass, aG as renderSlot, aA as createElementBlock, aL as toDisplayString, aJ as resolveDynamicComponent, aM as createVNode, aW as useRouter, aK as createCommentVNode, ay as markRaw, aN as ref, aT as Fragment, aS as renderList, bx as Transition, aD as mergeModels, aE as useModel, bb as provide, aF as computed, bS as useBreakpoints, bc as normalizeProps, bd as guardReactiveProps, bT as breakpointsTailwind, bG as createStaticVNode, aR as reactive, aO as resolveComponent } from "./vendor-B38Td3qf.js";
import { L as LucideChevronDown } from "./chevron-down-Dt2xhbKa.js";
import { D as Dropdown } from "./Dropdown-BeDuI-i1.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { B as Button, _ as __unplugin_components_0 } from "./Button-CwRKMobC.js";
import { L as LucideChevronRight } from "./chevron-right-C7uweiv3.js";
import { L as Link } from "./link-DeVku6cN.js";
import { S as Settings } from "./settings-CguLyVAE.js";
import { U as User } from "./user-DlIS7xyW.js";
import "./FeatherIcon-CHSfV2m6.js";
import "./Switch-KUV-F-Px.js";
import "./useId-DJabvbK8.js";
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
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
const _hoisted_1$f = { class: "w-8 h-8 rounded overflow-hidden" };
const _hoisted_2$2 = ["src"];
const _hoisted_3$2 = {
  key: 1,
  class: "w-full h-full bg-surface-gray-4 flex items-center justify-center text-ink-gray-7"
};
const _hoisted_4$1 = { class: "text-base font-medium text-ink-gray-8 leading-none" };
const _hoisted_5$1 = { class: "mt-1 text-sm text-ink-gray-6 leading-none" };
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
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
          createBaseVNode("div", _hoisted_1$f, [
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
_sfc_main$4.__file = "src/components/Sidebar/SidebarHeader.vue";
const SidebarHeader = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Sidebar/SidebarHeader.vue"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "SidebarItem",
  props: {
    label: { type: String, required: true },
    accessKey: { type: String, required: false },
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
const _hoisted_1$e = { class: "flex w-full items-center justify-between transition-all ease-in-out px-2 py-1" };
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
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Button"], {
    label: $setup.props.label,
    onClick: $setup.handleClick,
    class: normalizeClass([
      "!w-full focus-visible:ring-0 focus:outline-none",
      $setup.props.isActive ? "!bg-surface-selected shadow-sm" : "hover:bg-surface-gray-2"
    ]),
    variant: "ghost",
    accesskey: $setup.props.accessKey
  }, {
    icon: withCtx(() => [
      createBaseVNode("div", _hoisted_1$e, [
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
  }, 8, ["label", "class", "accesskey"]);
}
_sfc_main$3.__file = "src/components/Sidebar/SidebarItem.vue";
const SidebarItem = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Sidebar/SidebarItem.vue"]]);
const _hoisted_1$d = {
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
function render$a(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$d, _cache[0] || (_cache[0] = [
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
const LucidePanelRightOpen = markRaw({ name: "lucide-panel-right-open", render: render$a });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
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
const _hoisted_1$c = { class: "flex flex-col mt-2" };
const _hoisted_2 = { key: 0 };
const _hoisted_3 = {
  key: 0,
  class: "space-y-0.5"
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$c, [
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
              return renderSlot(_ctx.$slots, "sidebar-item", {
                key: item.label,
                item,
                isCollapsed: $setup.isSidebarCollapsed
              }, () => [
                createVNode($setup["SidebarItem"], {
                  label: item.label,
                  accessKey: item.accessKey,
                  icon: item.icon,
                  suffix: item.suffix,
                  to: item.to,
                  isActive: item.isActive,
                  isCollapsed: $setup.isSidebarCollapsed,
                  onClick: item.onClick
                }, null, 8, ["label", "accessKey", "icon", "suffix", "to", "isActive", "isCollapsed", "onClick"])
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])) : createCommentVNode("v-if", true)
      ]),
      _: 3
      /* FORWARDED */
    })
  ]);
}
_sfc_main$2.__file = "src/components/Sidebar/SidebarSection.vue";
const SidebarSection = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Sidebar/SidebarSection.vue"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Sidebar",
  props: /* @__PURE__ */ mergeModels({
    header: { type: Object, required: false },
    sections: { type: Array, required: false },
    disableCollapse: { type: Boolean, required: false }
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
    const shouldCollapse = computed(() => (isCollapsed.value || isMobile.value) && !props.disableCollapse);
    const breakpoints = useBreakpoints(breakpointsTailwind);
    const isMobile = breakpoints.smaller("sm");
    const __returned__ = { props, isCollapsed, shouldCollapse, breakpoints, isMobile, SidebarHeader, SidebarItem, get LucidePanelRightOpen() {
      return LucidePanelRightOpen;
    }, SidebarSection };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$b = { class: "mt-auto flex flex-col gap-2" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
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
          }, {
            "sidebar-item": withCtx(({ item, isCollapsed }) => [
              renderSlot(_ctx.$slots, "sidebar-item", {
                item,
                isCollapsed
              })
            ]),
            _: 2
            /* DYNAMIC */
          }, 1032, ["label", "items", "collapsible"]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      createBaseVNode("div", _hoisted_1$b, [
        renderSlot(_ctx.$slots, "footer-items", normalizeProps(guardReactiveProps({ isCollapsed: $setup.shouldCollapse, isMobile: $setup.isMobile }))),
        !$setup.props.disableCollapse ? (openBlock(), createBlock($setup["SidebarItem"], {
          key: 0,
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
        }, 8, ["label", "isCollapsed"])) : createCommentVNode("v-if", true)
      ])
    ],
    2
    /* CLASS */
  );
}
_sfc_main$1.__file = "src/components/Sidebar/Sidebar.vue";
const Sidebar = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Sidebar/Sidebar.vue"]]);
const _hoisted_1$a = {
  class: "lucide lucide-bell",
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
function render$9(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$a, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "M10.268 21a2 2 0 0 0 3.464 0" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const Notifications = markRaw({ name: "lucide-bell", render: render$9 });
const _hoisted_1$9 = {
  class: "lucide lucide-briefcase",
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
function render$8(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$9, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "rect",
      {
        width: "20",
        height: "14",
        x: "2",
        y: "6",
        rx: "2"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const Deals = markRaw({ name: "lucide-briefcase", render: render$8 });
const _hoisted_1$8 = {
  class: "lucide lucide-building",
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
function render$7(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$8, _cache[0] || (_cache[0] = [
    createStaticVNode('<rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path>', 11)
  ]));
}
const Organizations = markRaw({ name: "lucide-building", render: render$7 });
const _hoisted_1$7 = {
  class: "lucide lucide-square-check-big",
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
function render$6(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$7, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "m9 11 3 3L22 4" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const Tasks = markRaw({ name: "lucide-check-square", render: render$6 });
const _hoisted_1$6 = {
  class: "lucide lucide-clipboard",
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
function render$5(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$6, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "rect",
      {
        width: "8",
        height: "4",
        x: "8",
        y: "2",
        rx: "1",
        ry: "1"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const Notes = markRaw({ name: "lucide-clipboard", render: render$5 });
const _hoisted_1$5 = {
  class: "lucide lucide-mail",
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
function render$4(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$5, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "rect",
      {
        x: "2",
        y: "4",
        width: "20",
        height: "16",
        rx: "2"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const EmailTemplates = markRaw({ name: "lucide-mail", render: render$4 });
const _hoisted_1$4 = {
  class: "lucide lucide-moon",
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
function render$3(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$4, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const Moon = markRaw({ name: "lucide-moon", render: render$3 });
const _hoisted_1$3 = {
  class: "lucide lucide-phone",
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
  return openBlock(), createElementBlock("svg", _hoisted_1$3, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const CallLogs = markRaw({ name: "lucide-phone", render: render$2 });
const _hoisted_1$2 = {
  class: "lucide lucide-user-check",
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
      { d: "m16 11 2 2 4-4" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "circle",
      {
        cx: "9",
        cy: "7",
        r: "4"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const Contacts = markRaw({ name: "lucide-user-check", render: render$1 });
const _hoisted_1$1 = {
  class: "lucide lucide-users",
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
      { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "M16 3.128a4 4 0 0 1 0 7.744" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "M22 21v-2a4 4 0 0 0-3-3.87" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "circle",
      {
        cx: "9",
        cy: "7",
        r: "4"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const Leads = markRaw({ name: "lucide-users", render });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Sidebar.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const crmSidebar = reactive({
      header: {
        title: "Frappe CRM",
        subtitle: "Jane Doe",
        logo: "https://raw.githubusercontent.com/frappe/crm/develop/.github/logo.svg",
        menuItems: [
          { label: "Toggle Theme", icon: Moon, onClick: toggleTheme },
          { label: "Help", to: "/help", icon: Settings, onClick: () => alert("Help clicked!") },
          { label: "Logout", to: "/logout", icon: User, onClick: () => alert("Logging out...") }
        ]
      },
      sections: [
        {
          label: "",
          items: [
            { label: "Notifications", icon: Notifications, to: "" }
          ]
        },
        {
          label: "",
          items: [
            { label: "Leads", icon: Leads, to: "/leads" },
            { label: "Deals", icon: Deals, to: "/deals" },
            { label: "Contacts", icon: Contacts, to: "/contacts" },
            { label: "Organizations", icon: Organizations, to: "/organizations" },
            { label: "Notes", icon: Notes, to: "/notes" },
            { label: "Tasks", icon: Tasks, to: "/tasks" },
            { label: "Call Logs", icon: CallLogs, to: "/call-logs" },
            { label: "Email Templates", icon: EmailTemplates, to: "/email-templates" }
          ]
        },
        {
          label: "Views",
          collapsible: true,
          items: [
            { label: "My Open Deals", icon: Link, to: "/my-open-deals" },
            { label: "Partnership Deals", icon: Link, to: "/partnership-deals" },
            { label: "Unassigned Deals", icon: Link, to: "/unassigned-deals" },
            { label: "Enterprise Pipeline", icon: Link, to: "/enterprise-pipeline" }
          ]
        }
      ]
    });
    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
    }
    const __returned__ = { crmSidebar, toggleTheme, Sidebar };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "flex h-screen w-full flex-col bg-surface-white shadow" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, null, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Sidebar" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["Sidebar"], {
              header: $setup.crmSidebar.header,
              sections: $setup.crmSidebar.sections
            }, null, 8, ["header", "sections"])
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
_sfc_main.__file = "src/components/Sidebar/Sidebar.story.vue";
const Sidebar_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Sidebar/Sidebar.story.vue"]]);
export {
  Sidebar_story as default
};
