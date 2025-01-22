const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/FontColor-BEcwuyod.js","assets/Popover-BHzhJ5F4.js","assets/vendor-CujOSow0.js","assets/_plugin-vue_export-helper-1tPrXgE0.js","assets/ListRow-KI4bjWns.js","assets/Checkbox-DLJKCJRx.js","assets/Autocomplete-Bdn13jRb.js","assets/Button-DvGZNb6i.js","assets/FeatherIcon-BWruznbI.js","assets/Avatar-BmzL901s.js","assets/Badge-Cjclj2L7.js","assets/Breadcrumbs-BlmHmhKT.js","assets/Dropdown-iOjCjG_v.js","assets/DateRangePicker-FKVPIueL.js","assets/TextInput-D1GSlcLJ.js","assets/debounce-CRCtzhPg.js","assets/Dialog-CmjJWfEz.js","assets/ErrorMessage-ISU3g5aX.js","assets/FileUploader-C54gzrfm.js","assets/FormControl-CaHdndqV.js","assets/Select-CJsno1sD.js","assets/Textarea-BXGwpsb1.js","assets/Progress-z4PNlWuX.js","assets/Rating-53rS8Pnm.js","assets/Spinner-Xs5Mv1pX.js","assets/Switch-BXWUev6s.js","assets/TabButtons-Bb_GoLeU.js","assets/Tabs-7OEym-4G.js","assets/Tooltip-DgrUjw0N.js","assets/Calendar-BV97x-k9.js","assets/CircularProgressBar---O3gW3P.js","assets/Tree-Chinl-7i.js","assets/InsertLink-DRaPaTnQ.js","assets/InsertImage--ET4xk8b.js","assets/InsertVideo-CUrYpXLn.js"])))=>i.map(i=>d[i]);
import { aU as Node, aV as mergeAttributes, aW as nodeInputRule, aX as Plugin, aB as openBlock, aG as createElementBlock, aK as Fragment, aJ as renderList, aQ as normalizeClass, aN as toDisplayString, aH as createCommentVNode, aY as Mention, aZ as VueRenderer, a_ as tippy, aA as resolveComponent, aF as createBaseVNode, aE as createVNode, aD as withCtx, aC as createBlock, a$ as resolveDynamicComponent, b0 as withDirectives, b1 as vShow, aL as mergeProps, Z as defineAsyncComponent, _ as __vitePreload, b2 as BubbleMenu, b3 as FloatingMenu, b4 as showdown, aT as EditorContent, b5 as computed, b6 as Editor, b7 as StarterKit, b8 as Table$1, b9 as TableRow, ba as TableHeader, bb as TableCell, bc as Typography, bd as TextAlign, be as TextStyle, bf as Color, bg as Highlight, bh as Link$1, bi as Placeholder, bj as DOMParser, bk as renderSlot } from "./vendor-CujOSow0.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { P as Popover } from "./Popover-BHzhJ5F4.js";
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
const _sfc_main$u = {
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
const _hoisted_1$r = {
  key: 0,
  class: "min-w-40 rounded-lg border bg-surface-white p-1 text-base shadow-lg"
};
const _hoisted_2$2 = ["onClick", "onMouseover"];
function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    $props.items.length ? (openBlock(), createElementBlock("div", _hoisted_1$r, [
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
          }, toDisplayString(item.label), 43, _hoisted_2$2);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ])) : createCommentVNode("v-if", true)
  ]);
}
_sfc_main$u.__file = "src/components/TextEditor/MentionList.vue";
const MentionList = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$u], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/MentionList.vue"]]);
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
const _sfc_main$t = {
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
const _hoisted_1$q = { class: "inline-flex bg-surface-white px-1 py-1" };
const _hoisted_2$1 = { class: "inline-flex items-center gap-1" };
const _hoisted_3 = {
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
function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Popover = resolveComponent("Popover");
  return openBlock(), createElementBlock("div", _hoisted_1$q, [
    createBaseVNode("div", _hoisted_2$1, [
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
              button.type === "separator" ? (openBlock(), createElementBlock("div", _hoisted_3)) : button.map ? (openBlock(), createElementBlock("div", _hoisted_4, [
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
_sfc_main$t.__file = "src/components/TextEditor/Menu.vue";
const Menu = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$t], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/Menu.vue"]]);
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
        d: "M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm8-12v12h-2v-9.796l-2 .536V8.67L19.5 8H21z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$s.__file = "src/components/TextEditor/icons/h-1.vue";
const H1 = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$s], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-1.vue"]]);
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
        d: "M4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 4c2.071 0 3.75 1.679 3.75 3.75 0 .857-.288 1.648-.772 2.28l-.148.18L18.034 18H22v2h-7v-1.556l4.82-5.546c.268-.307.43-.709.43-1.148 0-.966-.784-1.75-1.75-1.75-.918 0-1.671.707-1.744 1.606l-.006.144h-2C14.75 9.679 16.429 8 18.5 8z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$r.__file = "src/components/TextEditor/icons/h-2.vue";
const H2 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$r], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-2.vue"]]);
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
        d: "M22 8l-.002 2-2.505 2.883c1.59.435 2.757 1.89 2.757 3.617 0 2.071-1.679 3.75-3.75 3.75-1.826 0-3.347-1.305-3.682-3.033l1.964-.382c.156.806.866 1.415 1.718 1.415.966 0 1.75-.784 1.75-1.75s-.784-1.75-1.75-1.75c-.286 0-.556.069-.794.19l-1.307-1.547L19.35 10H15V8h7zM4 4v7h7V4h2v16h-2v-7H4v7H2V4h2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$q.__file = "src/components/TextEditor/icons/h-3.vue";
const H3 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$q], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-3.vue"]]);
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
        d: "M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm9-12v8h1.5v2H22v2h-2v-2h-5.5v-1.34l5-8.66H22zm-2 3.133L17.19 16H20v-4.867z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$p.__file = "src/components/TextEditor/icons/h-4.vue";
const H4 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$p], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-4.vue"]]);
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
        d: "M22 8v2h-4.323l-.464 2.636c.33-.089.678-.136 1.037-.136 2.21 0 4 1.79 4 4s-1.79 4-4 4c-1.827 0-3.367-1.224-3.846-2.897l1.923-.551c.24.836 1.01 1.448 1.923 1.448 1.105 0 2-.895 2-2s-.895-2-2-2c-.63 0-1.193.292-1.56.748l-1.81-.904L16 8h6zM4 4v7h7V4h2v16h-2v-7H4v7H2V4h2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$o.__file = "src/components/TextEditor/icons/h-5.vue";
const H5 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$o], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-5.vue"]]);
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
_sfc_main$n.__file = "src/components/TextEditor/icons/h-6.vue";
const H6 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$n], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/h-6.vue"]]);
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
        d: "M13 6v15h-2V6H5V4h14v2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$m.__file = "src/components/TextEditor/icons/text.vue";
const Text = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$m], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/text.vue"]]);
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
        d: "M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$l.__file = "src/components/TextEditor/icons/bold.vue";
const Bold = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$l], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/bold.vue"]]);
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
        d: "M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$k.__file = "src/components/TextEditor/icons/italic.vue";
const Italic = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$k], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/italic.vue"]]);
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
        d: "M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2zM4 20h16v2H4v-2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$j.__file = "src/components/TextEditor/icons/underline.vue";
const Underline = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$j], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/underline.vue"]]);
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
        d: "M3 4h18v2H3V4zm2 15h14v2H5v-2zm-2-5h18v2H3v-2zm2-5h14v2H5V9z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$i.__file = "src/components/TextEditor/icons/align-center.vue";
const AlignCenter = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$i], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/align-center.vue"]]);
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
        d: "M3 4h18v2H3V4zm0 15h14v2H3v-2zm0-5h18v2H3v-2zm0-5h14v2H3V9z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$h.__file = "src/components/TextEditor/icons/align-left.vue";
const AlignLeft = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$h], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/align-left.vue"]]);
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
        d: "M3 4h18v2H3V4zm4 15h14v2H7v-2zm-4-5h18v2H3v-2zm4-5h14v2H7V9z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$g.__file = "src/components/TextEditor/icons/align-right.vue";
const AlignRight = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$g], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/align-right.vue"]]);
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
        d: "M15.246 14H8.754l-1.6 4H5l6-15h2l6 15h-2.154l-1.6-4zm-.8-2L12 5.885 9.554 12h4.892zM3 20h18v2H3v-2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$f.__file = "src/components/TextEditor/icons/font-color.vue";
const FontColor = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$f], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/font-color.vue"]]);
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
        d: "M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$e.__file = "src/components/TextEditor/icons/list-ordered.vue";
const ListOrdered = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$e], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/list-ordered.vue"]]);
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
        d: "M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$d.__file = "src/components/TextEditor/icons/list-unordered.vue";
const ListUnordered = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$d], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/list-unordered.vue"]]);
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
        d: "M19.417 6.679C20.447 7.773 21 9 21 10.989c0 3.5-2.457 6.637-6.03 8.188l-.893-1.378c3.335-1.804 3.987-4.145 4.247-5.621-.537.278-1.24.375-1.929.311-1.804-.167-3.226-1.648-3.226-3.489a3.5 3.5 0 0 1 3.5-3.5c1.073 0 2.099.49 2.748 1.179zm-10 0C10.447 7.773 11 9 11 10.989c0 3.5-2.457 6.637-6.03 8.188l-.893-1.378c3.335-1.804 3.987-4.145 4.247-5.621-.537.278-1.24.375-1.929.311C4.591 12.322 3.17 10.841 3.17 9a3.5 3.5 0 0 1 3.5-3.5c1.073 0 2.099.49 2.748 1.179z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$c.__file = "src/components/TextEditor/icons/double-quotes-r.vue";
const DoubleQuotes = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$c], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/double-quotes-r.vue"]]);
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
        d: "M16.95 8.464l1.414-1.414 4.95 4.95-4.95 4.95-1.414-1.414L20.485 12 16.95 8.464zm-9.9 0L3.515 12l3.535 3.536-1.414 1.414L.686 12l4.95-4.95L7.05 8.464z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$b.__file = "src/components/TextEditor/icons/code-view.vue";
const CodeView = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/code-view.vue"]]);
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
        d: "M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$a.__file = "src/components/TextEditor/icons/link.vue";
const Link = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/link.vue"]]);
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
_sfc_main$9.__file = "src/components/TextEditor/icons/image-add-line.vue";
const Image = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/image-add-line.vue"]]);
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
_sfc_main$8.__file = "src/components/TextEditor/icons/video-add-line.vue";
const Video = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/video-add-line.vue"]]);
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
        d: "M5.828 7l2.536 2.536L6.95 10.95 2 6l4.95-4.95 1.414 1.414L5.828 5H13a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H5.828z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$7.__file = "src/components/TextEditor/icons/arrow-go-back-line.vue";
const ArrowGoBack = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/arrow-go-back-line.vue"]]);
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
        d: "M18.172 7H11a6 6 0 1 0 0 12h9v2h-9a8 8 0 1 1 0-16h7.172l-2.536-2.536L17.05 1.05 22 6l-4.95 4.95-1.414-1.414L18.172 7z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$6.__file = "src/components/TextEditor/icons/arrow-go-forward-line.vue";
const ArrowGoForward = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/arrow-go-forward-line.vue"]]);
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
        d: "M2 11h2v2H2v-2zm4 0h12v2H6v-2zm14 0h2v2h-2v-2z",
        fill: "currentColor"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
_sfc_main$5.__file = "src/components/TextEditor/icons/separator.vue";
const Separator = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/separator.vue"]]);
const _sfc_main$4 = {};
const _hoisted_1$1 = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  width: "24",
  height: "24"
};
function _sfc_render$4(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$1, _cache[0] || (_cache[0] = [
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
_sfc_main$4.__file = "src/components/TextEditor/icons/table-2.vue";
const Table = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/icons/table-2.vue"]]);
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
    component: defineAsyncComponent(() => __vitePreload(() => import("./FontColor-BEcwuyod.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]) : void 0))
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
    component: defineAsyncComponent(() => __vitePreload(() => import("./InsertLink-DRaPaTnQ.js"), true ? __vite__mapDeps([32,16,2,7,8,3,19,5,14,15,20,21,6,1]) : void 0))
  },
  Image: {
    label: "Image",
    icon: Image,
    isActive: (editor) => false,
    component: defineAsyncComponent(() => __vitePreload(() => import("./InsertImage--ET4xk8b.js"), true ? __vite__mapDeps([33,16,2,7,8,3,1]) : void 0))
  },
  Video: {
    label: "Video",
    icon: Video,
    isActive: (editor) => false,
    component: defineAsyncComponent(() => __vitePreload(() => import("./InsertVideo-CUrYpXLn.js"), true ? __vite__mapDeps([34,7,2,8,3,16,18]) : void 0))
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
const _sfc_main$3 = {
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
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Menu = resolveComponent("Menu");
  return $options.fixedMenuButtons ? (openBlock(), createBlock(_component_Menu, {
    key: 0,
    buttons: $options.fixedMenuButtons
  }, null, 8, ["buttons"])) : createCommentVNode("v-if", true);
}
_sfc_main$3.__file = "src/components/TextEditor/TextEditorFixedMenu.vue";
const TextEditorFixedMenu = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/TextEditorFixedMenu.vue"]]);
const _sfc_main$2 = {
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
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
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
_sfc_main$2.__file = "src/components/TextEditor/TextEditorBubbleMenu.vue";
const TextEditorBubbleMenu = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/TextEditorBubbleMenu.vue"]]);
const _sfc_main$1 = {
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
const _hoisted_1 = ["onClick", "title"];
const _hoisted_2 = {
  key: 1,
  class: "inline-block h-4 min-w-[1rem] text-sm leading-4"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
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
              _hoisted_2,
              toDisplayString(button.text),
              1
              /* TEXT */
            ))
          ], 10, _hoisted_1);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]),
    _: 1
    /* STABLE */
  }, 8, ["editor"])) : createCommentVNode("v-if", true);
}
_sfc_main$1.__file = "src/components/TextEditor/TextEditorFloatingMenu.vue";
const TextEditorFloatingMenu = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/TextEditorFloatingMenu.vue"]]);
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
