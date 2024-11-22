import { ay as defineComponent, br as useSlots, az as ref, aQ as computed, bu as onMounted, aA as resolveComponent, aB as openBlock, aG as createElementBlock, aH as createCommentVNode, aT as renderSlot, aF as createBaseVNode, aU as normalizeProps, aV as guardReactiveProps, aC as createBlock, aW as normalizeClass, aN as toDisplayString, aY as normalizeStyle, aK as Fragment, aJ as renderList, aE as createVNode, aD as withCtx, aL as mergeProps } from "./vendor-62c6993a.js";
import { F as FeatherIcon } from "./FeatherIcon-0fef040d.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Tree",
  props: {
    node: { type: Object, required: true },
    nodeKey: { type: String, required: true },
    options: { type: Object, required: false, default: () => ({
      rowHeight: "25px",
      indentWidth: "20px",
      showIndentationGuides: true
    }) }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const slots = useSlots();
    const isCollapsed = ref(true);
    const linePadding = ref("");
    const hasChildren = computed(() => {
      var _a;
      return ((_a = props.node.children) == null ? void 0 : _a.length) > 0;
    });
    const iconRef = ref(null);
    const toggleCollapsed = (event) => {
      event.stopPropagation();
      if (hasChildren.value)
        isCollapsed.value = !isCollapsed.value;
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
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
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
_sfc_main.__file = "src/components/Tree/Tree.vue";
const Tree = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Tree/Tree.vue"]]);
export {
  Tree as T
};
