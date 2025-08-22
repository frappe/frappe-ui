import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-CHCERzLR.js";
import { I as ImageGroupUploadDialog } from "./ListRow-BK10I7zr.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-D0C2qA7T.js";
import "./Autocomplete-gBduNi4f.js";
import "./Popover-BcBiwvM0.js";
import "./Button-BBfleYXV.js";
import "./FeatherIcon-SD8mFbzv.js";
import "./Avatar-BrmmTfIF.js";
import "./Badge-D4st__sS.js";
import "./Breadcrumbs-sjabuSc7.js";
import "./Dropdown-4dN69m6y.js";
import "./Combobox-DZ9wN4H9.js";
import "./chevron-down-HUhEAd3u.js";
import "./DateRangePicker-Ct5XZNLM.js";
import "./TextInput-DHb0y3xD.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-DNkGh6bu.js";
import "./Calendar-Cx90yDeX.js";
import "./TabButtons-B9Vh3ngd.js";
import "./Dialog-Rl1gAYjU.js";
import "./FormControl-SkIivv41.js";
import "./Select-BKPEQSZp.js";
import "./Textarea-DnA7Kw0h.js";
import "./ErrorMessage-CfrY8g-9.js";
import "./FileUploader-DrJjev7H.js";
import "./Progress-nm6hhMyA.js";
import "./Rating-CymVxB1w.js";
import "./Password-Dn7gbj56.js";
import "./Spinner-CqwsqMYK.js";
import "./Switch-BkE1Ng3u.js";
import "./Tabs-CDmLSSqB.js";
import "./CircularProgressBar-dkoO4i8T.js";
import "./Tree-qgGNwL4w.js";
import "./Sidebar-Brfpv7ws.js";
import "./NumberChart-BeOegRO3.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InsertImage",
  props: {
    editor: { type: Object, required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const fileInput = useTemplateRef("fileInput");
    const showModal = ref(false);
    const selectedFiles = ref([]);
    function openFileSelector() {
      var _a;
      (_a = fileInput.value) == null ? void 0 : _a.click();
    }
    function onImageSelect(e) {
      const target = e.target;
      const files = target.files;
      if (files && files.length > 0) {
        if (files.length === 1) {
          props.editor.chain().focus().uploadImage(files[0]).run();
        } else {
          selectedFiles.value = Array.from(files);
          showModal.value = true;
        }
      }
    }
    function handleCancel() {
      showModal.value = false;
      selectedFiles.value = [];
    }
    const __returned__ = { props, fileInput, showModal, selectedFiles, openFileSelector, onImageSelect, handleCancel, ImageGroupUploadDialog };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock(
    Fragment,
    null,
    [
      renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({ onClick: $setup.openFileSelector }))),
      createBaseVNode(
        "input",
        {
          ref: "fileInput",
          type: "file",
          class: "hidden",
          onChange: $setup.onImageSelect,
          accept: "image/*",
          multiple: ""
        },
        null,
        544
        /* NEED_HYDRATION, NEED_PATCH */
      ),
      $setup.showModal ? (openBlock(), createBlock($setup["ImageGroupUploadDialog"], {
        key: 0,
        mode: "new",
        modelValue: $setup.showModal,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.showModal = $event),
        files: $setup.selectedFiles,
        "onUpdate:files": _cache[1] || (_cache[1] = ($event) => $setup.selectedFiles = $event),
        editor: $props.editor,
        onClose: $setup.handleCancel
      }, null, 8, ["modelValue", "files", "editor"])) : createCommentVNode("v-if", true)
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
_sfc_main.__file = "src/components/TextEditor/InsertImage.vue";
const InsertImage = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/TextEditor/InsertImage.vue"]]);
export {
  InsertImage as default
};
