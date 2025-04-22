import { ay as defineComponent, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aP as h, aH as createCommentVNode, aE as createVNode } from "./vendor-C22BSUBe.js";
import { D as Dropdown } from "./Dropdown-Cw7oETEC.js";
import { F as FeatherIcon } from "./FeatherIcon-E9b0n7CB.js";
import { _ as __unplugin_components_0 } from "./Button-Dvm4lvM7.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Popover-DqBwX3vo.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Dropdown.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = { h, Dropdown, FeatherIcon, get Button() {
      return __unplugin_components_0;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 300 } }, {
    controls: withCtx(() => [
      createCommentVNode(' <HstText v-model="state.label" title="Label" />\n      <HstSelect v-model="state.size" :options="sizes" title="Size" /> ')
    ]),
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Basic" }, {
        default: withCtx(() => [
          createVNode($setup["Dropdown"], {
            options: [
              {
                label: "Edit Title",
                onClick: () => {
                },
                icon: () => $setup.h($setup.FeatherIcon, { name: "edit-2" })
              },
              {
                label: "Manage Members",
                onClick: () => {
                },
                icon: () => $setup.h($setup.FeatherIcon, { name: "users" })
              },
              {
                label: "Delete this project",
                onClick: () => {
                },
                icon: () => $setup.h($setup.FeatherIcon, { name: "trash" })
              }
            ]
          }, null, 8, ["options"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Button prop" }, {
        default: withCtx(() => [
          createVNode($setup["Dropdown"], {
            options: [
              {
                label: "Edit Title",
                onClick: () => {
                }
              },
              {
                label: "Manage Members",
                onClick: () => {
                }
              },
              {
                label: "Delete this project",
                onClick: () => {
                }
              }
            ],
            button: {
              label: "Actions"
            }
          })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Custom Button and Groups" }, {
        default: withCtx(() => [
          createVNode($setup["Dropdown"], {
            options: [
              {
                group: "Manage",
                items: [
                  {
                    label: "Edit Title",
                    icon: () => $setup.h($setup.FeatherIcon, { name: "edit" })
                  },
                  {
                    label: "Manage Members",
                    icon: () => $setup.h($setup.FeatherIcon, { name: "users" })
                  }
                ]
              },
              {
                group: "Delete",
                items: [
                  {
                    label: "Delete users",
                    icon: () => $setup.h($setup.FeatherIcon, { name: "edit" })
                  },
                  {
                    label: "Delete this project",
                    icon: () => $setup.h($setup.FeatherIcon, { name: "trash" })
                  }
                ]
              }
            ]
          }, {
            default: withCtx(() => [
              createVNode($setup["Button"], null, {
                icon: withCtx(() => [
                  createVNode($setup["FeatherIcon"], {
                    name: "more-horizontal",
                    class: "h-4 w-4"
                  })
                ]),
                _: 1
                /* STABLE */
              })
            ]),
            _: 1
            /* STABLE */
          }, 8, ["options"])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Dropdown.story.vue";
const Dropdown_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Dropdown.story.vue"]]);
export {
  Dropdown_story as default
};
