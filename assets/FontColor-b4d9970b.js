import { P as Popover } from "./Popover-46c379dd.js";
import "./ListView.story-3f55356d.js";
import "./Autocomplete-924c8207.js";
import "./Avatar-212cce74.js";
import "./Badge-2cbd2115.js";
import "./Breadcrumbs-aa489f95.js";
import "./Button-254389e1.js";
import "./Checkbox-bd84a969.js";
import "./DateRangePicker-4e0677af.js";
import "./Dialog-8f577e38.js";
import "./Dropdown-db2204d4.js";
import "./ErrorMessage-02f51dfc.js";
import "./FeatherIcon-832de258.js";
import "./FileUploader-ca38f70c.js";
import "./FormControl-669fd900.js";
import "./Progress-fb06e1db.js";
import "./Rating-61589608.js";
import "./Select-5794e5e8.js";
import "./Spinner-11e536cb.js";
import "./Switch-95cf9b01.js";
import "./Calendar-cb9e1bd3.js";
import "./Tabs-db6fd63b.js";
import "./TextInput-a35f26ac.js";
import "./Textarea-481ee4b1.js";
import { T as Tooltip } from "./Tooltip-4b834001.js";
import "./CircularProgressBar-b1ed9c74.js";
import "./Tree-7b047635.js";
import { aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aT as renderSlot, aU as normalizeProps, aV as guardReactiveProps, aF as createBaseVNode, aG as createElementBlock, aK as Fragment, aJ as renderList, aY as normalizeStyle, aW as normalizeClass } from "./vendor-d3f1bbba.js";
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
          { class: "text-sm text-gray-700" },
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
          { class: "mt-2 text-sm text-gray-700" },
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
                    class: normalizeClass(["flex h-5 w-5 items-center justify-center rounded border text-base text-gray-900", !color.hex ? "border-gray-200" : "border-transparent"]),
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
