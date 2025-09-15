import { _ as __unplugin_components_1 } from "./Popover-CzA9YWcp.js";
import { _ as __unplugin_components_0 } from "./Button-D5TvV9Gh.js";
import "./ListRow-D2TDdaGT.js";
import "./Autocomplete-DwtwZ628.js";
import "./Avatar-Ckzq67LQ.js";
import "./Badge-DfZcHRt2.js";
import "./Breadcrumbs-y0y9cebq.js";
import "./plus-ChBqijgJ.js";
import "./Checkbox-Cj0eIozS.js";
import "./DatePicker-DyI-6_Zz.js";
import "./DateRangePicker-DdVgsRkr.js";
import "./Calendar-DwLAH31N.js";
import "./Dropdown-BF_PcYRp.js";
import "./ErrorMessage-D_JwCCeS.js";
import "./FeatherIcon-Wmu1TLct.js";
import "./FileUploader-YjAiUbO2.js";
import "./FormControl-k2bBSPHV.js";
import "./Progress-D5BkK4sv.js";
import "./Rating-CBHgTMjR.js";
import "./Select-BoYEnLk5.js";
import "./Password-DHDEKiDK.js";
import "./Spinner-Cp-2IzUp.js";
import "./Switch-DtNnBdlD.js";
import "./TabButtons-Df2mV-WA.js";
import "./Tabs-C0dzdKFv.js";
import "./TextInput-BToXGlmY.js";
import "./Textarea-BnV_RuZB.js";
import "./TimePicker-e-Ugj3rZ.js";
import "./CircularProgressBar-BpYyfKsL.js";
import "./Tree-Ckrxfyax.js";
import "./Sidebar-B87Jfl-1.js";
import "./NumberChart-MmE6gOEj.js";
import { aB as openBlock, aC as createBlock, aD as withCtx, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aG as createElementBlock, aK as Fragment, aJ as renderList, aR as normalizeClass } from "./vendor-DBifjAOG.js";
import "./dayjs-PBW4btL-.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Dialog-BZs9Q_RZ.js";
import "./debounce-CRCtzhPg.js";
import "./chevron-down-C-UPl2b4.js";
import "./useId-DJabvbK8.js";
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
