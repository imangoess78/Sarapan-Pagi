-- Lapak Jajan Sarapan Pagi Bintaro — D1 Schema
-- Run: npx wrangler d1 execute sarapan-pagi-db --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS konsinyator (
  id TEXT PRIMARY KEY,
  nama TEXT NOT NULL,
  hp TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (date('now'))
);

CREATE TABLE IF NOT EXISTS produk (
  id TEXT PRIMARY KEY,
  konsinyator_id TEXT NOT NULL,
  nama TEXT NOT NULL,
  harga INTEGER NOT NULL,
  FOREIGN KEY (konsinyator_id) REFERENCES konsinyator(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transaksi (
  id TEXT PRIMARY KEY,
  produk_id TEXT NOT NULL,
  konsinyator_id TEXT NOT NULL,
  qty INTEGER NOT NULL,
  harga INTEGER NOT NULL,
  total INTEGER NOT NULL,
  bagi_hasil INTEGER NOT NULL,
  setoran INTEGER NOT NULL,
  tanggal TEXT NOT NULL DEFAULT (date('now')),
  paid INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_transaksi_tanggal ON transaksi(tanggal);
CREATE INDEX IF NOT EXISTS idx_transaksi_konsinyator ON transaksi(konsinyator_id);
CREATE INDEX IF NOT EXISTS idx_produk_konsinyator ON produk(konsinyator_id);
