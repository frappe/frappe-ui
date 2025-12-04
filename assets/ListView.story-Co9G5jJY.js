import { aN as ref, aF as computed, bw as useDebounceFn, a$ as inject, az as openBlock, aA as createElementBlock, aB as createBaseVNode, aG as renderSlot, bc as normalizeProps, bd as guardReactiveProps, aL as toDisplayString, aI as normalizeClass, aU as mergeProps, aK as createCommentVNode, aH as createBlock, a_ as withModifiers, aT as Fragment, aS as renderList, b0 as normalizeStyle, aM as createVNode, aJ as resolveDynamicComponent, aP as withCtx, aQ as createTextVNode, bx as Transition, by as useSlots, aR as reactive, b3 as watch, bb as provide, bi as h, aO as resolveComponent } from "./vendor-BWyAe9Al.js";
import { A as Avatar } from "./Avatar-CaRUUt80.js";
import { B as Badge } from "./Badge-C8wxhNx6.js";
import { F as FeatherIcon } from "./FeatherIcon-DihZDVt-.js";
import { C as Checkbox } from "./Checkbox-BWG13w2B.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { B as Button, _ as __unplugin_components_0 } from "./Button-fhb6mbs0.js";
import "./useId-DJabvbK8.js";
function getGridTemplateColumns(columns, withCheckbox = true) {
  let checkBoxWidth = withCheckbox ? "14px " : "";
  let columnsWidth = columns.map((col) => {
    let width = col.width || 1;
    if (typeof width === "number") {
      return width + "fr";
    }
    return width;
  }).join(" ");
  return checkBoxWidth + columnsWidth;
}
const alignmentMap = {
  left: "justify-start",
  start: "justify-start",
  center: "justify-center",
  middle: "justify-center",
  right: "justify-end",
  end: "justify-end"
};
const _sfc_main$c = {
  __name: "ListHeaderItem",
  props: {
    item: {
      type: Object,
      required: true
    },
    debounce: {
      type: Number,
      default: 1e3
    }
  },
  emits: ["columnWidthUpdated"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const resizer = ref(null);
    const columnRef = ref(null);
    const widthInPx = computed(() => {
      if (typeof props.item.width === "string") {
        const parsedWidth = parseInt(props.item.width);
        if (props.item.width.includes("rem")) {
          return parsedWidth * 16;
        } else if (props.item.width.includes("px")) {
          return parsedWidth;
        }
      }
      return columnRef.value.offsetWidth;
    });
    const startResizing = (e) => {
      const initialX = e.clientX;
      const initialWidth = widthInPx.value;
      const onMouseMove = (e2) => {
        document.body.classList.add("select-none");
        document.body.classList.add("cursor-col-resize");
        resizer.value.style.backgroundColor = "rgb(199 199 199)";
        let newWidth = initialWidth + (e2.clientX - initialX);
        props.item.width = `${newWidth < 50 ? 50 : newWidth}px`;
        updateWidth(props.item.width);
      };
      const onMouseUp = () => {
        document.body.classList.remove("select-none");
        document.body.classList.remove("cursor-col-resize");
        resizer.value.style.backgroundColor = "";
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };
    const updateWidth = useDebounceFn((width) => {
      props.item.width = width;
      emit("columnWidthUpdated");
    }, props.debounce);
    const list = inject("list");
    const __returned__ = { props, emit, resizer, columnRef, widthInPx, startResizing, updateWidth, list, get alignmentMap() {
      return alignmentMap;
    }, get useDebounceFn() {
      return useDebounceFn;
    }, ref, computed, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$a = { class: "truncate" };
const _hoisted_2$4 = {
  ref: "resizer",
  class: "h-full w-[2px] rounded-full transition-all duration-300 ease-in-out group-hover:bg-gray-400"
};
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      ref: "columnRef",
      class: normalizeClass(["group relative flex items-center", $props.item.align ? $setup.alignmentMap[$props.item.align] : "justify-between"])
    },
    [
      createBaseVNode(
        "div",
        {
          class: normalizeClass(["flex items-center space-x-2 truncate text-sm text-ink-gray-5", _ctx.$attrs.class])
        },
        [
          renderSlot(_ctx.$slots, "prefix", normalizeProps(guardReactiveProps({ item: $props.item }))),
          renderSlot(_ctx.$slots, "default", {}, () => [
            createBaseVNode(
              "div",
              _hoisted_1$a,
              toDisplayString($props.item.label),
              1
              /* TEXT */
            )
          ]),
          renderSlot(_ctx.$slots, "suffix", normalizeProps(guardReactiveProps({ item: $props.item })))
        ],
        2
        /* CLASS */
      ),
      $setup.list.options.resizeColumn ? renderSlot(_ctx.$slots, "resizer", normalizeProps(mergeProps({ key: 0 }, { item: $props.item })), () => [
        createBaseVNode(
          "div",
          {
            class: "flex h-4 absolute -right-2 w-2 cursor-col-resize justify-center",
            onMousedown: $setup.startResizing
          },
          [
            createBaseVNode(
              "div",
              _hoisted_2$4,
              null,
              512
              /* NEED_PATCH */
            )
          ],
          32
          /* NEED_HYDRATION */
        )
      ]) : createCommentVNode("v-if", true)
    ],
    2
    /* CLASS */
  );
}
_sfc_main$c.__file = "src/components/ListView/ListHeaderItem.vue";
const ListHeaderItem = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListHeaderItem.vue"]]);
const _sfc_main$b = {
  __name: "ListHeader",
  emits: ["columnWidthUpdated"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const emit = __emit;
    const list = inject("list");
    const __returned__ = { emit, list, Checkbox, ListHeaderItem, get getGridTemplateColumns() {
      return getGridTemplateColumns;
    }, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      class: "mb-2 grid items-center space-x-4 rounded bg-surface-gray-2 p-2",
      style: normalizeStyle({
        gridTemplateColumns: $setup.getGridTemplateColumns(
          $setup.list.columns,
          $setup.list.options.selectable
        )
      })
    },
    [
      $setup.list.options.selectable ? (openBlock(), createBlock($setup["Checkbox"], {
        key: 0,
        class: "cursor-pointer duration-300",
        modelValue: $setup.list.allRowsSelected,
        onClick: withModifiers($setup.list.toggleAllRows, ["stop"])
      }, null, 8, ["modelValue", "onClick"])) : createCommentVNode("v-if", true),
      renderSlot(_ctx.$slots, "default", {}, () => [
        (openBlock(true), createElementBlock(
          Fragment,
          null,
          renderList($setup.list.columns, (column) => {
            return openBlock(), createBlock($setup["ListHeaderItem"], {
              key: column.key,
              item: column,
              onColumnWidthUpdated: ($event) => $setup.emit("columnWidthUpdated", column)
            }, null, 8, ["item", "onColumnWidthUpdated"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ],
    4
    /* STYLE */
  );
}
_sfc_main$b.__file = "src/components/ListView/ListHeader.vue";
const ListHeader = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListHeader.vue"]]);
const _sfc_main$a = {
  __name: "ListEmptyState",
  setup(__props, { expose: __expose }) {
    __expose();
    const list = inject("list");
    const __returned__ = { list, inject, get Button() {
      return Button;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$9 = { class: "flex h-full w-full flex-col items-center justify-center text-base" };
const _hoisted_2$3 = { class: "text-xl font-medium text-ink-gray-8 mt-6" };
const _hoisted_3$3 = { class: "mt-1 text-base text-ink-gray-5" };
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$9, [
    renderSlot(_ctx.$slots, "default", {}, () => [
      createBaseVNode(
        "div",
        _hoisted_2$3,
        toDisplayString($setup.list.options.emptyState.title),
        1
        /* TEXT */
      ),
      createBaseVNode(
        "div",
        _hoisted_3$3,
        toDisplayString($setup.list.options.emptyState.description),
        1
        /* TEXT */
      ),
      $setup.list.options.emptyState.button ? (openBlock(), createBlock(
        $setup["Button"],
        mergeProps({ key: 0 }, $setup.list.options.emptyState.button, { class: "mt-4" }),
        null,
        16
        /* FULL_PROPS */
      )) : createCommentVNode("v-if", true)
    ])
  ]);
}
_sfc_main$a.__file = "src/components/ListView/ListEmptyState.vue";
const ListEmptyState = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListEmptyState.vue"]]);
const _sfc_main$9 = {
  __name: "ListRows",
  setup(__props, { expose: __expose }) {
    __expose();
    const list = inject("list");
    const __returned__ = { list, ListRow, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$8 = { class: "h-full overflow-y-auto" };
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$8, [
    renderSlot(_ctx.$slots, "default", {}, () => [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($setup.list.rows, (row) => {
          return openBlock(), createBlock($setup["ListRow"], {
            key: row[$setup.list.rowKey],
            row
          }, null, 8, ["row"]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ])
  ]);
}
_sfc_main$9.__file = "src/components/ListView/ListRows.vue";
const ListRows = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListRows.vue"]]);
const _sfc_main$8 = {};
const _hoisted_1$7 = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 16 16"
};
function _sfc_render$8(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$7, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "currentColor",
        d: "M4.293 5.28h7.413a.5.5 0 0 1 .41.787l-3.707 5.295a.5.5 0 0 1-.82 0L3.884 6.067a.5.5 0 0 1 .41-.787Z"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$8.__file = "icons/DownSolidIcon.vue";
const DownSolid = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__file", "/home/runner/work/frappe-ui/frappe-ui/icons/DownSolidIcon.vue"]]);
const _sfc_main$7 = {
  __name: "ListGroupHeader",
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const list = inject("list");
    function toggleGroup() {
      if (props.group.collapsed == null) {
        props.group.collapsed = false;
      }
      props.group.collapsed = !props.group.collapsed;
    }
    const __returned__ = { props, list, toggleGroup, inject, DownSolid };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$6 = { class: "flex items-center" };
const _hoisted_2$2 = { class: "w-full py-1.5 pr-2" };
const _hoisted_3$2 = {
  key: 1,
  class: "text-base font-medium leading-6"
};
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      createBaseVNode("div", _hoisted_1$6, [
        createBaseVNode("button", {
          onClick: $setup.toggleGroup,
          class: "ml-[3px] mr-[11px] rounded p-1 hover:bg-surface-gray-2"
        }, [
          createVNode($setup["DownSolid"], {
            class: normalizeClass(["h-4 w-4 text-ink-gray-6 transition-transform duration-200", [$props.group.collapsed ? "-rotate-90" : ""]])
          }, null, 8, ["class"])
        ]),
        renderSlot(_ctx.$slots, "default", {}, () => [
          createBaseVNode("div", _hoisted_2$2, [
            $setup.list.slots["group-header"] ? (openBlock(), createBlock(
              resolveDynamicComponent($setup.list.slots["group-header"]),
              normalizeProps(mergeProps({ key: 0 }, { group: $props.group })),
              null,
              16
              /* FULL_PROPS */
            )) : (openBlock(), createElementBlock(
              "span",
              _hoisted_3$2,
              toDisplayString($props.group.group),
              1
              /* TEXT */
            ))
          ])
        ])
      ]),
      _cache[0] || (_cache[0] = createBaseVNode(
        "div",
        { class: "mx-2 h-px border-t border-outline-gray-modals" },
        null,
        -1
        /* HOISTED */
      ))
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
_sfc_main$7.__file = "src/components/ListView/ListGroupHeader.vue";
const ListGroupHeader = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListGroupHeader.vue"]]);
const _sfc_main$6 = {
  __name: "ListGroupRows",
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const list = inject("list");
    const __returned__ = { props, list, ListRow, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$5 = {
  key: 0,
  class: "mb-5 mt-2"
};
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return !$props.group.collapsed ? (openBlock(), createElementBlock("div", _hoisted_1$5, [
    renderSlot(_ctx.$slots, "default", {}, () => [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($props.group.rows, (row) => {
          return openBlock(), createBlock($setup["ListRow"], {
            key: row[$setup.list.rowKey],
            row
          }, null, 8, ["row"]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      $setup.list.slots["group-empty"] && $props.group.rows.length == 0 ? (openBlock(), createBlock(
        resolveDynamicComponent($setup.list.slots["group-empty"]),
        normalizeProps(mergeProps({ key: 0 }, { group: $props.group })),
        null,
        16
        /* FULL_PROPS */
      )) : createCommentVNode("v-if", true)
    ])
  ])) : createCommentVNode("v-if", true);
}
_sfc_main$6.__file = "src/components/ListView/ListGroupRows.vue";
const ListGroupRows = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListGroupRows.vue"]]);
const _sfc_main$5 = {
  __name: "ListGroups",
  setup(__props, { expose: __expose }) {
    __expose();
    const list = inject("list");
    const __returned__ = { list, ListGroupHeader, ListGroupRows, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$4 = { class: "h-full overflow-y-auto" };
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$4, [
    (openBlock(true), createElementBlock(
      Fragment,
      null,
      renderList($setup.list.rows, (group) => {
        return openBlock(), createElementBlock("div", {
          key: group.group
        }, [
          renderSlot(_ctx.$slots, "default", {}, () => [
            createVNode($setup["ListGroupHeader"], { group }, {
              default: withCtx(() => [
                _ctx.$slots["group-header"] ? renderSlot(_ctx.$slots, "group-header", mergeProps({
                  key: 0,
                  ref_for: true
                }, { group })) : createCommentVNode("v-if", true)
              ]),
              _: 2
              /* DYNAMIC */
            }, 1032, ["group"]),
            createVNode($setup["ListGroupRows"], { group }, null, 8, ["group"])
          ])
        ]);
      }),
      128
      /* KEYED_FRAGMENT */
    ))
  ]);
}
_sfc_main$5.__file = "src/components/ListView/ListGroups.vue";
const ListGroups = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListGroups.vue"]]);
const _sfc_main$4 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "ListSelectBanner",
  setup(__props, { expose: __expose }) {
    __expose();
    const list = inject("list");
    let selectedText = computed(() => {
      return list.value.options.selectionText(list.value.selections.size);
    });
    const __returned__ = { list, get selectedText() {
      return selectedText;
    }, set selectedText(v) {
      selectedText = v;
    }, Checkbox, get Button() {
      return Button;
    }, computed, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$3 = {
  key: 0,
  class: "absolute inset-x-0 bottom-6 mx-auto w-max text-base"
};
const _hoisted_2$1 = { class: "flex flex-1 justify-between border-r border-outline-gray-2 text-ink-gray-9" };
const _hoisted_3$1 = { class: "flex items-center space-x-3" };
const _hoisted_4 = { class: "mr-3" };
const _hoisted_5 = { class: "flex items-center space-x-1" };
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, {
    "enter-active-class": "duration-300 ease-out",
    "enter-from-class": "transform opacity-0",
    "enter-to-class": "opacity-100",
    "leave-active-class": "duration-300 ease-in",
    "leave-from-class": "opacity-100",
    "leave-to-class": "transform opacity-0"
  }, {
    default: withCtx(() => [
      $setup.list.selections.size ? (openBlock(), createElementBlock("div", _hoisted_1$3, [
        createBaseVNode(
          "div",
          {
            class: normalizeClass(["flex min-w-[596px] items-center space-x-3 rounded-lg bg-surface-white px-4 py-2 shadow-2xl", _ctx.$attrs.class])
          },
          [
            renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({
              selections: $setup.list.selections,
              allRowsSelected: $setup.list.allRowsSelected,
              selectAll: () => $setup.list.toggleAllRows(true),
              unselectAll: () => $setup.list.toggleAllRows(false)
            })), () => [
              createBaseVNode("div", _hoisted_2$1, [
                createBaseVNode("div", _hoisted_3$1, [
                  createVNode($setup["Checkbox"], {
                    modelValue: true,
                    disabled: true,
                    class: "text-ink-gray-9"
                  }),
                  createBaseVNode(
                    "div",
                    null,
                    toDisplayString($setup.selectedText),
                    1
                    /* TEXT */
                  )
                ]),
                createBaseVNode("div", _hoisted_4, [
                  renderSlot(_ctx.$slots, "actions", normalizeProps(guardReactiveProps({
                    selections: $setup.list.selections,
                    allRowsSelected: $setup.list.allRowsSelected,
                    selectAll: () => $setup.list.toggleAllRows(true),
                    unselectAll: () => $setup.list.toggleAllRows(false)
                  })))
                ])
              ]),
              createBaseVNode("div", _hoisted_5, [
                createVNode($setup["Button"], {
                  class: normalizeClass(["w- text-ink-gray-7", $setup.list.allRowsSelected ? "cursor-not-allowed" : ""]),
                  disabled: $setup.list.allRowsSelected,
                  variant: "ghost",
                  onClick: _cache[0] || (_cache[0] = ($event) => $setup.list.toggleAllRows(true))
                }, {
                  default: withCtx(() => _cache[2] || (_cache[2] = [
                    createTextVNode(" Select all ")
                  ])),
                  _: 1
                  /* STABLE */
                }, 8, ["disabled", "class"]),
                createVNode($setup["Button"], {
                  icon: "x",
                  variant: "ghost",
                  onClick: _cache[1] || (_cache[1] = ($event) => $setup.list.toggleAllRows(false))
                })
              ])
            ])
          ],
          2
          /* CLASS */
        )
      ])) : createCommentVNode("v-if", true)
    ]),
    _: 3
    /* FORWARDED */
  });
}
_sfc_main$4.__file = "src/components/ListView/ListSelectBanner.vue";
const ListSelectBanner = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListSelectBanner.vue"]]);
const _sfc_main$3 = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "ListView",
  props: {
    columns: {
      type: Array,
      default: []
    },
    rows: {
      type: Array,
      default: []
    },
    rowKey: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => ({
        getRowRoute: null,
        onRowClick: null,
        showTooltip: true,
        selectable: true,
        resizeColumn: false,
        rowHeight: 40,
        emptyState: {
          title: "No Data",
          description: "No data available"
        }
      })
    }
  },
  emits: ["update:selections", "update:active-row"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const slots = useSlots();
    let selections = reactive(/* @__PURE__ */ new Set());
    let activeRow = ref(null);
    const emit = __emit;
    watch(selections, (value) => {
      if (selections.size) {
        activeRow.value = null;
      }
      emit("update:selections", value);
    });
    watch(activeRow, (value) => {
      emit("update:active-row", value);
    });
    let _options = computed(() => {
      function defaultTrue(value) {
        return value === void 0 ? true : value;
      }
      function defaultFalse(value) {
        return value === void 0 ? false : value;
      }
      return {
        getRowRoute: props.options.getRowRoute || null,
        onRowClick: props.options.onRowClick || null,
        showTooltip: defaultTrue(props.options.showTooltip),
        selectionText: props.options.selectionText || ((val) => val === 1 ? "1 row selected" : `${val} rows selected`),
        enableActive: defaultFalse(props.options.enableActive),
        selectable: defaultTrue(props.options.selectable),
        resizeColumn: defaultFalse(props.options.resizeColumn),
        rowHeight: props.options.rowHeight || 40,
        emptyState: props.options.emptyState
      };
    });
    const allRowsSelected = computed(() => {
      if (!props.rows.length) return false;
      if (showGroupedRows.value) {
        return selections.size === props.rows.reduce((acc, row) => acc + row.rows.length, 0);
      }
      return selections.size === props.rows.length;
    });
    const selectable = computed(() => {
      return _options.value.selectable;
    });
    let showGroupedRows = computed(() => {
      return props.rows.every(
        (row) => row.group && row.rows && Array.isArray(row.rows)
      );
    });
    function toggleRow(row) {
      if (!selections.delete(row)) {
        selections.add(row);
      }
    }
    function toggleAllRows(select) {
      if (!select || allRowsSelected.value) {
        selections.clear();
        return;
      }
      if (showGroupedRows.value) {
        props.rows.forEach((row) => {
          row.rows.forEach((r) => selections.add(r[props.rowKey]));
        });
        return;
      }
      props.rows.forEach((row) => selections.add(row[props.rowKey]));
    }
    provide(
      "list",
      computed(() => ({
        rowKey: props.rowKey,
        rows: props.rows,
        columns: props.columns,
        options: _options.value,
        selections,
        activeRow,
        allRowsSelected: allRowsSelected.value,
        slots,
        toggleRow,
        toggleAllRows
      }))
    );
    __expose({
      selections,
      allRowsSelected,
      toggleRow,
      toggleAllRows
    });
    const __returned__ = { props, slots, get selections() {
      return selections;
    }, set selections(v) {
      selections = v;
    }, get activeRow() {
      return activeRow;
    }, set activeRow(v) {
      activeRow = v;
    }, emit, get _options() {
      return _options;
    }, set _options(v) {
      _options = v;
    }, allRowsSelected, selectable, get showGroupedRows() {
      return showGroupedRows;
    }, set showGroupedRows(v) {
      showGroupedRows = v;
    }, toggleRow, toggleAllRows, ListEmptyState, ListHeader, ListRows, ListGroups, ListSelectBanner, ref, reactive, computed, provide, watch, useSlots };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$2 = { class: "relative flex w-full flex-1 flex-col overflow-x-auto" };
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$2, [
    createBaseVNode(
      "div",
      {
        class: normalizeClass(["flex w-max min-w-full flex-col overflow-y-hidden", _ctx.$attrs.class]),
        style: normalizeStyle(_ctx.$attrs.style)
      },
      [
        renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({ showGroupedRows: $setup.showGroupedRows, selectable: $setup.selectable })), () => [
          createVNode($setup["ListHeader"]),
          $setup.props.rows.length ? (openBlock(), createElementBlock(
            Fragment,
            { key: 0 },
            [
              $setup.showGroupedRows ? (openBlock(), createBlock($setup["ListGroups"], { key: 0 })) : (openBlock(), createBlock($setup["ListRows"], { key: 1 }))
            ],
            64
            /* STABLE_FRAGMENT */
          )) : (openBlock(), createBlock($setup["ListEmptyState"], { key: 1 })),
          $setup.selectable ? (openBlock(), createBlock($setup["ListSelectBanner"], { key: 2 })) : createCommentVNode("v-if", true)
        ])
      ],
      6
      /* CLASS, STYLE */
    )
  ]);
}
_sfc_main$3.__file = "src/components/ListView/ListView.vue";
const ListView = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListView.vue"]]);
const _sfc_main$2 = {
  __name: "ListRowItem",
  props: {
    column: {
      type: Object,
      default: {}
    },
    row: {
      type: Object,
      default: {}
    },
    item: {
      type: [String, Number, Object],
      default: ""
    },
    align: {
      type: String,
      default: "left"
    }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const label = computed(() => {
      var _a, _b;
      if ((_a = props.column) == null ? void 0 : _a.getLabel) return (_b = props.column) == null ? void 0 : _b.getLabel({ row: props.row });
      return getValue(props.item).label || "";
    });
    const tooltip = computed(() => {
      if (!list.value.options.showTooltip) return "";
      return props.column.getTooltip ? props.column.getTooltip(props.row) : getValue(props.item).label;
    });
    function getValue(value) {
      if (value && typeof value === "object") {
        return value;
      }
      return { label: value };
    }
    const list = inject("list");
    const __returned__ = { props, label, tooltip, getValue, list, computed, inject, get Tooltip() {
      return __unplugin_components_0;
    }, get alignmentMap() {
      return alignmentMap;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$1 = { class: "truncate text-base" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      class: normalizeClass(["flex items-center space-x-2", $setup.alignmentMap[$props.align]])
    },
    [
      renderSlot(_ctx.$slots, "prefix", {}, () => [
        $props.column.prefix ? (openBlock(), createBlock(resolveDynamicComponent(
          typeof $props.column.prefix === "function" ? $props.column.prefix({ row: $props.row }) : $props.column.prefix
        ), { key: 0 })) : createCommentVNode("v-if", true)
      ]),
      createVNode(
        $setup["Tooltip"],
        normalizeProps(guardReactiveProps(
          $setup.list.options.showTooltip ? {
            text: $setup.tooltip
          } : { text: "" }
        )),
        {
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({ label: $setup.label })), () => [
              createBaseVNode(
                "div",
                _hoisted_1$1,
                toDisplayString($setup.label),
                1
                /* TEXT */
              )
            ])
          ]),
          _: 3
          /* FORWARDED */
        },
        16
        /* FULL_PROPS */
      ),
      renderSlot(_ctx.$slots, "suffix")
    ],
    2
    /* CLASS */
  );
}
_sfc_main$2.__file = "src/components/ListView/ListRowItem.vue";
const ListRowItem = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListRowItem.vue"]]);
const _sfc_main$1 = {
  __name: "ListRow",
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const list = inject("list");
    const isLastRow = computed(() => {
      var _a;
      if (!((_a = list.value.rows) == null ? void 0 : _a.length)) return false;
      return list.value.rows[list.value.rows.length - 1][list.value.rowKey] === props.row[list.value.rowKey];
    });
    const isSelected = computed(() => {
      return list.value.selections.has(props.row[list.value.rowKey]);
    });
    const isActive = computed(
      () => list.value.options.enableActive && list.value.activeRow.value === props.row.name
    );
    const isHoverable = computed(() => {
      return list.value.options.getRowRoute || list.value.options.onRowClick;
    });
    const rowHeight = computed(() => {
      if (typeof list.value.options.rowHeight === "number") {
        return `${list.value.options.rowHeight}px`;
      }
      return list.value.options.rowHeight;
    });
    const roundedClass = computed(() => {
      var _a, _b, _c;
      if (!isSelected.value) return "rounded";
      const selections = [...list.value.selections];
      let groups = ((_a = list.value.rows[0]) == null ? void 0 : _a.group) ? list.value.rows.map((k) => k.rows) : [list.value.rows];
      for (let rows of groups) {
        let currentIndex = rows.findIndex((k) => k == props.row);
        if (currentIndex === -1) continue;
        let atBottom = !selections.includes((_b = rows[currentIndex + 1]) == null ? void 0 : _b.name);
        let atTop = !selections.includes((_c = rows[currentIndex - 1]) == null ? void 0 : _c.name);
        return (atBottom ? "rounded-b " : "") + (atTop ? "rounded-t" : "");
      }
    });
    const onRowClick = (event) => {
      if (list.value.options.onRowClick)
        list.value.options.onRowClick(props.row, event);
      if (list.value.activeRow.value === props.row.name) {
        list.value.activeRow.value = null;
      } else {
        list.value.activeRow.value = props.row.name;
      }
    };
    const handleCheckboxClick = (event) => {
      const value = props.row[list.value.rowKey];
      if (event.shiftKey && !list.value.selections.has(value)) {
        const lastSelected = Array.from(list.value.selections).pop();
        const rows = list.value.rows.find((k) => k.group) ? list.value.rows.reduce((acc, curr) => acc.concat(curr.rows), []) : list.value.rows;
        const lastIndex = rows.findIndex(
          (k) => lastSelected === k[list.value.rowKey]
        );
        const curIndex = rows.findIndex((k) => value === k[list.value.rowKey]);
        const start = Math.min(lastIndex, curIndex);
        const end = Math.max(lastIndex, curIndex);
        for (let i = start; i <= end; i++) {
          list.value.selections.add(rows[i][list.value.rowKey]);
        }
      } else {
        list.value.toggleRow(value);
      }
    };
    const __returned__ = { props, list, isLastRow, isSelected, isActive, isHoverable, rowHeight, roundedClass, onRowClick, handleCheckboxClick, Checkbox, ListRowItem, get alignmentMap() {
      return alignmentMap;
    }, get getGridTemplateColumns() {
      return getGridTemplateColumns;
    }, computed, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(resolveDynamicComponent($setup.list.options.getRowRoute ? "router-link" : "div"), mergeProps({
    class: [[
      $setup.roundedClass,
      $setup.isSelected || $setup.isActive ? "bg-surface-gray-2" : "",
      $setup.isHoverable ? "cursor-pointer" : "",
      $setup.isHoverable ? $setup.isSelected || $setup.isActive ? "hover:bg-surface-gray-3" : "hover:bg-surface-menu-bar" : ""
    ], "flex flex-col transition-all duration-300 ease-in-out"]
  }, {
    to: $setup.list.options.getRowRoute ? $setup.list.options.getRowRoute($props.row) : void 0,
    onClick: $setup.onRowClick
  }), {
    default: withCtx(() => [
      (openBlock(), createBlock(resolveDynamicComponent($setup.list.options.getRowRoute ? "template" : "button"), { class: "[all:unset] hover:[all:unset]" }, {
        default: withCtx(() => {
          var _a, _b;
          return [
            createBaseVNode(
              "div",
              {
                class: "grid items-center space-x-4 px-2",
                style: normalizeStyle({
                  height: $setup.rowHeight,
                  gridTemplateColumns: $setup.getGridTemplateColumns(
                    $setup.list.columns,
                    $setup.list.options.selectable
                  )
                })
              },
              [
                $setup.list.options.selectable ? (openBlock(), createElementBlock(
                  "div",
                  {
                    key: 0,
                    class: "w-fit pr-2 py-3 flex",
                    onClick: _cache[0] || (_cache[0] = withModifiers(() => {
                    }, ["stop", "prevent"])),
                    onDblclick: _cache[1] || (_cache[1] = withModifiers(() => {
                    }, ["stop"]))
                  },
                  [
                    createVNode($setup["Checkbox"], {
                      modelValue: $setup.isSelected,
                      class: "cursor-pointer duration-300",
                      onClick: withModifiers($setup.handleCheckboxClick, ["stop"])
                    }, null, 8, ["modelValue"])
                  ],
                  32
                  /* NEED_HYDRATION */
                )) : createCommentVNode("v-if", true),
                (openBlock(true), createElementBlock(
                  Fragment,
                  null,
                  renderList($setup.list.columns, (column, i) => {
                    return openBlock(), createElementBlock(
                      "div",
                      {
                        key: column.key,
                        class: normalizeClass([
                          $setup.alignmentMap[column.align],
                          i == 0 ? "text-ink-gray-9" : "text-ink-gray-7"
                        ])
                      },
                      [
                        renderSlot(_ctx.$slots, "default", mergeProps({ ref_for: true }, { idx: i, column, item: $props.row[column.key], isActive: $setup.isActive }), () => [
                          $setup.list.slots.cell ? (openBlock(), createBlock(
                            resolveDynamicComponent($setup.list.slots.cell),
                            mergeProps({
                              key: 0,
                              ref_for: true
                            }, {
                              column,
                              row: $props.row,
                              item: $props.row[column.key],
                              align: column.align
                            }),
                            null,
                            16
                            /* FULL_PROPS */
                          )) : (openBlock(), createBlock($setup["ListRowItem"], {
                            key: 1,
                            column,
                            row: $props.row,
                            item: $props.row[column.key],
                            align: column.align
                          }, null, 8, ["column", "row", "item", "align"]))
                        ])
                      ],
                      2
                      /* CLASS */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              4
              /* STYLE */
            ),
            !$setup.isLastRow ? (openBlock(), createElementBlock(
              "div",
              {
                key: 0,
                class: normalizeClass([
                  "h-px border-t",
                  $setup.roundedClass === "rounded" || ((_b = (_a = $setup.roundedClass) == null ? void 0 : _a.includes) == null ? void 0 : _b.call(_a, "rounded-b")) ? "mx-2 border-outline-gray-1" : "border-t-[--surface-gray-2]"
                ])
              },
              null,
              2
              /* CLASS */
            )) : createCommentVNode("v-if", true)
          ];
        }),
        _: 3
        /* FORWARDED */
      }))
    ]),
    _: 3
    /* FORWARDED */
  }, 16, ["class"]);
}
_sfc_main$1.__file = "src/components/ListView/ListRow.vue";
const ListRow = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListRow.vue"]]);
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
