import { API_BASE } from '../utils/constants'

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

// GET /api/produk
export const getProduk = () =>
  fetch(`${API_BASE}/produk`).then(handleResponse)

// GET /api/produk/:id
export const getProdukById = (id) =>
  fetch(`${API_BASE}/produk/${id}`).then(handleResponse)

// POST /api/produk  — body: { konsinyator_id, nama, harga, stok }
export const createProduk = (body) =>
  fetch(`${API_BASE}/produk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse)

// PUT /api/produk/:id — body: { nama, harga, stok_sisa, stok_awal? }
export const updateProduk = (id, body) =>
  fetch(`${API_BASE}/produk/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse)

// DELETE /api/produk/:id
export const deleteProduk = (id) =>
  fetch(`${API_BASE}/produk/${id}`, { method: 'DELETE' }).then(handleResponse)
