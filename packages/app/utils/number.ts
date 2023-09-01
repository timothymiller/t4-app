export function formatNumber(x: number): string {
  return x.toLocaleString('en-US')
};

export function formatPrice(price: number): string {
  return price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
};
