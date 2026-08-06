/**
 * services/produk.js
 * API service for /api/produk
 * Cloudflare Worker backend — no framework dependencies.
 */

const BASE = '/api'

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

/**
 * GET /api/produk
 * Returns all products ordered by newest first.
 * @returns {Promise<Array>}
 */
export function getProduk() {
  return fetch(`${BASE}/produk`).then(handleResponse)
}

/**
 * GET /api/produk/:id
 * Returns a single product by id.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export function getProdukById(id) {
  return fetch(`${BASE}/produk/${encodeURIComponent(id)}`).then(handleResponse)
}

/**
 * POST /api/produk
 * Creates a new product. stok_awal and stok_sisa are both set to stok.
 * @param {{ konsinyator_id: string, nama: string, harga: number, stok: number }} body
 * @returns {Promise<Object>} created product
 */
export function createProduk(body) {
  return fetch(`${BASE}/produk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse)
}

/**
 * PUT /api/produk/:id
 * Updates an existing product.
 * Pass stok_awal to also update the initial stock figure.
 * @param {string} id
 * @param {{ nama: string, harga: number, stok_sisa: number, stok_awal?: number }} body
 * @returns {Promise<{ ok: true }>}
 */
export function updateProduk(id, body) {
  return fetch(`${BASE}/produk/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse)
}

/**
 * DELETE /api/produk/:id
 * Deletes a product and all its related transaksi records.
 * @param {string} id
 * @returns {Promise<{ ok: true }>}
 */
export function deleteProduk(id) {
  return fetch(`${BASE}/produk/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }).then(handleResponse)
}
