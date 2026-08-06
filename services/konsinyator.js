/**
 * services/konsinyator.js
 * API service for /api/konsinyator
 * Cloudflare Worker backend — no framework dependencies.
 */

const BASE = '/api'

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

/**
 * GET /api/konsinyator
 * Returns all konsinyator records ordered by newest first.
 * @returns {Promise<Array>}
 */
export function getKonsinyator() {
  return fetch(`${BASE}/konsinyator`).then(handleResponse)
}

/**
 * POST /api/konsinyator
 * Creates a new konsinyator.
 * @param {{ nama: string, hp: string }} body
 * @returns {Promise<Object>} created konsinyator
 */
export function createKonsinyator(body) {
  return fetch(`${BASE}/konsinyator`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse)
}

/**
 * PUT /api/konsinyator/:id
 * Updates name and phone of an existing konsinyator.
 * @param {string} id
 * @param {{ nama: string, hp: string }} body
 * @returns {Promise<{ ok: true }>}
 */
export function updateKonsinyator(id, body) {
  return fetch(`${BASE}/konsinyator/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse)
}

/**
 * DELETE /api/konsinyator/:id
 * Deletes a konsinyator and cascades to their produk and transaksi records.
 * @param {string} id
 * @returns {Promise<{ ok: true }>}
 */
export function deleteKonsinyator(id) {
  return fetch(`${BASE}/konsinyator/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  }).then(handleResponse)
}
