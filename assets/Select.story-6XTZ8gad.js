import { A as Avatar } from "./Avatar-TiSBoLuU.js";
import { B as Button } from "./Button-B_PIh2U4.js";
import { aK as markRaw, aD as openBlock, aL as createElementBlock, aI as createBaseVNode, ay as _export_sfc, az as defineComponent, aA as ref, aC as resolveComponent, aE as createBlock, aF as withCtx, bU as SelectItemText_default, aH as createVNode, aT as createTextVNode, aJ as toDisplayString } from "./vendor-BHA4RFAY.js";
import { S as Select } from "./Select-CgIVFxN2.js";
import { U as User } from "./user-CuJpgojv.js";
import "./FeatherIcon-BBaV_QGI.js";
import "./chevron-down-BQRD0ZA3.js";
import "./check-DA_Ionq_.js";
const _hoisted_1$1 = {
  class: "lucide lucide-rotate-ccw",
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
      { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      { d: "M3 3v5h5" },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideRotate = markRaw({ name: "lucide-rotate-ccw", render });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Select.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const value = ref("");
    const options = [
      { label: "John Doe", value: "john-doe" },
      { label: "Jane Doe", value: "jane-doe" },
      { label: "John Smith", value: "john-smith" },
      { label: "Jane Smith", value: "jane-smith", disabled: true },
      { label: "John Wayne", value: "john-wayne" },
      { label: "Jane Wayne", value: "jane-wayne" }
    ];
    const __returned__ = { value, options, Select, get LucideUser() {
      return User;
    }, get LucideRotate() {
      return LucideRotate;
    }, get SelectItemText() {
      return SelectItemText_default;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-2" };
const _hoisted_2 = { class: "p-2" };
const _hoisted_3 = { class: "p-2" };
const _hoisted_4 = { class: "grid gap-1" };
const _hoisted_5 = { class: "p-2" };
const _hoisted_6 = { class: "inline-flex gap-2 items-center" };
const _hoisted_7 = { class: "p-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Button = Button;
  const _component_Avatar = Avatar;
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { width: 300, type: "grid" } }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Default" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["Select"], {
              options: $setup.options,
              modelValue: $setup.value,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.value = $event)
            }, null, 8, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "With prefix" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_2, [
            createVNode($setup["Select"], {
              options: $setup.options,
              modelValue: $setup.value,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.value = $event)
            }, {
              prefix: withCtx(() => [
                createVNode($setup["LucideUser"], { class: "size-4 text-ink-gray-9" })
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Custom footer slot" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_3, [
            createVNode($setup["Select"], {
              options: $setup.options,
              modelValue: $setup.value,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.value = $event)
            }, {
              footer: withCtx(() => [
                createBaseVNode("div", _hoisted_4, [
                  _cache[6] || (_cache[6] = createBaseVNode(
                    "hr",
                    null,
                    null,
                    -1
                    /* HOISTED */
                  )),
                  createVNode(_component_Button, { variant: "ghost" }, {
                    prefix: withCtx(() => [
                      createVNode($setup["LucideRotate"], { class: "size-4 text-ink-gray-9" })
                    ]),
                    default: withCtx(() => [
                      _cache[5] || (_cache[5] = createTextVNode(" Reset "))
                    ]),
                    _: 1
                    /* STABLE */
                  })
                ])
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Custom option slot" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_5, [
            createVNode($setup["Select"], {
              options: $setup.options,
              modelValue: $setup.value,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.value = $event)
            }, {
              option: withCtx(({ option }) => [
                createBaseVNode("div", _hoisted_6, [
                  createVNode(_component_Avatar, {
                    size: "sm",
                    image: "https://avatars.fastly.steamstatic.com/9ebf36bd3dc6c34f2d79ccf5d63e00eb7866321e_full.jpg"
                  }),
                  createVNode(
                    $setup["SelectItemText"],
                    null,
                    {
                      default: withCtx(() => [
                        createTextVNode(
                          toDisplayString(option.label),
                          1
                          /* TEXT */
                        )
                      ]),
                      _: 2
                      /* DYNAMIC */
                    },
                    1024
                    /* DYNAMIC_SLOTS */
                  )
                ])
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "No suffix" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_7, [
            createVNode($setup["Select"], {
              options: $setup.options,
              modelValue: $setup.value,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.value = $event)
            }, {
              suffix: withCtx(() => _cache[7] || (_cache[7] = [
                createTextVNode(toDisplayString(" "))
              ])),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
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
_sfc_main.__file = "src/components/Select/Select.story.vue";
const Select_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Select/Select.story.vue"]]);
export {
  Select_story as default
};
