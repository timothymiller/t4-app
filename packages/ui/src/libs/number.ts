export function formatNumber(x: number): string {
  return x.toLocaleString('en-US')
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatPrice(number) {
  if (typeof number !== 'number' || Number.isNaN(number) || !Number.isFinite(number)) {
    throw new Error('Invalid number value')
  }

  return formatter.format(number)
}
