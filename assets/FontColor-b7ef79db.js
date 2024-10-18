import { P as Popover } from "./Popover-fde287bf.js";
import "./ListView.story-1b36ece4.js";
import "./Autocomplete-73a4fca9.js";
import "./Avatar-9fdf64b9.js";
import "./Badge-78f260a0.js";
import "./Breadcrumbs-c4619c04.js";
import "./Button-82883e94.js";
import "./Checkbox-4a0bbba2.js";
import "./DateRangePicker-8ee4b406.js";
import "./Dialog-89940f62.js";
import "./Dropdown-820186c0.js";
import "./ErrorMessage-f087529c.js";
import "./FeatherIcon-2fe58b00.js";
import "./FileUploader-61a49497.js";
import "./FormControl-bd4c97fd.js";
import "./Progress-9b8330f6.js";
import "./Rating-8af7cac9.js";
import "./Select-ceb7810a.js";
import "./Spinner-5d320c25.js";
import "./Switch-4faebb3c.js";
import "./Calendar-d5dab5d5.js";
import "./Tabs-febc040d.js";
import "./TextInput-5a8bc4aa.js";
import "./Textarea-4c25baef.js";
import { T as Tooltip } from "./Tooltip-5be5845e.js";
import "./CircularProgressBar-9c59c4cb.js";
import "./Tree-1247f4d0.js";
import { aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aT as renderSlot, aU as normalizeProps, aV as guardReactiveProps, aF as createBaseVNode, aG as createElementBlock, aK as Fragment, aJ as renderList, aY as normalizeStyle, aW as normalizeClass } from "./vendor-8a63165b.js";
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
