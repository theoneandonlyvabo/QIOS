/**
 * Format number to Indonesian Rupiah currency
 * Ensures consistent formatting between server and client to avoid hydration errors
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

/**
 * Format number with thousand separators (no currency symbol)
 */
export function formatNumber(value: number): string {
    return new Intl.NumberFormat('id-ID').format(value)
}
