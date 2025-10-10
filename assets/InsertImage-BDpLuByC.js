import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-ZKdfit2u.js";
import { I as ImageGroupUploadDialog } from "./ListRow-DomFbFFu.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-BbYGtMeD.js";
import "./useId-DJabvbK8.js";
import "./Autocomplete-DuZjstDQ.js";
import "./Popover-TpsqYGSC.js";
import "./Button-AJ_-mGBL.js";
import "./FeatherIcon-_ZA44pHK.js";
import "./Avatar-CG5MHyxS.js";
import "./Badge-Yr7a51em.js";
import "./Breadcrumbs-KvdPShNk.js";
import "./Dropdown-Bf0BNVpj.js";
import "./Switch-Buf7TrFy.js";
import "./plus-CEl00IrA.js";
import "./chevron-down-CJwUfQ_b.js";
import "./DatePicker-BKlWTTPf.js";
import "./TextInput-LQko1zMS.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-D8MLPY8m.js";
import "./DateRangePicker-DYHbJU4V.js";
import "./TimePicker-DYClb7ED.js";
import "./Calendar-CEsu7xC5.js";
import "./TabButtons-BrcmclVb.js";
import "./Dialog-gOCsZxRG.js";
import "./FormControl-CmHcclbC.js";
import "./Select-DEkYMf-J.js";
import "./Textarea-C4YyKw0a.js";
import "./ErrorMessage-DJDRlqpi.js";
import "./FileUploader-Br01nBDm.js";
import "./Progress-Duobp6O7.js";
import "./Rating-CpIhp_ld.js";
import "./Password-C0lLJybO.js";
import "./Spinner-BYRdy2lA.js";
import "./Tabs-CHr5mScx.js";
import "./CircularProgressBar-CP03o_Q5.js";
import "./Tree-BOenQ8bR.js";
import "./Sidebar-jKaQDmkr.js";
import "./NumberChart-BmzKzn5F.js";
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
