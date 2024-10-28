import { bD as createPopper, aB as openBlock, aG as createElementBlock, aF as createBaseVNode, aT as renderSlot, aU as normalizeProps, aV as guardReactiveProps, aW as normalizeClass, aC as createBlock, aE as createVNode, aD as withCtx, b5 as withDirectives, b6 as vShow, aL as mergeProps, bq as Transition, aY as normalizeStyle, c4 as Teleport } from "./vendor-ff760363.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
const _sfc_main = {
  name: "Popover",
  inheritAttrs: false,
  props: {
    show: {
      default: void 0
    },
    trigger: {
      type: String,
      default: "click"
      // click, hover
    },
    hoverDelay: {
      type: Number,
      default: 0
    },
    leaveDelay: {
      type: Number,
      default: 0
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    popoverClass: [String, Object, Array],
    transition: {
      default: null
    },
    hideOnBlur: {
      default: true
    }
  },
  emits: ["open", "close", "update:show"],
  expose: ["open", "close"],
  data() {
    return {
      popoverContainerClass: "body-container",
      showPopup: false,
      targetWidth: null,
      pointerOverTargetOrPopup: false
    };
  },
  watch: {
    show(val) {
      if (val) {
        this.open();
      } else {
        this.close();
      }
    }
  },
  created() {
    if (typeof window === "undefined")
      return;
    if (!document.getElementById("frappeui-popper-root")) {
      const root = document.createElement("div");
      root.id = "frappeui-popper-root";
      document.body.appendChild(root);
    }
  },
  mounted() {
    this.listener = (e) => {
      const clickedElement = e.target;
      const reference = this.$refs.reference;
      const popoverBody = this.$refs.popover;
      const insideClick = clickedElement === reference || clickedElement === popoverBody || (reference == null ? void 0 : reference.contains(clickedElement)) || (popoverBody == null ? void 0 : popoverBody.contains(clickedElement));
      if (insideClick) {
        return;
      }
      const root = document.getElementById("frappeui-popper-root");
      const insidePopoverRoot = root.contains(clickedElement);
      if (!insidePopoverRoot) {
        return this.close();
      }
      const bodyClass = `.${this.popoverContainerClass}`;
      const clickedElementBody = clickedElement == null ? void 0 : clickedElement.closest(bodyClass);
      const currentPopoverBody = reference == null ? void 0 : reference.closest(bodyClass);
      const isSiblingClicked = clickedElementBody && currentPopoverBody && clickedElementBody === currentPopoverBody;
      if (isSiblingClicked) {
        this.close();
      }
    };
    if (this.hideOnBlur) {
      document.addEventListener("click", this.listener);
      document.addEventListener("mousedown", this.listener);
    }
    this.$nextTick(() => {
      this.targetWidth = this.$refs["target"].clientWidth;
    });
  },
  beforeDestroy() {
    this.popper && this.popper.destroy();
    document.removeEventListener("click", this.listener);
    document.removeEventListener("mousedown", this.listener);
  },
  computed: {
    showPropPassed() {
      return this.show != null;
    },
    isOpen: {
      get() {
        if (this.showPropPassed) {
          return this.show;
        }
        return this.showPopup;
      },
      set(val) {
        val = Boolean(val);
        if (this.showPropPassed) {
          this.$emit("update:show", val);
        } else {
          this.showPopup = val;
        }
        if (val === false) {
          this.$emit("close");
        } else if (val === true) {
          this.$emit("open");
        }
      }
    },
    popupTransition() {
      let templates = {
        default: {
          enterActiveClass: "transition duration-150 ease-out",
          enterFromClass: "translate-y-1 opacity-0",
          enterToClass: "translate-y-0 opacity-100",
          leaveActiveClass: "transition duration-150 ease-in",
          leaveFromClass: "translate-y-0 opacity-100",
          leaveToClass: "translate-y-1 opacity-0"
        }
      };
      if (typeof this.transition === "string") {
        return templates[this.transition];
      }
      return this.transition;
    }
  },
  methods: {
    setupPopper() {
      if (!this.popper) {
        this.popper = createPopper(this.$refs.reference, this.$refs.popover, {
          placement: this.placement
        });
      } else {
        this.updatePosition();
      }
    },
    updatePosition() {
      this.popper && this.popper.update();
    },
    togglePopover(flag) {
      if (flag instanceof Event) {
        flag = null;
      }
      if (flag == null) {
        flag = !this.isOpen;
      }
      flag = Boolean(flag);
      if (flag) {
        this.open();
      } else {
        this.close();
      }
    },
    open() {
      this.isOpen = true;
      this.$nextTick(() => this.setupPopper());
    },
    close() {
      this.isOpen = false;
    },
    onMouseover() {
      this.pointerOverTargetOrPopup = true;
      if (this.leaveTimer) {
        clearTimeout(this.leaveTimer);
        this.leaveTimer = null;
      }
      if (this.trigger === "hover") {
        if (this.hoverDelay) {
          this.hoverTimer = setTimeout(
            () => {
              if (this.pointerOverTargetOrPopup) {
                this.open();
              }
            },
            Number(this.hoverDelay) * 1e3
          );
        } else {
          this.open();
        }
      }
    },
    onMouseleave(e) {
      this.pointerOverTargetOrPopup = false;
      if (this.hoverTimer) {
        clearTimeout(this.hoverTimer);
        this.hoverTimer = null;
      }
      if (this.trigger === "hover") {
        if (this.leaveTimer) {
          clearTimeout(this.leaveTimer);
        }
        if (this.leaveDelay) {
          this.leaveTimer = setTimeout(
            () => {
              if (!this.pointerOverTargetOrPopup) {
                this.close();
              }
            },
            Number(this.leaveDelay) * 1e3
          );
        } else {
          if (!this.pointerOverTargetOrPopup) {
            this.close();
          }
        }
      }
    }
  }
};
const _hoisted_1 = { ref: "reference" };
const _hoisted_2 = { class: "rounded-lg border border-gray-100 bg-white shadow-xl" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    _hoisted_1,
    [
      createBaseVNode(
        "div",
        {
          ref: "target",
          class: normalizeClass(["flex", _ctx.$attrs.class]),
          onClick: _cache[0] || (_cache[0] = (...args) => $options.updatePosition && $options.updatePosition(...args)),
          onFocusin: _cache[1] || (_cache[1] = (...args) => $options.updatePosition && $options.updatePosition(...args)),
          onKeydown: _cache[2] || (_cache[2] = (...args) => $options.updatePosition && $options.updatePosition(...args)),
          onMouseover: _cache[3] || (_cache[3] = (...args) => $options.onMouseover && $options.onMouseover(...args)),
          onMouseleave: _cache[4] || (_cache[4] = (...args) => $options.onMouseleave && $options.onMouseleave(...args))
        },
        [
          renderSlot(_ctx.$slots, "target", normalizeProps(guardReactiveProps({ togglePopover: $options.togglePopover, updatePosition: $options.updatePosition, open: $options.open, close: $options.close, isOpen: $options.isOpen })))
        ],
        34
        /* CLASS, NEED_HYDRATION */
      ),
      (openBlock(), createBlock(Teleport, { to: "#frappeui-popper-root" }, [
        createBaseVNode(
          "div",
          {
            ref: "popover",
            class: normalizeClass(["relative z-[100]", [$data.popoverContainerClass, $props.popoverClass]]),
            style: normalizeStyle({ minWidth: $data.targetWidth ? $data.targetWidth + "px" : null }),
            onMouseover: _cache[5] || (_cache[5] = ($event) => $data.pointerOverTargetOrPopup = true),
            onMouseleave: _cache[6] || (_cache[6] = (...args) => $options.onMouseleave && $options.onMouseleave(...args))
          },
          [
            createVNode(
              Transition,
              mergeProps($options.popupTransition, { persisted: "" }),
              {
                default: withCtx(() => [
                  withDirectives(createBaseVNode(
                    "div",
                    null,
                    [
                      renderSlot(_ctx.$slots, "body", normalizeProps(guardReactiveProps({ togglePopover: $options.togglePopover, updatePosition: $options.updatePosition, open: $options.open, close: $options.close, isOpen: $options.isOpen })), () => [
                        createBaseVNode("div", _hoisted_2, [
                          renderSlot(_ctx.$slots, "body-main", normalizeProps(guardReactiveProps({
                            togglePopover: $options.togglePopover,
                            updatePosition: $options.updatePosition,
                            open: $options.open,
                            close: $options.close,
                            isOpen: $options.isOpen
                          })))
                        ])
                      ])
                    ],
                    512
                    /* NEED_PATCH */
                  ), [
                    [vShow, $options.isOpen]
                  ])
                ]),
                _: 3
                /* FORWARDED */
              },
              16
              /* FULL_PROPS */
            )
          ],
          38
          /* CLASS, STYLE, NEED_HYDRATION */
        )
      ]))
    ],
    512
    /* NEED_PATCH */
  );
}
_sfc_main.__file = "src/components/Popover.vue";
const Popover = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Popover.vue"]]);
export {
  Popover as P
};
