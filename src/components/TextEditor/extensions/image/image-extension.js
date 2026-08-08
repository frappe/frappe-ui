import { Node as NodeExtension, nodeInputRule, mergeAttributes, } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import MediaNodeView from '../../components/MediaNodeView.vue';
import { Plugin, Selection } from '@tiptap/pm/state';
import { fileToBase64 } from '../../../../index';
export const localFileMap = new Map();
/**
 * Matches markdown image syntax: ![alt](src "title")
 */
const inputRegex = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;
export const ImageExtension = NodeExtension.create({
    name: 'image',
    group: 'inline',
    inline: true,
    draggable: true,
    selectable: true,
    addAttributes() {
        return {
            src: { default: null },
            alt: { default: null },
            title: { default: null },
            width: { default: null },
            height: { default: null },
            loading: {
                default: false,
                parseHTML: () => false,
            },
            align: {
                default: 'center',
                parseHTML: (element) => {
                    const align = (element.getAttribute('data-align') ||
                        element.getAttribute('align') ||
                        'left').toLowerCase();
                    if (['left', 'center', 'right'].includes(align)) {
                        return align;
                    }
                    return 'left';
                },
                renderHTML: (attributes) => {
                    return {
                        'data-align': attributes.align || 'left',
                    };
                },
            },
            float: {
                default: null,
                parseHTML: (element) => {
                    return element.getAttribute('data-float') || null;
                },
                renderHTML: (attributes) => {
                    if (!attributes.float)
                        return {};
                    return {
                        'data-float': attributes.float,
                    };
                },
            },
            uploadId: {
                default: null,
                parseHTML: () => null,
            },
            error: {
                default: null,
                parseHTML: () => null,
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: 'img[src]',
                getAttrs: (node) => {
                    if (typeof node === 'string')
                        return {};
                    const element = node;
                    return {
                        src: element.getAttribute('src'),
                        alt: element.getAttribute('alt'),
                        title: element.getAttribute('title'),
                        width: element.getAttribute('width'),
                        height: element.getAttribute('height'),
                    };
                },
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'img',
            mergeAttributes(this.options.HTMLAttributes || {}, HTMLAttributes),
        ];
    },
    addNodeView() {
        return VueNodeViewRenderer(MediaNodeView);
    },
    addOptions() {
        return {
            uploadFunction: null,
            HTMLAttributes: {},
        };
    },
    addCommands() {
        return {
            setImageAlign: (align) => ({ commands }) => {
                return commands.updateAttributes(this.name, { align });
            },
            setImageFloat: (float) => ({ commands }) => {
                return commands.updateAttributes(this.name, { float });
            },
            setImage: (attributes) => ({ commands, editor }) => {
                const result = commands.insertContent({
                    type: this.name,
                    attrs: attributes,
                });
                if (result && attributes.src) {
                    findImageNodeBySource(editor.view, attributes.src, (node, pos) => {
                        updateNodeWithDimensions(attributes.src, editor.view, pos);
                    });
                }
                return result;
            },
            uploadImage: (file) => ({ editor }) => {
                return uploadImage(file, editor.view, null, this.options);
            },
            selectAndUploadImage: () => ({ editor }) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (event) => {
                    const target = event.target;
                    if (target.files && target.files.length) {
                        const file = target.files[0];
                        editor.commands.uploadImage(file);
                    }
                };
                input.click();
                return true;
            },
            reuploadImage: (uploadId) => ({ editor }) => {
                const fileData = localFileMap.get(uploadId);
                if (!fileData) {
                    console.error('reuploadImage: no file with uploadId', uploadId);
                    return false;
                }
                // Find the node position
                let nodePos = null;
                editor.view.state.doc.descendants((node, pos) => {
                    if (node.type.name === 'image' &&
                        node.attrs.uploadId === uploadId) {
                        nodePos = pos;
                        return false;
                    }
                });
                if (nodePos === null) {
                    console.error('reuploadImage: could not find node with uploadId', uploadId);
                    return false;
                }
                // Re-run the upload using the stored file, replacing the node at its position
                return uploadImageBase(fileData.file, editor.view, nodePos, this.options, 'replace');
            },
        };
    },
    addInputRules() {
        return [
            nodeInputRule({
                find: inputRegex,
                type: this.type,
                getAttributes: (match) => {
                    const [, , alt, src, title] = match;
                    return { src, alt, title };
                },
            }),
        ];
    },
    addProseMirrorPlugins() {
        const extensionThis = this;
        return [
            new Plugin({
                props: {
                    handleDOMEvents: {
                        drop: (view, event) => {
                            const hasFiles = event.dataTransfer?.files?.length;
                            if (!hasFiles || !extensionThis.options.uploadFunction) {
                                return false;
                            }
                            const images = Array.from(event.dataTransfer.files).filter((file) => /image/i.test(file.type));
                            if (images.length === 0) {
                                return false;
                            }
                            event.preventDefault();
                            const coordinates = view.posAtCoords({
                                left: event.clientX,
                                top: event.clientY,
                            });
                            let pos = null;
                            if (coordinates) {
                                pos = coordinates.pos;
                                const transaction = view.state.tr.setSelection(Selection.near(view.state.doc.resolve(pos)));
                                view.dispatch(transaction);
                            }
                            processMultipleImages(images, view, pos, extensionThis.options);
                            return true;
                        },
                        handlePaste: (view, event) => {
                            if (!extensionThis.options.uploadFunction) {
                                return false;
                            }
                            const clipboardItems = event.clipboardData?.items;
                            if (!clipboardItems || clipboardItems.length === 0) {
                                return false;
                            }
                            const images = [];
                            for (let i = 0; i < clipboardItems.length; i++) {
                                const item = clipboardItems[i];
                                if (item.kind === 'file' &&
                                    item.type.indexOf('image/') !== -1) {
                                    const file = item.getAsFile();
                                    if (file) {
                                        images.push(file);
                                    }
                                }
                            }
                            if (images.length === 0) {
                                return false;
                            }
                            event.preventDefault();
                            processMultipleImages(images, view, null, extensionThis.options);
                            return true;
                        },
                    },
                },
                appendTransaction(transactions, oldState, newState) {
                    const newImageNodes = [];
                    if (transactions.some((tr) => tr.docChanged)) {
                        newState.doc.descendants((node, pos) => {
                            if (node.type.name === 'image' &&
                                node.attrs.src &&
                                (!node.attrs.width || !node.attrs.height) &&
                                !node.attrs.loading) {
                                newImageNodes.push({ node, pos });
                            }
                        });
                    }
                    if (newImageNodes.length === 0)
                        return null;
                    newImageNodes.forEach(({ node, pos }) => {
                        const editor = extensionThis.editor;
                        if (editor) {
                            updateNodeWithDimensions(node.attrs.src, editor.view, pos);
                        }
                    });
                    return null;
                },
            }),
        ];
    },
});
function findInsertPosition(view, lastNodeId) {
    if (!lastNodeId) {
        return null;
    }
    let insertPos = null;
    view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'image' && node.attrs.uploadId === lastNodeId) {
            insertPos = pos + node.nodeSize;
            return false;
        }
    });
    return insertPos;
}
function uploadImageBase(file, view, pos, options, insertMode, onComplete, moveCursor = false) {
    if (!options.uploadFunction) {
        console.error('uploadFunction option is not provided');
        return false;
    }
    const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    fileToBase64(file)
        .then((base64Result) => {
        localFileMap.set(uploadId, { b64: base64Result, file });
        return getImageDimensions(base64Result)
            .catch(() => ({ width: null, height: null }))
            .then((dimensions) => dimensions);
    })
        .then((dimensions) => {
        const node = view.state.schema.nodes.image.create({
            loading: true,
            uploadId,
            src: null,
            width: dimensions.width,
            height: dimensions.height,
        });
        const tr = view.state.tr;
        if (insertMode === 'replace') {
            if (pos === null)
                tr.replaceSelectionWith(node);
            else {
                const nodeAtPos = view.state.doc.nodeAt(pos);
                if (nodeAtPos)
                    tr.replaceWith(pos, pos + nodeAtPos.nodeSize, node);
            }
        }
        else {
            if (pos != null)
                tr.insert(pos, node);
            else {
                const insertPos = view.state.selection.from;
                tr.insert(insertPos, node);
            }
        }
        view.dispatch(tr);
        // Optionally move cursor after the node
        if (moveCursor) {
            const nodeSize = node.nodeSize || 1;
            setTimeout(() => {
                try {
                    let nodePos = null;
                    view.state.doc.descendants((n, p) => {
                        if (n.type.name === 'image' && n.attrs.uploadId === uploadId) {
                            nodePos = p;
                            return false;
                        }
                    });
                    if (nodePos !== null) {
                        const posAfter = nodePos + nodeSize;
                        const transaction = view.state.tr.setSelection(Selection.near(view.state.doc.resolve(posAfter)));
                        view.dispatch(transaction);
                    }
                }
                catch (e) {
                    console.error('Error moving cursor:', e);
                }
            }, 10);
        }
        return options.uploadFunction(file);
    })
        .then((uploadedImage) => {
        const transaction = view.state.tr;
        view.state.doc.descendants((node, pos) => {
            if (node.type.name === 'image' && node.attrs.uploadId === uploadId) {
                transaction.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    src: uploadedImage.file_url,
                    width: uploadedImage.width || node.attrs.width,
                    height: uploadedImage.height || node.attrs.height,
                    loading: false,
                });
                localFileMap.delete(node.attrs.uploadId);
                return false;
            }
        });
        view.dispatch(transaction);
        if (onComplete)
            onComplete(uploadId);
    })
        .catch((error) => {
        console.error('Image upload failed:', error);
        try {
            const transaction = view.state.tr;
            view.state.doc.descendants((node, pos) => {
                if (node.type.name === 'image' && node.attrs.uploadId === uploadId) {
                    transaction.setNodeMarkup(pos, undefined, {
                        ...node.attrs,
                        loading: false,
                        error: error.message || 'Failed to upload image',
                    });
                    return false;
                }
            });
            view.dispatch(transaction);
        }
        catch (e) {
            console.error('Error updating failed node:', e);
        }
        if (onComplete)
            onComplete(uploadId);
    });
    return true;
}
function uploadImageWithTracking(file, view, pos, options, onComplete) {
    return uploadImageBase(file, view, pos, options, 'insert', onComplete, true);
}
function uploadImage(file, view, pos, options) {
    return uploadImageBase(file, view, pos, options, 'replace');
}
function findImageNodeBySource(view, src, callback) {
    view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'image' && node.attrs.src === src) {
            callback(node, pos);
            return false;
        }
    });
}
function updateNodeWithDimensions(src, view, pos) {
    getImageDimensions(src)
        .then((dimensions) => {
        const node = view.state.doc.nodeAt(pos);
        if (!node || node.type.name !== 'image') {
            return;
        }
        const currentAttrs = node.attrs;
        if (currentAttrs.width == null || currentAttrs.height == null) {
            const transaction = view.state.tr.setNodeMarkup(pos, undefined, {
                ...currentAttrs,
                width: currentAttrs.width ?? dimensions.width,
                height: currentAttrs.height ?? dimensions.height,
            });
            view.dispatch(transaction);
        }
    })
        .catch((error) => {
        // Don't log error if it's just about dimensions for an existing node
    });
}
function getImageDimensions(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({
            width: img.naturalWidth,
            height: img.naturalHeight,
        });
        img.onerror = reject;
        img.src = src;
    });
}
/**
 * Process multiple image uploads sequentially
 */
export function processMultipleImages(images, view, pos, options) {
    if (images.length === 1) {
        uploadImage(images[0], view, pos, options);
        return;
    }
    let imageQueue = [...images];
    let lastInsertedNodeId = null;
    const processNextImage = () => {
        if (imageQueue.length === 0)
            return;
        const file = imageQueue.shift();
        if (!file)
            return;
        const currentPos = lastInsertedNodeId
            ? findInsertPosition(view, lastInsertedNodeId)
            : pos;
        uploadImageWithTracking(file, view, currentPos, options, (newNodeId) => {
            lastInsertedNodeId = newNodeId;
            setTimeout(processNextImage, 100);
        });
    };
    processNextImage();
}
