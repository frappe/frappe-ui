const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/FontColor-D5_2Lauq.js","assets/Popover-C4FOIw3w.js","assets/vendor-CMwIBljF.js","assets/_plugin-vue_export-helper-1tPrXgE0.js","assets/ListRow-BwZiuZD8.js","assets/Checkbox-CswJdWS2.js","assets/Autocomplete-DSGBJmRZ.js","assets/Button-B9tTbWwO.js","assets/FeatherIcon-BjBq-5Mm.js","assets/Avatar-DalSDsO5.js","assets/Badge-CdrU9zWu.js","assets/Breadcrumbs-CyBzKtOE.js","assets/Dropdown-QI9smEC4.js","assets/DateRangePicker-DmTjqbW6.js","assets/TextInput-VOs-3J_2.js","assets/debounce-CRCtzhPg.js","assets/Dialog-DiuO0EnW.js","assets/ErrorMessage-DJPbA5_X.js","assets/FileUploader-DAO4vLqQ.js","assets/FormControl-BCtu5_T9.js","assets/Select-B3-TyfLm.js","assets/Textarea-DlBgKjHl.js","assets/Progress-IiadB1A_.js","assets/Rating-BETP1HB4.js","assets/Spinner-C0jX2VTs.js","assets/Switch-BMuT7ijy.js","assets/TabButtons-C3logSbW.js","assets/Tabs-wjXOIOaC.js","assets/Tooltip-COASSlri.js","assets/Calendar-skRypxMX.js","assets/CircularProgressBar-J5ecR_f8.js","assets/Tree-Jw3y8fvC.js","assets/InsertLink-D7CQGZRu.js","assets/InsertImage-C-LtkOvw.js","assets/InsertVideo-B51F1YgL.js"])))=>i.map(i=>d[i]);
import { aU as Node, aV as mergeAttributes, aW as nodeInputRule, aX as Plugin, aB as openBlock, aG as createElementBlock, aK as Fragment, aJ as renderList, aQ as normalizeClass, aN as toDisplayString, aH as createCommentVNode, aY as Mention, aZ as VueRenderer, a_ as tippy, aA as resolveComponent, aF as createBaseVNode, aE as createVNode, aD as withCtx, aC as createBlock, a$ as resolveDynamicComponent, b0 as withDirectives, b1 as vShow, aL as mergeProps, Z as defineAsyncComponent, _ as __vitePreload, b2 as BubbleMenu, b3 as FloatingMenu, b4 as Extension, b5 as Suggestion, b6 as showdown, aT as EditorContent, b7 as computed, b8 as Editor, b9 as StarterKit, ba as Table$1, bb as TableRow, bc as TableHeader, bd as TableCell, be as Typography, bf as TextAlign, bg as TextStyle, bh as Color, bi as Highlight, bj as Link$1, bk as Placeholder, bl as DOMParser, bm as renderSlot } from "./vendor-CMwIBljF.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { P as Popover } from "./Popover-C4FOIw3w.js";
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
          if (!image) return;
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
          if (!coordinates) return false;
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
const _sfc_main$v = {
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
const _hoisted_1$s = {
  key: 0,
  class: "min-w-40 rounded-lg border bg-surface-white p-1 text-base shadow-lg"
};
const _hoisted_2$3 = ["onClick", "onMouseover"];
function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    $props.items.length ? (openBlock(), createElementBlock("div", _hoisted_1$s, [
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
          }, toDisplayString(item.label), 43, _hoisted_2$3);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ])) : createCommentVNode("v-if", true)
  ]);
}
_sfc_main$v.__file = "src/components/TextEditor/MentionList.vue";
const MentionList = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$v], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/MentionList.vue"]]);
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
const _sfc_main$u = {
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
const _hoisted_1$r = { class: "inline-flex bg-surface-white px-1 py-1" };
const _hoisted_2$2 = { class: "inline-flex items-center gap-1" };
const _hoisted_3$1 = {
  key: 0,
  class: "h-4 w-[2px] border-l"
};
const _hoisted_4 = {
  key: 1,
  class: "shrink-0"
};
const _hoisted_5 = ["onClick", "set"];
const _hoisted_6 = { key: 1 };
const _hoisted_7 = { class: "rounded border bg-surface-white p-1 shadow-md" };
const _hoisted_8 = { class: "w-full" };
const _hoisted_9 = ["onClick"];
const _hoisted_10 = ["onClick", "title"];
const _hoisted_11 = {
  key: 1,
  class: "inline-block h-4 min-w-[1rem] text-sm leading-4"
};
function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Popover = resolveComponent("Popover");
  return openBlock(), createElementBlock("div", _hoisted_1$r, [
    createBaseVNode("div", _hoisted_2$2, [
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
              button.type === "separator" ? (openBlock(), createElementBlock("div", _hoisted_3$1)) : button.map ? (openBlock(), createElementBlock("div", _hoisted_4, [
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
                      ], 8, _hoisted_5)
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
_sfc_main$u.__file = "src/components/TextEditor/Menu.vue";
const Menu = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$u], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/Menu.vue"]]);
const _sfc_main$t = {};
const _hoisted_1$q = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$t(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$q, _cache[0] || (_cache[0] = [
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
_sfc_main$t.__file = "src/components/TextEditor/icons/h-1.vue";
const H1 = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$t], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-1.vue"]]);
const _sfc_main$s = {};
const _hoisted_1$p = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$s(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$p, _cache[0] || (_cache[0] = [
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
_sfc_main$s.__file = "src/components/TextEditor/icons/h-2.vue";
const H2 = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$s], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-2.vue"]]);
const _sfc_main$r = {};
const _hoisted_1$o = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$r(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$o, _cache[0] || (_cache[0] = [
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
_sfc_main$r.__file = "src/components/TextEditor/icons/h-3.vue";
const H3 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$r], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-3.vue"]]);
const _sfc_main$q = {};
const _hoisted_1$n = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$q(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$n, _cache[0] || (_cache[0] = [
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
_sfc_main$q.__file = "src/components/TextEditor/icons/h-4.vue";
const H4 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$q], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-4.vue"]]);
const _sfc_main$p = {};
const _hoisted_1$m = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$p(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$m, _cache[0] || (_cache[0] = [
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
_sfc_main$p.__file = "src/components/TextEditor/icons/h-5.vue";
const H5 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$p], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-5.vue"]]);
const _sfc_main$o = {};
const _hoisted_1$l = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$o(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$l, _cache[0] || (_cache[0] = [
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
_sfc_main$o.__file = "src/components/TextEditor/icons/h-6.vue";
const H6 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$o], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-6.vue"]]);
const _sfc_main$n = {};
const _hoisted_1$k = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$n(_ctx, _cache) {
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
        d: "M13 6v15h-2V6H5V4h14v2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$n.__file = "src/components/TextEditor/icons/text.vue";
const Text = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$n], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/text.vue"]]);
const _sfc_main$m = {};
const _hoisted_1$j = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$m(_ctx, _cache) {
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
        d: "M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$m.__file = "src/components/TextEditor/icons/bold.vue";
const Bold = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$m], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/bold.vue"]]);
const _sfc_main$l = {};
const _hoisted_1$i = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$l(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$i, _cache[0] || (_cache[0] = [
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
_sfc_main$l.__file = "src/components/TextEditor/icons/italic.vue";
const Italic = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$l], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/italic.vue"]]);
const _sfc_main$k = {};
const _hoisted_1$h = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$k(_ctx, _cache) {
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
        d: "M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2zM4 20h16v2H4v-2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$k.__file = "src/components/TextEditor/icons/underline.vue";
const Underline = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$k], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/underline.vue"]]);
const _sfc_main$j = {};
const _hoisted_1$g = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$j(_ctx, _cache) {
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
        d: "M3 4h18v2H3V4zm2 15h14v2H5v-2zm-2-5h18v2H3v-2zm2-5h14v2H5V9z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$j.__file = "src/components/TextEditor/icons/align-center.vue";
const AlignCenter = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$j], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/align-center.vue"]]);
const _sfc_main$i = {};
const _hoisted_1$f = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$i(_ctx, _cache) {
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
        d: "M3 4h18v2H3V4zm0 15h14v2H3v-2zm0-5h18v2H3v-2zm0-5h14v2H3V9z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$i.__file = "src/components/TextEditor/icons/align-left.vue";
const AlignLeft = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$i], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/align-left.vue"]]);
const _sfc_main$h = {};
const _hoisted_1$e = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$h(_ctx, _cache) {
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
        d: "M3 4h18v2H3V4zm4 15h14v2H7v-2zm-4-5h18v2H3v-2zm4-5h14v2H7V9z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$h.__file = "src/components/TextEditor/icons/align-right.vue";
const AlignRight = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$h], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/align-right.vue"]]);
const _sfc_main$g = {};
const _hoisted_1$d = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$g(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$d, _cache[0] || (_cache[0] = [
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
_sfc_main$g.__file = "src/components/TextEditor/icons/font-color.vue";
const FontColor = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$g], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/font-color.vue"]]);
const _sfc_main$f = {};
const _hoisted_1$c = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$f(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$c, _cache[0] || (_cache[0] = [
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
_sfc_main$f.__file = "src/components/TextEditor/icons/list-ordered.vue";
const ListOrdered = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$f], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/list-ordered.vue"]]);
const _sfc_main$e = {};
const _hoisted_1$b = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$e(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$b, _cache[0] || (_cache[0] = [
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
_sfc_main$e.__file = "src/components/TextEditor/icons/list-unordered.vue";
const ListUnordered = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/list-unordered.vue"]]);
const _sfc_main$d = {};
const _hoisted_1$a = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$d(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$a, _cache[0] || (_cache[0] = [
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
_sfc_main$d.__file = "src/components/TextEditor/icons/double-quotes-r.vue";
const DoubleQuotes = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/double-quotes-r.vue"]]);
const _sfc_main$c = {};
const _hoisted_1$9 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$c(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$9, _cache[0] || (_cache[0] = [
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
_sfc_main$c.__file = "src/components/TextEditor/icons/code-view.vue";
const CodeView = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/code-view.vue"]]);
const _sfc_main$b = {};
const _hoisted_1$8 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$b(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$8, _cache[0] || (_cache[0] = [
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
_sfc_main$b.__file = "src/components/TextEditor/icons/link.vue";
const Link = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/link.vue"]]);
const _sfc_main$a = {};
const _hoisted_1$7 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$a(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$7, _cache[0] || (_cache[0] = [
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
_sfc_main$a.__file = "src/components/TextEditor/icons/image-add-line.vue";
const Image = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/image-add-line.vue"]]);
const _sfc_main$9 = {};
const _hoisted_1$6 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$9(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$6, _cache[0] || (_cache[0] = [
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
_sfc_main$9.__file = "src/components/TextEditor/icons/video-add-line.vue";
const Video = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/video-add-line.vue"]]);
const _sfc_main$8 = {};
const _hoisted_1$5 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$8(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$5, _cache[0] || (_cache[0] = [
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
_sfc_main$8.__file = "src/components/TextEditor/icons/arrow-go-back-line.vue";
const ArrowGoBack = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/arrow-go-back-line.vue"]]);
const _sfc_main$7 = {};
const _hoisted_1$4 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$7(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$4, _cache[0] || (_cache[0] = [
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
_sfc_main$7.__file = "src/components/TextEditor/icons/arrow-go-forward-line.vue";
const ArrowGoForward = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/arrow-go-forward-line.vue"]]);
const _sfc_main$6 = {};
const _hoisted_1$3 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$6(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$3, _cache[0] || (_cache[0] = [
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
_sfc_main$6.__file = "src/components/TextEditor/icons/separator.vue";
const Separator = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/separator.vue"]]);
const _sfc_main$5 = {};
const _hoisted_1$2 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$5(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$2, _cache[0] || (_cache[0] = [
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
_sfc_main$5.__file = "src/components/TextEditor/icons/table-2.vue";
const Table = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/table-2.vue"]]);
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
    component: defineAsyncComponent(() => __vitePreload(() => import("./FontColor-D5_2Lauq.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]) : void 0))
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
    component: defineAsyncComponent(() => __vitePreload(() => import("./InsertLink-D7CQGZRu.js"), true ? __vite__mapDeps([32,16,2,7,8,3,19,5,14,15,20,21,6,1]) : void 0))
  },
  Image: {
    label: "Image",
    icon: Image,
    isActive: (editor) => false,
    component: defineAsyncComponent(() => __vitePreload(() => import("./InsertImage-C-LtkOvw.js"), true ? __vite__mapDeps([33,16,2,7,8,3,1]) : void 0))
  },
  Video: {
    label: "Video",
    icon: Video,
    isActive: (editor) => false,
    component: defineAsyncComponent(() => __vitePreload(() => import("./InsertVideo-B51F1YgL.js"), true ? __vite__mapDeps([34,7,2,8,3,16,18]) : void 0))
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
const _sfc_main$4 = {
  name: "TextEditorFixedMenu",
  props: ["buttons"],
  components: { Menu },
  inject: ["editor"],
  computed: {
    fixedMenuButtons() {
      if (!this.buttons) return false;
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
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Menu = resolveComponent("Menu");
  return $options.fixedMenuButtons ? (openBlock(), createBlock(_component_Menu, {
    key: 0,
    buttons: $options.fixedMenuButtons
  }, null, 8, ["buttons"])) : createCommentVNode("v-if", true);
}
_sfc_main$4.__file = "src/components/TextEditor/TextEditorFixedMenu.vue";
const TextEditorFixedMenu = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/TextEditorFixedMenu.vue"]]);
const _sfc_main$3 = {
  name: "TextEditorBubbleMenu",
  props: ["buttons", "options"],
  components: { BubbleMenu, Menu },
  inject: ["editor"],
  computed: {
    bubbleMenuButtons() {
      if (!this.buttons) return false;
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
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
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
_sfc_main$3.__file = "src/components/TextEditor/TextEditorBubbleMenu.vue";
const TextEditorBubbleMenu = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/TextEditorBubbleMenu.vue"]]);
const _sfc_main$2 = {
  name: "TextEditorFloatingMenu",
  props: ["buttons"],
  components: { FloatingMenu },
  inject: ["editor"],
  computed: {
    floatingMenuButtons() {
      if (!this.buttons) return false;
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
const _hoisted_1$1 = ["onClick", "title"];
const _hoisted_2$1 = {
  key: 1,
  class: "inline-block h-4 min-w-[1rem] text-sm leading-4"
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
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
              _hoisted_2$1,
              toDisplayString(button.text),
              1
              /* TEXT */
            ))
          ], 10, _hoisted_1$1);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]),
    _: 1
    /* STABLE */
  }, 8, ["editor"])) : createCommentVNode("v-if", true);
}
_sfc_main$2.__file = "src/components/TextEditor/TextEditorFloatingMenu.vue";
const TextEditorFloatingMenu = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/TextEditorFloatingMenu.vue"]]);
const _sfc_main$1 = {
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
        this.command({ emoji: item.emoji });
      }
    }
  }
};
const _hoisted_1 = {
  key: 0,
  class: "min-w-40 rounded-lg border bg-surface-white p-1 text-base shadow-lg"
};
const _hoisted_2 = ["onClick", "onMouseover"];
const _hoisted_3 = { class: "mr-2" };
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    $props.items.length ? (openBlock(), createElementBlock("div", _hoisted_1, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($props.items, (item, index) => {
          return openBlock(), createElementBlock("button", {
            key: index,
            class: normalizeClass([
              index === $data.selectedIndex ? "bg-surface-gray-2" : "",
              "flex w-full items-center whitespace-nowrap rounded-md px-2 py-2 text-sm text-ink-gray-9"
            ]),
            onClick: ($event) => $options.selectItem(index),
            onMouseover: ($event) => $data.selectedIndex = index
          }, [
            createBaseVNode(
              "span",
              _hoisted_3,
              toDisplayString(item.emoji),
              1
              /* TEXT */
            ),
            createBaseVNode(
              "span",
              null,
              toDisplayString(item.name),
              1
              /* TEXT */
            )
          ], 42, _hoisted_2);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ])) : createCommentVNode("v-if", true)
  ]);
}
_sfc_main$1.__file = "src/components/TextEditor/EmojiList.vue";
const EmojiList = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/EmojiList.vue"]]);
const emojis = [
  {
    name: "grinning",
    emoji: "😀"
  },
  {
    name: "grimacing",
    emoji: "😬"
  },
  {
    name: "grin",
    emoji: "😁"
  },
  {
    name: "joy",
    emoji: "😂"
  },
  {
    name: "rofl",
    emoji: "🤣"
  },
  {
    name: "smiley",
    emoji: "😃"
  },
  {
    name: "smile",
    emoji: "😄"
  },
  {
    name: "sweat_smile",
    emoji: "😅"
  },
  {
    name: "laughing",
    emoji: "😆"
  },
  {
    name: "innocent",
    emoji: "😇"
  },
  {
    name: "wink",
    emoji: "😉"
  },
  {
    name: "blush",
    emoji: "😊"
  },
  {
    name: "slightly_smiling_face",
    emoji: "🙂"
  },
  {
    name: "upside_down_face",
    emoji: "🙃"
  },
  {
    name: "relaxed",
    emoji: "☺"
  },
  {
    name: "yum",
    emoji: "😋"
  },
  {
    name: "relieved",
    emoji: "😌"
  },
  {
    name: "heart_eyes",
    emoji: "😍"
  },
  {
    name: "kissing_heart",
    emoji: "😘"
  },
  {
    name: "kissing",
    emoji: "😗"
  },
  {
    name: "kissing_smiling_eyes",
    emoji: "😙"
  },
  {
    name: "kissing_closed_eyes",
    emoji: "😚"
  },
  {
    name: "stuck_out_tongue_winking_eye",
    emoji: "😜"
  },
  {
    name: "stuck_out_tongue_closed_eyes",
    emoji: "😝"
  },
  {
    name: "stuck_out_tongue",
    emoji: "😛"
  },
  {
    name: "money_mouth_face",
    emoji: "🤑"
  },
  {
    name: "nerd_face",
    emoji: "🤓"
  },
  {
    name: "sunglasses",
    emoji: "😎"
  },
  {
    name: "clown_face",
    emoji: "🤡"
  },
  {
    name: "cowboy_hat_face",
    emoji: "🤠"
  },
  {
    name: "hugs",
    emoji: "🤗"
  },
  {
    name: "smirk",
    emoji: "😏"
  },
  {
    name: "no_mouth",
    emoji: "😶"
  },
  {
    name: "neutral_face",
    emoji: "😐"
  },
  {
    name: "expressionless",
    emoji: "😑"
  },
  {
    name: "unamused",
    emoji: "😒"
  },
  {
    name: "roll_eyes",
    emoji: "🙄"
  },
  {
    name: "thinking",
    emoji: "🤔"
  },
  {
    name: "lying_face",
    emoji: "🤥"
  },
  {
    name: "flushed",
    emoji: "😳"
  },
  {
    name: "disappointed",
    emoji: "😞"
  },
  {
    name: "worried",
    emoji: "😟"
  },
  {
    name: "angry",
    emoji: "😠"
  },
  {
    name: "rage",
    emoji: "😡"
  },
  {
    name: "pensive",
    emoji: "😔"
  },
  {
    name: "confused",
    emoji: "😕"
  },
  {
    name: "slightly_frowning_face",
    emoji: "🙁"
  },
  {
    name: "frowning_face",
    emoji: "☹"
  },
  {
    name: "persevere",
    emoji: "😣"
  },
  {
    name: "confounded",
    emoji: "😖"
  },
  {
    name: "tired_face",
    emoji: "😫"
  },
  {
    name: "weary",
    emoji: "😩"
  },
  {
    name: "triumph",
    emoji: "😤"
  },
  {
    name: "open_mouth",
    emoji: "😮"
  },
  {
    name: "scream",
    emoji: "😱"
  },
  {
    name: "fearful",
    emoji: "😨"
  },
  {
    name: "cold_sweat",
    emoji: "😰"
  },
  {
    name: "hushed",
    emoji: "😯"
  },
  {
    name: "frowning_with_open_mouth",
    emoji: "😦"
  },
  {
    name: "anguished",
    emoji: "😧"
  },
  {
    name: "cry",
    emoji: "😢"
  },
  {
    name: "disappointed_relieved",
    emoji: "😥"
  },
  {
    name: "drooling_face",
    emoji: "🤤"
  },
  {
    name: "sleepy",
    emoji: "😪"
  },
  {
    name: "sweat",
    emoji: "😓"
  },
  {
    name: "sob",
    emoji: "😭"
  },
  {
    name: "dizzy_face",
    emoji: "😵"
  },
  {
    name: "astonished",
    emoji: "😲"
  },
  {
    name: "zipper_mouth_face",
    emoji: "🤐"
  },
  {
    name: "nauseated_face",
    emoji: "🤢"
  },
  {
    name: "sneezing_face",
    emoji: "🤧"
  },
  {
    name: "mask",
    emoji: "😷"
  },
  {
    name: "face_with_thermometer",
    emoji: "🤒"
  },
  {
    name: "face_with_head_bandage",
    emoji: "🤕"
  },
  {
    name: "sleeping",
    emoji: "😴"
  },
  {
    name: "zzz",
    emoji: "💤"
  },
  {
    name: "poop",
    emoji: "💩"
  },
  {
    name: "smiling_imp",
    emoji: "😈"
  },
  {
    name: "imp",
    emoji: "👿"
  },
  {
    name: "japanese_ogre",
    emoji: "👹"
  },
  {
    name: "japanese_goblin",
    emoji: "👺"
  },
  {
    name: "skull",
    emoji: "💀"
  },
  {
    name: "ghost",
    emoji: "👻"
  },
  {
    name: "alien",
    emoji: "👽"
  },
  {
    name: "robot",
    emoji: "🤖"
  },
  {
    name: "smiley_cat",
    emoji: "😺"
  },
  {
    name: "smile_cat",
    emoji: "😸"
  },
  {
    name: "joy_cat",
    emoji: "😹"
  },
  {
    name: "heart_eyes_cat",
    emoji: "😻"
  },
  {
    name: "smirk_cat",
    emoji: "😼"
  },
  {
    name: "kissing_cat",
    emoji: "😽"
  },
  {
    name: "scream_cat",
    emoji: "🙀"
  },
  {
    name: "crying_cat_face",
    emoji: "😿"
  },
  {
    name: "pouting_cat",
    emoji: "😾"
  },
  {
    name: "raised_hands",
    emoji: "🙌"
  },
  {
    name: "clap",
    emoji: "👏"
  },
  {
    name: "wave",
    emoji: "👋"
  },
  {
    name: "call_me_hand",
    emoji: "🤙"
  },
  {
    name: "+1",
    emoji: "👍"
  },
  {
    name: "-1",
    emoji: "👎"
  },
  {
    name: "facepunch",
    emoji: "👊"
  },
  {
    name: "fist",
    emoji: "✊"
  },
  {
    name: "fist_left",
    emoji: "🤛"
  },
  {
    name: "fist_right",
    emoji: "🤜"
  },
  {
    name: "v",
    emoji: "✌"
  },
  {
    name: "ok_hand",
    emoji: "👌"
  },
  {
    name: "raised_hand",
    emoji: "✋"
  },
  {
    name: "raised_back_of_hand",
    emoji: "🤚"
  },
  {
    name: "open_hands",
    emoji: "👐"
  },
  {
    name: "muscle",
    emoji: "💪"
  },
  {
    name: "pray",
    emoji: "🙏"
  },
  {
    name: "handshake",
    emoji: "🤝"
  },
  {
    name: "point_up",
    emoji: "☝"
  },
  {
    name: "point_up_2",
    emoji: "👆"
  },
  {
    name: "point_down",
    emoji: "👇"
  },
  {
    name: "point_left",
    emoji: "👈"
  },
  {
    name: "point_right",
    emoji: "👉"
  },
  {
    name: "fu",
    emoji: "🖕"
  },
  {
    name: "raised_hand_with_fingers_splayed",
    emoji: "🖐"
  },
  {
    name: "metal",
    emoji: "🤘"
  },
  {
    name: "crossed_fingers",
    emoji: "🤞"
  },
  {
    name: "vulcan_salute",
    emoji: "🖖"
  },
  {
    name: "writing_hand",
    emoji: "✍"
  },
  {
    name: "selfie",
    emoji: "🤳"
  },
  {
    name: "nail_care",
    emoji: "💅"
  },
  {
    name: "lips",
    emoji: "👄"
  },
  {
    name: "tongue",
    emoji: "👅"
  },
  {
    name: "ear",
    emoji: "👂"
  },
  {
    name: "nose",
    emoji: "👃"
  },
  {
    name: "eye",
    emoji: "👁"
  },
  {
    name: "eyes",
    emoji: "👀"
  },
  {
    name: "bust_in_silhouette",
    emoji: "👤"
  },
  {
    name: "busts_in_silhouette",
    emoji: "👥"
  },
  {
    name: "speaking_head",
    emoji: "🗣"
  },
  {
    name: "baby",
    emoji: "👶"
  },
  {
    name: "boy",
    emoji: "👦"
  },
  {
    name: "girl",
    emoji: "👧"
  },
  {
    name: "man",
    emoji: "👨"
  },
  {
    name: "woman",
    emoji: "👩"
  },
  {
    name: "blonde_woman",
    emoji: "👱‍♀️"
  },
  {
    name: "blonde_man",
    emoji: "👱"
  },
  {
    name: "older_man",
    emoji: "👴"
  },
  {
    name: "older_woman",
    emoji: "👵"
  },
  {
    name: "man_with_gua_pi_mao",
    emoji: "👲"
  },
  {
    name: "woman_with_turban",
    emoji: "👳‍♀️"
  },
  {
    name: "man_with_turban",
    emoji: "👳"
  },
  {
    name: "policewoman",
    emoji: "👮‍♀️"
  },
  {
    name: "policeman",
    emoji: "👮"
  },
  {
    name: "construction_worker_woman",
    emoji: "👷‍♀️"
  },
  {
    name: "construction_worker_man",
    emoji: "👷"
  },
  {
    name: "guardswoman",
    emoji: "💂‍♀️"
  },
  {
    name: "guardsman",
    emoji: "💂"
  },
  {
    name: "female_detective",
    emoji: "🕵️‍♀"
  },
  {
    name: "male_detective",
    emoji: "🕵"
  },
  {
    name: "woman_health_worker",
    emoji: "👩‍⚕️"
  },
  {
    name: "man_health_worker",
    emoji: "👨‍⚕️"
  },
  {
    name: "woman_farmer",
    emoji: "👩‍🌾"
  },
  {
    name: "man_farmer",
    emoji: "👨‍🌾"
  },
  {
    name: "woman_cook",
    emoji: "👩‍🍳"
  },
  {
    name: "man_cook",
    emoji: "👨‍🍳"
  },
  {
    name: "woman_student",
    emoji: "👩‍🎓"
  },
  {
    name: "man_student",
    emoji: "👨‍🎓"
  },
  {
    name: "woman_singer",
    emoji: "👩‍🎤"
  },
  {
    name: "man_singer",
    emoji: "👨‍🎤"
  },
  {
    name: "woman_teacher",
    emoji: "👩‍🏫"
  },
  {
    name: "man_teacher",
    emoji: "👨‍🏫"
  },
  {
    name: "woman_factory_worker",
    emoji: "👩‍🏭"
  },
  {
    name: "man_factory_worker",
    emoji: "👨‍🏭"
  },
  {
    name: "woman_technologist",
    emoji: "👩‍💻"
  },
  {
    name: "man_technologist",
    emoji: "👨‍💻"
  },
  {
    name: "woman_office_worker",
    emoji: "👩‍💼"
  },
  {
    name: "man_office_worker",
    emoji: "👨‍💼"
  },
  {
    name: "woman_mechanic",
    emoji: "👩‍🔧"
  },
  {
    name: "man_mechanic",
    emoji: "👨‍🔧"
  },
  {
    name: "woman_scientist",
    emoji: "👩‍🔬"
  },
  {
    name: "man_scientist",
    emoji: "👨‍🔬"
  },
  {
    name: "woman_artist",
    emoji: "👩‍🎨"
  },
  {
    name: "man_artist",
    emoji: "👨‍🎨"
  },
  {
    name: "woman_firefighter",
    emoji: "👩‍🚒"
  },
  {
    name: "man_firefighter",
    emoji: "👨‍🚒"
  },
  {
    name: "woman_pilot",
    emoji: "👩‍✈️"
  },
  {
    name: "man_pilot",
    emoji: "👨‍✈️"
  },
  {
    name: "woman_astronaut",
    emoji: "👩‍🚀"
  },
  {
    name: "man_astronaut",
    emoji: "👨‍🚀"
  },
  {
    name: "woman_judge",
    emoji: "👩‍⚖️"
  },
  {
    name: "man_judge",
    emoji: "👨‍⚖️"
  },
  {
    name: "mrs_claus",
    emoji: "🤶"
  },
  {
    name: "santa",
    emoji: "🎅"
  },
  {
    name: "angel",
    emoji: "👼"
  },
  {
    name: "pregnant_woman",
    emoji: "🤰"
  },
  {
    name: "princess",
    emoji: "👸"
  },
  {
    name: "prince",
    emoji: "🤴"
  },
  {
    name: "bride_with_veil",
    emoji: "👰"
  },
  {
    name: "person_in_tuxedo",
    emoji: "🤵"
  },
  {
    name: "running_woman",
    emoji: "🏃‍♀️"
  },
  {
    name: "running_man",
    emoji: "🏃"
  },
  {
    name: "walking_woman",
    emoji: "🚶‍♀️"
  },
  {
    name: "walking_man",
    emoji: "🚶"
  },
  {
    name: "dancer",
    emoji: "💃"
  },
  {
    name: "man_dancing",
    emoji: "🕺"
  },
  {
    name: "dancing_women",
    emoji: "👯"
  },
  {
    name: "dancing_men",
    emoji: "👯‍♂"
  },
  {
    name: "couple",
    emoji: "👫"
  },
  {
    name: "two_men_holding_hands",
    emoji: "👬"
  },
  {
    name: "two_women_holding_hands",
    emoji: "👭"
  },
  {
    name: "bowing_woman",
    emoji: "🙇‍♀️"
  },
  {
    name: "bowing_man",
    emoji: "🙇"
  },
  {
    name: "man_facepalming",
    emoji: "🤦‍♂️"
  },
  {
    name: "woman_facepalming",
    emoji: "🤦‍♀️"
  },
  {
    name: "woman_shrugging",
    emoji: "🤷‍♀️"
  },
  {
    name: "man_shrugging",
    emoji: "🤷‍♂️"
  },
  {
    name: "tipping_hand_woman",
    emoji: "💁‍♀️"
  },
  {
    name: "tipping_hand_man",
    emoji: "💁‍♂️"
  },
  {
    name: "no_good_woman",
    emoji: "🙅‍♀️"
  },
  {
    name: "no_good_man",
    emoji: "🙅‍♂️"
  },
  {
    name: "ok_woman",
    emoji: "🙆‍♀️"
  },
  {
    name: "ok_man",
    emoji: "🙆‍♂️"
  },
  {
    name: "raising_hand_woman",
    emoji: "🙋‍♀️"
  },
  {
    name: "raising_hand_man",
    emoji: "🙋‍♂️"
  },
  {
    name: "pouting_woman",
    emoji: "🙎‍♀️"
  },
  {
    name: "pouting_man",
    emoji: "🙎‍♂️"
  },
  {
    name: "frowning_woman",
    emoji: "🙍‍♀️"
  },
  {
    name: "frowning_man",
    emoji: "🙍‍♂️"
  },
  {
    name: "haircut_woman",
    emoji: "💇‍♀️"
  },
  {
    name: "haircut_man",
    emoji: "💇‍♂️"
  },
  {
    name: "massage_woman",
    emoji: "💆‍♀️"
  },
  {
    name: "massage_man",
    emoji: "💆‍♂️"
  },
  {
    name: "couple_with_heart",
    emoji: "💑"
  },
  {
    name: "couple_with_heart_woman_woman",
    emoji: "👩‍❤️‍👩"
  },
  {
    name: "couple_with_heart_man_man",
    emoji: "👨‍❤️‍👨"
  },
  {
    name: "couplekiss_man_woman",
    emoji: "💏"
  },
  {
    name: "couplekiss_woman_woman",
    emoji: "👩‍❤️‍💋‍👩"
  },
  {
    name: "couplekiss_man_man",
    emoji: "👨‍❤️‍💋‍👨"
  },
  {
    name: "family",
    emoji: "👪"
  },
  {
    name: "family_man_woman_girl",
    emoji: "👨‍👩‍👧"
  },
  {
    name: "family_man_woman_girl_boy",
    emoji: "👨‍👩‍👧‍👦"
  },
  {
    name: "family_man_woman_boy_boy",
    emoji: "👨‍👩‍👦‍👦"
  },
  {
    name: "family_man_woman_girl_girl",
    emoji: "👨‍👩‍👧‍👧"
  },
  {
    name: "family_woman_woman_boy",
    emoji: "👩‍👩‍👦"
  },
  {
    name: "family_woman_woman_girl",
    emoji: "👩‍👩‍👧"
  },
  {
    name: "family_woman_woman_girl_boy",
    emoji: "👩‍👩‍👧‍👦"
  },
  {
    name: "family_woman_woman_boy_boy",
    emoji: "👩‍👩‍👦‍👦"
  },
  {
    name: "family_woman_woman_girl_girl",
    emoji: "👩‍👩‍👧‍👧"
  },
  {
    name: "family_man_man_boy",
    emoji: "👨‍👨‍👦"
  },
  {
    name: "family_man_man_girl",
    emoji: "👨‍👨‍👧"
  },
  {
    name: "family_man_man_girl_boy",
    emoji: "👨‍👨‍👧‍👦"
  },
  {
    name: "family_man_man_boy_boy",
    emoji: "👨‍👨‍👦‍👦"
  },
  {
    name: "family_man_man_girl_girl",
    emoji: "👨‍👨‍👧‍👧"
  },
  {
    name: "family_woman_boy",
    emoji: "👩‍👦"
  },
  {
    name: "family_woman_girl",
    emoji: "👩‍👧"
  },
  {
    name: "family_woman_girl_boy",
    emoji: "👩‍👧‍👦"
  },
  {
    name: "family_woman_boy_boy",
    emoji: "👩‍👦‍👦"
  },
  {
    name: "family_woman_girl_girl",
    emoji: "👩‍👧‍👧"
  },
  {
    name: "family_man_boy",
    emoji: "👨‍👦"
  },
  {
    name: "family_man_girl",
    emoji: "👨‍👧"
  },
  {
    name: "family_man_girl_boy",
    emoji: "👨‍👧‍👦"
  },
  {
    name: "family_man_boy_boy",
    emoji: "👨‍👦‍👦"
  },
  {
    name: "family_man_girl_girl",
    emoji: "👨‍👧‍👧"
  },
  {
    name: "womans_clothes",
    emoji: "👚"
  },
  {
    name: "tshirt",
    emoji: "👕"
  },
  {
    name: "jeans",
    emoji: "👖"
  },
  {
    name: "necktie",
    emoji: "👔"
  },
  {
    name: "dress",
    emoji: "👗"
  },
  {
    name: "bikini",
    emoji: "👙"
  },
  {
    name: "kimono",
    emoji: "👘"
  },
  {
    name: "lipstick",
    emoji: "💄"
  },
  {
    name: "kiss",
    emoji: "💋"
  },
  {
    name: "footprints",
    emoji: "👣"
  },
  {
    name: "high_heel",
    emoji: "👠"
  },
  {
    name: "sandal",
    emoji: "👡"
  },
  {
    name: "boot",
    emoji: "👢"
  },
  {
    name: "mans_shoe",
    emoji: "👞"
  },
  {
    name: "athletic_shoe",
    emoji: "👟"
  },
  {
    name: "womans_hat",
    emoji: "👒"
  },
  {
    name: "tophat",
    emoji: "🎩"
  },
  {
    name: "rescue_worker_helmet",
    emoji: "⛑"
  },
  {
    name: "mortar_board",
    emoji: "🎓"
  },
  {
    name: "crown",
    emoji: "👑"
  },
  {
    name: "school_satchel",
    emoji: "🎒"
  },
  {
    name: "pouch",
    emoji: "👝"
  },
  {
    name: "purse",
    emoji: "👛"
  },
  {
    name: "handbag",
    emoji: "👜"
  },
  {
    name: "briefcase",
    emoji: "💼"
  },
  {
    name: "eyeglasses",
    emoji: "👓"
  },
  {
    name: "dark_sunglasses",
    emoji: "🕶"
  },
  {
    name: "ring",
    emoji: "💍"
  },
  {
    name: "closed_umbrella",
    emoji: "🌂"
  },
  {
    name: "dog",
    emoji: "🐶"
  },
  {
    name: "cat",
    emoji: "🐱"
  },
  {
    name: "mouse",
    emoji: "🐭"
  },
  {
    name: "hamster",
    emoji: "🐹"
  },
  {
    name: "rabbit",
    emoji: "🐰"
  },
  {
    name: "fox_face",
    emoji: "🦊"
  },
  {
    name: "bear",
    emoji: "🐻"
  },
  {
    name: "panda_face",
    emoji: "🐼"
  },
  {
    name: "koala",
    emoji: "🐨"
  },
  {
    name: "tiger",
    emoji: "🐯"
  },
  {
    name: "lion",
    emoji: "🦁"
  },
  {
    name: "cow",
    emoji: "🐮"
  },
  {
    name: "pig",
    emoji: "🐷"
  },
  {
    name: "pig_nose",
    emoji: "🐽"
  },
  {
    name: "frog",
    emoji: "🐸"
  },
  {
    name: "squid",
    emoji: "🦑"
  },
  {
    name: "octopus",
    emoji: "🐙"
  },
  {
    name: "shrimp",
    emoji: "🦐"
  },
  {
    name: "monkey_face",
    emoji: "🐵"
  },
  {
    name: "gorilla",
    emoji: "🦍"
  },
  {
    name: "see_no_evil",
    emoji: "🙈"
  },
  {
    name: "hear_no_evil",
    emoji: "🙉"
  },
  {
    name: "speak_no_evil",
    emoji: "🙊"
  },
  {
    name: "monkey",
    emoji: "🐒"
  },
  {
    name: "chicken",
    emoji: "🐔"
  },
  {
    name: "penguin",
    emoji: "🐧"
  },
  {
    name: "bird",
    emoji: "🐦"
  },
  {
    name: "baby_chick",
    emoji: "🐤"
  },
  {
    name: "hatching_chick",
    emoji: "🐣"
  },
  {
    name: "hatched_chick",
    emoji: "🐥"
  },
  {
    name: "duck",
    emoji: "🦆"
  },
  {
    name: "eagle",
    emoji: "🦅"
  },
  {
    name: "owl",
    emoji: "🦉"
  },
  {
    name: "bat",
    emoji: "🦇"
  },
  {
    name: "wolf",
    emoji: "🐺"
  },
  {
    name: "boar",
    emoji: "🐗"
  },
  {
    name: "horse",
    emoji: "🐴"
  },
  {
    name: "unicorn",
    emoji: "🦄"
  },
  {
    name: "honeybee",
    emoji: "🐝"
  },
  {
    name: "bug",
    emoji: "🐛"
  },
  {
    name: "butterfly",
    emoji: "🦋"
  },
  {
    name: "snail",
    emoji: "🐌"
  },
  {
    name: "lady_beetle",
    emoji: "🐞"
  },
  {
    name: "ant",
    emoji: "🐜"
  },
  {
    name: "spider",
    emoji: "🕷"
  },
  {
    name: "scorpion",
    emoji: "🦂"
  },
  {
    name: "crab",
    emoji: "🦀"
  },
  {
    name: "snake",
    emoji: "🐍"
  },
  {
    name: "lizard",
    emoji: "🦎"
  },
  {
    name: "turtle",
    emoji: "🐢"
  },
  {
    name: "tropical_fish",
    emoji: "🐠"
  },
  {
    name: "fish",
    emoji: "🐟"
  },
  {
    name: "blowfish",
    emoji: "🐡"
  },
  {
    name: "dolphin",
    emoji: "🐬"
  },
  {
    name: "shark",
    emoji: "🦈"
  },
  {
    name: "whale",
    emoji: "🐳"
  },
  {
    name: "whale2",
    emoji: "🐋"
  },
  {
    name: "crocodile",
    emoji: "🐊"
  },
  {
    name: "leopard",
    emoji: "🐆"
  },
  {
    name: "tiger2",
    emoji: "🐅"
  },
  {
    name: "water_buffalo",
    emoji: "🐃"
  },
  {
    name: "ox",
    emoji: "🐂"
  },
  {
    name: "cow2",
    emoji: "🐄"
  },
  {
    name: "deer",
    emoji: "🦌"
  },
  {
    name: "dromedary_camel",
    emoji: "🐪"
  },
  {
    name: "camel",
    emoji: "🐫"
  },
  {
    name: "elephant",
    emoji: "🐘"
  },
  {
    name: "rhinoceros",
    emoji: "🦏"
  },
  {
    name: "goat",
    emoji: "🐐"
  },
  {
    name: "ram",
    emoji: "🐏"
  },
  {
    name: "sheep",
    emoji: "🐑"
  },
  {
    name: "racehorse",
    emoji: "🐎"
  },
  {
    name: "pig2",
    emoji: "🐖"
  },
  {
    name: "rat",
    emoji: "🐀"
  },
  {
    name: "mouse2",
    emoji: "🐁"
  },
  {
    name: "rooster",
    emoji: "🐓"
  },
  {
    name: "turkey",
    emoji: "🦃"
  },
  {
    name: "dove",
    emoji: "🕊"
  },
  {
    name: "dog2",
    emoji: "🐕"
  },
  {
    name: "poodle",
    emoji: "🐩"
  },
  {
    name: "cat2",
    emoji: "🐈"
  },
  {
    name: "rabbit2",
    emoji: "🐇"
  },
  {
    name: "chipmunk",
    emoji: "🐿"
  },
  {
    name: "paw_prints",
    emoji: "🐾"
  },
  {
    name: "dragon",
    emoji: "🐉"
  },
  {
    name: "dragon_face",
    emoji: "🐲"
  },
  {
    name: "cactus",
    emoji: "🌵"
  },
  {
    name: "christmas_tree",
    emoji: "🎄"
  },
  {
    name: "evergreen_tree",
    emoji: "🌲"
  },
  {
    name: "deciduous_tree",
    emoji: "🌳"
  },
  {
    name: "palm_tree",
    emoji: "🌴"
  },
  {
    name: "seedling",
    emoji: "🌱"
  },
  {
    name: "herb",
    emoji: "🌿"
  },
  {
    name: "shamrock",
    emoji: "☘"
  },
  {
    name: "four_leaf_clover",
    emoji: "🍀"
  },
  {
    name: "bamboo",
    emoji: "🎍"
  },
  {
    name: "tanabata_tree",
    emoji: "🎋"
  },
  {
    name: "leaves",
    emoji: "🍃"
  },
  {
    name: "fallen_leaf",
    emoji: "🍂"
  },
  {
    name: "maple_leaf",
    emoji: "🍁"
  },
  {
    name: "ear_of_rice",
    emoji: "🌾"
  },
  {
    name: "hibiscus",
    emoji: "🌺"
  },
  {
    name: "sunflower",
    emoji: "🌻"
  },
  {
    name: "rose",
    emoji: "🌹"
  },
  {
    name: "wilted_flower",
    emoji: "🥀"
  },
  {
    name: "tulip",
    emoji: "🌷"
  },
  {
    name: "blossom",
    emoji: "🌼"
  },
  {
    name: "cherry_blossom",
    emoji: "🌸"
  },
  {
    name: "bouquet",
    emoji: "💐"
  },
  {
    name: "mushroom",
    emoji: "🍄"
  },
  {
    name: "chestnut",
    emoji: "🌰"
  },
  {
    name: "jack_o_lantern",
    emoji: "🎃"
  },
  {
    name: "shell",
    emoji: "🐚"
  },
  {
    name: "spider_web",
    emoji: "🕸"
  },
  {
    name: "earth_americas",
    emoji: "🌎"
  },
  {
    name: "earth_africa",
    emoji: "🌍"
  },
  {
    name: "earth_asia",
    emoji: "🌏"
  },
  {
    name: "full_moon",
    emoji: "🌕"
  },
  {
    name: "waning_gibbous_moon",
    emoji: "🌖"
  },
  {
    name: "last_quarter_moon",
    emoji: "🌗"
  },
  {
    name: "waning_crescent_moon",
    emoji: "🌘"
  },
  {
    name: "new_moon",
    emoji: "🌑"
  },
  {
    name: "waxing_crescent_moon",
    emoji: "🌒"
  },
  {
    name: "first_quarter_moon",
    emoji: "🌓"
  },
  {
    name: "waxing_gibbous_moon",
    emoji: "🌔"
  },
  {
    name: "new_moon_with_face",
    emoji: "🌚"
  },
  {
    name: "full_moon_with_face",
    emoji: "🌝"
  },
  {
    name: "first_quarter_moon_with_face",
    emoji: "🌛"
  },
  {
    name: "last_quarter_moon_with_face",
    emoji: "🌜"
  },
  {
    name: "sun_with_face",
    emoji: "🌞"
  },
  {
    name: "crescent_moon",
    emoji: "🌙"
  },
  {
    name: "star",
    emoji: "⭐"
  },
  {
    name: "star2",
    emoji: "🌟"
  },
  {
    name: "dizzy",
    emoji: "💫"
  },
  {
    name: "sparkles",
    emoji: "✨"
  },
  {
    name: "comet",
    emoji: "☄"
  },
  {
    name: "sunny",
    emoji: "☀"
  },
  {
    name: "sun_behind_small_cloud",
    emoji: "🌤"
  },
  {
    name: "partly_sunny",
    emoji: "⛅"
  },
  {
    name: "sun_behind_large_cloud",
    emoji: "🌥"
  },
  {
    name: "sun_behind_rain_cloud",
    emoji: "🌦"
  },
  {
    name: "cloud",
    emoji: "☁"
  },
  {
    name: "cloud_with_rain",
    emoji: "🌧"
  },
  {
    name: "cloud_with_lightning_and_rain",
    emoji: "⛈"
  },
  {
    name: "cloud_with_lightning",
    emoji: "🌩"
  },
  {
    name: "zap",
    emoji: "⚡"
  },
  {
    name: "fire",
    emoji: "🔥"
  },
  {
    name: "boom",
    emoji: "💥"
  },
  {
    name: "snowflake",
    emoji: "❄"
  },
  {
    name: "cloud_with_snow",
    emoji: "🌨"
  },
  {
    name: "snowman",
    emoji: "⛄"
  },
  {
    name: "snowman_with_snow",
    emoji: "☃"
  },
  {
    name: "wind_face",
    emoji: "🌬"
  },
  {
    name: "dash",
    emoji: "💨"
  },
  {
    name: "tornado",
    emoji: "🌪"
  },
  {
    name: "fog",
    emoji: "🌫"
  },
  {
    name: "open_umbrella",
    emoji: "☂"
  },
  {
    name: "umbrella",
    emoji: "☔"
  },
  {
    name: "droplet",
    emoji: "💧"
  },
  {
    name: "sweat_drops",
    emoji: "💦"
  },
  {
    name: "ocean",
    emoji: "🌊"
  },
  {
    name: "green_apple",
    emoji: "🍏"
  },
  {
    name: "apple",
    emoji: "🍎"
  },
  {
    name: "pear",
    emoji: "🍐"
  },
  {
    name: "tangerine",
    emoji: "🍊"
  },
  {
    name: "lemon",
    emoji: "🍋"
  },
  {
    name: "banana",
    emoji: "🍌"
  },
  {
    name: "watermelon",
    emoji: "🍉"
  },
  {
    name: "grapes",
    emoji: "🍇"
  },
  {
    name: "strawberry",
    emoji: "🍓"
  },
  {
    name: "melon",
    emoji: "🍈"
  },
  {
    name: "cherries",
    emoji: "🍒"
  },
  {
    name: "peach",
    emoji: "🍑"
  },
  {
    name: "pineapple",
    emoji: "🍍"
  },
  {
    name: "kiwi_fruit",
    emoji: "🥝"
  },
  {
    name: "avocado",
    emoji: "🥑"
  },
  {
    name: "tomato",
    emoji: "🍅"
  },
  {
    name: "eggplant",
    emoji: "🍆"
  },
  {
    name: "cucumber",
    emoji: "🥒"
  },
  {
    name: "carrot",
    emoji: "🥕"
  },
  {
    name: "hot_pepper",
    emoji: "🌶"
  },
  {
    name: "potato",
    emoji: "🥔"
  },
  {
    name: "corn",
    emoji: "🌽"
  },
  {
    name: "sweet_potato",
    emoji: "🍠"
  },
  {
    name: "peanuts",
    emoji: "🥜"
  },
  {
    name: "honey_pot",
    emoji: "🍯"
  },
  {
    name: "croissant",
    emoji: "🥐"
  },
  {
    name: "bread",
    emoji: "🍞"
  },
  {
    name: "baguette_bread",
    emoji: "🥖"
  },
  {
    name: "cheese",
    emoji: "🧀"
  },
  {
    name: "egg",
    emoji: "🥚"
  },
  {
    name: "bacon",
    emoji: "🥓"
  },
  {
    name: "pancakes",
    emoji: "🥞"
  },
  {
    name: "poultry_leg",
    emoji: "🍗"
  },
  {
    name: "meat_on_bone",
    emoji: "🍖"
  },
  {
    name: "fried_shrimp",
    emoji: "🍤"
  },
  {
    name: "fried_egg",
    emoji: "🍳"
  },
  {
    name: "hamburger",
    emoji: "🍔"
  },
  {
    name: "fries",
    emoji: "🍟"
  },
  {
    name: "stuffed_flatbread",
    emoji: "🥙"
  },
  {
    name: "hotdog",
    emoji: "🌭"
  },
  {
    name: "pizza",
    emoji: "🍕"
  },
  {
    name: "spaghetti",
    emoji: "🍝"
  },
  {
    name: "taco",
    emoji: "🌮"
  },
  {
    name: "burrito",
    emoji: "🌯"
  },
  {
    name: "green_salad",
    emoji: "🥗"
  },
  {
    name: "shallow_pan_of_food",
    emoji: "🥘"
  },
  {
    name: "ramen",
    emoji: "🍜"
  },
  {
    name: "stew",
    emoji: "🍲"
  },
  {
    name: "fish_cake",
    emoji: "🍥"
  },
  {
    name: "sushi",
    emoji: "🍣"
  },
  {
    name: "bento",
    emoji: "🍱"
  },
  {
    name: "curry",
    emoji: "🍛"
  },
  {
    name: "rice_ball",
    emoji: "🍙"
  },
  {
    name: "rice",
    emoji: "🍚"
  },
  {
    name: "rice_cracker",
    emoji: "🍘"
  },
  {
    name: "oden",
    emoji: "🍢"
  },
  {
    name: "dango",
    emoji: "🍡"
  },
  {
    name: "shaved_ice",
    emoji: "🍧"
  },
  {
    name: "ice_cream",
    emoji: "🍨"
  },
  {
    name: "icecream",
    emoji: "🍦"
  },
  {
    name: "cake",
    emoji: "🍰"
  },
  {
    name: "birthday",
    emoji: "🎂"
  },
  {
    name: "custard",
    emoji: "🍮"
  },
  {
    name: "candy",
    emoji: "🍬"
  },
  {
    name: "lollipop",
    emoji: "🍭"
  },
  {
    name: "chocolate_bar",
    emoji: "🍫"
  },
  {
    name: "popcorn",
    emoji: "🍿"
  },
  {
    name: "doughnut",
    emoji: "🍩"
  },
  {
    name: "cookie",
    emoji: "🍪"
  },
  {
    name: "milk_glass",
    emoji: "🥛"
  },
  {
    name: "beer",
    emoji: "🍺"
  },
  {
    name: "beers",
    emoji: "🍻"
  },
  {
    name: "clinking_glasses",
    emoji: "🥂"
  },
  {
    name: "wine_glass",
    emoji: "🍷"
  },
  {
    name: "tumbler_glass",
    emoji: "🥃"
  },
  {
    name: "cocktail",
    emoji: "🍸"
  },
  {
    name: "tropical_drink",
    emoji: "🍹"
  },
  {
    name: "champagne",
    emoji: "🍾"
  },
  {
    name: "sake",
    emoji: "🍶"
  },
  {
    name: "tea",
    emoji: "🍵"
  },
  {
    name: "coffee",
    emoji: "☕"
  },
  {
    name: "baby_bottle",
    emoji: "🍼"
  },
  {
    name: "spoon",
    emoji: "🥄"
  },
  {
    name: "fork_and_knife",
    emoji: "🍴"
  },
  {
    name: "plate_with_cutlery",
    emoji: "🍽"
  },
  {
    name: "soccer",
    emoji: "⚽"
  },
  {
    name: "basketball",
    emoji: "🏀"
  },
  {
    name: "football",
    emoji: "🏈"
  },
  {
    name: "baseball",
    emoji: "⚾"
  },
  {
    name: "tennis",
    emoji: "🎾"
  },
  {
    name: "volleyball",
    emoji: "🏐"
  },
  {
    name: "rugby_football",
    emoji: "🏉"
  },
  {
    name: "8ball",
    emoji: "🎱"
  },
  {
    name: "golf",
    emoji: "⛳"
  },
  {
    name: "golfing_woman",
    emoji: "🏌️‍♀"
  },
  {
    name: "golfing_man",
    emoji: "🏌"
  },
  {
    name: "ping_pong",
    emoji: "🏓"
  },
  {
    name: "badminton",
    emoji: "🏸"
  },
  {
    name: "goal_net",
    emoji: "🥅"
  },
  {
    name: "ice_hockey",
    emoji: "🏒"
  },
  {
    name: "field_hockey",
    emoji: "🏑"
  },
  {
    name: "cricket_bat_and_ball",
    emoji: "🏏"
  },
  {
    name: "ski",
    emoji: "🎿"
  },
  {
    name: "skier",
    emoji: "⛷"
  },
  {
    name: "snowboarder",
    emoji: "🏂"
  },
  {
    name: "person_fencing",
    emoji: "🤺"
  },
  {
    name: "women_wrestling",
    emoji: "🤼‍♀"
  },
  {
    name: "men_wrestling",
    emoji: "🤼‍♂"
  },
  {
    name: "woman_cartwheeling",
    emoji: "🤸‍♀️"
  },
  {
    name: "man_cartwheeling",
    emoji: "🤸‍♂️"
  },
  {
    name: "woman_playing_handball",
    emoji: "🤾‍♀️"
  },
  {
    name: "man_playing_handball",
    emoji: "🤾‍♂️"
  },
  {
    name: "ice_skate",
    emoji: "⛸"
  },
  {
    name: "bow_and_arrow",
    emoji: "🏹"
  },
  {
    name: "fishing_pole_and_fish",
    emoji: "🎣"
  },
  {
    name: "boxing_glove",
    emoji: "🥊"
  },
  {
    name: "martial_arts_uniform",
    emoji: "🥋"
  },
  {
    name: "rowing_woman",
    emoji: "🚣‍♀️"
  },
  {
    name: "rowing_man",
    emoji: "🚣"
  },
  {
    name: "swimming_woman",
    emoji: "🏊‍♀️"
  },
  {
    name: "swimming_man",
    emoji: "🏊"
  },
  {
    name: "woman_playing_water_polo",
    emoji: "🤽‍♀️"
  },
  {
    name: "man_playing_water_polo",
    emoji: "🤽‍♂️"
  },
  {
    name: "surfing_woman",
    emoji: "🏄‍♀️"
  },
  {
    name: "surfing_man",
    emoji: "🏄"
  },
  {
    name: "bath",
    emoji: "🛀"
  },
  {
    name: "basketball_woman",
    emoji: "⛹️‍♀"
  },
  {
    name: "basketball_man",
    emoji: "⛹"
  },
  {
    name: "weight_lifting_woman",
    emoji: "🏋️‍♀"
  },
  {
    name: "weight_lifting_man",
    emoji: "🏋"
  },
  {
    name: "biking_woman",
    emoji: "🚴‍♀️"
  },
  {
    name: "biking_man",
    emoji: "🚴"
  },
  {
    name: "mountain_biking_woman",
    emoji: "🚵‍♀️"
  },
  {
    name: "mountain_biking_man",
    emoji: "🚵"
  },
  {
    name: "horse_racing",
    emoji: "🏇"
  },
  {
    name: "business_suit_levitating",
    emoji: "🕴"
  },
  {
    name: "trophy",
    emoji: "🏆"
  },
  {
    name: "running_shirt_with_sash",
    emoji: "🎽"
  },
  {
    name: "medal_sports",
    emoji: "🏅"
  },
  {
    name: "medal_military",
    emoji: "🎖"
  },
  {
    name: "1st_place_medal",
    emoji: "🥇"
  },
  {
    name: "2nd_place_medal",
    emoji: "🥈"
  },
  {
    name: "3rd_place_medal",
    emoji: "🥉"
  },
  {
    name: "reminder_ribbon",
    emoji: "🎗"
  },
  {
    name: "rosette",
    emoji: "🏵"
  },
  {
    name: "ticket",
    emoji: "🎫"
  },
  {
    name: "tickets",
    emoji: "🎟"
  },
  {
    name: "performing_arts",
    emoji: "🎭"
  },
  {
    name: "art",
    emoji: "🎨"
  },
  {
    name: "circus_tent",
    emoji: "🎪"
  },
  {
    name: "woman_juggling",
    emoji: "🤹‍♀️"
  },
  {
    name: "man_juggling",
    emoji: "🤹‍♂️"
  },
  {
    name: "microphone",
    emoji: "🎤"
  },
  {
    name: "headphones",
    emoji: "🎧"
  },
  {
    name: "musical_score",
    emoji: "🎼"
  },
  {
    name: "musical_keyboard",
    emoji: "🎹"
  },
  {
    name: "drum",
    emoji: "🥁"
  },
  {
    name: "saxophone",
    emoji: "🎷"
  },
  {
    name: "trumpet",
    emoji: "🎺"
  },
  {
    name: "guitar",
    emoji: "🎸"
  },
  {
    name: "violin",
    emoji: "🎻"
  },
  {
    name: "clapper",
    emoji: "🎬"
  },
  {
    name: "video_game",
    emoji: "🎮"
  },
  {
    name: "space_invader",
    emoji: "👾"
  },
  {
    name: "dart",
    emoji: "🎯"
  },
  {
    name: "game_die",
    emoji: "🎲"
  },
  {
    name: "slot_machine",
    emoji: "🎰"
  },
  {
    name: "bowling",
    emoji: "🎳"
  },
  {
    name: "red_car",
    emoji: "🚗"
  },
  {
    name: "taxi",
    emoji: "🚕"
  },
  {
    name: "blue_car",
    emoji: "🚙"
  },
  {
    name: "bus",
    emoji: "🚌"
  },
  {
    name: "trolleybus",
    emoji: "🚎"
  },
  {
    name: "racing_car",
    emoji: "🏎"
  },
  {
    name: "police_car",
    emoji: "🚓"
  },
  {
    name: "ambulance",
    emoji: "🚑"
  },
  {
    name: "fire_engine",
    emoji: "🚒"
  },
  {
    name: "minibus",
    emoji: "🚐"
  },
  {
    name: "truck",
    emoji: "🚚"
  },
  {
    name: "articulated_lorry",
    emoji: "🚛"
  },
  {
    name: "tractor",
    emoji: "🚜"
  },
  {
    name: "kick_scooter",
    emoji: "🛴"
  },
  {
    name: "motorcycle",
    emoji: "🏍"
  },
  {
    name: "bike",
    emoji: "🚲"
  },
  {
    name: "motor_scooter",
    emoji: "🛵"
  },
  {
    name: "rotating_light",
    emoji: "🚨"
  },
  {
    name: "oncoming_police_car",
    emoji: "🚔"
  },
  {
    name: "oncoming_bus",
    emoji: "🚍"
  },
  {
    name: "oncoming_automobile",
    emoji: "🚘"
  },
  {
    name: "oncoming_taxi",
    emoji: "🚖"
  },
  {
    name: "aerial_tramway",
    emoji: "🚡"
  },
  {
    name: "mountain_cableway",
    emoji: "🚠"
  },
  {
    name: "suspension_railway",
    emoji: "🚟"
  },
  {
    name: "railway_car",
    emoji: "🚃"
  },
  {
    name: "train",
    emoji: "🚋"
  },
  {
    name: "monorail",
    emoji: "🚝"
  },
  {
    name: "bullettrain_side",
    emoji: "🚄"
  },
  {
    name: "bullettrain_front",
    emoji: "🚅"
  },
  {
    name: "light_rail",
    emoji: "🚈"
  },
  {
    name: "mountain_railway",
    emoji: "🚞"
  },
  {
    name: "steam_locomotive",
    emoji: "🚂"
  },
  {
    name: "train2",
    emoji: "🚆"
  },
  {
    name: "metro",
    emoji: "🚇"
  },
  {
    name: "tram",
    emoji: "🚊"
  },
  {
    name: "station",
    emoji: "🚉"
  },
  {
    name: "helicopter",
    emoji: "🚁"
  },
  {
    name: "small_airplane",
    emoji: "🛩"
  },
  {
    name: "airplane",
    emoji: "✈"
  },
  {
    name: "flight_departure",
    emoji: "🛫"
  },
  {
    name: "flight_arrival",
    emoji: "🛬"
  },
  {
    name: "sailboat",
    emoji: "⛵"
  },
  {
    name: "motor_boat",
    emoji: "🛥"
  },
  {
    name: "speedboat",
    emoji: "🚤"
  },
  {
    name: "ferry",
    emoji: "⛴"
  },
  {
    name: "passenger_ship",
    emoji: "🛳"
  },
  {
    name: "rocket",
    emoji: "🚀"
  },
  {
    name: "artificial_satellite",
    emoji: "🛰"
  },
  {
    name: "seat",
    emoji: "💺"
  },
  {
    name: "canoe",
    emoji: "🛶"
  },
  {
    name: "anchor",
    emoji: "⚓"
  },
  {
    name: "construction",
    emoji: "🚧"
  },
  {
    name: "fuelpump",
    emoji: "⛽"
  },
  {
    name: "busstop",
    emoji: "🚏"
  },
  {
    name: "vertical_traffic_light",
    emoji: "🚦"
  },
  {
    name: "traffic_light",
    emoji: "🚥"
  },
  {
    name: "checkered_flag",
    emoji: "🏁"
  },
  {
    name: "ship",
    emoji: "🚢"
  },
  {
    name: "ferris_wheel",
    emoji: "🎡"
  },
  {
    name: "roller_coaster",
    emoji: "🎢"
  },
  {
    name: "carousel_horse",
    emoji: "🎠"
  },
  {
    name: "building_construction",
    emoji: "🏗"
  },
  {
    name: "foggy",
    emoji: "🌁"
  },
  {
    name: "tokyo_tower",
    emoji: "🗼"
  },
  {
    name: "factory",
    emoji: "🏭"
  },
  {
    name: "fountain",
    emoji: "⛲"
  },
  {
    name: "rice_scene",
    emoji: "🎑"
  },
  {
    name: "mountain",
    emoji: "⛰"
  },
  {
    name: "mountain_snow",
    emoji: "🏔"
  },
  {
    name: "mount_fuji",
    emoji: "🗻"
  },
  {
    name: "volcano",
    emoji: "🌋"
  },
  {
    name: "japan",
    emoji: "🗾"
  },
  {
    name: "camping",
    emoji: "🏕"
  },
  {
    name: "tent",
    emoji: "⛺"
  },
  {
    name: "national_park",
    emoji: "🏞"
  },
  {
    name: "motorway",
    emoji: "🛣"
  },
  {
    name: "railway_track",
    emoji: "🛤"
  },
  {
    name: "sunrise",
    emoji: "🌅"
  },
  {
    name: "sunrise_over_mountains",
    emoji: "🌄"
  },
  {
    name: "desert",
    emoji: "🏜"
  },
  {
    name: "beach_umbrella",
    emoji: "🏖"
  },
  {
    name: "desert_island",
    emoji: "🏝"
  },
  {
    name: "city_sunrise",
    emoji: "🌇"
  },
  {
    name: "city_sunset",
    emoji: "🌆"
  },
  {
    name: "cityscape",
    emoji: "🏙"
  },
  {
    name: "night_with_stars",
    emoji: "🌃"
  },
  {
    name: "bridge_at_night",
    emoji: "🌉"
  },
  {
    name: "milky_way",
    emoji: "🌌"
  },
  {
    name: "stars",
    emoji: "🌠"
  },
  {
    name: "sparkler",
    emoji: "🎇"
  },
  {
    name: "fireworks",
    emoji: "🎆"
  },
  {
    name: "rainbow",
    emoji: "🌈"
  },
  {
    name: "houses",
    emoji: "🏘"
  },
  {
    name: "european_castle",
    emoji: "🏰"
  },
  {
    name: "japanese_castle",
    emoji: "🏯"
  },
  {
    name: "stadium",
    emoji: "🏟"
  },
  {
    name: "statue_of_liberty",
    emoji: "🗽"
  },
  {
    name: "house",
    emoji: "🏠"
  },
  {
    name: "house_with_garden",
    emoji: "🏡"
  },
  {
    name: "derelict_house",
    emoji: "🏚"
  },
  {
    name: "office",
    emoji: "🏢"
  },
  {
    name: "department_store",
    emoji: "🏬"
  },
  {
    name: "post_office",
    emoji: "🏣"
  },
  {
    name: "european_post_office",
    emoji: "🏤"
  },
  {
    name: "hospital",
    emoji: "🏥"
  },
  {
    name: "bank",
    emoji: "🏦"
  },
  {
    name: "hotel",
    emoji: "🏨"
  },
  {
    name: "convenience_store",
    emoji: "🏪"
  },
  {
    name: "school",
    emoji: "🏫"
  },
  {
    name: "love_hotel",
    emoji: "🏩"
  },
  {
    name: "wedding",
    emoji: "💒"
  },
  {
    name: "classical_building",
    emoji: "🏛"
  },
  {
    name: "church",
    emoji: "⛪"
  },
  {
    name: "mosque",
    emoji: "🕌"
  },
  {
    name: "synagogue",
    emoji: "🕍"
  },
  {
    name: "kaaba",
    emoji: "🕋"
  },
  {
    name: "shinto_shrine",
    emoji: "⛩"
  },
  {
    name: "watch",
    emoji: "⌚"
  },
  {
    name: "iphone",
    emoji: "📱"
  },
  {
    name: "calling",
    emoji: "📲"
  },
  {
    name: "computer",
    emoji: "💻"
  },
  {
    name: "keyboard",
    emoji: "⌨"
  },
  {
    name: "desktop_computer",
    emoji: "🖥"
  },
  {
    name: "printer",
    emoji: "🖨"
  },
  {
    name: "computer_mouse",
    emoji: "🖱"
  },
  {
    name: "trackball",
    emoji: "🖲"
  },
  {
    name: "joystick",
    emoji: "🕹"
  },
  {
    name: "clamp",
    emoji: "🗜"
  },
  {
    name: "minidisc",
    emoji: "💽"
  },
  {
    name: "floppy_disk",
    emoji: "💾"
  },
  {
    name: "cd",
    emoji: "💿"
  },
  {
    name: "dvd",
    emoji: "📀"
  },
  {
    name: "vhs",
    emoji: "📼"
  },
  {
    name: "camera",
    emoji: "📷"
  },
  {
    name: "camera_flash",
    emoji: "📸"
  },
  {
    name: "video_camera",
    emoji: "📹"
  },
  {
    name: "movie_camera",
    emoji: "🎥"
  },
  {
    name: "film_projector",
    emoji: "📽"
  },
  {
    name: "film_strip",
    emoji: "🎞"
  },
  {
    name: "telephone_receiver",
    emoji: "📞"
  },
  {
    name: "phone",
    emoji: "☎"
  },
  {
    name: "pager",
    emoji: "📟"
  },
  {
    name: "fax",
    emoji: "📠"
  },
  {
    name: "tv",
    emoji: "📺"
  },
  {
    name: "radio",
    emoji: "📻"
  },
  {
    name: "studio_microphone",
    emoji: "🎙"
  },
  {
    name: "level_slider",
    emoji: "🎚"
  },
  {
    name: "control_knobs",
    emoji: "🎛"
  },
  {
    name: "stopwatch",
    emoji: "⏱"
  },
  {
    name: "timer_clock",
    emoji: "⏲"
  },
  {
    name: "alarm_clock",
    emoji: "⏰"
  },
  {
    name: "mantelpiece_clock",
    emoji: "🕰"
  },
  {
    name: "hourglass_flowing_sand",
    emoji: "⏳"
  },
  {
    name: "hourglass",
    emoji: "⌛"
  },
  {
    name: "satellite",
    emoji: "📡"
  },
  {
    name: "battery",
    emoji: "🔋"
  },
  {
    name: "electric_plug",
    emoji: "🔌"
  },
  {
    name: "bulb",
    emoji: "💡"
  },
  {
    name: "flashlight",
    emoji: "🔦"
  },
  {
    name: "candle",
    emoji: "🕯"
  },
  {
    name: "wastebasket",
    emoji: "🗑"
  },
  {
    name: "oil_drum",
    emoji: "🛢"
  },
  {
    name: "money_with_wings",
    emoji: "💸"
  },
  {
    name: "dollar",
    emoji: "💵"
  },
  {
    name: "yen",
    emoji: "💴"
  },
  {
    name: "euro",
    emoji: "💶"
  },
  {
    name: "pound",
    emoji: "💷"
  },
  {
    name: "moneybag",
    emoji: "💰"
  },
  {
    name: "credit_card",
    emoji: "💳"
  },
  {
    name: "gem",
    emoji: "💎"
  },
  {
    name: "balance_scale",
    emoji: "⚖"
  },
  {
    name: "wrench",
    emoji: "🔧"
  },
  {
    name: "hammer",
    emoji: "🔨"
  },
  {
    name: "hammer_and_pick",
    emoji: "⚒"
  },
  {
    name: "hammer_and_wrench",
    emoji: "🛠"
  },
  {
    name: "pick",
    emoji: "⛏"
  },
  {
    name: "nut_and_bolt",
    emoji: "🔩"
  },
  {
    name: "gear",
    emoji: "⚙"
  },
  {
    name: "chains",
    emoji: "⛓"
  },
  {
    name: "gun",
    emoji: "🔫"
  },
  {
    name: "bomb",
    emoji: "💣"
  },
  {
    name: "hocho",
    emoji: "🔪"
  },
  {
    name: "dagger",
    emoji: "🗡"
  },
  {
    name: "crossed_swords",
    emoji: "⚔"
  },
  {
    name: "shield",
    emoji: "🛡"
  },
  {
    name: "smoking",
    emoji: "🚬"
  },
  {
    name: "skull_and_crossbones",
    emoji: "☠"
  },
  {
    name: "coffin",
    emoji: "⚰"
  },
  {
    name: "funeral_urn",
    emoji: "⚱"
  },
  {
    name: "amphora",
    emoji: "🏺"
  },
  {
    name: "crystal_ball",
    emoji: "🔮"
  },
  {
    name: "prayer_beads",
    emoji: "📿"
  },
  {
    name: "barber",
    emoji: "💈"
  },
  {
    name: "alembic",
    emoji: "⚗"
  },
  {
    name: "telescope",
    emoji: "🔭"
  },
  {
    name: "microscope",
    emoji: "🔬"
  },
  {
    name: "hole",
    emoji: "🕳"
  },
  {
    name: "pill",
    emoji: "💊"
  },
  {
    name: "syringe",
    emoji: "💉"
  },
  {
    name: "thermometer",
    emoji: "🌡"
  },
  {
    name: "label",
    emoji: "🏷"
  },
  {
    name: "bookmark",
    emoji: "🔖"
  },
  {
    name: "toilet",
    emoji: "🚽"
  },
  {
    name: "shower",
    emoji: "🚿"
  },
  {
    name: "bathtub",
    emoji: "🛁"
  },
  {
    name: "key",
    emoji: "🔑"
  },
  {
    name: "old_key",
    emoji: "🗝"
  },
  {
    name: "couch_and_lamp",
    emoji: "🛋"
  },
  {
    name: "sleeping_bed",
    emoji: "🛌"
  },
  {
    name: "bed",
    emoji: "🛏"
  },
  {
    name: "door",
    emoji: "🚪"
  },
  {
    name: "bellhop_bell",
    emoji: "🛎"
  },
  {
    name: "framed_picture",
    emoji: "🖼"
  },
  {
    name: "world_map",
    emoji: "🗺"
  },
  {
    name: "parasol_on_ground",
    emoji: "⛱"
  },
  {
    name: "moyai",
    emoji: "🗿"
  },
  {
    name: "shopping",
    emoji: "🛍"
  },
  {
    name: "shopping_cart",
    emoji: "🛒"
  },
  {
    name: "balloon",
    emoji: "🎈"
  },
  {
    name: "flags",
    emoji: "🎏"
  },
  {
    name: "ribbon",
    emoji: "🎀"
  },
  {
    name: "gift",
    emoji: "🎁"
  },
  {
    name: "confetti_ball",
    emoji: "🎊"
  },
  {
    name: "tada",
    emoji: "🎉"
  },
  {
    name: "dolls",
    emoji: "🎎"
  },
  {
    name: "wind_chime",
    emoji: "🎐"
  },
  {
    name: "crossed_flags",
    emoji: "🎌"
  },
  {
    name: "izakaya_lantern",
    emoji: "🏮"
  },
  {
    name: "email",
    emoji: "✉"
  },
  {
    name: "envelope_with_arrow",
    emoji: "📩"
  },
  {
    name: "incoming_envelope",
    emoji: "📨"
  },
  {
    name: "e-mail",
    emoji: "📧"
  },
  {
    name: "love_letter",
    emoji: "💌"
  },
  {
    name: "postbox",
    emoji: "📮"
  },
  {
    name: "mailbox_closed",
    emoji: "📪"
  },
  {
    name: "mailbox",
    emoji: "📫"
  },
  {
    name: "mailbox_with_mail",
    emoji: "📬"
  },
  {
    name: "mailbox_with_no_mail",
    emoji: "📭"
  },
  {
    name: "package",
    emoji: "📦"
  },
  {
    name: "postal_horn",
    emoji: "📯"
  },
  {
    name: "inbox_tray",
    emoji: "📥"
  },
  {
    name: "outbox_tray",
    emoji: "📤"
  },
  {
    name: "scroll",
    emoji: "📜"
  },
  {
    name: "page_with_curl",
    emoji: "📃"
  },
  {
    name: "bookmark_tabs",
    emoji: "📑"
  },
  {
    name: "bar_chart",
    emoji: "📊"
  },
  {
    name: "chart_with_upwards_trend",
    emoji: "📈"
  },
  {
    name: "chart_with_downwards_trend",
    emoji: "📉"
  },
  {
    name: "page_facing_up",
    emoji: "📄"
  },
  {
    name: "date",
    emoji: "📅"
  },
  {
    name: "calendar",
    emoji: "📆"
  },
  {
    name: "spiral_calendar",
    emoji: "🗓"
  },
  {
    name: "card_index",
    emoji: "📇"
  },
  {
    name: "card_file_box",
    emoji: "🗃"
  },
  {
    name: "ballot_box",
    emoji: "🗳"
  },
  {
    name: "file_cabinet",
    emoji: "🗄"
  },
  {
    name: "clipboard",
    emoji: "📋"
  },
  {
    name: "spiral_notepad",
    emoji: "🗒"
  },
  {
    name: "file_folder",
    emoji: "📁"
  },
  {
    name: "open_file_folder",
    emoji: "📂"
  },
  {
    name: "card_index_dividers",
    emoji: "🗂"
  },
  {
    name: "newspaper_roll",
    emoji: "🗞"
  },
  {
    name: "newspaper",
    emoji: "📰"
  },
  {
    name: "notebook",
    emoji: "📓"
  },
  {
    name: "closed_book",
    emoji: "📕"
  },
  {
    name: "green_book",
    emoji: "📗"
  },
  {
    name: "blue_book",
    emoji: "📘"
  },
  {
    name: "orange_book",
    emoji: "📙"
  },
  {
    name: "notebook_with_decorative_cover",
    emoji: "📔"
  },
  {
    name: "ledger",
    emoji: "📒"
  },
  {
    name: "books",
    emoji: "📚"
  },
  {
    name: "open_book",
    emoji: "📖"
  },
  {
    name: "link",
    emoji: "🔗"
  },
  {
    name: "paperclip",
    emoji: "📎"
  },
  {
    name: "paperclips",
    emoji: "🖇"
  },
  {
    name: "scissors",
    emoji: "✂"
  },
  {
    name: "triangular_ruler",
    emoji: "📐"
  },
  {
    name: "straight_ruler",
    emoji: "📏"
  },
  {
    name: "pushpin",
    emoji: "📌"
  },
  {
    name: "round_pushpin",
    emoji: "📍"
  },
  {
    name: "triangular_flag_on_post",
    emoji: "🚩"
  },
  {
    name: "white_flag",
    emoji: "🏳"
  },
  {
    name: "black_flag",
    emoji: "🏴"
  },
  {
    name: "rainbow_flag",
    emoji: "🏳️‍🌈"
  },
  {
    name: "closed_lock_with_key",
    emoji: "🔐"
  },
  {
    name: "lock",
    emoji: "🔒"
  },
  {
    name: "unlock",
    emoji: "🔓"
  },
  {
    name: "lock_with_ink_pen",
    emoji: "🔏"
  },
  {
    name: "pen",
    emoji: "🖊"
  },
  {
    name: "fountain_pen",
    emoji: "🖋"
  },
  {
    name: "black_nib",
    emoji: "✒"
  },
  {
    name: "memo",
    emoji: "📝"
  },
  {
    name: "pencil2",
    emoji: "✏"
  },
  {
    name: "crayon",
    emoji: "🖍"
  },
  {
    name: "paintbrush",
    emoji: "🖌"
  },
  {
    name: "mag",
    emoji: "🔍"
  },
  {
    name: "mag_right",
    emoji: "🔎"
  },
  {
    name: "heart",
    emoji: "❤"
  },
  {
    name: "yellow_heart",
    emoji: "💛"
  },
  {
    name: "green_heart",
    emoji: "💚"
  },
  {
    name: "blue_heart",
    emoji: "💙"
  },
  {
    name: "purple_heart",
    emoji: "💜"
  },
  {
    name: "black_heart",
    emoji: "🖤"
  },
  {
    name: "broken_heart",
    emoji: "💔"
  },
  {
    name: "heavy_heart_exclamation",
    emoji: "❣"
  },
  {
    name: "two_hearts",
    emoji: "💕"
  },
  {
    name: "revolving_hearts",
    emoji: "💞"
  },
  {
    name: "heartbeat",
    emoji: "💓"
  },
  {
    name: "heartpulse",
    emoji: "💗"
  },
  {
    name: "sparkling_heart",
    emoji: "💖"
  },
  {
    name: "cupid",
    emoji: "💘"
  },
  {
    name: "gift_heart",
    emoji: "💝"
  },
  {
    name: "heart_decoration",
    emoji: "💟"
  },
  {
    name: "peace_symbol",
    emoji: "☮"
  },
  {
    name: "latin_cross",
    emoji: "✝"
  },
  {
    name: "star_and_crescent",
    emoji: "☪"
  },
  {
    name: "om",
    emoji: "🕉"
  },
  {
    name: "wheel_of_dharma",
    emoji: "☸"
  },
  {
    name: "star_of_david",
    emoji: "✡"
  },
  {
    name: "six_pointed_star",
    emoji: "🔯"
  },
  {
    name: "menorah",
    emoji: "🕎"
  },
  {
    name: "yin_yang",
    emoji: "☯"
  },
  {
    name: "orthodox_cross",
    emoji: "☦"
  },
  {
    name: "place_of_worship",
    emoji: "🛐"
  },
  {
    name: "ophiuchus",
    emoji: "⛎"
  },
  {
    name: "aries",
    emoji: "♈"
  },
  {
    name: "taurus",
    emoji: "♉"
  },
  {
    name: "gemini",
    emoji: "♊"
  },
  {
    name: "cancer",
    emoji: "♋"
  },
  {
    name: "leo",
    emoji: "♌"
  },
  {
    name: "virgo",
    emoji: "♍"
  },
  {
    name: "libra",
    emoji: "♎"
  },
  {
    name: "scorpius",
    emoji: "♏"
  },
  {
    name: "sagittarius",
    emoji: "♐"
  },
  {
    name: "capricorn",
    emoji: "♑"
  },
  {
    name: "aquarius",
    emoji: "♒"
  },
  {
    name: "pisces",
    emoji: "♓"
  },
  {
    name: "id",
    emoji: "🆔"
  },
  {
    name: "atom_symbol",
    emoji: "⚛"
  },
  {
    name: "u7a7a",
    emoji: "🈳"
  },
  {
    name: "u5272",
    emoji: "🈹"
  },
  {
    name: "radioactive",
    emoji: "☢"
  },
  {
    name: "biohazard",
    emoji: "☣"
  },
  {
    name: "mobile_phone_off",
    emoji: "📴"
  },
  {
    name: "vibration_mode",
    emoji: "📳"
  },
  {
    name: "u6709",
    emoji: "🈶"
  },
  {
    name: "u7121",
    emoji: "🈚"
  },
  {
    name: "u7533",
    emoji: "🈸"
  },
  {
    name: "u55b6",
    emoji: "🈺"
  },
  {
    name: "u6708",
    emoji: "🈷"
  },
  {
    name: "eight_pointed_black_star",
    emoji: "✴"
  },
  {
    name: "vs",
    emoji: "🆚"
  },
  {
    name: "accept",
    emoji: "🉑"
  },
  {
    name: "white_flower",
    emoji: "💮"
  },
  {
    name: "ideograph_advantage",
    emoji: "🉐"
  },
  {
    name: "secret",
    emoji: "㊙"
  },
  {
    name: "congratulations",
    emoji: "㊗"
  },
  {
    name: "u5408",
    emoji: "🈴"
  },
  {
    name: "u6e80",
    emoji: "🈵"
  },
  {
    name: "u7981",
    emoji: "🈲"
  },
  {
    name: "a",
    emoji: "🅰"
  },
  {
    name: "b",
    emoji: "🅱"
  },
  {
    name: "ab",
    emoji: "🆎"
  },
  {
    name: "cl",
    emoji: "🆑"
  },
  {
    name: "o2",
    emoji: "🅾"
  },
  {
    name: "sos",
    emoji: "🆘"
  },
  {
    name: "no_entry",
    emoji: "⛔"
  },
  {
    name: "name_badge",
    emoji: "📛"
  },
  {
    name: "no_entry_sign",
    emoji: "🚫"
  },
  {
    name: "x",
    emoji: "❌"
  },
  {
    name: "o",
    emoji: "⭕"
  },
  {
    name: "stop_sign",
    emoji: "🛑"
  },
  {
    name: "anger",
    emoji: "💢"
  },
  {
    name: "hotsprings",
    emoji: "♨"
  },
  {
    name: "no_pedestrians",
    emoji: "🚷"
  },
  {
    name: "do_not_litter",
    emoji: "🚯"
  },
  {
    name: "no_bicycles",
    emoji: "🚳"
  },
  {
    name: "non-potable_water",
    emoji: "🚱"
  },
  {
    name: "underage",
    emoji: "🔞"
  },
  {
    name: "no_mobile_phones",
    emoji: "📵"
  },
  {
    name: "exclamation",
    emoji: "❗"
  },
  {
    name: "grey_exclamation",
    emoji: "❕"
  },
  {
    name: "question",
    emoji: "❓"
  },
  {
    name: "grey_question",
    emoji: "❔"
  },
  {
    name: "bangbang",
    emoji: "‼"
  },
  {
    name: "interrobang",
    emoji: "⁉"
  },
  {
    name: "100",
    emoji: "💯"
  },
  {
    name: "low_brightness",
    emoji: "🔅"
  },
  {
    name: "high_brightness",
    emoji: "🔆"
  },
  {
    name: "trident",
    emoji: "🔱"
  },
  {
    name: "fleur_de_lis",
    emoji: "⚜"
  },
  {
    name: "part_alternation_mark",
    emoji: "〽"
  },
  {
    name: "warning",
    emoji: "⚠"
  },
  {
    name: "children_crossing",
    emoji: "🚸"
  },
  {
    name: "beginner",
    emoji: "🔰"
  },
  {
    name: "recycle",
    emoji: "♻"
  },
  {
    name: "u6307",
    emoji: "🈯"
  },
  {
    name: "chart",
    emoji: "💹"
  },
  {
    name: "sparkle",
    emoji: "❇"
  },
  {
    name: "eight_spoked_asterisk",
    emoji: "✳"
  },
  {
    name: "negative_squared_cross_mark",
    emoji: "❎"
  },
  {
    name: "white_check_mark",
    emoji: "✅"
  },
  {
    name: "diamond_shape_with_a_dot_inside",
    emoji: "💠"
  },
  {
    name: "cyclone",
    emoji: "🌀"
  },
  {
    name: "loop",
    emoji: "➿"
  },
  {
    name: "globe_with_meridians",
    emoji: "🌐"
  },
  {
    name: "m",
    emoji: "Ⓜ"
  },
  {
    name: "atm",
    emoji: "🏧"
  },
  {
    name: "sa",
    emoji: "🈂"
  },
  {
    name: "passport_control",
    emoji: "🛂"
  },
  {
    name: "customs",
    emoji: "🛃"
  },
  {
    name: "baggage_claim",
    emoji: "🛄"
  },
  {
    name: "left_luggage",
    emoji: "🛅"
  },
  {
    name: "wheelchair",
    emoji: "♿"
  },
  {
    name: "no_smoking",
    emoji: "🚭"
  },
  {
    name: "wc",
    emoji: "🚾"
  },
  {
    name: "parking",
    emoji: "🅿"
  },
  {
    name: "potable_water",
    emoji: "🚰"
  },
  {
    name: "mens",
    emoji: "🚹"
  },
  {
    name: "womens",
    emoji: "🚺"
  },
  {
    name: "baby_symbol",
    emoji: "🚼"
  },
  {
    name: "restroom",
    emoji: "🚻"
  },
  {
    name: "put_litter_in_its_place",
    emoji: "🚮"
  },
  {
    name: "cinema",
    emoji: "🎦"
  },
  {
    name: "signal_strength",
    emoji: "📶"
  },
  {
    name: "koko",
    emoji: "🈁"
  },
  {
    name: "ng",
    emoji: "🆖"
  },
  {
    name: "ok",
    emoji: "🆗"
  },
  {
    name: "up",
    emoji: "🆙"
  },
  {
    name: "cool",
    emoji: "🆒"
  },
  {
    name: "new",
    emoji: "🆕"
  },
  {
    name: "free",
    emoji: "🆓"
  },
  {
    name: "zero",
    emoji: "0️⃣"
  },
  {
    name: "one",
    emoji: "1️⃣"
  },
  {
    name: "two",
    emoji: "2️⃣"
  },
  {
    name: "three",
    emoji: "3️⃣"
  },
  {
    name: "four",
    emoji: "4️⃣"
  },
  {
    name: "five",
    emoji: "5️⃣"
  },
  {
    name: "six",
    emoji: "6️⃣"
  },
  {
    name: "seven",
    emoji: "7️⃣"
  },
  {
    name: "eight",
    emoji: "8️⃣"
  },
  {
    name: "nine",
    emoji: "9️⃣"
  },
  {
    name: "keycap_ten",
    emoji: "🔟"
  },
  {
    name: "asterisk",
    emoji: "*️⃣"
  },
  {
    name: "1234",
    emoji: "🔢"
  },
  {
    name: "arrow_forward",
    emoji: "▶"
  },
  {
    name: "pause_button",
    emoji: "⏸"
  },
  {
    name: "next_track_button",
    emoji: "⏭"
  },
  {
    name: "stop_button",
    emoji: "⏹"
  },
  {
    name: "record_button",
    emoji: "⏺"
  },
  {
    name: "play_or_pause_button",
    emoji: "⏯"
  },
  {
    name: "previous_track_button",
    emoji: "⏮"
  },
  {
    name: "fast_forward",
    emoji: "⏩"
  },
  {
    name: "rewind",
    emoji: "⏪"
  },
  {
    name: "twisted_rightwards_arrows",
    emoji: "🔀"
  },
  {
    name: "repeat",
    emoji: "🔁"
  },
  {
    name: "repeat_one",
    emoji: "🔂"
  },
  {
    name: "arrow_backward",
    emoji: "◀"
  },
  {
    name: "arrow_up_small",
    emoji: "🔼"
  },
  {
    name: "arrow_down_small",
    emoji: "🔽"
  },
  {
    name: "arrow_double_up",
    emoji: "⏫"
  },
  {
    name: "arrow_double_down",
    emoji: "⏬"
  },
  {
    name: "arrow_right",
    emoji: "➡"
  },
  {
    name: "arrow_left",
    emoji: "⬅"
  },
  {
    name: "arrow_up",
    emoji: "⬆"
  },
  {
    name: "arrow_down",
    emoji: "⬇"
  },
  {
    name: "arrow_upper_right",
    emoji: "↗"
  },
  {
    name: "arrow_lower_right",
    emoji: "↘"
  },
  {
    name: "arrow_lower_left",
    emoji: "↙"
  },
  {
    name: "arrow_upper_left",
    emoji: "↖"
  },
  {
    name: "arrow_up_down",
    emoji: "↕"
  },
  {
    name: "left_right_arrow",
    emoji: "↔"
  },
  {
    name: "arrows_counterclockwise",
    emoji: "🔄"
  },
  {
    name: "arrow_right_hook",
    emoji: "↪"
  },
  {
    name: "leftwards_arrow_with_hook",
    emoji: "↩"
  },
  {
    name: "arrow_heading_up",
    emoji: "⤴"
  },
  {
    name: "arrow_heading_down",
    emoji: "⤵"
  },
  {
    name: "hash",
    emoji: "#️⃣"
  },
  {
    name: "information_source",
    emoji: "ℹ"
  },
  {
    name: "abc",
    emoji: "🔤"
  },
  {
    name: "abcd",
    emoji: "🔡"
  },
  {
    name: "capital_abcd",
    emoji: "🔠"
  },
  {
    name: "symbols",
    emoji: "🔣"
  },
  {
    name: "musical_note",
    emoji: "🎵"
  },
  {
    name: "notes",
    emoji: "🎶"
  },
  {
    name: "wavy_dash",
    emoji: "〰"
  },
  {
    name: "curly_loop",
    emoji: "➰"
  },
  {
    name: "heavy_check_mark",
    emoji: "✔"
  },
  {
    name: "arrows_clockwise",
    emoji: "🔃"
  },
  {
    name: "heavy_plus_sign",
    emoji: "➕"
  },
  {
    name: "heavy_minus_sign",
    emoji: "➖"
  },
  {
    name: "heavy_division_sign",
    emoji: "➗"
  },
  {
    name: "heavy_multiplication_x",
    emoji: "✖"
  },
  {
    name: "heavy_dollar_sign",
    emoji: "💲"
  },
  {
    name: "currency_exchange",
    emoji: "💱"
  },
  {
    name: "copyright",
    emoji: "©"
  },
  {
    name: "registered",
    emoji: "®"
  },
  {
    name: "tm",
    emoji: "™"
  },
  {
    name: "end",
    emoji: "🔚"
  },
  {
    name: "back",
    emoji: "🔙"
  },
  {
    name: "on",
    emoji: "🔛"
  },
  {
    name: "top",
    emoji: "🔝"
  },
  {
    name: "soon",
    emoji: "🔜"
  },
  {
    name: "ballot_box_with_check",
    emoji: "☑"
  },
  {
    name: "radio_button",
    emoji: "🔘"
  },
  {
    name: "white_circle",
    emoji: "⚪"
  },
  {
    name: "black_circle",
    emoji: "⚫"
  },
  {
    name: "red_circle",
    emoji: "🔴"
  },
  {
    name: "large_blue_circle",
    emoji: "🔵"
  },
  {
    name: "small_orange_diamond",
    emoji: "🔸"
  },
  {
    name: "small_blue_diamond",
    emoji: "🔹"
  },
  {
    name: "large_orange_diamond",
    emoji: "🔶"
  },
  {
    name: "large_blue_diamond",
    emoji: "🔷"
  },
  {
    name: "small_red_triangle",
    emoji: "🔺"
  },
  {
    name: "black_small_square",
    emoji: "▪"
  },
  {
    name: "white_small_square",
    emoji: "▫"
  },
  {
    name: "black_large_square",
    emoji: "⬛"
  },
  {
    name: "white_large_square",
    emoji: "⬜"
  },
  {
    name: "small_red_triangle_down",
    emoji: "🔻"
  },
  {
    name: "black_medium_square",
    emoji: "◼"
  },
  {
    name: "white_medium_square",
    emoji: "◻"
  },
  {
    name: "black_medium_small_square",
    emoji: "◾"
  },
  {
    name: "white_medium_small_square",
    emoji: "◽"
  },
  {
    name: "black_square_button",
    emoji: "🔲"
  },
  {
    name: "white_square_button",
    emoji: "🔳"
  },
  {
    name: "speaker",
    emoji: "🔈"
  },
  {
    name: "sound",
    emoji: "🔉"
  },
  {
    name: "loud_sound",
    emoji: "🔊"
  },
  {
    name: "mute",
    emoji: "🔇"
  },
  {
    name: "mega",
    emoji: "📣"
  },
  {
    name: "loudspeaker",
    emoji: "📢"
  },
  {
    name: "bell",
    emoji: "🔔"
  },
  {
    name: "no_bell",
    emoji: "🔕"
  },
  {
    name: "black_joker",
    emoji: "🃏"
  },
  {
    name: "mahjong",
    emoji: "🀄"
  },
  {
    name: "spades",
    emoji: "♠"
  },
  {
    name: "clubs",
    emoji: "♣"
  },
  {
    name: "hearts",
    emoji: "♥"
  },
  {
    name: "diamonds",
    emoji: "♦"
  },
  {
    name: "flower_playing_cards",
    emoji: "🎴"
  },
  {
    name: "thought_balloon",
    emoji: "💭"
  },
  {
    name: "right_anger_bubble",
    emoji: "🗯"
  },
  {
    name: "speech_balloon",
    emoji: "💬"
  },
  {
    name: "left_speech_bubble",
    emoji: "🗨"
  },
  {
    name: "clock1",
    emoji: "🕐"
  },
  {
    name: "clock2",
    emoji: "🕑"
  },
  {
    name: "clock3",
    emoji: "🕒"
  },
  {
    name: "clock4",
    emoji: "🕓"
  },
  {
    name: "clock5",
    emoji: "🕔"
  },
  {
    name: "clock6",
    emoji: "🕕"
  },
  {
    name: "clock7",
    emoji: "🕖"
  },
  {
    name: "clock8",
    emoji: "🕗"
  },
  {
    name: "clock9",
    emoji: "🕘"
  },
  {
    name: "clock10",
    emoji: "🕙"
  },
  {
    name: "clock11",
    emoji: "🕚"
  },
  {
    name: "clock12",
    emoji: "🕛"
  },
  {
    name: "clock130",
    emoji: "🕜"
  },
  {
    name: "clock230",
    emoji: "🕝"
  },
  {
    name: "clock330",
    emoji: "🕞"
  },
  {
    name: "clock430",
    emoji: "🕟"
  },
  {
    name: "clock530",
    emoji: "🕠"
  },
  {
    name: "clock630",
    emoji: "🕡"
  },
  {
    name: "clock730",
    emoji: "🕢"
  },
  {
    name: "clock830",
    emoji: "🕣"
  },
  {
    name: "clock930",
    emoji: "🕤"
  },
  {
    name: "clock1030",
    emoji: "🕥"
  },
  {
    name: "clock1130",
    emoji: "🕦"
  },
  {
    name: "clock1230",
    emoji: "🕧"
  },
  {
    name: "afghanistan",
    emoji: "🇦🇫"
  },
  {
    name: "aland_islands",
    emoji: "🇦🇽"
  },
  {
    name: "albania",
    emoji: "🇦🇱"
  },
  {
    name: "algeria",
    emoji: "🇩🇿"
  },
  {
    name: "american_samoa",
    emoji: "🇦🇸"
  },
  {
    name: "andorra",
    emoji: "🇦🇩"
  },
  {
    name: "angola",
    emoji: "🇦🇴"
  },
  {
    name: "anguilla",
    emoji: "🇦🇮"
  },
  {
    name: "antarctica",
    emoji: "🇦🇶"
  },
  {
    name: "antigua_barbuda",
    emoji: "🇦🇬"
  },
  {
    name: "argentina",
    emoji: "🇦🇷"
  },
  {
    name: "armenia",
    emoji: "🇦🇲"
  },
  {
    name: "aruba",
    emoji: "🇦🇼"
  },
  {
    name: "australia",
    emoji: "🇦🇺"
  },
  {
    name: "austria",
    emoji: "🇦🇹"
  },
  {
    name: "azerbaijan",
    emoji: "🇦🇿"
  },
  {
    name: "bahamas",
    emoji: "🇧🇸"
  },
  {
    name: "bahrain",
    emoji: "🇧🇭"
  },
  {
    name: "bangladesh",
    emoji: "🇧🇩"
  },
  {
    name: "barbados",
    emoji: "🇧🇧"
  },
  {
    name: "belarus",
    emoji: "🇧🇾"
  },
  {
    name: "belgium",
    emoji: "🇧🇪"
  },
  {
    name: "belize",
    emoji: "🇧🇿"
  },
  {
    name: "benin",
    emoji: "🇧🇯"
  },
  {
    name: "bermuda",
    emoji: "🇧🇲"
  },
  {
    name: "bhutan",
    emoji: "🇧🇹"
  },
  {
    name: "bolivia",
    emoji: "🇧🇴"
  },
  {
    name: "caribbean_netherlands",
    emoji: "🇧🇶"
  },
  {
    name: "bosnia_herzegovina",
    emoji: "🇧🇦"
  },
  {
    name: "botswana",
    emoji: "🇧🇼"
  },
  {
    name: "brazil",
    emoji: "🇧🇷"
  },
  {
    name: "british_indian_ocean_territory",
    emoji: "🇮🇴"
  },
  {
    name: "british_virgin_islands",
    emoji: "🇻🇬"
  },
  {
    name: "brunei",
    emoji: "🇧🇳"
  },
  {
    name: "bulgaria",
    emoji: "🇧🇬"
  },
  {
    name: "burkina_faso",
    emoji: "🇧🇫"
  },
  {
    name: "burundi",
    emoji: "🇧🇮"
  },
  {
    name: "cape_verde",
    emoji: "🇨🇻"
  },
  {
    name: "cambodia",
    emoji: "🇰🇭"
  },
  {
    name: "cameroon",
    emoji: "🇨🇲"
  },
  {
    name: "canada",
    emoji: "🇨🇦"
  },
  {
    name: "canary_islands",
    emoji: "🇮🇨"
  },
  {
    name: "cayman_islands",
    emoji: "🇰🇾"
  },
  {
    name: "central_african_republic",
    emoji: "🇨🇫"
  },
  {
    name: "chad",
    emoji: "🇹🇩"
  },
  {
    name: "chile",
    emoji: "🇨🇱"
  },
  {
    name: "cn",
    emoji: "🇨🇳"
  },
  {
    name: "christmas_island",
    emoji: "🇨🇽"
  },
  {
    name: "cocos_islands",
    emoji: "🇨🇨"
  },
  {
    name: "colombia",
    emoji: "🇨🇴"
  },
  {
    name: "comoros",
    emoji: "🇰🇲"
  },
  {
    name: "congo_brazzaville",
    emoji: "🇨🇬"
  },
  {
    name: "congo_kinshasa",
    emoji: "🇨🇩"
  },
  {
    name: "cook_islands",
    emoji: "🇨🇰"
  },
  {
    name: "costa_rica",
    emoji: "🇨🇷"
  },
  {
    name: "croatia",
    emoji: "🇭🇷"
  },
  {
    name: "cuba",
    emoji: "🇨🇺"
  },
  {
    name: "curacao",
    emoji: "🇨🇼"
  },
  {
    name: "cyprus",
    emoji: "🇨🇾"
  },
  {
    name: "czech_republic",
    emoji: "🇨🇿"
  },
  {
    name: "denmark",
    emoji: "🇩🇰"
  },
  {
    name: "djibouti",
    emoji: "🇩🇯"
  },
  {
    name: "dominica",
    emoji: "🇩🇲"
  },
  {
    name: "dominican_republic",
    emoji: "🇩🇴"
  },
  {
    name: "ecuador",
    emoji: "🇪🇨"
  },
  {
    name: "egypt",
    emoji: "🇪🇬"
  },
  {
    name: "el_salvador",
    emoji: "🇸🇻"
  },
  {
    name: "equatorial_guinea",
    emoji: "🇬🇶"
  },
  {
    name: "eritrea",
    emoji: "🇪🇷"
  },
  {
    name: "estonia",
    emoji: "🇪🇪"
  },
  {
    name: "ethiopia",
    emoji: "🇪🇹"
  },
  {
    name: "eu",
    emoji: "🇪🇺"
  },
  {
    name: "falkland_islands",
    emoji: "🇫🇰"
  },
  {
    name: "faroe_islands",
    emoji: "🇫🇴"
  },
  {
    name: "fiji",
    emoji: "🇫🇯"
  },
  {
    name: "finland",
    emoji: "🇫🇮"
  },
  {
    name: "fr",
    emoji: "🇫🇷"
  },
  {
    name: "french_guiana",
    emoji: "🇬🇫"
  },
  {
    name: "french_polynesia",
    emoji: "🇵🇫"
  },
  {
    name: "french_southern_territories",
    emoji: "🇹🇫"
  },
  {
    name: "gabon",
    emoji: "🇬🇦"
  },
  {
    name: "gambia",
    emoji: "🇬🇲"
  },
  {
    name: "georgia",
    emoji: "🇬🇪"
  },
  {
    name: "de",
    emoji: "🇩🇪"
  },
  {
    name: "ghana",
    emoji: "🇬🇭"
  },
  {
    name: "gibraltar",
    emoji: "🇬🇮"
  },
  {
    name: "greece",
    emoji: "🇬🇷"
  },
  {
    name: "greenland",
    emoji: "🇬🇱"
  },
  {
    name: "grenada",
    emoji: "🇬🇩"
  },
  {
    name: "guadeloupe",
    emoji: "🇬🇵"
  },
  {
    name: "guam",
    emoji: "🇬🇺"
  },
  {
    name: "guatemala",
    emoji: "🇬🇹"
  },
  {
    name: "guernsey",
    emoji: "🇬🇬"
  },
  {
    name: "guinea",
    emoji: "🇬🇳"
  },
  {
    name: "guinea_bissau",
    emoji: "🇬🇼"
  },
  {
    name: "guyana",
    emoji: "🇬🇾"
  },
  {
    name: "haiti",
    emoji: "🇭🇹"
  },
  {
    name: "honduras",
    emoji: "🇭🇳"
  },
  {
    name: "hong_kong",
    emoji: "🇭🇰"
  },
  {
    name: "hungary",
    emoji: "🇭🇺"
  },
  {
    name: "iceland",
    emoji: "🇮🇸"
  },
  {
    name: "india",
    emoji: "🇮🇳"
  },
  {
    name: "indonesia",
    emoji: "🇮🇩"
  },
  {
    name: "iran",
    emoji: "🇮🇷"
  },
  {
    name: "iraq",
    emoji: "🇮🇶"
  },
  {
    name: "ireland",
    emoji: "🇮🇪"
  },
  {
    name: "isle_of_man",
    emoji: "🇮🇲"
  },
  {
    name: "israel",
    emoji: "🇮🇱"
  },
  {
    name: "it",
    emoji: "🇮🇹"
  },
  {
    name: "cote_divoire",
    emoji: "🇨🇮"
  },
  {
    name: "jamaica",
    emoji: "🇯🇲"
  },
  {
    name: "jp",
    emoji: "🇯🇵"
  },
  {
    name: "jersey",
    emoji: "🇯🇪"
  },
  {
    name: "jordan",
    emoji: "🇯🇴"
  },
  {
    name: "kazakhstan",
    emoji: "🇰🇿"
  },
  {
    name: "kenya",
    emoji: "🇰🇪"
  },
  {
    name: "kiribati",
    emoji: "🇰🇮"
  },
  {
    name: "kosovo",
    emoji: "🇽🇰"
  },
  {
    name: "kuwait",
    emoji: "🇰🇼"
  },
  {
    name: "kyrgyzstan",
    emoji: "🇰🇬"
  },
  {
    name: "laos",
    emoji: "🇱🇦"
  },
  {
    name: "latvia",
    emoji: "🇱🇻"
  },
  {
    name: "lebanon",
    emoji: "🇱🇧"
  },
  {
    name: "lesotho",
    emoji: "🇱🇸"
  },
  {
    name: "liberia",
    emoji: "🇱🇷"
  },
  {
    name: "libya",
    emoji: "🇱🇾"
  },
  {
    name: "liechtenstein",
    emoji: "🇱🇮"
  },
  {
    name: "lithuania",
    emoji: "🇱🇹"
  },
  {
    name: "luxembourg",
    emoji: "🇱🇺"
  },
  {
    name: "macau",
    emoji: "🇲🇴"
  },
  {
    name: "macedonia",
    emoji: "🇲🇰"
  },
  {
    name: "madagascar",
    emoji: "🇲🇬"
  },
  {
    name: "malawi",
    emoji: "🇲🇼"
  },
  {
    name: "malaysia",
    emoji: "🇲🇾"
  },
  {
    name: "maldives",
    emoji: "🇲🇻"
  },
  {
    name: "mali",
    emoji: "🇲🇱"
  },
  {
    name: "malta",
    emoji: "🇲🇹"
  },
  {
    name: "marshall_islands",
    emoji: "🇲🇭"
  },
  {
    name: "martinique",
    emoji: "🇲🇶"
  },
  {
    name: "mauritania",
    emoji: "🇲🇷"
  },
  {
    name: "mauritius",
    emoji: "🇲🇺"
  },
  {
    name: "mayotte",
    emoji: "🇾🇹"
  },
  {
    name: "mexico",
    emoji: "🇲🇽"
  },
  {
    name: "micronesia",
    emoji: "🇫🇲"
  },
  {
    name: "moldova",
    emoji: "🇲🇩"
  },
  {
    name: "monaco",
    emoji: "🇲🇨"
  },
  {
    name: "mongolia",
    emoji: "🇲🇳"
  },
  {
    name: "montenegro",
    emoji: "🇲🇪"
  },
  {
    name: "montserrat",
    emoji: "🇲🇸"
  },
  {
    name: "morocco",
    emoji: "🇲🇦"
  },
  {
    name: "mozambique",
    emoji: "🇲🇿"
  },
  {
    name: "myanmar",
    emoji: "🇲🇲"
  },
  {
    name: "namibia",
    emoji: "🇳🇦"
  },
  {
    name: "nauru",
    emoji: "🇳🇷"
  },
  {
    name: "nepal",
    emoji: "🇳🇵"
  },
  {
    name: "netherlands",
    emoji: "🇳🇱"
  },
  {
    name: "new_caledonia",
    emoji: "🇳🇨"
  },
  {
    name: "new_zealand",
    emoji: "🇳🇿"
  },
  {
    name: "nicaragua",
    emoji: "🇳🇮"
  },
  {
    name: "niger",
    emoji: "🇳🇪"
  },
  {
    name: "nigeria",
    emoji: "🇳🇬"
  },
  {
    name: "niue",
    emoji: "🇳🇺"
  },
  {
    name: "norfolk_island",
    emoji: "🇳🇫"
  },
  {
    name: "northern_mariana_islands",
    emoji: "🇲🇵"
  },
  {
    name: "north_korea",
    emoji: "🇰🇵"
  },
  {
    name: "norway",
    emoji: "🇳🇴"
  },
  {
    name: "oman",
    emoji: "🇴🇲"
  },
  {
    name: "pakistan",
    emoji: "🇵🇰"
  },
  {
    name: "palau",
    emoji: "🇵🇼"
  },
  {
    name: "palestinian_territories",
    emoji: "🇵🇸"
  },
  {
    name: "panama",
    emoji: "🇵🇦"
  },
  {
    name: "papua_new_guinea",
    emoji: "🇵🇬"
  },
  {
    name: "paraguay",
    emoji: "🇵🇾"
  },
  {
    name: "peru",
    emoji: "🇵🇪"
  },
  {
    name: "philippines",
    emoji: "🇵🇭"
  },
  {
    name: "pitcairn_islands",
    emoji: "🇵🇳"
  },
  {
    name: "poland",
    emoji: "🇵🇱"
  },
  {
    name: "portugal",
    emoji: "🇵🇹"
  },
  {
    name: "puerto_rico",
    emoji: "🇵🇷"
  },
  {
    name: "qatar",
    emoji: "🇶🇦"
  },
  {
    name: "reunion",
    emoji: "🇷🇪"
  },
  {
    name: "romania",
    emoji: "🇷🇴"
  },
  {
    name: "ru",
    emoji: "🇷🇺"
  },
  {
    name: "rwanda",
    emoji: "🇷🇼"
  },
  {
    name: "st_barthelemy",
    emoji: "🇧🇱"
  },
  {
    name: "st_helena",
    emoji: "🇸🇭"
  },
  {
    name: "st_kitts_nevis",
    emoji: "🇰🇳"
  },
  {
    name: "st_lucia",
    emoji: "🇱🇨"
  },
  {
    name: "st_pierre_miquelon",
    emoji: "🇵🇲"
  },
  {
    name: "st_vincent_grenadines",
    emoji: "🇻🇨"
  },
  {
    name: "samoa",
    emoji: "🇼🇸"
  },
  {
    name: "san_marino",
    emoji: "🇸🇲"
  },
  {
    name: "sao_tome_principe",
    emoji: "🇸🇹"
  },
  {
    name: "saudi_arabia",
    emoji: "🇸🇦"
  },
  {
    name: "senegal",
    emoji: "🇸🇳"
  },
  {
    name: "serbia",
    emoji: "🇷🇸"
  },
  {
    name: "seychelles",
    emoji: "🇸🇨"
  },
  {
    name: "sierra_leone",
    emoji: "🇸🇱"
  },
  {
    name: "singapore",
    emoji: "🇸🇬"
  },
  {
    name: "sint_maarten",
    emoji: "🇸🇽"
  },
  {
    name: "slovakia",
    emoji: "🇸🇰"
  },
  {
    name: "slovenia",
    emoji: "🇸🇮"
  },
  {
    name: "solomon_islands",
    emoji: "🇸🇧"
  },
  {
    name: "somalia",
    emoji: "🇸🇴"
  },
  {
    name: "south_africa",
    emoji: "🇿🇦"
  },
  {
    name: "south_georgia_south_sandwich_islands",
    emoji: "🇬🇸"
  },
  {
    name: "kr",
    emoji: "🇰🇷"
  },
  {
    name: "south_sudan",
    emoji: "🇸🇸"
  },
  {
    name: "es",
    emoji: "🇪🇸"
  },
  {
    name: "sri_lanka",
    emoji: "🇱🇰"
  },
  {
    name: "sudan",
    emoji: "🇸🇩"
  },
  {
    name: "suriname",
    emoji: "🇸🇷"
  },
  {
    name: "swaziland",
    emoji: "🇸🇿"
  },
  {
    name: "sweden",
    emoji: "🇸🇪"
  },
  {
    name: "switzerland",
    emoji: "🇨🇭"
  },
  {
    name: "syria",
    emoji: "🇸🇾"
  },
  {
    name: "taiwan",
    emoji: "🇹🇼"
  },
  {
    name: "tajikistan",
    emoji: "🇹🇯"
  },
  {
    name: "tanzania",
    emoji: "🇹🇿"
  },
  {
    name: "thailand",
    emoji: "🇹🇭"
  },
  {
    name: "timor_leste",
    emoji: "🇹🇱"
  },
  {
    name: "togo",
    emoji: "🇹🇬"
  },
  {
    name: "tokelau",
    emoji: "🇹🇰"
  },
  {
    name: "tonga",
    emoji: "🇹🇴"
  },
  {
    name: "trinidad_tobago",
    emoji: "🇹🇹"
  },
  {
    name: "tunisia",
    emoji: "🇹🇳"
  },
  {
    name: "tr",
    emoji: "🇹🇷"
  },
  {
    name: "turkmenistan",
    emoji: "🇹🇲"
  },
  {
    name: "turks_caicos_islands",
    emoji: "🇹🇨"
  },
  {
    name: "tuvalu",
    emoji: "🇹🇻"
  },
  {
    name: "uganda",
    emoji: "🇺🇬"
  },
  {
    name: "ukraine",
    emoji: "🇺🇦"
  },
  {
    name: "united_arab_emirates",
    emoji: "🇦🇪"
  },
  {
    name: "uk",
    emoji: "🇬🇧"
  },
  {
    name: "us",
    emoji: "🇺🇸"
  },
  {
    name: "us_virgin_islands",
    emoji: "🇻🇮"
  },
  {
    name: "uruguay",
    emoji: "🇺🇾"
  },
  {
    name: "uzbekistan",
    emoji: "🇺🇿"
  },
  {
    name: "vanuatu",
    emoji: "🇻🇺"
  },
  {
    name: "vatican_city",
    emoji: "🇻🇦"
  },
  {
    name: "venezuela",
    emoji: "🇻🇪"
  },
  {
    name: "vietnam",
    emoji: "🇻🇳"
  },
  {
    name: "wallis_futuna",
    emoji: "🇼🇫"
  },
  {
    name: "western_sahara",
    emoji: "🇪🇭"
  },
  {
    name: "yemen",
    emoji: "🇾🇪"
  },
  {
    name: "zambia",
    emoji: "🇿🇲"
  },
  {
    name: "zimbabwe",
    emoji: "🇿🇼"
  },
  {
    name: "star_struck",
    emoji: "🤩"
  },
  {
    name: "face_with_raised_eyebrow",
    emoji: "🤨"
  },
  {
    name: "exploding_head",
    emoji: "🤯"
  },
  {
    name: "crazy_face",
    emoji: "🤪"
  },
  {
    name: "face_with_symbols_over_mouth",
    emoji: "🤬"
  },
  {
    name: "face_vomiting",
    emoji: "🤮"
  },
  {
    name: "shushing_face",
    emoji: "🤫"
  },
  {
    name: "face_with_hand_over_mouth",
    emoji: "🤭"
  },
  {
    name: "face_with_monocle",
    emoji: "🧐"
  },
  {
    name: "child",
    emoji: "🧒"
  },
  {
    name: "adult",
    emoji: "🧑"
  },
  {
    name: "older_adult",
    emoji: "🧓"
  },
  {
    name: "woman_with_headscarf",
    emoji: "🧕"
  },
  {
    name: "bearded_person",
    emoji: "🧔"
  },
  {
    name: "breast_feeding",
    emoji: "🤱"
  },
  {
    name: "mage",
    emoji: "🧙"
  },
  {
    name: "woman_mage",
    emoji: "🧙‍♀️"
  },
  {
    name: "fairy",
    emoji: "🧚"
  },
  {
    name: "vampire",
    emoji: "🧛"
  },
  {
    name: "merperson",
    emoji: "🧜"
  },
  {
    name: "merman",
    emoji: "🧜‍♂️"
  },
  {
    name: "elf",
    emoji: "🧝"
  },
  {
    name: "genie",
    emoji: "🧞"
  },
  {
    name: "woman_genie",
    emoji: "🧞‍♀"
  },
  {
    name: "zombie",
    emoji: "🧟"
  },
  {
    name: "woman_zombie",
    emoji: "🧟‍♀"
  },
  {
    name: "person_in_steamy_room",
    emoji: "🧖"
  },
  {
    name: "woman_in_steamy_room",
    emoji: "🧖‍♀️"
  },
  {
    name: "person_climbing",
    emoji: "🧗"
  },
  {
    name: "woman_climbing",
    emoji: "🧗‍♀️"
  },
  {
    name: "person_in_lotus_position",
    emoji: "🧘"
  },
  {
    name: "woman_in_lotus_position",
    emoji: "🧘‍♀️"
  },
  {
    name: "love_you_gesture",
    emoji: "🤟"
  },
  {
    name: "palms_up_together",
    emoji: "🤲"
  },
  {
    name: "brain",
    emoji: "🧠"
  },
  {
    name: "orange_heart",
    emoji: "🧡"
  },
  {
    name: "scarf",
    emoji: "🧣"
  },
  {
    name: "gloves",
    emoji: "🧤"
  },
  {
    name: "coat",
    emoji: "🧥"
  },
  {
    name: "socks",
    emoji: "🧦"
  },
  {
    name: "billed_cap",
    emoji: "🧢"
  },
  {
    name: "zebra",
    emoji: "🦓"
  },
  {
    name: "giraffe",
    emoji: "🦒"
  },
  {
    name: "hedgehog",
    emoji: "🦔"
  },
  {
    name: "sauropod",
    emoji: "🦕"
  },
  {
    name: "t_rex",
    emoji: "🦖"
  },
  {
    name: "cricket",
    emoji: "🦗"
  },
  {
    name: "coconut",
    emoji: "🥥"
  },
  {
    name: "broccoli",
    emoji: "🥦"
  },
  {
    name: "pretzel",
    emoji: "🥨"
  },
  {
    name: "cut_of_meat",
    emoji: "🥩"
  },
  {
    name: "sandwich",
    emoji: "🥪"
  },
  {
    name: "bowl_with_spoon",
    emoji: "🥣"
  },
  {
    name: "canned_food",
    emoji: "🥫"
  },
  {
    name: "dumpling",
    emoji: "🥟"
  },
  {
    name: "fortune_cookie",
    emoji: "🥠"
  },
  {
    name: "takeout_box",
    emoji: "🥡"
  },
  {
    name: "pie",
    emoji: "🥧"
  },
  {
    name: "cup_with_straw",
    emoji: "🥤"
  },
  {
    name: "chopsticks",
    emoji: "🥢"
  },
  {
    name: "flying_saucer",
    emoji: "🛸"
  },
  {
    name: "sled",
    emoji: "🛷"
  },
  {
    name: "curling_stone",
    emoji: "🥌"
  },
  {
    name: "svalbard_and_jan_mayen",
    emoji: "🇸🇯"
  },
  {
    name: "st_martin",
    emoji: "🇲🇫"
  },
  {
    name: "us_outlying_islands",
    emoji: "🇺🇲"
  },
  {
    name: "tristan_da_cunha",
    emoji: "🇹🇦"
  },
  {
    name: "heard_and_mc_donald_islands",
    emoji: "🇭🇲"
  },
  {
    name: "ceuta_and_melilla",
    emoji: "🇪🇦"
  },
  {
    name: "diego_garcia",
    emoji: "🇩🇬"
  },
  {
    name: "ascension_island",
    emoji: "🇦🇨"
  },
  {
    name: "bouvet_island",
    emoji: "🇧🇻"
  },
  {
    name: "clipperton_island",
    emoji: "🇨🇵"
  },
  {
    name: "united_nations",
    emoji: "🇺🇳"
  },
  {
    name: "smiling_face_with_three_hearts",
    emoji: "🥰"
  },
  {
    name: "hot_face",
    emoji: "🥵"
  },
  {
    name: "cold_face",
    emoji: "🥶"
  },
  {
    name: "partying_face",
    emoji: "🥳"
  },
  {
    name: "woozy_face",
    emoji: "🥴"
  },
  {
    name: "pleading_face",
    emoji: "🥺"
  },
  {
    name: "man_red_haired",
    emoji: "👨‍🦰"
  },
  {
    name: "man_curly_haired",
    emoji: "👨‍🦱"
  },
  {
    name: "man_white_haired",
    emoji: "👨‍🦳"
  },
  {
    name: "man_bald",
    emoji: "👨‍🦲"
  },
  {
    name: "woman_red_haired",
    emoji: "👩‍🦰"
  },
  {
    name: "woman_curly_haired",
    emoji: "👩‍🦱"
  },
  {
    name: "woman_white_haired",
    emoji: "👩‍🦳"
  },
  {
    name: "woman_bald",
    emoji: "👩‍🦲"
  },
  {
    name: "superhero",
    emoji: "🦸"
  },
  {
    name: "man_superhero",
    emoji: "🦸‍♂️"
  },
  {
    name: "woman_superhero",
    emoji: "🦸‍♀️"
  },
  {
    name: "supervillain",
    emoji: "🦹"
  },
  {
    name: "woman_supervillain",
    emoji: "🦹‍♀️"
  },
  {
    name: "man_supervillain",
    emoji: "🦹‍♂️"
  },
  {
    name: "leg",
    emoji: "🦵"
  },
  {
    name: "foot",
    emoji: "🦶"
  },
  {
    name: "bone",
    emoji: "🦴"
  },
  {
    name: "tooth",
    emoji: "🦷"
  },
  {
    name: "goggles",
    emoji: "🥽"
  },
  {
    name: "lab_coat",
    emoji: "🥼"
  },
  {
    name: "hiking_boot",
    emoji: "🥾"
  },
  {
    name: "flat_shoe",
    emoji: "🥿"
  },
  {
    name: "raccoon",
    emoji: "🦝"
  },
  {
    name: "llama",
    emoji: "🦙"
  },
  {
    name: "hippopotamus",
    emoji: "🦛"
  },
  {
    name: "kangaroo",
    emoji: "🦘"
  },
  {
    name: "badger",
    emoji: "🦡"
  },
  {
    name: "swan",
    emoji: "🦢"
  },
  {
    name: "peacock",
    emoji: "🦚"
  },
  {
    name: "parrot",
    emoji: "🦜"
  },
  {
    name: "lobster",
    emoji: "🦞"
  },
  {
    name: "mosquito",
    emoji: "🦟"
  },
  {
    name: "microbe",
    emoji: "🦠"
  },
  {
    name: "mango",
    emoji: "🥭"
  },
  {
    name: "leafy_green",
    emoji: "🥬"
  },
  {
    name: "bagel",
    emoji: "🥯"
  },
  {
    name: "salt",
    emoji: "🧂"
  },
  {
    name: "moon_cake",
    emoji: "🥮"
  },
  {
    name: "cupcake",
    emoji: "🧁"
  },
  {
    name: "compass",
    emoji: "🧭"
  },
  {
    name: "brick",
    emoji: "🧱"
  },
  {
    name: "skateboard",
    emoji: "🛹"
  },
  {
    name: "luggage",
    emoji: "🧳"
  },
  {
    name: "firecracker",
    emoji: "🧨"
  },
  {
    name: "red_gift_envelope",
    emoji: "🧧"
  },
  {
    name: "softball",
    emoji: "🥎"
  },
  {
    name: "flying_disc",
    emoji: "🥏"
  },
  {
    name: "lacrosse",
    emoji: "🥍"
  },
  {
    name: "nazar_amulet",
    emoji: "🧿"
  },
  {
    name: "jigsaw",
    emoji: "🧩"
  },
  {
    name: "teddy_bear",
    emoji: "🧸"
  },
  {
    name: "chess_pawn",
    emoji: "♟"
  },
  {
    name: "thread",
    emoji: "🧵"
  },
  {
    name: "yarn",
    emoji: "🧶"
  },
  {
    name: "abacus",
    emoji: "🧮"
  },
  {
    name: "receipt",
    emoji: "🧾"
  },
  {
    name: "toolbox",
    emoji: "🧰"
  },
  {
    name: "magnet",
    emoji: "🧲"
  },
  {
    name: "test_tube",
    emoji: "🧪"
  },
  {
    name: "petri_dish",
    emoji: "🧫"
  },
  {
    name: "dna",
    emoji: "🧬"
  },
  {
    name: "lotion_bottle",
    emoji: "🧴"
  },
  {
    name: "safety_pin",
    emoji: "🧷"
  },
  {
    name: "broom",
    emoji: "🧹"
  },
  {
    name: "basket",
    emoji: "🧺"
  },
  {
    name: "roll_of_toilet_paper",
    emoji: "🧻"
  },
  {
    name: "soap",
    emoji: "🧼"
  },
  {
    name: "sponge",
    emoji: "🧽"
  },
  {
    name: "fire_extinguisher",
    emoji: "🧯"
  },
  {
    name: "infinity",
    emoji: "♾"
  },
  {
    name: "pirate_flag",
    emoji: "🏴‍☠"
  },
  {
    name: "waffle",
    emoji: "🧇"
  },
  {
    name: "otter",
    emoji: "🦦"
  },
  {
    name: "sloth",
    emoji: "🦥"
  },
  {
    name: "ice_cube",
    emoji: "🧊"
  },
  {
    name: "ringer_planet",
    emoji: "🪐"
  },
  {
    name: "flamingo",
    emoji: "🦩"
  },
  {
    name: "yawning_face",
    emoji: "🥱"
  },
  {
    name: "pinching_hand",
    emoji: "🤏"
  },
  {
    name: "service_dog",
    emoji: "🐕‍🦺"
  },
  {
    name: "orangutan",
    emoji: "🦧"
  },
  {
    name: "auto_rickshaw",
    emoji: "🛺"
  },
  {
    name: "parachute",
    emoji: "🪂"
  },
  {
    name: "yo-yo",
    emoji: "🪀"
  },
  {
    name: "kite",
    emoji: "🪁"
  },
  {
    name: "brown_square",
    emoji: "🟫"
  },
  {
    name: "purple_square",
    emoji: "🟪"
  },
  {
    name: "blue_square",
    emoji: "🟦"
  },
  {
    name: "green_square",
    emoji: "🟩"
  },
  {
    name: "yellow_square",
    emoji: "🟨"
  },
  {
    name: "orange_square",
    emoji: "🟧"
  },
  {
    name: "red_square",
    emoji: "🟥"
  },
  {
    name: "brown_circle",
    emoji: "🟤"
  },
  {
    name: "purple_circle",
    emoji: "🟣"
  },
  {
    name: "green_circle",
    emoji: "🟢"
  },
  {
    name: "yellow_circle",
    emoji: "🟡"
  },
  {
    name: "orange_circle",
    emoji: "🟠"
  },
  {
    name: "razor",
    emoji: "🪒"
  },
  {
    name: "chair",
    emoji: "🪑"
  },
  {
    name: "stethoscope",
    emoji: "🩺"
  },
  {
    name: "adhesive_bandage",
    emoji: "🩹"
  },
  {
    name: "drop_of_blood",
    emoji: "🩸"
  },
  {
    name: "probing_cane",
    emoji: "🦯"
  },
  {
    name: "axe",
    emoji: "🪓"
  },
  {
    name: "diya_lamp",
    emoji: "🪔"
  },
  {
    name: "banjo",
    emoji: "🪕"
  },
  {
    name: "ballet_shoes",
    emoji: "🩰"
  },
  {
    name: "shorts",
    emoji: "🩳"
  },
  {
    name: "briefs",
    emoji: "🩲"
  },
  {
    name: "one_piece_swimsuit",
    emoji: "🩱"
  },
  {
    name: "sari",
    emoji: "🥻"
  },
  {
    name: "safety_vest",
    emoji: "🦺"
  },
  {
    name: "diving_mask",
    emoji: "🤿"
  },
  {
    name: "motorized_wheelchair",
    emoji: "🦼"
  },
  {
    name: "manual_wheelchair",
    emoji: "🦽"
  },
  {
    name: "hindu_temple",
    emoji: "🛕"
  },
  {
    name: "maté",
    emoji: "🧉"
  },
  {
    name: "beverage_box",
    emoji: "🧃"
  },
  {
    name: "oyster",
    emoji: "🦪"
  },
  {
    name: "butter",
    emoji: "🧈"
  },
  {
    name: "falafel",
    emoji: "🧆"
  },
  {
    name: "onion",
    emoji: "🧅"
  },
  {
    name: "garlic",
    emoji: "🧄"
  },
  {
    name: "skunk",
    emoji: "🦨"
  },
  {
    name: "guide_dog",
    emoji: "🦮"
  },
  {
    name: "people_holding_hands",
    emoji: "🧑‍🤝‍🧑"
  },
  {
    name: "woman_in_manual_wheelchair",
    emoji: "👩‍🦽"
  },
  {
    name: "man_in_manual_wheelchair",
    emoji: "👨‍🦽"
  },
  {
    name: "woman_in_motorized_wheelchair",
    emoji: "👩‍🦼"
  },
  {
    name: "man_in_motorized_wheelchair",
    emoji: "👨‍🦼"
  },
  {
    name: "woman_with_probing_cane",
    emoji: "👩‍🦯"
  },
  {
    name: "man_with_probing_cane",
    emoji: "👨‍🦯"
  },
  {
    name: "woman_kneeling",
    emoji: "🧎‍♀️"
  },
  {
    name: "man_kneeling",
    emoji: "🧎‍♂️"
  },
  {
    name: "man_standing",
    emoji: "🧍‍♂️"
  },
  {
    name: "woman_standing",
    emoji: "🧍‍♀️"
  },
  {
    name: "deaf_woman",
    emoji: "🧏‍♀️"
  },
  {
    name: "deaf_man",
    emoji: "🧏‍♂️"
  },
  {
    name: "hear_with_hearing_aid",
    emoji: "🦻"
  },
  {
    name: "mechanical_leg",
    emoji: "🦿"
  },
  {
    name: "mechanical_arm",
    emoji: "🦾"
  },
  {
    name: "white_heart",
    emoji: "🤍"
  },
  {
    name: "brown_heart",
    emoji: "🤎"
  },
  {
    name: "transgender_flag",
    emoji: "🏳️‍⚧"
  },
  {
    name: "smiling_face_with_tear",
    emoji: "🥲"
  },
  {
    name: "disguised_face",
    emoji: "🥸"
  },
  {
    name: "pinched_fingers",
    emoji: "🤌"
  },
  {
    name: "anatomical_heart",
    emoji: "🫀"
  },
  {
    name: "lungs",
    emoji: "🫁"
  },
  {
    name: "ninja",
    emoji: "🥷"
  },
  {
    name: "mx_claus",
    emoji: "🧑‍🎄"
  },
  {
    name: "people_hugging",
    emoji: "🫂"
  },
  {
    name: "black_cat",
    emoji: "🐈‍⬛"
  },
  {
    name: "bison",
    emoji: "🦬"
  },
  {
    name: "mammoth",
    emoji: "🦣"
  },
  {
    name: "beaver",
    emoji: "🦫"
  },
  {
    name: "dodo",
    emoji: "🦤"
  },
  {
    name: "feather",
    emoji: "🪶"
  },
  {
    name: "seal",
    emoji: "🦭"
  },
  {
    name: "beetle",
    emoji: "🪲"
  },
  {
    name: "cockroach",
    emoji: "🪳"
  },
  {
    name: "fly",
    emoji: "🪰"
  },
  {
    name: "worm",
    emoji: "🪱"
  },
  {
    name: "potted_plant",
    emoji: "🪴"
  },
  {
    name: "blueberries",
    emoji: "🫐"
  },
  {
    name: "olive",
    emoji: "🫒"
  },
  {
    name: "bell_pepper",
    emoji: "🫑"
  },
  {
    name: "flatbread",
    emoji: "🫓"
  },
  {
    name: "tamale",
    emoji: "🫔"
  },
  {
    name: "fondue",
    emoji: "🫕"
  },
  {
    name: "teapot",
    emoji: "🫖"
  },
  {
    name: "bubble_tea",
    emoji: "🧋"
  },
  {
    name: "rock",
    emoji: "🪨"
  },
  {
    name: "wood",
    emoji: "🪵"
  },
  {
    name: "hut",
    emoji: "🛖"
  },
  {
    name: "pickup_truck",
    emoji: "🛻"
  },
  {
    name: "roller_skate",
    emoji: "🛼"
  },
  {
    name: "magic_wand",
    emoji: "🪄"
  },
  {
    name: "piñata",
    emoji: "🪅"
  },
  {
    name: "nesting_dolls",
    emoji: "🪆"
  },
  {
    name: "sewing_needle",
    emoji: "🪡"
  },
  {
    name: "knot",
    emoji: "🪢"
  },
  {
    name: "thong_sandal",
    emoji: "🩴"
  },
  {
    name: "military_helmet",
    emoji: "🪖"
  },
  {
    name: "accordion",
    emoji: "🪗"
  },
  {
    name: "long_drum",
    emoji: "🪘"
  },
  {
    name: "coin",
    emoji: "🪙"
  },
  {
    name: "boomerang",
    emoji: "🪃"
  },
  {
    name: "carpentry_saw",
    emoji: "🪚"
  },
  {
    name: "screwdriver",
    emoji: "🪛"
  },
  {
    name: "hook",
    emoji: "🪝"
  },
  {
    name: "ladder",
    emoji: "🪜"
  },
  {
    name: "mirror",
    emoji: "🪞"
  },
  {
    name: "window",
    emoji: "🪟"
  },
  {
    name: "plunger",
    emoji: "🪠"
  },
  {
    name: "mouse_trap",
    emoji: "🪤"
  },
  {
    name: "bucket",
    emoji: "🪣"
  },
  {
    name: "toothbrush",
    emoji: "🪥"
  },
  {
    name: "headstone",
    emoji: "🪦"
  },
  {
    name: "placard",
    emoji: "🪧"
  },
  {
    name: "transgender_symbol",
    emoji: "⚧"
  },
  {
    name: "man_feeding_baby",
    emoji: "👨‍🍼"
  },
  {
    name: "person_feeding_baby",
    emoji: "🧑‍🍼"
  },
  {
    name: "polar_bear",
    emoji: "🐻‍❄"
  },
  {
    name: "melting_face",
    emoji: "🫠"
  },
  {
    name: "smiling_face",
    emoji: "☺"
  },
  {
    name: "face_with_open_eyes_and_hand_over_mouth",
    emoji: "🫢"
  },
  {
    name: "face_with_peeking_eye",
    emoji: "🫣"
  },
  {
    name: "saluting_face",
    emoji: "🫡"
  },
  {
    name: "dotted_line_face",
    emoji: "🫥"
  },
  {
    name: "face_in_clouds",
    emoji: "😶‍🌫"
  },
  {
    name: "face_exhaling",
    emoji: "😮‍💨"
  },
  {
    name: "face_with_spiral_eyes",
    emoji: "😵‍💫"
  },
  {
    name: "face_with_diagonal_mouth",
    emoji: "🫤"
  },
  {
    name: "frowning_face",
    emoji: "☹"
  },
  {
    name: "face_holding_back_tears",
    emoji: "🥹"
  },
  {
    name: "heart_on_fire",
    emoji: "❤️‍🔥"
  },
  {
    name: "mending_heart",
    emoji: "❤️‍🩹"
  },
  {
    name: "eye_in_speech_bubble",
    emoji: "👁️‍🗨"
  },
  {
    name: "rightwards_hand",
    emoji: "🫱"
  },
  {
    name: "leftwards_hand",
    emoji: "🫲"
  },
  {
    name: "palm_down_hand",
    emoji: "🫳"
  },
  {
    name: "palm_up_hand",
    emoji: "🫴"
  },
  {
    name: "hand_with_index_finger_and_thumb_crossed",
    emoji: "🫰"
  },
  {
    name: "index_pointing_at_the_viewer",
    emoji: "🫵"
  },
  {
    name: "heart_hands",
    emoji: "🫶"
  },
  {
    name: "biting_lip",
    emoji: "🫦"
  },
  {
    name: "man_beard",
    emoji: "🧔‍♂"
  },
  {
    name: "woman_beard",
    emoji: "🧔‍♀"
  },
  {
    name: "person_red_hair",
    emoji: "🧑‍🦰"
  },
  {
    name: "person_curly_hair",
    emoji: "🧑‍🦱"
  },
  {
    name: "person_white_hair",
    emoji: "🧑‍🦳"
  },
  {
    name: "person_bald",
    emoji: "🧑‍🦲"
  },
  {
    name: "man_blond_hair",
    emoji: "👱‍♂️"
  },
  {
    name: "person_frowning",
    emoji: "🙍"
  },
  {
    name: "person_pouting",
    emoji: "🙎"
  },
  {
    name: "person_gesturing_no",
    emoji: "🙅"
  },
  {
    name: "person_gesturing_ok",
    emoji: "🙆"
  },
  {
    name: "person_tipping_hand",
    emoji: "💁"
  },
  {
    name: "person_raising_hand",
    emoji: "🙋"
  },
  {
    name: "deaf_person",
    emoji: "🧏"
  },
  {
    name: "man_bowing",
    emoji: "🙇‍♂️"
  },
  {
    name: "person_facepalming",
    emoji: "🤦"
  },
  {
    name: "person_shrugging",
    emoji: "🤷"
  },
  {
    name: "health_worker",
    emoji: "🧑‍⚕️"
  },
  {
    name: "student",
    emoji: "🧑‍🎓"
  },
  {
    name: "teacher",
    emoji: "🧑‍🏫"
  },
  {
    name: "judge",
    emoji: "🧑‍⚖️"
  },
  {
    name: "farmer",
    emoji: "🧑‍🌾"
  },
  {
    name: "cook",
    emoji: "🧑‍🍳"
  },
  {
    name: "mechanic",
    emoji: "🧑‍🔧"
  },
  {
    name: "factory_worker",
    emoji: "🧑‍🏭"
  },
  {
    name: "office_worker",
    emoji: "🧑‍💼"
  },
  {
    name: "scientist",
    emoji: "🧑‍🔬"
  },
  {
    name: "technologist",
    emoji: "🧑‍💻"
  },
  {
    name: "singer",
    emoji: "🧑‍🎤"
  },
  {
    name: "artist",
    emoji: "🧑‍🎨"
  },
  {
    name: "pilot",
    emoji: "🧑‍✈️"
  },
  {
    name: "astronaut",
    emoji: "🧑‍🚀"
  },
  {
    name: "firefighter",
    emoji: "🧑‍🚒"
  },
  {
    name: "man_police_officer",
    emoji: "👮‍♂️"
  },
  {
    name: "man_detective",
    emoji: "🕵️‍♂️"
  },
  {
    name: "man_guard",
    emoji: "💂‍♂️"
  },
  {
    name: "man_construction_worker",
    emoji: "👷‍♂️"
  },
  {
    name: "person_with_crown",
    emoji: "🫅"
  },
  {
    name: "man_wearing_turban",
    emoji: "👳‍♂️"
  },
  {
    name: "man_in_tuxedo",
    emoji: "🤵‍♂️"
  },
  {
    name: "woman_in_tuxedo",
    emoji: "🤵‍♀️"
  },
  {
    name: "man_with_veil",
    emoji: "👰‍♂️"
  },
  {
    name: "woman_with_veil",
    emoji: "👰‍♀️"
  },
  {
    name: "pregnant_man",
    emoji: "🫃"
  },
  {
    name: "pregnant_person",
    emoji: "🫄"
  },
  {
    name: "woman_feeding_baby",
    emoji: "👩‍🍼"
  },
  {
    name: "man_mage",
    emoji: "🧙‍♂️"
  },
  {
    name: "man_fairy",
    emoji: "🧚‍♂️"
  },
  {
    name: "woman_fairy",
    emoji: "🧚‍♀️"
  },
  {
    name: "man_vampire",
    emoji: "🧛‍♂️"
  },
  {
    name: "woman_vampire",
    emoji: "🧛‍♀️"
  },
  {
    name: "mermaid",
    emoji: "🧜‍♀️"
  },
  {
    name: "man_elf",
    emoji: "🧝‍♂️"
  },
  {
    name: "woman_elf",
    emoji: "🧝‍♀️"
  },
  {
    name: "man_genie",
    emoji: "🧞‍♂"
  },
  {
    name: "man_zombie",
    emoji: "🧟‍♂"
  },
  {
    name: "troll",
    emoji: "🧌"
  },
  {
    name: "person_getting_massage",
    emoji: "💆"
  },
  {
    name: "person_getting_haircut",
    emoji: "💇"
  },
  {
    name: "man_walking",
    emoji: "🚶‍♂️"
  },
  {
    name: "person_standing",
    emoji: "🧍"
  },
  {
    name: "person_kneeling",
    emoji: "🧎"
  },
  {
    name: "person_with_white_cane",
    emoji: "🧑‍🦯"
  },
  {
    name: "person_in_motorized_wheelchair",
    emoji: "🧑‍🦼"
  },
  {
    name: "person_in_manual_wheelchair",
    emoji: "🧑‍🦽"
  },
  {
    name: "man_running",
    emoji: "🏃‍♂️"
  },
  {
    name: "women_with_bunny_ears",
    emoji: "👯‍♀"
  },
  {
    name: "man_in_steamy_room",
    emoji: "🧖‍♂️"
  },
  {
    name: "man_climbing",
    emoji: "🧗‍♂️"
  },
  {
    name: "man_golfing",
    emoji: "🏌️‍♂️"
  },
  {
    name: "man_surfing",
    emoji: "🏄‍♂️"
  },
  {
    name: "man_rowing_boat",
    emoji: "🚣‍♂️"
  },
  {
    name: "man_swimming",
    emoji: "🏊‍♂️"
  },
  {
    name: "man_bouncing_ball",
    emoji: "⛹️‍♂️"
  },
  {
    name: "man_lifting_weights",
    emoji: "🏋️‍♂️"
  },
  {
    name: "man_biking",
    emoji: "🚴‍♂️"
  },
  {
    name: "man_mountain_biking",
    emoji: "🚵‍♂️"
  },
  {
    name: "person_cartwheeling",
    emoji: "🤸"
  },
  {
    name: "people_wrestling",
    emoji: "🤼"
  },
  {
    name: "person_playing_water_polo",
    emoji: "🤽"
  },
  {
    name: "person_playing_handball",
    emoji: "🤾"
  },
  {
    name: "person_juggling",
    emoji: "🤹"
  },
  {
    name: "man_in_lotus_position",
    emoji: "🧘‍♂️"
  },
  {
    name: "kiss_woman_man",
    emoji: "👩‍❤️‍💋‍👨"
  },
  {
    name: "couple_with_heart_woman_man",
    emoji: "👩‍❤️‍👨"
  },
  {
    name: "family_man_woman_boy",
    emoji: "👨‍👩‍👦"
  },
  {
    name: "red_hair",
    emoji: "🦰"
  },
  {
    name: "curly_hair",
    emoji: "🦱"
  },
  {
    name: "white_hair",
    emoji: "🦳"
  },
  {
    name: "bald",
    emoji: "🦲"
  },
  {
    name: "coral",
    emoji: "🪸"
  },
  {
    name: "lotus",
    emoji: "🪷"
  },
  {
    name: "empty_nest",
    emoji: "🪹"
  },
  {
    name: "nest_with_eggs",
    emoji: "🪺"
  },
  {
    name: "beans",
    emoji: "🫘"
  },
  {
    name: "pouring_liquid",
    emoji: "🫗"
  },
  {
    name: "jar",
    emoji: "🫙"
  },
  {
    name: "playground_slide",
    emoji: "🛝"
  },
  {
    name: "wheel",
    emoji: "🛞"
  },
  {
    name: "ring_buoy",
    emoji: "🛟"
  },
  {
    name: "hamsa",
    emoji: "🪬"
  },
  {
    name: "mirror_ball",
    emoji: "🪩"
  },
  {
    name: "low_battery",
    emoji: "🪫"
  },
  {
    name: "crutch",
    emoji: "🩼"
  },
  {
    name: "xray",
    emoji: "🩻"
  },
  {
    name: "elevator",
    emoji: "🛗"
  },
  {
    name: "bubbles",
    emoji: "🫧"
  },
  {
    name: "identification_card",
    emoji: "🪪"
  },
  {
    name: "eject_button",
    emoji: "⏏"
  },
  {
    name: "female_sign",
    emoji: "♀"
  },
  {
    name: "male_sign",
    emoji: "♂"
  },
  {
    name: "heavy_equals_sign",
    emoji: "🟰"
  },
  {
    name: "medical_symbol",
    emoji: "⚕"
  },
  {
    name: "england",
    emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿"
  },
  {
    name: "scotland",
    emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿"
  },
  {
    name: "wales",
    emoji: "🏴󠁧󠁢󠁷󠁬󠁳󠁿"
  }
];
const EmojiExtension = Extension.create({
  name: "emoji",
  addOptions() {
    return {
      suggestion: {
        char: ":",
        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range).insertContent(props.emoji).run();
        },
        items: ({ query }) => {
          return emojis.filter(
            (item) => item.name.toLowerCase().includes(query.toLowerCase())
          ).slice(0, 5);
        },
        render: () => {
          let component;
          let popup;
          return {
            onStart: (props) => {
              component = new VueRenderer(EmojiList, {
                props,
                editor: props.editor
              });
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
              component == null ? void 0 : component.updateProps(props);
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
              return (_a = component == null ? void 0 : component.ref) == null ? void 0 : _a.onKeyDown(props);
            },
            onExit() {
              popup[0].destroy();
              component.destroy();
            }
          };
        }
      }
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion
      })
    ];
  }
});
function markdownToHTML(text) {
  const converter = new showdown.Converter();
  converter.setFlavor("github");
  return converter.makeHtml(text);
}
function detectMarkdown(text) {
  const lines = text.split("\n");
  const markdown = lines.filter(
    (line) => (
      // check for inline markdown content like images, links, italic, bold, etc.
      /!\[.*\]\(.*\)/.test(line) || /\[.*\]\(.*\)/.test(line) || /(^|\s)\*.*\*(\s|$)/.test(line) || /(^|\s)_.*_(\s|$)/.test(line) || /(^|\s)\*\*.*\*\*(\s|$)/.test(line) || /(^|\s)__.*__(\s|$)/.test(line) || /(^|\s)~~.*~~(\s|$)/.test(line) || // check for block markdown content like headings, code blocks, lists, etc.
      line.startsWith("![") || line.startsWith("#") || line.startsWith("> ") || line.startsWith("*") || line.startsWith("- ") || line.startsWith("1. ") || line.startsWith("```") || line.startsWith("`") || line.startsWith("[") || line.startsWith("---")
    )
  );
  return markdown.length > 0;
}
const _sfc_main = {
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
      editor: computed(() => this.editor)
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
        EmojiExtension,
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
          if (!detectMarkdown(text)) return;
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_TextEditorBubbleMenu = resolveComponent("TextEditorBubbleMenu");
  const _component_TextEditorFixedMenu = resolveComponent("TextEditorFixedMenu");
  const _component_TextEditorFloatingMenu = resolveComponent("TextEditorFloatingMenu");
  const _component_editor_content = resolveComponent("editor-content");
  return $data.editor ? (openBlock(), createElementBlock(
    "div",
    {
      key: 0,
      class: normalizeClass(["relative w-full", _ctx.$attrs.class])
    },
    [
      createVNode(_component_TextEditorBubbleMenu, {
        buttons: $props.bubbleMenu,
        options: $props.bubbleMenuOptions
      }, null, 8, ["buttons", "options"]),
      createVNode(_component_TextEditorFixedMenu, {
        class: "w-full overflow-x-auto rounded-t-lg border border-outline-gray-modals",
        buttons: $props.fixedMenu
      }, null, 8, ["buttons"]),
      createVNode(_component_TextEditorFloatingMenu, { buttons: $props.floatingMenu }, null, 8, ["buttons"]),
      renderSlot(_ctx.$slots, "top"),
      renderSlot(_ctx.$slots, "editor", { editor: $data.editor }, () => [
        createVNode(_component_editor_content, { editor: $data.editor }, null, 8, ["editor"])
      ]),
      renderSlot(_ctx.$slots, "bottom")
    ],
    2
    /* CLASS */
  )) : createCommentVNode("v-if", true);
}
_sfc_main.__file = "src/components/TextEditor/TextEditor.vue";
const TextEditor = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/TextEditor.vue"]]);
export {
  TextEditor as T,
  TextEditorFixedMenu as a,
  fileToBase64 as f
};
