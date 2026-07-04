import { InjectionKey, type ComputedRef } from 'vue'
import type { ResizableContext, ResizableProviderContext } from './types'

export const RESIZABLE_CONTEXT_KEY: InjectionKey<ResizableContext> = Symbol('resizable-context')
export const RESIZABLE_PROVIDER_KEY: InjectionKey<ComputedRef<ResizableProviderContext>> =
    Symbol('resizable-provider')

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}


export function distributeSizes(
    totalSize: number,
    panels: Array<{ minSize: number; maxSize: number; defaultSize?: number; grow?: boolean }>,
    currentSizes?: number[]
): number[] {
    const sizes: number[] = []
    let remaining = 100

    for (let i = 0; i < panels.length; i++) {
        const panel = panels[i]
        let size = currentSizes?.[i] ?? panel.defaultSize ?? 0

        if (size === 0 && panels.length > 0) {
            size = 100 / panels.length
        }

        size = clamp(size, panel.minSize, panel.maxSize)
        sizes.push(size)
        remaining -= size
    }

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

    const initialLeft = newSizes[index]
    const initialRight = newSizes[index + 1]
    const totalSize = initialLeft + initialRight

    let targetLeft = initialLeft + delta

    let useLeftCollapsed = false
    if (leftPanel.collapsible) {
        if (initialLeft <= leftPanel.collapsedSize) {
            if (targetLeft > leftPanel.collapsedSize) {
                if (targetLeft < leftPanel.minSize) {
                    if (delta > 0) {
                        useLeftCollapsed = false
                        const threshold = leftPanel.collapsedSize + (leftPanel.minSize - leftPanel.collapsedSize) * 0.05
                        if (targetLeft > threshold) {
                        } else {
                            useLeftCollapsed = true
                        }
                    } else {
                        useLeftCollapsed = true
                    }
                }
            } else {
                useLeftCollapsed = true
            }
        } else {
            if (targetLeft < leftPanel.minSize) {
                useLeftCollapsed = true
            }
        }
    }

    let useRightCollapsed = false
    if (rightPanel.collapsible) {
        const currentRight = totalSize - initialLeft
        const targetRight = totalSize - targetLeft

        if (currentRight <= rightPanel.collapsedSize) {
            if (targetRight > rightPanel.collapsedSize) {
                if (targetRight < rightPanel.minSize) {
                    if (delta < 0) {
                        useRightCollapsed = false
                        const threshold = rightPanel.collapsedSize + (rightPanel.minSize - rightPanel.collapsedSize) * 0.05
                        if (targetRight <= threshold) {
                            useRightCollapsed = true
                        }
                    } else {
                        useRightCollapsed = true
                    }
                }
            } else {
                useRightCollapsed = true
            }
        } else {
            if (totalSize - targetLeft < rightPanel.minSize) {
                useRightCollapsed = true
            }
        }
    }

    let finalLeft = targetLeft

    const minLeft = leftPanel.minSize
    const maxLeft = leftPanel.maxSize
    const minLeftFromRight = totalSize - rightPanel.maxSize
    const maxLeftFromRight = totalSize - rightPanel.minSize

    const constraintMin = Math.max(minLeft, minLeftFromRight)
    const constraintMax = Math.min(maxLeft, maxLeftFromRight)

    if (useLeftCollapsed) {
        finalLeft = leftPanel.collapsedSize
    } else if (useRightCollapsed) {
        const finalRight = rightPanel.collapsedSize
        finalLeft = totalSize - finalRight
    } else {
        let effectiveMin = constraintMin
        let effectiveMax = constraintMax

        if (leftPanel.collapsible && initialLeft <= leftPanel.collapsedSize && delta > 0) {
        }

        if (rightPanel.collapsible && (totalSize - initialLeft) <= rightPanel.collapsedSize && delta < 0) {
        }

        finalLeft = clamp(targetLeft, effectiveMin, effectiveMax)
    }

    newSizes[index] = finalLeft
    newSizes[index + 1] = totalSize - finalLeft

    return newSizes
}
