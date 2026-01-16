import {
    Node as NodeExtension,
    mergeAttributes,
} from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import AttachmentNodeView from './AttachmentNodeView.vue'
import { UploadedFile } from '../../../../utils/useFileUpload'

export interface AttachmentExtensionOptions {
    uploadFunction: ((file: File) => Promise<UploadedFile>) | null
    HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        attachment: {
            setAttachment: (options: { src: string; filename?: string; size?: number }) => ReturnType
            uploadAttachment: (file: File) => ReturnType
        }
    }
}

export const AttachmentExtension = NodeExtension.create<AttachmentExtensionOptions>({
    name: 'attachment',

    group: 'block',
    draggable: true,
    selectable: true,

    addAttributes() {
        return {
            src: { default: null },
            filename: { default: null },
            size: { default: null },
            contentType: { default: null },
            uploadId: { default: null },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'a[data-type="attachment"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'a',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'attachment', href: HTMLAttributes.src, target: '_blank' }),
        ]
    },

    addNodeView() {
        return VueNodeViewRenderer(AttachmentNodeView)
    },

    addOptions() {
        return {
            uploadFunction: null,
            HTMLAttributes: {},
        }
    },

    addCommands() {
        return {
            setAttachment:
                (options) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        })
                    },

            uploadAttachment:
                (file: File) =>
                    ({ editor, view }) => {
                        if (!this.options.uploadFunction) {
                            console.error('uploadFunction option is not provided')
                            return false
                        }

                        const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

                        const node = view.state.schema.nodes.attachment.create({
                            uploadId,
                            filename: file.name,
                            size: file.size,
                            contentType: file.type
                        })

                        const tr = view.state.tr
                        const insertPos = view.state.selection.from
                        tr.insert(insertPos, node)
                        view.dispatch(tr)

                        this.options.uploadFunction(file).then((uploadedFile) => {
                            const transaction = view.state.tr
                            view.state.doc.descendants((node, pos) => {
                                if (node.type.name === 'attachment' && node.attrs.uploadId === uploadId) {
                                    transaction.setNodeMarkup(pos, undefined, {
                                        ...node.attrs,
                                        src: uploadedFile.file_url,
                                        filename: uploadedFile.file_name || node.attrs.filename,
                                        uploadId: null
                                    })
                                    return false
                                }
                            })
                            view.dispatch(transaction)
                        }).catch((error) => {
                            console.error("Failed to upload attachment", error)
                        })

                        return true
                    },
        }
    },
})
