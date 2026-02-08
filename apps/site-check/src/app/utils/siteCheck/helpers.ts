import type { AnalysisItem, AnalysisStatus } from '../types'

export function createAnalysisItem(
    label: string,
    value: string | number | boolean,
    status: AnalysisStatus,
    description?: string,
    impact?: string,
    recommendation?: string
): AnalysisItem {
    return { label, value, status, description, impact, recommendation }
}

export function calculateScore(items: AnalysisItem[]): number {
    const weights = { success: 100, warning: 50, error: 0 }
    const total = items.reduce((sum, item) => sum + weights[item.status], 0)
    return Math.round(total / items.length)
}
