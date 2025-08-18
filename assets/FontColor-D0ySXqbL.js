import { _ as __unplugin_components_1 } from "./Popover-CLstTk6Q.js";
import { _ as __unplugin_components_0 } from "./Button-BGUm8khL.js";
import "./ListRow-CZOvnaqt.js";
import "./Autocomplete-B0n15T_D.js";
import "./Avatar-DdsQ1KGi.js";
import "./Badge-Br2-Uagf.js";
import "./Breadcrumbs-B2FzDVUF.js";
import "./Combobox-DqPagv31.js";
import "./Checkbox-D0Bt6Gvh.js";
import "./DateRangePicker-COjV_5hh.js";
import "./Calendar-DSimKaEl.js";
import "./Dropdown-YaQ6tnY0.js";
import "./ErrorMessage-7j6rD32r.js";
import "./FeatherIcon-C9dmtlpw.js";
import "./FileUploader-CuIm9l-D.js";
import "./FormControl-LR00xMk9.js";
import "./Progress-BvfnfMwU.js";
import "./Rating-DqLoZnbI.js";
import "./Select-BBsRjg7j.js";
import "./Password-Bwyv99c6.js";
import "./Spinner-BwzMb6Jt.js";
import "./Switch-CEZVH8ZZ.js";
import "./TabButtons-DRG2nLIj.js";
import "./Tabs-DYdWkkPw.js";
import "./TextInput-DNZmOmdi.js";
import "./Textarea-J14YSVJA.js";
import "./CircularProgressBar-BuiiNE9C.js";
import "./Tree-XXer5Hab.js";
import "./Sidebar-Zq9Us3rm.js";
import "./NumberChart-wfLG6FF-.js";
import { aB as openBlock, aC as createBlock, aD as withCtx, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aG as createElementBlock, aK as Fragment, aJ as renderList, aR as normalizeClass } from "./vendor-B2lWDha5.js";
import "./dayjs-B5nTK4uw.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Dialog-C1QuC1r5.js";
import "./debounce-CRCtzhPg.js";
import "./chevron-down-B1_c6m65.js";
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
