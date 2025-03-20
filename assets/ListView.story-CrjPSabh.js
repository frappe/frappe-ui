import { aI as reactive, aP as h, az as ref, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aH as createCommentVNode, aG as createElementBlock, aJ as renderList, aK as Fragment, aF as createBaseVNode, aN as toDisplayString, aM as createTextVNode, aQ as normalizeClass } from "./vendor-C7q8S1AQ.js";
import { A as Avatar } from "./Avatar-CBMb6PNT.js";
import { B as Badge } from "./Badge-C39THpgo.js";
import { B as Button } from "./Button-Ot6OB7pt.js";
import { F as FeatherIcon } from "./FeatherIcon-FidzPGVj.js";
import { L as ListHeader, a as ListHeaderItem, b as ListRow, c as ListRowItem, d as ListRows, e as ListSelectBanner, f as ListView } from "./ListRow-BJDcF3HR.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-D8OFKKro.js";
import "./Autocomplete-CzNpigkP.js";
import "./Popover-BtXS85lG.js";
import "./Breadcrumbs-AGAMIS1f.js";
import "./Dropdown-oS7zE4-N.js";
import "./DateRangePicker-RoWe0E1q.js";
import "./TextInput-BB7Umch3.js";
import "./debounce-CRCtzhPg.js";
import "./Dialog-CYjapSx9.js";
import "./ErrorMessage-Dc3aQBj5.js";
import "./FileUploader-BMf5bGGm.js";
import "./FormControl-BjON5y0d.js";
import "./Select-DfKs4uot.js";
import "./Textarea-R-eAl-rP.js";
import "./Progress-DFK85xbT.js";
import "./Rating-Cie7a8mu.js";
import "./Spinner-DZLAlwRX.js";
import "./Switch-dPmYGFbx.js";
import "./TabButtons-DOX-4sxn.js";
import "./Tabs-C9h5Mbp7.js";
import "./TextEditor-BzdPKYhi.js";
import "./Tooltip-DZ3LX4oP.js";
import "./Calendar-BFdzXmtP.js";
import "./CircularProgressBar-Bcpv9ZNM.js";
import "./Tree-BiVgOjl2.js";
const _sfc_main = {
  __name: "ListView.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      selectable: true,
      showTooltip: true,
      resizeColumn: true,
      emptyState: {
        title: "No records found",
        description: "Create a new record to get started",
        button: {
          label: "New Record",
          variant: "solid",
          onClick: () => console.log("New Record")
        }
      }
    });
    const simple_columns = reactive([
      {
        label: "Name",
        key: "name",
        width: 3,
        getLabel: ({ row }) => row.name,
        prefix: ({ row }) => {
          return h(Avatar, {
            shape: "circle",
            image: row.user_image,
            size: "sm"
          });
        }
      },
      {
        label: "Email",
        key: "email",
        width: "200px"
      },
      {
        label: "Role",
        key: "role"
      },
      {
        label: "Status",
        key: "status"
      }
    ]);
    const simple_rows = [
      {
        id: 1,
        name: "John Doe",
        email: "john@doe.com",
        status: "Active",
        role: "Developer",
        user_image: "https://avatars.githubusercontent.com/u/499550"
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "jane@doe.com",
        status: "Inactive",
        role: "HR",
        user_image: "https://avatars.githubusercontent.com/u/499120"
      }
    ];
    const group_columns = reactive([
      {
        label: "Name",
        key: "name",
        width: 3
      },
      {
        label: "Email",
        key: "email",
        width: "200px"
      },
      {
        label: "Role",
        key: "role"
      },
      {
        label: "Status",
        key: "status"
      }
    ]);
    const grouped_rows = ref([
      {
        group: "Developer",
        collapsed: false,
        rows: [
          {
            id: 2,
            name: "Gary Fox",
            email: "gary@fox.com",
            status: "Inactive",
            role: "Developer"
          },
          {
            id: 6,
            name: "Emily Davis",
            email: "emily@davis.com",
            status: "Active",
            role: "Developer"
          },
          {
            id: 9,
            name: "David Lee",
            email: "david@lee.com",
            status: "Inactive",
            role: "Developer"
          }
        ]
      },
      {
        group: "Manager",
        collapsed: false,
        rows: [
          {
            id: 3,
            name: "John Doe",
            email: "john@doe.com",
            status: "Active",
            role: "Manager"
          },
          {
            id: 8,
            name: "Sarah Wilson",
            email: "sarah@wilson.com",
            status: "Active",
            role: "Manager"
          }
        ]
      },
      {
        group: "Designer",
        collapsed: false,
        rows: [
          {
            id: 4,
            name: "Alice Smith",
            email: "alice@smith.com",
            status: "Active",
            role: "Designer"
          },
          {
            id: 10,
            name: "Olivia Taylor",
            email: "olivia@taylor.com",
            status: "Active",
            role: "Designer"
          }
        ]
      },
      {
        group: "HR",
        collapsed: false,
        rows: [
          {
            id: 1,
            name: "Jane Mary",
            email: "jane@doe.com",
            status: "Inactive",
            role: "HR"
          },
          {
            id: 7,
            name: "Michael Brown",
            email: "michael@brown.com",
            status: "Inactive",
            role: "HR"
          },
          {
            id: 12,
            name: "Sophia Martinez",
            email: "sophia@martinez.com",
            status: "Active",
            role: "HR"
          }
        ]
      },
      {
        group: "Tester",
        collapsed: false,
        rows: [
          {
            id: 5,
            name: "Bob Johnson",
            email: "bob@johnson.com",
            status: "Inactive",
            role: "Tester"
          },
          {
            id: 11,
            name: "James Anderson",
            email: "james@anderson.com",
            status: "Inactive",
            role: "Tester"
          }
        ]
      }
    ]);
    const custom_columns = reactive([
      {
        label: "Name",
        key: "name",
        width: 3,
        icon: "user"
      },
      {
        label: "Email",
        key: "email",
        width: "200px",
        icon: "at-sign"
      },
      {
        label: "Role",
        key: "role",
        icon: "users"
      },
      {
        label: "Status",
        key: "status",
        icon: "check-circle"
      }
    ]);
    const custom_rows = [
      {
        id: 1,
        name: {
          label: "John Doe",
          image: "https://avatars.githubusercontent.com/u/499550"
        },
        email: "john@doe.com",
        status: {
          label: "Active",
          bg_color: "bg-surface-green-3"
        },
        role: {
          label: "Developer",
          color: "green"
        }
      },
      {
        id: 2,
        name: {
          label: "Jane Doe",
          image: "https://avatars.githubusercontent.com/u/499120"
        },
        email: "jane@doe.com",
        status: {
          label: "Inactive",
          bg_color: "bg-surface-red-5"
        },
        role: {
          label: "HR",
          color: "red"
        }
      }
    ];
    const __returned__ = { state, simple_columns, simple_rows, group_columns, grouped_rows, custom_columns, custom_rows, reactive, h, ref, Avatar, Badge, get Button() {
      return Button;
    }, FeatherIcon, ListHeader, ListHeaderItem, ListRow, ListRowItem, ListRows, ListSelectBanner, ListView };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1 = { class: "flex gap-2" };
const _hoisted_2 = { class: "text-base font-medium leading-6 text-ink-gray-9" };
const _hoisted_3 = {
  key: 1,
  class: "font-medium text-ink-gray-7"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstCheckbox = resolveComponent("HstCheckbox");
  const _component_HstText = resolveComponent("HstText");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: "95%" } }, {
    controls: withCtx(() => [
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.selectable,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state.selectable = $event),
        title: "Selectable"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.showTooltip,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.state.showTooltip = $event),
        title: "Show tooltip"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.resizeColumn,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.state.resizeColumn = $event),
        title: "Resize Column"
      }, null, 8, ["modelValue"]),
      createCommentVNode(" empty state config "),
      createVNode(_component_HstText, {
        modelValue: $setup.state.emptyState.title,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.state.emptyState.title = $event),
        title: "Empty Title",
        placeholder: "No records found"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstText, {
        modelValue: $setup.state.emptyState.description,
        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.state.emptyState.description = $event),
        title: "Empty Description",
        placeholder: "Create a new record to get started"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Simple List" }, {
        default: withCtx(() => [
          createVNode($setup["ListView"], {
            class: "h-[150px]",
            columns: $setup.simple_columns,
            rows: $setup.simple_rows,
            options: {
              getRowRoute: (row) => ({ name: "User", params: { userId: row.id } }),
              selectable: $setup.state.selectable,
              showTooltip: $setup.state.showTooltip,
              resizeColumn: $setup.state.resizeColumn
            },
            "row-key": "id"
          }, null, 8, ["columns", "options"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Custom List" }, {
        default: withCtx(() => [
          createVNode($setup["ListView"], {
            class: "h-[150px]",
            columns: $setup.custom_columns,
            rows: $setup.custom_rows,
            options: {
              onRowClick: (row) => console.log(row),
              selectable: $setup.state.selectable,
              showTooltip: $setup.state.showTooltip,
              resizeColumn: $setup.state.resizeColumn
            },
            "row-key": "id"
          }, {
            default: withCtx(() => [
              createVNode($setup["ListHeader"], null, {
                default: withCtx(() => [
                  (openBlock(true), createElementBlock(
                    Fragment,
                    null,
                    renderList($setup.custom_columns, (column) => {
                      return openBlock(), createBlock($setup["ListHeaderItem"], {
                        key: column.key,
                        item: column
                      }, {
                        prefix: withCtx(({ item }) => [
                          createVNode($setup["FeatherIcon"], {
                            name: item.icon,
                            class: "h-4 w-4"
                          }, null, 8, ["name"])
                        ]),
                        _: 2
                        /* DYNAMIC */
                      }, 1032, ["item"]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ]),
                _: 1
                /* STABLE */
              }),
              createVNode($setup["ListRows"], null, {
                default: withCtx(() => [
                  (openBlock(), createElementBlock(
                    Fragment,
                    null,
                    renderList($setup.custom_rows, (row) => {
                      return createVNode($setup["ListRow"], {
                        key: row.id,
                        row
                      }, {
                        default: withCtx(({ column, item }) => [
                          createVNode($setup["ListRowItem"], {
                            item,
                            align: column.align
                          }, {
                            prefix: withCtx(() => [
                              column.key == "status" ? (openBlock(), createElementBlock(
                                "div",
                                {
                                  key: 0,
                                  class: normalizeClass(["h-3 w-3 rounded-full", item.bg_color])
                                },
                                null,
                                2
                                /* CLASS */
                              )) : createCommentVNode("v-if", true),
                              column.key == "name" ? (openBlock(), createBlock($setup["Avatar"], {
                                key: 1,
                                shape: "circle",
                                image: item.image,
                                size: "sm"
                              }, null, 8, ["image"])) : createCommentVNode("v-if", true)
                            ]),
                            default: withCtx(() => [
                              column.key == "role" ? (openBlock(), createBlock($setup["Badge"], {
                                key: 0,
                                variant: "subtle",
                                theme: item.color,
                                size: "md",
                                label: item.label
                              }, null, 8, ["theme", "label"])) : createCommentVNode("v-if", true)
                            ]),
                            _: 2
                            /* DYNAMIC */
                          }, 1032, ["item", "align"])
                        ]),
                        _: 2
                        /* DYNAMIC */
                      }, 1032, ["row"]);
                    }),
                    64
                    /* STABLE_FRAGMENT */
                  ))
                ]),
                _: 1
                /* STABLE */
              }),
              createVNode($setup["ListSelectBanner"], null, {
                actions: withCtx(({ unselectAll }) => [
                  createBaseVNode("div", _hoisted_1, [
                    createVNode($setup["Button"], {
                      variant: "ghost",
                      label: "Delete"
                    }),
                    createVNode($setup["Button"], {
                      variant: "ghost",
                      label: "Unselect all",
                      onClick: unselectAll
                    }, null, 8, ["onClick"])
                  ])
                ]),
                _: 1
                /* STABLE */
              })
            ]),
            _: 1
            /* STABLE */
          }, 8, ["columns", "options"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Grouped Rows" }, {
        default: withCtx(() => [
          createVNode($setup["ListView"], {
            class: "h-[250px]",
            columns: $setup.group_columns,
            rows: $setup.grouped_rows,
            options: {
              getRowRoute: (row) => ({ name: "User", params: { userId: row.id } }),
              selectable: $setup.state.selectable,
              showTooltip: $setup.state.showTooltip,
              resizeColumn: $setup.state.resizeColumn
            },
            "row-key": "id"
          }, {
            "group-header": withCtx(({ group }) => [
              createBaseVNode(
                "span",
                _hoisted_2,
                toDisplayString(group.group) + " (" + toDisplayString(group.rows.length) + ") ",
                1
                /* TEXT */
              )
            ]),
            _: 1
            /* STABLE */
          }, 8, ["columns", "rows", "options"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Cell Slot" }, {
        default: withCtx(() => [
          createBaseVNode("div", null, [
            createVNode($setup["ListView"], {
              class: "h-[250px]",
              columns: $setup.simple_columns,
              rows: $setup.simple_rows,
              options: {
                selectable: $setup.state.selectable,
                showTooltip: $setup.state.showTooltip,
                resizeColumn: $setup.state.resizeColumn,
                emptyState: $setup.state.emptyState
              },
              "row-key": "id"
            }, {
              cell: withCtx(({ item, row, column }) => [
                column.key == "status" ? (openBlock(), createBlock(
                  $setup["Badge"],
                  { key: 0 },
                  {
                    default: withCtx(() => [
                      createTextVNode(
                        toDisplayString(item),
                        1
                        /* TEXT */
                      )
                    ]),
                    _: 2
                    /* DYNAMIC */
                  },
                  1024
                  /* DYNAMIC_SLOTS */
                )) : (openBlock(), createElementBlock(
                  "span",
                  _hoisted_3,
                  toDisplayString(item),
                  1
                  /* TEXT */
                ))
              ]),
              _: 1
              /* STABLE */
            }, 8, ["columns", "options"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Empty List" }, {
        default: withCtx(() => [
          createBaseVNode("div", null, [
            createVNode($setup["ListView"], {
              class: "h-[250px]",
              columns: $setup.simple_columns,
              rows: [],
              options: {
                selectable: $setup.state.selectable,
                showTooltip: $setup.state.showTooltip,
                resizeColumn: $setup.state.resizeColumn,
                emptyState: $setup.state.emptyState
              },
              "row-key": "id"
            }, null, 8, ["columns", "options"])
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
_sfc_main.__file = "src/components/ListView/ListView.story.vue";
const ListView_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListView.story.vue"]]);
export {
  ListView_story as default
};
