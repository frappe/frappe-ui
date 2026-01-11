import { ay as _export_sfc, az as defineComponent, aM as mergeModels, aN as useModel, bk as h, aD as openBlock, aE as createBlock, aF as withCtx, aH as createVNode, aQ as normalizeClass, aI as createBaseVNode, aL as createElementBlock, aV as Fragment, aU as renderList, aP as renderSlot, aW as mergeProps, aR as resolveDynamicComponent, aS as createCommentVNode, aT as createTextVNode, aJ as toDisplayString, cz as TabsContent_default, cA as TabsIndicator_default, cB as TabsList_default, cC as TabsRoot_default, cD as TabsTrigger_default, aK as markRaw, aB as reactive, aC as resolveComponent } from "./vendor-DFWYVX6c.js";
const indicatorXCss = `left-0 bottom-0 h-[2px] w-[--reka-tabs-indicator-size] transition-[width,transform]
                          translate-x-[--reka-tabs-indicator-position] translate-y-[1px]`;
const indicatorYCss = `right-0 top-0 w-[2px] h-[--reka-tabs-indicator-size]
                       translate-y-[--reka-tabs-indicator-position] transition-[height,transform]`;
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Tabs",
  props: /* @__PURE__ */ mergeModels({
    as: { type: String, required: false },
    tabs: { type: Array, required: true },
    vertical: { type: Boolean, required: false }
  }, {
    "modelValue": { type: [String, Number], ...{ default: 0 } },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const model = useModel(__props, "modelValue");
    const Btn = h("button");
    const __returned__ = { props, model, indicatorXCss, indicatorYCss, Btn, get TabsContent() {
      return TabsContent_default;
    }, get TabsIndicator() {
      return TabsIndicator_default;
    }, get TabsList() {
      return TabsList_default;
    }, get TabsRoot() {
      return TabsRoot_default;
    }, get TabsTrigger() {
      return TabsTrigger_default;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["TabsRoot"], {
    as: $setup.props.as,
    class: "flex flex-1 overflow-hidden flex-col data-[orientation=vertical]:flex-row",
    orientation: $setup.props.vertical ? "vertical" : "horizontal",
    "default-value": $setup.props.tabs[0].label,
    modelValue: $setup.model,
    "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.model = $event)
  }, {
    default: withCtx(() => [
      createVNode($setup["TabsList"], {
        class: normalizeClass(["relative min-h-fit flex data-[orientation=vertical]:flex-col p-1 border-b data-[orientation=vertical]:border-r gap-5", {
          "overflow-x-auto overflow-y-hidden px-5": !$setup.props.vertical,
          "py-3": $setup.props.vertical
        }])
      }, {
        default: withCtx(() => [
          createVNode($setup["TabsIndicator"], {
            class: normalizeClass(["absolute rounded-full duration-300", $setup.props.vertical ? $setup.indicatorYCss : $setup.indicatorXCss])
          }, {
            default: withCtx(() => _cache[1] || (_cache[1] = [
              createBaseVNode(
                "div",
                { class: "w-full h-full bg-surface-gray-7" },
                null,
                -1
                /* HOISTED */
              )
            ])),
            _: 1
            /* STABLE */
          }, 8, ["class"]),
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList($setup.props.tabs, (tab, i) => {
              return openBlock(), createBlock($setup["TabsTrigger"], {
                as: "template",
                value: i
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "tab-item", mergeProps({ ref_for: true }, { tab }), () => [
                    (openBlock(), createBlock(resolveDynamicComponent(tab.route ? "router-link" : $setup.Btn), {
                      to: tab.route,
                      class: normalizeClass(["flex items-center gap-1.5 text-base text-ink-gray-5 duration-300 ease-in-out hover:text-ink-gray-9 data-[state=active]:text-ink-gray-9", { "px-2.5": $setup.props.vertical, "py-2.5": !$setup.props.vertical }])
                    }, {
                      default: withCtx(() => [
                        tab.icon ? (openBlock(), createBlock(resolveDynamicComponent(tab.icon), {
                          key: 0,
                          class: "size-4"
                        })) : createCommentVNode("v-if", true),
                        createTextVNode(
                          " " + toDisplayString(tab.label),
                          1
                          /* TEXT */
                        )
                      ]),
                      _: 2
                      /* DYNAMIC */
                    }, 1032, ["to", "class"]))
                  ])
                ]),
                _: 2
                /* DYNAMIC */
              }, 1032, ["value"]);
            }),
            256
            /* UNKEYED_FRAGMENT */
          ))
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["class"]),
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($setup.props.tabs, (tab, i) => {
          return openBlock(), createBlock($setup["TabsContent"], {
            value: i,
            class: "flex flex-col overflow-auto"
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "tab-panel", mergeProps({ ref_for: true }, { tab }))
            ]),
            _: 2
            /* DYNAMIC */
          }, 1032, ["value"]);
        }),
        256
        /* UNKEYED_FRAGMENT */
      ))
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["as", "orientation", "default-value", "modelValue"]);
}
_sfc_main$1.__file = "src/components/Tabs/Tabs.vue";
const Tabs = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tabs/Tabs.vue"]]);
const _hoisted_1$3 = {
  class: "lucide lucide-github",
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
      { d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "M9 18c-4.51 2-5-2-7-2" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideGithub = markRaw({ name: "lucide-github", render: render$2 });
const _hoisted_1$2 = {
  class: "lucide lucide-twitter",
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
      { d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideTwitter = markRaw({ name: "lucide-twitter", render: render$1 });
const _hoisted_1$1 = {
  class: "lucide lucide-linkedin",
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
      { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "rect",
      {
        width: "4",
        height: "12",
        x: "2",
        y: "9"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "circle",
      {
        cx: "4",
        cy: "4",
        r: "2"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideLinkedin = markRaw({ name: "lucide-linkedin", render });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Tabs.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      index: 0,
      tabs_without_icon: [
        {
          label: "Github",
          content: "Github is a code hosting platform for version control and collaboration. It lets you and others work together on projects from anywhere."
        },
        {
          label: "Twitter",
          content: 'Twitter is an American microblogging and social networking service on which users post and interact with messages known as "tweets".'
        },
        {
          label: "Linkedin",
          content: "LinkedIn is an American business and employment-oriented online service that operates via websites and mobile apps."
        }
      ],
      tabs_with_icon: [
        {
          label: "Github",
          content: "Github is a code hosting platform for version control and collaboration. It lets you and others work together on projects from anywhere.",
          icon: LucideGithub
        },
        {
          label: "Twitter",
          content: 'Twitter is an American microblogging and social networking service on which users post and interact with messages known as "tweets".',
          icon: LucideTwitter
        },
        {
          label: "Linkedin",
          content: "LinkedIn is an American business and employment-oriented online service that operates via websites and mobile apps.",
          icon: LucideLinkedin
        }
      ]
    });
    const __returned__ = { state, Tabs };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-5" };
const _hoisted_2 = { class: "p-5" };
const _hoisted_3 = { class: "p-5" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstNumber = resolveComponent("HstNumber");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: "80%" } }, {
    controls: withCtx(() => [
      createVNode(_component_HstNumber, {
        modelValue: $setup.state.index,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.state.index = $event),
        title: "Tab Index"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Without Icon" }, {
        default: withCtx(() => [
          createVNode($setup["Tabs"], {
            class: "border rounded",
            modelValue: $setup.state.index,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state.index = $event),
            tabs: $setup.state.tabs_without_icon
          }, {
            "tab-panel": withCtx(({ tab }) => [
              createBaseVNode(
                "div",
                _hoisted_1,
                toDisplayString(tab.content),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue", "tabs"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "With Icon" }, {
        default: withCtx(() => [
          createVNode($setup["Tabs"], {
            class: "border rounded",
            modelValue: $setup.state.index,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.state.index = $event),
            tabs: $setup.state.tabs_with_icon
          }, {
            "tab-panel": withCtx(({ tab }) => [
              createBaseVNode(
                "div",
                _hoisted_2,
                toDisplayString(tab.content),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue", "tabs"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Vertical Tabs" }, {
        default: withCtx(() => [
          createVNode($setup["Tabs"], {
            class: "border rounded",
            modelValue: $setup.state.index,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.state.index = $event),
            tabs: $setup.state.tabs_with_icon,
            vertical: true
          }, {
            "tab-panel": withCtx(({ tab }) => [
              createBaseVNode(
                "div",
                _hoisted_3,
                toDisplayString(tab.content),
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue", "tabs"])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Tabs/Tabs.story.vue";
const Tabs_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tabs/Tabs.story.vue"]]);
export {
  Tabs_story as default
};
