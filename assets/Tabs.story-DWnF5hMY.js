import { a$ as inject, aN as ref, aF as computed, b3 as watch, aY as nextTick, b1 as onMounted, az as openBlock, aH as createBlock, aP as withCtx, aA as createElementBlock, aT as Fragment, aS as renderList, aG as renderSlot, aU as mergeProps, aB as createBaseVNode, aI as normalizeClass, aJ as resolveDynamicComponent, aK as createCommentVNode, aQ as createTextVNode, aL as toDisplayString, cv as pe, cw as xe, cx as Ie, cy as ye, aD as mergeModels, aE as useModel, bb as provide, aM as createVNode, bc as normalizeProps, bd as guardReactiveProps, cz as me, aC as defineComponent, aR as reactive, bu as h, aO as resolveComponent } from "./vendor-Cta8fDfw.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { F as FeatherIcon } from "./FeatherIcon-Cu67AMYK.js";
const _sfc_main$3 = {
  __name: "TabList",
  setup(__props, { expose: __expose }) {
    __expose();
    const t = inject("tab");
    const tabRef = ref([]);
    const indicator = ref(null);
    const tabsLength = computed(() => {
      var _a;
      return (_a = t.value.tabs.value) == null ? void 0 : _a.length;
    });
    const transitionClass = ref("");
    function moveIndicator(index) {
      if (index >= tabsLength.value) {
        index = tabsLength.value - 1;
      }
      const selectedTab = tabRef.value[index].el;
      if (t.value.vertical.value) {
        indicator.value.style.height = `${selectedTab.offsetHeight}px`;
        indicator.value.style.top = `${selectedTab.offsetTop}px`;
      } else {
        indicator.value.style.width = `${selectedTab.offsetWidth}px`;
        indicator.value.style.left = `${selectedTab.offsetLeft}px`;
      }
    }
    watch(
      () => t.value.tabIndex.value,
      (index) => {
        if (index >= tabsLength.value) {
          t.value.tabIndex.value = tabsLength.value - 1;
        }
        transitionClass.value = "transition-all duration-300 ease-in-out";
        nextTick(() => moveIndicator(index));
      }
    );
    onMounted(() => {
      nextTick(() => moveIndicator(t.value.tabIndex.value));
      setTimeout(() => moveIndicator(t.value.tabIndex.value), 100);
    });
    const __returned__ = { t, tabRef, indicator, tabsLength, transitionClass, moveIndicator, get TabList() {
      return pe;
    }, get Tab() {
      return xe;
    }, ref, watch, computed, onMounted, nextTick, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["TabList"], {
    class: normalizeClass([
      "relative flex",
      $setup.t.vertical ? "flex-col border-r overflow-y-auto" : "gap-7.5 border-b overflow-x-auto items-center px-5"
    ])
  }, {
    default: withCtx(() => [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($setup.t.tabs, (tab, i) => {
          return openBlock(), createBlock(
            $setup["Tab"],
            {
              ref_for: true,
              ref: "tabRef",
              as: "template",
              key: i,
              class: "focus:outline-none focus:transition-none"
            },
            {
              default: withCtx(({ selected }) => [
                renderSlot(_ctx.$slots, "default", mergeProps({ ref_for: true }, { tab, selected }), () => [
                  createBaseVNode(
                    "button",
                    {
                      class: normalizeClass(["flex items-center gap-1.5 text-base text-ink-gray-5 duration-300 ease-in-out hover:text-ink-gray-9", [
                        selected ? "text-ink-gray-9" : "",
                        $setup.t.vertical ? "py-2.5 px-4 border-r border-transparent hover:border-outline-gray-3" : "py-3 border-b border-transparent hover:border-outline-gray-3"
                      ]])
                    },
                    [
                      tab.icon ? (openBlock(), createBlock(resolveDynamicComponent(tab.icon), {
                        key: 0,
                        class: "size-4"
                      })) : createCommentVNode("v-if", true),
                      createTextVNode(
                        " " + toDisplayString(tab.label),
                        1
                        /* TEXT */
                      )
                    ],
                    2
                    /* CLASS */
                  )
                ])
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
      )),
      createBaseVNode(
        "div",
        {
          ref: "indicator",
          class: normalizeClass(["tab-indicator absolute bg-surface-gray-7", [$setup.t.vertical ? "right-0 w-px" : "bottom-0 h-px", $setup.transitionClass]])
        },
        null,
        2
        /* CLASS */
      )
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["class"]);
}
_sfc_main$3.__file = "src/components/Tabs/TabList.vue";
const TabList = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tabs/TabList.vue"]]);
const _sfc_main$2 = {
  __name: "TabPanel",
  setup(__props, { expose: __expose }) {
    __expose();
    const t = inject("tab");
    const __returned__ = { t, get TabPanels() {
      return Ie;
    }, get TabPanel() {
      return ye;
    }, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["TabPanels"], { class: "flex flex-1 overflow-hidden" }, {
    default: withCtx(() => [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($setup.t.tabs, (tab, i) => {
          return openBlock(), createBlock(
            $setup["TabPanel"],
            {
              class: "flex flex-1 flex-col overflow-y-auto focus:outline-none",
              key: i
            },
            {
              default: withCtx(() => [
                renderSlot(_ctx.$slots, "default", mergeProps({ ref_for: true }, { tab }))
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
    ]),
    _: 3
    /* FORWARDED */
  });
}
_sfc_main$2.__file = "src/components/Tabs/TabPanel.vue";
const TabPanel = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tabs/TabPanel.vue"]]);
const _sfc_main$1 = {
  __name: "Tabs",
  props: /* @__PURE__ */ mergeModels({
    as: {
      type: String,
      default: "template"
    },
    tabs: {
      type: Array,
      required: true
    },
    vertical: {
      type: Boolean,
      default: false
    }
  }, {
    "modelValue": {},
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const tabIndex = useModel(__props, "modelValue");
    provide(
      "tab",
      computed(() => ({
        tabIndex,
        tabs: props.tabs,
        vertical: props.vertical
      }))
    );
    const __returned__ = { props, tabIndex, TabList, TabPanel, get TabGroup() {
      return me;
    }, computed, provide };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["TabGroup"], mergeProps(
    $props.as !== "template" ? {
      as: $props.as,
      class: ["flex flex-1 overflow-hidden", $props.vertical ? "" : "flex-col "]
    } : {},
    {
      defaultIndex: $setup.tabIndex,
      selectedIndex: $setup.tabIndex,
      onChange: _cache[0] || (_cache[0] = (idx) => $setup.tabIndex = idx)
    }
  ), {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default", {}, () => [
        createVNode($setup["TabList"], null, {
          default: withCtx(({ tab, selected }) => [
            renderSlot(_ctx.$slots, "tab-item", normalizeProps(guardReactiveProps({ tab, selected })))
          ]),
          _: 3
          /* FORWARDED */
        }),
        createVNode($setup["TabPanel"], null, {
          default: withCtx(({ tab }) => [
            renderSlot(_ctx.$slots, "tab-panel", normalizeProps(guardReactiveProps({ tab })))
          ]),
          _: 3
          /* FORWARDED */
        })
      ])
    ]),
    _: 3
    /* FORWARDED */
  }, 16, ["defaultIndex", "selectedIndex"]);
}
_sfc_main$1.__file = "src/components/Tabs/Tabs.vue";
const Tabs = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tabs/Tabs.vue"]]);
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
          icon: h(FeatherIcon, { class: "w-4 h-4", name: "github" })
        },
        {
          label: "Twitter",
          content: 'Twitter is an American microblogging and social networking service on which users post and interact with messages known as "tweets".',
          icon: h(FeatherIcon, { class: "w-4 h-4", name: "twitter" })
        },
        {
          label: "Linkedin",
          content: "LinkedIn is an American business and employment-oriented online service that operates via websites and mobile apps.",
          icon: h(FeatherIcon, { class: "w-4 h-4", name: "linkedin" })
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
            as: "div",
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
            as: "div",
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
            as: "div",
            class: "border rounded",
            modelValue: $setup.state.index,
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.state.index = $event),
            tabs: $setup.state.tabs_with_icon,
            vertical: ""
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
