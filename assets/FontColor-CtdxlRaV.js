import { P as Popover } from "./Popover-DDHSdhpw.js";
import "./ListRow-frVYNN8K.js";
import "./Autocomplete-B9f7fta1.js";
import "./Avatar-dlv9Z4_h.js";
import "./Badge-CtRuRwce.js";
import "./Breadcrumbs-B-egCGTb.js";
import "./Button-BZlzz42p.js";
import "./Checkbox-DoEHfrUD.js";
import "./DateRangePicker-CON8wfOm.js";
import "./Dialog-DniIr3PU.js";
import "./Dropdown-ABqswuLo.js";
import "./ErrorMessage-BuHlDb41.js";
import "./FeatherIcon-Jc-MBTQb.js";
import "./FileUploader-CRuA7NHb.js";
import "./FormControl-B_22e0Sl.js";
import "./Progress-D-KYt3l7.js";
import "./Rating-WFcTvt5I.js";
import "./Select-CWFWkqZ7.js";
import "./Spinner-Bq97W7cg.js";
import "./Switch-U9M5x31Z.js";
import "./TabButtons-DAxnfkTh.js";
import "./Tabs-ZeJnxGo_.js";
import "./TextInput-C49HP_KT.js";
import "./Textarea-C1YqCzxG.js";
import "./TextEditor-BDjkF3T2.js";
import { T as Tooltip } from "./Tooltip-BGTqU1y5.js";
import "./Calendar-BMv99Y1v.js";
import "./CircularProgressBar-D9DNTlFE.js";
import "./Tree-BjrvEx7H.js";
import { aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, bu as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aG as createElementBlock, aK as Fragment, aJ as renderList, bx as normalizeStyle, aQ as normalizeClass } from "./vendor-BP8HmH5Q.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./debounce-CRCtzhPg.js";
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
