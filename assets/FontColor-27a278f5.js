import { P as Popover } from "./Popover-6be7ca16.js";
import "./ListView.story-5fc909f9.js";
import "./Autocomplete-7c0c8a78.js";
import "./Avatar-a529751d.js";
import "./Badge-45aa62d3.js";
import "./Breadcrumbs-747ae922.js";
import "./Button-f2bb0ab5.js";
import "./Checkbox-197517e8.js";
import "./DateRangePicker-501850d5.js";
import "./Dialog-87e3362a.js";
import "./Dropdown-6e897218.js";
import "./ErrorMessage-b460ce0a.js";
import "./FeatherIcon-97daa181.js";
import "./FileUploader-170abd5d.js";
import "./FormControl-8b68c5d3.js";
import "./Progress-ea58e00e.js";
import "./Rating-b298c960.js";
import "./Select-fa671936.js";
import "./Spinner-be5183b6.js";
import "./Switch-3e2b85b5.js";
import "./TabButtons-401c4011.js";
import "./Tabs-0c9c05f2.js";
import "./TextInput-fcad751f.js";
import "./Textarea-b6b02c71.js";
import { T as Tooltip } from "./Tooltip-6c095d00.js";
import "./Calendar-c5b79a69.js";
import "./CircularProgressBar-98f552e4.js";
import "./Tree-a90d04b4.js";
import { aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aT as renderSlot, aU as normalizeProps, aV as guardReactiveProps, aF as createBaseVNode, aG as createElementBlock, aK as Fragment, aJ as renderList, aY as normalizeStyle, aW as normalizeClass } from "./vendor-7778cb0e.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-cc2b3d55.js";
import "./debounce-d11286cd.js";
const _sfc_main = {
  name: "FontColor",
  props: ["editor"],
  components: { Popover, Tooltip },
  methods: {
    setBackgroundColor(color) {
      if (color.name != "Default") {
        this.editor.chain().focus().toggleHighlight({ color: color.hex }).run();
      } else {
        this.editor.chain().focus().unsetHighlight().run();
      }
    },
    setForegroundColor(color) {
      if (color.name != "Default") {
        this.editor.chain().focus().setColor(color.hex).run();
      } else {
        this.editor.chain().focus().unsetColor().run();
      }
    }
  },
  computed: {
    foregroundColors() {
      return [
        { name: "Default", hex: "#1F272E" },
        { name: "Yellow", hex: "#ca8a04" },
        { name: "Orange", hex: "#ea580c" },
        { name: "Red", hex: "#dc2626" },
        { name: "Green", hex: "#16a34a" },
        { name: "Blue", hex: "#1579D0" },
        { name: "Purple", hex: "#9333ea" },
        { name: "Pink", hex: "#db2777" }
      ];
    },
    backgroundColors() {
      return [
        { name: "Default", hex: null },
        { name: "Yellow", hex: "#fef9c3" },
        { name: "Orange", hex: "#ffedd5" },
        { name: "Red", hex: "#fee2e2" },
        { name: "Green", hex: "#dcfce7" },
        { name: "Blue", hex: "#D3E9FC" },
        { name: "Purple", hex: "#f3e8ff" },
        { name: "Pink", hex: "#fce7f3" }
      ];
    }
  }
};
const _hoisted_1 = { class: "p-2" };
const _hoisted_2 = { class: "mt-1 grid grid-cols-8 gap-1" };
const _hoisted_3 = ["aria-label", "onClick"];
const _hoisted_4 = { class: "mt-1 grid grid-cols-8 gap-1" };
const _hoisted_5 = ["aria-label", "onClick"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Tooltip = resolveComponent("Tooltip");
  const _component_Popover = resolveComponent("Popover");
  return openBlock(), createBlock(_component_Popover, { transition: "default" }, {
    target: withCtx(({ togglePopover, isOpen }) => [
      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({ onClick: () => togglePopover(), isActive: isOpen })))
    ]),
    "body-main": withCtx(() => [
      createBaseVNode("div", _hoisted_1, [
        _cache[0] || (_cache[0] = createBaseVNode(
          "div",
          { class: "text-sm text-ink-gray-7" },
          "Text Color",
          -1
          /* HOISTED */
        )),
        createBaseVNode("div", _hoisted_2, [
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList($options.foregroundColors, (color) => {
              return openBlock(), createBlock(_component_Tooltip, {
                class: "flex",
                key: color.name,
                text: color.name
              }, {
                default: withCtx(() => [
                  createBaseVNode("button", {
                    "aria-label": color.name,
                    class: "flex h-5 w-5 items-center justify-center rounded border text-base",
                    style: normalizeStyle({
                      color: color.hex
                    }),
                    onClick: ($event) => $options.setForegroundColor(color)
                  }, " A ", 12, _hoisted_3)
                ]),
                _: 2
                /* DYNAMIC */
              }, 1032, ["text"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        _cache[1] || (_cache[1] = createBaseVNode(
          "div",
          { class: "mt-2 text-sm text-ink-gray-7" },
          "Background Color",
          -1
          /* HOISTED */
        )),
        createBaseVNode("div", _hoisted_4, [
          (openBlock(true), createElementBlock(
            Fragment,
            null,
            renderList($options.backgroundColors, (color) => {
              return openBlock(), createBlock(_component_Tooltip, {
                class: "flex",
                key: color.name,
                text: color.name
              }, {
                default: withCtx(() => [
                  createBaseVNode("button", {
                    "aria-label": color.name,
                    class: normalizeClass([
                      "flex h-5 w-5 items-center justify-center rounded border text-base text-ink-gray-9",
                      !color.hex ? "border-outline-gray-modals" : "border-transparent"
                    ]),
                    style: normalizeStyle({
                      backgroundColor: color.hex
                    }),
                    onClick: ($event) => $options.setBackgroundColor(color)
                  }, " A ", 14, _hoisted_5)
                ]),
                _: 2
                /* DYNAMIC */
              }, 1032, ["text"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]),
    _: 3
    /* FORWARDED */
  });
}
_sfc_main.__file = "src/components/TextEditor/FontColor.vue";
const FontColor = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/FontColor.vue"]]);
export {
  FontColor as default
};
