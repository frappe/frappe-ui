import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-haqsgnc2.js";
import { I as ImageGroupUploadDialog } from "./ListRow-RBMVe4po.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-CeJsTKu6.js";
import "./Autocomplete-DAWpJKP8.js";
import "./Popover-BXwVGd5G.js";
import "./Button-DiiIPmkj.js";
import "./FeatherIcon-B8HOOsQp.js";
import "./Avatar-DLURLD53.js";
import "./Badge-CqPu-seR.js";
import "./Breadcrumbs-Bzg-jyGc.js";
import "./Dropdown-g4OwiH73.js";
import "./Combobox-CgNjyGDl.js";
import "./chevron-down-CEV-PWuk.js";
import "./DateRangePicker-ZzveUXQ1.js";
import "./TextInput-CG-eeTbS.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-BLaSEuYK.js";
import "./Calendar-DtDR8OWL.js";
import "./TabButtons-DRYUyS_E.js";
import "./Dialog-B4lO0Pu6.js";
import "./FormControl-D-whKufM.js";
import "./Select-tFN35_v_.js";
import "./Textarea-Bux-1JIW.js";
import "./ErrorMessage-CQ0mKWjf.js";
import "./FileUploader-BVcuv6S4.js";
import "./Progress-BMs-xac9.js";
import "./Rating-C2HZqPae.js";
import "./Password-C6QhgTdG.js";
import "./Spinner-DHbc9p4L.js";
import "./Switch-yk0l55YJ.js";
import "./Tabs-iD0vPMxo.js";
import "./CircularProgressBar-CKRwshUj.js";
import "./Tree-D1mJMGvf.js";
import "./Sidebar-DTLaISbT.js";
import "./NumberChart-DxzcmSaw.js";
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
