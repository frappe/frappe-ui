import { ay as _export_sfc, az as defineComponent, bB as useSlots, aA as ref, aO as computed, b3 as onMounted, aC as resolveComponent, aD as openBlock, aL as createElementBlock, aS as createCommentVNode, aP as renderSlot, aI as createBaseVNode, be as normalizeProps, bf as guardReactiveProps, aE as createBlock, aQ as normalizeClass, aJ as toDisplayString, b2 as normalizeStyle, aV as Fragment, aU as renderList, aH as createVNode, aF as withCtx, aW as mergeProps, aB as reactive } from "./vendor-BPVYRHQ8.js";
import { F as FeatherIcon } from "./FeatherIcon-D3qW7P5z.js";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Tree",
  props: {
    node: { type: Object, required: true },
    nodeKey: { type: String, required: true },
    options: { type: Object, required: false, default: () => ({
      rowHeight: "25px",
      indentWidth: "20px",
      showIndentationGuides: true,
      defaultCollapsed: true
    }) }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const slots = useSlots();
    const isCollapsed = ref(props.options.defaultCollapsed ?? true);
    const linePadding = ref("");
    const hasChildren = computed(() => {
      var _a;
      return ((_a = props.node.children) == null ? void 0 : _a.length) > 0;
    });
    const iconRef = ref(null);
    const toggleCollapsed = (event) => {
      event.stopPropagation();
      if (hasChildren.value) isCollapsed.value = !isCollapsed.value;
    };
    onMounted(() => {
      var _a;
      if ((_a = iconRef.value) == null ? void 0 : _a.clientWidth)
        linePadding.value = iconRef.value.clientWidth / 2 + "px";
    });
    const __returned__ = { props, slots, isCollapsed, linePadding, hasChildren, iconRef, toggleCollapsed, FeatherIcon };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { ref: "iconRef" };
const _hoisted_2 = {
  key: 0,
  class: "flex"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Tree = resolveComponent("Tree", true);
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      createCommentVNode(" Current Tree Node "),
      renderSlot(_ctx.$slots, "node", normalizeProps(guardReactiveProps({ node: $props.node, hasChildren: $setup.hasChildren, isCollapsed: $setup.isCollapsed, toggleCollapsed: $setup.toggleCollapsed })), () => [
        createBaseVNode(
          "div",
          {
            class: "flex items-center cursor-pointer gap-1",
            style: normalizeStyle({ height: $props.options.rowHeight }),
            onClick: $setup.toggleCollapsed
          },
          [
            createBaseVNode(
              "div",
              _hoisted_1,
              [
                createCommentVNode(" slot to only override the Icon "),
                renderSlot(_ctx.$slots, "icon", normalizeProps(guardReactiveProps({ hasChildren: $setup.hasChildren, isCollapsed: $setup.isCollapsed })), () => [
                  $setup.hasChildren && !$setup.isCollapsed ? (openBlock(), createBlock($setup["FeatherIcon"], {
                    key: 0,
                    name: "chevron-down",
                    class: "h-3.5"
                  })) : $setup.hasChildren ? (openBlock(), createBlock($setup["FeatherIcon"], {
                    key: 1,
                    name: "chevron-right",
                    class: "h-3.5"
                  })) : createCommentVNode("v-if", true)
                ])
              ],
              512
              /* NEED_PATCH */
            ),
            createCommentVNode(" slot to only override the label "),
            renderSlot(_ctx.$slots, "label", normalizeProps(guardReactiveProps({ node: $props.node, hasChildren: $setup.hasChildren, isCollapsed: $setup.isCollapsed })), () => [
              createBaseVNode(
                "div",
                {
                  class: normalizeClass(["text-base truncate", $setup.hasChildren ? "" : "pl-3.5"])
                },
                toDisplayString($props.node.label),
                3
                /* TEXT, CLASS */
              )
            ])
          ],
          4
          /* STYLE */
        )
      ]),
      createCommentVNode(" Recursively render the children "),
      $setup.hasChildren && !$setup.isCollapsed ? (openBlock(), createElementBlock("div", _hoisted_2, [
        $props.options.showIndentationGuides ? (openBlock(), createElementBlock(
          "div",
          {
            key: 0,
            style: normalizeStyle({ paddingLeft: $setup.linePadding }),
            class: "border-r"
          },
          null,
          4
          /* STYLE */
        )) : createCommentVNode("v-if", true),
        createBaseVNode(
          "ul",
          {
            class: "w-full",
            style: normalizeStyle({ paddingLeft: $props.options.indentWidth })
          },
          [
            (openBlock(true), createElementBlock(
              Fragment,
              null,
              renderList($props.node.children, (child) => {
                return openBlock(), createElementBlock("li", {
                  key: child[$props.nodeKey]
                }, [
                  createVNode(_component_Tree, {
                    node: child,
                    nodeKey: $props.nodeKey,
                    options: $props.options
                  }, {
                    node: withCtx(({ node, hasChildren, isCollapsed, toggleCollapsed }) => [
                      renderSlot(_ctx.$slots, "node", mergeProps({ ref_for: true }, { node, hasChildren, isCollapsed, toggleCollapsed }))
                    ]),
                    icon: withCtx(({ hasChildren, isCollapsed }) => [
                      renderSlot(_ctx.$slots, "icon", mergeProps({ ref_for: true }, { hasChildren, isCollapsed }))
                    ]),
                    label: withCtx(({ node, hasChildren, isCollapsed }) => [
                      renderSlot(_ctx.$slots, "label", mergeProps({ ref_for: true }, { node, hasChildren, isCollapsed }))
                    ]),
                    _: 2
                    /* DYNAMIC */
                  }, 1032, ["node", "nodeKey", "options"])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          4
          /* STYLE */
        )
      ])) : createCommentVNode("v-if", true)
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
_sfc_main$1.__file = "src/components/Tree/Tree.vue";
const Tree = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tree/Tree.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Tree.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const state = reactive({
      showIndentationGuides: true,
      rowHeight: "25px",
      indentWidth: "15px",
      node: {
        name: "guest",
        label: "Guest",
        children: [
          {
            name: "downloads",
            label: "Downloads",
            children: [
              {
                name: "download.zip",
                label: "download.zip",
                children: [
                  {
                    name: "image.png",
                    label: "image.png",
                    children: []
                  }
                ]
              }
            ]
          },
          {
            name: "documents",
            label: "Documents",
            children: [
              {
                name: "somefile.txt",
                label: "somefile.txt",
                children: []
              },
              {
                name: "somefile.pdf",
                label: "somefile.pdf",
                children: []
              }
            ]
          }
        ]
      }
    });
    const __returned__ = { state, Tree };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_HstCheckbox = resolveComponent("HstCheckbox");
  const _component_HstText = resolveComponent("HstText");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 500 } }, {
    controls: withCtx(() => [
      createVNode(_component_HstCheckbox, {
        modelValue: $setup.state.showIndentationGuides,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.state.showIndentationGuides = $event),
        title: "Show Indentation Guides"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstText, {
        modelValue: $setup.state.rowHeight,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.state.rowHeight = $event),
        title: "Row Height"
      }, null, 8, ["modelValue"]),
      createVNode(_component_HstText, {
        modelValue: $setup.state.indentWidth,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.state.indentWidth = $event),
        title: "Indent Width"
      }, null, 8, ["modelValue"])
    ]),
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "default" }, {
        default: withCtx(() => [
          createVNode($setup["Tree"], {
            options: {
              showIndentationGuides: $setup.state.showIndentationGuides,
              rowHeight: $setup.state.rowHeight,
              indentWidth: $setup.state.indentWidth
            },
            nodeKey: "name",
            node: $setup.state.node
          }, null, 8, ["options", "node"])
        ]),
        _: 1
        /* STABLE */
      })
    ]),
    _: 1
    /* STABLE */
  });
}
_sfc_main.__file = "src/components/Tree/Tree.story.vue";
const Tree_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tree/Tree.story.vue"]]);
export {
  Tree_story as default
};
