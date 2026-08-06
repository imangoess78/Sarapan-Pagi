import { API_BASE } from '../utils/constants'

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

// GET /api/transaksi  — optional ?konsinyator_id=
export const getTransaksi = (konsinyatorId) => {
  const url = konsinyatorId
    ? `${API_BASE}/transaksi?konsinyator_id=${encodeURIComponent(konsinyatorId)}`
    : `${API_BASE}/transaksi`
  return fetch(url).then(handleResponse)
}

// POST /api/transaksi — body: { produk_id, qty }
export const createTransaksi = (body) =>
  fetch(`${API_BASE}/transaksi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse)

// DELETE /api/transaksi/:id  (restores stok)
export const deleteTransaksi = (id) =>
  fetch(`${API_BASE}/transaksi/${id}`, { method: 'DELETE' }).then(handleResponse)

// PATCH /api/transaksi/:konsinyatorId/paid  — mark all unpaid as paid
export const markPaid = (konsinyatorId) =>
  fetch(`${API_BASE}/transaksi/${konsinyatorId}/paid`, { method: 'PATCH' }).then(handleResponse)
