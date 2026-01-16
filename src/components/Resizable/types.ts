export type ResizableDirection = 'horizontal' | 'vertical'

export interface ResizableRootProps {
    /** Resize axis direction */
    direction?: ResizableDirection
    /** Render element or component */
    as?: string
    /** Controlled panel sizes (%) */
    modelValue?: number[]
    /** Initial sizes for uncontrolled mode (%) */
    defaultValue?: number[]
    /** Persist sizes to localStorage */
    storageKey?: string
    /** Sync sizes across multiple roots */
    syncId?: string
    /** Disable all resizing */
    disabled?: boolean
    /** Reverse drag direction */
    reverse?: boolean
    /** RTL support */
    rtl?: boolean
}

export interface ResizableRootEmits {
    (e: 'update:modelValue', sizes: number[]): void
    (e: 'resizeStart', payload: { index: number }): void
    (e: 'resize', payload: { sizes: number[] }): void
    (e: 'resizeEnd', payload: { sizes: number[] }): void
}

export interface ResizablePanelProps {
    /** Stable panel identity */
    id?: string
    /** Render element or component */
    as?: string
    /** Minimum size in percentage */
    minSize?: number
    /** Maximum size in percentage */
    maxSize?: number
    /** Initial size in percentage */
    defaultSize?: number
    /** Allow panel to collapse */
    collapsible?: boolean
    /** Size when collapsed in percentage */
    collapsedSize?: number
    /** Panel order for dynamic layouts */
    order?: number
    /** Fill remaining space */
    grow?: boolean
    /** Disable resize for this panel */
    resizable?: boolean
}

export interface ResizablePanelEmits {
    (e: 'collapse'): void
    (e: 'expand'): void
}

export interface ResizableHandleProps {
    /** Panel boundary index */
    index?: number
    /** Render element or component */
    as?: string
    /** Disable this handle */
    disabled?: boolean
    /** Invisible drag area in pixels */
    hitArea?: number
    /** Custom cursor style */
    cursor?: string
    /** Accessibility label */
    ariaLabel?: string
    /** Arrow key resize step in percentage */
    keyboardStep?: number
}

export interface PanelData {
    id: string
    size: number
    minSize: number
    maxSize: number
    collapsible: boolean
    collapsedSize: number
    order: number
    grow: boolean
    resizable: boolean
    element?: HTMLElement
}

export interface ResizableContext {
    direction: ResizableDirection
    disabled: boolean
    reverse: boolean
    rtl: boolean
    panels: Map<string, PanelData>
    registerPanel: (id: string, data: PanelData) => void
    unregisterPanel: (id: string) => void
    updatePanelSize: (id: string, size: number) => void
    getPanelSize: (id: string) => number
    startResize: (index: number) => void
    resize: (delta: number) => void
    endResize: () => void
    isResizing: boolean
}
