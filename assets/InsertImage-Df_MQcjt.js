import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-THsbNae-.js";
import { I as ImageGroupUploadDialog } from "./ListRow-mow5mWaS.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-DDtgv2Px.js";
import "./useId-DJabvbK8.js";
import "./Autocomplete-D0UzP5HY.js";
import "./Popover-l9nGiES_.js";
import "./Button-BqBn1EJ9.js";
import "./FeatherIcon-CihQTfNG.js";
import "./Avatar-BPyGJ0o7.js";
import "./Badge-BdA8wsdO.js";
import "./Breadcrumbs-DZzEegKU.js";
import "./Dropdown-CDW2Yf0r.js";
import "./Switch-DsWU8vHb.js";
import "./plus-9cl4Avpw.js";
import "./chevron-down-s4K2_tft.js";
import "./DatePicker-BYDYZSXL.js";
import "./TextInput-Du8e4_S5.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-B433mOaI.js";
import "./DateRangePicker-BsM4vNnR.js";
import "./TimePicker-BEFn46RH.js";
import "./Calendar-B5WfCyZO.js";
import "./TabButtons-ERL2igyK.js";
import "./Dialog-C98vDs-Q.js";
import "./FormControl-P8Z279Vs.js";
import "./Select-BJ2wTcEA.js";
import "./Textarea-BD_S-_rn.js";
import "./ErrorMessage-BZEpav8U.js";
import "./FileUploader-BAp3Mh7E.js";
import "./Progress-epsaMPIa.js";
import "./Rating-DzetqbhK.js";
import "./Password-DfWANf_I.js";
import "./Spinner-BiLlFsNg.js";
import "./Tabs-DgKGHT-u.js";
import "./CircularProgressBar-D5UNV7iz.js";
import "./Tree-Cs4yHwq9.js";
import "./Sidebar-piwXS255.js";
import "./NumberChart-BUxAAQvR.js";
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
