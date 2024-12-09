import { az as ref, aQ as computed, aR as useDebounceFn, aS as inject, aB as openBlock, aG as createElementBlock, aF as createBaseVNode, aT as renderSlot, aU as normalizeProps, aV as guardReactiveProps, aN as toDisplayString, aW as normalizeClass, aL as mergeProps, aH as createCommentVNode, aC as createBlock, aX as withModifiers, aK as Fragment, aJ as renderList, aY as normalizeStyle, ay as defineComponent, aA as resolveComponent, aE as createVNode, aM as createTextVNode, aZ as Node, a_ as mergeAttributes, a$ as nodeInputRule, b0 as Plugin, b1 as Mention, b2 as VueRenderer, b3 as tippy, aD as withCtx, b4 as resolveDynamicComponent, b5 as withDirectives, b6 as vShow, Z as defineAsyncComponent, _ as __vitePreload, b7 as BubbleMenu, b8 as FloatingMenu, b9 as showdown, ba as EditorContent, bb as computed$1, bc as Editor, bd as StarterKit, be as Table$1, bf as TableRow, bg as TableHeader, bh as TableCell, bi as Typography, bj as TextAlign, bk as TextStyle, bl as Color, bm as Highlight, bn as Link$1, bo as Placeholder, bp as DOMParser, bq as Transition, br as useSlots, aI as reactive, bs as watch, bt as provide, bu as onMounted, bv as onBeforeUnmount, bw as lt, bx as it, by as rt, bz as ut, bA as ye, bB as Ge, bC as je, bD as createPopper, bE as nextTick, aP as h, bF as set, bG as get } from "./vendor-e88d1662.js";
import { A as Avatar } from "./Avatar-cfa1d25e.js";
import { B as Badge } from "./Badge-dca782e9.js";
import { L as LoadingIndicator, B as Button } from "./Button-992731ef.js";
import { F as FeatherIcon } from "./FeatherIcon-69703505.js";
import { C as Checkbox } from "./Checkbox-a9a36550.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
import { A as Autocomplete } from "./Autocomplete-b9abfdc4.js";
import "./Breadcrumbs-0c6286c2.js";
import { g as getConfig } from "./DateRangePicker-1c0cbaf0.js";
import { D as Dialog } from "./Dialog-019c142a.js";
import "./Dropdown-46fc2b89.js";
import "./ErrorMessage-0369058a.js";
import "./FileUploader-58796327.js";
import { F as FormControl } from "./FormControl-aa196c3f.js";
import "./Progress-081a62c6.js";
import { P as Popover } from "./Popover-f6af0041.js";
import "./Rating-b4c5359b.js";
import "./Select-f64a6a0d.js";
import "./Spinner-36d77baf.js";
import "./Switch-12fa64a9.js";
import { T as TabButtons } from "./TabButtons-e488cd1c.js";
import "./Tabs-749cd935.js";
import "./TextInput-7dab3a3b.js";
import "./Textarea-52e867af.js";
import { T as Tooltip } from "./Tooltip-4b29ee29.js";
import "./Calendar-0d22e329.js";
import "./CircularProgressBar-7d6ec4f5.js";
import "./Tree-01e78bc6.js";
import { d as debounce } from "./debounce-d11286cd.js";
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
const _sfc_main$$ = {
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
const _hoisted_1$G = { class: "truncate" };
const _hoisted_2$7 = {
  ref: "resizer",
  class: "h-full w-[2px] rounded-full transition-all duration-300 ease-in-out group-hover:bg-gray-400"
};
function _sfc_render$L(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    "div",
    {
      ref: "columnRef",
      class: normalizeClass(["group flex items-center", $props.item.align ? $setup.alignmentMap[$props.item.align] : "justify-between"])
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
              _hoisted_1$G,
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
            class: "flex h-4 w-2 cursor-col-resize justify-center",
            onMousedown: $setup.startResizing
          },
          [
            createBaseVNode(
              "div",
              _hoisted_2$7,
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
_sfc_main$$.__file = "src/components/ListView/ListHeaderItem.vue";
const ListHeaderItem = /* @__PURE__ */ _export_sfc(_sfc_main$$, [["render", _sfc_render$L], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListHeaderItem.vue"]]);
const _sfc_main$_ = {
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
function _sfc_render$K(_ctx, _cache, $props, $setup, $data, $options) {
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
_sfc_main$_.__file = "src/components/ListView/ListHeader.vue";
const ListHeader = /* @__PURE__ */ _export_sfc(_sfc_main$_, [["render", _sfc_render$K], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListHeader.vue"]]);
const _sfc_main$Z = /* @__PURE__ */ defineComponent({
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
_sfc_main$Z.__file = "src/components/Alert.vue";
const _sfc_main$Y = {
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
const _hoisted_1$F = { class: "flex items-center text-base text-ink-gray-4" };
function _sfc_render$J(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_LoadingIndicator = resolveComponent("LoadingIndicator");
  return openBlock(), createElementBlock("div", _hoisted_1$F, [
    createVNode(_component_LoadingIndicator, { class: "-ml-1 mr-2 h-3 w-3" }),
    createTextVNode(
      " " + toDisplayString($props.text),
      1
      /* TEXT */
    )
  ]);
}
_sfc_main$Y.__file = "src/components/LoadingText.vue";
const LoadingText = /* @__PURE__ */ _export_sfc(_sfc_main$Y, [["render", _sfc_render$J], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/LoadingText.vue"]]);
const _sfc_main$X = {
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
_sfc_main$X.__file = "src/components/Card.vue";
const _sfc_main$W = {
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
_sfc_main$W.__file = "src/components/ConfirmDialog.vue";
const dialogs = ref([]);
const _sfc_main$V = {
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
_sfc_main$V.__file = "src/components/Dialogs.vue";
const _sfc_main$U = /* @__PURE__ */ defineComponent({
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
_sfc_main$U.__file = "src/components/Divider.vue";
const _sfc_main$T = {};
_sfc_main$T.__file = "src/components/GreenCheckIcon.vue";
const _sfc_main$S = {
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
_sfc_main$S.__file = "src/components/Link.vue";
const _sfc_main$R = {
  name: "ListItem",
  props: ["title", "subtitle"],
  computed: {
    secondaryText() {
      let text = this.subtitle || "";
      return text.replace("\n", "<br>");
    }
  }
};
_sfc_main$R.__file = "src/components/ListItem.vue";
const _sfc_main$Q = {
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
_sfc_main$Q.__file = "src/components/Resource.vue";
const fileToBase64 = (file) => {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
};
const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;
const Image$1 = Node.create({
  name: "image",
  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {}
    };
  },
  inline() {
    return this.options.inline;
  },
  group() {
    return this.options.inline ? "inline" : "block";
  },
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null
      },
      alt: {
        default: null
      },
      title: {
        default: null
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "img[src]"
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },
  addCommands() {
    return {
      setImage: (options) => ({ commands: commands2 }) => {
        return commands2.insertContent({
          type: this.name,
          attrs: options
        });
      }
    };
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: (match) => {
          const [, , alt, src, title] = match;
          return { src, alt, title };
        }
      })
    ];
  },
  addProseMirrorPlugins() {
    return [dropImagePlugin()];
  }
});
const dropImagePlugin = () => {
  return new Plugin({
    props: {
      handlePaste(view, event, slice) {
        var _a;
        const items = Array.from(((_a = event.clipboardData) == null ? void 0 : _a.items) || []);
        const { schema } = view.state;
        items.forEach((item) => {
          const image = item.getAsFile();
          if (!image)
            return;
          if (item.type.indexOf("image") === 0) {
            event.preventDefault();
            fileToBase64(image).then((base64) => {
              const node = schema.nodes.image.create({
                src: base64
              });
              const transaction = view.state.tr.replaceSelectionWith(node);
              view.dispatch(transaction);
            });
          }
        });
        return false;
      },
      handleDOMEvents: {
        drop: (view, event) => {
          var _a;
          const hasFiles = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length;
          if (!hasFiles) {
            return false;
          }
          const images = Array.from(((_a = event.dataTransfer) == null ? void 0 : _a.files) ?? []).filter(
            (file) => /image/i.test(file.type)
          );
          if (images.length === 0) {
            return false;
          }
          event.preventDefault();
          const { schema } = view.state;
          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY
          });
          if (!coordinates)
            return false;
          images.forEach(async (image) => {
            fileToBase64(image).then((base64) => {
              const node = schema.nodes.image.create({
                src: base64
              });
              const transaction = view.state.tr.insert(coordinates.pos, node);
              view.dispatch(transaction);
            });
          });
          return true;
        }
      }
    }
  });
};
const Video$1 = Node.create({
  name: "video",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,
  addAttributes() {
    return {
      src: {
        default: null
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "video"
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["video", mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ({ editor, node }) => {
      const div = document.createElement("div");
      div.className = "relative aspect-w-16 aspect-h-9" + (editor.isEditable ? " cursor-pointer" : "");
      const video = document.createElement("video");
      if (editor.isEditable) {
        video.className = "pointer-events-none";
        video.controls = true;
      }
      video.src = node.attrs.src;
      if (!editor.isEditable) {
        video.setAttribute("controls", "");
      } else {
        let videoPill = document.createElement("div");
        videoPill.className = "absolute top-0 right-0 text-xs m-2 bg-surface-gray-6 text-ink-white px-2 py-1 rounded-md";
        videoPill.innerHTML = "Video";
        div.append(videoPill);
      }
      div.append(video);
      return {
        dom: div
      };
    };
  }
});
const MentionList_vue_vue_type_style_index_0_lang = "";
const _sfc_main$P = {
  props: {
    items: {
      type: Array,
      required: true
    },
    command: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      selectedIndex: 0
    };
  },
  watch: {
    items() {
      this.selectedIndex = 0;
    }
  },
  methods: {
    onKeyDown({ event }) {
      if (event.key === "ArrowUp") {
        this.upHandler();
        return true;
      }
      if (event.key === "ArrowDown") {
        this.downHandler();
        return true;
      }
      if (event.key === "Enter") {
        this.enterHandler();
        return true;
      }
      return false;
    },
    upHandler() {
      this.selectedIndex = (this.selectedIndex + this.items.length - 1) % this.items.length;
    },
    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
    },
    enterHandler() {
      this.selectItem(this.selectedIndex);
    },
    selectItem(index) {
      const item = this.items[index];
      if (item) {
        this.command({ id: item.value, label: item.label });
      }
    }
  }
};
const _hoisted_1$E = {
  key: 0,
  class: "min-w-40 rounded-lg border bg-surface-white p-1 text-base shadow-lg"
};
const _hoisted_2$6 = ["onClick", "onMouseover"];
function _sfc_render$I(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    $props.items.length ? (openBlock(), createElementBlock("div", _hoisted_1$E, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($props.items, (item, index) => {
          return openBlock(), createElementBlock("button", {
            class: normalizeClass([
              index === $data.selectedIndex ? "bg-surface-gray-2" : "",
              "flex w-full items-center whitespace-nowrap rounded-md px-2 py-2 text-sm text-ink-gray-9"
            ]),
            key: index,
            onClick: ($event) => $options.selectItem(index),
            onMouseover: ($event) => $data.selectedIndex = index
          }, toDisplayString(item.label), 43, _hoisted_2$6);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ])) : createCommentVNode("v-if", true)
  ]);
}
_sfc_main$P.__file = "src/components/TextEditor/MentionList.vue";
const MentionList = /* @__PURE__ */ _export_sfc(_sfc_main$P, [["render", _sfc_render$I], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/MentionList.vue"]]);
function configureMention(options) {
  return Mention.configure({
    HTMLAttributes: {
      class: "mention"
    },
    suggestion: getSuggestionOptions(options)
  });
}
function getSuggestionOptions(options) {
  return {
    items: ({ query }) => {
      return options.filter(
        (item) => item.label.toLowerCase().startsWith(query.toLowerCase())
      ).slice(0, 10);
    },
    render: () => {
      let component;
      let popup;
      return {
        onStart: (props) => {
          component = new VueRenderer(MentionList, {
            props,
            editor: props.editor
          });
          if (!props.clientRect) {
            return;
          }
          popup = tippy("body", {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start"
          });
        },
        onUpdate(props) {
          component.updateProps(props);
          if (!props.clientRect) {
            return;
          }
          popup[0].setProps({
            getReferenceClientRect: props.clientRect
          });
        },
        onKeyDown(props) {
          var _a;
          if (props.event.key === "Escape") {
            popup[0].hide();
            return true;
          }
          return (_a = component.ref) == null ? void 0 : _a.onKeyDown(props);
        },
        onExit() {
          popup[0].destroy();
          component.destroy();
        }
      };
    }
  };
}
const _sfc_main$O = {
  name: "TipTapMenu",
  props: ["buttons"],
  inject: ["editor"],
  components: {
    Popover
  },
  methods: {
    onButtonClick(button) {
      button.action(this.editor);
    }
  }
};
const _hoisted_1$D = { class: "inline-flex bg-surface-white px-1 py-1" };
const _hoisted_2$5 = { class: "inline-flex items-center gap-1" };
const _hoisted_3$4 = {
  key: 0,
  class: "h-4 w-[2px] border-l"
};
const _hoisted_4$1 = {
  key: 1,
  class: "shrink-0"
};
const _hoisted_5$1 = ["onClick", "set"];
const _hoisted_6 = { key: 1 };
const _hoisted_7 = { class: "rounded border bg-surface-white p-1 shadow-md" };
const _hoisted_8 = { class: "w-full" };
const _hoisted_9 = ["onClick"];
const _hoisted_10 = ["onClick", "title"];
const _hoisted_11 = {
  key: 1,
  class: "inline-block h-4 min-w-[1rem] text-sm leading-4"
};
function _sfc_render$H(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Popover = resolveComponent("Popover");
  return openBlock(), createElementBlock("div", _hoisted_1$D, [
    createBaseVNode("div", _hoisted_2$5, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($props.buttons, (button) => {
          return openBlock(), createElementBlock(
            Fragment,
            {
              key: button.label
            },
            [
              button.type === "separator" ? (openBlock(), createElementBlock("div", _hoisted_3$4)) : button.map ? (openBlock(), createElementBlock("div", _hoisted_4$1, [
                createVNode(
                  _component_Popover,
                  null,
                  {
                    target: withCtx(({ togglePopover }) => [
                      createBaseVNode("button", {
                        class: "rounded px-2 py-1 text-base font-medium text-ink-gray-8 transition-colors hover:bg-surface-gray-2",
                        onClick: togglePopover,
                        set: _ctx.activeBtn = button.find((b) => b.isActive($options.editor)) || button[0]
                      }, [
                        _ctx.activeBtn.icon ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.activeBtn.icon), {
                          key: 0,
                          class: "h-4 w-4"
                        })) : (openBlock(), createElementBlock(
                          "span",
                          _hoisted_6,
                          toDisplayString(_ctx.activeBtn.label),
                          1
                          /* TEXT */
                        ))
                      ], 8, _hoisted_5$1)
                    ]),
                    body: withCtx(({ close }) => [
                      createBaseVNode("ul", _hoisted_7, [
                        (openBlock(true), createElementBlock(
                          Fragment,
                          null,
                          renderList(button, (option) => {
                            return withDirectives((openBlock(), createElementBlock(
                              "li",
                              _hoisted_8,
                              [
                                createBaseVNode("button", {
                                  class: "w-full rounded px-2 py-1 text-left text-base hover:bg-surface-menu-bar",
                                  onClick: () => {
                                    $options.onButtonClick(option);
                                    close();
                                  }
                                }, toDisplayString(option.label), 9, _hoisted_9)
                              ],
                              512
                              /* NEED_PATCH */
                            )), [
                              [vShow, option.isDisabled ? !option.isDisabled($options.editor) : true]
                            ]);
                          }),
                          256
                          /* UNKEYED_FRAGMENT */
                        ))
                      ])
                    ]),
                    _: 2
                    /* DYNAMIC */
                  },
                  1024
                  /* DYNAMIC_SLOTS */
                )
              ])) : (openBlock(), createBlock(
                resolveDynamicComponent(button.component || "div"),
                mergeProps({
                  key: 2,
                  ref_for: true
                }, { editor: $options.editor }),
                {
                  default: withCtx((componentSlotProps) => [
                    createBaseVNode("button", {
                      class: normalizeClass([
                        "flex rounded p-1 text-ink-gray-8 transition-colors",
                        button.isActive($options.editor) || (componentSlotProps == null ? void 0 : componentSlotProps.isActive) ? "bg-surface-gray-2" : "hover:bg-surface-gray-2"
                      ]),
                      onClick: ($event) => (componentSlotProps == null ? void 0 : componentSlotProps.onClick) ? componentSlotProps.onClick(button) : $options.onButtonClick(button),
                      title: button.label
                    }, [
                      button.icon ? (openBlock(), createBlock(resolveDynamicComponent(button.icon), {
                        key: 0,
                        class: "h-4 w-4"
                      })) : (openBlock(), createElementBlock(
                        "span",
                        _hoisted_11,
                        toDisplayString(button.text),
                        1
                        /* TEXT */
                      ))
                    ], 10, _hoisted_10)
                  ]),
                  _: 2
                  /* DYNAMIC */
                },
                1040
                /* FULL_PROPS, DYNAMIC_SLOTS */
              ))
            ],
            64
            /* STABLE_FRAGMENT */
          );
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ])
  ]);
}
_sfc_main$O.__file = "src/components/TextEditor/Menu.vue";
const Menu = /* @__PURE__ */ _export_sfc(_sfc_main$O, [["render", _sfc_render$H], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/Menu.vue"]]);
const _sfc_main$N = {};
const _hoisted_1$C = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$G(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$C, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0H24V24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm8-12v12h-2v-9.796l-2 .536V8.67L19.5 8H21z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$N.__file = "src/components/TextEditor/icons/h-1.vue";
const H1 = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["render", _sfc_render$G], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-1.vue"]]);
const _sfc_main$M = {};
const _hoisted_1$B = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$F(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$B, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0H24V24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 4c2.071 0 3.75 1.679 3.75 3.75 0 .857-.288 1.648-.772 2.28l-.148.18L18.034 18H22v2h-7v-1.556l4.82-5.546c.268-.307.43-.709.43-1.148 0-.966-.784-1.75-1.75-1.75-.918 0-1.671.707-1.744 1.606l-.006.144h-2C14.75 9.679 16.429 8 18.5 8z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$M.__file = "src/components/TextEditor/icons/h-2.vue";
const H2 = /* @__PURE__ */ _export_sfc(_sfc_main$M, [["render", _sfc_render$F], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-2.vue"]]);
const _sfc_main$L = {};
const _hoisted_1$A = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$E(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$A, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0H24V24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M22 8l-.002 2-2.505 2.883c1.59.435 2.757 1.89 2.757 3.617 0 2.071-1.679 3.75-3.75 3.75-1.826 0-3.347-1.305-3.682-3.033l1.964-.382c.156.806.866 1.415 1.718 1.415.966 0 1.75-.784 1.75-1.75s-.784-1.75-1.75-1.75c-.286 0-.556.069-.794.19l-1.307-1.547L19.35 10H15V8h7zM4 4v7h7V4h2v16h-2v-7H4v7H2V4h2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$L.__file = "src/components/TextEditor/icons/h-3.vue";
const H3 = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["render", _sfc_render$E], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-3.vue"]]);
const _sfc_main$K = {};
const _hoisted_1$z = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$D(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$z, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0H24V24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm9-12v8h1.5v2H22v2h-2v-2h-5.5v-1.34l5-8.66H22zm-2 3.133L17.19 16H20v-4.867z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$K.__file = "src/components/TextEditor/icons/h-4.vue";
const H4 = /* @__PURE__ */ _export_sfc(_sfc_main$K, [["render", _sfc_render$D], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-4.vue"]]);
const _sfc_main$J = {};
const _hoisted_1$y = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$C(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$y, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0H24V24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M22 8v2h-4.323l-.464 2.636c.33-.089.678-.136 1.037-.136 2.21 0 4 1.79 4 4s-1.79 4-4 4c-1.827 0-3.367-1.224-3.846-2.897l1.923-.551c.24.836 1.01 1.448 1.923 1.448 1.105 0 2-.895 2-2s-.895-2-2-2c-.63 0-1.193.292-1.56.748l-1.81-.904L16 8h6zM4 4v7h7V4h2v16h-2v-7H4v7H2V4h2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$J.__file = "src/components/TextEditor/icons/h-5.vue";
const H5 = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["render", _sfc_render$C], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-5.vue"]]);
const _sfc_main$I = {};
const _hoisted_1$x = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$B(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$x, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0H24V24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M21.097 8l-2.598 4.5c2.21 0 4.001 1.79 4.001 4s-1.79 4-4 4-4-1.79-4-4c0-.736.199-1.426.546-2.019L18.788 8h2.309zM4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$I.__file = "src/components/TextEditor/icons/h-6.vue";
const H6 = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["render", _sfc_render$B], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-6.vue"]]);
const _sfc_main$H = {};
const _hoisted_1$w = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$A(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$w, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M13 6v15h-2V6H5V4h14v2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$H.__file = "src/components/TextEditor/icons/text.vue";
const Text = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["render", _sfc_render$A], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/text.vue"]]);
const _sfc_main$G = {};
const _hoisted_1$v = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$z(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$v, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$G.__file = "src/components/TextEditor/icons/bold.vue";
const Bold = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["render", _sfc_render$z], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/bold.vue"]]);
const _sfc_main$F = {};
const _hoisted_1$u = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$y(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$u, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$F.__file = "src/components/TextEditor/icons/italic.vue";
const Italic = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["render", _sfc_render$y], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/italic.vue"]]);
const _sfc_main$E = {};
const _hoisted_1$t = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$x(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$t, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2zM4 20h16v2H4v-2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$E.__file = "src/components/TextEditor/icons/underline.vue";
const Underline = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["render", _sfc_render$x], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/underline.vue"]]);
const _sfc_main$D = {};
const _hoisted_1$s = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$w(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$s, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M3 4h18v2H3V4zm2 15h14v2H5v-2zm-2-5h18v2H3v-2zm2-5h14v2H5V9z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$D.__file = "src/components/TextEditor/icons/align-center.vue";
const AlignCenter = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["render", _sfc_render$w], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/align-center.vue"]]);
const _sfc_main$C = {};
const _hoisted_1$r = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$v(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$r, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M3 4h18v2H3V4zm0 15h14v2H3v-2zm0-5h18v2H3v-2zm0-5h14v2H3V9z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$C.__file = "src/components/TextEditor/icons/align-left.vue";
const AlignLeft = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["render", _sfc_render$v], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/align-left.vue"]]);
const _sfc_main$B = {};
const _hoisted_1$q = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$u(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$q, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M3 4h18v2H3V4zm4 15h14v2H7v-2zm-4-5h18v2H3v-2zm4-5h14v2H7V9z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$B.__file = "src/components/TextEditor/icons/align-right.vue";
const AlignRight = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["render", _sfc_render$u], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/align-right.vue"]]);
const _sfc_main$A = {};
const _hoisted_1$p = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$t(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$p, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M15.246 14H8.754l-1.6 4H5l6-15h2l6 15h-2.154l-1.6-4zm-.8-2L12 5.885 9.554 12h4.892zM3 20h18v2H3v-2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$A.__file = "src/components/TextEditor/icons/font-color.vue";
const FontColor = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", _sfc_render$t], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/font-color.vue"]]);
const _sfc_main$z = {};
const _hoisted_1$o = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$s(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$o, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$z.__file = "src/components/TextEditor/icons/list-ordered.vue";
const ListOrdered = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$s], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/list-ordered.vue"]]);
const _sfc_main$y = {};
const _hoisted_1$n = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$r(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$n, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$y.__file = "src/components/TextEditor/icons/list-unordered.vue";
const ListUnordered = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$r], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/list-unordered.vue"]]);
const _sfc_main$x = {};
const _hoisted_1$m = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$q(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$m, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M19.417 6.679C20.447 7.773 21 9 21 10.989c0 3.5-2.457 6.637-6.03 8.188l-.893-1.378c3.335-1.804 3.987-4.145 4.247-5.621-.537.278-1.24.375-1.929.311-1.804-.167-3.226-1.648-3.226-3.489a3.5 3.5 0 0 1 3.5-3.5c1.073 0 2.099.49 2.748 1.179zm-10 0C10.447 7.773 11 9 11 10.989c0 3.5-2.457 6.637-6.03 8.188l-.893-1.378c3.335-1.804 3.987-4.145 4.247-5.621-.537.278-1.24.375-1.929.311C4.591 12.322 3.17 10.841 3.17 9a3.5 3.5 0 0 1 3.5-3.5c1.073 0 2.099.49 2.748 1.179z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$x.__file = "src/components/TextEditor/icons/double-quotes-r.vue";
const DoubleQuotes = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$q], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/double-quotes-r.vue"]]);
const _sfc_main$w = {};
const _hoisted_1$l = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$p(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$l, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M16.95 8.464l1.414-1.414 4.95 4.95-4.95 4.95-1.414-1.414L20.485 12 16.95 8.464zm-9.9 0L3.515 12l3.535 3.536-1.414 1.414L.686 12l4.95-4.95L7.05 8.464z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$w.__file = "src/components/TextEditor/icons/code-view.vue";
const CodeView = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$p], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/code-view.vue"]]);
const _sfc_main$v = {};
const _hoisted_1$k = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$o(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$k, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$v.__file = "src/components/TextEditor/icons/link.vue";
const Link = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$o], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/link.vue"]]);
const _sfc_main$u = {};
const _hoisted_1$j = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$n(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$j, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M21 15v3h3v2h-3v3h-2v-3h-3v-2h3v-3h2zm.008-12c.548 0 .992.445.992.993V13h-2V5H4v13.999L14 9l3 3v2.829l-3-3L6.827 19H14v2H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016zM8 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$u.__file = "src/components/TextEditor/icons/image-add-line.vue";
const Image = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$n], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/image-add-line.vue"]]);
const _sfc_main$t = {};
const _hoisted_1$i = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$m(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$i, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0H24V24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M16 4c.552 0 1 .448 1 1v4.2l5.213-3.65c.226-.158.538-.103.697.124.058.084.09.184.09.286v12.08c0 .276-.224.5-.5.5-.103 0-.203-.032-.287-.09L17 14.8V19c0 .552-.448 1-1 1H2c-.552 0-1-.448-1-1V5c0-.552.448-1 1-1h14zm-1 2H3v12h12V6zM8 8h2v3h3v2H9.999L10 16H8l-.001-3H5v-2h3V8zm13 .841l-4 2.8v.718l4 2.8V8.84z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$t.__file = "src/components/TextEditor/icons/video-add-line.vue";
const Video = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$m], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/video-add-line.vue"]]);
const _sfc_main$s = {};
const _hoisted_1$h = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$l(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$h, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M5.828 7l2.536 2.536L6.95 10.95 2 6l4.95-4.95 1.414 1.414L5.828 5H13a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H5.828z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$s.__file = "src/components/TextEditor/icons/arrow-go-back-line.vue";
const ArrowGoBack = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$l], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/arrow-go-back-line.vue"]]);
const _sfc_main$r = {};
const _hoisted_1$g = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$k(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$g, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M18.172 7H11a6 6 0 1 0 0 12h9v2h-9a8 8 0 1 1 0-16h7.172l-2.536-2.536L17.05 1.05 22 6l-4.95 4.95-1.414-1.414L18.172 7z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$r.__file = "src/components/TextEditor/icons/arrow-go-forward-line.vue";
const ArrowGoForward = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$k], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/arrow-go-forward-line.vue"]]);
const _sfc_main$q = {};
const _hoisted_1$f = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$j(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$f, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M2 11h2v2H2v-2zm4 0h12v2H6v-2zm14 0h2v2h-2v-2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$q.__file = "src/components/TextEditor/icons/separator.vue";
const Separator = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$j], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/separator.vue"]]);
const _sfc_main$p = {};
const _hoisted_1$e = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$i(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$e, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "path",
      {
        fill: "none",
        d: "M0 0h24v24H0z"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "path",
      {
        d: "M13 10v4h6v-4h-6zm-2 0H5v4h6v-4zm2 9h6v-3h-6v3zm-2 0v-3H5v3h6zm2-14v3h6V5h-6zm-2 0H5v3h6V5zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$p.__file = "src/components/TextEditor/icons/table-2.vue";
const Table = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$i], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/table-2.vue"]]);
const commands = {
  Paragraph: {
    label: "Paragraph",
    icon: Text,
    action: (editor) => editor.chain().focus().setParagraph().run(),
    isActive: (editor) => editor.isActive("paragraph")
  },
  "Heading 1": {
    label: "Heading 1",
    text: "H1",
    icon: H1,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 1 })
  },
  "Heading 2": {
    label: "Heading 2",
    text: "H2",
    icon: H2,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 2 })
  },
  "Heading 3": {
    label: "Heading 3",
    text: "H3",
    icon: H3,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 3 })
  },
  "Heading 4": {
    label: "Heading 4",
    text: "H4",
    icon: H4,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 4 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 4 })
  },
  "Heading 5": {
    label: "Heading 5",
    text: "H5",
    icon: H5,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 5 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 5 })
  },
  "Heading 6": {
    label: "Heading 6",
    text: "H6",
    icon: H6,
    action: (editor) => editor.chain().focus().toggleHeading({ level: 6 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 6 })
  },
  Bold: {
    label: "Bold",
    icon: Bold,
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive("bold")
  },
  Italic: {
    label: "Italic",
    icon: Italic,
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive("italic")
  },
  Underline: {
    label: "Underline",
    icon: Underline,
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive("underline")
  },
  "Bullet List": {
    label: "Bullet List",
    icon: ListUnordered,
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive("bulletList")
  },
  "Numbered List": {
    label: "Numbered List",
    icon: ListOrdered,
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive("orderedList")
  },
  "Align Center": {
    label: "Align Center",
    icon: AlignCenter,
    action: (editor) => editor.chain().focus().setTextAlign("center").run(),
    isActive: (editor) => editor.isActive({ textAlign: "center" })
  },
  "Align Left": {
    label: "Align Left",
    icon: AlignLeft,
    action: (editor) => editor.chain().focus().setTextAlign("left").run(),
    isActive: (editor) => editor.isActive({ textAlign: "left" })
  },
  "Align Right": {
    label: "Align Right",
    icon: AlignRight,
    action: (editor) => editor.chain().focus().setTextAlign("right").run(),
    isActive: (editor) => editor.isActive({ textAlign: "right" })
  },
  FontColor: {
    label: "Font Color",
    icon: FontColor,
    isActive: (editor) => editor.isActive("textStyle") || editor.isActive("highlight"),
    component: defineAsyncComponent(() => __vitePreload(() => import("./FontColor-3dcb6ab5.js"), true ? ["assets/FontColor-3dcb6ab5.js","assets/Popover-f6af0041.js","assets/vendor-e88d1662.js","assets/_plugin-vue_export-helper-cc2b3d55.js","assets/Autocomplete-b9abfdc4.js","assets/Button-992731ef.js","assets/FeatherIcon-69703505.js","assets/Avatar-cfa1d25e.js","assets/Badge-dca782e9.js","assets/Breadcrumbs-0c6286c2.js","assets/Dropdown-46fc2b89.js","assets/Checkbox-a9a36550.js","assets/DateRangePicker-1c0cbaf0.js","assets/TextInput-7dab3a3b.js","assets/debounce-d11286cd.js","assets/Dialog-019c142a.js","assets/ErrorMessage-0369058a.js","assets/FileUploader-58796327.js","assets/FormControl-aa196c3f.js","assets/Select-f64a6a0d.js","assets/Textarea-52e867af.js","assets/Progress-081a62c6.js","assets/Rating-b4c5359b.js","assets/Spinner-36d77baf.js","assets/Switch-12fa64a9.js","assets/TabButtons-e488cd1c.js","assets/Tabs-749cd935.js","assets/Tooltip-4b29ee29.js","assets/Calendar-0d22e329.js","assets/CircularProgressBar-7d6ec4f5.js","assets/Tree-01e78bc6.js"] : void 0))
  },
  Blockquote: {
    label: "Blockquote",
    icon: DoubleQuotes,
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive("blockquote")
  },
  Code: {
    label: "Code",
    icon: CodeView,
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive("codeBlock")
  },
  "Horizontal Rule": {
    label: "Horizontal Rule",
    icon: Separator,
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
    isActive: (editor) => false
  },
  Link: {
    label: "Link",
    icon: Link,
    isActive: (editor) => editor.isActive("link"),
    component: defineAsyncComponent(() => __vitePreload(() => import("./InsertLink-08890a38.js"), true ? ["assets/InsertLink-08890a38.js","assets/Dialog-019c142a.js","assets/vendor-e88d1662.js","assets/Button-992731ef.js","assets/FeatherIcon-69703505.js","assets/_plugin-vue_export-helper-cc2b3d55.js","assets/FormControl-aa196c3f.js","assets/Checkbox-a9a36550.js","assets/TextInput-7dab3a3b.js","assets/debounce-d11286cd.js","assets/Select-f64a6a0d.js","assets/Textarea-52e867af.js","assets/Autocomplete-b9abfdc4.js","assets/Popover-f6af0041.js"] : void 0))
  },
  Image: {
    label: "Image",
    icon: Image,
    isActive: (editor) => false,
    component: defineAsyncComponent(() => __vitePreload(() => import("./InsertImage-324a3f8b.js"), true ? ["assets/InsertImage-324a3f8b.js","assets/Dialog-019c142a.js","assets/vendor-e88d1662.js","assets/Button-992731ef.js","assets/FeatherIcon-69703505.js","assets/_plugin-vue_export-helper-cc2b3d55.js","assets/Avatar-cfa1d25e.js","assets/Badge-dca782e9.js","assets/Checkbox-a9a36550.js","assets/Autocomplete-b9abfdc4.js","assets/Popover-f6af0041.js","assets/Breadcrumbs-0c6286c2.js","assets/Dropdown-46fc2b89.js","assets/DateRangePicker-1c0cbaf0.js","assets/TextInput-7dab3a3b.js","assets/debounce-d11286cd.js","assets/ErrorMessage-0369058a.js","assets/FileUploader-58796327.js","assets/FormControl-aa196c3f.js","assets/Select-f64a6a0d.js","assets/Textarea-52e867af.js","assets/Progress-081a62c6.js","assets/Rating-b4c5359b.js","assets/Spinner-36d77baf.js","assets/Switch-12fa64a9.js","assets/TabButtons-e488cd1c.js","assets/Tabs-749cd935.js","assets/Tooltip-4b29ee29.js","assets/Calendar-0d22e329.js","assets/CircularProgressBar-7d6ec4f5.js","assets/Tree-01e78bc6.js"] : void 0))
  },
  Video: {
    label: "Video",
    icon: Video,
    isActive: (editor) => false,
    component: defineAsyncComponent(() => __vitePreload(() => import("./InsertVideo-4a8dbb60.js"), true ? ["assets/InsertVideo-4a8dbb60.js","assets/Button-992731ef.js","assets/vendor-e88d1662.js","assets/FeatherIcon-69703505.js","assets/_plugin-vue_export-helper-cc2b3d55.js","assets/Dialog-019c142a.js","assets/FileUploader-58796327.js"] : void 0))
  },
  Undo: {
    label: "Undo",
    icon: ArrowGoBack,
    action: (editor) => editor.chain().focus().undo().run(),
    isActive: (editor) => false
  },
  Redo: {
    label: "Redo",
    icon: ArrowGoForward,
    action: (editor) => editor.chain().focus().redo().run(),
    isActive: (editor) => false
  },
  InsertTable: {
    label: "Insert Table",
    icon: Table,
    action: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    isActive: (editor) => false
  },
  AddColumnBefore: {
    label: "Add Column Before",
    action: (editor) => editor.chain().focus().addColumnBefore().run(),
    isActive: (editor) => false,
    isDisabled: (editor) => !editor.can().addColumnBefore()
  },
  AddColumnAfter: {
    label: "Add Column After",
    action: (editor) => editor.chain().focus().addColumnAfter().run(),
    isActive: (editor) => false,
    isDisabled: (editor) => !editor.can().addColumnAfter()
  },
  DeleteColumn: {
    label: "Delete Column",
    action: (editor) => editor.chain().focus().deleteColumn().run(),
    isActive: (editor) => false,
    isDisabled: (editor) => !editor.can().deleteColumn()
  },
  AddRowBefore: {
    label: "Add Row Before",
    action: (editor) => editor.chain().focus().addRowBefore().run(),
    isActive: (editor) => false,
    isDisabled: (editor) => !editor.can().addRowBefore()
  },
  AddRowAfter: {
    label: "Add Row After",
    action: (editor) => editor.chain().focus().addRowAfter().run(),
    isActive: (editor) => false,
    isDisabled: (editor) => !editor.can().addRowAfter()
  },
  DeleteRow: {
    label: "Delete Row",
    action: (editor) => editor.chain().focus().deleteRow().run(),
    isActive: (editor) => false,
    isDisabled: (editor) => !editor.can().deleteRow()
  },
  DeleteTable: {
    label: "Delete Table",
    action: (editor) => editor.chain().focus().deleteTable().run(),
    isActive: (editor) => false,
    isDisabled: (editor) => !editor.can().deleteTable()
  },
  MergeCells: {
    label: "Merge Cells",
    action: (editor) => editor.chain().focus().mergeCells().run(),
    isActive: (editor) => false,
    isDisabled: (editor) => !editor.can().mergeCells()
  },
  SplitCell: {
    label: "Split Cell",
    action: (editor) => editor.chain().focus().splitCell().run(),
    isActive: (editor) => false,
    isDisabled: (editor) => !editor.can().splitCell()
  },
  ToggleHeaderColumn: {
    label: "Toggle Header Column",
    action: (editor) => editor.chain().focus().toggleHeaderColumn().run(),
    isActive: (editor) => false,
    isDisabled: (editor) => !editor.can().toggleHeaderColumn()
  },
  ToggleHeaderRow: {
    label: "Toggle Header Row",
    action: (editor) => editor.chain().focus().toggleHeaderRow().run(),
    isActive: (editor) => false,
    isDisabled: (editor) => !editor.can().toggleHeaderRow()
  },
  ToggleHeaderCell: {
    label: "Toggle Header Cell",
    action: (editor) => editor.chain().focus().toggleHeaderCell().run(),
    isActive: (editor) => false,
    isDisabled: (editor) => !editor.can().toggleHeaderCell()
  },
  Separator: {
    type: "separator"
  }
};
function createEditorButton(option) {
  if (option instanceof Array) {
    return option.map(createEditorButton);
  }
  if (typeof option == "object") {
    return option;
  }
  return commands[option];
}
const _sfc_main$o = {
  name: "TextEditorFixedMenu",
  props: ["buttons"],
  components: { Menu },
  inject: ["editor"],
  computed: {
    fixedMenuButtons() {
      if (!this.buttons)
        return false;
      let buttons;
      if (Array.isArray(this.buttons)) {
        buttons = this.buttons;
      } else {
        buttons = [
          [
            "Heading 1",
            "Heading 2",
            "Heading 3",
            "Heading 4",
            "Heading 5",
            "Heading 6"
          ],
          "Paragraph",
          "Separator",
          "Bold",
          "Italic",
          "Separator",
          "Bullet List",
          "Numbered List",
          "Separator",
          "Align Left",
          "Align Center",
          "Align Right",
          "FontColor",
          "Separator",
          "Image",
          "Video",
          "Link",
          "Blockquote",
          "Code",
          "Horizontal Rule",
          [
            "InsertTable",
            "AddColumnBefore",
            "AddColumnAfter",
            "DeleteColumn",
            "AddRowBefore",
            "AddRowAfter",
            "DeleteRow",
            "MergeCells",
            "SplitCell",
            "ToggleHeaderColumn",
            "ToggleHeaderRow",
            "ToggleHeaderCell",
            "DeleteTable"
          ],
          "Separator",
          "Undo",
          "Redo"
        ];
      }
      return buttons.map(createEditorButton);
    }
  }
};
function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Menu = resolveComponent("Menu");
  return $options.fixedMenuButtons ? (openBlock(), createBlock(_component_Menu, {
    key: 0,
    buttons: $options.fixedMenuButtons
  }, null, 8, ["buttons"])) : createCommentVNode("v-if", true);
}
_sfc_main$o.__file = "src/components/TextEditor/TextEditorFixedMenu.vue";
const TextEditorFixedMenu = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$h], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/TextEditorFixedMenu.vue"]]);
const _sfc_main$n = {
  name: "TextEditorBubbleMenu",
  props: ["buttons", "options"],
  components: { BubbleMenu, Menu },
  inject: ["editor"],
  computed: {
    bubbleMenuButtons() {
      if (!this.buttons)
        return false;
      let buttons;
      if (Array.isArray(this.buttons)) {
        buttons = this.buttons;
      } else {
        buttons = [
          "Paragraph",
          "Heading 2",
          "Heading 3",
          "Separator",
          "Bold",
          "Italic",
          "Link",
          "Separator",
          "Bullet List",
          "Numbered List",
          "Separator",
          "Image",
          "Video",
          "Blockquote",
          "Code",
          [
            "InsertTable",
            "AddColumnBefore",
            "AddColumnAfter",
            "DeleteColumn",
            "AddRowBefore",
            "AddRowAfter",
            "DeleteRow",
            "MergeCells",
            "SplitCell",
            "ToggleHeaderColumn",
            "ToggleHeaderRow",
            "ToggleHeaderCell",
            "DeleteTable"
          ]
        ];
      }
      return buttons.map(createEditorButton);
    }
  }
};
function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Menu = resolveComponent("Menu");
  const _component_BubbleMenu = resolveComponent("BubbleMenu");
  return $options.bubbleMenuButtons ? (openBlock(), createBlock(_component_BubbleMenu, mergeProps({
    key: 0,
    class: "bubble-menu rounded-md shadow-sm",
    "tippy-options": { duration: 100 },
    editor: $options.editor
  }, $props.options), {
    default: withCtx(() => [
      createVNode(_component_Menu, {
        class: "rounded-md border border-gray-100 shadow-lg",
        buttons: $options.bubbleMenuButtons
      }, null, 8, ["buttons"])
    ]),
    _: 1
    /* STABLE */
  }, 16, ["editor"])) : createCommentVNode("v-if", true);
}
_sfc_main$n.__file = "src/components/TextEditor/TextEditorBubbleMenu.vue";
const TextEditorBubbleMenu = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$g], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/TextEditorBubbleMenu.vue"]]);
const _sfc_main$m = {
  name: "TextEditorFloatingMenu",
  props: ["buttons"],
  components: { FloatingMenu },
  inject: ["editor"],
  computed: {
    floatingMenuButtons() {
      if (!this.buttons)
        return false;
      let buttons;
      if (Array.isArray(this.buttons)) {
        buttons = this.buttons;
      } else {
        buttons = [
          "Paragraph",
          "Heading 2",
          "Heading 3",
          "Bullet List",
          "Numbered List",
          "Blockquote",
          "Code",
          "Horizontal Rule"
        ];
      }
      return buttons.map(createEditorButton);
    }
  }
};
const _hoisted_1$d = ["onClick", "title"];
const _hoisted_2$4 = {
  key: 1,
  class: "inline-block h-4 min-w-[1rem] text-sm leading-4"
};
function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FloatingMenu = resolveComponent("FloatingMenu");
  return $options.floatingMenuButtons ? (openBlock(), createBlock(_component_FloatingMenu, {
    key: 0,
    "tippy-options": { duration: 100 },
    editor: $options.editor,
    class: "flex"
  }, {
    default: withCtx(() => [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($options.floatingMenuButtons, (button) => {
          return openBlock(), createElementBlock("button", {
            key: button.label,
            class: normalizeClass([
              "flex rounded p-1 text-ink-gray-8 transition-colors",
              button.isActive($options.editor) ? "bg-surface-gray-2" : "hover:bg-surface-gray-2"
            ]),
            onClick: () => button.action($options.editor),
            title: button.label
          }, [
            button.icon ? (openBlock(), createBlock(resolveDynamicComponent(button.icon), {
              key: 0,
              class: "h-4 w-4"
            })) : (openBlock(), createElementBlock(
              "span",
              _hoisted_2$4,
              toDisplayString(button.text),
              1
              /* TEXT */
            ))
          ], 10, _hoisted_1$d);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]),
    _: 1
    /* STABLE */
  }, 8, ["editor"])) : createCommentVNode("v-if", true);
}
_sfc_main$m.__file = "src/components/TextEditor/TextEditorFloatingMenu.vue";
const TextEditorFloatingMenu = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$f], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/TextEditorFloatingMenu.vue"]]);
function markdownToHTML(text) {
  const converter = new showdown.Converter();
  converter.setFlavor("github");
  return converter.makeHtml(text);
}
function detectMarkdown(text) {
  const lines = text.split("\n");
  const markdown = lines.filter(
    (line) => line.startsWith("![") || line.startsWith("#") || line.startsWith("> ") || line.startsWith("*") || line.startsWith("- ") || line.startsWith("1. ") || line.startsWith("```") || line.startsWith("`") || line.startsWith("[") || line.startsWith("---")
  );
  return markdown.length > 0;
}
const TextEditor_vue_vue_type_style_index_0_lang = "";
const _sfc_main$l = {
  name: "TextEditor",
  inheritAttrs: false,
  components: {
    EditorContent,
    TextEditorFixedMenu,
    TextEditorBubbleMenu,
    TextEditorFloatingMenu
  },
  props: {
    content: {
      type: String,
      default: null
    },
    placeholder: {
      type: [String, Function],
      default: ""
    },
    editorClass: {
      type: [String, Array, Object],
      default: ""
    },
    editable: {
      type: Boolean,
      default: true
    },
    bubbleMenu: {
      type: [Boolean, Array],
      default: false
    },
    bubbleMenuOptions: {
      type: Object,
      default: () => ({})
    },
    fixedMenu: {
      type: [Boolean, Array],
      default: false
    },
    floatingMenu: {
      type: [Boolean, Array],
      default: false
    },
    extensions: {
      type: Array,
      default: () => []
    },
    starterkitOptions: {
      type: Object,
      default: () => ({})
    },
    mentions: {
      type: Array,
      default: () => []
    }
  },
  emits: ["change", "focus", "blur"],
  expose: ["editor"],
  provide() {
    return {
      editor: computed$1(() => this.editor)
    };
  },
  data() {
    return {
      editor: null
    };
  },
  watch: {
    content(val) {
      let currentHTML = this.editor.getHTML();
      if (currentHTML !== val) {
        this.editor.commands.setContent(val);
      }
    },
    editable(value) {
      this.editor.setEditable(value);
    },
    editorProps: {
      deep: true,
      handler(value) {
        if (this.editor) {
          this.editor.setOptions({
            editorProps: value
          });
        }
      }
    }
  },
  mounted() {
    this.editor = new Editor({
      content: this.content || null,
      editorProps: this.editorProps,
      editable: this.editable,
      extensions: [
        StarterKit.configure({
          ...this.starterkitOptions
        }),
        Table$1.configure({
          resizable: true
        }),
        TableRow,
        TableHeader,
        TableCell,
        Typography,
        TextAlign.configure({
          types: ["heading", "paragraph"]
        }),
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
        Image$1,
        Video$1,
        Link$1.configure({
          openOnClick: false
        }),
        Placeholder.configure({
          showOnlyWhenEditable: false,
          placeholder: typeof this.placeholder === "function" ? this.placeholder : () => this.placeholder
        }),
        configureMention(this.mentions),
        ...this.extensions || []
      ],
      onUpdate: ({ editor }) => {
        this.$emit("change", editor.getHTML());
      },
      onFocus: ({ editor, event }) => {
        this.$emit("focus", event);
      },
      onBlur: ({ editor, event }) => {
        this.$emit("blur", event);
      }
    });
  },
  beforeUnmount() {
    this.editor.destroy();
    this.editor = null;
  },
  computed: {
    editorProps() {
      return {
        attributes: {
          class: normalizeClass([
            "prose prose-table:table-fixed prose-td:p-2 prose-th:p-2 prose-td:border prose-th:border prose-td:border-outline-gray-2 prose-th:border-outline-gray-2 prose-td:relative prose-th:relative prose-th:bg-surface-gray-2",
            this.editorClass
          ])
        },
        clipboardTextParser: (text, $context) => {
          if (!detectMarkdown(text))
            return;
          if (!confirm(
            "Do you want to convert markdown content to HTML before pasting?"
          ))
            return;
          let dom = document.createElement("div");
          dom.innerHTML = markdownToHTML(text);
          let parser = this.editor.view.someProp("clipboardParser") || this.editor.view.someProp("domParser") || DOMParser.fromSchema(this.editor.schema);
          return parser.parseSlice(dom, {
            preserveWhitespace: true,
            context: $context
          });
        }
      };
    }
  }
};
_sfc_main$l.__file = "src/components/TextEditor/TextEditor.vue";
const _sfc_main$k = {
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
const _hoisted_1$c = { class: "flex h-full w-full flex-col items-center justify-center text-base" };
const _hoisted_2$3 = { class: "text-xl font-medium" };
const _hoisted_3$3 = { class: "mt-1 text-base text-ink-gray-5" };
function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$c, [
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
_sfc_main$k.__file = "src/components/ListView/ListEmptyState.vue";
const ListEmptyState = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$e], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListEmptyState.vue"]]);
const _sfc_main$j = {
  __name: "ListRows",
  setup(__props, { expose: __expose }) {
    __expose();
    const list = inject("list");
    const __returned__ = { list, ListRow, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$b = { class: "h-full overflow-y-auto" };
function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$b, [
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
_sfc_main$j.__file = "src/components/ListView/ListRows.vue";
const ListRows = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$d], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListRows.vue"]]);
const _sfc_main$i = {};
const _hoisted_1$a = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 16 16"
};
function _sfc_render$c(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$a, _cache[0] || (_cache[0] = [
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
_sfc_main$i.__file = "src/icons/DownSolid.vue";
const DownSolid = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$c], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/icons/DownSolid.vue"]]);
const _sfc_main$h = {
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
const _hoisted_1$9 = { class: "flex items-center" };
const _hoisted_2$2 = { class: "w-full py-1.5 pr-2" };
const _hoisted_3$2 = {
  key: 1,
  class: "text-base font-medium leading-6"
};
function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      createBaseVNode("div", _hoisted_1$9, [
        createBaseVNode("button", {
          onClick: $setup.toggleGroup,
          class: "ml-[3px] mr-[11px] rounded p-1 hover:bg-surface-gray-2"
        }, [
          createVNode($setup["DownSolid"], {
            class: normalizeClass(["h-4 w-4 text-ink-gray-9 transition-transform duration-200", [$props.group.collapsed ? "-rotate-90" : ""]])
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
_sfc_main$h.__file = "src/components/ListView/ListGroupHeader.vue";
const ListGroupHeader = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$b], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListGroupHeader.vue"]]);
const _sfc_main$g = {
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
const _hoisted_1$8 = {
  key: 0,
  class: "mb-5 mt-2"
};
function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
  return !$props.group.collapsed ? (openBlock(), createElementBlock("div", _hoisted_1$8, [
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
_sfc_main$g.__file = "src/components/ListView/ListGroupRows.vue";
const ListGroupRows = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$a], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListGroupRows.vue"]]);
const _sfc_main$f = {
  __name: "ListGroups",
  setup(__props, { expose: __expose }) {
    __expose();
    const list = inject("list");
    const __returned__ = { list, ListGroupHeader, ListGroupRows, inject };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
};
const _hoisted_1$7 = { class: "h-full overflow-y-auto" };
function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$7, [
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
_sfc_main$f.__file = "src/components/ListView/ListGroups.vue";
const ListGroups = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$9], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListGroups.vue"]]);
const _sfc_main$e = /* @__PURE__ */ Object.assign({
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
const _hoisted_1$6 = {
  key: 0,
  class: "absolute inset-x-0 bottom-6 mx-auto w-max text-base"
};
const _hoisted_2$1 = { class: "flex flex-1 justify-between border-r border-outline-gray-2 text-ink-gray-9" };
const _hoisted_3$1 = { class: "flex items-center space-x-3" };
const _hoisted_4 = { class: "mr-3" };
const _hoisted_5 = { class: "flex items-center space-x-1" };
function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, {
    "enter-active-class": "duration-300 ease-out",
    "enter-from-class": "transform opacity-0",
    "enter-to-class": "opacity-100",
    "leave-active-class": "duration-300 ease-in",
    "leave-from-class": "opacity-100",
    "leave-to-class": "transform opacity-0"
  }, {
    default: withCtx(() => [
      $setup.list.selections.size ? (openBlock(), createElementBlock("div", _hoisted_1$6, [
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
_sfc_main$e.__file = "src/components/ListView/ListSelectBanner.vue";
const ListSelectBanner = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$8], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListSelectBanner.vue"]]);
const _sfc_main$d = /* @__PURE__ */ Object.assign({
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
    __expose();
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
      if (!props.rows.length)
        return false;
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
const _hoisted_1$5 = { class: "relative flex w-full flex-1 flex-col overflow-x-auto" };
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$5, [
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
_sfc_main$d.__file = "src/components/ListView/ListView.vue";
const ListView = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$7], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView/ListView.vue"]]);
const _sfc_main$c = {
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
_sfc_main$c.__file = "src/components/ListView/ListFooter.vue";
const _sfc_main$b = {
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
_sfc_main$b.__file = "src/components/Toast.vue";
ref([]);
const _sfc_main$a = {
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
_sfc_main$a.__file = "src/components/CommandPalette/CommandPalette.vue";
const _sfc_main$9 = {
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
_sfc_main$9.__file = "src/components/CommandPalette/CommandPaletteItem.vue";
const _sfc_main$8 = {};
const _hoisted_1$4 = {
  width: "16",
  height: "17",
  viewBox: "0 0 16 17",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function _sfc_render$6(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$4, _cache[0] || (_cache[0] = [
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
_sfc_main$8.__file = "src/components/ListFilter/FilterIcon.vue";
const FilterIcon = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$6], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListFilter/FilterIcon.vue"]]);
const _sfc_main$7 = {
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
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
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
_sfc_main$7.__file = "src/components/ListFilter/NestedPopover.vue";
const NestedPopover = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$5], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListFilter/NestedPopover.vue"]]);
const _sfc_main$6 = {
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
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock($setup["Autocomplete"], {
    placeholder: "Select an option",
    options: $setup.options,
    value: $setup.selection,
    "onUpdate:query": _cache[0] || (_cache[0] = (q) => $setup.onUpdateQuery(q)),
    onChange: _cache[1] || (_cache[1] = (v) => $setup.selection = v)
  }, null, 8, ["options", "value"]);
}
_sfc_main$6.__file = "src/components/ListFilter/SearchComplete.vue";
const SearchComplete = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$4], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListFilter/SearchComplete.vue"]]);
const _sfc_main$5 = {
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
_sfc_main$5.__file = "src/components/ListFilter/ListFilter.vue";
const _sfc_main$4 = {};
const _hoisted_1$3 = {
  width: "17",
  height: "16",
  viewBox: "0 0 17 16",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function _sfc_render$3(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$3, _cache[0] || (_cache[0] = [
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
_sfc_main$4.__file = "src/components/Billing/LightningIcon.vue";
const LightningIcon = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Billing/LightningIcon.vue"]]);
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
  if (!key)
    return Promise.resolve();
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
  if (subscribed[doctype])
    return;
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
        if (!row.name)
          continue;
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
  if (!doc.name)
    return;
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
const _sfc_main$3 = {
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
      if (!trialEndDate)
        return 0;
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
_sfc_main$3.__file = "src/components/Billing/TrialBanner.vue";
let faviconRef = document.querySelector('link[rel="icon"]');
faviconRef == null ? void 0 : faviconRef.href;
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
const _hoisted_1$2 = { class: "truncate text-base" };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
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
                  _hoisted_1$2,
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
      if (!((_a = list.value.rows) == null ? void 0 : _a.length))
        return false;
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
const _hoisted_1$1 = {
  key: 0,
  class: "mx-2 h-px border-t border-outline-gray-modals"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
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
          !$setup.isLastRow ? (openBlock(), createElementBlock("div", _hoisted_1$1)) : createCommentVNode("v-if", true)
        ]),
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
    }, FeatherIcon, ListHeader, ListHeaderItem, ListRow, ListRowItem, ListRows, ListGroups, ListSelectBanner, ListView };
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
_sfc_main.__file = "src/components/ListView.story.vue";
const ListView_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/ListView.story.vue"]]);
const ListView_story$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ListView_story
}, Symbol.toStringTag, { value: "Module" }));
export {
  ListView_story$1 as L,
  fileToBase64 as f
};
