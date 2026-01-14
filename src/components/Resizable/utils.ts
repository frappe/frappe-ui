import { InjectionKey } from 'vue'
import type { ResizableContext } from './types'

export const RESIZABLE_CONTEXT_KEY: InjectionKey<ResizableContext> = Symbol('resizable-context')

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

export function getStorageKey(key: string): string {
    return `resizable-${key}`
}

export function loadSizesFromStorage(key: string): number[] | null {
    if (typeof window === 'undefined') return null

    try {
        const stored = localStorage.getItem(getStorageKey(key))
        if (stored) {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed) && parsed.every(n => typeof n === 'number')) {
                return parsed
            }
        }
    } catch (e) {
        console.warn('Failed to load resizable sizes from storage:', e)
    }

    return null
}

export function saveSizesToStorage(key: string, sizes: number[]): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(getStorageKey(key), JSON.stringify(sizes))
    } catch (e) {
        console.warn('Failed to save resizable sizes to storage:', e)
    }
}

export function distributeSizes(
    totalSize: number,
    panels: Array<{ minSize: number; maxSize: number; defaultSize?: number; grow?: boolean }>,
    currentSizes?: number[]
): number[] {
    const sizes: number[] = []
    let remaining = 100

    // First pass: assign default or current sizes
    for (let i = 0; i < panels.length; i++) {
        const panel = panels[i]
        let size = currentSizes?.[i] ?? panel.defaultSize ?? 0

        if (size === 0 && panels.length > 0) {
            // Auto-distribute if no size specified
            size = 100 / panels.length
        }

        size = clamp(size, panel.minSize, panel.maxSize)
        sizes.push(size)
        remaining -= size
    }

    // Second pass: distribute remaining space to grow panels
    if (remaining !== 0) {
        const growPanels = panels
            .map((p, i) => ({ ...p, index: i }))
            .filter(p => p.grow)

        if (growPanels.length > 0) {
            const perPanel = remaining / growPanels.length

            for (const panel of growPanels) {
                const newSize = clamp(
                    sizes[panel.index] + perPanel,
                    panel.minSize,
                    panel.maxSize
                )
                sizes[panel.index] = newSize
            }
        }
    }

    // Normalize to ensure total is 100%
    const total = sizes.reduce((sum, size) => sum + size, 0)
    if (total !== 100 && total > 0) {
        return sizes.map(size => (size / total) * 100)
    }

    return sizes
}

export function adjustSizes(
    sizes: number[],
    index: number,
    delta: number,
    panels: Array<{ minSize: number; maxSize: number; collapsible: boolean; collapsedSize: number }>
): number[] {
    const newSizes = [...sizes]

    if (index < 0 || index >= newSizes.length - 1) {
        return newSizes
    }

    const leftPanel = panels[index]
    const rightPanel = panels[index + 1]

    let leftSize = newSizes[index] + delta
    let rightSize = newSizes[index + 1] - delta

    // Handle collapsing
    if (leftPanel.collapsible && leftSize < leftPanel.minSize) {
        leftSize = leftPanel.collapsedSize
        rightSize = newSizes[index] + newSizes[index + 1] - leftSize
    }

    if (rightPanel.collapsible && rightSize < rightPanel.minSize) {
        rightSize = rightPanel.collapsedSize
        leftSize = newSizes[index] + newSizes[index + 1] - rightSize
    }

    // Apply constraints
    leftSize = clamp(leftSize, leftPanel.minSize, leftPanel.maxSize)
    rightSize = clamp(rightSize, rightPanel.minSize, rightPanel.maxSize)

    // Ensure total size is preserved
    const totalChange = (leftSize - newSizes[index]) + (rightSize - newSizes[index + 1])
    if (Math.abs(totalChange) > 0.01) {
        // Adjust to maintain total
        const adjustment = totalChange / 2
        leftSize -= adjustment
        rightSize -= adjustment
    }

    newSizes[index] = leftSize
    newSizes[index + 1] = rightSize

    return newSizes
}
