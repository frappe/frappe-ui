import { D as Dialog } from "./Dialog-zvhrhJGW.js";
import { B as Button } from "./Button-CaIZaicA.js";
import { F as FormControl } from "./FormControl-C-wAy-LS.js";
import { aA as resolveComponent, aB as openBlock, aG as createElementBlock, bu as renderSlot, aR as normalizeProps, aS as guardReactiveProps, aE as createVNode, aD as withCtx, cd as withKeys, aM as createTextVNode, aK as Fragment } from "./vendor-ZjnwxwCy.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./FeatherIcon-DFRlgidg.js";
import "./Checkbox-BI0fXkJf.js";
import "./TextInput-pSvn3SFY.js";
import "./debounce-CRCtzhPg.js";
import "./Select-hGScRufZ.js";
import "./Textarea-DhaaxINL.js";
import "./Autocomplete-Bg-6nDHF.js";
import "./Popover-CZFzbrDw.js";
const _sfc_main = {
  name: "InsertLink",
  props: ["editor"],
  components: { Button, FormControl, Dialog },
  data() {
    return {
      setLinkDialog: { url: "", show: false }
    };
  },
  methods: {
    openDialog() {
      let existingURL = this.editor.getAttributes("link").href;
      if (existingURL) {
        this.setLinkDialog.url = existingURL;
      }
      this.setLinkDialog.show = true;
    },
    setLink(url) {
      if (url === "") {
        this.editor.chain().focus().extendMarkRange("link").unsetLink().run();
      } else {
        this.editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      }
      this.setLinkDialog.show = false;
      this.setLinkDialog.url = "";
    },
    reset() {
      this.setLinkDialog = this.$options.data().setLinkDialog;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_FormControl = resolveComponent("FormControl");
  const _component_Button = resolveComponent("Button");
  const _component_Dialog = resolveComponent("Dialog");
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({ onClick: $options.openDialog }))),
      createVNode(_component_Dialog, {
        options: { title: "Set Link" },
        modelValue: $data.setLinkDialog.show,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.setLinkDialog.show = $event),
        onAfterLeave: $options.reset
      }, {
        "body-content": withCtx(() => [
          createVNode(_component_FormControl, {
            type: "text",
            label: "URL",
            modelValue: $data.setLinkDialog.url,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.setLinkDialog.url = $event),
            onKeydown: _cache[1] || (_cache[1] = withKeys((e) => $options.setLink(e.target.value), ["enter"]))
          }, null, 8, ["modelValue"])
        ]),
        actions: withCtx(() => [
          createVNode(_component_Button, {
            variant: "solid",
            onClick: _cache[2] || (_cache[2] = ($event) => $options.setLink($data.setLinkDialog.url)),
            class: "w-full"
          }, {
            default: withCtx(() => _cache[4] || (_cache[4] = [
              createTextVNode(" Save ")
            ])),
            _: 1
            /* STABLE */
          })
        ]),
        _: 1
        /* STABLE */
      }, 8, ["modelValue", "onAfterLeave"])
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
_sfc_main.__file = "src/components/TextEditor/InsertLink.vue";
const InsertLink = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/InsertLink.vue"]]);
export {
  InsertLink as default
};
