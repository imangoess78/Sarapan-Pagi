/**
 * services/transaksi.js
 * API service for /api/transaksi
 * Cloudflare Worker backend — no framework dependencies.
 */

const BASE = '/api'

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

/**
 * GET /api/transaksi
 * Returns all transaksi records, newest first.
 * When konsinyatorId is supplied, filters by konsinyator and joins produk.nama.
 * @param {string} [konsinyatorId]
 * @returns {Promise<Array>}
 */
export function getTransaksi(konsinyatorId) {
  const url = konsinyatorId
    ? `${BASE}/transaksi?konsinyator_id=${encodeURIComponent(konsinyatorId)}`
    : `${BASE}/transaksi`
  return fetch(url).then(handleResponse)
}

/**
 * POST /api/transaksi
 * Records a new sale transaction.
 * The worker deducts qty from produk.stok_sisa and calculates bagi_hasil (10 %) and setoran.
 * @param {{ produk_id: string, qty: number }} body
 * @returns {Promise<Object>} created transaksi
 */
export function createTransaksi(body) {
  return fetch(`${BASE}/transaksi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse)
}

/**
 * DELETE /api/transaksi/:id
 * Deletes a transaksi and restores the corresponding stok on the related produk.
 * @param {string} id
 * @returns {Promise<{ ok: true }>}
 */
export function deleteTransaksi(id) {
  return fetch(`${BASE}/transaksi/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }).then(handleResponse)
}

/**
 * PATCH /api/transaksi/:konsinyatorId/paid
 * Marks all unpaid transaksi for the given konsinyator as paid.
 * @param {string} konsinyatorId
 * @returns {Promise<{ ok: true }>}
 */
export function markPaid(konsinyatorId) {
  return fetch(`${BASE}/transaksi/${encodeURIComponent(konsinyatorId)}/paid`, {
    method: 'PATCH',
  }).then(handleResponse)
}
