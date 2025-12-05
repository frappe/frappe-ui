import { d as defineComponent, l as resolveComponent, o as openBlock, q as createBlock, w as withCtx, f as createBaseVNode, n as normalizeClass, m as withKeys, a6 as renderSlot, a4 as mergeProps, k as watch, aw as scrollIntoView, N as onMounted, r as ref, c as computed, ar as onUnmounted, b as createElementBlock, ac as withModifiers, L as normalizeStyle, ax as useMediaQuery, t as toDisplayString, e as createVNode, g as unref, I as Icon, h as createCommentVNode, T as Transition } from "./vendor-CQba6akX.js";
const _sfc_main$2 = defineComponent({
  inheritAttrs: false,
  props: {
    isActive: {
      type: Boolean,
      default: void 0
    }
  },
  emits: {
    navigate: () => true
  },
  setup(props, { emit }) {
    function handleNavigate(event, navigate) {
      emit("navigate");
      navigate(event);
    }
    return {
      handleNavigate
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _hoisted_1$2 = ["href", "onClick", "onKeyup"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_RouterLink = resolveComponent("RouterLink");
  return openBlock(), createBlock(_component_RouterLink, mergeProps({ class: "histoire-base-list-item-link" }, _ctx.$attrs, { custom: "" }), {
    default: withCtx(({ isActive: linkIsActive, href, navigate }) => [
      createBaseVNode("a", {
        href,
        class: normalizeClass(["htw-flex htw-items-center htw-gap-2 htw-text-gray-900 dark:htw-text-gray-100", [
          _ctx.$attrs.class,
          (_ctx.isActive != null ? _ctx.isActive : linkIsActive) ? "active htw-bg-primary-500 hover:htw-bg-primary-600 htw-text-white dark:htw-text-black" : "hover:htw-bg-primary-100 dark:hover:htw-bg-primary-900"
        ]]),
        onClick: ($event) => _ctx.handleNavigate($event, navigate),
        onKeyup: [
          withKeys(($event) => _ctx.handleNavigate($event, navigate), ["enter"]),
          withKeys(($event) => _ctx.handleNavigate($event, navigate), ["space"])
        ]
      }, [
        renderSlot(_ctx.$slots, "default", {
          active: _ctx.isActive != null ? _ctx.isActive : linkIsActive
        })
      ], 42, _hoisted_1$2)
    ]),
    _: 3
  }, 16);
}
const BaseListItemLink = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render]]);
function useScrollOnActive(active, el) {
  watch(active, (value) => {
    if (value) {
      autoScroll();
    }
  });
  function autoScroll() {
    if (el.value) {
      scrollIntoView(el.value, {
        scrollMode: "if-needed",
        block: "center",
        inline: "nearest",
        behavior: "smooth"
      });
    }
  }
  onMounted(() => {
    if (active.value) {
      autoScroll();
    }
  });
  return {
    autoScroll
  };
}
const _hoisted_1$1 = ["onMousedown"];
const SAVE_PREFIX = "__histoire";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BaseSplitPane",
  props: {
    orientation: {
      type: String,
      default: "landscape",
      validator: (value) => ["landscape", "portrait"].includes(value)
    },
    defaultSplit: {
      type: Number,
      default: 50
    },
    split: {
      type: Number,
      default: void 0
    },
    min: {
      type: Number,
      default: 20
    },
    max: {
      type: Number,
      default: 80
    },
    draggerOffset: {
      type: String,
      default: "center",
      validator: (value) => ["before", "center", "after"].includes(value)
    },
    saveId: {
      type: String,
      default: null
    },
    fixed: {
      type: Boolean,
      default: false
    }
  },
  emits: {
    "update:split": (_value) => true
  },
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const currentSplit = ref(props.defaultSplit);
    watch(() => props.split, (value) => {
      if (value !== void 0) {
        currentSplit.value = value;
      }
    }, {
      immediate: true
    });
    if (props.saveId) {
      const storageKey = `${SAVE_PREFIX}-split-pane-${props.saveId}`;
      const savedValue = localStorage.getItem(storageKey);
      if (savedValue != null) {
        let parsedValue;
        try {
          parsedValue = JSON.parse(savedValue);
        } catch (e) {
          console.error(e);
        }
        if (typeof parsedValue === "number") {
          currentSplit.value = parsedValue;
        }
      }
      watch(currentSplit, (value) => {
        localStorage.setItem(storageKey, JSON.stringify(value));
      });
      watch(currentSplit, (value) => {
        if (value !== props.split) {
          emit("update:split", value);
        }
      }, {
        immediate: true
      });
    }
    const boundSplit = computed(() => {
      if (currentSplit.value < props.min) {
        return props.min;
      } else if (currentSplit.value > props.max) {
        return props.max;
      } else {
        return currentSplit.value;
      }
    });
    const leftStyle = computed(() => ({
      [props.orientation === "landscape" ? "width" : "height"]: props.fixed ? `${boundSplit.value}px` : `${boundSplit.value}%`
    }));
    const rightStyle = computed(() => ({
      [props.orientation === "landscape" ? "width" : "height"]: props.fixed ? null : `${100 - boundSplit.value}%`
    }));
    const dragging = ref(false);
    let startPosition = 0;
    let startSplit = 0;
    const el = ref(null);
    function dragStart(e) {
      dragging.value = true;
      startPosition = props.orientation === "landscape" ? e.pageX : e.pageY;
      startSplit = boundSplit.value;
      window.addEventListener("mousemove", dragMove);
      window.addEventListener("mouseup", dragEnd);
    }
    function dragMove(e) {
      if (dragging.value) {
        let position;
        let totalSize;
        if (props.orientation === "landscape") {
          position = e.pageX;
          totalSize = el.value.offsetWidth;
        } else {
          position = e.pageY;
          totalSize = el.value.offsetHeight;
        }
        const dPosition = position - startPosition;
        if (props.fixed) {
          currentSplit.value = startSplit + dPosition;
        } else {
          currentSplit.value = startSplit + ~~(dPosition / totalSize * 200) / 2;
        }
      }
    }
    function dragEnd() {
      dragging.value = false;
      removeDragListeners();
    }
    function removeDragListeners() {
      window.removeEventListener("mousemove", dragMove);
      window.removeEventListener("mouseup", dragEnd);
    }
    onUnmounted(() => {
      removeDragListeners();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        ref_key: "el",
        ref: el,
        class: normalizeClass(["histoire-base-split-pane htw-flex htw-h-full htw-isolate htw-overflow-auto", {
          "htw-flex-col": __props.orientation === "portrait",
          "htw-cursor-ew-resize": dragging.value && __props.orientation === "landscape",
          "htw-cursor-ns-resize": dragging.value && __props.orientation === "portrait",
          [__props.orientation]: true
        }])
      }, [
        createBaseVNode("div", {
          class: normalizeClass(["htw-relative htw-top-0 htw-left-0 htw-z-20", {
            "htw-pointer-events-none": dragging.value,
            "htw-border-r htw-border-gray-300/30 dark:htw-border-gray-800": __props.orientation === "landscape",
            "htw-flex-none": __props.fixed
          }]),
          style: normalizeStyle(leftStyle.value)
        }, [
          renderSlot(_ctx.$slots, "first", {}, void 0, true),
          createBaseVNode("div", {
            class: normalizeClass(["dragger htw-absolute htw-z-100 hover:htw-bg-primary-500/50 htw-transition-colors htw-duration-150 htw-delay-150", {
              "htw-top-0 htw-bottom-0 htw-cursor-ew-resize": __props.orientation === "landscape",
              "htw-left-0 htw-right-0 htw-cursor-ns-resize": __props.orientation === "portrait",
              [`dragger-offset-${__props.draggerOffset}`]: true,
              "htw-bg-primary-500/25": dragging.value
            }]),
            onMousedown: withModifiers(dragStart, ["prevent"])
          }, null, 42, _hoisted_1$1)
        ], 6),
        createBaseVNode("div", {
          class: normalizeClass(["htw-relative htw-bottom-0 htw-right-0", {
            "htw-pointer-events-none": dragging.value,
            "htw-border-t htw-border-gray-300/30 dark:htw-border-gray-800": __props.orientation === "portrait",
            "htw-flex-1": __props.fixed
          }]),
          style: normalizeStyle(rightStyle.value)
        }, [
          renderSlot(_ctx.$slots, "last", {}, void 0, true)
        ], 6)
      ], 2);
    };
  }
});
const BaseSplitPane = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-4f40a1bb"]]);
const isMobile = useMediaQuery("(max-width: 640px)");
const _hoisted_1 = {
  key: 0,
  class: "histoire-mobile-overlay htw-absolute htw-z-10 htw-bg-white dark:htw-bg-gray-700 htw-w-screen htw-h-screen htw-inset-0 htw-overflow-hidden htw-flex htw-flex-col"
};
const _hoisted_2 = { class: "htw-p-4 htw-h-16 htw-flex htw-border-b htw-border-gray-100 dark:htw-border-gray-800 htw-items-center htw-place-content-between" };
const _hoisted_3 = { class: "htw-text-gray-500" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MobileOverlay",
  props: {
    title: {},
    opened: { type: Boolean }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Transition, { name: "__histoire-fade-bottom" }, {
        default: withCtx(() => [
          _ctx.opened ? (openBlock(), createElementBlock("div", _hoisted_1, [
            createBaseVNode("div", _hoisted_2, [
              createBaseVNode("span", _hoisted_3, toDisplayString(_ctx.title), 1),
              createBaseVNode("a", {
                class: "htw-p-1 hover:htw-text-primary-500 dark:hover:htw-text-primary-400 htw-cursor-pointer",
                onClick: _cache[0] || (_cache[0] = ($event) => emit("close"))
              }, [
                createVNode(unref(Icon), {
                  icon: "carbon:close",
                  class: "htw-w-8 htw-h-8 htw-shrink-0"
                })
              ])
            ]),
            renderSlot(_ctx.$slots, "default")
          ])) : createCommentVNode("", true)
        ]),
        _: 3
      });
    };
  }
});
export {
  BaseListItemLink as B,
  _export_sfc as _,
  _sfc_main as a,
  BaseSplitPane as b,
  isMobile as i,
  useScrollOnActive as u
};
