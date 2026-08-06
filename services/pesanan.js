/**
 * services/pesanan.js
 * API service for /api/pesanan
 * Cloudflare Worker backend — no framework dependencies.
 */

const BASE = '/api'

/** @typedef {'baru'|'proses'|'selesai'|'batal'} PesananStatus */

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

/**
 * GET /api/pesanan
 * Returns all pesanan records, newest first.
 * @returns {Promise<Array>}
 */
export function getPesanan() {
  return fetch(`${BASE}/pesanan`).then(handleResponse)
}

/**
 * POST /api/pesanan
 * Creates a new order. Status defaults to 'baru'.
 * @param {{ customer_name: string, wa?: string, product_name: string, qty?: number, catatan?: string }} body
 * @returns {Promise<Object>} created pesanan
 */
export function createPesanan(body) {
  return fetch(`${BASE}/pesanan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse)
}

/**
 * PUT /api/pesanan/:id
 * Updates the details of an existing pesanan.
 * @param {string} id
 * @param {{ customer_name: string, wa?: string, product_name: string, qty?: number, catatan?: string }} body
 * @returns {Promise<{ ok: true }>}
 */
export function updatePesanan(id, body) {
  return fetch(`${BASE}/pesanan/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse)
}

/**
 * PATCH /api/pesanan/:id/status
 * Updates the status of a pesanan.
 * @param {string} id
 * @param {PesananStatus} status
 * @returns {Promise<{ ok: true }>}
 */
export function updateStatusPesanan(id, status) {
  return fetch(`${BASE}/pesanan/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).then(handleResponse)
}

/**
 * DELETE /api/pesanan/:id
 * Permanently deletes a pesanan record.
 * @param {string} id
 * @returns {Promise<{ ok: true }>}
 */
export function deletePesanan(id) {
  return fetch(`${BASE}/pesanan/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }).then(handleResponse)
}
