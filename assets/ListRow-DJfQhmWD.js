var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { C as Checkbox } from "./Checkbox-duY88wYo.js";
import { az as ref, br as computed, cd as useDebounceFn, bF as inject, aB as openBlock, aG as createElementBlock, aF as createBaseVNode, bk as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aN as toDisplayString, aQ as normalizeClass, aL as mergeProps, aH as createCommentVNode, aC as createBlock, bz as withModifiers, aK as Fragment, aJ as renderList, bn as normalizeStyle, ay as defineComponent, aA as resolveComponent, aE as createVNode, aM as createTextVNode, a$ as resolveDynamicComponent, aD as withCtx, bm as Transition, bp as useSlots, aI as reactive, bt as watch, bP as provide, bG as onMounted, bH as onBeforeUnmount, bv as lt, bw as it, bx as rt, by as ut, ce as ye, cf as Ge, cg as je, bl as createPopper, bu as nextTick, b0 as withDirectives, b1 as vShow, aP as h, ch as set, ci as get, cj as setMany, ck as del, cl as keys, cm as toValue, cn as createFetch } from "./vendor-JXRGA09x.js";
import { A as Autocomplete } from "./Autocomplete-DdVgvhiM.js";
import "./Avatar-DF-UPpY4.js";
import "./Badge-DU-6Lgz0.js";
import "./Breadcrumbs-yxt2XZGz.js";
import { L as LoadingIndicator, B as Button } from "./Button-DSLjZGDv.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { g as getConfig } from "./DateRangePicker-BGysHF_0.js";
import { D as Dialog } from "./Dialog-OHLYrBN2.js";
import "./Dropdown-CgEqR-MM.js";
import "./ErrorMessage-C1GjMIbS.js";
import { F as FeatherIcon } from "./FeatherIcon-BA0KhfD2.js";
import "./FileUploader-vdAyyz_W.js";
import { F as FormControl } from "./FormControl-BOwWclUE.js";
import { d as debounce } from "./debounce-CRCtzhPg.js";
import "./Progress-BvujJ_Qv.js";
import "./Popover-oCvMGCie.js";
import "./Rating-DADBxd8u.js";
import "./Select-Cj_r2YLc.js";
import "./Spinner-CiWf41HB.js";
import "./Switch-Db43NJF0.js";
import { T as TabButtons } from "./TabButtons-BcGQmqbX.js";
import "./Tabs-BteOLZ9k.js";
import "./TextInput-CxKZVuxP.js";
import "./Textarea-91toUESb.js";
import "./TextEditor-CcrsAj7j.js";
import { T as Tooltip } from "./Tooltip-nsP8Ttbr.js";
import "./Calendar-CiyiZhir.js";
import "./CircularProgressBar-DJOiJbzl.js";
import "./Tree-BpCpKaGu.js";
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
const _sfc_main$w = {
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
const _hoisted_1$d = { class: "truncate" };
const _hoisted_2$3 = {
  ref: "resizer",
  class: "h-full w-[2px] rounded-full transition-all duration-300 ease-in-out group-hover:bg-gray-400"
};
function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
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
              _hoisted_1$d,
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
              _hoisted_2$3,
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
_sfc_main$w.__file = "src/components/ListView/ListHeaderItem.vue";
const ListHeaderItem = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$g], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListHeaderItem.vue"]]);
const _sfc_main$v = {
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
function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
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
_sfc_main$v.__file = "src/components/ListView/ListHeader.vue";
const ListHeader = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$f], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListHeader.vue"]]);
const _sfc_main$u = /* @__PURE__ */ defineComponent({
  __name: "Alert",
  props: {
    title: { type: String, required: false },
    type: { type: String, required: false, default: "warning" }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const classes = computed(() => {
      return {
        warning: "text-ink-gray-7 bg-surface-blue-1"
      }[props.type];
    });
    const __returned__ = { props, classes };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
_sfc_main$u.__file = "src/components/Alert.vue";
const _sfc_main$t = {
  name: "Loading",
  props: {
    text: {
      type: String,
      default: "Loading..."
    }
  },
  components: {
    LoadingIndicator
  }
};
const _hoisted_1$c = { class: "flex items-center text-base text-ink-gray-4" };
function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LoadingIndicator = resolveComponent("LoadingIndicator");
  return openBlock(), createElementBlock("div", _hoisted_1$c, [
    createVNode(_component_LoadingIndicator, { class: "-ml-1 mr-2 h-3 w-3" }),
    createTextVNode(
      " " + toDisplayString($props.text),
      1
      /* TEXT */
    )
  ]);
}
_sfc_main$t.__file = "src/components/LoadingText.vue";
const LoadingText = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$e], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/LoadingText.vue"]]);
const _sfc_main$s = {
  name: "Card",
  props: {
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    loading: {
      type: Boolean
    }
  },
  components: {
    LoadingText
  }
};
_sfc_main$s.__file = "src/components/Card.vue";
const _sfc_main$r = {
  name: "ConfirmDialog",
  props: {
    title: {
      type: String
    },
    message: {
      type: String
    },
    onConfirm: {
      type: Function,
      default: null
    }
  },
  expose: ["show", "hide"],
  components: {
    Dialog,
    Button
  },
  data() {
    return {
      showDialog: true,
      isLoading: false
    };
  },
  methods: {
    handleConfirmation() {
      var _a;
      try {
        (_a = this.onConfirm) == null ? void 0 : _a.call(this, {
          hideDialog: this.hide
        });
      } finally {
        this.isLoading = false;
      }
    },
    show() {
      this.showDialog = true;
    },
    hide() {
      this.showDialog = false;
    }
  },
  computed: {
    primaryActionProps() {
      return {
        label: "Confirm",
        variant: "solid",
        loading: this.isLoading,
        onClick: this.handleConfirmation
      };
    }
  }
};
_sfc_main$r.__file = "src/components/ConfirmDialog.vue";
const dialogs = ref([]);
const _sfc_main$q = {
  __name: "Dialogs",
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = { get dialogs() {
      return dialogs;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
_sfc_main$q.__file = "src/components/Dialogs.vue";
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "Divider",
  props: {
    orientation: { type: String, required: false, default: "horizontal" },
    position: { type: String, required: false, default: "center" },
    flexItem: { type: Boolean, required: false },
    action: { type: Object, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const alignmentClasses = computed(() => {
      let spacerDimensionClasses = {
        horizontal: "border-t-[1px] w-full",
        vertical: "border-l-[1px]"
      }[props.orientation];
      let flexClasses = props.flexItem ? "self-stretch h-auto" : "h-full";
      return [spacerDimensionClasses, flexClasses];
    });
    const actionAlignmentClasses = computed(() => {
      return {
        horizontal: {
          center: "left-1/2 top-0 -translate-y-2/4 -translate-x-1/2",
          start: "left-0 top-0 -translate-y-2/4 ml-4",
          end: "right-0 -translate-y-2/4 mr-4"
        },
        vertical: {
          center: "-translate-x-2/4 top-1/2 left-0 -translate-y-1/2",
          start: "-translate-x-2/4 top-0 mt-4 left-0",
          end: "-translate-x-2/4 bottom-0 mb-4 left-0"
        }
      }[props.orientation][props.position];
    });
    const __returned__ = { props, alignmentClasses, actionAlignmentClasses, get Button() {
      return Button;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
_sfc_main$p.__file = "src/components/Divider.vue";
const _sfc_main$o = {};
_sfc_main$o.__file = "src/components/GreenCheckIcon.vue";
const _sfc_main$n = {
  name: "Input",
  inheritAttrs: false,
  expose: ["getInputValue"],
  components: { FeatherIcon },
  props: {
    label: {
      type: String
    },
    type: {
      type: String,
      default: "text",
      validator(value) {
        let isValid = [
          "text",
          "number",
          "checkbox",
          "textarea",
          "select",
          "email",
          "password",
          "date"
        ].includes(value);
        if (!isValid) {
          console.warn(`Invalid value "${value}" for "type" prop for Input`);
        }
        return isValid;
      }
    },
    modelValue: {
      type: [String, Number, Boolean, Object, Array]
    },
    inputClass: {
      type: [String, Array, Object]
    },
    debounce: {
      type: Number
    },
    options: {
      type: Array
    },
    disabled: {
      type: Boolean
    },
    rows: {
      type: Number,
      default: 3
    },
    placeholder: {
      type: String
    },
    iconLeft: {
      type: String
    }
  },
  emits: ["input", "change", "update:modelValue"],
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    blur() {
      this.$refs.input.blur();
    },
    getInputValue(e) {
      let $input = e ? e.target : this.$refs.input;
      let value = $input.value;
      if (this.type == "checkbox") {
        value = $input.checked;
      }
      return value;
    }
  },
  computed: {
    passedInputValue() {
      if ("value" in this.$attrs) {
        return this.$attrs.value;
      }
      return this.modelValue || null;
    },
    inputAttributes() {
      let attrs = {};
      let onInput = (e) => {
        this.$emit("input", this.getInputValue(e));
      };
      if (this.debounce) {
        onInput = debounce(onInput, this.debounce);
      }
      if (this.type == "checkbox") {
        attrs.checked = this.passedInputValue;
      }
      return Object.assign(attrs, this.$attrs, {
        onInput,
        onChange: (e) => {
          this.$emit("change", this.getInputValue(e));
          this.$emit("update:modelValue", this.getInputValue(e));
        }
      });
    },
    selectOptions() {
      return this.options.map((option) => {
        if (typeof option === "string") {
          return {
            label: option,
            value: option
          };
        }
        return option;
      }).filter(Boolean);
    },
    isNormalInput() {
      return [
        "text",
        "number",
        "checkbox",
        "email",
        "password",
        "date"
      ].includes(this.type);
    }
  }
};
_sfc_main$n.__file = "src/components/Input.vue";
const _sfc_main$m = {
  props: ["to"],
  computed: {
    attributes() {
      return {
        ...this.$attrs,
        target: this.isExternal ? "_blank" : null,
        to: !this.isExternal ? this.to : void 0,
        href: this.isExternal ? this.to : void 0
      };
    },
    isExternal() {
      return this.to.startsWith("http");
    }
  }
};
_sfc_main$m.__file = "src/components/Link.vue";
const _sfc_main$l = {
  name: "ListItem",
  props: ["title", "subtitle"],
  computed: {
    secondaryText() {
      let text = this.subtitle || "";
      return text.replace("\n", "<br>");
    }
  }
};
_sfc_main$l.__file = "src/components/ListItem.vue";
const _sfc_main$k = {
  name: "Resource",
  props: ["options"],
  resources: {
    resource() {
      return this.options;
    }
  },
  render() {
    return this.$slots.default({
      resource: this.$resources.resource,
      data: this.$resources.resource.data,
      error: this.$resources.resource.error,
      loading: this.$resources.resource.loading,
      fetch: (params) => this.$resources.resource.fetch(params),
      submit: (params) => this.$resources.resource.submit(params)
    });
  }
};
_sfc_main$k.__file = "src/components/Resource.vue";
const _sfc_main$j = {
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
const _hoisted_1$b = { class: "flex h-full w-full flex-col items-center justify-center text-base" };
const _hoisted_2$2 = { class: "text-xl font-medium" };
const _hoisted_3$2 = { class: "mt-1 text-base text-ink-gray-5" };
function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$b, [
    renderSlot(_ctx.$slots, "default", {}, () => [
      createBaseVNode(
        "div",
        _hoisted_2$2,
        toDisplayString($setup.list.options.emptyState.title),
        1
        /* TEXT */
      ),
      createBaseVNode(
        "div",
        _hoisted_3$2,
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
_sfc_main$j.__file = "src/components/ListView/ListEmptyState.vue";
const ListEmptyState = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$d], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListEmptyState.vue"]]);
const _sfc_main$i = {
  __name: "ListRows",
  setup(__props, { expose: __expose }) {
    __expose();
    const list = inject("list");
    const __returned__ = { list, ListRow, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$a = { class: "h-full overflow-y-auto" };
function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$a, [
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
_sfc_main$i.__file = "src/components/ListView/ListRows.vue";
const ListRows = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$c], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListRows.vue"]]);
const _sfc_main$h = {};
const _hoisted_1$9 = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 16 16"
};
function _sfc_render$b(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$9, _cache[0] || (_cache[0] = [
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
_sfc_main$h.__file = "src/icons/DownSolid.vue";
const DownSolid = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$b], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/icons/DownSolid.vue"]]);
const _sfc_main$g = {
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
const _hoisted_1$8 = { class: "flex items-center" };
const _hoisted_2$1 = { class: "w-full py-1.5 pr-2" };
const _hoisted_3$1 = {
  key: 1,
  class: "text-base font-medium leading-6"
};
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      createBaseVNode("div", _hoisted_1$8, [
        createBaseVNode("button", {
          onClick: $setup.toggleGroup,
          class: "ml-[3px] mr-[11px] rounded p-1 hover:bg-surface-gray-2"
        }, [
          createVNode($setup["DownSolid"], {
            class: normalizeClass(["h-4 w-4 text-ink-gray-9 transition-transform duration-200", [$props.group.collapsed ? "-rotate-90" : ""]])
          }, null, 8, ["class"])
        ]),
        renderSlot(_ctx.$slots, "default", {}, () => [
          createBaseVNode("div", _hoisted_2$1, [
            $setup.list.slots["group-header"] ? (openBlock(), createBlock(
              resolveDynamicComponent($setup.list.slots["group-header"]),
              normalizeProps(mergeProps({ key: 0 }, { group: $props.group })),
              null,
              16
              /* FULL_PROPS */
            )) : (openBlock(), createElementBlock(
              "span",
              _hoisted_3$1,
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
_sfc_main$g.__file = "src/components/ListView/ListGroupHeader.vue";
const ListGroupHeader = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$a], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListGroupHeader.vue"]]);
const _sfc_main$f = {
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
const _hoisted_1$7 = {
  key: 0,
  class: "mb-5 mt-2"
};
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return !$props.group.collapsed ? (openBlock(), createElementBlock("div", _hoisted_1$7, [
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
      ))
    ])
  ])) : createCommentVNode("v-if", true);
}
_sfc_main$f.__file = "src/components/ListView/ListGroupRows.vue";
const ListGroupRows = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$9], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListGroupRows.vue"]]);
const _sfc_main$e = {
  __name: "ListGroups",
  setup(__props, { expose: __expose }) {
    __expose();
    const list = inject("list");
    const __returned__ = { list, ListGroupHeader, ListGroupRows, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$6 = { class: "h-full overflow-y-auto" };
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$6, [
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
_sfc_main$e.__file = "src/components/ListView/ListGroups.vue";
const ListGroups = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$8], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListGroups.vue"]]);
const _sfc_main$d = /* @__PURE__ */ Object.assign({
  inheritAttrs: false
}, {
  __name: "ListSelectBanner",
  setup(__props, { expose: __expose }) {
    __expose();
    const list = inject("list");
    let selectedText = computed(() => {
      let title = list.value.selections.size === 1 ? "Row" : "Rows";
      return `${list.value.selections.size} ${title} selected`;
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
const _hoisted_1$5 = {
  key: 0,
  class: "absolute inset-x-0 bottom-6 mx-auto w-max text-base"
};
const _hoisted_2 = { class: "flex flex-1 justify-between border-r border-outline-gray-2 text-ink-gray-9" };
const _hoisted_3 = { class: "flex items-center space-x-3" };
const _hoisted_4 = { class: "mr-3" };
const _hoisted_5 = { class: "flex items-center space-x-1" };
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, {
    "enter-active-class": "duration-300 ease-out",
    "enter-from-class": "transform opacity-0",
    "enter-to-class": "opacity-100",
    "leave-active-class": "duration-300 ease-in",
    "leave-from-class": "opacity-100",
    "leave-to-class": "transform opacity-0"
  }, {
    default: withCtx(() => [
      $setup.list.selections.size ? (openBlock(), createElementBlock("div", _hoisted_1$5, [
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
              createBaseVNode("div", _hoisted_2, [
                createBaseVNode("div", _hoisted_3, [
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
_sfc_main$d.__file = "src/components/ListView/ListSelectBanner.vue";
const ListSelectBanner = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$7], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListSelectBanner.vue"]]);
const _sfc_main$c = /* @__PURE__ */ Object.assign({
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
  emits: ["update:selections"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const slots = useSlots();
    let selections = reactive(/* @__PURE__ */ new Set());
    const emit = __emit;
    watch(selections, (value) => {
      emit("update:selections", value);
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
    }, emit, get _options() {
      return _options;
    }, set _options(v) {
      _options = v;
    }, allRowsSelected, selectable, get showGroupedRows() {
      return showGroupedRows;
    }, set showGroupedRows(v) {
      showGroupedRows = v;
    }, toggleRow, toggleAllRows, ListEmptyState, ListHeader, ListRows, ListGroups, ListSelectBanner, reactive, computed, provide, watch, useSlots };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$4 = { class: "relative flex w-full flex-1 flex-col overflow-x-auto" };
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$4, [
    createBaseVNode(
      "div",
      {
        class: normalizeClass(["flex w-max min-w-full flex-col overflow-y-hidden", _ctx.$attrs.class])
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
      2
      /* CLASS */
    )
  ]);
}
_sfc_main$c.__file = "src/components/ListView/ListView.vue";
const ListView = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$6], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListView.vue"]]);
const _sfc_main$b = {
  __name: "ListFooter",
  props: {
    modelValue: {
      type: Number,
      default: 20
    },
    options: {
      type: Object,
      default: () => ({
        rowCount: 0,
        totalCount: 0,
        pageLengthOptions: [20, 50, 100]
      })
    }
  },
  emits: ["update:modelValue", "loadMore"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const pageLengthCount = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value)
    });
    const pageLengthOptions = ref(props.options.pageLengthOptions || [20, 50, 100]);
    const showLoadMore = computed(() => {
      return props.options.rowCount && props.options.totalCount && props.options.rowCount < props.options.totalCount;
    });
    const __returned__ = { props, emit, pageLengthCount, pageLengthOptions, showLoadMore, TabButtons, ref, computed };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
_sfc_main$b.__file = "src/components/ListView/ListFooter.vue";
const _sfc_main$a = {
  name: "Toast",
  props: {
    position: {
      type: String,
      default: "top-center"
    },
    icon: {
      type: String
    },
    iconClasses: {
      type: String
    },
    title: {
      type: String
    },
    text: {
      type: String
    },
    timeout: {
      type: Number,
      default: 5
    }
  },
  emits: ["close"],
  components: {
    FeatherIcon
  },
  mounted() {
    if (this.timeout > 0) {
      setTimeout(() => {
        this.$emit("close");
      }, this.timeout * 1e3);
    }
  }
};
_sfc_main$a.__file = "src/components/Toast.vue";
ref([]);
const _sfc_main$9 = {
  __name: "CommandPalette",
  props: {
    show: { type: Boolean, default: false },
    searchQuery: { type: String, default: "" },
    groups: { type: Array, default: () => [] }
  },
  emits: ["update:show", "update:searchQuery", "select"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const emit = __emit;
    const props = __props;
    const show = computed({
      get: () => props.show,
      set: (value) => emit("update:show", value)
    });
    const searchQuery = computed({
      get: () => props.searchQuery,
      set: (value) => emit("update:searchQuery", value)
    });
    function select(item) {
      emit("select", item);
      show.value = false;
    }
    function keydownWatcher(e) {
      if (e.key === "Escape" && show.value) {
        show.value = false;
        e.preventDefault();
      }
      if (e.key === "k" && (e.ctrlKey || e.metaKey) && !e.target.classList.contains("ProseMirror")) {
        show.value = true;
        e.preventDefault();
      }
    }
    onMounted(() => window.addEventListener("keydown", keydownWatcher));
    onBeforeUnmount(() => window.removeEventListener("keydown", keydownWatcher));
    const __returned__ = { emit, props, show, searchQuery, select, keydownWatcher, get Combobox() {
      return lt;
    }, get ComboboxInput() {
      return it;
    }, get ComboboxOption() {
      return rt;
    }, get ComboboxOptions() {
      return ut;
    }, computed, onBeforeUnmount, onMounted };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
_sfc_main$9.__file = "src/components/CommandPalette/CommandPalette.vue";
const _sfc_main$8 = {
  __name: "CommandPaletteItem",
  props: {
    item: { type: Object, required: true },
    active: { type: Boolean, default: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
_sfc_main$8.__file = "src/components/CommandPalette/CommandPaletteItem.vue";
const _sfc_main$7 = {};
const _hoisted_1$3 = {
  width: "16",
  height: "17",
  viewBox: "0 0 16 17",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function _sfc_render$5(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$3, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        d: "M2 4.5H14",
        stroke: "currentColor",
        "stroke-miterlimit": "10",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M4 8.5H12",
        stroke: "currentColor",
        "stroke-miterlimit": "10",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M6.5 12.5H9.5",
        stroke: "currentColor",
        "stroke-miterlimit": "10",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$7.__file = "src/components/ListFilter/FilterIcon.vue";
const FilterIcon = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$5], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListFilter/FilterIcon.vue"]]);
const _sfc_main$6 = {
  __name: "NestedPopover",
  props: {
    placement: {
      type: String,
      default: "bottom-start"
    }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const reference = ref(null);
    const popover = ref(null);
    let popper = ref(null);
    function setupPopper() {
      if (!popper.value) {
        popper.value = createPopper(reference.value.el, popover.value.el, {
          placement: props.placement
        });
      } else {
        popper.value.update();
      }
    }
    function updatePosition() {
      nextTick(() => setupPopper());
    }
    onBeforeUnmount(() => {
      var _a;
      (_a = popper.value) == null ? void 0 : _a.destroy();
    });
    const __returned__ = { props, reference, popover, get popper() {
      return popper;
    }, set popper(v) {
      popper = v;
    }, setupPopper, updatePosition, get Popover() {
      return ye;
    }, get PopoverButton() {
      return Ge;
    }, get PopoverPanel() {
      return je;
    }, get createPopper() {
      return createPopper;
    }, nextTick, ref, onBeforeUnmount };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Popover"], null, {
    default: withCtx(({ open }) => [
      createVNode(
        $setup["PopoverButton"],
        {
          as: "div",
          ref: "reference",
          onClick: $setup.updatePosition,
          onFocusin: $setup.updatePosition,
          onKeydown: $setup.updatePosition
        },
        {
          default: withCtx(({ open: open2 }) => [
            renderSlot(_ctx.$slots, "target", normalizeProps(guardReactiveProps({ open: open2 })))
          ]),
          _: 2
          /* DYNAMIC */
        },
        1536
        /* NEED_PATCH, DYNAMIC_SLOTS */
      ),
      withDirectives(createBaseVNode(
        "div",
        null,
        [
          createVNode(
            $setup["PopoverPanel"],
            {
              ref: "popover",
              static: "",
              class: "z-[100]"
            },
            {
              default: withCtx(({ open: open2, close }) => [
                renderSlot(_ctx.$slots, "body", normalizeProps(guardReactiveProps({ open: open2, close })))
              ]),
              _: 2
              /* DYNAMIC */
            },
            1536
            /* NEED_PATCH, DYNAMIC_SLOTS */
          )
        ],
        512
        /* NEED_PATCH */
      ), [
        [vShow, open]
      ])
    ]),
    _: 3
    /* FORWARDED */
  });
}
_sfc_main$6.__file = "src/components/ListFilter/NestedPopover.vue";
const NestedPopover = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$4], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListFilter/NestedPopover.vue"]]);
const _sfc_main$5 = {
  __name: "SearchComplete",
  props: {
    value: {
      type: String,
      required: false,
      default: ""
    },
    doctype: {
      type: String,
      required: true
    },
    searchField: {
      type: String,
      required: false,
      default: "name"
    },
    labelField: {
      type: String,
      required: false,
      default: "name"
    },
    valueField: {
      type: String,
      required: false,
      default: "name"
    },
    pageLength: {
      type: Number,
      required: false,
      default: 10
    }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    watch(
      () => props.doctype,
      (value) => {
        r.doctype = value;
        r.reload();
      }
    );
    const r = createListResource({
      doctype: props.doctype,
      pageLength: props.pageLength,
      cache: ["link_doctype", props.doctype],
      auto: true,
      fields: [props.labelField, props.searchField, props.valueField],
      onSuccess: () => {
        selection.value = props.value ? options.value.find((o) => o.value === props.value) : null;
      }
    });
    const options = computed(
      () => {
        var _a;
        return ((_a = r.data) == null ? void 0 : _a.map((result) => ({
          label: result[props.labelField],
          value: result[props.valueField]
        }))) || [];
      }
    );
    const selection = ref(null);
    function onUpdateQuery(query) {
      r.update({
        filters: {
          [props.searchField]: ["like", `%${query}%`]
        }
      });
      r.reload();
    }
    const __returned__ = { props, r, options, selection, onUpdateQuery, get Autocomplete() {
      return Autocomplete;
    }, get createListResource() {
      return createListResource;
    }, computed, ref, watch };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Autocomplete"], {
    placeholder: "Select an option",
    options: $setup.options,
    value: $setup.selection,
    "onUpdate:query": _cache[0] || (_cache[0] = (q) => $setup.onUpdateQuery(q)),
    onChange: _cache[1] || (_cache[1] = (v) => $setup.selection = v)
  }, null, 8, ["options", "value"]);
}
_sfc_main$5.__file = "src/components/ListFilter/SearchComplete.vue";
const SearchComplete = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$3], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListFilter/SearchComplete.vue"]]);
const _sfc_main$4 = {
  __name: "ListFilter",
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    docfields: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const typeCheck = ["Check"];
    const typeLink = ["Link"];
    const typeNumber = ["Float", "Int"];
    const typeSelect = ["Select"];
    const typeString = [
      "Data",
      "Long Text",
      "Small Text",
      "Text Editor",
      "Text",
      "JSON",
      "Code"
    ];
    const emits = __emit;
    const props = __props;
    const fields = computed(() => {
      const fields2 = props.docfields.filter((field) => {
        return !field.is_virtual && (typeCheck.includes(field.fieldtype) || typeLink.includes(field.fieldtype) || typeNumber.includes(field.fieldtype) || typeSelect.includes(field.fieldtype) || typeString.includes(field.fieldtype));
      }).map((field) => {
        return {
          label: field.label,
          value: field.fieldname,
          description: field.fieldtype,
          ...field
        };
      });
      return fields2;
    });
    const filters = computed({
      get: () => makeFiltersList(props.modelValue),
      set: (value) => emits("update:modelValue", makeFiltersDict(value))
    });
    function makeFiltersList(filtersDict) {
      return Object.entries(filtersDict).map(([fieldname, [operator, value]]) => {
        const field = getField(fieldname);
        return {
          fieldname,
          operator,
          value,
          field
        };
      });
    }
    function getField(fieldname) {
      return fields.value.find((f) => f.fieldname === fieldname);
    }
    function makeFiltersDict(filtersList) {
      return filtersList.reduce((acc, filter) => {
        const { fieldname, operator, value } = filter;
        acc[fieldname] = [operator, value];
        return acc;
      }, {});
    }
    function getOperators(fieldtype) {
      let options = [];
      if (typeString.includes(fieldtype) || typeLink.includes(fieldtype)) {
        options.push(
          ...[
            { label: "Equals", value: "=" },
            { label: "Not Equals", value: "!=" },
            { label: "Like", value: "like" },
            { label: "Not Like", value: "not like" }
          ]
        );
      }
      if (typeNumber.includes(fieldtype)) {
        options.push(
          ...[
            { label: "<", value: "<" },
            { label: ">", value: ">" },
            { label: "<=", value: "<=" },
            { label: ">=", value: ">=" },
            { label: "Equals", value: "=" },
            { label: "Not Equals", value: "!=" }
          ]
        );
      }
      if (typeSelect.includes(fieldtype)) {
        options.push(
          ...[
            { label: "Equals", value: "=" },
            { label: "Not Equals", value: "!=" }
          ]
        );
      }
      if (typeCheck.includes(fieldtype)) {
        options.push(...[{ label: "Equals", value: "=" }]);
      }
      return options;
    }
    function getDefaultOperator(fieldtype) {
      if (typeSelect.includes(fieldtype) || typeLink.includes(fieldtype) || typeCheck.includes(fieldtype) || typeNumber.includes(fieldtype)) {
        return "=";
      }
      return "like";
    }
    function getValueSelector(fieldtype, options) {
      if (typeSelect.includes(fieldtype) || typeCheck.includes(fieldtype)) {
        const _options = fieldtype == "Check" ? ["Yes", "No"] : getSelectOptions(options);
        return h(FormControl, {
          type: "select",
          options: _options
        });
      } else {
        return h(FormControl, { type: "text" });
      }
    }
    function getDefaultValue(field) {
      if (typeSelect.includes(field.fieldtype)) {
        return getSelectOptions(field.options)[0];
      }
      if (typeCheck.includes(field.fieldtype)) {
        return "Yes";
      }
      return "";
    }
    function getSelectOptions(options) {
      return options.split("\n");
    }
    function addFilter(fieldname) {
      const field = getField(fieldname);
      const filter = {
        fieldname,
        operator: getDefaultOperator(field.fieldtype),
        value: getDefaultValue(field),
        field
      };
      filters.value = [...filters.value, filter];
    }
    function removeFilter(index) {
      filters.value = filters.value.filter((_, i) => i !== index);
    }
    const __returned__ = { typeCheck, typeLink, typeNumber, typeSelect, typeString, emits, props, fields, filters, makeFiltersList, getField, makeFiltersDict, getOperators, getDefaultOperator, getValueSelector, getDefaultValue, getSelectOptions, addFilter, removeFilter, get Autocomplete() {
      return Autocomplete;
    }, get FeatherIcon() {
      return FeatherIcon;
    }, get FormControl() {
      return FormControl;
    }, computed, h, FilterIcon, NestedPopover, SearchComplete };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
_sfc_main$4.__file = "src/components/ListFilter/ListFilter.vue";
const _sfc_main$3 = {};
const _hoisted_1$2 = {
  width: "17",
  height: "16",
  viewBox: "0 0 17 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function _sfc_render$2(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$2, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        "fill-rule": "evenodd",
        "clip-rule": "evenodd",
        d: "M6.2641 1C5.5758 1 4.97583 1.46845 4.80889 2.1362L3.57555 7.06953C3.33887 8.01625 4.05491 8.93333 5.03077 8.93333H7.50682L6.72168 14.4293C6.68838 14.6624 6.82229 14.8872 7.04319 14.9689C7.26408 15.0507 7.51204 14.9671 7.63849 14.7684L13.2161 6.00354C13.6398 5.33782 13.1616 4.46667 12.3725 4.46667H9.59038L10.3017 1.62127C10.3391 1.4719 10.3055 1.31365 10.2108 1.19229C10.116 1.07094 9.97063 1 9.81666 1H6.2641ZM5.77903 2.37873C5.83468 2.15615 6.03467 2 6.2641 2H9.17627L8.46492 4.8454C8.42758 4.99477 8.46114 5.15302 8.55589 5.27437C8.65064 5.39573 8.79602 5.46667 8.94999 5.46667H12.3725L8.0395 12.2757L8.5783 8.50404C8.5988 8.36056 8.55602 8.21523 8.46105 8.10573C8.36608 7.99623 8.22827 7.93333 8.08332 7.93333H5.03077C4.70548 7.93333 4.4668 7.62764 4.5457 7.31207L5.77903 2.37873Z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$3.__file = "src/components/Billing/LightningIcon.vue";
const LightningIcon = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Billing/LightningIcon.vue"]]);
function request(_options) {
  let options = Object.assign({}, _options);
  if (!options.url) {
    throw new Error("[request] options.url is required");
  }
  if (options.transformRequest) {
    options = options.transformRequest(_options);
  }
  if (!options.responseType) {
    options.responseType = "json";
  }
  if (!options.method) {
    options.method = "GET";
  }
  let url = options.url;
  let body;
  if (options.params) {
    if (options.method === "GET") {
      let params = new URLSearchParams();
      for (let key in options.params) {
        params.append(key, options.params[key]);
      }
      url = options.url + "?" + params.toString();
    } else {
      body = JSON.stringify(options.params);
    }
  }
  return fetch(url, {
    method: options.method || "GET",
    headers: options.headers,
    body
  }).then((response) => {
    if (options.transformResponse) {
      return options.transformResponse(response, options);
    }
    if (response.status >= 200 && response.status < 300) {
      if (options.responseType === "json") {
        return response.json();
      }
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }).catch((error) => {
    if (options.transformError) {
      return options.transformError(error);
    }
    throw error;
  });
}
function saveLocal(key, data) {
  if (typeof indexedDB === "undefined") {
    return Promise.resolve(null);
  }
  if (!key) return Promise.resolve();
  return set(key, JSON.stringify(data));
}
function getLocal(key) {
  if (typeof indexedDB === "undefined") {
    return Promise.resolve(null);
  }
  return get(key).then((val) => val ? JSON.parse(val) : val);
}
let cached = {};
function createResource(options, vm) {
  let cacheKey = null;
  if (options.cache) {
    cacheKey = getCacheKey(options.cache);
    let cachedResource = cached[cacheKey];
    if (cachedResource) {
      if (cachedResource.auto) {
        cachedResource.reload();
      }
      return cachedResource;
    }
  }
  if (typeof options == "string") {
    options = {
      url: options,
      auto: true
    };
  }
  let fetchFunction = options.debounce ? debounce(fetch2, options.debounce) : fetch2;
  let out = reactive({
    method: options.method,
    url: options.url,
    data: options.initialData || null,
    previousData: null,
    loading: false,
    fetched: false,
    error: null,
    promise: null,
    auto: options.auto,
    params: null,
    fetch: fetchFunction,
    reload: fetchFunction,
    submit: fetchFunction,
    reset,
    update,
    setData
  });
  async function fetch2(params, tempOptions = {}) {
    let resourceFetcher = options.resourceFetcher || getConfig("resourceFetcher") || request;
    if (params instanceof Event) {
      params = null;
    }
    params = params || out.params;
    if (options.makeParams) {
      params = options.makeParams.call(vm, params);
    }
    out.params = params;
    out.previousData = out.data ? JSON.parse(JSON.stringify(out.data)) : null;
    out.loading = true;
    out.error = null;
    if (options.onFetch) {
      options.onFetch.call(vm, out.params);
    }
    let beforeSubmitFunctions = [options.beforeSubmit, tempOptions.beforeSubmit];
    for (let fn of beforeSubmitFunctions) {
      if (fn) {
        fn.call(vm, out.params);
      }
    }
    let validateFunction = tempOptions.validate || options.validate;
    let errorFunctions = [options.onError, tempOptions.onError];
    let successFunctions = [options.onSuccess, tempOptions.onSuccess];
    let dataFunctions = [options.onData, tempOptions.onData];
    if (validateFunction) {
      let invalidMessage;
      try {
        invalidMessage = await validateFunction.call(vm, out.params);
        if (invalidMessage && typeof invalidMessage == "string") {
          throw new Error(invalidMessage);
        }
      } catch (error) {
        handleError(error, errorFunctions);
        return;
      }
    }
    try {
      out.promise = resourceFetcher({
        ...options,
        params: params || options.params
      });
      let data = await out.promise;
      saveLocal(cacheKey, data);
      out.data = transform(data);
      out.fetched = true;
      for (let fn of successFunctions) {
        if (fn) {
          fn.call(vm, data);
        }
      }
      for (let fn of dataFunctions) {
        if (fn) {
          fn.call(vm, data);
        }
      }
    } catch (error) {
      handleError(error, errorFunctions);
    }
    out.loading = false;
    return out.data;
  }
  function update({ method, url, params, auto }) {
    if (method && method !== options.method) {
      out.method = method;
    }
    if (url && url !== options.url) {
      out.url = url;
    }
    if (params && params !== options.params) {
      out.params = params;
    }
    if (auto !== void 0 && auto !== out.auto) {
      out.auto = auto;
    }
  }
  function reset() {
    out.data = options.initialData || null;
    out.previousData = null;
    out.loading = false;
    out.fetched = false;
    out.error = null;
    out.params = null;
    out.auto = options.auto;
  }
  function handleError(error, errorFunctions) {
    out.loading = false;
    if (out.previousData) {
      out.data = out.previousData;
    }
    out.error = error;
    for (let fn of errorFunctions) {
      if (fn) {
        fn.call(vm, error);
      }
    }
    if (errorFunctions.every((fn) => fn == null)) {
      let errorHandler = getConfig("fallbackErrorHandler");
      if (errorHandler) {
        try {
          errorHandler(error);
        } catch (error2) {
          console.warn("Error in fallbackErrorHandler", error2);
        }
      }
    }
    throw error;
  }
  function setData(data) {
    if (typeof data === "function") {
      data = data.call(vm, out.data);
    }
    out.data = transform(data);
  }
  function transform(data) {
    if (options.transform) {
      let returnValue = options.transform.call(vm, data);
      if (returnValue != null) {
        return returnValue;
      }
    }
    return data;
  }
  if (cacheKey && !cached[cacheKey]) {
    cached[cacheKey] = out;
    getLocal(cacheKey).then((data) => {
      var _a;
      if ((out.loading || !out.fetched) && data) {
        setData(data);
        (_a = options.onData) == null ? void 0 : _a.call(vm, data);
      }
    });
  }
  if (options.auto) {
    out.fetch();
  }
  return out;
}
function getCacheKey(cacheKey) {
  if (!cacheKey) {
    return null;
  }
  if (typeof cacheKey === "string") {
    cacheKey = [cacheKey];
  }
  return JSON.stringify(cacheKey);
}
function onDocUpdate(socket, doctype, callback) {
  subscribe(socket, doctype);
  socket.on("list_update", (data) => {
    if (data.doctype == doctype) {
      callback(data.name);
    }
  });
}
let subscribed = {};
function subscribe(socket, doctype) {
  if (subscribed[doctype]) return;
  socket.emit("doctype_subscribe", doctype);
  subscribed[doctype] = true;
}
let listCache = reactive({});
let resourcesByDocType = {};
function createListResource(options, vm) {
  var _a, _b, _c, _d, _e;
  if (!options.doctype) {
    throw new Error("List resource requires doctype");
  }
  let cacheKey = getCacheKey(options.cache);
  if (cacheKey) {
    let cachedResource = listCache[cacheKey];
    if (cachedResource) {
      if (cachedResource.auto) {
        cachedResource.reload();
      }
      return cachedResource;
    }
  }
  let defaultListUrl = getConfig("defaultListUrl") || "frappe.client.get_list";
  let defaultDocInsertUrl = getConfig("defaultDocInsertUrl") || "frappe.client.insert";
  let defaultDocUpdateUrl = getConfig("defaultDocUpdateUrl") || "frappe.client.set_value";
  let defaultDocDeleteUrl = getConfig("defaultDocDeleteUrl") || "frappe.client.delete";
  let defaultRunDocMethodUrl = getConfig("defaultRunDocMethodUrl") || "run_doc_method";
  let out = reactive({
    doctype: options.doctype,
    fields: options.fields,
    filters: options.filters,
    orFilters: options.orFilters,
    orderBy: options.orderBy,
    start: options.start || 0,
    pageLength: options.pageLength || 20,
    groupBy: options.groupBy,
    parent: options.parent,
    debug: options.debug || 0,
    originalData: null,
    dataMap: {},
    data: null,
    previous,
    hasPreviousPage: false,
    next,
    hasNextPage: true,
    auto: options.auto,
    list: createResource(
      {
        url: options.url || defaultListUrl,
        makeParams() {
          return {
            doctype: out.doctype,
            fields: out.fields,
            filters: out.filters,
            or_filters: out.orFilters,
            order_by: out.orderBy,
            start: out.start,
            limit: out.pageLength,
            limit_start: out.start,
            limit_page_length: out.pageLength,
            group_by: out.groupBy,
            parent: out.parent,
            debug: out.debug
          };
        },
        onSuccess(data) {
          var _a2;
          out.hasPreviousPage = !!out.start;
          out.hasNextPage = data.length < out.pageLength ? false : true;
          let pagedData;
          if (!out.start || out.start == 0) {
            pagedData = data;
          } else if (out.start > 0) {
            pagedData = out.originalData.concat(data);
          }
          saveLocal(cacheKey, pagedData);
          setData(pagedData);
          (_a2 = options.onSuccess) == null ? void 0 : _a2.call(vm, out.data);
        },
        onError: options.onError
      },
      vm
    ),
    fetchOne: createResource(
      {
        url: options.url || defaultListUrl,
        makeParams(name) {
          return {
            doctype: out.doctype,
            fields: out.fields || "*",
            filters: { name }
          };
        },
        onSuccess(data) {
          var _a2, _b2;
          if (data.length > 0 && out.originalData) {
            let doc = data[0];
            updateRowInListResource(out.doctype, doc);
          }
          (_b2 = (_a2 = options.fetchOne) == null ? void 0 : _a2.onSuccess) == null ? void 0 : _b2.call(vm, out.data);
        },
        onError: (_a = options.fetchOne) == null ? void 0 : _a.onError
      },
      vm
    ),
    insert: createResource(
      {
        url: defaultDocInsertUrl,
        makeParams(values) {
          return {
            doc: {
              doctype: out.doctype,
              ...values
            }
          };
        },
        onSuccess(data) {
          var _a2, _b2;
          out.list.fetch();
          (_b2 = (_a2 = options.insert) == null ? void 0 : _a2.onSuccess) == null ? void 0 : _b2.call(vm, data);
        },
        onError: (_b = options.insert) == null ? void 0 : _b.onError
      },
      vm
    ),
    setValue: createResource(
      {
        url: defaultDocUpdateUrl,
        makeParams(options2) {
          let { name, ...values } = options2;
          return {
            doctype: out.doctype,
            name,
            fieldname: values
          };
        },
        onSuccess(doc) {
          var _a2, _b2;
          updateRowInListResource(out.doctype, doc);
          (_b2 = (_a2 = options.setValue) == null ? void 0 : _a2.onSuccess) == null ? void 0 : _b2.call(vm, doc);
        },
        onError: (_c = options.setValue) == null ? void 0 : _c.onError
      },
      vm
    ),
    delete: createResource(
      {
        url: defaultDocDeleteUrl,
        makeParams(name) {
          return {
            doctype: out.doctype,
            name
          };
        },
        onSuccess(data) {
          var _a2, _b2;
          out.list.fetch();
          (_b2 = (_a2 = options.delete) == null ? void 0 : _a2.onSuccess) == null ? void 0 : _b2.call(vm, data);
        },
        onError: (_d = options.delete) == null ? void 0 : _d.onError
      },
      vm
    ),
    runDocMethod: createResource(
      {
        url: defaultRunDocMethodUrl,
        makeParams({ method, name, ...values }) {
          return {
            dt: out.doctype,
            dn: name,
            method,
            args: values
          };
        },
        onSuccess(data) {
          var _a2, _b2;
          if (data.docs) {
            for (let doc of data.docs) {
              updateRowInListResource(doc.doctype, doc);
            }
          }
          (_b2 = (_a2 = options.runDocMethod) == null ? void 0 : _a2.onSuccess) == null ? void 0 : _b2.call(vm, data);
        },
        onError: (_e = options.runDocMethod) == null ? void 0 : _e.onError
      },
      vm
    ),
    update,
    fetch: fetch2,
    reload,
    setData,
    transform,
    getRow
  });
  function update(updatedOptions) {
    Object.assign(out, updatedOptions);
  }
  function transform(data) {
    if (options.transform) {
      let returnValue = options.transform.call(vm, data);
      if (returnValue != null) {
        return returnValue;
      }
    }
    return data;
  }
  function reload() {
    let _start = out.start;
    let _pageLength = out.pageLength;
    if (out.start > 0) {
      out.start = 0;
      out.pageLength = out.originalData.length;
    }
    return out.list.fetch().finally(() => {
      out.start = _start;
      out.pageLength = _pageLength;
    });
  }
  function fetch2() {
    reload();
  }
  function setData(data) {
    out.originalData = data;
    if (typeof data === "function") {
      data = data.call(vm, out.data);
    }
    out.data = transform(data);
    if (Array.isArray(out.data)) {
      out.dataMap = {};
      for (let row of out.data) {
        if (!row.name) continue;
        let key = row.name.toString();
        out.dataMap[key] = row;
      }
    }
  }
  function previous() {
    out.start = out.start - out.pageLength;
    out.list.fetch();
  }
  function next() {
    out.start = out.start + out.pageLength;
    out.list.fetch();
  }
  function getRow(name) {
    let key = name.toString();
    return out.dataMap[key];
  }
  if (options.realtime && (vm == null ? void 0 : vm.$socket)) {
    onDocUpdate(vm.$socket, out.doctype, (name) => {
      var _a2;
      if ((_a2 = out.originalData) == null ? void 0 : _a2.find((d) => d.name === name)) {
        out.fetchOne.submit(name);
      }
    });
  }
  if (cacheKey) {
    listCache[cacheKey] = out;
    getLocal(cacheKey).then((data) => {
      var _a2;
      if ((out.list.loading || !out.list.fetched) && data) {
        setData(data);
        (_a2 = options.onData) == null ? void 0 : _a2.call(vm, data);
      }
    });
  }
  if (options.auto) {
    out.list.fetch();
  }
  resourcesByDocType[out.doctype] = resourcesByDocType[out.doctype] || [];
  resourcesByDocType[out.doctype].push(out);
  return out;
}
function updateRowInListResource(doctype, doc) {
  if (!doc.name) return;
  let resources = resourcesByDocType[doctype] || [];
  for (let resource of resources) {
    if (resource.originalData) {
      for (let row of resource.originalData) {
        if (row.name && row.name == doc.name) {
          delete row._previousData;
          let previousRowData = JSON.stringify(row);
          for (let key in row) {
            if (key in doc) {
              row[key] = doc[key];
            }
          }
          row._previousData = previousRowData;
        }
      }
      resource.data = resource.transform(resource.originalData);
    }
  }
}
reactive({});
const trialMessage = "Upgrade to a paid plan for uninterrupted services";
const _sfc_main$2 = {
  __name: "TrialBanner",
  props: {
    isSidebarCollapsed: {
      type: Boolean,
      default: false
    }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const trialEndDays = ref(0);
    const showBanner = ref(false);
    const trialTitle = computed(() => {
      return trialEndDays.value > 1 ? "Trial ends in " + trialEndDays.value + " days" : "Trial will end tomorrow";
    });
    createResource({
      url: "frappe.integrations.frappe_providers.frappecloud_billing.current_site_info",
      cache: "currentSiteInfo",
      auto: true,
      onSuccess: (data) => {
        trialEndDays.value = calculateTrialEndDays(data.trial_end_date);
        showBanner.value = window.setup_complete && data.plan.is_trial_plan && trialEndDays.value > 0;
      }
    });
    function calculateTrialEndDays(trialEndDate) {
      if (!trialEndDate) return 0;
      trialEndDate = new Date(trialEndDate);
      const today = /* @__PURE__ */ new Date();
      const diffTime = trialEndDate - today;
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      return diffDays;
    }
    function openBillingPage() {
      window.location.href = "/billing";
    }
    const __returned__ = { props, trialEndDays, showBanner, trialTitle, trialMessage, calculateTrialEndDays, openBillingPage, LightningIcon, FeatherIcon, get Button() {
      return Button;
    }, get createResource() {
      return createResource;
    }, ref, computed };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
_sfc_main$2.__file = "src/components/Billing/TrialBanner.vue";
let faviconRef = document.querySelector('link[rel="icon"]');
faviconRef == null ? void 0 : faviconRef.href;
class IDBStore {
  constructor() {
    __publicField(this, "memoryStore", {});
    __publicField(this, "useIndexedDB");
    this.useIndexedDB = typeof window !== "undefined" && !!window.indexedDB;
  }
  set(key, data) {
    if (!this.validateKey(key)) {
      return Promise.resolve(null);
    }
    try {
      if (this.useIndexedDB) {
        return set(key, JSON.stringify(data));
      }
      this.memoryStore[key] = JSON.stringify(data);
      return Promise.resolve();
    } catch (error) {
      return this.handleError(error, "save to");
    }
  }
  setMany(data) {
    try {
      if (this.useIndexedDB) {
        let entries = [];
        for (const [key, value] of Object.entries(data)) {
          entries.push([key, JSON.stringify(value)]);
        }
        return setMany(entries);
      }
      for (const [key, value] of Object.entries(data)) {
        this.memoryStore[key] = JSON.stringify(value);
      }
      return Promise.resolve();
    } catch (error) {
      return this.handleError(error, "save to");
    }
  }
  delete(key) {
    if (!this.validateKey(key)) {
      return Promise.resolve(null);
    }
    try {
      if (this.useIndexedDB) {
        return del(key);
      }
      delete this.memoryStore[key];
      return Promise.resolve();
    } catch (error) {
      return this.handleError(error, "delete from");
    }
  }
  get(key) {
    if (!this.validateKey(key)) {
      return Promise.resolve(null);
    }
    if (this.useIndexedDB) {
      return get(key).then((val) => {
        if (!val) return null;
        try {
          return JSON.parse(val);
        } catch (error) {
          return this.handleError(error, "parse data from");
        }
      });
    }
    try {
      const val = this.memoryStore[key];
      return Promise.resolve(val ? JSON.parse(val) : null);
    } catch (error) {
      return this.handleError(error, "parse data from");
    }
  }
  async keys() {
    try {
      if (this.useIndexedDB) {
        return keys();
      }
      return Promise.resolve(Object.keys(this.memoryStore));
    } catch (error) {
      console.error(
        `Failed to get keys from ${this.useIndexedDB ? "IndexedDB" : "memory store"}:`,
        error
      );
      return Promise.resolve([]);
    }
  }
  validateKey(key) {
    return !!key;
  }
  handleError(error, operation) {
    console.error(
      `Failed to ${operation} ${this.useIndexedDB ? "IndexedDB" : "memory store"}:`,
      error
    );
    return Promise.resolve(null);
  }
}
let idbStore = new IDBStore();
class DocStore {
  constructor() {
    __publicField(this, "docs");
    __publicField(this, "lastFetched");
    __publicField(this, "cacheTimeout", 5 * 60 * 1e3);
    // 5 minutes
    __publicField(this, "storePrefix", "doc:");
    this.docs = /* @__PURE__ */ new Map();
    this.lastFetched = /* @__PURE__ */ new Map();
  }
  setCacheTimeout(minutes) {
    if (minutes < 1) {
      throw new Error("Cache timeout must be at least 1 minute");
    }
    this.cacheTimeout = minutes * 60 * 1e3;
  }
  async setDoc(doc) {
    if (!(doc == null ? void 0 : doc.doctype) || !(doc == null ? void 0 : doc.name)) {
      throw new Error("Invalid doc: must have doctype and name");
    }
    doc.name = doc.name.toString();
    const key = this.getKey(doc.doctype, doc.name);
    try {
      await idbStore.set(this.storePrefix + key, doc);
      if (!this.docs.has(key)) {
        this.docs.set(key, ref(null));
      }
      const docRef = this.docs.get(key);
      if (docRef) {
        docRef.value = doc;
      }
      this.lastFetched.set(key, Date.now());
    } catch (error) {
      console.error("Failed to set doc in IDB:", error);
      throw error;
    }
  }
  getDoc(doctype, name) {
    const nameStr = toValue(name);
    if (!doctype || !nameStr) {
      throw new Error("doctype and name are required");
    }
    const key = this.getKey(doctype, nameStr);
    if (!this.docs.has(key)) {
      this.docs.set(key, ref(null));
      this.loadDoc(key, true);
    } else if (this.isStale(key)) {
      this.loadDoc(key, false);
    }
    return this.docs.get(key);
  }
  async loadDoc(key, isFirstLoad) {
    try {
      if (!isFirstLoad && this.isStale(key)) {
        await this.cleanup(key);
      }
      const idbDoc = await idbStore.get(this.storePrefix + key);
      if (idbDoc) {
        const docRef = this.docs.get(key);
        if (docRef) {
          docRef.value = idbDoc;
        }
        this.lastFetched.set(key, Date.now());
      }
    } catch (error) {
      console.error("Failed to load doc from IDB:", error);
      throw error;
    }
  }
  async setDocs(docs) {
    const docMap = {};
    for (const doc of docs) {
      if (!(doc == null ? void 0 : doc.doctype) || !(doc == null ? void 0 : doc.name)) continue;
      doc.name = doc.name.toString();
      const key = this.getKey(doc.doctype, doc.name);
      if (!this.docs.has(key)) {
        this.docs.set(key, ref(null));
      }
      const docRef = this.docs.get(key);
      if (docRef) {
        docRef.value = doc;
      }
      this.lastFetched.set(key, Date.now());
      docMap[this.storePrefix + key] = doc;
    }
    await idbStore.setMany(docMap);
  }
  async invalidateDoc(doctype, name) {
    if (!doctype || !name) return;
    const key = this.getKey(doctype, name);
    await this.cleanup(key);
  }
  removeDoc(doctype, name) {
    return this.invalidateDoc(doctype, name);
  }
  getKey(doctype, name) {
    return `${doctype.trim()}/${name.trim()}`;
  }
  isStale(key) {
    const fetchTime = this.lastFetched.get(key);
    if (!fetchTime) return true;
    return Date.now() - fetchTime > this.cacheTimeout;
  }
  async cleanup(key) {
    this.docs.delete(key);
    this.lastFetched.delete(key);
    await idbStore.delete(this.storePrefix + key);
  }
  async clearAll() {
    try {
      const allKeys = await idbStore.keys();
      const docKeys = allKeys.filter(
        (key) => key.startsWith(this.storePrefix)
      );
      await Promise.all(docKeys.map((key) => idbStore.delete(key)));
      this.docs.clear();
      this.lastFetched.clear();
    } catch (error) {
      console.error("Failed to clear all docs:", error);
      throw error;
    }
  }
}
const docStore = new DocStore();
class ListStore {
  constructor() {
    __publicField(this, "byDocType");
    this.byDocType = {};
  }
  addList(doctype, list) {
    this.ensureList(doctype);
    this.byDocType[doctype].push(list);
  }
  updateRows(docs) {
    for (let doc of docs) {
      this.updateRow(doc.doctype, doc);
    }
  }
  updateRow(doctype, doc) {
    this.ensureList(doctype);
    this.byDocType[doctype].forEach((list) => {
      list.updateRow(doc);
    });
  }
  removeRow(doctype, name) {
    this.ensureList(doctype);
    this.byDocType[doctype].forEach((list) => {
      list.removeRow(name);
    });
  }
  ensureList(docType) {
    if (!this.byDocType[docType]) {
      this.byDocType[docType] = [];
    }
  }
}
const listStore = new ListStore();
createFetch({
  options: {
    fetch: (...args) => fetch(...args),
    // required for vitest
    beforeFetch({ options }) {
      options.headers = setHeaders(options.headers || {});
      return { options };
    },
    afterFetch(ctx) {
      let responseData = JSON.parse(ctx.data);
      if (responseData.debug) {
        let path = ctx.response.url.replace(window.location.origin, "");
        console.group(path);
        for (let d of responseData.debug) {
          console.log(d == null ? void 0 : d.message);
        }
        console.groupEnd();
      }
      if (responseData.docs) {
        let docs = responseData.docs;
        for (let doc of docs) {
          doc.name = doc.name.toString();
        }
        docStore.setDocs(docs);
        listStore.updateRows(docs);
      }
      ctx.data = responseData.data;
      return ctx;
    },
    onFetchError(ctx) {
      var _a;
      if (((_a = ctx.response) == null ? void 0 : _a.ok) && ctx.error) {
        console.error(
          "Fetch request succeeded but there was a programming error:\n\n",
          ctx.error
        );
        return ctx;
      }
      let errors = [];
      try {
        errors = JSON.parse(ctx.data).errors;
      } catch (e) {
        errors = [
          {
            title: "Internal Server Error",
            message: "Internal Server Error",
            type: "ServerError",
            indicator: "red"
          }
        ];
      }
      let error = errors[0];
      let errorDescription = error.message ? `: ${error.message}` : error.exception ? ` (Traceback)` : "";
      let frappeError = new Error(`${error.type}${errorDescription}`);
      frappeError.title = error.title;
      frappeError.type = error.type;
      frappeError.exception = error.exception;
      if (error.exception) {
        console.log(error.exception);
      }
      ctx.error = frappeError;
      return ctx;
    }
  }
});
function setHeaders(headers) {
  let siteName = null;
  let csrfToken = null;
  if (typeof window !== "undefined") {
    siteName = window.location.hostname;
    csrfToken = window.csrf_token !== "{{ csrf_token }}" ? window.csrf_token : null;
  }
  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8"
  };
  if (siteName) {
    defaultHeaders["X-Frappe-Site-Name"] = siteName;
  }
  if (csrfToken) {
    defaultHeaders["X-Frappe-CSRF-Token"] = csrfToken;
  }
  return { ...headers, ...defaultHeaders };
}
const _sfc_main$1 = {
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
      return getValue(props.item).label || "";
    });
    function getValue(value) {
      if (value && typeof value === "object") {
        return value;
      }
      return { label: value };
    }
    const list = inject("list");
    const __returned__ = { props, label, getValue, list, computed, inject, get Tooltip() {
      return Tooltip;
    }, get alignmentMap() {
      return alignmentMap;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$1 = { class: "truncate text-base" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(
    resolveDynamicComponent($setup.list.options.showTooltip ? $setup.Tooltip : "div"),
    normalizeProps(guardReactiveProps($setup.list.options.showTooltip ? { text: $setup.label } : {})),
    {
      default: withCtx(() => [
        createBaseVNode(
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
            renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({ label: $setup.label })), () => {
              var _a;
              return [
                createBaseVNode(
                  "div",
                  _hoisted_1$1,
                  toDisplayString(((_a = $props.column) == null ? void 0 : _a.getLabel) ? $props.column.getLabel({ row: $props.row }) : $setup.label),
                  1
                  /* TEXT */
                )
              ];
            }),
            renderSlot(_ctx.$slots, "suffix")
          ],
          2
          /* CLASS */
        )
      ]),
      _: 3
      /* FORWARDED */
    },
    16
    /* FULL_PROPS */
  );
}
_sfc_main$1.__file = "src/components/ListView/ListRowItem.vue";
const ListRowItem = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListRowItem.vue"]]);
const _sfc_main = {
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
    const isHoverable = computed(() => {
      return list.value.options.getRowRoute || list.value.options.onRowClick;
    });
    const rowHeight = computed(() => {
      if (typeof list.value.options.rowHeight === "number") {
        return `${list.value.options.rowHeight}px`;
      }
      return list.value.options.rowHeight;
    });
    const __returned__ = { props, list, isLastRow, isSelected, isHoverable, rowHeight, Checkbox, ListRowItem, get alignmentMap() {
      return alignmentMap;
    }, get getGridTemplateColumns() {
      return getGridTemplateColumns;
    }, computed, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1 = {
  key: 0,
  class: "mx-2 h-px border-t border-outline-gray-1"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(resolveDynamicComponent($setup.list.options.getRowRoute ? "router-link" : "div"), mergeProps({
    class: [{ "cursor-pointer": $setup.isHoverable }, "flex flex-col transition-all duration-300 ease-in-out"]
  }, {
    to: $setup.list.options.getRowRoute ? $setup.list.options.getRowRoute($props.row) : void 0,
    onClick: $setup.list.options.onRowClick ? () => $setup.list.options.onRowClick($props.row) : void 0
  }), {
    default: withCtx(() => [
      (openBlock(), createBlock(resolveDynamicComponent($setup.list.options.getRowRoute ? "template" : "button"), { class: "[all:unset] hover:[all:unset]" }, {
        default: withCtx(() => [
          createBaseVNode(
            "div",
            {
              class: normalizeClass(["grid items-center space-x-4 rounded px-2", [
                $setup.isSelected ? "bg-surface-gray-2" : "",
                $setup.isHoverable ? $setup.isSelected ? "hover:bg-surface-gray-3" : "hover:bg-surface-menu-bar" : ""
              ]]),
              style: normalizeStyle({
                height: $setup.rowHeight,
                gridTemplateColumns: $setup.getGridTemplateColumns(
                  $setup.list.columns,
                  $setup.list.options.selectable
                )
              })
            },
            [
              $setup.list.options.selectable ? (openBlock(), createBlock($setup["Checkbox"], {
                key: 0,
                modelValue: $setup.list.selections.has($props.row[$setup.list.rowKey]),
                onClick: _cache[0] || (_cache[0] = withModifiers(($event) => $setup.list.toggleRow($props.row[$setup.list.rowKey]), ["stop"])),
                class: "cursor-pointer duration-300"
              }, null, 8, ["modelValue"])) : createCommentVNode("v-if", true),
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
                      renderSlot(_ctx.$slots, "default", mergeProps({ ref_for: true }, { idx: i, column, item: $props.row[column.key] }), () => [
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
            6
            /* CLASS, STYLE */
          ),
          !$setup.isLastRow ? (openBlock(), createElementBlock("div", _hoisted_1)) : createCommentVNode("v-if", true)
        ]),
        _: 3
        /* FORWARDED */
      }))
    ]),
    _: 3
    /* FORWARDED */
  }, 16, ["class"]);
}
_sfc_main.__file = "src/components/ListView/ListRow.vue";
const ListRow = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListRow.vue"]]);
export {
  ListHeader as L,
  ListHeaderItem as a,
  ListRow as b,
  ListRowItem as c,
  ListRows as d,
  ListSelectBanner as e,
  ListView as f
};
