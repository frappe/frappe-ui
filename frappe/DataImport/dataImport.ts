import type { DataImportStatus } from './types'

export const getBadgeColor = (status: DataImportStatus) => {
    const colorMap: Record<DataImportStatus, string> = {
        "Pending": "orange",
        "Success": "green",
        "Partial Success": "orange",
        "Error": "red",
        "Timed Out": "orange"
    }
    return colorMap[status as DataImportStatus] || "gray"
}