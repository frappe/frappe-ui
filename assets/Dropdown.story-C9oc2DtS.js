import { aC as defineComponent, aO as resolveComponent, az as openBlock, aH as createBlock, aP as withCtx, aM as createVNode, aB as createBaseVNode, aQ as createTextVNode } from "./vendor-1IneiQSJ.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { D as Dropdown } from "./Dropdown-BvWs2KSs.js";
import { B as Button } from "./Button-cTKeZts1.js";
import "./FeatherIcon-FGH1Y-V4.js";
import "./Switch-zqw-IDIk.js";
import "./useId-DJabvbK8.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Dropdown.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const actions = [
      {
        label: "Edit",
        icon: "edit",
        onClick: () => console.log("Edit clicked")
      },
      {
        label: "Delete",
        icon: "trash-2",
        theme: "red",
        onClick: () => console.log("Delete clicked")
      }
    ];
    const groupedActions = [
      {
        group: "Actions",
        items: [
          {
            label: "Edit",
            icon: "edit",
            onClick: () => console.log("Edit clicked")
          },
          {
            label: "Duplicate",
            icon: "copy",
            onClick: () => console.log("Duplicate clicked")
          },
          {
            label: "More Actions",
            icon: "more-horizontal",
            submenu: [
              {
                label: "Archive",
                icon: "archive",
                onClick: () => console.log("Archive clicked")
              },
              {
                label: "Export",
                icon: "download",
                submenu: [
                  {
                    label: "Export as PDF",
                    icon: "file-text",
                    onClick: () => console.log("Export as PDF clicked")
                  },
                  {
                    label: "Export as CSV",
                    icon: "file",
                    onClick: () => console.log("Export as CSV clicked")
                  }
                ]
              },
              {
                label: "Share",
                icon: "share",
                onClick: () => console.log("Share clicked")
              }
            ]
          }
        ]
      },
      {
        group: "Danger",
        items: [
          {
            label: "Delete",
            icon: "trash-2",
            theme: "red",
            onClick: () => console.log("Delete clicked")
          }
        ]
      }
    ];
    const submenuActions = [
      {
        label: "New",
        icon: "plus",
        submenu: [
          {
            group: "Documents",
            items: [
              {
                label: "New Document",
                icon: "file-plus",
                onClick: () => console.log("New Document clicked")
              },
              {
                label: "New Template",
                icon: "file-text",
                onClick: () => console.log("New Template clicked")
              },
              {
                label: "Delete",
                icon: "trash-2",
                theme: "red",
                onClick: () => console.log("Delete clicked")
              }
            ]
          },
          {
            group: "Organization",
            items: [
              {
                label: "New Folder",
                icon: "folder-plus",
                onClick: () => console.log("New Folder clicked")
              },
              {
                label: "New Project",
                icon: "briefcase",
                onClick: () => console.log("New Project clicked")
              }
            ]
          }
        ]
      },
      {
        label: "Edit",
        icon: "edit",
        onClick: () => console.log("Edit clicked")
      },
      {
        label: "Share",
        icon: "share",
        submenu: [
          {
            label: "Share with Link",
            icon: "link",
            onClick: () => console.log("Share with Link clicked")
          },
          {
            label: "Share with Email",
            icon: "mail",
            onClick: () => console.log("Share with Email clicked")
          },
          {
            group: "Advanced",
            items: [
              {
                label: "Share Settings",
                icon: "settings",
                onClick: () => console.log("Share Settings clicked")
              },
              {
                label: "Permission Management",
                icon: "shield",
                onClick: () => console.log("Permission Management clicked")
              }
            ]
          }
        ]
      },
      {
        label: "Collaborate",
        switch: true,
        icon: "file-text"
      }
    ];
    const switchActions = [
      {
        label: "Rename",
        icon: "edit",
        onClick: () => console.log("Rename clicked")
      },
      {
        label: "Lock",
        icon: "lock",
        switch: true,
        switchValue: true,
        onClick: (val) => console.log("Lock switch value:", val)
      },
      {
        label: "Collaborate",
        switch: true,
        icon: "users",
        onClick: (val) => console.log("Collaborate switch value:", val)
      }
    ];
    const __returned__ = { actions, groupedActions, submenuActions, switchActions, get Dropdown() {
      return Dropdown;
    }, get Button() {
      return Button;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "asdf" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, {
    title: "Dropdown",
    layout: { type: "grid", width: "200px" }
  }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Default" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["Dropdown"], { options: $setup.actions })
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "With Custom Button" }, {
        default: withCtx(() => [
          createVNode($setup["Dropdown"], { options: $setup.actions }, {
            default: withCtx(() => [
              createVNode($setup["Button"], { variant: "solid" }, {
                default: withCtx(() => _cache[0] || (_cache[0] = [
                  createTextVNode("Custom Trigger")
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
      }),
      createVNode(_component_Variant, { title: "With Groups" }, {
        default: withCtx(() => [
          createVNode($setup["Dropdown"], { options: $setup.groupedActions })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Right Aligned" }, {
        default: withCtx(() => [
          createVNode($setup["Dropdown"], {
            options: $setup.actions,
            placement: "right"
          })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Center Aligned" }, {
        default: withCtx(() => [
          createVNode($setup["Dropdown"], {
            options: $setup.actions,
            placement: "center"
          })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "With Submenus" }, {
        default: withCtx(() => [
          createVNode($setup["Dropdown"], { options: $setup.submenuActions })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "With Switches" }, {
        default: withCtx(() => [
          createVNode($setup["Dropdown"], { options: $setup.switchActions })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "With Nested Submenus" }, {
        default: withCtx(() => [
          createVNode($setup["Dropdown"], { options: $setup.groupedActions })
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Dropdown/Dropdown.story.vue";
const Dropdown_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Dropdown/Dropdown.story.vue"]]);
export {
  Dropdown_story as default
};
