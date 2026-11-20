const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function formatearPrecioCOP(valor: number): string {
  return formatoCOP.format(valor)
}
