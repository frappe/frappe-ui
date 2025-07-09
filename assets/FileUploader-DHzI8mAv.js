var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { aB as openBlock, aG as createElementBlock, aF as createBaseVNode, aZ as renderSlot, aR as normalizeProps, aS as guardReactiveProps } from "./vendor-CaL5uAJY.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
class FileUploadHandler {
  constructor() {
    __publicField(this, "listeners");
    __publicField(this, "failed");
    this.listeners = {};
    this.failed = false;
  }
  on(event, handler) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(handler);
  }
  trigger(event, data) {
    let handlers = this.listeners[event] || [];
    handlers.forEach((handler) => {
      handler.call(this, data);
    });
  }
  upload(file, options) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("loadstart", () => {
        this.trigger("start");
      });
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          this.trigger("progress", {
            uploaded: e.loaded,
            total: e.total
          });
        }
      });
      xhr.upload.addEventListener("load", () => {
        this.trigger("finish");
      });
      xhr.addEventListener("error", () => {
        this.trigger("error");
        reject();
      });
      xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          let error;
          if (xhr.status === 200) {
            let r = null;
            try {
              r = JSON.parse(xhr.responseText);
            } catch (e) {
              r = xhr.responseText;
            }
            let out = r.message || r;
            resolve(out);
          } else if (xhr.status === 403) {
            error = JSON.parse(xhr.responseText);
          } else {
            this.failed = true;
            try {
              error = JSON.parse(xhr.responseText);
            } catch (e) {
            }
          }
          if (error && error.exc) {
            console.error(JSON.parse(error.exc)[0]);
          }
          reject(error);
        }
      };
      const uploadEndpoint = options.upload_endpoint || "/api/method/upload_file";
      xhr.open("POST", uploadEndpoint, true);
      xhr.setRequestHeader("Accept", "application/json");
      if (window.csrf_token && window.csrf_token !== "{{ csrf_token }}") {
        xhr.setRequestHeader("X-Frappe-CSRF-Token", window.csrf_token);
      }
      let form_data = new FormData();
      if (file) {
        form_data.append("file", file, file.name);
      }
      form_data.append("is_private", options.private || false ? "1" : "0");
      form_data.append("folder", options.folder || "Home");
      if (options.file_url) {
        form_data.append("file_url", options.file_url);
      }
      if (options.doctype) {
        form_data.append("doctype", options.doctype);
      }
      if (options.docname) {
        form_data.append("docname", options.docname);
      }
      if (options.fieldname) {
        form_data.append("fieldname", options.fieldname);
      }
      if (options.method) {
        form_data.append("method", options.method);
      }
      if (options.type) {
        form_data.append("type", options.type);
      }
      if (options.optimize) {
        form_data.append("optimize", "1");
        if (options.max_width) {
          form_data.append("max_width", options.max_width.toString());
        }
        if (options.max_height) {
          form_data.append("max_height", options.max_height.toString());
        }
      }
      xhr.send(form_data);
    });
  }
}
const _sfc_main = {
  name: "FileUploader",
  props: {
    fileTypes: {
      type: [String, Array]
    },
    uploadArgs: {
      type: Object
    },
    validateFile: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      uploader: null,
      uploading: false,
      uploaded: 0,
      error: null,
      message: "",
      total: 0,
      file: null,
      finishedUploading: false
    };
  },
  computed: {
    progress() {
      let value = Math.floor(this.uploaded / this.total * 100);
      return isNaN(value) ? 0 : value;
    },
    success() {
      return this.finishedUploading && !this.error;
    }
  },
  methods: {
    inputRef() {
      return this.$refs["input"];
    },
    openFileSelector() {
      this.$refs["input"].click();
    },
    async onFileAdd(e) {
      this.error = null;
      this.file = e.target.files[0];
      if (this.file && this.validateFile) {
        try {
          let message = await this.validateFile(this.file);
          if (message) {
            this.error = message;
          }
        } catch (error) {
          this.error = error;
        }
      }
      if (!this.error) {
        this.uploadFile(this.file);
      }
    },
    async uploadFile(file) {
      this.error = null;
      this.uploaded = 0;
      this.total = 0;
      this.uploader = new FileUploadHandler();
      this.uploader.on("start", () => {
        this.uploading = true;
      });
      this.uploader.on("progress", (data) => {
        this.uploaded = data.uploaded;
        this.total = data.total;
      });
      this.uploader.on("error", () => {
        this.uploading = false;
        this.error = "Error Uploading File";
      });
      this.uploader.on("finish", () => {
        this.uploading = false;
        this.finishedUploading = true;
      });
      this.uploader.upload(file, this.uploadArgs || {}).then((data) => {
        this.$emit("success", data);
      }).catch((error) => {
        this.uploading = false;
        let errorMessage = "Error Uploading File";
        if (error == null ? void 0 : error._server_messages) {
          errorMessage = JSON.parse(
            JSON.parse(error._server_messages)[0]
          ).message;
        } else if (error == null ? void 0 : error.exc) {
          errorMessage = JSON.parse(error.exc)[0].split("\n").slice(-2, -1)[0];
        }
        this.error = errorMessage;
        this.$emit("failure", error);
      });
    }
  },
  expose: ["inputRef"]
};
const _hoisted_1 = ["accept"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", null, [
    createBaseVNode("input", {
      ref: "input",
      type: "file",
      accept: $props.fileTypes,
      class: "hidden",
      onChange: _cache[0] || (_cache[0] = (...args) => $options.onFileAdd && $options.onFileAdd(...args))
    }, null, 40, _hoisted_1),
    renderSlot(_ctx.$slots, "default", normalizeProps(guardReactiveProps({
      file: $data.file,
      uploading: $data.uploading,
      progress: $options.progress,
      uploaded: $data.uploaded,
      message: $data.message,
      error: $data.error,
      total: $data.total,
      success: $options.success,
      openFileSelector: $options.openFileSelector
    })))
  ]);
}
_sfc_main.__file = "src/components/FileUploader/FileUploader.vue";
const FileUploader = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/home/runner/work/frappe-ui/frappe-ui/src/components/FileUploader/FileUploader.vue"]]);
export {
  FileUploader as F
};
