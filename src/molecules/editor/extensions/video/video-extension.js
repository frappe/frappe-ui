/**
 * Video node — a thin TipTap shell over the shared media upload engine.
 *
 * Schema, attributes, `parseHTML`/`renderHTML` and the markdown-style input rule
 * live here; all upload/queue/find/dimension logic is delegated to the shared
 * `media-upload-engine` (consumed via {@link videoEngine}) and the shared
 * `media-plugin` (drop/paste + dimension back-fill). The node view is the shared
 * `MediaNodeView`, kept neutral across image and video.
 *
 * Fixes (see PLAN cluster 2): F1 dimension-probe leak + DOM-Event reject are
 * solved in `media-dimensions.probeVideoDimensions`; F2 whole-video base64 is
 * avoided via `storeBase64: false` in `video-config.ts`; F3 paste is registered
 * under `props.handlePaste` (not `handleDOMEvents.paste`) in `media-plugin.ts`;
 * F4 `setVideo` rejects an empty `src` here.
 */
import { Node as NodeExtension, nodeInputRule, mergeAttributes, } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import MediaNodeView from '#molecules/editor/components/MediaNodeView.vue';
import { resolveUploadOptions, } from '#molecules/editor/extensions/shared/media-upload-engine';
import { createMediaPlugin } from '#molecules/editor/extensions/shared/media-plugin';
import { captionAttribute } from '#molecules/editor/extensions/shared/media-attributes';
import { findNodeByUploadId } from '#molecules/editor/extensions/shared/node-view';
import { pickFiles } from '#molecules/editor/extensions/shared/file-picker';
import { videoConfig, videoEngine } from './video-config';
/** Matches markdown-style video syntax (custom): `!video[alt](src "title")`. */
const inputRegex = /(?:^|\s)(!video\[([^\]]*)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;
export const VideoExtension = NodeExtension.create({
    name: 'video',
    group: 'block',
    selectable: true,
    draggable: true,
    atom: true,
    addOptions() {
        return {
            uploadFunction: null,
            HTMLAttributes: {},
        };
    },
    addAttributes() {
        return {
            src: { default: null },
            /** Screen-reader description. Never rendered as visible text. */
            alt: { default: null },
            caption: captionAttribute,
            title: { default: null },
            width: { default: null },
            height: { default: null },
            autoplay: { default: false },
            loop: { default: false },
            muted: { default: false },
            loading: {
                default: false,
                parseHTML: () => false,
            },
            align: {
                default: 'center',
                parseHTML: (element) => {
                    const align = (element.getAttribute('data-align') ||
                        element.getAttribute('align') ||
                        'center').toLowerCase();
                    if (['left', 'center', 'right'].includes(align)) {
                        return align;
                    }
                    return 'center';
                },
                renderHTML: (attributes) => {
                    return {
                        'data-align': attributes.align || 'center',
                    };
                },
            },
            float: {
                default: null,
                parseHTML: (element) => {
                    const float = element.getAttribute('data-float') || element.getAttribute('float');
                    if (float === 'left' || float === 'right')
                        return float;
                    return null;
                },
                renderHTML: (attributes) => {
                    return { 'data-float': attributes.float || null };
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
                tag: 'video',
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
                        autoplay: element.hasAttribute('autoplay'),
                        loop: element.hasAttribute('loop'),
                        muted: element.hasAttribute('muted'),
                    };
                },
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'video',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                controls: '',
            }),
        ];
    },
    addNodeView() {
        return VueNodeViewRenderer(MediaNodeView);
    },
    addCommands() {
        const resolve = () => resolveUploadOptions({ ...this.options, editor: this.editor });
        return {
            setVideoFloat: (float) => ({ commands }) => {
                return commands.updateAttributes(this.name, { float });
            },
            setVideo: (attributes) => ({ commands }) => {
                // F4: reject an empty/blank src instead of inserting a broken node.
                if (typeof attributes.src !== 'string' ||
                    attributes.src.trim() === '') {
                    return false;
                }
                return commands.insertContent({
                    type: this.name,
                    attrs: attributes,
                });
            },
            uploadVideo: (file) => ({ editor }) => {
                void videoEngine.uploadOne(file, editor, resolve());
                return true;
            },
            uploadVideoFiles: (files, pos = null) => ({ editor }) => {
                if (files.length === 0)
                    return false;
                void videoEngine.processMultiple(files, editor, pos, resolve());
                return true;
            },
            selectAndUploadVideo: () => ({ editor }) => {
                void pickFiles({ accept: 'video/*' }).then((files) => {
                    if (!editor.isDestroyed && files[0])
                        editor.commands.uploadVideo(files[0]);
                });
                return true;
            },
            reuploadVideo: (uploadId) => ({ editor }) => {
                const pos = findNodeByUploadId(editor.view, this.name, uploadId);
                if (pos === null) {
                    console.error('reuploadVideo: no node with uploadId', uploadId);
                    return false;
                }
                void videoEngine.reupload(editor, pos, resolve());
                return true;
            },
            replaceVideo: (pos, file) => ({ editor }) => {
                const node = editor.view.state.doc.nodeAt(pos);
                if (!node || node.type.name !== this.name)
                    return false;
                void videoEngine.uploadReplace(file, editor, pos, resolve(), node.attrs);
                return true;
            },
            setVideoOptions: (options) => ({ commands, }) => {
                return commands.updateAttributes(this.name, options);
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
        return [
            createMediaPlugin(videoEngine, videoConfig, {
                editor: this.editor,
                options: { ...this.options },
            }),
        ];
    },
});
