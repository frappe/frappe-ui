import { _ as __unplugin_components_1 } from "./Popover-DSg_0_Ha.js";
import { _ as __unplugin_components_0 } from "./Tooltip-H8KvrL0_.js";
import "./ListRow-lOkXLaPi.js";
import "./Autocomplete-O4EwE2fL.js";
import "./Avatar-38jsh7o0.js";
import "./Badge-C49IDOh4.js";
import "./Breadcrumbs-ChqQ3eqL.js";
import "./Button-jpol_Q2q.js";
import "./Combobox-CF3fq8I_.js";
import "./Checkbox-CUl5N7ZU.js";
import "./DateRangePicker-IC6e6AQT.js";
import "./Dialog-bA-XkFiR.js";
import "./Dropdown-Cm8Jv2aM.js";
import "./ErrorMessage-CPt7ywZP.js";
import "./FeatherIcon-zab7nM0A.js";
import "./FileUploader-MYrOrh-U.js";
import "./FormControl-DW3yyJ5C.js";
import "./Progress-B3TbtM1u.js";
import "./Rating-CBSCWGEU.js";
import "./Select-BiPsTt4t.js";
import "./Spinner-CDtXJ50E.js";
import "./Switch-COY7zUfR.js";
import "./TabButtons-CHKJckz9.js";
import "./Tabs-eC4dGShD.js";
import "./TextInput-CSWxrqkh.js";
import "./Textarea-DoXnegsn.js";
import "./Calendar-Bd4cl54J.js";
import "./CircularProgressBar-Degyjztg.js";
import "./Tree-C-9VDgNc.js";
import "./Sidebar-D75FSZ7e.js";
import "./NumberChart-YBcU_jvI.js";
import { aB as openBlock, aC as createBlock, aD as withCtx, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aF as createBaseVNode, aG as createElementBlock, aK as Fragment, aJ as renderList, aQ as normalizeClass } from "./vendor-B0gcEfye.js";
import "./dayjs-23b0dScZ.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./debounce-CRCtzhPg.js";
import "./chevron-down-CymZecTc.js";
const _sfc_main = {
  name: "FontColor",
  props: ["editor"],
  components: { Popover: __unplugin_components_1, Tooltip: __unplugin_components_0 },
  methods: {
    setBackgroundColor(color) {
      if (color.name != "Default") {
        this.editor.chain().focus().toggleHighlightByName(color.name.toLowerCase()).run();
      } else {
        this.editor.chain().focus().unsetHighlight().run();
      }
    },
    setForegroundColor(color) {
      if (color.name != "Default") {
        this.editor.chain().focus().setColorByName(color.name.toLowerCase()).run();
      } else {
        this.editor.chain().focus().unsetColor().run();
      }
    }
  },
  computed: {
    foregroundColors() {
      return [
        { name: "Default", class: "text-ink-gray-9" },
        { name: "Red", class: "text-red-600 dark:text-dark-red-400" },
        { name: "Orange", class: "text-orange-600 dark:text-dark-orange-400" },
        { name: "Yellow", class: "text-yellow-600 dark:text-dark-yellow-400" },
        { name: "Green", class: "text-green-600 dark:text-dark-green-400" },
        { name: "Teal", class: "text-teal-600 dark:text-dark-teal-400" },
        { name: "Cyan", class: "text-cyan-600 dark:text-dark-cyan-400" },
        { name: "Blue", class: "text-blue-600 dark:text-dark-blue-400" },
        { name: "Purple", class: "text-purple-600 dark:text-dark-purple-400" },
        { name: "Pink", class: "text-pink-600 dark:text-dark-pink-400" },
        { name: "Gray", class: "text-gray-600 dark:text-dark-gray-400" }
      ];
    },
    backgroundColors() {
      return [
        { name: "Default", class: "border-outline-gray-modals" },
        {
          name: "Red",
          class: "bg-red-100 dark:bg-dark-red-800 border-transparent"
        },
        {
          name: "Orange",
          class: "bg-orange-100 dark:bg-dark-orange-800 border-transparent"
        },
        {
          name: "Yellow",
          class: "bg-yellow-100 dark:bg-dark-yellow-800 border-transparent"
        },
        {
          name: "Green",
          class: "bg-green-100 dark:bg-dark-green-800 border-transparent"
        },
        {
          name: "Teal",
          class: "bg-teal-100 dark:bg-dark-teal-800 border-transparent"
        },
        {
          name: "Cyan",
          class: "bg-cyan-100 dark:bg-dark-cyan-800 border-transparent"
        },
        {
          name: "Blue",
          class: "bg-blue-100 dark:bg-dark-blue-800 border-transparent"
        },
        {
          name: "Purple",
          class: "bg-purple-100 dark:bg-dark-purple-800 border-transparent"
        },
        {
          name: "Pink",
          class: "bg-pink-100 dark:bg-dark-pink-800 border-transparent"
        },
        {
          name: "Gray",
          class: "bg-gray-100 dark:bg-dark-gray-800 border-transparent"
        }
      ];
    }
  }
};
const _hoisted_1 = { class: "p-2" };
const _hoisted_2 = { class: "mt-1 grid grid-cols-6 gap-1" };
const _hoisted_3 = ["aria-label", "onClick"];
const _hoisted_4 = { class: "mt-1 grid grid-cols-6 gap-1" };
const _hoisted_5 = ["aria-label", "onClick"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Tooltip = __unplugin_components_0;
  const _component_Popover = __unplugin_components_1;
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
                    class: normalizeClass(["flex h-5 w-5 items-center justify-center rounded border text-base", color.class]),
                    onClick: ($event) => $options.setForegroundColor(color)
                  }, " A ", 10, _hoisted_3)
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
                    class: normalizeClass(["flex h-5 w-5 items-center justify-center rounded border text-base text-ink-gray-9", color.class]),
                    onClick: ($event) => $options.setBackgroundColor(color)
                  }, " A ", 10, _hoisted_5)
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
