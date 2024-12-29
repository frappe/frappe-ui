import { br as computed, az as ref, bt as watch, bu as nextTick, bG as onMounted, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aQ as normalizeClass, aG as createElementBlock, aK as Fragment, aJ as renderList, bk as renderSlot, aL as mergeProps, aF as createBaseVNode, a$ as resolveDynamicComponent, aH as createCommentVNode, aM as createTextVNode, aN as toDisplayString, bn as normalizeStyle, cj as me, ck as pe, cl as xe, cm as Ie, cn as ye } from "./vendor-3b8d0bfc.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
const _sfc_main = {
  __name: "Tabs",
  props: {
    tabs: {
      type: Array,
      required: true
    },
    modelValue: {
      type: Number,
      default: 0
    },
    tablistClass: {
      type: String,
      default: ""
    },
    tabPanelClass: {
      type: String,
      default: ""
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const changedIndex = computed({
      get: () => props.modelValue,
      set: (index) => emit("update:modelValue", index)
    });
    const tabListRef = ref(null);
    const tabRef = ref([]);
    const indicator = ref(null);
    const tabsLength = computed(() => {
      var _a;
      return (_a = props.tabs) == null ? void 0 : _a.length;
    });
    const transitionClass = ref("");
    function moveIndicator(index) {
      if (index >= tabsLength.value) {
        index = tabsLength.value - 1;
      }
      const selectedTab = tabRef.value[index].el;
      indicator.value.style.width = `${selectedTab.offsetWidth}px`;
      indicator.value.style.left = `${selectedTab.offsetLeft}px`;
    }
    watch(changedIndex, (index) => {
      if (index >= tabsLength.value) {
        changedIndex.value = tabsLength.value - 1;
      }
      transitionClass.value = "transition-all duration-300 ease-in-out";
      nextTick(() => moveIndicator(index));
    });
    onMounted(() => {
      nextTick(() => moveIndicator(changedIndex.value));
      setTimeout(() => moveIndicator(changedIndex.value), 100);
    });
    const __returned__ = { props, emit, changedIndex, tabListRef, tabRef, indicator, tabsLength, transitionClass, moveIndicator, get TabGroup() {
      return me;
    }, get TabList() {
      return pe;
    }, get Tab() {
      return xe;
    }, get TabPanels() {
      return Ie;
    }, get TabPanel() {
      return ye;
    }, ref, watch, computed, onMounted, nextTick };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a;
  return openBlock(), createBlock($setup["TabGroup"], {
    as: "div",
    class: "flex flex-1 flex-col overflow-y-hidden",
    style: normalizeStyle(`height: calc(100vh - ${(_a = $setup.tabListRef) == null ? void 0 : _a.$el.offsetTop}px)`),
    defaultIndex: $setup.changedIndex,
    selectedIndex: $setup.changedIndex,
    onChange: _cache[0] || (_cache[0] = (idx) => $setup.changedIndex = idx)
  }, {
    default: withCtx(() => [
      createVNode($setup["TabList"], {
        ref: "tabListRef",
        class: normalizeClass(["relative flex items-center gap-7.5 overflow-x-auto border-b px-5", $props.tablistClass])
      }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList($props.tabs, (tab, i) => {
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
                    renderSlot(_ctx.$slots, "tab", mergeProps({ ref_for: true }, { tab, selected }), () => [
                      createBaseVNode(
                        "button",
                        {
                          class: normalizeClass(["flex items-center gap-1.5 border-b border-transparent py-3 text-base text-ink-gray-5 duration-300 ease-in-out hover:border-outline-gray-3 hover:text-ink-gray-9", { "text-ink-gray-9": selected }])
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
              class: normalizeClass(["tab-indicator absolute bottom-0 h-px bg-surface-gray-7", $setup.transitionClass])
            },
            null,
            2
            /* CLASS */
          )
        ]),
        _: 3
        /* FORWARDED */
      }, 8, ["class"]),
      createVNode($setup["TabPanels"], {
        class: normalizeClass(["flex flex-1 overflow-hidden", $props.tabPanelClass])
      }, {
        default: withCtx(() => [
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList($props.tabs, (tab, i) => {
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
      }, 8, ["class"])
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["style", "defaultIndex", "selectedIndex"]);
}
_sfc_main.__file = "src/components/Tabs.vue";
const Tabs = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tabs.vue"]]);
export {
  Tabs as T
};