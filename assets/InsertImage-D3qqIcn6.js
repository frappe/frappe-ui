import { ay as defineComponent, be as useTemplateRef, az as ref, aB as openBlock, aG as createElementBlock, aZ as renderSlot, aS as normalizeProps, aT as guardReactiveProps, aF as createBaseVNode, aC as createBlock, aH as createCommentVNode, aK as Fragment } from "./vendor-Cz3J8qwA.js";
import { I as ImageGroupUploadDialog } from "./ListRow-DWaW0vFu.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./Checkbox-C9rlv9_9.js";
import "./Autocomplete-8n-yt6kg.js";
import "./Popover-BH5_XAxz.js";
import "./Button-DUewl5Yy.js";
import "./FeatherIcon-BBBa95VI.js";
import "./Avatar-BzAPuh2r.js";
import "./Badge-BEBeanXB.js";
import "./Breadcrumbs-DWRoCDUr.js";
import "./Dropdown-B68JkjVh.js";
import "./Combobox-Cj7CrPCC.js";
import "./chevron-down-BOzU3WvE.js";
import "./DateRangePicker-Ct6gKmNh.js";
import "./TextInput-B8gCJjbm.js";
import "./debounce-CRCtzhPg.js";
import "./dayjs-CzTPF2Ck.js";
import "./Calendar-CzV0ElnA.js";
import "./TabButtons-Dd_cDicB.js";
import "./Dialog-FGBTFENw.js";
import "./FormControl-B-mZdXB4.js";
import "./Select-ChuGlXJa.js";
import "./Textarea-D7LHYP7n.js";
import "./ErrorMessage-bPyvAZgp.js";
import "./FileUploader-BErTNF0G.js";
import "./Progress-gKvDgBTL.js";
import "./Rating-DhT9ejhO.js";
import "./Password-DVDHt7m8.js";
import "./Spinner-BsKK-KKu.js";
import "./Switch-D4KaNfqD.js";
import "./Tabs-B5bPn7Cz.js";
import "./CircularProgressBar-klLHqD-k.js";
import "./Tree-EmpvAzYb.js";
import "./Sidebar-BgSWVf9d.js";
import "./NumberChart-u3O9cTE8.js";
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
