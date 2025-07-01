import { ay as defineComponent, az as ref, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aM as createTextVNode, aF as createBaseVNode } from "./vendor-ChKKKszV.js";
import { _ as __unplugin_components_2 } from "./Dialog-ZwlUr7Hd.js";
import { _ as __unplugin_components_0 } from "./Button-Dy2DgMgb.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./FeatherIcon-qFFc4MqJ.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Dialog.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const dialog1 = ref(false);
    const dialog2 = ref(false);
    const createPromise = () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 2e3);
      });
    };
    const __returned__ = { dialog1, dialog2, createPromise, Dialog: __unplugin_components_2, get Button() {
      return __unplugin_components_0;
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
      createVNode(_component_Variant, {
        title: "With options",
        autoPropsDisabled: ""
      }, {
        default: withCtx(() => [
          createVNode($setup["Button"], {
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.dialog1 = true)
          }, {
            default: withCtx(() => _cache[5] || (_cache[5] = [
              createTextVNode("Show Dialog")
            ])),
            _: 1
            /* STABLE */
          }),
          createVNode($setup["Dialog"], {
            options: {
              title: "Confirm",
              message: "Are you sure you want to confirm this action?",
              size: "xl",
              icon: {
                name: "alert-triangle",
                appearance: "warning"
              },
              actions: [
                {
                  label: "Confirm",
                  variant: "solid",
                  onClick: () => {
                    return $setup.createPromise();
                  }
                }
              ]
            },
            modelValue: $setup.dialog1,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.dialog1 = $event)
          }, null, 8, ["options", "modelValue"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, {
        title: "With slots",
        autoPropsDisabled: ""
      }, {
        default: withCtx(() => [
          createVNode($setup["Button"], {
            onClick: _cache[2] || (_cache[2] = ($event) => $setup.dialog2 = true)
          }, {
            default: withCtx(() => _cache[6] || (_cache[6] = [
              createTextVNode("Show Dialog")
            ])),
            _: 1
            /* STABLE */
          }),
          createVNode($setup["Dialog"], {
            modelValue: $setup.dialog2,
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.dialog2 = $event)
          }, {
            "body-title": withCtx(() => _cache[7] || (_cache[7] = [
              createBaseVNode(
                "h3",
                null,
                "Custom Title",
                -1
                /* HOISTED */
              )
            ])),
            "body-content": withCtx(() => _cache[8] || (_cache[8] = [
              createBaseVNode(
                "p",
                null,
                "Custom Body",
                -1
                /* HOISTED */
              )
            ])),
            actions: withCtx(() => [
              createVNode($setup["Button"], { variant: "solid" }, {
                default: withCtx(() => _cache[9] || (_cache[9] = [
                  createTextVNode("Confirm")
                ])),
                _: 1
                /* STABLE */
              }),
              createVNode($setup["Button"], {
                class: "ml-2",
                onClick: _cache[3] || (_cache[3] = ($event) => $setup.dialog2 = false)
              }, {
                default: withCtx(() => _cache[10] || (_cache[10] = [
                  createTextVNode("Close")
                ])),
                _: 1
                /* STABLE */
              })
            ]),
            _: 1
            /* STABLE */
          }, 8, ["modelValue"])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Dialog/Dialog.story.vue";
const Dialog_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Dialog/Dialog.story.vue"]]);
export {
  Dialog_story as default
};
