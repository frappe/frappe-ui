import { ay as markRaw, az as openBlock, aA as createElementBlock, aB as createBaseVNode, aC as defineComponent, aD as mergeModels, aE as useModel, aF as computed, aG as renderSlot, aH as createBlock, aI as normalizeClass, aJ as resolveDynamicComponent, aK as createCommentVNode, aL as toDisplayString, aM as createVNode, aN as ref, aO as resolveComponent, aP as withCtx, aQ as createTextVNode } from "./vendor-DfdkrUQI.js";
import { L as LucideX } from "./x-BUWtFmdq.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { B as Button } from "./Button-CAoFlYgl.js";
import "./FeatherIcon-CGtdlp70.js";
const _hoisted_1$5 = {
  class: "lucide lucide-info",
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
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "M12 16v-4" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "M12 8h.01" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideInfo = markRaw({ name: "lucide-info", render: render$4 });
const _hoisted_1$4 = {
  class: "lucide lucide-circle-x",
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
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "m15 9-6 6" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "m9 9 6 6" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideCircleX = markRaw({ name: "lucide-circle-x", render: render$3 });
const _hoisted_1$3 = {
  class: "lucide lucide-circle-check",
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
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "10"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "m9 12 2 2 4-4" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideCheck = markRaw({ name: "lucide-circle-check", render: render$2 });
const _hoisted_1$2 = {
  class: "lucide lucide-triangle-alert",
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
      { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "M12 9v4" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "M12 17h.01" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideWarning = markRaw({ name: "lucide-triangle-alert", render: render$1 });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Alert",
  props: /* @__PURE__ */ mergeModels({
    title: { type: String, required: true },
    theme: { type: String, required: false },
    variant: { type: String, required: false, default: "subtle" },
    description: { type: String, required: false },
    dismissable: { type: Boolean, required: false, default: true }
  }, {
    "modelValue": { default: true },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    __expose();
    const visible = useModel(__props, "modelValue");
    const classes = computed(() => {
      const subtleBgs = {
        yellow: "bg-surface-amber-2",
        blue: "bg-surface-blue-2",
        red: "bg-surface-red-2",
        green: "bg-surface-green-2"
      };
      if (props.variant == "outline") return "border border-outline-gray-3";
      return props.theme ? subtleBgs[props.theme] : "bg-surface-gray-2";
    });
    const icon = computed(() => {
      const data = {
        yellow: { component: LucideWarning, css: "text-ink-amber-3" },
        blue: { component: LucideInfo, css: "text-ink-blue-3" },
        red: { component: LucideCircleX, css: "text-ink-red-3" },
        green: { component: LucideCheck, css: "text-ink-green-3" }
      };
      return props.theme ? data[props.theme] : null;
    });
    const props = __props;
    const __returned__ = { visible, classes, icon, props, get LucideX() {
      return LucideX;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = { class: "text-ink-gray-9" };
const _hoisted_2 = {
  key: 0,
  class: "text-ink-gray-6 prose-sm"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return $setup.visible ? (openBlock(), createElementBlock(
    "div",
    {
      key: 0,
      role: "alert",
      class: normalizeClass([$setup.classes, "grid grid-cols-[auto_1fr_auto] gap-3 rounded-md px-4 py-3.5 text-base items-start"])
    },
    [
      renderSlot(_ctx.$slots, "icon", {}, () => [
        $setup.icon ? (openBlock(), createBlock(resolveDynamicComponent($setup.icon.component), {
          key: 0,
          class: normalizeClass(["size-4", $setup.icon.css])
        }, null, 8, ["class"])) : createCommentVNode("v-if", true)
      ]),
      createBaseVNode(
        "div",
        {
          class: normalizeClass(["grid gap-2", { "col-span-2": !_ctx.$slots.icon && !$setup.icon }])
        },
        [
          createBaseVNode(
            "span",
            _hoisted_1$1,
            toDisplayString($setup.props.title),
            1
            /* TEXT */
          ),
          renderSlot(_ctx.$slots, "description", {}, () => [
            $setup.props.description ? (openBlock(), createElementBlock(
              "p",
              _hoisted_2,
              toDisplayString($setup.props.description),
              1
              /* TEXT */
            )) : createCommentVNode("v-if", true)
          ])
        ],
        2
        /* CLASS */
      ),
      $setup.props.dismissable ? (openBlock(), createElementBlock("button", {
        key: 0,
        onClick: _cache[0] || (_cache[0] = ($event) => $setup.visible = false)
      }, [
        createVNode($setup["LucideX"], { class: "size-4" })
      ])) : createCommentVNode("v-if", true),
      renderSlot(_ctx.$slots, "footer")
    ],
    2
    /* CLASS */
  )) : createCommentVNode("v-if", true);
}
_sfc_main$1.__file = "src/components/Alert/Alert.vue";
const Alert = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Alert/Alert.vue"]]);
const _hoisted_1 = {
  class: "lucide lucide-badge-info",
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
  return openBlock(), createElementBlock("svg", _hoisted_1, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      { d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "line",
      {
        x1: "12",
        x2: "12",
        y1: "16",
        y2: "12"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "line",
      {
        x1: "12",
        x2: "12.01",
        y1: "8",
        y2: "8"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideBadge = markRaw({ name: "lucide-badge-info", render });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Alert.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const visible = ref(true);
    const __returned__ = { visible, Alert, Button, get LucideBadge() {
      return LucideBadge;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { width: 500, type: "grid" } }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Success" }, {
        default: withCtx(() => [
          createVNode($setup["Alert"], {
            title: "Source successfully added",
            description: "Discover the new feature to enhance your experience. See how it can help you.",
            theme: "green"
          })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Warning" }, {
        default: withCtx(() => [
          createVNode($setup["Alert"], {
            title: "Source successfully added",
            description: "Discover the new feature to enhance your experience. See how it can help you.",
            theme: "yellow"
          })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Error" }, {
        default: withCtx(() => [
          createVNode($setup["Alert"], {
            title: "Source successfully added",
            description: "Discover the new feature to enhance your experience. See how it can help you.",
            theme: "red"
          })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Info" }, {
        default: withCtx(() => [
          createVNode($setup["Alert"], {
            title: "Source successfully added",
            description: "Discover the new feature to enhance your experience. See how it can help you.",
            theme: "blue"
          })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Controlled State" }, {
        default: withCtx(() => [
          createBaseVNode("div", null, [
            createVNode($setup["Button"], {
              variant: "solid",
              class: "mb-3",
              onClick: _cache[0] || (_cache[0] = ($event) => $setup.visible = !$setup.visible)
            }, {
              default: withCtx(() => _cache[2] || (_cache[2] = [
                createTextVNode(" Toggle Alert ")
              ])),
              _: 1
              /* STABLE */
            }),
            createVNode($setup["Alert"], {
              modelValue: $setup.visible,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.visible = $event),
              title: "Source successfully added",
              description: "Discover the new feature to enhance your experience. See how it can help you."
            }, null, 8, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Custom Slots" }, {
        default: withCtx(() => [
          createVNode($setup["Alert"], {
            title: "Your trial ends soon!",
            variant: "outline",
            description: "Upgrade to keep enjoying features and future technical support."
          }, {
            icon: withCtx(() => [
              createVNode($setup["LucideBadge"], { class: "size-4" })
            ]),
            footer: withCtx(() => [
              createVNode($setup["Button"], {
                class: "col-span-full",
                variant: "solid"
              }, {
                default: withCtx(() => _cache[3] || (_cache[3] = [
                  createTextVNode(" Update now")
                ])),
                _: 1
                /* STABLE */
              })
            ]),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Alert/Alert.story.vue";
const Alert_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Alert/Alert.story.vue"]]);
export {
  Alert_story as default
};
