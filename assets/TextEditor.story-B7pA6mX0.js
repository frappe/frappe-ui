import { ay as defineComponent, az as ref, aA as resolveComponent, aB as openBlock, aC as createBlock, aD as withCtx, aT as EditorContent, aE as createVNode, aF as createBaseVNode, aM as createTextVNode } from "./vendor-Cr0xrOOr.js";
import { T as TextEditor, g as TextEditorFixedMenu } from "./ListRow-Chgt6zep.js";
import { _ as __unplugin_components_0 } from "./Button-aKHd6t9l.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-hdxB44Yp.js";
import "./Autocomplete-DfXyYi-C.js";
import "./Popover-NY3U3LiJ.js";
import "./FeatherIcon-Bs98WE2C.js";
import "./Avatar-BooO6iOt.js";
import "./Badge-BNZjGlLK.js";
import "./Breadcrumbs-CjxxlW1j.js";
import "./Dropdown-BDlLrZtA.js";
import "./DateRangePicker-CR7UQWag.js";
import "./TextInput-Czkt738L.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-DrqY9r9l.js";
import "./Dialog-Dsbcn4Xu.js";
import "./ErrorMessage-CiKXVd25.js";
import "./FileUploader-C9q8wTSY.js";
import "./FormControl-wNP1gk7O.js";
import "./Select-FN0Fj_zR.js";
import "./Textarea-Bz6xdQER.js";
import "./Progress-BavzUk2X.js";
import "./Rating-CmuXuP5D.js";
import "./Spinner-CrERfgVH.js";
import "./Switch-CBl3VFlW.js";
import "./TabButtons-BOD1si_G.js";
import "./Tabs-BHIr6iIR.js";
import "./Tooltip-BIFLmxf4.js";
import "./Calendar-B4_oL0uB.js";
import "./CircularProgressBar-GjB7Hz0Z.js";
import "./Tree-CPapHv49.js";
import "./NumberChart-BBsmTAie.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TextEditor.story",
  setup(__props, { expose: __expose }) {
    __expose();
    const value = ref(`
<div>
  <h2>Heading 2</h2>
  <p>
    This is a paragraph with <strong>bold</strong> and <em>italic</em> text.
  </p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
  <p>
    <a href="https://frappe.io">Frappe</a>
  </p>
  <pre><code class="language-javascript">import { Button } from 'frappe-ui'
const value = ref(true);</code>
  </pre>
</div>
`);
    const customValue = ref("");
    const customButtons = [
      "Paragraph",
      ["Heading 2", "Heading 3", "Heading 4"],
      "Separator",
      "Bold",
      "Italic",
      "Separator",
      "Bullet List",
      "Numbered List",
      "Separator",
      "Link",
      "Image"
    ];
    const __returned__ = { value, customValue, customButtons, get EditorContent() {
      return EditorContent;
    }, TextEditor, TextEditorFixedMenu, get Button() {
      return __unplugin_components_0;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
const _hoisted_1 = { class: "p-2" };
const _hoisted_2 = { class: "p-2" };
const _hoisted_3 = { class: "mt-2 flex flex-col justify-between sm:flex-row sm:items-center" };
const _hoisted_4 = { class: "mt-2 flex items-center justify-end space-x-2 sm:mt-0" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Variant = resolveComponent("Variant");
  const _component_Story = resolveComponent("Story");
  return openBlock(), createBlock(_component_Story, {
    layout: { width: 600, type: "grid" },
    autoPropsDisabled: ""
  }, {
    default: withCtx(() => [
      createVNode(_component_Variant, { title: "Basic" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1, [
            createVNode($setup["TextEditor"], {
              "editor-class": "prose-sm min-h-[4rem] border rounded-b-lg border-t-0 p-2",
              content: $setup.value,
              placeholder: "Type something...",
              onChange: _cache[0] || (_cache[0] = (val) => $setup.value = val),
              bubbleMenu: true,
              "fixed-menu": true
            }, null, 8, ["content"])
          ])
        ]),
        _: 1
        /* STABLE */
      }),
      createVNode(_component_Variant, { title: "Comment Editor" }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_2, [
            createVNode($setup["TextEditor"], {
              ref: "textEditor",
              "editor-class": "prose-sm max-w-none min-h-[4rem]",
              content: $setup.customValue,
              onChange: _cache[1] || (_cache[1] = (val) => $setup.customValue = val),
              "starterkit-options": { heading: { levels: [2, 3, 4] } },
              placeholder: "Write something amazing..."
            }, {
              editor: withCtx(({ editor }) => [
                createVNode($setup["EditorContent"], {
                  class: "max-h-[50vh] overflow-y-auto border rounded-lg p-4",
                  editor
                }, null, 8, ["editor"])
              ]),
              bottom: withCtx(() => [
                createBaseVNode("div", _hoisted_3, [
                  createVNode($setup["TextEditorFixedMenu"], {
                    class: "-ml-1 overflow-x-auto",
                    buttons: $setup.customButtons
                  }),
                  createBaseVNode("div", _hoisted_4, [
                    createVNode($setup["Button"], null, {
                      default: withCtx(() => _cache[2] || (_cache[2] = [
                        createTextVNode("Cancel")
                      ])),
                      _: 1
                      /* STABLE */
                    }),
                    createVNode($setup["Button"], { variant: "solid" }, {
                      default: withCtx(() => _cache[3] || (_cache[3] = [
                        createTextVNode("Submit")
                      ])),
                      _: 1
                      /* STABLE */
                    })
                  ])
                ])
              ]),
              _: 1
              /* STABLE */
            }, 8, ["content"])
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
_sfc_main.__file = "src/components/TextEditor/TextEditor.story.vue";
const TextEditor_story = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/TextEditor.story.vue"]]);
export {
  TextEditor_story as default
};
