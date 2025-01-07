import { bF as inject, az as ref, br as computed, bt as watch, bu as nextTick, bG as onMounted, co as pe, cp as xe, aB as openBlock, aC as createBlock, aD as withCtx, aG as createElementBlock, aK as Fragment, aJ as renderList, bk as renderSlot, aL as mergeProps, aF as createBaseVNode, aQ as normalizeClass, a$ as resolveDynamicComponent, aH as createCommentVNode, aM as createTextVNode, aN as toDisplayString, cq as Ie, cr as ye, cs as mergeModels, ct as useModel, bP as provide, aE as createVNode, aR as normalizeProps, aS as guardReactiveProps, cu as me } from "./vendor-D6xTCnBh.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main$2 = {
  __name: "TabList",
  setup(__props, { expose: __expose }) {
    __expose();
    const tabIndex = inject("tabIndex");
    const tabs = inject("tabs");
    const vertical = inject("vertical");
    const tabRef = ref([]);
    const indicator = ref(null);
    const tabsLength = computed(() => {
      var _a;
      return (_a = tabs.value) == null ? void 0 : _a.length;
    });
    const transitionClass = ref("");
    function moveIndicator(index) {
      if (index >= tabsLength.value) {
        index = tabsLength.value - 1;
      }
      const selectedTab = tabRef.value[index].el;
      if (vertical) {
        indicator.value.style.height = `${selectedTab.offsetHeight}px`;
        indicator.value.style.top = `${selectedTab.offsetTop}px`;
      } else {
        indicator.value.style.width = `${selectedTab.offsetWidth}px`;
        indicator.value.style.left = `${selectedTab.offsetLeft}px`;
      }
    }
    watch(tabIndex, (index) => {
      if (index >= tabsLength.value) {
        tabIndex.value = tabsLength.value - 1;
      }
      transitionClass.value = "transition-all duration-300 ease-in-out";
      nextTick(() => moveIndicator(index));
    });
    onMounted(() => {
      nextTick(() => moveIndicator(tabIndex.value));
      setTimeout(() => moveIndicator(tabIndex.value), 100);
    });
    const __returned__ = { tabIndex, tabs, vertical, tabRef, indicator, tabsLength, transitionClass, moveIndicator, get TabList() {
      return pe;
    }, get Tab() {
      return xe;
    }, ref, watch, computed, onMounted, nextTick, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["TabList"], {
    class: normalizeClass([
      "relative flex",
      $setup.vertical ? "flex-col border-r overflow-y-auto" : "gap-7.5 border-b overflow-x-auto items-center px-5"
    ])
  }, {
    default: withCtx(() => [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($setup.tabs, (tab, i) => {
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
                        $setup.vertical ? "py-2.5 px-4 border-r border-transparent hover:border-outline-gray-3" : "py-3 border-b border-transparent hover:border-outline-gray-3"
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
          class: normalizeClass(["tab-indicator absolute bg-surface-gray-7", [$setup.vertical ? "right-0 w-px" : "bottom-0 h-px", $setup.transitionClass]])
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
_sfc_main$2.__file = "src/components/Tabs/TabList.vue";
const TabList = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tabs/TabList.vue"]]);
const _sfc_main$1 = {
  __name: "TabPanel",
  setup(__props, { expose: __expose }) {
    __expose();
    const tabs = inject("tabs");
    const __returned__ = { tabs, get TabPanels() {
      return Ie;
    }, get TabPanel() {
      return ye;
    }, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["TabPanels"], { class: "flex flex-1 overflow-hidden" }, {
    default: withCtx(() => [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($setup.tabs, (tab, i) => {
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
_sfc_main$1.__file = "src/components/Tabs/TabPanel.vue";
const TabPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tabs/TabPanel.vue"]]);
const _sfc_main = {
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
    provide("tabIndex", tabIndex);
    provide("tabs", props.tabs);
    provide("vertical", props.vertical);
    const __returned__ = { props, tabIndex, TabList, TabPanel, get TabGroup() {
      return me;
    }, provide };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
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
_sfc_main.__file = "src/components/Tabs/Tabs.vue";
const Tabs = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tabs/Tabs.vue"]]);
export {
  Tabs as T
};
