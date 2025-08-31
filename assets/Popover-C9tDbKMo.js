import { ay as defineComponent, az as ref, aW as computed, bd as onUnmounted, cY as _sfc_main$1, cZ as _sfc_main$2, c_ as _sfc_main$3, c$ as _sfc_main$4, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aF as createBaseVNode, aR as normalizeClass, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps } from "./vendor-BzIG1w1O.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "Popover",
  props: {
    show: { type: Boolean, required: false, default: void 0 },
    trigger: { type: String, required: false, default: "click" },
    hoverDelay: { type: Number, required: false, default: 0 },
    leaveDelay: { type: Number, required: false, default: 0.5 },
    placement: { type: String, required: false, default: "bottom-start" },
    popoverClass: { type: [String, Object, Array], required: false, default: "" },
    transition: { type: [String, null], required: false, default: null },
    hideOnBlur: { type: Boolean, required: false, default: true }
  },
  emits: ["open", "close", "update:show"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    __expose({ open, close });
    const _isOpen = ref(false);
    const pointerOverTargetOrPopup = ref(false);
    const hoverTimer = ref(null);
    const leaveTimer = ref(null);
    const anchorRef = ref(null);
    const isOpen = computed({
      get: () => isShowPropPassed.value ? props.show : _isOpen.value,
      set: (value) => {
        if (!isShowPropPassed.value) {
          _isOpen.value = value;
        }
        emit("update:show", value);
      }
    });
    const isShowPropPassed = computed(() => {
      return props.show !== void 0;
    });
    const placementSide = computed(() => {
      const [side] = props.placement.split("-");
      return side;
    });
    const placementAlign = computed(() => {
      const [, align] = props.placement.split("-");
      if (!align) return "center";
      return align;
    });
    function togglePopover(flag) {
      if (flag instanceof Event) {
        flag = void 0;
      }
      if (flag == null) {
        flag = !isOpen.value;
      }
      flag = Boolean(flag);
      if (flag) {
        open();
      } else {
        close();
      }
    }
    function updatePosition() {
    }
    function open() {
      isOpen.value = true;
    }
    function close() {
      isOpen.value = false;
    }
    function onUpdateOpen(value) {
      emit("update:show", value);
      if (value) {
        emit("open");
      } else {
        emit("close");
      }
    }
    function onMouseover() {
      pointerOverTargetOrPopup.value = true;
      if (leaveTimer.value) {
        clearTimeout(leaveTimer.value);
        leaveTimer.value = null;
      }
      if (props.trigger === "hover") {
        if (props.hoverDelay) {
          hoverTimer.value = setTimeout(
            () => {
              if (pointerOverTargetOrPopup.value) {
                open();
              }
            },
            Number(props.hoverDelay) * 1e3
          );
        } else {
          open();
        }
      }
    }
    function onMouseleave() {
      pointerOverTargetOrPopup.value = false;
      if (hoverTimer.value) {
        clearTimeout(hoverTimer.value);
        hoverTimer.value = null;
      }
      if (props.trigger === "hover") {
        if (leaveTimer.value) {
          clearTimeout(leaveTimer.value);
        }
        if (props.leaveDelay) {
          leaveTimer.value = setTimeout(
            () => {
              if (!pointerOverTargetOrPopup.value) {
                close();
              }
            },
            Number(props.leaveDelay) * 1e3
          );
        } else {
          if (!pointerOverTargetOrPopup.value) {
            close();
          }
        }
      }
    }
    function onInteractOutside(event) {
      if (!props.hideOnBlur) {
        event.preventDefault();
        return;
      }
      const target = event.target;
      if (anchorRef.value && (anchorRef.value.contains(target) || anchorRef.value === target)) {
        event.preventDefault();
        return;
      }
    }
    const hasTransition = computed(() => {
      return props.transition === "default";
    });
    onUnmounted(() => {
      if (hoverTimer.value) {
        clearTimeout(hoverTimer.value);
      }
      if (leaveTimer.value) {
        clearTimeout(leaveTimer.value);
      }
    });
    const __returned__ = { props, emit, _isOpen, pointerOverTargetOrPopup, hoverTimer, leaveTimer, anchorRef, isOpen, isShowPropPassed, placementSide, placementAlign, togglePopover, updatePosition, open, close, onUpdateOpen, onMouseover, onMouseleave, onInteractOutside, hasTransition, get PopoverAnchor() {
      return _sfc_main$1;
    }, get PopoverContent() {
      return _sfc_main$2;
    }, get PopoverPortal() {
      return _sfc_main$3;
    }, get PopoverRoot() {
      return _sfc_main$4;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "rounded-lg border bg-surface-modal shadow-xl" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["PopoverRoot"], {
    open: $setup.isOpen,
    "onUpdate:open": [
      _cache[1] || (_cache[1] = ($event) => $setup.isOpen = $event),
      $setup.onUpdateOpen
    ]
  }, {
    default: withCtx(() => [
      createVNode($setup["PopoverAnchor"], { asChild: "" }, {
        default: withCtx(() => [
          createBaseVNode(
            "div",
            {
              ref: "anchorRef",
              class: normalizeClass(["flex", _ctx.$attrs.class]),
              onMouseover: $setup.onMouseover,
              onMouseleave: $setup.onMouseleave
            },
            [
              renderSlot(_ctx.$slots, "target", normalizeProps(guardReactiveProps({
                togglePopover: $setup.togglePopover,
                updatePosition: $setup.updatePosition,
                open: $setup.open,
                close: $setup.close,
                isOpen: $setup.isOpen
              })))
            ],
            34
            /* CLASS, NEED_HYDRATION */
          )
        ]),
        _: 3
        /* FORWARDED */
      }),
      createVNode($setup["PopoverPortal"], null, {
        default: withCtx(() => [
          createVNode($setup["PopoverContent"], {
            side: $setup.placementSide,
            align: $setup.placementAlign,
            style: {
              minWidth: "var(--reka-popover-trigger-width)"
            },
            class: normalizeClass(["PopoverContent", { "has-transition": $setup.hasTransition }]),
            onMouseover: _cache[0] || (_cache[0] = () => {
              $setup.pointerOverTargetOrPopup = true;
            }),
            onMouseleave: $setup.onMouseleave,
            onInteractOutside: $setup.onInteractOutside
          }, {
            default: withCtx(() => [
              createBaseVNode(
                "div",
                {
                  class: normalizeClass(["relative", ["body-container", $props.popoverClass]])
                },
                [
                  renderSlot(_ctx.$slots, "body", normalizeProps(guardReactiveProps({ togglePopover: $setup.togglePopover, updatePosition: $setup.updatePosition, open: $setup.open, close: $setup.close, isOpen: $setup.isOpen })), () => [
                    createBaseVNode("div", _hoisted_1, [
                      renderSlot(_ctx.$slots, "body-main", normalizeProps(guardReactiveProps({
                        togglePopover: $setup.togglePopover,
                        updatePosition: $setup.updatePosition,
                        open: $setup.open,
                        close: $setup.close,
                        isOpen: $setup.isOpen
                      })))
                    ])
                  ])
                ],
                2
                /* CLASS */
              )
            ]),
            _: 3
            /* FORWARDED */
          }, 8, ["side", "align", "class"])
        ]),
        _: 3
        /* FORWARDED */
      })
    ]),
    _: 3
    /* FORWARDED */
  }, 8, ["open"]);
}
_sfc_main.__file = "src/components/Popover/Popover.vue";
const __unplugin_components_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Popover/Popover.vue"]]);
export {
  __unplugin_components_1 as _
};
