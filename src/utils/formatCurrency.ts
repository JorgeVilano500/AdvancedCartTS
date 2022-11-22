const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
    currency: 'USD', style: 'currency'
}) // will format the number depending on where you live

export function formatCurrency(number: number) {
    return CURRENCY_FORMATTER.format(number)
}