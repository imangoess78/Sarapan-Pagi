/**
 * Format a number as Indonesian Rupiah.
 * e.g. 15000 → "Rp 15.000"
 */
export const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(Number(value) || 0)

/**
 * Format an ISO date string to Indonesian locale.
 * e.g. "2025-08-06" → "6 Agustus 2025"
 */
export const formatTanggal = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format an ISO date string to short form.
 * e.g. "2025-08-06" → "06/08/2025"
 */
export const formatTanggalPendek = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID')
}

/**
 * Return initials from a name string.
 * e.g. "Budi Santoso" → "BS"
 */
export const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
