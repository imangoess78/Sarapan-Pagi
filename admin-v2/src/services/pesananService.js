import { API_BASE } from '../utils/constants'

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

// GET /api/pesanan
export const getPesanan = () =>
  fetch(`${API_BASE}/pesanan`).then(handleResponse)

// POST /api/pesanan — body: { customer_name, wa, product_name, qty, catatan }
export const createPesanan = (body) =>
  fetch(`${API_BASE}/pesanan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse)

// PUT /api/pesanan/:id — body: { customer_name, wa, product_name, qty, catatan }
export const updatePesanan = (id, body) =>
  fetch(`${API_BASE}/pesanan/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse)

// PATCH /api/pesanan/:id/status — body: { status }
export const updateStatusPesanan = (id, status) =>
  fetch(`${API_BASE}/pesanan/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).then(handleResponse)

// DELETE /api/pesanan/:id
export const deletePesanan = (id) =>
  fetch(`${API_BASE}/pesanan/${id}`, { method: 'DELETE' }).then(handleResponse)
