// Base URL for all API calls.
// In dev, Vite proxies /api → the Worker (configure in vite.config.js).
// In production, the Worker is served from the same origin.
export const API_BASE = '/api'

// Pesanan status values (matches worker exactly)
export const PESANAN_STATUS = {
  BARU: 'baru',
  PROSES: 'proses',
  SELESAI: 'selesai',
  BATAL: 'batal',
}

export const PESANAN_STATUS_LABEL = {
  baru: 'Baru',
  proses: 'Diproses',
  selesai: 'Selesai',
  batal: 'Dibatalkan',
}
