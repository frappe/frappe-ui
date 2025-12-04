import { ay as markRaw, az as openBlock, aA as createElementBlock, aB as createBaseVNode, aC as defineComponent, aV as useTemplateRef, aW as useRouter, aN as ref, aF as computed, aX as useResizeObserver, aO as resolveComponent, aT as Fragment, aM as createVNode, aP as withCtx, aK as createCommentVNode, aS as renderList, aH as createBlock, aG as renderSlot, aL as toDisplayString, aI as normalizeClass, aY as nextTick, aZ as logEvent } from "./vendor-1IneiQSJ.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { D as Dropdown } from "./Dropdown-BvWs2KSs.js";
import { B as Button } from "./Button-cTKeZts1.js";
import "./FeatherIcon-FGH1Y-V4.js";
import "./Switch-zqw-IDIk.js";
import "./useId-DJabvbK8.js";
const _hoisted_1$2 = {
  class: "lucide lucide-ellipsis",
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$2, _cache[0] || (_cache[0] = [
    createBaseVNode(
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "1"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "circle",
      {
        cx: "19",
        cy: "12",
        r: "1"
      },
      null,
      -1
      /* HOISTED */
    ),
    createBaseVNode(
      "circle",
      {
        cx: "5",
        cy: "12",
        r: "1"
      },
      null,
      -1
      /* HOISTED */
    )
  ]));
}
const LucideEllipsis = markRaw({ name: "lucide-ellipsis", render });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Breadcrumbs",
  props: {
    items: { type: Array, required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const crumbsEl = useTemplateRef("crumbsRef");
    const props = __props;
    const router = useRouter();
    const overflowedX = ref(false);
    const items = computed(() => {
      return (props.items || []).filter(Boolean);
    });
    const checkOverflow = () => {
      if (!crumbsEl.value) return;
      overflowedX.value = false;
      nextTick(() => {
        var _a, _b;
        const scrollWidth = ((_a = crumbsEl.value) == null ? void 0 : _a.scrollWidth) || 0;
        const clientWidth = ((_b = crumbsEl.value) == null ? void 0 : _b.clientWidth) || 0;
        overflowedX.value = scrollWidth > clientWidth;
      });
    };
    useResizeObserver(crumbsEl, checkOverflow);
    const dropdownItems = computed(() => {
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
    const crumbs = computed(() => items.value.slice(overflowedX.value ? -2 : 0));
    const __returned__ = { crumbsEl, props, router, overflowedX, items, checkOverflow, dropdownItems, crumbs, get Dropdown() {
      return Dropdown;
    }, get Button() {
      return Button;
    }, get LucideEllipsis() {
      return LucideEllipsis;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1$1 = {
  class: "flex min-w-0 items-center",
  ref: "crumbsRef"
};
const _hoisted_2 = { class: "flex min-w-0 items-center text-ellipsis whitespace-nowrap" };
const _hoisted_3 = ["onClick"];
const _hoisted_4 = {
  key: 2,
  class: "mx-0.5 text-base text-ink-gray-4",
  "aria-hidden": "true"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_link = resolveComponent("router-link");
  return openBlock(), createElementBlock(
    "div",
    _hoisted_1$1,
    [
      $setup.overflowedX && $setup.items.length > 2 ? (openBlock(), createElementBlock(
        Fragment,
        { key: 0 },
        [
          createVNode($setup["Dropdown"], {
            class: "h-7",
            options: $setup.dropdownItems
          }, {
            default: withCtx(() => [
              createVNode($setup["Button"], { variant: "ghost" }, {
                icon: withCtx(() => [
                  createVNode($setup["LucideEllipsis"], { class: "w-4 text-ink-gray-5" })
                ]),
                _: 1
                /* STABLE */
              })
            ]),
            _: 1
            /* STABLE */
          }, 8, ["options"]),
          _cache[0] || (_cache[0] = createBaseVNode(
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
    ],
    512
    /* NEED_PATCH */
  );
}
_sfc_main$1.__file = "src/components/Breadcrumbs/Breadcrumbs.vue";
const Breadcrumbs = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Breadcrumbs/Breadcrumbs.vue"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Breadcrumbs.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = { get logEvent() {
      return logEvent;
    }, Breadcrumbs };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "mr-1" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, { layout: { type: "grid", width: 500 } }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "With route option" }, {
        default: withCtx(() => [
          createVNode($setup["Breadcrumbs"], { items: [
            {
              label: "Home",
              route: { name: "Home" }
            },
            {
              label: "Views",
              route: "/components"
            },
            {
              label: "List",
              route: "/components/breadcrumbs"
            }
          ] })
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "With onClick option" }, {
        default: withCtx(() => [
          createVNode($setup["Breadcrumbs"], {
            items: [
              {
                label: "Home",
                onClick: () => $setup.logEvent("onClick", "Home")
              },
              {
                label: "Views",
                onClick: () => $setup.logEvent("onClick", "Home")
              },
              {
                label: "Kanban",
                onClick: () => $setup.logEvent("onClick", "Home")
              }
            ]
          }, null, 8, ["items"])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "With prefix slot" }, {
        default: withCtx(() => [
          createVNode($setup["Breadcrumbs"], { items: [
            {
              label: "Home",
              icon: "🏡",
              route: { name: "Home" }
            },
            {
              label: "Views",
              icon: "🏞️",
              route: "/components"
            },
            {
              label: "List",
              icon: "📃",
              route: "/components/breadcrumbs"
            }
          ] }, {
            prefix: withCtx(({ item }) => [
              createBaseVNode(
                "span",
                _hoisted_1,
                toDisplayString(item.icon),
                1
                /* TEXT */
              )
            ]),
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
  });
}
_sfc_main.__file = "src/components/Breadcrumbs/Breadcrumbs.story.vue";
const Breadcrumbs_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Breadcrumbs/Breadcrumbs.story.vue"]]);
export {
  Breadcrumbs_story as default
};
