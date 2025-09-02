import { ay as defineComponent, cl as useRouter, cm as useWindowSize, aW as computed, aA as resolveComponent, aB as openBlock, aG as createElementBlock, aK as Fragment, aE as createVNode, aD as withCtx, aF as createBaseVNode, aH as createCommentVNode, aJ as renderList, aC as createBlock, aZ as renderSlot, aN as toDisplayString, aR as normalizeClass } from "./vendor-2CZqcq_N.js";
import { D as Dropdown } from "./Dropdown-CPgKBUI4.js";
import { B as Button } from "./Button-L9MLNqBl.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Breadcrumbs",
  props: {
    items: { type: Array, required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const router = useRouter();
    const { width } = useWindowSize();
    const items = computed(() => {
      return (props.items || []).filter(Boolean);
    });
    const dropdownItems = computed(() => {
      if (width.value > 640) return [];
      let allExceptLastTwo = items.value.slice(0, -2);
      return allExceptLastTwo.map((item) => {
        let onClick = () => {
          if (item.onClick) {
            item.onClick();
          }
          if (item.route) {
            router.push(item.route);
          }
        };
        return {
          ...item,
          icon: null,
          label: item.label,
          onClick
        };
      });
    });
    const crumbs = computed(() => {
      if (width.value > 640) return items.value;
      let lastTwo = items.value.slice(-2);
      return lastTwo;
    });
    const __returned__ = { props, router, width, items, dropdownItems, crumbs, get Dropdown() {
      return Dropdown;
    }, get Button() {
      return Button;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "flex min-w-0 items-center" };
const _hoisted_2 = { class: "flex min-w-0 items-center overflow-hidden text-ellipsis whitespace-nowrap" };
const _hoisted_3 = ["onClick"];
const _hoisted_4 = {
  key: 2,
  class: "mx-0.5 text-base text-ink-gray-4",
  "aria-hidden": "true"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  return openBlock(), createElementBlock("div", _hoisted_1, [
    $setup.dropdownItems.length ? (openBlock(), createElementBlock(
      Fragment,
      { key: 0 },
      [
        createVNode($setup["Dropdown"], {
          class: "h-7",
          options: $setup.dropdownItems
        }, {
          default: withCtx(() => [
            createVNode($setup["Button"], { variant: "ghost" }, {
              icon: withCtx(() => _cache[0] || (_cache[0] = [
                createBaseVNode(
                  "svg",
                  {
                    class: "w-4 text-ink-gray-5",
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "24",
                    height: "24",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round"
                  },
                  [
                    createBaseVNode("circle", {
                      cx: "12",
                      cy: "12",
                      r: "1"
                    }),
                    createBaseVNode("circle", {
                      cx: "19",
                      cy: "12",
                      r: "1"
                    }),
                    createBaseVNode("circle", {
                      cx: "5",
                      cy: "12",
                      r: "1"
                    })
                  ],
                  -1
                  /* HOISTED */
                )
              ])),
              _: 1
              /* STABLE */
            })
          ]),
          _: 1
          /* STABLE */
        }, 8, ["options"]),
        _cache[1] || (_cache[1] = createBaseVNode(
          "span",
          {
            class: "ml-1 mr-0.5 text-base text-ink-gray-4",
            "aria-hidden": "true"
          },
          " / ",
          -1
          /* HOISTED */
        ))
      ],
      64
      /* STABLE_FRAGMENT */
    )) : createCommentVNode("v-if", true),
    createBaseVNode("div", _hoisted_2, [
      (openBlock(true), createElementBlock(
        Fragment,
        null,
        renderList($setup.crumbs, (item, i) => {
          return openBlock(), createElementBlock(
            Fragment,
            {
              key: item.label
            },
            [
              item.route ? (openBlock(), createBlock(_component_router_link, {
                key: 0,
                to: item.route,
                onClick: ($event) => item.onClick ? item.onClick() : null,
                class: normalizeClass(["flex items-center rounded px-0.5 py-1 text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-3", [
                  i == $setup.crumbs.length - 1 ? "text-ink-gray-9" : "text-ink-gray-5 hover:text-ink-gray-7"
                ]])
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "prefix", { item }),
                  createBaseVNode(
                    "span",
                    null,
                    toDisplayString(item.label),
                    1
                    /* TEXT */
                  ),
                  renderSlot(_ctx.$slots, "suffix", { item })
                ]),
                _: 2
                /* DYNAMIC */
              }, 1032, ["to", "onClick", "class"])) : (openBlock(), createElementBlock("button", {
                key: 1,
                onClick: ($event) => item.onClick ? item.onClick() : null,
                class: normalizeClass(["flex items-center rounded px-0.5 py-1 text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-3", [
                  i == $setup.crumbs.length - 1 ? "text-ink-gray-9" : "text-ink-gray-5 hover:text-ink-gray-7"
                ]])
              }, [
                renderSlot(_ctx.$slots, "prefix", { item }),
                createBaseVNode(
                  "span",
                  null,
                  toDisplayString(item.label),
                  1
                  /* TEXT */
                ),
                renderSlot(_ctx.$slots, "suffix", { item })
              ], 10, _hoisted_3)),
              i != $setup.crumbs.length - 1 ? (openBlock(), createElementBlock("span", _hoisted_4, " / ")) : createCommentVNode("v-if", true)
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
_sfc_main.__file = "src/components/Breadcrumbs/Breadcrumbs.vue";
const Breadcrumbs = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Breadcrumbs/Breadcrumbs.vue"]]);
export {
  Breadcrumbs as B
};
