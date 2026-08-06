import { API_BASE } from '../utils/constants'

async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

// GET /api/konsinyator
export const getKonsinyator = () =>
  fetch(`${API_BASE}/konsinyator`).then(handleResponse)

// POST /api/konsinyator — body: { nama, hp }
export const createKonsinyator = (body) =>
  fetch(`${API_BASE}/konsinyator`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse)

// PUT /api/konsinyator/:id — body: { nama, hp }
export const updateKonsinyator = (id, body) =>
  fetch(`${API_BASE}/konsinyator/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(handleResponse)

// DELETE /api/konsinyator/:id  (cascades produk & transaksi)
export const deleteKonsinyator = (id) =>
  fetch(`${API_BASE}/konsinyator/${id}`, { method: 'DELETE' }).then(handleResponse)
