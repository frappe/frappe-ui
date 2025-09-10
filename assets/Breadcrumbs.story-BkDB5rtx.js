import { ay as defineComponent, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aO as logEvent, aE as createVNode, aF as createBaseVNode, aN as toDisplayString } from "./vendor-Dk4Em66F.js";
import { B as Breadcrumbs } from "./Breadcrumbs-BCjPP37E.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Dropdown-DXJKkyo2.js";
import "./Button-BW9k6phM.js";
import "./FeatherIcon-Ceh9nG5I.js";
import "./Switch-BAnIIkJV.js";
import "./useId-DJabvbK8.js";
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
