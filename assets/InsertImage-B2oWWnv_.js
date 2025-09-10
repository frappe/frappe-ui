import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-Dk4Em66F.js";
import { I as ImageGroupUploadDialog } from "./ListRow-DQW5E-yF.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-mtPaKGGX.js";
import "./useId-DJabvbK8.js";
import "./Autocomplete-DcAhWcIO.js";
import "./Popover-BAdRMdpR.js";
import "./Button-BW9k6phM.js";
import "./FeatherIcon-Ceh9nG5I.js";
import "./Avatar-NkygKlo1.js";
import "./Badge-DK2QKLb9.js";
import "./Breadcrumbs-BCjPP37E.js";
import "./Dropdown-DXJKkyo2.js";
import "./Switch-BAnIIkJV.js";
import "./plus-BDJlakNN.js";
import "./chevron-down-Di7JgqdZ.js";
import "./DatePicker-FDz1Z9ck.js";
import "./TextInput-BfiRWxyW.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-Mm1Gz_Bv.js";
import "./DateRangePicker-Bn1BQX7N.js";
import "./TimePicker-Cvtbb59w.js";
import "./Calendar-BeQR2lAW.js";
import "./TabButtons-DMJA1L2e.js";
import "./Dialog-ElOGFL84.js";
import "./FormControl-DC2Ks--R.js";
import "./Select-DSADJaW4.js";
import "./Textarea-moOZ_tzG.js";
import "./ErrorMessage-CONAP2-8.js";
import "./FileUploader-CWDGgO66.js";
import "./Progress-DYI5Nm2e.js";
import "./Rating-CsiBgr2g.js";
import "./Password-YxnwPKvs.js";
import "./Spinner-_KaJNPm3.js";
import "./Tabs-SDqMNPXi.js";
import "./CircularProgressBar-DUSJ-7aS.js";
import "./Tree-DWLsXtoK.js";
import "./Sidebar-BfShZg6V.js";
import "./NumberChart-CvjvJuqa.js";
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
