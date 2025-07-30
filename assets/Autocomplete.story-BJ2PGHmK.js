import { ay as defineComponent, az as ref, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aE as createVNode, aF as createBaseVNode, aG as createElementBlock, aH as createCommentVNode } from "./vendor-DJfK-8-n.js";
import { A as Autocomplete } from "./Autocomplete-D8qb5tEd.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Popover-BWYlhtYc.js";
import "./Button-C7Z5NtZB.js";
import "./FeatherIcon-njTlGqML.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Autocomplete.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const single = ref();
    const people = ref(null);
    const options = [
      {
        label: "John Doe",
        value: "john-doe",
        image: "https://randomuser.me/api/portraits/men/59.jpg"
      },
      {
        label: "Jane Doe",
        value: "jane-doe",
        image: "https://randomuser.me/api/portraits/women/58.jpg"
      },
      {
        label: "John Smith",
        value: "john-smith",
        image: "https://randomuser.me/api/portraits/men/59.jpg"
      },
      {
        label: "Jane Smith",
        value: "jane-smith",
        image: "https://randomuser.me/api/portraits/women/59.jpg"
      },
      {
        label: "John Wayne",
        value: "john-wayne",
        image: "https://randomuser.me/api/portraits/men/57.jpg"
      },
      {
        label: "Jane Wayne",
        value: "jane-wayne",
        image: "https://randomuser.me/api/portraits/women/51.jpg"
      }
    ];
    const __returned__ = { single, people, options, Autocomplete };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-2" };
const _hoisted_2 = { class: "p-2" };
const _hoisted_3 = ["src"];
const _hoisted_4 = ["src"];
const _hoisted_5 = { class: "p-2" };
const _hoisted_6 = { class: "p-2" };
const _hoisted_7 = { class: "p-2" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, {
    layout: { width: 500, type: "grid" },
    autoPropsDisabled: ""
  }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Single option" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["Autocomplete"], {
              options: $setup.options,
              modelValue: $setup.single,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.single = $event),
              placeholder: "Select person"
            }, null, 8, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Single option with prefix slots" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_2, [
            createVNode($setup["Autocomplete"], {
              options: $setup.options,
              modelValue: $setup.single,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.single = $event),
              placeholder: "Select person"
            }, {
              prefix: withCtx(() => [
                $setup.single ? (openBlock(), createElementBlock("img", {
                  key: 0,
                  src: $setup.single.image,
                  class: "mr-2 h-4 w-4 rounded-full"
                }, null, 8, _hoisted_3)) : createCommentVNode("v-if", true)
              ]),
              "item-prefix": withCtx(({ option }) => [
                createBaseVNode("img", {
                  src: option.image,
                  class: "h-4 w-4 rounded-full"
                }, null, 8, _hoisted_4)
              ]),
              _: 1
              /* STABLE */
            }, 8, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Single option without search" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_5, [
            createVNode($setup["Autocomplete"], {
              options: $setup.options,
              modelValue: $setup.single,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.single = $event),
              placeholder: "Select person",
              hideSearch: true
            }, null, 8, ["modelValue"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Multiple options" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_6, [
            createVNode($setup["Autocomplete"], {
              options: $setup.options,
              modelValue: $setup.people,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.people = $event),
              placeholder: "Select people",
              multiple: true,
              compareFn: (a, b) => a.value === b.value
            }, null, 8, ["modelValue", "compareFn"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Multiple options without search" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_7, [
            createVNode($setup["Autocomplete"], {
              options: $setup.options,
              modelValue: $setup.people,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $setup.people = $event),
              placeholder: "Select people",
              multiple: true,
              hideSearch: true
            }, null, 8, ["modelValue"])
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
_sfc_main.__file = "src/components/Autocomplete/Autocomplete.story.vue";
const Autocomplete_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/Autocomplete/Autocomplete.story.vue"]]);
export {
  Autocomplete_story as default
};
